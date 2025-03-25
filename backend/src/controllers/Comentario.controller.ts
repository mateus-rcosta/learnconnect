import { Request, Response } from "express";
import { AppDataSource } from "../config/ormconfig";
import { Comentario } from "../entity/Comentario";
import { Material } from "../entity/Material";
import { sendError, sendSuccess } from "../utils/response";

export class ComentarioController {
    private static comentarioRepo = AppDataSource.getRepository(Comentario);
    private static materialRepo = AppDataSource.getRepository(Material);

    /**
     * POST /api/comentario/:materialId
     * Adiciona um comentário a uma postagem (material)
     * Body esperado: { materialId, conteudo }
     */
    static createComentario = async (req: Request, res: Response): Promise<void> => {
        try {
            const loggedUser = req.user as { id: string };
            const { materialId } = req.params;
            const { conteudo } = req.body;

            // Verifica se o material existe
            const material = await this.materialRepo.findOneBy({ id: materialId });
            if (!material) {
                return sendError(res, {
                    code: "material_not_found",
                    message: "Postagem não encontrada",
                    status: 404,
                });
            }

            // Cria o comentário
            const novoComentario = this.comentarioRepo.create({
                conteudo,
                usuario: { id: loggedUser.id },
                material: { id: materialId },
            });

            await this.comentarioRepo.save(novoComentario);
            return sendSuccess(res, { message: "Comentário criado com sucesso" }, 201);
        } catch (error: any) {
            return sendError(res, {
                code: "comentario_creation_failed",
                message: "Erro ao criar comentário",
                status: 500,
                details: error.message,
            });
        }
    };

    /**
     * GET /api/comentario/:postId
     * Obtém os comentários de uma postagem (material)
     */
    static getComentariosByPost = async (req: Request, res: Response): Promise<void> => {
        try {
            const { materialId } = req.params;
            const { page = "1", limit = "10", order = "DESC" } = req.query;

            if (!materialId || typeof materialId !== "string") {
                return sendError(res, {
                    code: "invalid_query",
                    message: "O parâmetro 'materialId' é obrigatório e deve ser uma string válida.",
                    status: 400,
                });
            }

            const pageNumber = parseInt(page as string, 10);
            const limitNumber = parseInt(limit as string, 10);
            if (isNaN(pageNumber) || isNaN(limitNumber) || pageNumber < 1 || limitNumber < 1) {
                return sendError(res, {
                    code: "invalid_pagination",
                    message: "Os parâmetros 'page' e 'limit' devem ser números válidos e maiores que zero.",
                    status: 400,
                });
            }

            // Verifica se o material (postagem) existe
            const material = await this.materialRepo.findOneBy({ id: materialId });
            if (!material) {
                return sendError(res, {
                    code: "material_not_found",
                    message: "Postagem não encontrada",
                    status: 404,
                });
            }

            // Construção da query com os campos desejados, incluindo o ID do comentário
            const [comentarios, total] = await this.comentarioRepo
                .createQueryBuilder("com")
                .leftJoin("com.usuario", "usuario")
                .select([
                    "com.id", // Incluído para evitar o erro com distinctAlias.com_id
                    "com.conteudo",
                    "com.data_criacao",
                    "com.data_atualizacao",
                    "usuario.nome",
                    "usuario.apelido",
                ])
                .where("com.material = :id", { id: materialId })
                .orderBy("com.data_criacao", order === "ASC" ? "ASC" : "DESC")
                .skip((pageNumber - 1) * limitNumber)
                .take(limitNumber)
                .getManyAndCount();

            return sendSuccess(res, { total, page: pageNumber, limit: limitNumber, comentarios });
        } catch (error: any) {
            return sendError(res, {
                code: "comentarios_fetch_failed",
                message: "Erro ao buscar comentários",
                status: 500,
                details: error.message,
            });
        }
    };

    /**
     * PUT /api/comentario/:id
     * Edita um comentário (somente o autor pode editar)
     */
    static updateComentario = async (req: Request, res: Response): Promise<void> => {
        try {
            const loggedUser = req.user as { id: string };
            const { id } = req.params;
            const { conteudo } = req.body;

            const comentario = await this.comentarioRepo.findOne({
                where: { id },
                relations: ["usuario"],
            });

            if (!comentario) {
                return sendError(res, {
                    code: "comentario_not_found",
                    message: "Comentário não encontrado",
                    status: 404,
                });
            }

            // Verifica se o usuário logado é o autor do comentário
            if (comentario.usuario.id !== loggedUser.id) {
                return sendError(res, {
                    code: "unauthorized",
                    message: "Você não é o autor do comentário",
                    status: 403,
                });
            }

            comentario.conteudo = conteudo ?? comentario.conteudo;
            await this.comentarioRepo.save(comentario);
            return sendSuccess(res, { message: "Comentário atualizado com sucesso" });
        } catch (error: any) {
            return sendError(res, {
                code: "comentario_update_failed",
                message: "Erro ao atualizar comentário",
                status: 500,
                details: error.message,
            });
        }
    };

    /**
     * DELETE /api/comentario/:id
     * Remove um comentário (somente o autor pode deletar)
     */
    static deleteComentario = async (req: Request, res: Response): Promise<void> => {
        try {
            const loggedUser = req.user as { id: string };
            const { id } = req.params;

            const comentario = await this.comentarioRepo.findOne({
                where: { id },
                relations: ["usuario"],
            });

            if (!comentario) {
                return sendError(res, {
                    code: "comentario_not_found",
                    message: "Comentário não encontrado",
                    status: 404,
                });
            }

            if (comentario.usuario.id !== loggedUser.id) {
                return sendError(res, {
                    code: "unauthorized",
                    message: "Você não é o autor do comentário",
                    status: 403,
                });
            }

            await this.comentarioRepo.softDelete(id);
            return sendSuccess(res, { message: "Comentário removido com sucesso" });
        } catch (error: any) {
            return sendError(res, {
                code: "comentario_deletion_failed",
                message: "Erro ao deletar comentário",
                status: 500,
                details: error.message,
            });
        }
    };

    /**
     * Rotas exclusivas para Admin:
     * PUT /api/comentario/admin/:id - Admin pode modificar o conteúdo do comentário
     * DELETE /api/comentario/admin/:id - Admin pode excluir o comentário
     */
    static adminUpdateComentario = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const { conteudo } = req.body;

            const comentario = await this.comentarioRepo.findOneBy({ id });
            if (!comentario) {
                return sendError(res, {
                    code: "comentario_not_found",
                    message: "Comentário não encontrado",
                    status: 404,
                });
            }

            comentario.conteudo = conteudo ?? comentario.conteudo;
            await this.comentarioRepo.save(comentario);
            return sendSuccess(res, { message: "Comentário atualizado com sucesso pelo admin" });
        } catch (error: any) {
            return sendError(res, {
                code: "comentario_admin_update_failed",
                message: "Erro ao atualizar comentário (admin)",
                status: 500,
                details: error.message,
            });
        }
    };

    static adminDeleteComentario = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const comentario = await this.comentarioRepo.findOneBy({ id });
            if (!comentario) {
                return sendError(res, {
                    code: "comentario_not_found",
                    message: "Comentário não encontrado",
                    status: 404,
                });
            }

            await this.comentarioRepo.softDelete(id);
            return sendSuccess(res, { message: "Comentário removido pelo admin com sucesso" });
        } catch (error: any) {
            return sendError(res, {
                code: "comentario_admin_deletion_failed",
                message: "Erro ao deletar comentário (admin)",
                status: 500,
                details: error.message,
            });
        }
    };
}