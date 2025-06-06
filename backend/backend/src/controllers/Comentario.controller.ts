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
   * Body: { conteudo }
   */
  static createComentario = async (req: Request, res: Response): Promise<void> => {
    try {
      const loggedUser = req.user as { id: string };
      const { materialId } = req.params;
      const { conteudo } = req.body;

      // 1) Verifica se o material existe
      const material = await this.materialRepo.findOneBy({ id: materialId });
      if (!material) {
        return sendError(res, {
          code: "material_not_found",
          message: "Postagem não encontrada",
          status: 404,
        });
      }

      // 2) Cria e salva
      const novoComentario = this.comentarioRepo.create({
        conteudo,
        usuario: { id: loggedUser.id },
        material: { id: materialId },
      });
      await this.comentarioRepo.save(novoComentario);

      // 3) Precisamos retornar o comentário já com o "usuario" (id, apelido, avatar)
      //    Basta fazer um findOne com relations:
      const comentarioCompleto = await this.comentarioRepo.findOne({
        where: { id: novoComentario.id },
        relations: ["usuario"],
      });

      // 4) Retorna no formato que o front espera: { data: { ... } }
      //    Se quiser, inclua um success: true
      return sendSuccess(res, { ...comentarioCompleto }, 201);
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
   * GET /api/comentario/:materialId
   * Retorna comentários da postagem
   */
  static getComentariosByPost = async (req: Request, res: Response): Promise<void> => {
    try {
      const { materialId } = req.params;
      const { page = "1", limit = "10", order = "DESC" } = req.query;

      const pageNumber = parseInt(page as string, 10) || 1;
      const limitNumber = parseInt(limit as string, 10) || 10;

      const material = await this.materialRepo.findOneBy({ id: materialId });
      if (!material) {
        return sendError(res, {
          code: "material_not_found",
          message: "Postagem não encontrada",
          status: 404,
        });
      }

      // Precisamos de com.usuario.id, com.usuario.apelido, com.usuario.avatar_url
      // Podemos usar leftJoinAndSelect:
      const qb = this.comentarioRepo
        .createQueryBuilder("com")
        .leftJoinAndSelect("com.usuario", "usuario")
        .where("com.material_id = :materialId", { materialId })
        .andWhere("com.data_deletado IS NULL")

        .orderBy("com.data_criacao", order === "ASC" ? "ASC" : "DESC")
        .skip((pageNumber - 1) * limitNumber)
        .take(limitNumber);

      const [comentarios, total] = await qb.getManyAndCount();

      // Retorna no campo "data" (para o front poder fazer setComments(json.data))
      return sendSuccess(res, {
        total,
        page: pageNumber,
        limit: limitNumber,
        data: comentarios, // <== aqui fica array de comentários
      });
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
   * Edita (somente autor)
   */
  static updateComentario = async (req: Request, res: Response): Promise<void> => {
    try {
      const loggedUser = req.user as { id: string };
      const { id } = req.params;
      const { conteudo } = req.body;

      // 1) Acha o comentário + relations: ["usuario"] para saber user.id
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
      // 2) Só autor pode editar
      if (comentario.usuario.id !== loggedUser.id) {
        return sendError(res, {
          code: "unauthorized",
          message: "Você não é o autor do comentário",
          status: 403,
        });
      }

      // 3) Atualiza conteudo
      comentario.conteudo = conteudo || comentario.conteudo;
      await this.comentarioRepo.save(comentario);

      // 4) Para retornar com a user, faça findOne again ou alias:
      const comentarioAtualizado = await this.comentarioRepo.findOne({
        where: { id },
        relations: ["usuario"],
      });

      return sendSuccess(res, {
        data: comentarioAtualizado,
      });
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
   * Somente autor
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

  // ------------------- Rotas exclusivas ADMIN ------------------- //
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
      return sendSuccess(res, {
        data: comentario, // se quiser refazer findOne c/ relations, ok
      });
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
