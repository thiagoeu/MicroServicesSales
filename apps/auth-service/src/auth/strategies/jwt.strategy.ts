import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      // Lê o token do header Authorization: Bearer <token>
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // Usa a chave pública para verificar a assinatura
      secretOrKey: fs.readFileSync(
        configService.get<string>('JWT_PUBLIC_KEY_PATH')!,
        'utf8',
      ),
      algorithms: ['RS256'],
    });
  }

  // O payload decodificado é passado para este método
  async validate(payload: any) {
    // Retorna os dados que serão injetados no `req.user`
    return { sub: payload.sub, email: payload.email };
  }
}
