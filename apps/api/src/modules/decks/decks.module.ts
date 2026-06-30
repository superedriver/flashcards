import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { CARD_REPOSITORY } from './application/ports/card-repository.port';
import { DECK_REPOSITORY } from './application/ports/deck-repository.port';
import { CreateCardUseCase } from './application/use-cases/create-card.use-case';
import { CreateDeckUseCase } from './application/use-cases/create-deck.use-case';
import { DeckCardsUseCase } from './application/use-cases/deck-cards.use-case';
import { DeleteDeckUseCase } from './application/use-cases/delete-deck.use-case';
import { DeleteCardUseCase } from './application/use-cases/delete-card.use-case';
import { GetDeckUseCase } from './application/use-cases/get-deck.use-case';
import { MyDecksUseCase } from './application/use-cases/my-decks.use-case';
import { PublishDeckUseCase } from './application/use-cases/publish-deck.use-case';
import { UpdateDeckUseCase } from './application/use-cases/update-deck.use-case';
import { UpdateCardUseCase } from './application/use-cases/update-card.use-case';
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
    GetDeckUseCase,
    UpdateDeckUseCase,
    DeleteDeckUseCase,
    CreateCardUseCase,
    DeckCardsUseCase,
    UpdateCardUseCase,
    DeleteCardUseCase,
    PublishDeckUseCase,
    DecksResolver,
  ],
  exports: [
    DECK_REPOSITORY,
    CARD_REPOSITORY,
    CreateDeckUseCase,
    MyDecksUseCase,
    GetDeckUseCase,
    UpdateDeckUseCase,
    DeleteDeckUseCase,
    CreateCardUseCase,
    DeckCardsUseCase,
    UpdateCardUseCase,
    DeleteCardUseCase,
    PublishDeckUseCase,
  ],
})
export class DecksModule {}
