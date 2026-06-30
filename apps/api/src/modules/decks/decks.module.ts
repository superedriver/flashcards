import { Module } from '@nestjs/common';
import { CARD_REPOSITORY } from './application/ports/card-repository.port';
import { DECK_REPOSITORY } from './application/ports/deck-repository.port';
import { PrismaCardRepository } from './infrastructure/persistence/prisma-card.repository';
import { PrismaDeckRepository } from './infrastructure/persistence/prisma-deck.repository';

@Module({
  providers: [
    {
      provide: DECK_REPOSITORY,
      useClass: PrismaDeckRepository,
    },
    {
      provide: CARD_REPOSITORY,
      useClass: PrismaCardRepository,
    },
  ],
  exports: [DECK_REPOSITORY, CARD_REPOSITORY],
})
export class DecksModule {}
