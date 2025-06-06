import { Router } from "express";
import { AuthController } from "../controllers/Auth.controller";

const router = Router();

// Rota de login
router.post("/login", AuthController.login);

// Rota de cadastro
router.post("/cadastrar", AuthController.createUser);

export default router;