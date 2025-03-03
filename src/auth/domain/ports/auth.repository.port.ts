import { Auth } from '../entities/auth.entity';
import { User } from '../../../users/domain/entities/user.entity';

export interface AuthRepositoryPort {
  generateTokens(user: User): Promise<Auth>;
  validateToken(token: string): Promise<boolean>;
  refreshToken(refreshToken: string): Promise<Auth>;
}

export const AUTH_REPOSITORY = 'AUTH_REPOSITORY';
