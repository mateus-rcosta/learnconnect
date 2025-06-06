import { Router } from "express";
import { UserController } from "../controllers/Usuario.controller";
import { authenticateJWT } from "../middleware/auth";
import { authorizeAdmin, authorizeUser } from "../middleware/Usuario.middleware";

const router = Router();

router.get("/me", authenticateJWT, UserController.getLoggedUser);

// Busca de usuários por apelido (requer autenticação)
router.get("/search", authenticateJWT, UserController.searchUsers);

// Buscar um usuário específico
router.get("/:apelido", authenticateJWT, authorizeUser, UserController.getUserByApelido);

// Buscar um usuário específico como admin (Pode ser somente Admin)
router.get("/admin/:apelido", authenticateJWT, authorizeAdmin, UserController.getUserByApelidoForAdmin);

// Atualizar um usuário (Apenas o próprio Admin)
router.put("/admin/:id", authenticateJWT, authorizeAdmin, UserController.updateUser);

// Rota para exclusão de conta (Apenas o próprio Admin)
router.delete("/admin/:id", authenticateJWT, authorizeAdmin, UserController.deleteUser);

// Rota para puxar informações da conta atuais após efetuar Login



export default router;