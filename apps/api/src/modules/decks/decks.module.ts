import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { CARD_REPOSITORY } from './application/ports/card-repository.port';
import { DECK_REPOSITORY } from './application/ports/deck-repository.port';
import { CreateDeckUseCase } from './application/use-cases/create-deck.use-case';
import { MyDecksUseCase } from './application/use-cases/my-decks.use-case';
import { PrismaCardRepository } from './infrastructure/persistence/prisma-card.repository';
import { PrismaDeckRepository } from './infrastructure/persistence/prisma-deck.repository';
import { DecksResolver } from './presentation/graphql/resolvers/decks.resolver';

@Module({
  imports: [AuthModule],
  providers: [
    {
      provide: DECK_REPOSITORY,
      useClass: PrismaDeckRepository,
    },
    {
      provide: CARD_REPOSITORY,
      useClass: PrismaCardRepository,
    },
    CreateDeckUseCase,
    MyDecksUseCase,
    DecksResolver,
  ],
  exports: [
    DECK_REPOSITORY,
    CARD_REPOSITORY,
    CreateDeckUseCase,
    MyDecksUseCase,
  ],
})
export class DecksModule {}
