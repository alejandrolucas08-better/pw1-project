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

  // 2. Divide a string para extrair o token do padrão "Bearer <token>"
  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    res.status(401).json({ error: "Formato do token inválido. Use o padrão 'Bearer <token>'." });
    return;
  }

  // Com o "noUncheckedIndexedAccess", o TS exige garantir que a posição [1] existe
  const token = parts[1];
  if (!token) {
    res.status(401).json({ error: "Token não encontrado." });
    return;
  }

  try {
    // O segredo para validar o token deve ser o mesmo usado para assiná-lo no login
    const secret = process.env.JWT_SECRET || "fallback_secret";
    
    // 3. Valida se o token foi assinado pelo nosso backend
    const decoded = jwt.verify(token, secret) as unknown as TokenPayload;

    // 4. Injeta o ID do usuário na requisição para que os controladores possam acessar
    req.userId = decoded.userId;

    // 5. Segue para o próximo controlador
    next();
  } catch (error) {
    res.status(401).json({ error: "Token inválido ou expirado." });
  }
};