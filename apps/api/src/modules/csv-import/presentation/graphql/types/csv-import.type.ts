import { Field, Int, ObjectType } from '@nestjs/graphql';
import { CsvImportPreviewRowType } from './csv-import-preview-row.type';
import { CsvImportRowErrorType } from './csv-import-row-error.type';
import { CsvImportStatus } from './csv-import-status.type';

@ObjectType('CsvImport')
export class CsvImportType {
  @Field()
  id: string;

  @Field()
  deckId: string;

  @Field(() => CsvImportStatus)
  status: CsvImportStatus;

  @Field(() => Int)
  totalRows: number;

  @Field(() => Int)
  validRows: number;

  @Field(() => Int)
  invalidRows: number;

  @Field(() => [CsvImportPreviewRowType])
  previewRows: CsvImportPreviewRowType[];

  @Field(() => [CsvImportRowErrorType])
  errors: CsvImportRowErrorType[];

  @Field()
  createdAt: Date;

  @Field(() => Date, { nullable: true })
  confirmedAt: Date | null;

  @Field()
  expiresAt: Date;
}
