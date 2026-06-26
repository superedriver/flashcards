import { registerAs } from '@nestjs/config';

export const emailConfig = registerAs('email', () => ({
  provider: process.env.EMAIL_PROVIDER ?? 'dev',
  resendApiKey: process.env.RESEND_API_KEY ?? '',
  brevoApiKey: process.env.BREVO_API_KEY ?? '',
}));
