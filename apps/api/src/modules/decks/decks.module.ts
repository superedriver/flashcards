import { Module } from '@nestjs/common';
import { DECK_REPOSITORY } from './application/ports/deck-repository.port';
import { PrismaDeckRepository } from './infrastructure/persistence/prisma-deck.repository';

@Module({
  providers: [
    {
      provide: DECK_REPOSITORY,
      useClass: PrismaDeckRepository,
    },
  ],
  exports: [DECK_REPOSITORY],
})
export class DecksModule {}
