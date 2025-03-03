import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../decorators/is-public.decorator';
import { TokenBlacklistGuard } from './token-blacklist.guard';

@Injectable()
export class AtGuard extends AuthGuard('jwt') {
  constructor(
    private reflector: Reflector,
    private blacklistGuard: TokenBlacklistGuard,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    // Check if token is blacklisted
    await this.blacklistGuard.canActivate(context);

    const result = await super.canActivate(context);
    return result as boolean;
  }
}
