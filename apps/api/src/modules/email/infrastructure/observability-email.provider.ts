import { Injectable } from '@nestjs/common';

import { logEmailDeliverySummary } from '../../../common/observability';
import { sanitizeLogMessage } from '../../../common/observability/sanitize-log-message';
import { EmailProviderPort } from '../application/ports/email-provider.port';
import { EmailMessage } from '../application/types/email-message.type';

@Injectable()
export class ObservabilityEmailProvider implements EmailProviderPort {
  constructor(
    private readonly delegate: EmailProviderPort,
    private readonly providerName: string,
  ) {}

  async send(message: EmailMessage): Promise<void> {
    try {
      await this.delegate.send(message);
      logEmailDeliverySummary({
        provider: this.providerName,
        success: true,
        subject: message.subject,
      });
    } catch (error) {
      logEmailDeliverySummary({
        provider: this.providerName,
        success: false,
        subject: message.subject,
        errorMessage: sanitizeLogMessage(error),
      });
      throw error;
    }
  }
}
