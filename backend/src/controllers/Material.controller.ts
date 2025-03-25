import { Request, Response } from "express";
import { AppDataSource } from "../config/ormconfig";
import { Material } from "../entity/Material";
import { sendError, sendSuccess } from "../utils/response";

export class MaterialController {
  private static materialRepo = AppDataSource.getRepository(Material);

  /**
   * GET /api/materiais
   * Obtém todos os materiais paginados e permite busca por título, flag e categoria
   */
  static getAllMateriais = async (req: Request, res: Response): Promise<void> => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const skip = (page - 1) * limit;
      const { q, flag, categoria } = req.query;
      const queryBuilder = this.materialRepo.createQueryBuilder("mat")
        .leftJoin("mat.usuario", "usuario")
        .select([
          "mat.id",
          "mat.titulo",
          "mat.descricao",
          "mat.categoria",
          "mat.flag",
          "mat.data_criacao",
          "usuario.nome",
          "usuario.apelido"
        ])
        .orderBy("mat.data_criacao", "DESC")
        .skip(skip)
        .take(limit);
        
      if (q) queryBuilder.andWhere("mat.titulo ILIKE :q", { q: `%${q}%` });
      if (flag) queryBuilder.andWhere("mat.flag = :flag", { flag });
      if (categoria) queryBuilder.andWhere("mat.categoria = :categoria", { categoria });
  
      const [materiais, total] = await queryBuilder.getManyAndCount();
  
      return sendSuccess(res, { data: materiais, total, page, limit });
    } catch (error: any) {
      return sendError(res, {
        code: "materiais_fetch_failed",
        message: "Erro ao buscar materiais",
        status: 500,
        details: error.message,
      });
    }
  };

  /**
   * POST /api/materiais
   * Cria um novo material
   */
  static createMaterial = async (req: Request, res: Response): Promise<void> => {
    try {
      const loggedUser = req.user as { id: string };
      const { titulo, descricao, categoria, conteudo, thumbnail_url } = req.body;

      const novoMaterial = this.materialRepo.create({
        titulo,
        descricao,
        categoria,
        conteudo,
        thumbnail_url,
        usuario: { id: loggedUser.id },
      });

      const salvo = await this.materialRepo.save(novoMaterial);
      return sendSuccess(res, {"id":salvo.id}, 201);
    } catch (error: any) {
      return sendError(res, {
        code: "material_creation_failed",
        message: "Erro ao criar material",
        status: 500,
        details: error.message,
      });
    }
  };

  /**
   * GET /api/material/:id
   * Obtém detalhes de um material específico
   */
  static getMaterialById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
  
      const material = await this.materialRepo
        .createQueryBuilder("mat")
        .leftJoinAndSelect("mat.usuario", "usuario")
        .select([
          "mat.id",
          "mat.titulo",
          "mat.descricao",
          "mat.categoria",
          "mat.conteudo",
          "mat.flag",
          "mat.thumbnail_url",
          "mat.data_aprovacao",
          "mat.data_criacao",
          "mat.data_atualizacao"
        ])
        .addSelect(["usuario.nome", "usuario.apelido"])
        .where("mat.id = :id", { id })
        .getOne();
  
      if (!material) {
        return sendError(res, {
          code: "material_not_found",
          message: "Material não encontrado",
          status: 404,
        });
      }
  
      return sendSuccess(res, material);
    } catch (error: any) {
      return sendError(res, {
        code: "material_fetch_failed",
        message: "Erro ao buscar material",
        status: 500,
        details: error.message,
      });
    }
  };

  /**
   * PUT /api/material/:id
   * Edita um material (somente o autor pode editar)
   */
  static updateMaterial = async (req: Request, res: Response): Promise<void> => {
    try {
      const loggedUser = req.user as { id: string };
      const { id } = req.params;
      const { titulo, descricao, categoria, conteudo, flag, thumbnail_url } = req.body;

      const material = await this.materialRepo.findOne({ where: { id }, relations: ["usuario"] });

      if (!material) return sendError(res, { code: "material_not_found", message: "Material não encontrado", status: 404 });
      if (material.usuario.id !== loggedUser.id) return sendError(res, { code: "unauthorized", message: "Você não é o autor do material", status: 403 });

      Object.assign(material, { titulo, descricao, categoria, conteudo, flag, thumbnail_url });
      await this.materialRepo.save(material);

      return sendSuccess(res, { message: "Material atualizado com sucesso" });
    } catch (error: any) {
      return sendError(res, {
        code: "material_update_failed",
        message: "Erro ao atualizar material",
        status: 500,
        details: error.message,
      });
    }
  };

  /**
   * DELETE /api/material/:id
   * Deleta um material (somente o autor pode deletar)
   */
  static deleteMaterial = async (req: Request, res: Response): Promise<void> => {
    try {
      const loggedUser = req.user as { id: string };
      const { id } = req.params;

      const material = await this.materialRepo.findOne({ where: { id }, relations: ["usuario"] });

      if (!material) return sendError(res, { code: "material_not_found", message: "Material não encontrado", status: 404 });
      if (material.usuario.id !== loggedUser.id) return sendError(res, { code: "unauthorized", message: "Você não é o autor do material", status: 403 });

      await this.materialRepo.softDelete(id);
      return sendSuccess(res, { message: "Material deletado com sucesso" });
    } catch (error: any) {
      return sendError(res, {
        code: "material_deletion_failed",
        message: "Erro ao deletar material",
        status: 500,
        details: error.message,
      });
    }
  };

  /**
   * GET /api/material/:id/anexos
   * Obtém os anexos de um material
   */
  static getAnexos = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      // Verifica se o material existe
      const material = await this.materialRepo.findOneBy({ id });
      if (!material) {
        return sendError(res, {
          code: "material_not_found",
          message: "Material não encontrado",
          status: 404,
        });
      }

      // Busca anexos relacionados
      const anexos = await AppDataSource.getRepository("AnexoMaterial").find({
        where: { material: { id } },
      });

      return sendSuccess(res, anexos);
    } catch (error: any) {
      return sendError(res, {
        code: "attachments_fetch_failed",
        message: "Erro ao buscar anexos",
        status: 500,
        details: error.message,
      });
    }
  };

  /**
   * Rota exclusiva para Admin:
   * PUT /api/material/admin/:id
   * - Admin pode editar titulo (descricao), tags, texto (conteudo), categoria e thumbnail_url
   * DELETE /api/material/admin/:id
   * - Admin pode deletar o material
   */
  static adminUpdateMaterial = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { descricao, conteudo, categoria, thumbnail_url } = req.body;

      const material = await this.materialRepo.findOneBy({ id });
      if (!material) {
        return sendError(res, {
          code: "material_not_found",
          message: "Material não encontrado",
          status: 404,
        });
      }

      // Admin pode alterar livremente
      material.descricao = descricao ?? material.descricao;
      material.conteudo = conteudo ?? material.conteudo;
      material.categoria = categoria ?? material.categoria;
      material.thumbnail_url = thumbnail_url ?? material.thumbnail_url;

      const atualizado = await this.materialRepo.save(material);
      return sendSuccess(res, atualizado);
    } catch (error: any) {
      return sendError(res, {
        code: "material_admin_update_failed",
        message: "Erro ao atualizar material (admin)",
        status: 500,
        details: error.message,
      });
    }
  };

  static adminDeleteMaterial = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const material = await this.materialRepo.findOneBy({ id });
      if (!material) {
        return sendError(res, {
          code: "material_not_found",
          message: "Material não encontrado",
          status: 404,
        });
      }

      await this.materialRepo.softDelete(id);
      return sendSuccess(res, { message: "Material deletado pelo admin com sucesso" });
    } catch (error: any) {
      return sendError(res, {
        code: "material_admin_deletion_failed",
        message: "Erro ao deletar material (admin)",
        status: 500,
        details: error.message,
      });
    }
  };
}