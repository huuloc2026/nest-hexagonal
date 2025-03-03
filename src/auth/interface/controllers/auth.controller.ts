import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { AuthService } from '../../application/services/auth.service';

import { GetRefreshToken } from '../decorators/get-refresh-token.decorator';
import { LoginDto, RegisterDto } from 'src/auth/application/dtos';
import { RtGuard } from 'src/auth/interface/guards/rt.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('register')
  @HttpCode(HttpStatus.OK)
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @UseGuards(RtGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.CREATED)
  async refresh(@GetRefreshToken() refreshToken: string) {
    return this.authService.refreshToken(refreshToken);
  }
}
