import type { Response } from 'express';

import { RefreshTokenCookieService } from './refresh-token-cookie.service';

describe('RefreshTokenCookieService', () => {
  const configService = {
    get: jest.fn().mockReturnValue('development'),
  };

  function createService(nodeEnv = 'development'): RefreshTokenCookieService {
    configService.get.mockReturnValue(nodeEnv);

    return new RefreshTokenCookieService(configService as never);
  }

  it('sets an httpOnly refresh token cookie', () => {
    const service = createService();
    const setHeader = jest.fn<void, [string, string]>();
    const res = { setHeader } as unknown as Response;

    service.setRefreshTokenCookie(res, 'raw-refresh-token');

    const cookieHeader = setHeader.mock.calls[0]?.[1] ?? '';

    expect(setHeader).toHaveBeenCalledWith('Set-Cookie', expect.any(String));
    expect(cookieHeader).toContain('flashcards.refreshToken=raw-refresh-token');
    expect(cookieHeader).toContain('HttpOnly');
    expect(cookieHeader).toContain('SameSite=Lax');
  });

  it('adds Secure attribute in production', () => {
    const service = createService('production');
    const setHeader = jest.fn<void, [string, string]>();
    const res = { setHeader } as unknown as Response;

    service.setRefreshTokenCookie(res, 'raw-refresh-token');

    const cookieHeader = setHeader.mock.calls[0]?.[1] ?? '';

    expect(cookieHeader).toContain('Secure');
  });

  it('reads refresh token from request cookies', () => {
    const service = createService();
    const req = {
      headers: {
        cookie: 'flashcards.refreshToken=cookie-token; other=value',
      },
    } as never;

    expect(service.getRefreshTokenFromRequest(req)).toBe('cookie-token');
  });

  it('clears refresh token cookie', () => {
    const service = createService();
    const setHeader = jest.fn<void, [string, string]>();
    const res = { setHeader } as unknown as Response;

    service.clearRefreshTokenCookie(res);

    const cookieHeader = setHeader.mock.calls[0]?.[1] ?? '';

    expect(cookieHeader).toContain('Max-Age=0');
  });
});
