import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const corsOrigins = configService.get<string[]>('app.corsOrigins', [
    'http://localhost:8081',
  ]);
  const corsCredentials = configService.get<boolean>(
    'app.corsCredentials',
    true,
  );

  app.enableCors({
    credentials: corsCredentials,
    origin: corsOrigins.length === 1 ? corsOrigins[0] : corsOrigins,
  });

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
