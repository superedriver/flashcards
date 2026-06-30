import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType('Card')
export class CardType {
  @Field()
  id: string;

  @Field()
  deckId: string;

  @Field()
  front: string;

  @Field()
  back: string;

  @Field(() => String, { nullable: true })
  example: string | null;

  @Field(() => String, { nullable: true })
  notes: string | null;

  @Field(() => Int)
  position: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
