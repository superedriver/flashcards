import { Field, Int, ObjectType } from '@nestjs/graphql';
import { GroupMemberPreviewType } from './group-member-preview.type';
import { GroupRole } from './group-role.type';

@ObjectType('Group')
export class GroupType {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field(() => String, { nullable: true })
  description: string | null;

  @Field()
  createdById: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => GroupRole, { nullable: true })
  myRole: GroupRole | null;

  @Field(() => Int, { nullable: true })
  memberCount: number | null;

  @Field(() => [GroupMemberPreviewType])
  membersPreview: GroupMemberPreviewType[];
}
