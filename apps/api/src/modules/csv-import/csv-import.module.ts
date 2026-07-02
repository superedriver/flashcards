import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { DecksModule } from '../decks/decks.module';
import { CSV_IMPORT_REPOSITORY } from './application/ports/csv-import-repository.port';
import { PreviewCsvImportUseCase } from './application/use-cases/preview-csv-import.use-case';
import { PrismaCsvImportRepository } from './infrastructure/persistence/prisma-csv-import.repository';

@Module({
  imports: [AuthModule, DecksModule],
  providers: [
    {
      provide: CSV_IMPORT_REPOSITORY,
      useClass: PrismaCsvImportRepository,
    },
    PreviewCsvImportUseCase,
  ],
  exports: [CSV_IMPORT_REPOSITORY, PreviewCsvImportUseCase],
})
export class CsvImportModule {}
