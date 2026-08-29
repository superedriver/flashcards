import { Field, Int, ObjectType } from '@nestjs/graphql';
import { GroupInvitationStatus } from './group-invitation-status.type';

@ObjectType('GroupInvitation')
export class GroupInvitationType {
  @Field()
  id: string;

  @Field()
  groupId: string;

  @Field()
  email: string;

  @Field()
  invitedById: string;

  @Field(() => GroupInvitationStatus)
  status: GroupInvitationStatus;

  @Field()
  expiresAt: Date;

  @Field()
  createdAt: Date;

  @Field(() => Date, { nullable: true })
  acceptedAt: Date | null;

  @Field(() => Date, { nullable: true })
  declinedAt: Date | null;

  @Field(() => String, { nullable: true })
  groupName: string | null;

  @Field(() => String, { nullable: true })
  invitedByEmail: string | null;

  @Field(() => Int, { nullable: true })
  memberCount: number | null;

  @Field(() => Int, { nullable: true })
  sharedDeckCount: number | null;
}
