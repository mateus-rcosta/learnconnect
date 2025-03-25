import { Router } from "express";
import { MaterialController } from "../controllers/Material.controller";
import { authenticateJWT } from "../middleware/auth"; 
import { authorizeAdmin } from "../middleware/Usuario.middleware"; 

const router = Router();

// 1. GET /api/materiais - Paginação
router.get("/", MaterialController.getAllMateriais);

// 2. POST /api/materiais - Criar material (usuário logado)
router.post("/", authenticateJWT, MaterialController.createMaterial);

// 3. GET /api/materiais/:id - Detalhes de um material
router.get("/:id", MaterialController.getMaterialById);

// 4. PUT /api/materiais/:id - Editar material (somente autor)
router.put("/:id", authenticateJWT, MaterialController.updateMaterial);

// 5. DELETE /api/materiais/:id - Deletar material (somente autor)
router.delete("/:id", authenticateJWT, MaterialController.deleteMaterial);

// 6. GET /api/materiais/:id/anexos  - Anexos de um material
router.get("/:id/anexos", MaterialController.getAnexos);


// 8. Rotas exclusivas de admin
router.put("/admin/:id", authenticateJWT, authorizeAdmin, MaterialController.adminUpdateMaterial);
router.delete("/admin/:id", authenticateJWT, authorizeAdmin, MaterialController.adminDeleteMaterial);

export default router;