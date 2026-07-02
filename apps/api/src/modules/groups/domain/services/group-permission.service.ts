import { GroupMember } from '../types';

export class GroupPermissionService {
  canViewGroup(member: GroupMember | null): boolean {
    return member !== null;
  }

  canInviteToGroup(member: GroupMember | null): boolean {
    return member?.role === 'OWNER' || member?.role === 'ADMIN';
  }

  canShareDeckWithGroup(member: GroupMember | null): boolean {
    return member?.role === 'OWNER' || member?.role === 'ADMIN';
  }
}
