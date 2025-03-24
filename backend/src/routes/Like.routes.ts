import { Router } from "express";
import { LikeController } from "../controllers/Like.controller";

const router = Router();

router.post("/", LikeController.toggleLike);  // Curtir ou descurtir
router.get("/:postId", LikeController.getLikesByPost); // Obter total de curtidas

export default router;