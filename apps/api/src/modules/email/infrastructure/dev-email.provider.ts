import { Injectable } from '@nestjs/common';

import { EmailProviderPort } from '../application/ports/email-provider.port';
import { EmailMessage } from '../application/types/email-message.type';

@Injectable()
export class DevEmailProvider implements EmailProviderPort {
  send(message: EmailMessage): Promise<void> {
    void message;
    // Dev delivery is a no-op. Message bodies may contain verification or reset tokens.
    return Promise.resolve();
  }
}
