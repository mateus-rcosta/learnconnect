import { Request, Response } from "express";
import * as bcrypt from "bcrypt";
import { Role, Usuario } from "../entity/Usuario";
import { AppDataSource } from "../config/ormconfig";
import { sendError, sendSuccess } from "../utils/response";

// Importação do operador Not do TypeORM, se necessário em validações futuras
import { Not } from "typeorm";

export class UserController {
    // Repositório estático para reutilização
    private static userRepo = AppDataSource.getRepository(Usuario);
  
    /**
     * Valida a data de nascimento.
     * Retorna um objeto contendo a data convertida ou uma mensagem de erro, se inválida.
     */
    private static validateBirthDate(dateStr?: string): { date: Date | null; error?: string } {
      if (!dateStr) return { date: null, error: "Data de nascimento não pode ser nula." };
      const date = new Date(dateStr);
      const hoje = new Date();
      const limiteInferior = new Date("1900-01-01");
      if (date > hoje) return { date: null, error: "Data de nascimento não pode ser no futuro." };
      if (date < limiteInferior) return { date: null, error: "Data de nascimento não pode ser anterior a 01/01/1900." };
      return { date };
    }
  
    /**
     * Retorna o usuário pelo ID ou envia erro, se não encontrado.
     */
    private static async fetchUserById(id: string, res: Response): Promise<Usuario | null> {
      const user = await this.userRepo.findOneBy({ id });
      if (!user) {
        sendError(res, "Usuário não encontrado.", 404);
        return null;
      }
      return user;
    }
  
    // Verifica se o email já está em uso
    private static async isEmailExists(email: string): Promise<boolean> {
      return !!(await this.userRepo.findOneBy({ email }));
    }
  
    // Verifica se o apelido já está em uso
    private static async isApelidoExists(apelido: string): Promise<boolean> {
      return !!(await this.userRepo.findOneBy({ apelido }));
    }
  
    // Listar todos os usuários (Apenas para Admin)
    static getAllUsers = async (req: Request, res: Response): Promise<void> => {
      try {
        const users = await this.userRepo.find();
        sendSuccess(res, users);
      } catch (error) {
        sendError(res, "Erro ao buscar usuários.", 500);
      }
    };
  
    // Buscar um usuário específico por ID
    static getUserById = async (req: Request, res: Response): Promise<void> => {
      try {
        const id: string = req.params.id;
        const user = await this.fetchUserById(id, res);
        if (!user) return;
        sendSuccess(res, user);
      } catch (error) {
        sendError(res, "Erro ao buscar usuário.", 500);
      }
    };
  
    // Criação de uma nova conta
    static createUser = async (req: Request, res: Response): Promise<void> => {
      try {
        const { email, senha, nome, apelido, data_nascimento } = req.body;
  
        // Validação da data de nascimento
        const { date: nascimento, error: birthError } = this.validateBirthDate(data_nascimento);
        if (birthError) {
          sendError(res, birthError, 400);
          return;
        }
  
        // Verifica se email e apelido já existem utilizando os métodos auxiliares
        if (await this.isEmailExists(email)) {
          sendError(res, "Email já cadastrado.", 400);
          return;
        }
        if (await this.isApelidoExists(apelido)) {
          sendError(res, "Apelido já cadastrado.", 400);
          return;
        }
  
        const hashedPassword = bcrypt.hashSync(senha, 8);
        const newUser = this.userRepo.create({
          email,
          senha: hashedPassword,
          nome,
          apelido,
          data_nascimento: nascimento!, // O "!" indica que a data é válida, pois já foi validada
          role: Role.USER,
        });
  
        await this.userRepo.save(newUser);
        sendSuccess(res, { message: "Usuário criado com sucesso." }, 201);
      } catch (error) {
        sendError(res, "Erro ao criar usuário.", 500);
      }
    };
  
    // Atualização de usuário
    static updateUser = async (req: Request, res: Response): Promise<void> => {
      try {
        const id: string = req.params.id;
        const { nome, apelido, email, data_nascimento, senha } = req.body;
        let nascimento: Date | null = null;
  
        if (data_nascimento) {
          const { date, error } = this.validateBirthDate(data_nascimento);
          if (error) {
            sendError(res, error, 400);
            return;
          }
          nascimento = date;
        }
  
        const user = await this.fetchUserById(id, res);
        if (!user) return;
  
        // Atualiza email, se fornecido e único
        if (email && email !== user.email) {
          if (await this.isEmailExists(email)) {
            sendError(res, "Email já cadastrado.", 400);
            return;
          }
          user.email = email;
        }
  
        // Atualiza apelido, se fornecido e único
        if (apelido && apelido !== user.apelido) {
          if (await this.isApelidoExists(apelido)) {
            sendError(res, "Apelido já cadastrado.", 400);
            return;
          }
          user.apelido = apelido;
        }
  
        if (nome) user.nome = nome;
        if (nascimento !== null) user.data_nascimento = nascimento;
        if (senha) user.senha = bcrypt.hashSync(senha, 8);
  
        await this.userRepo.save(user);
        sendSuccess(res, { message: "Usuário atualizado com sucesso." });
      } catch (error) {
        sendError(res, "Erro ao atualizar usuário.", 500);
      }
    };
  
    // Busca de usuários por apelido com paginação
    static searchUsers = async (req: Request, res: Response): Promise<void> => {
      try {
        const query: string = req.query.q ? String(req.query.q) : "";
        const page: number = req.query.page ? Number(req.query.page) : 1;
        const limit: number = req.query.limit ? Number(req.query.limit) : 10;
        const skip: number = (page - 1) * limit;
  
        const [users, total] = await this.userRepo
          .createQueryBuilder("usuario")
          .select(["usuario.nome", "usuario.apelido"])
          .where("usuario.apelido ILIKE :query", { query: `%${query}%` })
          .andWhere("usuario.deletado = false")
          .skip(skip)
          .take(limit)
          .getManyAndCount();
  
        sendSuccess(res, { data: users, total, page, limit });
      } catch (error) {
        sendError(res, "Erro ao buscar usuários.", 500);
      }
    };
  
    // Exclusão (soft delete) da conta: somente o próprio usuário ou admin podem excluir, validando a senha
    static deleteUser = async (req: Request, res: Response): Promise<void> => {
      try {
        const id: string = req.params.id;
        const { senha } = req.body;
        const targetUser = await this.fetchUserById(id, res);
        if (!targetUser) return;
  
        const loggedUser = req.user as { id: string; role: string } | undefined;
        if (!loggedUser) {
          sendError(res, "Usuário não autenticado.", 401);
          return;
        }
  
        let userForPasswordCheck: Usuario | null = null;
        if (loggedUser.id === id) {
          userForPasswordCheck = targetUser;
        } else {
          if (loggedUser.role !== Role.ADMIN) {
            sendError(res, "Apenas administradores podem deletar contas de outros usuários.", 403);
            return;
          }
          // Busca o usuário admin para validar a senha
          userForPasswordCheck = await this.userRepo.findOneBy({ id: loggedUser.id });
          if (!userForPasswordCheck) {
            sendError(res, "Usuário administrador não encontrado.", 401);
            return;
          }
        }
  
        if (!bcrypt.compareSync(senha, userForPasswordCheck.senha)) {
          sendError(res, "Senha incorreta.", 401);
          return;
        }
  
        targetUser.deletado = true;
        targetUser.data_deletado = new Date();
        await this.userRepo.save(targetUser);
        sendSuccess(res, { message: "Conta deletada com sucesso." });
      } catch (error) {
        sendError(res, "Erro ao deletar usuário.", 500);
      }
    };
  }