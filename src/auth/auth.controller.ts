import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    const newUser = await this.authService.register(dto);
    return newUser;
  }


  @Post('login')
  async login(@Body() dto: LoginDto) {
    const user = await this.authService.login(dto);
    return user;
  }
}
