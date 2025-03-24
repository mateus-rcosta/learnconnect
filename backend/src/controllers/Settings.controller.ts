import { Request, Response } from "express";
import * as bcrypt from "bcrypt";
import { Usuario, Role } from "../entity/Usuario";
import { AppDataSource } from "../config/ormconfig";
import { sendError, sendSuccess } from "../utils/response";

export class UsuarioSettings {
  private static userRepo = AppDataSource.getRepository(Usuario);

  static updateProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.user as { id: string };
      const { nome, bio } = req.body;
      if (!nome && !bio) return sendError(res, { code: "invalid_input", message: "Nenhum dado para atualizar", status: 400 });

      await this.userRepo.update(id, { nome, bio });
      return sendSuccess(res, { message: "Perfil atualizado com sucesso" });
    } catch (error) {
      console.error("[updateProfile] Erro:", error);
      return sendError(res, { code: "profile_update_failed", message: "Falha ao atualizar perfil", status: 500 });
    }
  };

  static updatePassword = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.user as { id: string };
      const { currentPassword, newPassword } = req.body;
      if (!currentPassword || !newPassword) 
        return sendError(res, { code: "invalid_input", message: "Senha atual e nova senha são obrigatórias", status: 400 });

      const user = await this.userRepo.findOneBy({ id });
      if (!user || !bcrypt.compareSync(currentPassword, user.senha)) 
        return sendError(res, { code: "invalid_credentials", message: "Senha atual incorreta", status: 401 });

      await this.userRepo.update(id, { senha: bcrypt.hashSync(newPassword, 10) });
      return sendSuccess(res, { message: "Senha atualizada com sucesso" });
    } catch (error) {
      console.error("[updatePassword] Erro:", error);
      return sendError(res, { code: "password_update_failed", message: "Falha ao atualizar senha", status: 500 });
    }
  };

  static updateAvatar = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.user as { id: string };
      const { avatar_url } = req.body;
      if (!avatar_url) return sendError(res, { code: "invalid_input", message: "Avatar URL é obrigatório", status: 400 });

      await this.userRepo.update(id, { avatar_url });
      return sendSuccess(res, { message: "Avatar atualizado com sucesso" });
    } catch (error) {
      console.error("[updateAvatar] Erro:", error);
      return sendError(res, { code: "avatar_update_failed", message: "Falha ao atualizar avatar", status: 500 });
    }
  };

  static updateBanner = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.user as { id: string };
      const { banner_url } = req.body;
      if (!banner_url) return sendError(res, { code: "invalid_input", message: "Banner URL é obrigatório", status: 400 });

      await this.userRepo.update(id, { banner_url });
      return sendSuccess(res, { message: "Banner atualizado com sucesso" });
    } catch (error) {
      console.error("[updateBanner] Erro:", error);
      return sendError(res, { code: "banner_update_failed", message: "Falha ao atualizar banner", status: 500 });
    }
  };

  static deleteAccount = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.user as { id: string };
      const { senha } = req.body;
      if (!senha) return sendError(res, { code: "invalid_input", message: "Senha é obrigatória para exclusão", status: 400 });

      const user = await this.userRepo.findOneBy({ id });
      if (!user || !bcrypt.compareSync(senha, user.senha)) 
        return sendError(res, { code: "invalid_credentials", message: "Senha incorreta", status: 401 });

      await this.userRepo.softDelete(id);
      return sendSuccess(res, { message: "Conta deletada com sucesso" });
    } catch (error) {
      console.error("[deleteAccount] Erro:", error);
      return sendError(res, { code: "account_deletion_failed", message: "Falha ao deletar conta", status: 500 });
    }
  };
}