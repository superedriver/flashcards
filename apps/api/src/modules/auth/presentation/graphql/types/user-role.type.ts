import { registerEnumType } from '@nestjs/graphql';

export enum UserRole {
  USER = 'USER',
  MODERATOR = 'MODERATOR',
  ADMIN = 'ADMIN',
}

registerEnumType(UserRole, {
  name: 'UserRole',
});
