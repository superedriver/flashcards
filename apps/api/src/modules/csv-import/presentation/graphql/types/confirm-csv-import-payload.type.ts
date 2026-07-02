import { Field, Int, ObjectType } from '@nestjs/graphql';
import { CsvImportType } from './csv-import.type';

@ObjectType('ConfirmCsvImportPayload')
export class ConfirmCsvImportPayloadType {
  @Field(() => CsvImportType)
  import: CsvImportType;

  @Field(() => Int)
  createdCardsCount: number;
}
