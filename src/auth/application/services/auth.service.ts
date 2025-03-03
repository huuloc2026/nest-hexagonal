import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from '../dtos/login.dto';
import { Auth } from '../../domain/entities/auth.entity';
import {
  AuthRepositoryPort,
  AUTH_REPOSITORY,
} from '../../domain/ports/auth.repository.port';
import { UserService } from '../../../users/application/services/user.service';
import { CryptoService } from '../../../shared/services/crypto.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(AUTH_REPOSITORY)
    private readonly authRepository: AuthRepositoryPort,
    private readonly userService: UserService,
    private readonly cryptoService: CryptoService,
  ) {}

  async login(loginDto: LoginDto): Promise<Auth> {
    const user = await this.userService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // const hashedPassword = this.cryptoService.hashPassword(
    //   loginDto.password,
    //   user.salt,
    // );
    const isPasswordValid = this.cryptoService.verifyPassword(
      loginDto.password,
      user.password,
      user.salt,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authRepository.generateTokens(user);
  }

  async validateToken(token: string): Promise<boolean> {
    return this.authRepository.validateToken(token);
  }

  async refreshToken(refreshToken: string): Promise<Auth> {
    return this.authRepository.refreshToken(refreshToken);
  }
}
