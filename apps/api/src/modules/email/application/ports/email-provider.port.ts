import { EmailMessage } from '../types/email-message.type';

export const EMAIL_PROVIDER = Symbol('EMAIL_PROVIDER');

export type EmailProviderPort = {
  send(message: EmailMessage): Promise<void>;
};
