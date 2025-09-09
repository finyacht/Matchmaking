import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RateLimitGuard implements CanActivate {
  private requests = new Map<string, { count: number; resetTime: number }>();

  constructor(private configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const ip = request.ip;
    const now = Date.now();
    const windowMs = this.configService.get('RATE_LIMIT_WINDOW_MS', 900000); // 15 minutes
    const maxRequests = this.configService.get('RATE_LIMIT_MAX_REQUESTS', 100);

    if (!this.requests.has(ip)) {
      this.requests.set(ip, { count: 1, resetTime: now + windowMs });
      return true;
    }

    const userData = this.requests.get(ip);
    
    if (now > userData.resetTime) {
      userData.count = 1;
      userData.resetTime = now + windowMs;
      return true;
    }

    if (userData.count >= maxRequests) {
      throw new HttpException(
        'Too many requests, please try again later.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    userData.count++;
    return true;
  }
}
