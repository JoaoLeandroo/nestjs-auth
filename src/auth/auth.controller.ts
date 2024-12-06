import { Body, Controller, Post } from '@nestjs/common';
import { SignInDtro, SignUpDto } from './dtos/auth';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signup(@Body() body: SignUpDto) {
    return this.authService.signUp(body);
  }

  @Post('signin')
  async signin(@Body() body: SignInDtro) {
    return this.authService.signIn(body);
  }
}
