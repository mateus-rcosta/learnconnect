import { Request, Response } from "express";
import * as bcrypt from "bcrypt";
import { Role, Usuario } from "../entity/Usuario";
import { AppDataSource } from "../config/ormconfig";
import { sendError, sendSuccess } from "../utils/response";

// Importação do operador Not do TypeORM, se necessário em validações futuras
import { Not } from "typeorm";

// Tipo seguro para dados públicos do usuário
type SafeUserData = {
  id: string;
  nome: string;
  apelido: string;
};

export class UserController {
  private static userRepo = AppDataSource.getRepository(Usuario);

  // Mapeia a entidade para dados seguros
  private static toSafeUser(user: Usuario): SafeUserData {
    return {
      id: user.id,
      nome: user.nome,
      apelido: user.apelido,
    };
  }

  private static validateBirthDate(dateStr?: string): { date: Date | null; error?: string } {
    console.debug("[validateBirthDate] Validando data:", dateStr?.substring(0, 10));
    if (!dateStr) return { date: null, error: "Data de nascimento obrigatória" };

    try {
      const date = new Date(dateStr);
      const hoje = new Date();
      const limiteInferior = new Date("1900-01-01");

      if (date > hoje) return { date: null, error: "Data futura não permitida" };
      if (date < limiteInferior) return { date: null, error: "Data anterior a 1900" };

      return { date };
    } catch (error) {
      console.error("[validateBirthDate] Formato inválido:", dateStr);
      return { date: null, error: "Formato de data inválido" };
    }
  }

  private static async fetchUserById(id: string): Promise<Usuario | null> {
    console.debug("[fetchUserById] Buscando usuário com id:", id);
    return await this.userRepo.findOneBy({ id });
  }

  private static async isEmailExists(email: string): Promise<boolean> {
    return !!(await this.userRepo.findOneBy({ email }));
  }

  private static async isApelidoExists(apelido: string): Promise<boolean> {
    return !!(await this.userRepo.findOneBy({ apelido }));
  }

  static getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
      console.debug("[getAllUsers] Listando usuários - nível:", req.user?.role);
      const users = await this.userRepo.find({
        select: ["id", "nome", "apelido", "data_nascimento"]
      });

      sendSuccess(res, users);
      console.info("[getAllUsers] Listagem concluída. Total:", users.length);
    } catch (error) {
      console.error("[getAllUsers] Erro crítico:", error);
      sendError(res, {
        code: "users_fetch_failed",
        message: "Falha na listagem de usuários",
        status: 500,
        details: error instanceof Error ? error.message : undefined
      });
    }
  };

  static getUserById = async (req: Request, res: Response): Promise<void> => {
    try {
      console.debug("[getUserById] Buscando usuário:", req.params.id);
      const user = await this.userRepo.findOne({
        where: { id: req.params.id },
        select: ["id", "nome", "apelido", "data_nascimento"]
      });

      if (!user) {
        console.warn("[getUserById] Usuário não encontrado:", req.params.id);
        return sendError(res, {
          code: "user_not_found",
          message: "Usuário não encontrado",
          status: 404
        });
      }

      sendSuccess(res, this.toSafeUser(user));
      console.debug("[getUserById] Retorno seguro do usuário:", user.id);
    } catch (error) {
      console.error("[getUserById] Erro na busca:", error);
      sendError(res, {
        code: "user_fetch_failed",
        message: "Falha ao recuperar usuário",
        status: 500
      });
    }
  };

  static createUser = async (req: Request, res: Response): Promise<void> => {
    try {
      console.debug("[createUser] Iniciando cadastro para:", req.body.email);

      // Validação da data de nascimento
      const { date: nascimento, error: birthError } = this.validateBirthDate(req.body.data_nascimento);
      if (birthError) {
        console.warn("[createUser] Data inválida:", birthError);
        return sendError(res, {
          code: "invalid_birthdate",
          message: birthError,
          status: 400
        });
      }

      // Verifica se o email já existe
      const emailExists = await this.userRepo.exists({ where: { email: req.body.email } });
      if (emailExists) {
        console.warn("[createUser] Email já cadastrado:", req.body.email);
        return sendError(res, {
          code: "email_exists",
          message: "Email já está em uso",
          status: 409
        });
      }

      // Verifica se o apelido já existe
      const apelidoExists = await this.userRepo.exists({ where: { apelido: req.body.apelido } });
      if (apelidoExists) {
        console.warn("[createUser] Apelido já existe:", req.body.apelido);
        return sendError(res, {
          code: "nickname_exists",
          message: "Apelido já está em uso",
          status: 409
        });
      }

      // Cria o novo usuário
      const newUser = this.userRepo.create({
        email: req.body.email,
        senha: bcrypt.hashSync(req.body.senha, 10), // Hash da senha
        nome: req.body.nome,
        apelido: req.body.apelido,
        data_nascimento: nascimento!, // Data de nascimento validada
        role: Role.USER // Define a role padrão como USER
      });

      // Salva o usuário no banco de dados
      const savedUser = await this.userRepo.save(newUser);
      console.info("[createUser] Usuário criado:", savedUser.id);

      // Retorna os dados seguros do usuário
      sendSuccess(res, this.toSafeUser(savedUser), 201);
    } catch (error) {
      console.error("[createUser] Erro no cadastro:", error);
      sendError(res, {
        code: "user_creation_failed",
        message: "Falha ao criar usuário",
        status: 500,
        details: error instanceof Error ? error.message : undefined
      });
    }
  };

  static updateUser = async (req: Request, res: Response): Promise<void> => {
    try {
      console.debug("[updateUser] Iniciando atualização para:", req.params.id);
      const user = await this.userRepo.findOne({
        where: { id: req.params.id },
        select: ["id", "email", "apelido", "data_nascimento", "senha", "nome"]
      });

      if (!user) {
        console.warn("[updateUser] Usuário não encontrado:", req.params.id);
        return sendError(res, {
          code: "user_not_found",
          message: "Usuário não encontrado",
          status: 404
        });
      }

      // Validação da data de nascimento como credencial
      const { data_nascimento } = req.body;
      if (!data_nascimento || new Date(data_nascimento) !== user.data_nascimento) {
        console.warn("[updateUser] Validação de data de nascimento falhou");
        return sendError(res, {
          code: "birthdate_required",
          message: "Data de nascimento inválida para atualização",
          status: 401
        });
      }

      // Validação de email único
      if (req.body.email && req.body.email !== user.email) {
        if (await this.userRepo.exists({ where: { email: req.body.email } })) { // Usando exists em vez de exist
          console.warn("[updateUser] Email já existe:", req.body.email);
          return sendError(res, {
            code: "email_exists",
            message: "Email já está em uso",
            status: 409
          });
        }
      }

      // Validação de apelido único
      if (req.body.apelido && req.body.apelido !== user.apelido) {
        if (await this.userRepo.exists({ where: { apelido: req.body.apelido } })) { // Usando exists em vez de exist
          console.warn("[updateUser] Apelido já existe:", req.body.apelido);
          return sendError(res, {
            code: "nickname_exists",
            message: "Apelido já está em uso",
            status: 409
          });
        }
      }

      const updatedUser = await this.userRepo.save({
        ...user,
        ...req.body,
        senha: req.body.senha ? bcrypt.hashSync(req.body.senha, 10) : user.senha
      });

      console.info("[updateUser] Usuário atualizado:", user.id);
      sendSuccess(res, this.toSafeUser(updatedUser));
    } catch (error) {
      console.error("[updateUser] Erro na atualização:", error);
      sendError(res, {
        code: "user_update_failed",
        message: "Falha ao atualizar dados",
        status: 500
      });
    }
  };

  static searchUsers = async (req: Request, res: Response): Promise<void> => {
    try {
      const { q = "", page = 1, limit = 10 } = req.query;
      const [users, total] = await this.userRepo.findAndCount({
        select: ["nome", "apelido"],
        where: { apelido: Not(`%${q}%`) },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit)
      });
      sendSuccess(res, { users, total, page, limit });
    } catch (error) {
      console.error("[searchUsers] Erro:", error);
      sendError(res, {
        code: "user_search_failed",
        message: "Falha na busca de usuários",
        status: 500,
        details: error instanceof Error ? error.message : undefined
      });
    }
  };

  static deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const targetUser = await this.fetchUserById(req.params.id);
      const loggedUser = req.user as { id: string; role: string };

      if (!targetUser) {
        sendError(res, {
          code: "user_not_found",
          message: "Usuário não encontrado",
          status: 404
        });
        return;
      }

      if (!loggedUser || (loggedUser.id !== targetUser.id && loggedUser.role !== Role.ADMIN)) {
        sendError(res, {
          code: "unauthorized",
          message: "Ação não autorizada",
          status: 403
        });
        return;
      }

      if (!bcrypt.compareSync(req.body.senha, targetUser.senha)) {
        sendError(res, {
          code: "invalid_credentials",
          message: "Credenciais inválidas",
          status: 401
        });
        return;
      }

      await this.userRepo.softDelete(targetUser.id);
      sendSuccess(res, { id: targetUser.id });
    } catch (error) {
      console.error("[deleteUser] Erro:", error);
      sendError(res, {
        code: "user_deletion_failed",
        message: "Falha ao excluir usuário",
        status: 500,
        details: error instanceof Error ? error.message : undefined
      });
    }
  };
}