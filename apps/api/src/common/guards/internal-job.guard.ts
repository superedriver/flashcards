import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class InternalJobGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const secret = request.headers['x-internal-job-secret'];
    const expectedSecret = this.configService.get<string>(
      'app.internalJobSecret',
      '',
    );

    if (
      typeof secret !== 'string' ||
      !expectedSecret ||
      secret !== expectedSecret
    ) {
      throw new UnauthorizedException('Invalid internal job secret');
    }

    return true;
  }
}
