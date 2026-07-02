import { Module, forwardRef } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { GroupsModule } from '../groups/groups.module';
import { CARD_REPOSITORY } from './application/ports/card-repository.port';
import { DECK_REPOSITORY } from './application/ports/deck-repository.port';
import { CopyPublicDeckUseCase } from './application/use-cases/copy-public-deck.use-case';
import { CreateCardUseCase } from './application/use-cases/create-card.use-case';
import { CreateDeckUseCase } from './application/use-cases/create-deck.use-case';
import { DeckCardsUseCase } from './application/use-cases/deck-cards.use-case';
import { DeleteDeckUseCase } from './application/use-cases/delete-deck.use-case';
import { DeleteCardUseCase } from './application/use-cases/delete-card.use-case';
import { GetDeckUseCase } from './application/use-cases/get-deck.use-case';
import { MyDecksUseCase } from './application/use-cases/my-decks.use-case';
import { PublishDeckUseCase } from './application/use-cases/publish-deck.use-case';
import { PublicDeckCardsUseCase } from './application/use-cases/public-deck-cards.use-case';
import { PublicDeckUseCase } from './application/use-cases/public-deck.use-case';
import { PublicDecksUseCase } from './application/use-cases/public-decks.use-case';
import { UnpublishDeckUseCase } from './application/use-cases/unpublish-deck.use-case';
import { UpdateDeckUseCase } from './application/use-cases/update-deck.use-case';
import { UpdateCardUseCase } from './application/use-cases/update-card.use-case';
import { PrismaCardRepository } from './infrastructure/persistence/prisma-card.repository';
import { PrismaDeckRepository } from './infrastructure/persistence/prisma-deck.repository';
import { DecksResolver } from './presentation/graphql/resolvers/decks.resolver';

@Module({
  imports: [AuthModule, forwardRef(() => GroupsModule)],
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
    CopyPublicDeckUseCase,
    DeckCardsUseCase,
    UpdateCardUseCase,
    DeleteCardUseCase,
    PublishDeckUseCase,
    PublicDeckCardsUseCase,
    PublicDeckUseCase,
    PublicDecksUseCase,
    UnpublishDeckUseCase,
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
    CopyPublicDeckUseCase,
    DeckCardsUseCase,
    UpdateCardUseCase,
    DeleteCardUseCase,
    PublishDeckUseCase,
    PublicDeckCardsUseCase,
    PublicDeckUseCase,
    PublicDecksUseCase,
    UnpublishDeckUseCase,
  ],
})
export class DecksModule {}
