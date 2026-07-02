import { Module } from '@nestjs/common';
import { CSV_IMPORT_REPOSITORY } from './application/ports/csv-import-repository.port';
import { PrismaCsvImportRepository } from './infrastructure/persistence/prisma-csv-import.repository';

@Module({
  providers: [
    {
      provide: CSV_IMPORT_REPOSITORY,
      useClass: PrismaCsvImportRepository,
    },
  ],
  exports: [CSV_IMPORT_REPOSITORY],
})
export class CsvImportModule {}
