import { Field, ObjectType } from '@nestjs/graphql';
import { UserRole } from '../../../../auth/presentation/graphql/types/user-role.type';

@ObjectType('AdminUserSummary')
export class AdminUserSummaryType {
  @Field()
  id: string;

  @Field()
  email: string;

  @Field(() => UserRole)
  role: UserRole;

  @Field(() => Date, { nullable: true })
  emailVerifiedAt: Date | null;

  @Field(() => Date, { nullable: true })
  blockedAt: Date | null;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
