import { Router } from "express";
import { ComentarioController } from "../controllers/Comentario.controller"
import { authenticateJWT } from "../middleware/auth";  // Middleware de autenticação
import { authorizeAdmin } from "../middleware/Usuario.middleware";  // Middleware que valida se user.role === 'admin'

const router = Router();

router.post("/:materialId", authenticateJWT, ComentarioController.createComentario);

router.get("/:materialId", ComentarioController.getComentariosByPost);

router.put("/:id", authenticateJWT, ComentarioController.updateComentario);

router.delete("/:id", authenticateJWT, ComentarioController.deleteComentario);

router.put("/admin/:id", authenticateJWT, authorizeAdmin, ComentarioController.adminUpdateComentario);

router.delete("/admin/:id", authenticateJWT, authorizeAdmin, ComentarioController.adminDeleteComentario);

export default router;