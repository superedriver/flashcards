export type AuthEmailContent = {
  subject: string;
  text: string;
  html: string;
};

function buildAuthLink(appWebUrl: string, path: string, token: string): string {
  const baseUrl = appWebUrl.replace(/\/$/, '');

  return `${baseUrl}${path}?token=${encodeURIComponent(token)}`;
}

export function buildVerificationEmail(input: {
  appWebUrl: string;
  token: string;
}): AuthEmailContent {
  const link = buildAuthLink(input.appWebUrl, '/verify-email', input.token);

  return {
    subject: 'Verify your email',
    text: [
      'Please verify your email address for Flashcards.',
      '',
      `Verify your email: ${link}`,
      '',
      'This link expires in 24 hours.',
      'If you did not create an account, you can ignore this email.',
    ].join('\n'),
    html: [
      '<p>Please verify your email address for Flashcards.</p>',
      `<p><a href="${link}">Verify your email</a></p>`,
      '<p>This link expires in 24 hours.</p>',
      '<p>If you did not create an account, you can ignore this email.</p>',
    ].join('\n'),
  };
}

export function buildPasswordResetEmail(input: {
  appWebUrl: string;
  token: string;
}): AuthEmailContent {
  const link = buildAuthLink(input.appWebUrl, '/reset-password', input.token);

  return {
    subject: 'Reset your password',
    text: [
      'We received a request to reset your Flashcards password.',
      '',
      `Reset your password: ${link}`,
      '',
      'This link expires in 1 hour.',
      'If you did not request a password reset, you can ignore this email.',
    ].join('\n'),
    html: [
      '<p>We received a request to reset your Flashcards password.</p>',
      `<p><a href="${link}">Reset your password</a></p>`,
      '<p>This link expires in 1 hour.</p>',
      '<p>If you did not request a password reset, you can ignore this email.</p>',
    ].join('\n'),
  };
}
