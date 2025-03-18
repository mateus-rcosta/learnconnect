import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../config/ormconfig";
import { Usuario } from "../entity/Usuario";
import { sendError } from "../utils/response";

// Middleware para verificar se o usuário é admin
export const authorizeAdmin = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || req.user.role !== "admin") {
        res.status(403).json({ message: "Acesso negado. Somente administradores podem realizar essa ação." });
    }

    try {
        const userRepository = AppDataSource.getRepository(Usuario);
        const user = await userRepository.findOneBy({ id: req.user?.id });

        if (!user || user.deletado) {
            sendError(res, "Usuário não encontrado ou desativado.", 404);
        }

        if (user!.role !== "admin") {
            sendError(res, "Acesso negado. Somente administradores podem realizar essa ação.", 403);
        }

        next();
    } catch (error) {
        sendError(res, "Erro ao verificar permissões.", 500);
    }
    next();
};

// Middleware para verificar se o usuário está acessando seus próprios dados ou é admin
export const authorizeUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;

    if (!req.user || (req.user.role !== "admin" && req.user.id !== id)) {
        res.status(403).json({ message: "Acesso negado. Você não tem permissão para realizar esta ação." });
    }

    try {
        const userRepository = AppDataSource.getRepository(Usuario);
        // Consulta o usuário logado (informação atualizada do banco)
        const user = await userRepository.findOneBy({ id: req.user?.id });

        if (!user || user.deletado) {
            sendError(res, "Usuário não encontrado ou desativado.", 404);
        }

        // Permite se o usuário for admin ou se o id na URL for o mesmo do usuário logado
        if (user!.role !== "admin" && user!.id !== id) {
            sendError(res, "Acesso negado. Você não tem permissão para realizar esta ação.", 403);
        }

        next();
    } catch (error) {
        sendError(res, "Erro ao verificar permissões.", 500);
    }
    next();
};