import { normalizeGroupEmail } from './normalize-group-email';

describe('normalizeGroupEmail', () => {
  it('trims whitespace', () => {
    expect(normalizeGroupEmail('  user@example.com  ')).toBe(
      'user@example.com',
    );
  });

  it('lowercases email', () => {
    expect(normalizeGroupEmail('User@Example.COM')).toBe('user@example.com');
  });
});
