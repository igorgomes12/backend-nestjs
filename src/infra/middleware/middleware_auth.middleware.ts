import { Injectable, NestMiddleware } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

@Injectable()
export class MiddlewareAuth implements NestMiddleware {
  constructor(
    private readonly configService: ConfigService
  ) {}

  use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Token não fornecido' });
    }

    const publicKeyBase64 = this.configService.get<string>("JWT_PUBLIC_KEY");
    if (!publicKeyBase64) {
      console.error('Chave pública JWT não definida');
      return res.status(500).json({ message: 'Erro de configuração do servidor' });
    }

    const publicKey = Buffer.from(publicKeyBase64, 'base64').toString('utf8');

    try {
      const decoded = verify(token, publicKey, { algorithms: ['RS256'] });
      console.log('Decoded payload:', decoded); // Log para verificar o payload
      req.user = decoded;
      next();
    } catch (error) {
      console.error('Erro ao verificar o token:', error);
      return res.status(401).json({ message: 'Token inválido ou expirado' });
    }
  }
}