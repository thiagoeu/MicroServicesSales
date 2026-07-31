import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ProxyService } from './proxy/proxy.service';
import { JwtAuthMiddleware } from './auth/jwt-auth.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  });

  // Obtém os serviços de proxy e autenticação
  const proxyService = app.get(ProxyService);
  const jwtAuthMiddleware = app.get(JwtAuthMiddleware);

  // 1. Valida JWT em todas as rotas (internamente ignora /api/v1/auth/*)
  app.use(jwtAuthMiddleware.use.bind(jwtAuthMiddleware));

  // 2. Encaminha requisições para os microserviços.
  //    Aplicados diretamente no Express via app.use() para garantir que
  //    rodem ANTES do router do NestJS (corrige 404 "Cannot POST").
  const proxies = proxyService.createProxies();
  for (const proxy of proxies) {
    app.use(proxy);
  }

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
