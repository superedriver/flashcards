import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthUser } from '../../../../auth/domain/types';
import { CurrentUser } from '../../../../auth/presentation/graphql/decorators/current-user.decorator';
import { GqlAuthGuard } from '../../../../auth/presentation/graphql/guards/gql-auth.guard';
import { CreateDeckUseCase } from '../../../application/use-cases/create-deck.use-case';
import { CreateDeckInput } from '../inputs/create-deck.input';
import { DeckModerationStatus } from '../types/deck-moderation-status.type';
import { DeckVisibility } from '../types/deck-visibility.type';
import { DeckType } from '../types/deck.type';

@Resolver()
export class DecksResolver {
  constructor(private readonly createDeckUseCase: CreateDeckUseCase) {}

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
}
