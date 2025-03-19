import { Request, Response } from "express";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Usuario } from "../entity/Usuario";
import { AppDataSource } from "../config/ormconfig";
import "dotenv/config";
import { sendError, sendSuccess } from "../utils/response";

export class AuthController {
  static login = async (req: Request, res: Response): Promise<void> => {
    console.debug("[AuthController] Iniciando processo de login");
    
    try {
      const { email, senha } = req.body;
      console.debug("[AuthController] Tentativa de login para:", email);

      if (!process.env.JWT_SECRET) {
        console.error("[AuthController] JWT_SECRET não configurado");
        return sendError(res, {
          code: "server_error",
          message: "Configuração do servidor incompleta",
          status: 500
        });
      }

      const userRepository = AppDataSource.getRepository(Usuario);
      const user = await userRepository.findOne({
        where: { email },
        select: ["id", "senha", "role"]
      });

      if (!user) {
        console.debug("[AuthController] Usuário não encontrado ou desativado:", email);
        return sendError(res, {
          code: "invalid_credentials",
          message: "Credenciais inválidas",
          status: 401
        });
      }

      console.debug("[AuthController] Verificando senha");
      const isPasswordValid = bcrypt.compareSync(senha, user.senha);
      
      if (!isPasswordValid) {
        console.debug("[AuthController] Senha inválida para:", email);
        return sendError(res, {
          code: "invalid_credentials",
          message: "Credenciais inválidas",
          status: 401
        });
      }

      console.debug("[AuthController] Gerando token JWT para:", user.id);
      const tokenPayload = { id: user.id, role: user.role };
      const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: "8h" });

      console.debug("[AuthController] Login bem-sucedido para:", user.id);
      sendSuccess(res, { token });
    } catch (error) {
      console.error("[AuthController] Erro no login:", error);
      sendError(res, {
        code: "login_failed",
        message: "Falha no processo de login",
        status: 500,
        details: error instanceof Error ? error.message : undefined
      });
    }
  };
}