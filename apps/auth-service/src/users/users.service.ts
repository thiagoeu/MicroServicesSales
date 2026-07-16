import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string) {
    try {
      return this.prisma.client.user.findUnique({
        where: { email },
      });
    } catch (error) {
      throw new ConflictException('Email already registered');
    }
  }

  async create(email: string, password: string, name: string) {
    try {
      const existingUser = await this.findByEmail(email);
      if (existingUser) {
        throw new ConflictException('Email already registered');
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      return this.prisma.client.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
        },
      });
    } catch (error) {
      throw new ConflictException('Email already registered');
    }
  }
}
