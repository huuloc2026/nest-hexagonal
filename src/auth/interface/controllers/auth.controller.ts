import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpStatus,
  HttpCode,
  Patch,
} from '@nestjs/common';
import { AuthService } from '../../application/services/auth.service';

import { GetRefreshToken } from '../decorators/get-refresh-token.decorator';
import { LoginDto, RegisterDto } from 'src/auth/application/dtos';
import { RtGuard } from 'src/auth/interface/guards/rt.guard';
import { AtGuard } from '../guards/at.guard';
import { GetUser } from '../decorators/get-user.decorator';
import { ChangePasswordDto } from 'src/auth/application/dtos/change-password.dto';
import { IsPublic } from 'src/auth/interface/decorators/is-public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @IsPublic()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }

  @IsPublic()
  @Post('register')
  @HttpCode(HttpStatus.OK)
  async register(@Body() registerDto: RegisterDto) {
    return await this.authService.register(registerDto);
  }

  @UseGuards(RtGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.CREATED)
  async refresh(@GetRefreshToken() refreshToken: string) {
    return await this.authService.refreshToken(refreshToken);
  }

  @Patch('change-password')
  @HttpCode(HttpStatus.OK)
  async changePassword(
    @GetUser('sub') userId: string,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    await this.authService.changePassword(userId, changePasswordDto);
    return { message: 'Password changed successfully' };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@GetUser('sub') userId: string) {
    await this.authService.logout(userId);
    return { message: 'Logged out successfully' };
  }
}
