import { Field, Int, ObjectType } from '@nestjs/graphql';
import { CardReviewStateType } from './card-review-state.type';
import { LearningGroupGql, PromptDirectionGql } from './learning-enums.type';

@ObjectType('LessonCard')
export class LessonCardType {
  @Field()
  cardId: string;

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

  @Field(() => Int)
  learningStep: number;

  @Field(() => LearningGroupGql)
  learningGroup: LearningGroupGql;

  @Field(() => PromptDirectionGql)
  promptDirection: PromptDirectionGql;

  @Field(() => CardReviewStateType)
  reviewState: CardReviewStateType;
}
