import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthUser } from '../../../../auth/domain/types';
import { CurrentUser } from '../../../../auth/presentation/graphql/decorators/current-user.decorator';
import { GqlAuthGuard } from '../../../../auth/presentation/graphql/guards/gql-auth.guard';
import { OptionalGqlAuthGuard } from '../../../../auth/presentation/graphql/guards/optional-gql-auth.guard';
import { CreateCardUseCase } from '../../../application/use-cases/create-card.use-case';
import { CreateDeckUseCase } from '../../../application/use-cases/create-deck.use-case';
import { DeckCardsUseCase } from '../../../application/use-cases/deck-cards.use-case';
import { DeleteDeckUseCase } from '../../../application/use-cases/delete-deck.use-case';
import { DeleteCardUseCase } from '../../../application/use-cases/delete-card.use-case';
import { GetDeckUseCase } from '../../../application/use-cases/get-deck.use-case';
import { MyDecksUseCase } from '../../../application/use-cases/my-decks.use-case';
import { PublishDeckUseCase } from '../../../application/use-cases/publish-deck.use-case';
import { UnpublishDeckUseCase } from '../../../application/use-cases/unpublish-deck.use-case';
import { UpdateDeckUseCase } from '../../../application/use-cases/update-deck.use-case';
import { UpdateCardUseCase } from '../../../application/use-cases/update-card.use-case';
import { CreateDeckInput } from '../inputs/create-deck.input';
import { CreateCardInput } from '../inputs/create-card.input';
import { UpdateDeckInput } from '../inputs/update-deck.input';
import { UpdateCardInput } from '../inputs/update-card.input';
import { CardType } from '../types/card.type';
import { DeckModerationStatus } from '../types/deck-moderation-status.type';
import { DeckVisibility } from '../types/deck-visibility.type';
import { DeckType } from '../types/deck.type';

type GraphqlRequest = {
  authUser?: AuthUser;
};

@Resolver()
export class DecksResolver {
  constructor(
    private readonly createDeckUseCase: CreateDeckUseCase,
    private readonly myDecksUseCase: MyDecksUseCase,
    private readonly getDeckUseCase: GetDeckUseCase,
    private readonly updateDeckUseCase: UpdateDeckUseCase,
    private readonly deleteDeckUseCase: DeleteDeckUseCase,
    private readonly createCardUseCase: CreateCardUseCase,
    private readonly deckCardsUseCase: DeckCardsUseCase,
    private readonly updateCardUseCase: UpdateCardUseCase,
    private readonly deleteCardUseCase: DeleteCardUseCase,
    private readonly publishDeckUseCase: PublishDeckUseCase,
    private readonly unpublishDeckUseCase: UnpublishDeckUseCase,
  ) {}

  @Query(() => DeckType)
  @UseGuards(OptionalGqlAuthGuard)
  async deck(
    @Args('id') id: string,
    @Context() context: { req: GraphqlRequest },
  ): Promise<DeckType> {
    const deck = await this.getDeckUseCase.execute({
      currentUser: context.req.authUser ?? null,
      deckId: id,
    });

    return {
      ...deck,
      visibility: deck.visibility as DeckVisibility,
      moderationStatus: deck.moderationStatus as DeckModerationStatus,
    };
  }

  @Query(() => [DeckType])
  @UseGuards(GqlAuthGuard)
  async myDecks(@CurrentUser() user: AuthUser): Promise<DeckType[]> {
    const decks = await this.myDecksUseCase.execute({
      currentUserId: user.id,
    });

    return decks.map((deck) => ({
      ...deck,
      visibility: deck.visibility as DeckVisibility,
      moderationStatus: deck.moderationStatus as DeckModerationStatus,
    }));
  }

  @Query(() => [CardType])
  @UseGuards(OptionalGqlAuthGuard)
  async deckCards(
    @Args('deckId') deckId: string,
    @Context() context: { req: GraphqlRequest },
  ): Promise<CardType[]> {
    return this.deckCardsUseCase.execute({
      currentUser: context.req.authUser ?? null,
      deckId,
    });
  }

  @Mutation(() => DeckType)
  @UseGuards(GqlAuthGuard)
  async createDeck(
    @CurrentUser() user: AuthUser,
    @Args('input') input: CreateDeckInput,
  ): Promise<DeckType> {
    const deck = await this.createDeckUseCase.execute({
      currentUserId: user.id,
      title: input.title,
      description: input.description,
    });

    return {
      ...deck,
      visibility: deck.visibility as DeckVisibility,
      moderationStatus: deck.moderationStatus as DeckModerationStatus,
    };
  }

  @Mutation(() => DeckType)
  @UseGuards(GqlAuthGuard)
  async updateDeck(
    @CurrentUser() user: AuthUser,
    @Args('input') input: UpdateDeckInput,
  ): Promise<DeckType> {
    const deck = await this.updateDeckUseCase.execute({
      currentUser: user,
      deckId: input.deckId,
      title: input.title,
      description: input.description,
    });

    return {
      ...deck,
      visibility: deck.visibility as DeckVisibility,
      moderationStatus: deck.moderationStatus as DeckModerationStatus,
    };
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async deleteDeck(
    @CurrentUser() user: AuthUser,
    @Args('deckId') deckId: string,
  ): Promise<boolean> {
    const result = await this.deleteDeckUseCase.execute({
      currentUser: user,
      deckId,
    });

    return result.success;
  }

  @Mutation(() => CardType)
  @UseGuards(GqlAuthGuard)
  async createCard(
    @CurrentUser() user: AuthUser,
    @Args('input') input: CreateCardInput,
  ): Promise<CardType> {
    return this.createCardUseCase.execute({
      currentUser: user,
      deckId: input.deckId,
      front: input.front,
      back: input.back,
      example: input.example,
      notes: input.notes,
      position: input.position,
    });
  }

  @Mutation(() => CardType)
  @UseGuards(GqlAuthGuard)
  async updateCard(
    @CurrentUser() user: AuthUser,
    @Args('input') input: UpdateCardInput,
  ): Promise<CardType> {
    return this.updateCardUseCase.execute({
      currentUser: user,
      cardId: input.cardId,
      front: input.front,
      back: input.back,
      example: input.example,
      notes: input.notes,
      position: input.position,
    });
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async deleteCard(
    @CurrentUser() user: AuthUser,
    @Args('cardId') cardId: string,
  ): Promise<boolean> {
    const result = await this.deleteCardUseCase.execute({
      currentUser: user,
      cardId,
    });

    return result.success;
  }

  @Mutation(() => DeckType)
  @UseGuards(GqlAuthGuard)
  async publishDeck(
    @CurrentUser() user: AuthUser,
    @Args('deckId') deckId: string,
  ): Promise<DeckType> {
    const deck = await this.publishDeckUseCase.execute({
      currentUser: user,
      deckId,
    });

    return {
      ...deck,
      visibility: deck.visibility as DeckVisibility,
      moderationStatus: deck.moderationStatus as DeckModerationStatus,
    };
  }

  @Mutation(() => DeckType)
  @UseGuards(GqlAuthGuard)
  async unpublishDeck(
    @CurrentUser() user: AuthUser,
    @Args('deckId') deckId: string,
  ): Promise<DeckType> {
    const deck = await this.unpublishDeckUseCase.execute({
      currentUser: user,
      deckId,
    });

    return {
      ...deck,
      visibility: deck.visibility as DeckVisibility,
      moderationStatus: deck.moderationStatus as DeckModerationStatus,
    };
  }
}
