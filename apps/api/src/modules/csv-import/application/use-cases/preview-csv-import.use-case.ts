import { Inject, Injectable } from '@nestjs/common';
import { ApplicationError, ErrorCodes } from '../../../../common/errors';
import {
  USER_REPOSITORY,
  UserRepositoryPort,
} from '../../../auth/application/ports/user-repository.port';
import { AuthUser } from '../../../auth/domain/types';
import {
  DECK_REPOSITORY,
  DeckRepositoryPort,
} from '../../../decks/application/ports/deck-repository.port';
import { DeckPermissionService } from '../../../decks/domain/services/deck-permission.service';
import { CsvParserService } from '../../domain/services/csv-parser.service';
import { CsvImport } from '../../domain/types';
import {
  CSV_IMPORT_REPOSITORY,
  CsvImportRepositoryPort,
} from '../ports/csv-import-repository.port';

export type PreviewCsvImportUseCaseInput = {
  currentUser: AuthUser;
  deckId: string;
  csvText: string;
};

export type PreviewCsvImportUseCaseResult = CsvImport;

const IMPORT_EXPIRY_HOURS = 24;

@Injectable()
export class PreviewCsvImportUseCase {
  private readonly deckPermissionService = new DeckPermissionService();
  private readonly csvParserService = new CsvParserService();

  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
    @Inject(DECK_REPOSITORY)
    private readonly deckRepository: DeckRepositoryPort,
    @Inject(CSV_IMPORT_REPOSITORY)
    private readonly csvImportRepository: CsvImportRepositoryPort,
  ) {}

  async execute(
    input: PreviewCsvImportUseCaseInput,
  ): Promise<PreviewCsvImportUseCaseResult> {
    const user = await this.userRepository.findById(input.currentUser.id);

    if (!user) {
      throw new ApplicationError(ErrorCodes.UNAUTHORIZED, 'Unauthorized');
    }

    if (user.blockedAt !== null) {
      throw new ApplicationError(ErrorCodes.USER_BLOCKED, 'User is blocked');
    }

    const deck = await this.deckRepository.findById(input.deckId);

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

    const parsed = this.csvParserService.parse({ csvText: input.csvText });
    const expiresAt = new Date(
      Date.now() + IMPORT_EXPIRY_HOURS * 60 * 60 * 1000,
    );

    return this.csvImportRepository.create({
      userId: input.currentUser.id,
      deckId: input.deckId,
      totalRows: parsed.totalRows,
      validRows: parsed.validRows,
      invalidRows: parsed.invalidRows,
      previewRows: parsed.previewRows,
      errors: parsed.errors,
      expiresAt,
    });
  }
}
