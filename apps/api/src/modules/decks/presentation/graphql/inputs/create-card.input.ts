import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateCardInput {
  @Field()
  deckId: string;

  @Field()
  front: string;

  @Field()
  back: string;

  @Field(() => String, { nullable: true })
  example?: string | null;

  @Field(() => String, { nullable: true })
  notes?: string | null;

  @Field(() => Int, { nullable: true })
  position?: number;
}
