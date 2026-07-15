import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthUser } from '../../../../auth/domain/types';
import { CurrentUser } from '../../../../auth/presentation/graphql/decorators/current-user.decorator';
import { GqlAuthGuard } from '../../../../auth/presentation/graphql/guards/gql-auth.guard';
import { CancelDeckPreviewUseCase } from '../../../application/use-cases/cancel-deck-preview.use-case';
import { ConfirmDeckPreviewUseCase } from '../../../application/use-cases/confirm-deck-preview.use-case';
import { GetActiveDeckPreviewUseCase } from '../../../application/use-cases/get-active-deck-preview.use-case';
import { StartDeckPreviewUseCase } from '../../../application/use-cases/start-deck-preview.use-case';
import { UpdateDeckPreviewCardUseCase } from '../../../application/use-cases/update-deck-preview-card.use-case';
import { DeckModerationStatus } from '../../../../decks/presentation/graphql/types/deck-moderation-status.type';
import {
  DeckPreviewSessionStatusEnum,
  DeckPreviewSessionType,
  DeckPreviewSessionTypeEnum,
} from '../../../../decks/presentation/graphql/types/deck-preview-session.type';
import { DeckVisibility } from '../../../../decks/presentation/graphql/types/deck-visibility.type';
import { StartDeckRegeneratePreviewInput } from '../inputs/start-deck-regenerate-preview.input';
import { UpdateDeckPreviewCardInput } from '../inputs/update-deck-preview-card.input';
import { ConfirmDeckPreviewPayloadType } from '../types/confirm-deck-preview-payload.type';

function toPreviewSessionType(session: {
  id: string;
  type: string;
  status: string;
  sourceDeckId: string | null;
  targetLanguage: string;
  chosenSourceLanguage: string;
  cards: DeckPreviewSessionType['cards'];
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}): DeckPreviewSessionType {
  return {
    ...session,
    type: session.type as DeckPreviewSessionTypeEnum,
    status: session.status as DeckPreviewSessionStatusEnum,
  };
}

@Resolver()
export class DeckPreviewResolver {
  constructor(
    private readonly getActiveDeckPreviewUseCase: GetActiveDeckPreviewUseCase,
    private readonly updateDeckPreviewCardUseCase: UpdateDeckPreviewCardUseCase,
    private readonly confirmDeckPreviewUseCase: ConfirmDeckPreviewUseCase,
    private readonly cancelDeckPreviewUseCase: CancelDeckPreviewUseCase,
    private readonly startDeckPreviewUseCase: StartDeckPreviewUseCase,
  ) {}

  @Query(() => DeckPreviewSessionType, { nullable: true })
  @UseGuards(GqlAuthGuard)
  async activeDeckPreview(
    @CurrentUser() user: AuthUser,
  ): Promise<DeckPreviewSessionType | null> {
    const session = await this.getActiveDeckPreviewUseCase.execute({
      currentUserId: user.id,
    });

    return session ? toPreviewSessionType(session) : null;
  }

  @Mutation(() => DeckPreviewSessionType)
  @UseGuards(GqlAuthGuard)
  async updateDeckPreviewCard(
    @CurrentUser() user: AuthUser,
    @Args('input') input: UpdateDeckPreviewCardInput,
  ): Promise<DeckPreviewSessionType> {
    const session = await this.updateDeckPreviewCardUseCase.execute({
      currentUserId: user.id,
      sessionId: input.sessionId,
      cardIndex: input.cardIndex,
      back: input.back,
      example: input.example,
    });

    return toPreviewSessionType(session);
  }

  @Mutation(() => ConfirmDeckPreviewPayloadType)
  @UseGuards(GqlAuthGuard)
  async confirmDeckPreview(
    @CurrentUser() user: AuthUser,
    @Args('sessionId') sessionId: string,
  ): Promise<ConfirmDeckPreviewPayloadType> {
    const result = await this.confirmDeckPreviewUseCase.execute({
      currentUser: user,
      sessionId,
    });

    return {
      deck: {
        ...result.deck,
        visibility: result.deck.visibility as DeckVisibility,
        moderationStatus: result.deck.moderationStatus as DeckModerationStatus,
      },
      cards: result.cards,
    };
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async cancelDeckPreview(
    @CurrentUser() user: AuthUser,
    @Args('sessionId') sessionId: string,
  ): Promise<boolean> {
    return this.cancelDeckPreviewUseCase.execute({
      currentUserId: user.id,
      sessionId,
    });
  }

  @Mutation(() => DeckPreviewSessionType)
  @UseGuards(GqlAuthGuard)
  async startDeckRegeneratePreview(
    @CurrentUser() user: AuthUser,
    @Args('input') input: StartDeckRegeneratePreviewInput,
  ): Promise<DeckPreviewSessionType> {
    const session = await this.startDeckPreviewUseCase.execute({
      currentUser: user,
      type: 'REGENERATE_DECK',
      sourceDeckId: input.sourceDeckId,
      chosenSourceLanguage: input.chosenSourceLanguage,
      discardActive: input.discardActive,
    });

    return toPreviewSessionType(session);
  }
}
