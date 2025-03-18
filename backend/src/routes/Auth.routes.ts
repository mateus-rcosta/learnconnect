import { Router } from "express";
import { AuthController } from "../controllers/Auth.controller";

const router = Router();

// Rota de login
router.post("/login", AuthController.login);

// Se desejar, pode adicionar uma rota de cadastro (signup) aqui

export default router;