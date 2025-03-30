import { Request, Response } from "express";
import * as bcrypt from "bcrypt";
import { Usuario, Role } from "../entity/Usuario";
import { AppDataSource } from "../config/ormconfig";
import { sendError, sendSuccess } from "../utils/response";
import { randomUUID } from "crypto";
import { Not } from "typeorm"; // necessário para a verificação de apelido único

export class UsuarioSettings {
  private static userRepo = AppDataSource.getRepository(Usuario);

  static updateProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.user as { id: string };
      const { nome, bio, apelido } = req.body;

      if (!nome && !bio && !apelido) {
        return sendError(res, {
          code: "missing_fields",
          message: "Pelo menos um campo (nome, bio ou apelido) deve ser fornecido",
          status: 400
        });
      }

      const user = await this.userRepo.findOneBy({ id });

      if (!user) {
        return sendError(res, {
          code: "user_not_found",
          message: "Usuário não encontrado",
          status: 404
        });
      }

      // ⚠️ Verifica se o apelido já está sendo usado por outro usuário
      if (apelido) {
        const apelidoExistente = await this.userRepo.findOne({
          where: { apelido, id: Not(user.id) }
        });

        if (apelidoExistente) {
          return sendError(res, {
            code: "apelido_in_use",
            message: "Este apelido já está em uso por outro usuário",
            status: 400
          });
        }

        user.apelido = apelido;
      }

      if (nome) user.nome = nome;
      if (bio) user.bio = bio;

      await this.userRepo.save(user);

      sendSuccess(res, { message: "Perfil atualizado com sucesso" });
    } catch (error: any) {
      sendError(res, {
        code: "profile_update_failed",
        message: "Falha ao atualizar perfil",
        status: 500,
        details: error.message
      });
    }
  };

  static updatePassword = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.user as { id: string };
      const { senhaAtual, novaSenha } = req.body;
      if (!senhaAtual || !novaSenha)
        return sendError(res, { code: "invalid_input", message: "Senha atual e nova senha são obrigatórias", status: 400 });

      const user = await this.userRepo.findOneBy({ id });
      if (!user || !bcrypt.compareSync(senhaAtual, user.senha))
        return sendError(res, { code: "invalid_credentials", message: "Senha atual incorreta", status: 401 });

      await this.userRepo.update(id, { senha: bcrypt.hashSync(novaSenha, 10) });
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

      const suffix = `${Date.now()}-${randomUUID().slice(0, 4)}`;
      user.apelido = `${user.apelido}_deleted_${suffix}`;
      user.email = `${user.email}_deleted_${suffix}`;

      await this.userRepo.save(user);
      await this.userRepo.softDelete(id);
      return sendSuccess(res, { message: "Conta deletada com sucesso" });
    } catch (error) {
      console.error("[deleteAccount] Erro:", error);
      return sendError(res, { code: "account_deletion_failed", message: "Falha ao deletar conta", status: 500 });
    }
  };
}
