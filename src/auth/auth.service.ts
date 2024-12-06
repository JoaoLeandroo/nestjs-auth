import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SignInDtro, SignUpDto } from './dtos/auth';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private prismaService: PrismaService) {}

  async signUp(data: SignUpDto) {
    const userAlreadyExist = await this.prismaService.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (userAlreadyExist) {
      throw new UnauthorizedException();
    }

    const user = await this.prismaService.user.create({ data });
    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }

  async signIn(data: SignInDtro) {
    const userAlreadyExist = await this.prismaService.user.findFirst({
      where: {
        email: data.email,
      },
    });

    if (!userAlreadyExist) {
      return { message: 'Email não cadastrado.' };
    }

    if (userAlreadyExist.password != data.password) {
      return { message: 'Senha incorreta.' };
    }

    return { message: 'Usuario logado com sucesso!' };
  }
}
