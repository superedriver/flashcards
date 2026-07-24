import { Field, Int, ObjectType } from '@nestjs/graphql';
import { LearningGroupGql } from '../../../../lessons/presentation/graphql/types/learning-enums.type';

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

  @Field(() => LearningGroupGql, { nullable: true })
  learningGroup?: LearningGroupGql | null;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
