import { sanitizeLogMessage } from './sanitize-log-message';

describe('sanitizeLogMessage', () => {
  it('redacts bearer tokens', () => {
    expect(sanitizeLogMessage('Auth failed Bearer abc.def.ghi')).toBe(
      'Auth failed Bearer [REDACTED]',
    );
  });

  it('redacts reset links with token query params', () => {
    expect(
      sanitizeLogMessage(
        'Failed at https://app.example/reset?token=secret-value',
      ),
    ).toBe('Failed at https://app.example/reset?token=[REDACTED]');
  });

  it('redacts database urls', () => {
    expect(
      sanitizeLogMessage(
        'connect postgresql://user:pass@host/db?sslmode=require',
      ),
    ).toBe('connect postgresql://[REDACTED]');
  });

  it('redacts JSON password fields', () => {
    expect(
      sanitizeLogMessage('variables={"password":"secret-password-123"}'),
    ).toBe('variables={"password":"[REDACTED]"}');
  });

  it('redacts JSON refresh and access tokens', () => {
    expect(
      sanitizeLogMessage(
        '{"accessToken":"jwt-value","refreshToken":"opaque-token"}',
      ),
    ).toBe('{"accessToken":"[REDACTED]","refreshToken":"[REDACTED]"}');
  });

  it('redacts password key-value pairs', () => {
    expect(sanitizeLogMessage('login failed password=my-secret')).toBe(
      'login failed password=[REDACTED]',
    );
  });

  it('preserves normal operational messages', () => {
    expect(sanitizeLogMessage('Health check status=ok')).toBe(
      'Health check status=ok',
    );
  });
});
