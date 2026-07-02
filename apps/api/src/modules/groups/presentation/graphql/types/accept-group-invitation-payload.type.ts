import { Field, ObjectType } from '@nestjs/graphql';
import { GroupInvitationType } from './group-invitation.type';
import { GroupMemberType } from './group-member.type';

@ObjectType('AcceptGroupInvitationPayload')
export class AcceptGroupInvitationPayloadType {
  @Field(() => GroupInvitationType)
  invitation: GroupInvitationType;

  @Field(() => GroupMemberType)
  member: GroupMemberType;
}
