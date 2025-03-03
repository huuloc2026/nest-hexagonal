import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from '../../application/services/auth.service';
import { LoginDto } from '../../application/dtos/login.dto';
import { RefreshTokenGuard } from '../guards/refresh-token.guard';
import { GetRefreshToken } from '../decorators/get-refresh-token.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  async refresh(@GetRefreshToken() refreshToken: string) {
    return this.authService.refreshToken(refreshToken);
  }
}
