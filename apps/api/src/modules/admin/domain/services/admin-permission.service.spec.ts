import { AuthUser } from '../../../auth/domain/types';
import { AdminPermissionService } from './admin-permission.service';

function createAuthUser(role: AuthUser['role']): AuthUser {
  return {
    id: `${role.toLowerCase()}-1`,
    email: `${role.toLowerCase()}@example.com`,
    role,
  };
}

describe('AdminPermissionService', () => {
  const service = new AdminPermissionService();

  describe('canAccessAdmin', () => {
    it('returns true for ADMIN', () => {
      expect(service.canAccessAdmin(createAuthUser('ADMIN'))).toBe(true);
    });

    it('returns false for MODERATOR', () => {
      expect(service.canAccessAdmin(createAuthUser('MODERATOR'))).toBe(false);
    });

    it('returns false for USER', () => {
      expect(service.canAccessAdmin(createAuthUser('USER'))).toBe(false);
    });

    it('returns false for null user', () => {
      expect(service.canAccessAdmin(null)).toBe(false);
    });
  });

  describe('canModerateDecks', () => {
    it('returns true for ADMIN', () => {
      expect(service.canModerateDecks(createAuthUser('ADMIN'))).toBe(true);
    });

    it('returns true for MODERATOR', () => {
      expect(service.canModerateDecks(createAuthUser('MODERATOR'))).toBe(true);
    });

    it('returns false for USER', () => {
      expect(service.canModerateDecks(createAuthUser('USER'))).toBe(false);
    });

    it('returns false for null user', () => {
      expect(service.canModerateDecks(null)).toBe(false);
    });
  });

  describe('canManageUsers', () => {
    it('returns true for ADMIN', () => {
      expect(service.canManageUsers(createAuthUser('ADMIN'))).toBe(true);
    });

    it('returns false for MODERATOR', () => {
      expect(service.canManageUsers(createAuthUser('MODERATOR'))).toBe(false);
    });

    it('returns false for USER', () => {
      expect(service.canManageUsers(createAuthUser('USER'))).toBe(false);
    });

    it('returns false for null user', () => {
      expect(service.canManageUsers(null)).toBe(false);
    });
  });

  describe('canSetOfficialDeck', () => {
    it('returns true for ADMIN', () => {
      expect(service.canSetOfficialDeck(createAuthUser('ADMIN'))).toBe(true);
    });

    it('returns false for MODERATOR', () => {
      expect(service.canSetOfficialDeck(createAuthUser('MODERATOR'))).toBe(
        false,
      );
    });

    it('returns false for USER', () => {
      expect(service.canSetOfficialDeck(createAuthUser('USER'))).toBe(false);
    });

    it('returns false for null user', () => {
      expect(service.canSetOfficialDeck(null)).toBe(false);
    });
  });
});
