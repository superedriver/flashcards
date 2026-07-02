import { GroupMember } from '../types';
import { GroupPermissionService } from './group-permission.service';

function createMember(role: GroupMember['role']): GroupMember {
  return {
    id: 'member-1',
    groupId: 'group-1',
    userId: 'user-1',
    role,
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-01T00:00:00.000Z'),
  };
}

describe('GroupPermissionService', () => {
  const service = new GroupPermissionService();

  describe('canViewGroup', () => {
    it('returns true for any member', () => {
      expect(service.canViewGroup(createMember('OWNER'))).toBe(true);
      expect(service.canViewGroup(createMember('ADMIN'))).toBe(true);
      expect(service.canViewGroup(createMember('MEMBER'))).toBe(true);
    });

    it('returns false for null member', () => {
      expect(service.canViewGroup(null)).toBe(false);
    });
  });

  describe('canInviteToGroup', () => {
    it('returns true for OWNER', () => {
      expect(service.canInviteToGroup(createMember('OWNER'))).toBe(true);
    });

    it('returns true for ADMIN', () => {
      expect(service.canInviteToGroup(createMember('ADMIN'))).toBe(true);
    });

    it('returns false for MEMBER', () => {
      expect(service.canInviteToGroup(createMember('MEMBER'))).toBe(false);
    });

    it('returns false for null member', () => {
      expect(service.canInviteToGroup(null)).toBe(false);
    });
  });

  describe('canShareDeckWithGroup', () => {
    it('returns true for OWNER', () => {
      expect(service.canShareDeckWithGroup(createMember('OWNER'))).toBe(true);
    });

    it('returns true for ADMIN', () => {
      expect(service.canShareDeckWithGroup(createMember('ADMIN'))).toBe(true);
    });

    it('returns false for MEMBER', () => {
      expect(service.canShareDeckWithGroup(createMember('MEMBER'))).toBe(false);
    });

    it('returns false for null member', () => {
      expect(service.canShareDeckWithGroup(null)).toBe(false);
    });
  });
});
