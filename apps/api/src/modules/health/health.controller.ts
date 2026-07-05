import { Controller, Get } from '@nestjs/common';

import { logHealthCheck } from '../../common/observability';

@Controller('health')
export class HealthController {
  @Get()
  check() {
    const payload = {
      status: 'ok',
      service: 'flashcards-api',
      timestamp: new Date().toISOString(),
    };

    logHealthCheck({ status: payload.status });

    return payload;
  }
}
