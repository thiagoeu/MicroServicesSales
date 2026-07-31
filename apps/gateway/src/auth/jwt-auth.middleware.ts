import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import * as fs from 'fs';

/**
 * Middleware de validação de JWT para o gateway.
 *
 * Valida o token JWT enviado no header `Authorization: Bearer <token>`
 * utilizando a chave pública RSA do auth-service (algoritmo RS256).
 *
 * Rotas públicas (ex: /api/v1/auth/*) são ignoradas internamente —
 * o middleware verifica o caminho da requisição e pula a validação
 * para rotas de autenticação (login, register, refresh).
 */

@Injectable()
export class JwtAuthMiddleware implements NestMiddleware {
  constructor(private readonly configService: ConfigService) {
    const publicKey = fs.readFileSync(
      this.configService.get<string>('JWT_PUBLIC_KEY_PATH')!,
      'utf8',
    );

    passport.use(
      'jwt-gateway',
      new JwtStrategy(
        {
          jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
          ignoreExpiration: false,
          secretOrKey: publicKey,
          algorithms: ['RS256'],
        },
        (payload, done) => {
          // O payload já foi verificado pela chave pública; apenas repassa
          return done(null, { sub: payload.sub, email: payload.email });
        },
      ),
    );
  }

  use(req: Request, res: Response, next: NextFunction) {
    // Permite requisições CORS preflight (OPTIONS)
    if (req.method === 'OPTIONS') {
      return next();
    }

    const path = req.originalUrl || req.url || req.path;

    // Rotas públicas de autenticação não precisam de validação JWT
    if (
      path.startsWith('/api/v1/auth/login') ||
      path.startsWith('/api/v1/auth/register') ||
      path.startsWith('/api/v1/auth/refresh')
    ) {
      return next();
    }

    passport.authenticate(
      'jwt-gateway',
      { session: false },
      (err: any, user: any, _info: any) => {
        if (err || !user) {
          return res.status(401).json({ message: 'Token inválido ou ausente' });
        }
        // Anexa o usuário decodificado na requisição para serviços downstream
        req.user = user;
        next();
      },
    )(req, res, next);
  }
}
