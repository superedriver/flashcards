import { Field, Int, ObjectType } from '@nestjs/graphql';
import { CsvImportRowErrorType } from './csv-import-row-error.type';

@ObjectType('CsvImportPreviewRow')
export class CsvImportPreviewRowType {
  @Field(() => Int)
  rowNumber: number;

  @Field()
  front: string;

  @Field()
  back: string;

  @Field(() => String, { nullable: true })
  example: string | null;

  @Field(() => String, { nullable: true })
  notes: string | null;

  @Field()
  isValid: boolean;

  @Field(() => [CsvImportRowErrorType])
  errors: CsvImportRowErrorType[];
}
