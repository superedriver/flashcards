import { Injectable, Logger } from '@nestjs/common';
import { EmailProviderPort } from '../application/ports/email-provider.port';
import { EmailMessage } from '../application/types/email-message.type';

@Injectable()
export class DevEmailProvider implements EmailProviderPort {
  private readonly logger = new Logger(DevEmailProvider.name);

  send(message: EmailMessage): Promise<void> {
    this.logger.log(`To: ${message.to}`);
    this.logger.log(`Subject: ${message.subject}`);
    this.logger.log(`Text: ${message.text}`);

    if (message.html) {
      this.logger.log(`Html: ${message.html}`);
    }

    return Promise.resolve();
  }
}
