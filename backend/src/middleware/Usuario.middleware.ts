import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../config/ormconfig";
import { Usuario } from "../entity/Usuario";
import { sendError } from "../utils/response";

// Middleware para verificar se o usuário é admin
export const authorizeAdmin = async (req: Request, res: Response, next: NextFunction) => {
  console.debug("[authorizeAdmin] Iniciando verificação de admin");
  
  try {
    if (!req.user) {
      console.debug("[authorizeAdmin] Usuário não autenticado");
      return sendError(res, {
        code: "unauthenticated",
        message: "Autenticação necessária",
        status: 401
      });
    }

    const userRepository = AppDataSource.getRepository(Usuario);
    console.debug("[authorizeAdmin] Buscando usuário no banco:", req.user.id);
    
    const user = await userRepository.findOne({ 
      where: { id: req.user.id },
      select: ["id", "role"]
    });

    if (!user) {
      console.debug("[authorizeAdmin] Usuário não encontrado ou desativado:", req.user.id);
      return sendError(res, {
        code: "user_not_found",
        message: "Usuário não encontrado",
        status: 404
      });
    }

    if (user.role !== "admin") {
      console.debug(`[authorizeAdmin] Acesso negado para usuário ${user.id} com role ${user.role}`);
      return sendError(res, {
        code: "admin_required",
        message: "Acesso restrito a administradores",
        status: 403
      });
    }

    console.debug("[authorizeAdmin] Usuário autorizado como admin:", user.id);
    next();
  } catch (error) {
    console.error("[authorizeAdmin] Erro na verificação:", error);
    sendError(res, {
      code: "authorization_error",
      message: "Falha na verificação de permissões",
      status: 500,
      details: error instanceof Error ? error.message : undefined
    });
  }
};

// Middleware para verificar acesso ao próprio recurso ou admin
export const authorizeUser = async (req: Request, res: Response, next: NextFunction) => {
  console.debug("[authorizeUser] Iniciando verificação de acesso");
  
  try {
    const { id } = req.params;
    if (!req.user) {
      console.debug("[authorizeUser] Usuário não autenticado");
      return sendError(res, {
        code: "unauthenticated",
        message: "Autenticação necessária",
        status: 401
      });
    }

    const userRepository = AppDataSource.getRepository(Usuario);
    console.debug("[authorizeUser] Buscando usuário no banco:", req.user.id);
    
    const user = await userRepository.findOne({ 
      where: { id: req.user.id },
      select: ["id", "role"]
    });

    if (!user) {
      console.debug("[authorizeUser] Usuário não encontrado ou desativado:", req.user.id);
      return sendError(res, {
        code: "user_not_found",
        message: "Usuário não encontrado",
        status: 404
      });
    }

    if (user.role !== "admin" && user.id !== id) {
      console.debug(`[authorizeUser] Acesso negado para usuário ${user.id} ao recurso ${id}`);
      return sendError(res, {
        code: "access_denied",
        message: "Acesso não autorizado ao recurso",
        status: 403
      });
    }

    console.debug("[authorizeUser] Acesso autorizado para:", user.id);
    next();
  } catch (error) {
    console.error("[authorizeUser] Erro na verificação:", error);
    sendError(res, {
      code: "authorization_error",
      message: "Falha na verificação de permissões",
      status: 500,
      details: error instanceof Error ? error.message : undefined
    });
  }
};
