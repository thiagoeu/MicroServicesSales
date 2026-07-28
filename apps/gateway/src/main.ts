import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { createProxyMiddleware } from 'http-proxy-middleware';
import type { RequestHandler } from 'http-proxy-middleware';

const AUTH_SERVICE_HOST =
  process.env.AUTH_SERVICE_HOST ?? 'http://localhost:3001';
const PRODUCT_SERVICE_HOST =
  process.env.PRODUCT_SERVICE_HOST ?? 'http://localhost:3002';
const INVENTORY_SERVICE_HOST =
  process.env.INVENTORY_SERVICE_HOST ?? 'http://localhost:3003';
const ORDER_SERVICE_HOST =
  process.env.ORDER_SERVICE_HOST ?? 'http://localhost:3004';
const PAYMENT_SERVICE_HOST =
  process.env.PAYMENT_SERVICE_HOST ?? 'http://localhost:3005';

const proxies: RequestHandler[] = [
  createProxyMiddleware({
    pathFilter: '/api/v1/auth',
    target: AUTH_SERVICE_HOST,
    changeOrigin: true,
    pathRewrite: { '^/api/v1/auth': '/auth' },
  }),
  createProxyMiddleware({
    pathFilter: '/api/v1/products',
    target: PRODUCT_SERVICE_HOST,
    changeOrigin: true,
    pathRewrite: { '^/api/v1/products': '/products' },
  }),
  createProxyMiddleware({
    pathFilter: '/api/v1/inventory',
    target: INVENTORY_SERVICE_HOST,
    changeOrigin: true,
    pathRewrite: { '^/api/v1/inventory': '/inventory' },
  }),
  createProxyMiddleware({
    pathFilter: '/api/v1/orders',
    target: ORDER_SERVICE_HOST,
    changeOrigin: true,
    pathRewrite: { '^/api/v1/orders': '/orders' },
  }),
  createProxyMiddleware({
    pathFilter: '/api/v1/payments',
    target: PAYMENT_SERVICE_HOST,
    changeOrigin: true,
    pathRewrite: { '^/api/v1/payments': '/payments' },
  }),
];

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  });

  // Aplica os proxies como middlewares Express
  // O pathFilter dentro de cada proxy decide se deve encaminhar a requisição
  for (const proxy of proxies) {
    app.use(proxy);
  }

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
