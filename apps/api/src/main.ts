import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { logApplicationStartup } from './common/observability';
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

  const port = Number(
    configService.get<number>('app.port') ?? process.env.PORT ?? 3000,
  );

  await app.listen(port);

  logApplicationStartup({
    nodeEnv: configService.get<string>('app.nodeEnv', 'development'),
    port,
  });
}

void bootstrap();
