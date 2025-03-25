import { Router } from "express";
import { LikeController } from "../controllers/Like.controller";
import { authenticateJWT } from "../middleware/auth";

const router = Router();

router.post("/:materialId", authenticateJWT, LikeController.toggleLike);  // Curtir ou descurtir
router.get("/:materialId", authenticateJWT, LikeController.getLikesByPost); // Obter total de curtidas

export default router;