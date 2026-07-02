import { Inject, Injectable } from '@nestjs/common';
import { ApplicationError, ErrorCodes } from '../../../../common/errors';
import {
  USER_REPOSITORY,
  UserRepositoryPort,
} from '../../../auth/application/ports/user-repository.port';
import { AuthUser } from '../../../auth/domain/types';
import {
  CARD_REPOSITORY,
  CardRepositoryPort,
} from '../../../decks/application/ports/card-repository.port';
import {
  DECK_REPOSITORY,
  DeckRepositoryPort,
} from '../../../decks/application/ports/deck-repository.port';
import { DeckPermissionService } from '../../../decks/domain/services/deck-permission.service';
import { CsvImport } from '../../domain/types';
import {
  CSV_IMPORT_REPOSITORY,
  CsvImportRepositoryPort,
} from '../ports/csv-import-repository.port';

export type ConfirmCsvImportUseCaseInput = {
  currentUser: AuthUser;
  importId: string;
};

export type ConfirmCsvImportUseCaseResult = {
  import: CsvImport;
  createdCardsCount: number;
};

@Injectable()
export class ConfirmCsvImportUseCase {
  private readonly deckPermissionService = new DeckPermissionService();

  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
    @Inject(DECK_REPOSITORY)
    private readonly deckRepository: DeckRepositoryPort,
    @Inject(CARD_REPOSITORY)
    private readonly cardRepository: CardRepositoryPort,
    @Inject(CSV_IMPORT_REPOSITORY)
    private readonly csvImportRepository: CsvImportRepositoryPort,
  ) {}

  async execute(
    input: ConfirmCsvImportUseCaseInput,
  ): Promise<ConfirmCsvImportUseCaseResult> {
    const user = await this.userRepository.findById(input.currentUser.id);

    if (!user) {
      throw new ApplicationError(ErrorCodes.UNAUTHORIZED, 'Unauthorized');
    }

    if (user.blockedAt !== null) {
      throw new ApplicationError(ErrorCodes.USER_BLOCKED, 'User is blocked');
    }

    const csvImport = await this.csvImportRepository.findById(input.importId);

    if (!csvImport) {
      throw new ApplicationError(ErrorCodes.NOT_FOUND, 'CSV import not found');
    }

    if (csvImport.userId !== input.currentUser.id) {
      throw new ApplicationError(ErrorCodes.FORBIDDEN, 'Forbidden');
    }

    if (csvImport.status !== 'PENDING') {
      throw new ApplicationError(
        ErrorCodes.VALIDATION_ERROR,
        'CSV import is not pending',
      );
    }

    const now = new Date();

    if (csvImport.expiresAt <= now) {
      await this.csvImportRepository.markExpired(csvImport.id);
      throw new ApplicationError(
        ErrorCodes.VALIDATION_ERROR,
        'CSV import has expired',
      );
    }

    const deck = await this.deckRepository.findById(csvImport.deckId);

    if (!deck) {
      throw new ApplicationError(ErrorCodes.DECK_NOT_FOUND, 'Deck not found');
    }

    const canManage = this.deckPermissionService.canManageDeck({
      user: input.currentUser,
      deck,
    });

    if (!canManage) {
      throw new ApplicationError(ErrorCodes.DECK_FORBIDDEN, 'Deck forbidden');
    }

    const validRows = csvImport.previewRows.filter((row) => row.isValid);

    if (validRows.length === 0) {
      throw new ApplicationError(
        ErrorCodes.VALIDATION_ERROR,
        'No valid rows to import',
      );
    }

    const startPosition = await this.cardRepository.countByDeckId(
      csvImport.deckId,
    );

    await this.cardRepository.createMany({
      cards: validRows.map((row, index) => ({
        deckId: csvImport.deckId,
        front: row.front,
        back: row.back,
        example: row.example,
        notes: row.notes,
        position: startPosition + index,
      })),
    });

    const confirmedImport = await this.csvImportRepository.markConfirmed(
      csvImport.id,
      now,
    );

    return {
      import: confirmedImport,
      createdCardsCount: validRows.length,
    };
  }
}
