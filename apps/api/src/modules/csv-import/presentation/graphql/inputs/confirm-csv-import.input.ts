import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class ConfirmCsvImportInput {
  @Field()
  importId: string;
}
