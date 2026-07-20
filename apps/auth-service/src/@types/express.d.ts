import { User } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      user?: {
        sub: number;
        email: string;
      };
    }
  }
}
