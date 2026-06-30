import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthUser } from '../../../../auth/domain/types';
import { CurrentUser } from '../../../../auth/presentation/graphql/decorators/current-user.decorator';
import { GqlAuthGuard } from '../../../../auth/presentation/graphql/guards/gql-auth.guard';
import { OptionalGqlAuthGuard } from '../../../../auth/presentation/graphql/guards/optional-gql-auth.guard';
import { CreateDeckUseCase } from '../../../application/use-cases/create-deck.use-case';
import { DeleteDeckUseCase } from '../../../application/use-cases/delete-deck.use-case';
import { GetDeckUseCase } from '../../../application/use-cases/get-deck.use-case';
import { MyDecksUseCase } from '../../../application/use-cases/my-decks.use-case';
import { UpdateDeckUseCase } from '../../../application/use-cases/update-deck.use-case';
import { CreateDeckInput } from '../inputs/create-deck.input';
import { UpdateDeckInput } from '../inputs/update-deck.input';
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
}
