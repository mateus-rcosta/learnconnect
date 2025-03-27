import { Router } from "express";
import { LikeController } from "../controllers/Like.controller";
import { authenticateJWT } from "../middleware/auth";

const router = Router();

router.post("/:materialId", authenticateJWT, LikeController.toggleLike);  
router.get("/:materialId", authenticateJWT, LikeController.getLikesByPost); 

export default router;