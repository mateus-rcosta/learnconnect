import { Router } from "express";
import { CategoriaController } from "../controllers/Categoria.controller";
import { authorizeAdmin } from "../middleware/Usuario.middleware";
import { authenticateJWT } from "../middleware/auth";

const router = Router();

router.post("/", authenticateJWT, authorizeAdmin, CategoriaController.addCategoria);

router.put("/:id", authenticateJWT, authorizeAdmin, CategoriaController.updateCategoria);

router.get("/", authenticateJWT, CategoriaController.getCategorias);

export default router;