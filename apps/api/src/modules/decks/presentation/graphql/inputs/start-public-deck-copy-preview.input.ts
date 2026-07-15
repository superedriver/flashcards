import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class StartPublicDeckCopyPreviewInput {
  @Field()
  sourceDeckId: string;

  @Field()
  chosenSourceLanguage: string;

  @Field({ nullable: true })
  discardActive?: boolean;
}
