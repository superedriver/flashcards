import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../infrastructure/prisma';
import {
  CreateCsvImportInput,
  CsvImportRepositoryPort,
} from '../../application/ports/csv-import-repository.port';
import { CsvImport } from '../../domain/types';
import { toCsvImport } from '../mappers/csv-import.mapper';

@Injectable()
export class PrismaCsvImportRepository implements CsvImportRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async create(input: CreateCsvImportInput): Promise<CsvImport> {
    const record = await this.prisma.csvImport.create({
      data: {
        userId: input.userId,
        deckId: input.deckId,
        totalRows: input.totalRows,
        validRows: input.validRows,
        invalidRows: input.invalidRows,
        previewRows: input.previewRows,
        errors: input.errors.length > 0 ? input.errors : undefined,
        expiresAt: input.expiresAt,
      },
    });

    return toCsvImport(record);
  }

  async findById(importId: string): Promise<CsvImport | null> {
    const record = await this.prisma.csvImport.findUnique({
      where: {
        id: importId,
      },
    });

    return record ? toCsvImport(record) : null;
  }

  async markConfirmed(importId: string, confirmedAt: Date): Promise<CsvImport> {
    const record = await this.prisma.csvImport.update({
      where: {
        id: importId,
      },
      data: {
        status: 'CONFIRMED',
        confirmedAt,
      },
    });

    return toCsvImport(record);
  }

  async markExpired(importId: string): Promise<CsvImport> {
    const record = await this.prisma.csvImport.update({
      where: {
        id: importId,
      },
      data: {
        status: 'EXPIRED',
      },
    });

    return toCsvImport(record);
  }
}
