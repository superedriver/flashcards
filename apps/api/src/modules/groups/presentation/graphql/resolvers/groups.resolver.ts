import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthUser } from '../../../../auth/domain/types';
import { CurrentUser } from '../../../../auth/presentation/graphql/decorators/current-user.decorator';
import { GqlAuthGuard } from '../../../../auth/presentation/graphql/guards/gql-auth.guard';
import { DeckModerationStatus } from '../../../../decks/presentation/graphql/types/deck-moderation-status.type';
import { DeckVisibility } from '../../../../decks/presentation/graphql/types/deck-visibility.type';
import {
  DeckPreviewSessionStatusEnum,
  DeckPreviewSessionType,
  DeckPreviewSessionTypeEnum,
} from '../../../../decks/presentation/graphql/types/deck-preview-session.type';
import { DeckType } from '../../../../decks/presentation/graphql/types/deck.type';
import { StartDeckPreviewUseCase } from '../../../../languages/application/use-cases/start-deck-preview.use-case';
import { AcceptGroupInvitationUseCase } from '../../../application/use-cases/accept-group-invitation.use-case';
import { CopyGroupDeckUseCase } from '../../../application/use-cases/copy-group-deck.use-case';
import { CreateGroupUseCase } from '../../../application/use-cases/create-group.use-case';
import { DeclineGroupInvitationUseCase } from '../../../application/use-cases/decline-group-invitation.use-case';
import { GroupDetailUseCase } from '../../../application/use-cases/group-detail.use-case';
import { GroupSharedDecksUseCase } from '../../../application/use-cases/group-shared-decks.use-case';
import { InviteUserToGroupUseCase } from '../../../application/use-cases/invite-user-to-group.use-case';
import { MyGroupInvitationsUseCase } from '../../../application/use-cases/my-group-invitations.use-case';
import { MyGroupsUseCase } from '../../../application/use-cases/my-groups.use-case';
import { ShareDeckWithGroupUseCase } from '../../../application/use-cases/share-deck-with-group.use-case';
import {
  DeckGroupShare as DeckGroupShareDomain,
  GroupInvitation as GroupInvitationDomain,
  GroupMember as GroupMemberDomain,
  Group as GroupDomain,
} from '../../../domain/types';
import { CreateGroupInput } from '../inputs/create-group.input';
import { InviteUserToGroupInput } from '../inputs/invite-user-to-group.input';
import { ShareDeckWithGroupInput } from '../inputs/share-deck-with-group.input';
import { StartGroupDeckCopyPreviewInput } from '../inputs/start-group-deck-copy-preview.input';
import { AcceptGroupInvitationPayloadType } from '../types/accept-group-invitation-payload.type';
import { CopyGroupDeckPayloadType } from '../types/copy-group-deck-payload.type';
import { DeckGroupSharePermission } from '../types/deck-group-share-permission.type';
import { DeckGroupShareType } from '../types/deck-group-share.type';
import { GroupInvitationStatus } from '../types/group-invitation-status.type';
import { GroupInvitationType } from '../types/group-invitation.type';
import { GroupMemberType } from '../types/group-member.type';
import { GroupRole } from '../types/group-role.type';
import { GroupType } from '../types/group.type';
import { ShareDeckWithGroupPayloadType } from '../types/share-deck-with-group-payload.type';

@Resolver()
export class GroupsResolver {
  constructor(
    private readonly createGroupUseCase: CreateGroupUseCase,
    private readonly myGroupsUseCase: MyGroupsUseCase,
    private readonly groupDetailUseCase: GroupDetailUseCase,
    private readonly inviteUserToGroupUseCase: InviteUserToGroupUseCase,
    private readonly myGroupInvitationsUseCase: MyGroupInvitationsUseCase,
    private readonly acceptGroupInvitationUseCase: AcceptGroupInvitationUseCase,
    private readonly declineGroupInvitationUseCase: DeclineGroupInvitationUseCase,
    private readonly shareDeckWithGroupUseCase: ShareDeckWithGroupUseCase,
    private readonly groupSharedDecksUseCase: GroupSharedDecksUseCase,
    private readonly copyGroupDeckUseCase: CopyGroupDeckUseCase,
    private readonly startDeckPreviewUseCase: StartDeckPreviewUseCase,
  ) {}

  @Mutation(() => GroupType)
  @UseGuards(GqlAuthGuard)
  async createGroup(
    @CurrentUser() user: AuthUser,
    @Args('input') input: CreateGroupInput,
  ): Promise<GroupType> {
    const group = await this.createGroupUseCase.execute({
      currentUser: user,
      name: input.name,
      description: input.description,
    });

    return toGroupType(group);
  }

  @Query(() => [GroupType])
  @UseGuards(GqlAuthGuard)
  async myGroups(@CurrentUser() user: AuthUser): Promise<GroupType[]> {
    const groups = await this.myGroupsUseCase.execute({
      currentUser: user,
    });

    return groups.map(toGroupType);
  }

  @Query(() => GroupType)
  @UseGuards(GqlAuthGuard)
  async group(
    @CurrentUser() user: AuthUser,
    @Args('id') id: string,
  ): Promise<GroupType> {
    const result = await this.groupDetailUseCase.execute({
      currentUser: user,
      groupId: id,
    });

    return toGroupType(result.group);
  }

  @Mutation(() => GroupInvitationType)
  @UseGuards(GqlAuthGuard)
  async inviteUserToGroup(
    @CurrentUser() user: AuthUser,
    @Args('input') input: InviteUserToGroupInput,
  ): Promise<GroupInvitationType> {
    const invitation = await this.inviteUserToGroupUseCase.execute({
      currentUser: user,
      groupId: input.groupId,
      email: input.email,
    });

    return toGroupInvitationType(invitation);
  }

  @Query(() => [GroupInvitationType])
  @UseGuards(GqlAuthGuard)
  async myGroupInvitations(
    @CurrentUser() user: AuthUser,
  ): Promise<GroupInvitationType[]> {
    const invitations = await this.myGroupInvitationsUseCase.execute({
      currentUser: user,
    });

    return invitations.map(toGroupInvitationType);
  }

  @Mutation(() => AcceptGroupInvitationPayloadType)
  @UseGuards(GqlAuthGuard)
  async acceptGroupInvitation(
    @CurrentUser() user: AuthUser,
    @Args('invitationId') invitationId: string,
  ): Promise<AcceptGroupInvitationPayloadType> {
    const result = await this.acceptGroupInvitationUseCase.execute({
      currentUser: user,
      invitationId,
    });

    return {
      invitation: toGroupInvitationType(result.invitation),
      member: toGroupMemberType(result.member),
    };
  }

  @Mutation(() => GroupInvitationType)
  @UseGuards(GqlAuthGuard)
  async declineGroupInvitation(
    @CurrentUser() user: AuthUser,
    @Args('invitationId') invitationId: string,
  ): Promise<GroupInvitationType> {
    const invitation = await this.declineGroupInvitationUseCase.execute({
      currentUser: user,
      invitationId,
    });

    return toGroupInvitationType(invitation);
  }

  @Mutation(() => ShareDeckWithGroupPayloadType)
  @UseGuards(GqlAuthGuard)
  async shareDeckWithGroup(
    @CurrentUser() user: AuthUser,
    @Args('input') input: ShareDeckWithGroupInput,
  ): Promise<ShareDeckWithGroupPayloadType> {
    const share = await this.shareDeckWithGroupUseCase.execute({
      currentUser: user,
      deckId: input.deckId,
      groupId: input.groupId,
    });

    return {
      share: toDeckGroupShareType(share),
    };
  }

  @Query(() => [DeckType])
  @UseGuards(GqlAuthGuard)
  async groupSharedDecks(
    @CurrentUser() user: AuthUser,
    @Args('groupId') groupId: string,
  ): Promise<DeckType[]> {
    const decks = await this.groupSharedDecksUseCase.execute({
      currentUser: user,
      groupId,
    });

    return decks.map((deck) => ({
      ...deck,
      visibility: deck.visibility as DeckVisibility,
      moderationStatus: deck.moderationStatus as DeckModerationStatus,
    }));
  }

  @Mutation(() => CopyGroupDeckPayloadType)
  @UseGuards(GqlAuthGuard)
  async copyGroupDeck(
    @CurrentUser() user: AuthUser,
    @Args('sourceDeckId') sourceDeckId: string,
  ): Promise<CopyGroupDeckPayloadType> {
    const result = await this.copyGroupDeckUseCase.execute({
      currentUser: user,
      sourceDeckId,
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

  @Mutation(() => DeckPreviewSessionType)
  @UseGuards(GqlAuthGuard)
  async startGroupDeckCopyPreview(
    @CurrentUser() user: AuthUser,
    @Args('input') input: StartGroupDeckCopyPreviewInput,
  ): Promise<DeckPreviewSessionType> {
    const session = await this.startDeckPreviewUseCase.execute({
      currentUser: user,
      type: 'COPY_GROUP',
      sourceDeckId: input.sourceDeckId,
      chosenSourceLanguage: input.chosenSourceLanguage,
      discardActive: input.discardActive,
    });

    return {
      ...session,
      type: session.type as DeckPreviewSessionTypeEnum,
      status: session.status as DeckPreviewSessionStatusEnum,
    };
  }
}

function toGroupType(group: GroupDomain): GroupType {
  return {
    id: group.id,
    name: group.name,
    description: group.description,
    createdById: group.createdById,
    createdAt: group.createdAt,
    updatedAt: group.updatedAt,
  };
}

function toGroupInvitationType(
  invitation: GroupInvitationDomain,
): GroupInvitationType {
  return {
    id: invitation.id,
    groupId: invitation.groupId,
    email: invitation.email,
    invitedById: invitation.invitedById,
    status: invitation.status as GroupInvitationStatus,
    expiresAt: invitation.expiresAt,
    createdAt: invitation.createdAt,
    acceptedAt: invitation.acceptedAt,
    declinedAt: invitation.declinedAt,
  };
}

function toGroupMemberType(member: GroupMemberDomain): GroupMemberType {
  return {
    id: member.id,
    groupId: member.groupId,
    userId: member.userId,
    role: member.role as GroupRole,
    createdAt: member.createdAt,
  };
}

function toDeckGroupShareType(share: DeckGroupShareDomain): DeckGroupShareType {
  return {
    id: share.id,
    deckId: share.deckId,
    groupId: share.groupId,
    permission: share.permission as DeckGroupSharePermission,
    createdById: share.createdById,
    createdAt: share.createdAt,
  };
}
