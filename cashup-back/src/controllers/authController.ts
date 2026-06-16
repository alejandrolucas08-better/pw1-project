import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../config/database";

// Controlador para Registrar um Novo Usuário
export const register = async (req:Request, res: Response): Promise<void> => {
    try {
        const { name, email, password } = req.body;

        // Validação básica de campos
        if (!name || !email || !password) {
            res.status(400).json({ error: "Todos os campos (nome, email e senha) são obrigatórios." });
            return;
        }

        // Verifica se o email já está cadastrado
        const userExists = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
        if (userExists.rowCount && userExists.rowCount > 0) {
            res.status(400).json({ error: "Este e-mail já está em uso." });
            return;
        }

        // Criptografa a senha (gera o Hash)
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Salva o usuário no banco de dados
        const insertQuery = `
            INSERT INTO users (name, email, password_hash)
            VALUES ($1, $2, $3)
            RETURNING id, name, email, created_at;
        `;
        const result = await pool.query(insertQuery, [name, email, passwordHash]);

        res.status(201).json({
            message: "Usuário cadastrado com sucesso!",
            user: result.rows[0],
        });
    } catch (error) {
        console.error('Erro no registro de usuário:', error);
        res.status(500).json({ error: "Erro interno ao registrar usuário." });
    }
};

// Função para Realizar o Login
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Validação básica de campos
    if (!email || !password) {
      res.status(400).json({ error: "E-mail e senha são obrigatórios." });
      return;
    }

    // Busca o usuário pelo e-mail
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (result.rowCount === 0) {
      res.status(401).json({ error: "E-mail ou senha incorretos." });
      return;
    }

    const user = result.rows[0];

    // Compara a senha digitada com a senha criptografada do banco
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      res.status(401).json({ error: "E-mail ou senha incorretos." });
      return;
    }

    // Recupera o segredo do .env
    const secret = process.env.JWT_SECRET || "fallback_secret";

    // Gera o token JWT válido por 1 dia (contendo o ID do usuário)
    const token = jwt.sign({ userId: user.id }, secret, { expiresIn: "1d" });

    res.json({
      message: "Login realizado com sucesso!",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Erro no login do usuário:", error);
    res.status(500).json({ error: "Erro interno ao realizar login." });
  }
};

// Controlador para buscar os dados do usuário logado (Rota Protegida)
export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({ error: "Usuário não autenticado." });
      return;
    }

    // Busca o usuário no banco, mas trazendo APENAS o id, name e email (nunca traga o password_hash aqui!)
    const queryText = "SELECT id, name, email FROM users WHERE id = $1";
    const result = await pool.query(queryText, [userId]);

    if (result.rowCount === 0) {
      res.status(404).json({ error: "Usuário não encontrado." });
      return;
    }

    // Retorna os dados do usuário logado
    res.json({
      user: result.rows[0]
    });
  } catch (error) {
    console.error("Erro ao buscar dados do perfil:", error);
    res.status(500).json({ error: "Erro interno ao buscar perfil." });
  }
};