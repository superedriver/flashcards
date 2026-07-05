import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { NextFunction, Request, Response } from 'express';

@Injectable()
export class HstsMiddleware implements NestMiddleware {
  constructor(private readonly configService: ConfigService) {}

  use(_req: Request, res: Response, next: NextFunction): void {
    if (this.configService.get<string>('app.nodeEnv') === 'production') {
      res.setHeader(
        'Strict-Transport-Security',
        'max-age=31536000; includeSubDomains',
      );
    }

    next();
  }
}
