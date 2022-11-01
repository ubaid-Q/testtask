import express from "express";
import { CategoryController } from "../Controllers/CategoryController.js";
import { isAuthenticated } from "../middleware/authorize.middleware.js";

const catController = new CategoryController();

/**
 * @description Authentication Routes
 */
const router = express.Router();

router.get("/", isAuthenticated, catController.get);
router.get("/:id", isAuthenticated, catController.getById);
router.post("/", isAuthenticated, catController.create);
router.put("/:id", isAuthenticated, catController.update);
router.delete('/:id', isAuthenticated, catController.deleteById)

export default router;
