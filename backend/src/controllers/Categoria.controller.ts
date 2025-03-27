import { Request, Response } from "express";
import { AppDataSource } from "../config/ormconfig";
import { Categoria } from "../entity/Categoria";
import { sendError, sendSuccess } from "../utils/response";

export class CategoriaController {
    private static categoriaRepo = AppDataSource.getRepository(Categoria);

    // Adicionar nova categoria
    static addCategoria = async (req: Request, res: Response): Promise<void> => {
        try {
            const { nome, descricao } = req.body;

            if (!nome || typeof nome !== "string") {
                return sendError(res, {
                    code: "invalid_data",
                    message: "O campo 'nome' é obrigatório e deve ser uma string.",
                    status: 400,
                });
            }

            // Verifica se a categoria já existe
            const categoriaExistente = await this.categoriaRepo.findOne({ where: { nome } });
            if (categoriaExistente) {
                return sendError(res, {
                    code: "categoria_already_exists",
                    message: "Já existe uma categoria com esse nome.",
                    status: 400,
                });
            }

            const novaCategoria = this.categoriaRepo.create({ nome, descricao });
            await this.categoriaRepo.save(novaCategoria);

            return sendSuccess(res, { message: "Categoria adicionada com sucesso!", categoria: novaCategoria });
        } catch (error: any) {
            return sendError(res, {
                code: "categoria_add_failed",
                message: "Erro ao adicionar categoria.",
                status: 500,
                details: error.message,
            });
        }
    };

    // Atualizar nome e/ou descrição de uma categoria
    static updateCategoria = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const { nome, descricao } = req.body;

            const categoria = await this.categoriaRepo.findOneBy({ id });

            if (!categoria) {
                return sendError(res, {
                    code: "categoria_not_found",
                    message: "Categoria não encontrada.",
                    status: 404,
                });
            }

            if (nome && typeof nome === "string") {
                categoria.nome = nome;
            }

            if (descricao && typeof descricao === "string") {
                categoria.descricao = descricao;
            }

            await this.categoriaRepo.save(categoria);

            return sendSuccess(res, { message: "Categoria atualizada com sucesso!", categoria });
        } catch (error: any) {
            return sendError(res, {
                code: "categoria_update_failed",
                message: "Erro ao atualizar categoria.",
                status: 500,
                details: error.message,
            });
        }
    };

    static async getCategorias(req: Request, res: Response): Promise<void> {
        try {
            // Aguarde a inicialização do AppDataSource, se necessário
            if (!AppDataSource.isInitialized) {
                await AppDataSource.initialize();
            }
    
            const { q = "", page = "1", limit = "10" } = req.query;
            const pageNumber = parseInt(page as string, 10);
            const limitNumber = parseInt(limit as string, 10);
    
            if (isNaN(pageNumber) || isNaN(limitNumber) || pageNumber < 1 || limitNumber < 1) {
                return sendError(res, {
                    code: "invalid_pagination",
                    message: "Os parâmetros 'page' e 'limit' devem ser números válidos e maiores que zero.",
                    status: 400,
                });
            }
    
            // Garantir que o repositório seja acessado corretamente
            const categoriaRepo = AppDataSource.getRepository(Categoria);
    
            const [categorias, total] = await categoriaRepo
                .createQueryBuilder("categoria")
                .where("LOWER(categoria.nome) LIKE LOWER(:q)", { q: `%${q}%` })
                .orderBy("categoria.nome", "ASC")
                .skip((pageNumber - 1) * limitNumber)
                .take(limitNumber)
                .getManyAndCount();
    
            return sendSuccess(res, { total, page: pageNumber, limit: limitNumber, categorias });
        } catch (error: any) {
            return sendError(res, {
                code: "categoria_fetch_failed",
                message: "Erro ao buscar categorias.",
                status: 500,
                details: error.message,
            });
        }
    };

}