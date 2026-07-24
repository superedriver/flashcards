import { Inject, Injectable } from '@nestjs/common';
import {
  CARD_REVIEW_STATE_REPOSITORY,
  CardReviewStateRepositoryPort,
} from '../ports/card-review-state-repository.port';

@Injectable()
export class EnsureCardReviewStatesService {
  constructor(
    @Inject(CARD_REVIEW_STATE_REPOSITORY)
    private readonly cardReviewStateRepository: CardReviewStateRepositoryPort,
  ) {}

  async ensureInitialForCards(input: {
    userId: string;
    cardIds: string[];
    now?: Date;
  }): Promise<void> {
    await this.cardReviewStateRepository.createInitialMany(input);
  }
}
