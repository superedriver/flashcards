import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class UpdateDeckPreviewCardInput {
  @Field()
  sessionId: string;

  @Field(() => Int)
  cardIndex: number;

  @Field({ nullable: true })
  back?: string;

  @Field(() => String, { nullable: true })
  example?: string | null;
}
