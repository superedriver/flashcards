import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType('UserProfile')
export class UserProfileType {
  @Field()
  id: string;

  @Field()
  userId: string;

  @Field(() => String, { nullable: true })
  displayName: string | null;

  @Field(() => String, { nullable: true })
  avatarUrl: string | null;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
