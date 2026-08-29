import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType('GroupMemberPreview')
export class GroupMemberPreviewType {
  @Field()
  userId: string;

  @Field()
  initials: string;
}
