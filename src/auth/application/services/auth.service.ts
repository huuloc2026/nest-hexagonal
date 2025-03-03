import {
  Injectable,
  Inject,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';

import { Auth } from '../../domain/entities/auth.entity';
import {
  AuthRepositoryPort,
  AUTH_REPOSITORY,
} from '../../domain/ports/auth.repository.port';
import { UserService } from '../../../users/application/services/user.service';
import { CryptoService } from '../../../shared/services/crypto.service';
import { LoginDto, RegisterDto } from 'src/auth/application/dtos';

@Injectable()
export class AuthService {
  constructor(
    @Inject(AUTH_REPOSITORY)
    private readonly authRepository: AuthRepositoryPort,
    private readonly userService: UserService,
    private readonly cryptoService: CryptoService,
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
    return this.authRepository.generateTokens(user);
  }

  async validateToken(token: string): Promise<boolean> {
    return this.authRepository.validateToken(token);
  }

  async refreshToken(refreshToken: string): Promise<Auth> {
    return this.authRepository.refreshToken(refreshToken);
  }
}
