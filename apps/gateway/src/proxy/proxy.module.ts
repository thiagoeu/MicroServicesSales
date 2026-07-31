import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtAuthMiddleware } from '../auth/jwt-auth.middleware';
import { ProxyService } from './proxy.service';

/**
 * Módulo responsável por prover os serviços de proxy e autenticação do gateway.
 *
 * A aplicação dos middlewares (JWT + proxy) é feita no `main.ts` via `app.use()`
 * para garantir que rodem ANTES do router do NestJS, evitando o 404 "Cannot POST".
 */
@Module({
  imports: [ConfigModule],
  providers: [JwtAuthMiddleware, ProxyService],
  exports: [JwtAuthMiddleware, ProxyService],
})
export class ProxyModule {}
