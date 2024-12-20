import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SignInDtro, SignUpDto } from './dtos/auth';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signUp(data: SignUpDto) {
    const userAlreadyExist = await this.prismaService.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (userAlreadyExist) {
      throw new UnauthorizedException();
    }

    const hashPassword = await bcrypt.hash(data.password, 10);

    const user = await this.prismaService.user.create({
      data: {
        ...data,
        password: hashPassword,
      },
    });

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
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatch = await bcrypt.compare(
      data.password,
      userAlreadyExist.password,
    );

    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = this.jwtService.sign({
      id: userAlreadyExist.id,
      name: userAlreadyExist.name,
      email: userAlreadyExist.email,
    });

    return {
      id: userAlreadyExist.id,
      name: userAlreadyExist.name,
      email: userAlreadyExist.email,
      token: accessToken,
    };
  }
}
