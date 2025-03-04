import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RedisService } from 'src/shared/redis/redis.service';

@Injectable()
export class RtGuard extends AuthGuard('jwt-refresh') {
  private readonly logger = new Logger(RtGuard.name);

  constructor(private readonly redisService: RedisService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // First check if token is blacklisted
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Refresh token not found');
    }

    // this.logger.log(
    //   `Checking if refresh token is blacklisted: ${token.slice(0, 10)}...`,
    // );

    const isBlacklisted = await this.redisService.isBlacklisted(token);
    if (isBlacklisted) {
      throw new UnauthorizedException('Refresh token has been revoked');
    }

    const result = await super.canActivate(context);
    return result as boolean;
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
