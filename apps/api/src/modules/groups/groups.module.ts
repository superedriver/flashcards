import { Module, forwardRef } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { DecksModule } from '../decks/decks.module';
import { DECK_GROUP_SHARE_REPOSITORY } from './application/ports/deck-group-share-repository.port';
import { GROUP_INVITATION_REPOSITORY } from './application/ports/group-invitation-repository.port';
import { GROUP_REPOSITORY } from './application/ports/group-repository.port';
import { AcceptGroupInvitationUseCase } from './application/use-cases/accept-group-invitation.use-case';
import { CreateGroupUseCase } from './application/use-cases/create-group.use-case';
import { DeclineGroupInvitationUseCase } from './application/use-cases/decline-group-invitation.use-case';
import { GroupDetailUseCase } from './application/use-cases/group-detail.use-case';
import { GroupSharedDecksUseCase } from './application/use-cases/group-shared-decks.use-case';
import { InviteUserToGroupUseCase } from './application/use-cases/invite-user-to-group.use-case';
import { MyGroupInvitationsUseCase } from './application/use-cases/my-group-invitations.use-case';
import { MyGroupsUseCase } from './application/use-cases/my-groups.use-case';
import { ShareDeckWithGroupUseCase } from './application/use-cases/share-deck-with-group.use-case';
import { PrismaDeckGroupShareRepository } from './infrastructure/persistence/prisma-deck-group-share.repository';
import { PrismaGroupInvitationRepository } from './infrastructure/persistence/prisma-group-invitation.repository';
import { PrismaGroupRepository } from './infrastructure/persistence/prisma-group.repository';
import { GroupsResolver } from './presentation/graphql/resolvers/groups.resolver';

@Module({
  imports: [AuthModule, forwardRef(() => DecksModule)],
  providers: [
    {
      provide: GROUP_REPOSITORY,
      useClass: PrismaGroupRepository,
    },
    {
      provide: GROUP_INVITATION_REPOSITORY,
      useClass: PrismaGroupInvitationRepository,
    },
    {
      provide: DECK_GROUP_SHARE_REPOSITORY,
      useClass: PrismaDeckGroupShareRepository,
    },
    CreateGroupUseCase,
    MyGroupsUseCase,
    GroupDetailUseCase,
    InviteUserToGroupUseCase,
    MyGroupInvitationsUseCase,
    AcceptGroupInvitationUseCase,
    DeclineGroupInvitationUseCase,
    ShareDeckWithGroupUseCase,
    GroupSharedDecksUseCase,
    GroupsResolver,
  ],
  exports: [
    DECK_GROUP_SHARE_REPOSITORY,
    CreateGroupUseCase,
    MyGroupsUseCase,
    GroupDetailUseCase,
    InviteUserToGroupUseCase,
    MyGroupInvitationsUseCase,
    AcceptGroupInvitationUseCase,
    DeclineGroupInvitationUseCase,
    ShareDeckWithGroupUseCase,
    GroupSharedDecksUseCase,
  ],
})
export class GroupsModule {}
