import { Injectable, NestMiddleware } from "@nestjs/common";
import { Response, Request, NextFunction } from "express";
import { PrismaService } from "../database/prisma/prisma.service";

@Injectable()
export class MiddlewareAuth implements NestMiddleware {
  constructor(private readonly prisma: PrismaService) {}

use(req: Request, res: Response, next: NextFunction) {
  console.log("Request to /sessions:", req.method, req.path);

  const isAuthenticated = this.checkAuthentication(req);
  if (!isAuthenticated) {
    next()
  }


  req.user = {
    ...req.user,
    profile: req.user,
  };

  next();
}
  
  private checkAuthentication(req: Request): boolean {
    // Implementar lógica para verificar se o usuário está autenticado
    // Retornar true se autenticado, false caso contrário
    return true; // Exemplo simplificado
  }
}