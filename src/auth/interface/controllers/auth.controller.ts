import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from '../../application/services/auth.service';

import { RefreshTokenGuard } from '../guards/refresh-token.guard';
import { GetRefreshToken } from '../decorators/get-refresh-token.decorator';
import { LoginDto, RegisterDto } from 'src/auth/application/dtos';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  async refresh(@GetRefreshToken() refreshToken: string) {
    return this.authService.refreshToken(refreshToken);
  }
}
