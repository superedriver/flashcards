import { registerEnumType } from '@nestjs/graphql';

export enum CsvImportStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED',
}

registerEnumType(CsvImportStatus, {
  name: 'CsvImportStatus',
});
