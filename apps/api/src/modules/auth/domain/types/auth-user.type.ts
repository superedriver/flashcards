import { UserRole } from './user-role.type';

export type AuthUser = {
  id: string;
  email: string;
  role: UserRole;
};
