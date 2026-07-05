import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request, Response } from 'express';

export const REFRESH_TOKEN_COOKIE_NAME = 'flashcards.refreshToken';

const REFRESH_TOKEN_MAX_AGE_SECONDS = 30 * 24 * 60 * 60;

@Injectable()
export class RefreshTokenCookieService {
  constructor(private readonly configService: ConfigService) {}

  setRefreshTokenCookie(res: Response, refreshToken: string): void {
    res.setHeader('Set-Cookie', this.buildCookieHeader(refreshToken));
  }

  clearRefreshTokenCookie(res: Response): void {
    res.setHeader(
      'Set-Cookie',
      this.buildCookieHeader('', { maxAgeSeconds: 0 }),
    );
  }

  getRefreshTokenFromRequest(req: Request): string | null {
    const cookies = this.parseCookieHeader(req.headers.cookie);

    const value = cookies[REFRESH_TOKEN_COOKIE_NAME];

    return typeof value === 'string' && value.length > 0 ? value : null;
  }

  private buildCookieHeader(
    value: string,
    options?: { maxAgeSeconds?: number },
  ): string {
    const isProduction =
      this.configService.get<string>('app.nodeEnv') === 'production';
    const maxAge = options?.maxAgeSeconds ?? REFRESH_TOKEN_MAX_AGE_SECONDS;
    const parts = [
      `${REFRESH_TOKEN_COOKIE_NAME}=${encodeURIComponent(value)}`,
      'Path=/',
      'HttpOnly',
      'SameSite=Lax',
      `Max-Age=${maxAge}`,
    ];

    if (isProduction) {
      parts.push('Secure');
    }

    return parts.join('; ');
  }

  private parseCookieHeader(
    header: string | undefined,
  ): Record<string, string> {
    if (!header) {
      return {};
    }

    return header.split(';').reduce<Record<string, string>>((cookies, part) => {
      const separatorIndex = part.indexOf('=');

      if (separatorIndex === -1) {
        return cookies;
      }

      const key = part.slice(0, separatorIndex).trim();
      const value = part.slice(separatorIndex + 1).trim();

      if (key) {
        cookies[key] = decodeURIComponent(value);
      }

      return cookies;
    }, {});
  }
}
