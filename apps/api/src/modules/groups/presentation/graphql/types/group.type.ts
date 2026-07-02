import { Field, ObjectType } from '@nestjs/graphql';

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
}
