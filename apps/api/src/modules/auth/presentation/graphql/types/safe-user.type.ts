import { Field, ObjectType } from '@nestjs/graphql';
import { UserRole } from './user-role.type';

@ObjectType('SafeUser')
export class SafeUserType {
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
