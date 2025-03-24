import { Router } from "express";
import { ComentarioController } from "../controllers/Comentario.controller"
import { authenticateJWT } from "../middleware/auth";  // Middleware de autenticação
import { authorizeAdmin } from "../middleware/Usuario.middleware";  // Middleware que valida se user.role === 'admin'

const router = Router();

/**
 * 1) POST /api/comentarios
 *    Adiciona um comentário a uma postagem
 */
router.post("/", authenticateJWT, ComentarioController.createComentario);

/**
 * 2) GET /api/comentarios/:postId
 *    Obtém os comentários de uma postagem
 */
router.get("/:postId", ComentarioController.getComentariosByPost);

/**
 * 3) PUT /api/comentarios/:id
 *    Edita um comentário (somente o autor pode editar)
 */
router.put("/:id", authenticateJWT, ComentarioController.updateComentario);

/**
 * 4) DELETE /api/comentarios/:id
 *    Remove um comentário (somente o autor pode deletar)
 */
router.delete("/:id", authenticateJWT, ComentarioController.deleteComentario);

/**
 * 5) PUT /api/comentarios/admin/:id
 *    Admin pode modificar o conteúdo do comentário
 */
router.put("/admin/:id", authenticateJWT, authorizeAdmin, ComentarioController.adminUpdateComentario);

/**
 * 6) DELETE /api/comentarios/admin/:id
 *    Admin pode excluir o comentário
 */
router.delete("/admin/:id", authenticateJWT, authorizeAdmin, ComentarioController.adminDeleteComentario);

export default router;