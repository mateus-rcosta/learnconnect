import { Request, Response } from "express";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Usuario } from "../entity/Usuario";
import { AppDataSource } from "../config/ormconfig";
import "dotenv/config";
import { sendError, sendSuccess } from "../utils/response";

export class AuthController {
  private static userRepo = AppDataSource.getRepository(Usuario);

  // Login: autentica usuário e gera um token JWT
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
          status: 500,
        });
      }

      const user = await this.userRepo.findOne({
        where: { email },
        select: ["id", "senha", "role"],
      });

      if (!user) {
        console.debug("[AuthController] Usuário não encontrado:", email);
        return sendError(res, {
          code: "invalid_credentials",
          message: "Credenciais inválidas",
          status: 401,
        });
      }

      const isPasswordValid = bcrypt.compareSync(senha, user.senha);
      if (!isPasswordValid) {
        console.debug("[AuthController] Senha inválida para:", email);
        return sendError(res, {
          code: "invalid_credentials",
          message: "Credenciais inválidas",
          status: 401,
        });
      }

      const tokenPayload = { id: user.id, role: user.role };
      console.debug("[AuthController] Gerando token JWT para:", user.id);
      const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: "8h" });
      console.debug("[AuthController] Login bem-sucedido para:", user.id);
      return sendSuccess(res, { token });
    } catch (error: any) {
      console.error("[AuthController] Erro no login:", error);
      return sendError(res, {
        code: "login_failed",
        message: "Falha no processo de login",
        status: 500,
        details: error.message,
      });
    }
  };

  // Criação de usuário: cadastra um novo usuário e retorna um token JWT
  static createUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, senha, nome, apelido, data_nascimento } = req.body;
      console.debug("[AuthController] Iniciando cadastro para:", email);

      if (await this.userRepo.findOneBy({ email })) {
        console.warn("[AuthController] Email já cadastrado:", email);
        return sendError(res, {
          code: "email_exists",
          message: "Email já está em uso",
          status: 409,
        });
      }

      if (await this.userRepo.findOneBy({ apelido })) {
        console.warn("[AuthController] Apelido já cadastrado:", apelido);
        return sendError(res, {
          code: "nickname_exists",
          message: "Apelido já está em uso",
          status: 409,
        });
      }

      const hashedPassword = bcrypt.hashSync(senha, 10);
      const newUser = this.userRepo.create({
        email,
        senha: hashedPassword,
        nome,
        apelido,
        data_nascimento,
      });
      const savedUser = await this.userRepo.save(newUser);
      console.info("[AuthController] Usuário criado:", savedUser.id);

      if (!process.env.JWT_SECRET) {
        console.error("[AuthController] JWT_SECRET não configurado");
        return sendError(res, {
          code: "server_error",
          message: "Configuração do servidor incompleta",
          status: 500,
        });
      }

      console.debug("[AuthController] Gerando token JWT para:", savedUser.id);
      const tokenPayload = { id: savedUser.id, role: savedUser.role };
      const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: "8h" });
      return sendSuccess(res, { token }, 201);
    } catch (error: any) {
      console.error("[AuthController] Erro no cadastro:", error);
      return sendError(res, {
        code: "user_creation_failed",
        message: "Falha ao criar usuário",
        status: 500,
        details: error.message,
      });
    }
  };
}