import { Request } from 'express';

// Extensão da interface Request do Express para incluir a propriedade userId
declare module 'express-serve-static-core' {
  interface Request {
    userId?: number;
  }
}
