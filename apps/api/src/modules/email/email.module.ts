import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EMAIL_PROVIDER } from './application/ports/email-provider.port';
import { DevEmailProvider } from './infrastructure/dev-email.provider';

@Module({
  providers: [
    DevEmailProvider,
    {
      provide: EMAIL_PROVIDER,
      inject: [ConfigService, DevEmailProvider],
      useFactory: (
        config: ConfigService,
        devEmailProvider: DevEmailProvider,
      ) => {
        const provider = config.get<string>('email.provider') ?? 'dev';

        if (provider === 'dev') {
          return devEmailProvider;
        }

        throw new Error(`Unsupported email provider: ${provider}`);
      },
    },
  ],
  exports: [EMAIL_PROVIDER],
})
export class EmailModule {}
