import { Request, Response } from "express";
import { Like } from "../entity/Like";
import { Material } from "../entity/Material";
import { Usuario } from "../entity/Usuario";;
import { AppDataSource } from "../config/ormconfig";
import { sendError, sendSuccess } from "../utils/response";

export class LikeController {
    private static likeRepo = AppDataSource.getRepository(Like);
    private static materialRepo = AppDataSource.getRepository(Material);
    private static usuarioRepo = AppDataSource.getRepository(Usuario);

    /**
     * POST /api/likes
     * Curte ou descurte uma postagem (material)
     */
    static toggleLike = async (req: Request, res: Response): Promise<void> => {
        try {
            // Extrai o id do usuário do req.user
            const { id: usuarioId } = req.user as { id: string };
            // Extrai o materialId dos parâmetros
            const { materialId } = req.params;

            if (!materialId || !usuarioId) {
                return sendError(res, {
                    code: "invalid_data",
                    message: "Os campos 'materialId' e 'usuarioId' são obrigatórios.",
                    status: 400,
                });
            }

            // Verifica se o material existe
            const material = await this.materialRepo.findOneBy({ id: materialId });
            if (!material) {
                return sendError(res, {
                    code: "material_not_found",
                    message: "Postagem não encontrada.",
                    status: 404,
                });
            }

            // Verifica se já existe um like deste usuário na postagem
            const existingLike = await this.likeRepo.findOne({
                where: { material: { id: materialId }, usuario: { id: usuarioId } },
            });

            if (existingLike) {
                // Se o like já existe, remove (descurtir)
                await this.likeRepo.remove(existingLike);
                return sendSuccess(res, { message: "Curtida removida com sucesso!" });
            } else {
                // Caso contrário, adiciona (curtir)
                const newLike = this.likeRepo.create({ material, usuario: { id: usuarioId } });
                await this.likeRepo.save(newLike);
                return sendSuccess(res, { message: "Curtida adicionada com sucesso!" });
            }
        } catch (error: any) {
            return sendError(res, {
                code: "like_toggle_failed",
                message: "Erro ao curtir ou descurtir a postagem.",
                status: 500,
                details: error.message,
            });
        }
    };

    /**
     * GET /api/likes/:postId
     * Obtém o total de curtidas de uma postagem (material)
     */
    static getLikesByPost = async (req: Request, res: Response): Promise<void> => {
        try {
            const { materialId } = req.params;

            if (!materialId) {
                return sendError(res, {
                    code: "invalid_data",
                    message: "O parâmetro 'postId' é obrigatório.",
                    status: 400,
                });
            }

            // Verifica se o material existe
            const material = await this.materialRepo.findOneBy({ id: materialId });
            if (!material) {
                return sendError(res, {
                    code: "material_not_found",
                    message: "Postagem não encontrada.",
                    status: 404,
                });
            }

            // Conta o número de curtidas
            const totalLikes = await this.likeRepo.count({
                where: { material: { id: materialId } },
            });

            return sendSuccess(res, { totalLikes });
        } catch (error: any) {
            return sendError(res, {
                code: "likes_fetch_failed",
                message: "Erro ao obter o número de curtidas.",
                status: 500,
                details: error.message,
            });
        }
    };
}