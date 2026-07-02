import { registerAs } from '@nestjs/config';

export const pushConfig = registerAs('push', () => ({
  provider: process.env.PUSH_PROVIDER ?? 'mock',
}));
