import { Router } from "express";
import { register, login } from "../controllers/authController";

const router = Router();

// Rota para cadastrar um novo usuário: POST /api/auth/register
router.post("/register", register);

// Rota para fazer login: POST /api/auth/login
router.post("/login", login);

export default router;