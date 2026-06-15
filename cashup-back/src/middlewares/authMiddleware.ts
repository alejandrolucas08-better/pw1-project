import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface TokenPayload {
  userId: number;
  iat: number;
  exp: number;
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  // 1. Verifica se o cabeçalho Authorization foi enviado
  if (!authHeader) {
    res.status(401).json({ error: "Token de autenticação não fornecido." });
    return;
  }

  // 2. O formato padrão é "Bearer <TOKEN>". Vamos separar a string pelo espaço.
  const parts = authHeader.split(" ");

  if (parts.length !== 2 || parts[0] !== "Bearer") {
    res.status(401).json({ error: "Formato do token inválido. Use o padrão 'Bearer <token>'." });
    return;
  }

  const token = parts[1];

  try {
    const secret = process.env.JWT_SECRET || "fallback_secret";
    
    // 3. Valida se o token foi assinado pelo nosso backend e se não expirou
    const decoded = jwt.verify(token, secret) as unknown as TokenPayload;

    // 4. MÁGICA: Injeta o ID do usuário real de dentro do token direto no objeto da requisição!
    req.userId = decoded.userId;

    // 5. Permite que a requisição continue para o controlador correspondente
    next();
  } catch (error) {
    res.status(401).json({ error: "Token inválido ou expirado." });
    return;
  }
};