import * as express from "express";

// Declaração de tipos para o Express Request, permitindo a injeção do userId
declare global {
  namespace Express {
    interface Request {
      userId?: number; // Injeta o ID do usuário de forma opcional na requisição
    }
  }
}