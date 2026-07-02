import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType('CsvImportRowError')
export class CsvImportRowErrorType {
  @Field(() => Int)
  rowNumber: number;

  @Field()
  field: string;

  @Field()
  message: string;
}
