import { Router } from "express";
import { UsuarioSettings } from "../controllers/Settings.controller";
import { authenticateJWT } from "../middleware/auth";
import { authorizeUser } from "../middleware/Usuario.middleware";

const router = Router();

// Atualiza perfil (ex: nome, bio, etc.)
router.put("/atualiza-perfil", authenticateJWT, authorizeUser, UsuarioSettings.updateProfile);

// Atualiza senha
router.put("/atualiza-senha", authenticateJWT, authorizeUser, UsuarioSettings.updatePassword);

// Atualiza avatar
router.put("/atualiza-avatar", authenticateJWT, authorizeUser, UsuarioSettings.updateAvatar);

// Atualiza banner
router.put("/atualiza-banner", authenticateJWT, authorizeUser, UsuarioSettings.updateBanner);

// Deleta conta
router.delete("/deleta-conta", authenticateJWT, authorizeUser, UsuarioSettings.deleteAccount);

export default router;