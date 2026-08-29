import { memberInitials } from './member-initials';

describe('memberInitials', () => {
  it('uses the first letter of the display name', () => {
    expect(memberInitials('Maria Santos', 'maria@example.com')).toBe('M');
  });

  it('falls back to the email local part', () => {
    expect(memberInitials(null, 'sofia@example.com')).toBe('S');
  });

  it('returns a placeholder when both are empty', () => {
    expect(memberInitials('   ', '')).toBe('?');
  });
});
