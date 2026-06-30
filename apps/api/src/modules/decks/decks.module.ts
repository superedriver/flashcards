import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { CARD_REPOSITORY } from './application/ports/card-repository.port';
import { DECK_REPOSITORY } from './application/ports/deck-repository.port';
import { CreateDeckUseCase } from './application/use-cases/create-deck.use-case';
import { DeleteDeckUseCase } from './application/use-cases/delete-deck.use-case';
import { GetDeckUseCase } from './application/use-cases/get-deck.use-case';
import { MyDecksUseCase } from './application/use-cases/my-decks.use-case';
import { UpdateDeckUseCase } from './application/use-cases/update-deck.use-case';
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
  ],
})
export class DecksModule {}
