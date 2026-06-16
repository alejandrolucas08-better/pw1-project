import { Router } from "express";
import { register, login, getMe } from "../controllers/authController";

const router = Router();

// Rota para cadastrar um novo usuário: POST /api/auth/register
router.post("/register", register);

// Rota para fazer login: POST /api/auth/login
router.post("/login", login);

// Rota para obter os dados do usuário autenticado: GET /api/auth/me
router.get("/me", getMe);

export default router;