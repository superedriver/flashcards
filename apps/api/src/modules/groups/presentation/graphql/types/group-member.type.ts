import { Field, ObjectType } from '@nestjs/graphql';
import { GroupRole } from './group-role.type';

@ObjectType('GroupMember')
export class GroupMemberType {
  @Field()
  id: string;

  @Field()
  groupId: string;

  @Field()
  userId: string;

  @Field(() => GroupRole)
  role: GroupRole;

  @Field()
  createdAt: Date;
}
