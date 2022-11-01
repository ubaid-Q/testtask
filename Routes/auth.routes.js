import express from "express";
import {AuthController} from "../Controllers/AuthController.js";

const { login, register } = new AuthController();

/**
 * @description Authentication Routes
 */
const router = express.Router();

router.post("/login", login);
router.post("/register", register);

export default router;
