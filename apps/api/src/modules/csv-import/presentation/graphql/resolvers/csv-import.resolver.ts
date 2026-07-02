import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthUser } from '../../../../auth/domain/types';
import { CurrentUser } from '../../../../auth/presentation/graphql/decorators/current-user.decorator';
import { GqlAuthGuard } from '../../../../auth/presentation/graphql/guards/gql-auth.guard';
import { PreviewCsvImportUseCase } from '../../../application/use-cases/preview-csv-import.use-case';
import { CsvImport as CsvImportDomain } from '../../../domain/types';
import { PreviewCsvImportInput } from '../inputs/preview-csv-import.input';
import { CsvImportType } from '../types/csv-import.type';
import { CsvImportStatus } from '../types/csv-import-status.type';

@Resolver()
export class CsvImportResolver {
  constructor(
    private readonly previewCsvImportUseCase: PreviewCsvImportUseCase,
  ) {}

  @Mutation(() => CsvImportType)
  @UseGuards(GqlAuthGuard)
  async previewCsvImport(
    @CurrentUser() user: AuthUser,
    @Args('input') input: PreviewCsvImportInput,
  ): Promise<CsvImportType> {
    const result = await this.previewCsvImportUseCase.execute({
      currentUser: user,
      deckId: input.deckId,
      csvText: input.csvText,
    });

    return toCsvImportType(result);
  }
}

function toCsvImportType(csvImport: CsvImportDomain): CsvImportType {
  return {
    id: csvImport.id,
    deckId: csvImport.deckId,
    status: csvImport.status as CsvImportStatus,
    totalRows: csvImport.totalRows,
    validRows: csvImport.validRows,
    invalidRows: csvImport.invalidRows,
    previewRows: csvImport.previewRows,
    errors: csvImport.errors,
    createdAt: csvImport.createdAt,
    confirmedAt: csvImport.confirmedAt,
    expiresAt: csvImport.expiresAt,
  };
}
