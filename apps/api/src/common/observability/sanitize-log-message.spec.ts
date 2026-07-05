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
});
