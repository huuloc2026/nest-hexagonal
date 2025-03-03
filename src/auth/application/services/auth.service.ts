import {
  Injectable,
  Inject,
  UnauthorizedException,
  Logger,
  ForbiddenException,
} from '@nestjs/common';

import { Auth } from '../../domain/entities/auth.entity';
import {
  AuthRepositoryPort,
  AUTH_REPOSITORY,
} from '../../domain/ports/auth.repository.port';
import { UserService } from '../../../users/application/services/user.service';
import { CryptoService } from '../../../shared/services/crypto.service';
import { LoginDto, RegisterDto } from 'src/auth/application/dtos';
import { ChangePasswordDto } from '../dtos/change-password.dto';
import { RedisService } from '../../../shared/redis/redis.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(AUTH_REPOSITORY)
    private readonly authRepository: AuthRepositoryPort,
    private readonly userService: UserService,
    private readonly cryptoService: CryptoService,
    private readonly redisService: RedisService,
  ) {}
  async register(registerDto: RegisterDto): Promise<Auth> {
    const user = await this.userService.create(registerDto);
    return this.authRepository.generateTokens(user);
  }
  async login(loginDto: LoginDto): Promise<Auth> {
    const user = await this.userService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = this.cryptoService.verifyPassword(
      loginDto.password,
      user.password,
      user.salt,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Revoke any existing tokens
    await this.redisService.revokeUserTokens(user.id);

    // Generate new tokens
    const tokens = await this.authRepository.generateTokens(user);

    // Store new tokens
    const result = await this.redisService.storeUserTokens(user.id, {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });

    return tokens;
  }

  async validateToken(token: string): Promise<boolean> {
    return this.authRepository.validateToken(token);
  }

  async refreshToken(refreshToken: string): Promise<Auth> {
    return this.authRepository.refreshToken(refreshToken);
  }

  async changePassword(userId: string, dto: ChangePasswordDto): Promise<void> {
    const user = await this.userService.findById(userId);

    const isOldPasswordValid = this.cryptoService.verifyPassword(
      dto.oldPassword,
      user.password,
      user.salt,
    );

    if (!isOldPasswordValid) {
      throw new ForbiddenException('Old password is incorrect');
    }

    const salt = this.cryptoService.generateSalt();
    const hashedPassword = this.cryptoService.hashPassword(
      dto.newPassword,
      salt,
    );

    await this.userService.update(userId, {
      password: hashedPassword,
      salt,
    });
  }

  async logout(userId: string): Promise<void> {
    const tokens = await this.redisService.getUserTokens(userId);
    if (tokens) {
      await Promise.all([
        this.redisService.addToBlacklist(tokens.accessToken, userId),
        this.redisService.addToBlacklist(tokens.refreshToken, userId),
      ]);
      await this.redisService.revokeUserTokens(userId);
    }
  }
}
