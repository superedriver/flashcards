import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class UpdateCardInput {
  @Field()
  cardId: string;

  @Field({ nullable: true })
  front?: string;

  @Field({ nullable: true })
  back?: string;

  @Field(() => String, { nullable: true })
  example?: string | null;

  @Field(() => String, { nullable: true })
  notes?: string | null;

  @Field(() => Int, { nullable: true })
  position?: number;
}
