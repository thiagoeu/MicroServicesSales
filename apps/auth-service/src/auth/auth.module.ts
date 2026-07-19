import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import * as fs from 'fs';

@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        // Lê as chaves dos arquivos (ou das variáveis de ambiente)
        const privateKey = fs.readFileSync(
          configService.get<string>('JWT_PRIVATE_KEY_PATH')!,
          'utf8',
        );
        const publicKey = fs.readFileSync(
          configService.get<string>('JWT_PUBLIC_KEY_PATH')!,
          'utf8',
        );

        return {
          privateKey,
          publicKey,
          signOptions: {
            algorithm: 'RS256' as const,
            expiresIn: configService.get('JWT_EXPIRES_IN') || '1d',
          },
          verifyOptions: {
            algorithms: ['RS256'],
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
