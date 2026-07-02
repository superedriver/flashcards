import { AuthUser } from '../../../auth/domain/types';

export class AdminPermissionService {
  canAccessAdmin(user: AuthUser | null): boolean {
    return user?.role === 'ADMIN';
  }

  canModerateDecks(user: AuthUser | null): boolean {
    return user?.role === 'ADMIN' || user?.role === 'MODERATOR';
  }

  canManageUsers(user: AuthUser | null): boolean {
    return user?.role === 'ADMIN';
  }

  canSetOfficialDeck(user: AuthUser | null): boolean {
    return user?.role === 'ADMIN';
  }
}
