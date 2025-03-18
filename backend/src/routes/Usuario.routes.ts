import { Router } from "express";
import { UserController } from "../controllers/Usuario.controller";
import { authenticateJWT } from "../middleware/auth";
import { authorizeAdmin, authorizeUser } from "../middleware/Usuario.middleware";

const router = Router();

// Listar todos os usuários (Somente Admin)
router.get("/", authenticateJWT, authorizeAdmin, UserController.getAllUsers);

// Criação de conta (rota pública)
router.post("/", UserController.createUser);

// Busca de usuários por apelido (requer autenticação)
router.get("/search", authenticateJWT, UserController.searchUsers);

// Buscar um usuário específico (Pode ser somente Admin)
router.get("/:id", authenticateJWT, authorizeAdmin, UserController.getUserById);

// Atualizar um usuário (Apenas o próprio usuário ou Admin)
router.put("/:id", authenticateJWT, authorizeUser, UserController.updateUser);

// Rota para exclusão de conta (soft delete)
router.delete("/:id", authenticateJWT, authorizeUser, UserController.deleteUser);

export default router;