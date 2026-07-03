import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

function parseCorsOrigins(raw: string): string | string[] {
  const origins = raw
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);

  if (origins.length <= 1) {
    return origins[0] ?? 'http://localhost:8081';
  }

  return origins;
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const corsOrigin = configService.get<string>(
    'app.corsOrigin',
    'http://localhost:8081',
  );

  app.enableCors({
    credentials: true,
    origin: parseCorsOrigins(corsOrigin),
  });

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
