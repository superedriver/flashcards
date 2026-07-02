import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class PreviewCsvImportInput {
  @Field()
  deckId: string;

  @Field()
  csvText: string;
}
