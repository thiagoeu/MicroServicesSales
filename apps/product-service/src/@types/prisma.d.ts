import { Prisma } from '@prisma/client';

// Extend the PrismaClient type to include the product model
declare module '@prisma/client' {
  interface PrismaClient {
    product: {
      create: (args: any) => Promise<any>;
      findMany: (args?: any) => Promise<any[]>;
      findUnique: (args: any) => Promise<any>;
      update: (args: any) => Promise<any>;
      delete: (args: any) => Promise<any>;
    };
  }
}
