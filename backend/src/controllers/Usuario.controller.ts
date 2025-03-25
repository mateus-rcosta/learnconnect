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

  // Converte para dados públicos seguros
  private static toSafeUser(user: Usuario): SafeUserData {
    return {
      nome: user.nome,
      apelido: user.apelido,
      bio: user.bio,
      avatar_url: user.avatar_url,
      banner_url: user.banner_url,
    };
  }

  // Converte para dados completos para admin
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
        where: { apelido: ILike(`%${q}%`)  },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit)
      });
      sendSuccess(res, { users, total, page, limit });
    } catch (error: any) {
      sendError(res, { code: "user_search_failed", message: "Falha na busca de usuários", status: 500, details: error.message });
    }
  };

  // Busca de usuário por apelido (rota pública: /api/users/:apelido)
  static getUserByApelido = async (req: Request, res: Response): Promise<void> => {
    try {
      const { apelido } = req.params;
      console.debug("[getUserByApelido] Buscando usuário com apelido:", apelido);
      const user = await this.userRepo.findOne({ where: { apelido } });
      if (!user) {
        console.warn("[getUserByApelido] Usuário não encontrado:", apelido);
        return sendError(res, {
          code: "user_not_found",
          message: "Usuário não encontrado",
          status: 404,
        });
      }
      console.debug("[getUserByApelido] Usuário encontrado:", user.id);
      return sendSuccess(res, this.toSafeUser(user));
    } catch (error) {
      console.error("[getUserByApelido] Erro:", error);
      return sendError(res, {
        code: "user_fetch_failed",
        message: "Erro ao buscar usuário",
        status: 500,
      });
    }
  };

  // Busca de usuário por id para Admin (rota: /api/users/admin/:id)
  static getUserByApelidoForAdmin = async (req: Request, res: Response): Promise<void> => {
    try {
      const { apelido } = req.params;
      console.debug("[getUserByApelidoForAdmin] Buscando usuário com apelido:", apelido);
      const user = await this.userRepo.findOne({ where: { apelido } });
      if (!user) {
        console.warn("[getUserByApelidoForAdmin] Usuário não encontrado:", apelido);
        return sendError(res, {
          code: "user_not_found",
          message: "Usuário não encontrado",
          status: 404,
        });
      }
      console.debug("[getUserByApelidoForAdmin] Usuário encontrado:", user.apelido);
      return sendSuccess(res, this.toAdminUser(user));
    } catch (error) {
      console.error("[getUserByApelidoForAdmin] Erro:", error);
      return sendError(res, {
        code: "user_fetch_failed",
        message: "Erro ao buscar usuário",
        status: 500,
      });
    }
  };

  static updateUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = await this.userRepo.findOneBy({ id: req.params.id });
      if (!user) return sendError(res, { code: "user_not_found", message: "Usuário não encontrado", status: 404 });

      Object.assign(user, req.body);
      if (req.body.senha) user.senha = bcrypt.hashSync(req.body.senha, 10);
      const updatedUser = await this.userRepo.save(user);

      sendSuccess(res, this.toSafeUser(updatedUser));
    } catch (error: any) {
      sendError(res, { code: "user_update_failed", message: "Falha ao atualizar usuário", status: 500, details: error.message });
    }
  };

  static deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = await this.userRepo.findOneBy({ id: req.params.id });
  
      if (!user) {
        return sendError(res, {
          code: "user_not_found",
          message: "Usuário não encontrado",
          status: 404
        });
      }
  
      // Gera um sufixo único (timestamp + 4 caracteres aleatórios)
      const suffix = `${Date.now()}-${randomUUID().slice(0, 4)}`;
  
      // Modifica apelido e email antes de excluir
      user.apelido = `${user.apelido}_deleted_${suffix}`;
      user.email = `${user.email}_deleted_${suffix}`;
  
      await this.userRepo.save(user); // Salva as alterações
  
      // Agora faz o soft delete
      await this.userRepo.softDelete(user.id);
  
      sendSuccess(res, { id: user.id });
    } catch (error: any) {
      sendError(res, {
        code: "user_deletion_failed",
        message: "Falha ao excluir usuário",
        status: 500,
        details: error.message
      });
    }
  };
}
