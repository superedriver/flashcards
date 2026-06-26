import { registerAs } from '@nestjs/config';

export const aiConfig = registerAs('ai', () => ({
  provider: process.env.AI_PROVIDER ?? 'mock',
  apiKey: process.env.AI_API_KEY ?? '',
}));
