import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createProxyMiddleware } from 'http-proxy-middleware';
import type { RequestHandler } from 'http-proxy-middleware';

interface ServiceRoute {
  path: string;
  target: string;
  rewrite: string;
}

@Injectable()
export class ProxyService {
  constructor(private readonly configService: ConfigService) {}

  /**
   * Lista de serviços e suas rotas correspondentes.
   * Cada entrada mapeia um prefixo de rota do gateway para um serviço backend.
   */

  private get serviceRoutes(): ServiceRoute[] {
    return [
      {
        path: '/api/v1/auth',
        target:
          this.configService.get<string>('AUTH_SERVICE_HOST') ??
          'http://localhost:3001',
        rewrite: '^/api/v1/auth',
      },
      {
        path: '/api/v1/products',
        target:
          this.configService.get<string>('PRODUCT_SERVICE_HOST') ??
          'http://localhost:3002',
        rewrite: '^/api/v1/products',
      },
      {
        path: '/api/v1/inventory',
        target:
          this.configService.get<string>('INVENTORY_SERVICE_HOST') ??
          'http://localhost:3005',
        rewrite: '^/api/v1/inventory',
      },
      {
        path: '/api/v1/orders',
        target:
          this.configService.get<string>('ORDER_SERVICE_HOST') ??
          'http://localhost:3003',
        rewrite: '^/api/v1/orders',
      },
      {
        path: '/api/v1/payments',
        target:
          this.configService.get<string>('PAYMENT_SERVICE_HOST') ??
          'http://localhost:3004',
        rewrite: '^/api/v1/payments',
      },
    ];
  }

  /**
   * Cria um array de middlewares de proxy baseado na configuração de serviços.
   * Cada middleware usa `pathFilter` para decidir se encaminha a requisição.
   */
  createProxies(): RequestHandler[] {
    return this.serviceRoutes.map((route) =>
      createProxyMiddleware({
        pathFilter: (path: string) => path.startsWith(route.path),
        target: route.target,
        changeOrigin: true,
        pathRewrite: { [route.rewrite]: route.path.replace('/api/v1', '') },
      }),
    );
  }
}
