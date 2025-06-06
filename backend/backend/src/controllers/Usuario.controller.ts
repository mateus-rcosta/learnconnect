import { Request, Response } from "express";
import * as bcrypt from "bcrypt";
import { Role, Usuario } from "../entity/Usuario";
import { AppDataSource } from "../config/ormconfig";
import { sendError, sendSuccess } from "../utils/response";
import { ILike, Not } from "typeorm";
import { randomUUID } from "crypto";

type SafeUserData = {
  nome: string;
  apelido: string;
  bio: string;
  avatar_url: string;
  banner_url: string;
  data_criacao: Date;
};

type AdminUserData = SafeUserData & {
  id: string;
  email: string;
  data_nascimento: Date | null;
  data_criacao: Date;
  data_atualizacao: Date;
  data_deletado: Date | null;
  role: string;
};

export class UserController {
  private static userRepo = AppDataSource.getRepository(Usuario);

  private static toSafeUser(user: Usuario): SafeUserData {
    return {
      nome: user.nome,
      apelido: user.apelido,
      bio: user.bio,
      avatar_url: user.avatar_url,
      banner_url: user.banner_url,
      data_criacao: user.data_criacao,
    };
  }

  private static toAdminUser(user: Usuario): AdminUserData {
    return {
      ...this.toSafeUser(user),
      id: user.id,
      email: user.email,
      data_nascimento: user.data_nascimento,
      data_criacao: user.data_criacao,
      data_atualizacao: user.data_atualizacao,
      data_deletado: user.data_deletado,
      role: user.role,
    };
  }

  static searchUsers = async (req: Request, res: Response): Promise<void> => {
    try {
      const { q = "", page = 1, limit = 10 } = req.query;
      const [users, total] = await this.userRepo.findAndCount({
        select: ["nome", "apelido"],
        where: { apelido: ILike(`%${q}%`) },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
      });
      sendSuccess(res, { users, total, page, limit });
    } catch (error: any) {
      sendError(res, {
        code: "user_search_failed",
        message: "Falha na busca de usuários",
        status: 500,
        details: error.message,
      });
    }
  };

  static getUserByApelido = async (req: Request, res: Response): Promise<void> => {
    try {
      const { apelido } = req.params;
      const user = await this.userRepo.findOne({ where: { apelido } });
      if (!user) {
        return sendError(res, {
          code: "user_not_found",
          message: "Usuário não encontrado",
          status: 404,
        });
      }
      return sendSuccess(res, this.toSafeUser(user));
    } catch (error) {
      return sendError(res, {
        code: "user_fetch_failed",
        message: "Erro ao buscar usuário",
        status: 500,
      });
    }
  };

  static getUserByApelidoForAdmin = async (req: Request, res: Response): Promise<void> => {
    try {
      const { apelido } = req.params;
      const user = await this.userRepo.findOne({ where: { apelido } });
      if (!user) {
        return sendError(res, {
          code: "user_not_found",
          message: "Usuário não encontrado",
          status: 404,
        });
      }
      return sendSuccess(res, this.toAdminUser(user));
    } catch (error) {
      return sendError(res, {
        code: "user_fetch_failed",
        message: "Erro ao buscar usuário",
        status: 500,
      });
    }
  };

  static getLoggedUser = async (req: Request, res: Response): Promise<void> => {
    try {
      
      const userId = req.userId;

      if (!userId) {
        return sendError(res, {
          code: "unauthorized",
          message: "Token inválido ou não enviado.",
          status: 401,
        });
      }

      const user = await this.userRepo.findOne({
        where: { id: userId },
        withDeleted: true, // ← força a busca mesmo se o TypeORM achar que foi soft-deletado
      });
      

      if (!user) {
        return sendError(res, {
          code: "user_not_found",
          message: "Usuário não encontrado.",
          status: 404,
        });
      }
      
      // ✅ Retornando email agora também
      return sendSuccess(res, {
        nome: user.nome,
        apelido: user.apelido,
        bio: user.bio,
        avatar_url: user.avatar_url,
        banner_url: user.banner_url,
        email: user.email,
        data_criacao: user.data_criacao,
      });
    } catch (error: any) {
      return sendError(res, {
        code: "user_fetch_failed",
        message: "Erro ao buscar informações do usuário.",
        status: 500,
        details: error.message,
      });
    }
  };

  static updateUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = await this.userRepo.findOneBy({ id: req.params.id });
      if (!user) {
        return sendError(res, {
          code: "user_not_found",
          message: "Usuário não encontrado",
          status: 404,
        });
      }

      Object.assign(user, req.body);
      if (req.body.senha) user.senha = bcrypt.hashSync(req.body.senha, 10);
      const updatedUser = await this.userRepo.save(user);

      sendSuccess(res, this.toSafeUser(updatedUser));
    } catch (error: any) {
      sendError(res, {
        code: "user_update_failed",
        message: "Falha ao atualizar usuário",
        status: 500,
        details: error.message,
      });
    }
  };

  static deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = await this.userRepo.findOneBy({ id: req.params.id });

      if (!user) {
        return sendError(res, {
          code: "user_not_found",
          message: "Usuário não encontrado",
          status: 404,
        });
      }

      const suffix = `${Date.now()}-${randomUUID().slice(0, 4)}`;
      user.apelido = `${user.apelido}_deleted_${suffix}`;
      user.email = `${user.email}_deleted_${suffix}`;

      await this.userRepo.save(user);
      await this.userRepo.softDelete(user.id);

      sendSuccess(res, { id: user.id });
    } catch (error: any) {
      sendError(res, {
        code: "user_deletion_failed",
        message: "Falha ao excluir usuário",
        status: 500,
        details: error.message,
      });
    }
  };
}
