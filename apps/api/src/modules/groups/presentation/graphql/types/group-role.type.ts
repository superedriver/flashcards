import { registerEnumType } from '@nestjs/graphql';

export enum GroupRole {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
}

registerEnumType(GroupRole, {
  name: 'GroupRole',
});
