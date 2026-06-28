import {
  buildPasswordResetEmail,
  buildVerificationEmail,
} from './email-templates';

const appWebUrl = 'http://localhost:8081';

describe('email templates', () => {
  it('buildVerificationEmail returns subject, text, and html', () => {
    const email = buildVerificationEmail({
      appWebUrl,
      token: 'verify-token',
    });

    expect(email.subject).toBe('Verify your email');
    expect(email.text).toBeTruthy();
    expect(email.html).toBeTruthy();
  });

  it('buildVerificationEmail uses verify link with APP_WEB_URL', () => {
    const email = buildVerificationEmail({
      appWebUrl,
      token: 'verify-token',
    });

    expect(email.text).toContain(
      'http://localhost:8081/verify-email?token=verify-token',
    );
    expect(email.html).toContain(
      'http://localhost:8081/verify-email?token=verify-token',
    );
    expect(email.text).toContain('24 hours');
    expect(email.text).toContain('ignore this email');
  });

  it('buildPasswordResetEmail returns subject, text, and html', () => {
    const email = buildPasswordResetEmail({
      appWebUrl,
      token: 'reset-token',
    });

    expect(email.subject).toBe('Reset your password');
    expect(email.text).toBeTruthy();
    expect(email.html).toBeTruthy();
  });

  it('buildPasswordResetEmail uses reset link with APP_WEB_URL', () => {
    const email = buildPasswordResetEmail({
      appWebUrl,
      token: 'reset-token',
    });

    expect(email.text).toContain(
      'http://localhost:8081/reset-password?token=reset-token',
    );
    expect(email.html).toContain(
      'http://localhost:8081/reset-password?token=reset-token',
    );
    expect(email.text).toContain('1 hour');
    expect(email.text).toContain('ignore this email');
  });

  it('URL-encodes special characters in token links', () => {
    const token = 'abc+special/token';
    const email = buildVerificationEmail({ appWebUrl, token });

    expect(email.text).toContain('token=abc%2Bspecial%2Ftoken');
    expect(email.html).toContain('token=abc%2Bspecial%2Ftoken');
  });

  it('strips trailing slash from APP_WEB_URL', () => {
    const email = buildVerificationEmail({
      appWebUrl: 'http://localhost:8081/',
      token: 'verify-token',
    });

    expect(email.text).toContain(
      'http://localhost:8081/verify-email?token=verify-token',
    );
  });
});
