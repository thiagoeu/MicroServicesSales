import { JwtPayload } from 'passport-jwt';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload | string | { sub: string; email: string };
    }
  }
}
