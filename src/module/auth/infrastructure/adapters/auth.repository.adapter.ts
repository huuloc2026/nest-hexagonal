import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthRepositoryPort } from '../../domain/ports/auth.repository.port';
import { Auth } from '../../domain/entities/auth.entity';
import { User } from 'src/module/users/domain/entities/user.entity';

@Injectable()
export class AuthRepositoryAdapter implements AuthRepositoryPort {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async generateTokens(user: User): Promise<Auth> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: user.id, email: user.email },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: this.configService.get<string>(
            'ACCESS_TOKEN_EXPIRATION_TIME',
          ),
        },
      ),
      this.jwtService.signAsync(
        { sub: user.id },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: this.configService.get<string>(
            'REFRESH_TOKEN_EXPIRATION_TIME',
          ),
        },
      ),
    ]);

    return new Auth(accessToken, refreshToken);
  }

  async validateToken(token: string): Promise<boolean> {
    try {
      await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      });
      return true;
    } catch {
      return false;
    }
  }

  async refreshToken(refreshToken: string): Promise<Auth> {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      const accessToken = await this.jwtService.signAsync(
        { sub: payload.sub },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: '15m',
        },
      );

      return new Auth(accessToken, refreshToken);
    } catch {
      throw new Error('Invalid refresh token');
    }
  }
}
