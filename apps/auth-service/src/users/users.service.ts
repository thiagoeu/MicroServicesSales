import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string) {
    try {
      return await this.prisma.client.user.findUnique({
        where: { email },
      });
    } catch (error) {
      console.error('Erro ao buscar usuário por email:', error);
      throw new InternalServerErrorException(
        'Erro ao acessar o banco de dados',
      );
    }
  }

  async findById(id: number) {
    try {
      return await this.prisma.client.user.findUnique({
        where: { id },
      });
    } catch (error) {
      console.error('Erro ao buscar usuário por id:', error);
      throw new InternalServerErrorException(
        'Erro ao acessar o banco de dados',
      );
    }
  }

  async create(email: string, password: string, name: string) {
    const existingUser = await this.findByEmail(email);

    if (existingUser) {
      throw new ConflictException('Email já cadastrado!');
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      return await this.prisma.client.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
        },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Email already registered');
      }
      console.error('Erro ao criar usuário:', error);
      throw new InternalServerErrorException('Erro ao criar usuário');
    }
  }
}
