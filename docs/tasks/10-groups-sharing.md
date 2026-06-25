# EPIC-10 Groups & Sharing

## Epic Goal

Implement backend groups and deck sharing.

This epic covers:

```txt
- creating groups
- listing my groups
- viewing group details
- group membership roles
- inviting users to groups
- accepting group invitations
- declining group invitations
- sharing owned decks with groups
- viewing group-shared decks
- studying group-shared decks
- view-only permissions for shared decks
```

Groups allow users to share decks with selected people without making those decks public.

## Epic Status

TODO

## Related Documents

Cursor must read these documents before working on this epic:

```txt
docs/architecture.md
docs/backend-clean-architecture.md
docs/domain/permissions.md
docs/security/security-checklist.md
docs/tasks/README.md
docs/tasks/cursor-task-template.md
docs/tasks/05-decks-cards.md
docs/tasks/06-public-decks.md
docs/tasks/07-srs-lessons.md
```

## Epic Prerequisites

EPIC-07 should be complete.

Expected state:

```txt
- Auth works.
- GqlAuthGuard exists.
- CurrentUser decorator exists.
- Deck/Card schema exists.
- DeckPermissionService exists.
- Deck/card owner permissions work.
- Lessons can start from viewable decks.
- Public deck visibility works.
```

## Epic Rules

```txt
1. Follow docs/domain/permissions.md exactly.
2. Follow docs/security/security-checklist.md exactly.
3. Backend is the source of truth for group permissions.
4. Frontend role visibility is UX only.
5. Group members get view/study access to shared decks.
6. Group members do not get edit access to shared decks.
7. Only deck owner can edit deck/card content.
8. Only group OWNER or ADMIN can invite users.
9. Only group OWNER or ADMIN can share decks with group.
10. User can accept/decline only own invitation.
11. Do not put business logic in GraphQL resolvers.
12. Do not access Prisma directly from GraphQL resolvers.
```

## MVP Group Roles

Group roles:

```txt
OWNER
ADMIN
MEMBER
```

Role rules:

```txt
OWNER:
- created the group
- can invite users
- can share owned decks with group
- can view group
- can view shared decks

ADMIN:
- can invite users
- can share owned decks with group
- can view group
- can view shared decks

MEMBER:
- can view group
- can view shared decks
- can study shared decks
```

MVP does not implement:

```txt
- removing members
- transferring ownership
- changing member roles
- group chat
- group analytics
- editable shared decks
```

## Deck Sharing Policy

MVP deck share permission:

```txt
VIEW
```

Group-shared deck access:

```txt
- group members can view deck
- group members can view deck cards
- group members can start lessons from shared deck
- group members get their own CardReviewState
```

Group-shared deck restrictions:

```txt
- group members cannot edit deck
- group members cannot create cards
- group members cannot update cards
- group members cannot delete cards
- group members cannot import CSV
- group members cannot generate/save AI examples
```

## Epic Summary

```md
- [ ] TASK-10.01 Add groups Prisma schema
- [ ] TASK-10.02 Add groups module skeleton
- [ ] TASK-10.03 Add group domain types
- [ ] TASK-10.04 Add group repository ports
- [ ] TASK-10.05 Add GroupPermissionService
- [ ] TASK-10.06 Add Prisma group repository
- [ ] TASK-10.07 Add Prisma group invitation repository
- [ ] TASK-10.08 Add Prisma deck group share repository
- [ ] TASK-10.09 Add group GraphQL types and inputs
- [ ] TASK-10.10 Add CreateGroupUseCase
- [ ] TASK-10.11 Add createGroup mutation
- [ ] TASK-10.12 Add MyGroupsUseCase
- [ ] TASK-10.13 Add myGroups query
- [ ] TASK-10.14 Add GroupDetailUseCase
- [ ] TASK-10.15 Add group query
- [ ] TASK-10.16 Add InviteUserToGroupUseCase
- [ ] TASK-10.17 Add inviteUserToGroup mutation
- [ ] TASK-10.18 Add MyGroupInvitationsUseCase
- [ ] TASK-10.19 Add myGroupInvitations query
- [ ] TASK-10.20 Add AcceptGroupInvitationUseCase
- [ ] TASK-10.21 Add acceptGroupInvitation mutation
- [ ] TASK-10.22 Add DeclineGroupInvitationUseCase
- [ ] TASK-10.23 Add declineGroupInvitation mutation
- [ ] TASK-10.24 Add ShareDeckWithGroupUseCase
- [ ] TASK-10.25 Add shareDeckWithGroup mutation
- [ ] TASK-10.26 Add GroupSharedDecksUseCase
- [ ] TASK-10.27 Add groupSharedDecks query
- [ ] TASK-10.28 Extend deck permissions for group shared decks
- [ ] TASK-10.29 Add groups and sharing final checks
```

---

# TASK-10.01 Add groups Prisma schema

## Status

TODO

## Context

Groups require persistence for groups, members, invitations, and deck shares.

## Goal

Add group-related Prisma models.

## Files to Modify

```txt
apps/api/prisma/schema.prisma
```

## Requirements

Add relations to `User`:

```prisma
groupMemberships GroupMember[]
createdGroups Group[] @relation("GroupCreatedBy")
groupInvitationsSent GroupInvitation[] @relation("GroupInvitationInvitedBy")
deckGroupSharesCreated DeckGroupShare[] @relation("DeckGroupShareCreatedBy")
```

Add relations to `Deck`:

```prisma
groupShares DeckGroupShare[]
```

Add enums:

```prisma
enum GroupRole {
  OWNER
  ADMIN
  MEMBER
}

enum GroupInvitationStatus {
  PENDING
  ACCEPTED
  DECLINED
  CANCELLED
  EXPIRED
}

enum DeckGroupSharePermission {
  VIEW
}
```

Add `Group` model:

```prisma
model Group {
  id          String    @id @default(uuid())
  name        String
  description String?
  createdById String
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  deletedAt   DateTime?

  createdBy   User      @relation("GroupCreatedBy", fields: [createdById], references: [id], onDelete: Cascade)
  members     GroupMember[]
  invitations GroupInvitation[]
  deckShares  DeckGroupShare[]

  @@index([createdById])
  @@index([deletedAt])
}
```

Add `GroupMember` model:

```prisma
model GroupMember {
  id        String    @id @default(uuid())
  groupId   String
  userId    String
  role      GroupRole @default(MEMBER)

  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt

  group     Group     @relation(fields: [groupId], references: [id], onDelete: Cascade)
  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([groupId, userId])
  @@index([groupId])
  @@index([userId])
  @@index([role])
}
```

Add `GroupInvitation` model:

```prisma
model GroupInvitation {
  id          String                @id @default(uuid())
  groupId     String
  email       String
  invitedById String
  status      GroupInvitationStatus @default(PENDING)
  expiresAt   DateTime

  createdAt   DateTime              @default(now())
  updatedAt   DateTime              @updatedAt
  acceptedAt  DateTime?
  declinedAt  DateTime?

  group       Group                 @relation(fields: [groupId], references: [id], onDelete: Cascade)
  invitedBy   User                  @relation("GroupInvitationInvitedBy", fields: [invitedById], references: [id], onDelete: Cascade)

  @@index([groupId])
  @@index([email])
  @@index([status])
  @@index([expiresAt])
}
```

Add `DeckGroupShare` model:

```prisma
model DeckGroupShare {
  id           String                   @id @default(uuid())
  deckId       String
  groupId      String
  permission   DeckGroupSharePermission @default(VIEW)
  createdById  String

  createdAt    DateTime                 @default(now())
  updatedAt    DateTime                 @updatedAt
  deletedAt    DateTime?

  deck         Deck                     @relation(fields: [deckId], references: [id], onDelete: Cascade)
  group        Group                    @relation(fields: [groupId], references: [id], onDelete: Cascade)
  createdBy    User                     @relation("DeckGroupShareCreatedBy", fields: [createdById], references: [id], onDelete: Cascade)

  @@unique([deckId, groupId])
  @@index([deckId])
  @@index([groupId])
  @@index([createdById])
  @@index([deletedAt])
}
```

## Security Requirements

```txt
- Group membership controls access.
- DeckGroupShare grants view/study access only.
- DeckGroupShare does not grant edit rights.
```

## Architecture Constraints

```txt
- This task only changes persistence schema.
- Do not implement permissions yet.
- Do not implement GraphQL yet.
```

## Acceptance Criteria

```txt
- Group model exists.
- GroupMember model exists.
- GroupInvitation model exists.
- DeckGroupShare model exists.
- Prisma schema validates.
- Prisma client generates.
```

## Commands to Run

```bash
pnpm --filter @flashcards/api exec prisma validate
pnpm --filter @flashcards/api exec prisma generate
pnpm --filter @flashcards/api build
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
chore(db): add groups and sharing schema
```

---

# TASK-10.02 Add groups module skeleton

## Status

TODO

## Context

Groups should live in a dedicated backend module.

## Goal

Create groups module folder structure.

## Files to Create

```txt
apps/api/src/modules/groups/groups.module.ts

apps/api/src/modules/groups/domain/.gitkeep
apps/api/src/modules/groups/domain/types/.gitkeep
apps/api/src/modules/groups/domain/services/.gitkeep

apps/api/src/modules/groups/application/.gitkeep
apps/api/src/modules/groups/application/ports/.gitkeep
apps/api/src/modules/groups/application/use-cases/.gitkeep

apps/api/src/modules/groups/infrastructure/.gitkeep
apps/api/src/modules/groups/infrastructure/persistence/.gitkeep
apps/api/src/modules/groups/infrastructure/mappers/.gitkeep

apps/api/src/modules/groups/presentation/.gitkeep
apps/api/src/modules/groups/presentation/graphql/.gitkeep
apps/api/src/modules/groups/presentation/graphql/inputs/.gitkeep
apps/api/src/modules/groups/presentation/graphql/types/.gitkeep
apps/api/src/modules/groups/presentation/graphql/resolvers/.gitkeep
```

## Files to Modify

```txt
apps/api/src/app.module.ts
```

## Requirements

Create `GroupsModule`:

```ts
import { Module } from '@nestjs/common'

@Module({})
export class GroupsModule {}
```

Import `GroupsModule` into `AppModule`.

## Acceptance Criteria

```txt
- GroupsModule exists.
- GroupsModule is imported into AppModule.
- Folder structure exists.
- API builds.
```

## Commands to Run

```bash
pnpm --filter @flashcards/api build
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
chore(groups): add groups module skeleton
```

---

# TASK-10.03 Add group domain types

## Status

TODO

## Context

Groups use cases need framework-independent types.

## Goal

Add group domain types.

## Files to Create

```txt
apps/api/src/modules/groups/domain/types/group-role.type.ts
apps/api/src/modules/groups/domain/types/group-invitation-status.type.ts
apps/api/src/modules/groups/domain/types/deck-group-share-permission.type.ts
apps/api/src/modules/groups/domain/types/group.type.ts
apps/api/src/modules/groups/domain/types/group-member.type.ts
apps/api/src/modules/groups/domain/types/group-invitation.type.ts
apps/api/src/modules/groups/domain/types/deck-group-share.type.ts
apps/api/src/modules/groups/domain/types/index.ts
```

## Requirements

Create role/status types:

```ts
export type GroupRole = 'OWNER' | 'ADMIN' | 'MEMBER'

export type GroupInvitationStatus = 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'CANCELLED' | 'EXPIRED'

export type DeckGroupSharePermission = 'VIEW'
```

Create `Group`:

```ts
import { GroupRole } from './group-role.type'

export type Group = {
  id: string
  name: string
  description: string | null
  createdById: string
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
}

export type GroupWithMyRole = Group & {
  myRole: GroupRole
}
```

Create `GroupMember`:

```ts
import { GroupRole } from './group-role.type'

export type GroupMember = {
  id: string
  groupId: string
  userId: string
  role: GroupRole
  createdAt: Date
  updatedAt: Date
}
```

Create `GroupInvitation`:

```ts
import { GroupInvitationStatus } from './group-invitation-status.type'

export type GroupInvitation = {
  id: string
  groupId: string
  email: string
  invitedById: string
  status: GroupInvitationStatus
  expiresAt: Date
  createdAt: Date
  updatedAt: Date
  acceptedAt: Date | null
  declinedAt: Date | null
}
```

Create `DeckGroupShare`:

```ts
import { DeckGroupSharePermission } from './deck-group-share-permission.type'

export type DeckGroupShare = {
  id: string
  deckId: string
  groupId: string
  permission: DeckGroupSharePermission
  createdById: string
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
}
```

## Architecture Constraints

```txt
- Types must not import Prisma.
- Types must not import GraphQL decorators.
- Types must not import NestJS.
```

## Acceptance Criteria

```txt
- Group domain types exist.
- Types are framework-independent.
- API builds.
```

## Commands to Run

```bash
pnpm --filter @flashcards/api build
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
chore(groups): add group domain types
```

---

# TASK-10.04 Add group repository ports

## Status

TODO

## Context

Use cases must depend on repository ports, not Prisma.

## Goal

Add repository ports for groups, invitations, and deck group shares.

## Files to Create

```txt
apps/api/src/modules/groups/application/ports/group-repository.port.ts
apps/api/src/modules/groups/application/ports/group-invitation-repository.port.ts
apps/api/src/modules/groups/application/ports/deck-group-share-repository.port.ts
```

## Requirements

Create `GroupRepositoryPort`:

```ts
import { Group, GroupMember, GroupRole, GroupWithMyRole } from '../../domain/types'

export const GROUP_REPOSITORY = Symbol('GROUP_REPOSITORY')

export type CreateGroupInput = {
  name: string
  description?: string | null
  createdById: string
}

export type GroupRepositoryPort = {
  create(input: CreateGroupInput): Promise<Group>
  addMember(input: { groupId: string; userId: string; role: GroupRole }): Promise<GroupMember>
  findById(groupId: string): Promise<Group | null>
  findMember(input: { groupId: string; userId: string }): Promise<GroupMember | null>
  findGroupsForUser(userId: string): Promise<GroupWithMyRole[]>
  findMembers(groupId: string): Promise<GroupMember[]>
}
```

Create `GroupInvitationRepositoryPort`:

```ts
import { GroupInvitation } from '../../domain/types'

export const GROUP_INVITATION_REPOSITORY = Symbol('GROUP_INVITATION_REPOSITORY')

export type CreateGroupInvitationInput = {
  groupId: string
  email: string
  invitedById: string
  expiresAt: Date
}

export type GroupInvitationRepositoryPort = {
  create(input: CreateGroupInvitationInput): Promise<GroupInvitation>
  findById(invitationId: string): Promise<GroupInvitation | null>
  findPendingForEmail(email: string): Promise<GroupInvitation[]>
  findPendingByGroupAndEmail(input: {
    groupId: string
    email: string
  }): Promise<GroupInvitation | null>
  markAccepted(invitationId: string, acceptedAt: Date): Promise<GroupInvitation>
  markDeclined(invitationId: string, declinedAt: Date): Promise<GroupInvitation>
}
```

Create `DeckGroupShareRepositoryPort`:

```ts
import { DeckGroupShare } from '../../domain/types'
import { Deck } from '../../../decks/domain/types'

export const DECK_GROUP_SHARE_REPOSITORY = Symbol('DECK_GROUP_SHARE_REPOSITORY')

export type CreateDeckGroupShareInput = {
  deckId: string
  groupId: string
  createdById: string
}

export type DeckGroupShareRepositoryPort = {
  create(input: CreateDeckGroupShareInput): Promise<DeckGroupShare>
  findByDeckAndGroup(input: { deckId: string; groupId: string }): Promise<DeckGroupShare | null>
  findActiveGroupsForDeck(deckId: string): Promise<DeckGroupShare[]>
  findSharedDecksForGroup(groupId: string): Promise<Deck[]>
  userHasAccessToDeck(input: { userId: string; deckId: string }): Promise<boolean>
}
```

## Architecture Constraints

```txt
- Ports must not import Prisma.
- Ports must not import GraphQL decorators.
- Use cases enforce permissions.
```

## Acceptance Criteria

```txt
- GroupRepositoryPort exists.
- GroupInvitationRepositoryPort exists.
- DeckGroupShareRepositoryPort exists.
- Ports are framework-independent.
- API builds.
```

## Commands to Run

```bash
pnpm --filter @flashcards/api build
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
chore(groups): add group repository ports
```

---

# TASK-10.05 Add GroupPermissionService

## Status

TODO

## Context

Group permissions must follow `docs/domain/permissions.md`.

## Goal

Add group permission service.

## Files to Create

```txt
apps/api/src/modules/groups/domain/services/group-permission.service.ts
```

## Requirements

Create `GroupPermissionService`:

```ts
import { GroupMember } from '../types'

export class GroupPermissionService {
  canViewGroup(member: GroupMember | null): boolean {
    return member !== null
  }

  canInviteToGroup(member: GroupMember | null): boolean {
    return member?.role === 'OWNER' || member?.role === 'ADMIN'
  }

  canShareDeckWithGroup(member: GroupMember | null): boolean {
    return member?.role === 'OWNER' || member?.role === 'ADMIN'
  }
}
```

Rules:

```txt
canViewGroup:
- OWNER, ADMIN, MEMBER

canInviteToGroup:
- OWNER, ADMIN

canShareDeckWithGroup:
- OWNER, ADMIN
```

## Security Requirements

```txt
- Deny by default.
- Non-members cannot view group.
- MEMBER cannot invite.
- MEMBER cannot share deck with group.
```

## Architecture Constraints

```txt
- Service must not import Prisma.
- Service must not import GraphQL decorators.
- Service must not import NestJS.
```

## Acceptance Criteria

```txt
- GroupPermissionService exists.
- OWNER can invite/share.
- ADMIN can invite/share.
- MEMBER cannot invite/share.
- Non-member cannot view.
- API builds.
```

## Commands to Run

```bash
pnpm --filter @flashcards/api build
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
chore(groups): add group permission service
```

---

# TASK-10.06 Add Prisma group repository

## Status

TODO

## Context

Group persistence should be implemented through Prisma infrastructure.

## Goal

Add Prisma implementation of `GroupRepositoryPort`.

## Files to Create

```txt
apps/api/src/modules/groups/infrastructure/persistence/prisma-group.repository.ts
apps/api/src/modules/groups/infrastructure/mappers/group.mapper.ts
apps/api/src/modules/groups/infrastructure/mappers/group-member.mapper.ts
```

## Files to Modify

```txt
apps/api/src/modules/groups/groups.module.ts
```

## Requirements

Implement:

```txt
create
addMember
findById
findMember
findGroupsForUser
findMembers
```

`create` should create group.

`addMember` should create group member.

`findById` should exclude deleted groups:

```txt
deletedAt = null
```

`findGroupsForUser` should return groups where user is a member and group is not deleted.

## Security Requirements

```txt
- Repository does not decide business permissions.
- Use cases enforce permissions.
```

## Architecture Constraints

```txt
- Prisma repository lives in infrastructure.
- Use cases depend on port.
- Resolver must not use repository directly.
```

## Acceptance Criteria

```txt
- PrismaGroupRepository exists.
- Group mapper exists.
- Group member mapper exists.
- Provider is registered.
- API builds.
```

## Commands to Run

```bash
pnpm --filter @flashcards/api build
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
chore(groups): add Prisma group repository
```

---

# TASK-10.07 Add Prisma group invitation repository

## Status

TODO

## Context

Group invitation persistence should be implemented through Prisma infrastructure.

## Goal

Add Prisma implementation of `GroupInvitationRepositoryPort`.

## Files to Create

```txt
apps/api/src/modules/groups/infrastructure/persistence/prisma-group-invitation.repository.ts
apps/api/src/modules/groups/infrastructure/mappers/group-invitation.mapper.ts
```

## Files to Modify

```txt
apps/api/src/modules/groups/groups.module.ts
```

## Requirements

Implement:

```txt
create
findById
findPendingForEmail
findPendingByGroupAndEmail
markAccepted
markDeclined
```

Pending invitation filters:

```txt
status = PENDING
expiresAt > now
```

Normalize email before storing/searching.

## Security Requirements

```txt
- Repository does not decide whether user can accept invitation.
- Use cases enforce email ownership and status checks.
```

## Architecture Constraints

```txt
- Prisma repository lives in infrastructure.
- Use cases depend on port.
- Resolver must not use repository directly.
```

## Acceptance Criteria

```txt
- PrismaGroupInvitationRepository exists.
- Mapper exists.
- Provider is registered.
- API builds.
```

## Commands to Run

```bash
pnpm --filter @flashcards/api build
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
chore(groups): add Prisma group invitation repository
```

---

# TASK-10.08 Add Prisma deck group share repository

## Status

TODO

## Context

Deck sharing with groups needs persistence.

## Goal

Add Prisma implementation of `DeckGroupShareRepositoryPort`.

## Files to Create

```txt
apps/api/src/modules/groups/infrastructure/persistence/prisma-deck-group-share.repository.ts
apps/api/src/modules/groups/infrastructure/mappers/deck-group-share.mapper.ts
```

## Files to Modify

```txt
apps/api/src/modules/groups/groups.module.ts
```

## Requirements

Implement:

```txt
create
findByDeckAndGroup
findActiveGroupsForDeck
findSharedDecksForGroup
userHasAccessToDeck
```

Active share filter:

```txt
deletedAt = null
```

`findSharedDecksForGroup` should return non-deleted decks.

`userHasAccessToDeck` should return true if:

```txt
- active DeckGroupShare exists for deck
- user is active member of that group
- group is not deleted
- deck is not deleted
```

## Security Requirements

```txt
- Group share grants view access only.
- Repository does not grant edit permissions.
```

## Architecture Constraints

```txt
- Prisma repository lives in infrastructure.
- Use cases depend on port.
- Resolver must not use repository directly.
```

## Acceptance Criteria

```txt
- PrismaDeckGroupShareRepository exists.
- Mapper exists.
- Provider is registered.
- userHasAccessToDeck works at persistence level.
- API builds.
```

## Commands to Run

```bash
pnpm --filter @flashcards/api build
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
chore(groups): add Prisma deck group share repository
```

---

# TASK-10.09 Add group GraphQL types and inputs

## Status

TODO

## Context

GraphQL needs safe types and inputs for group operations.

## Goal

Add GraphQL types and inputs.

## Files to Create

```txt
apps/api/src/modules/groups/presentation/graphql/types/group-role.type.ts
apps/api/src/modules/groups/presentation/graphql/types/group-invitation-status.type.ts
apps/api/src/modules/groups/presentation/graphql/types/group.type.ts
apps/api/src/modules/groups/presentation/graphql/types/group-member.type.ts
apps/api/src/modules/groups/presentation/graphql/types/group-invitation.type.ts
apps/api/src/modules/groups/presentation/graphql/types/deck-group-share.type.ts
apps/api/src/modules/groups/presentation/graphql/types/share-deck-with-group-payload.type.ts

apps/api/src/modules/groups/presentation/graphql/inputs/create-group.input.ts
apps/api/src/modules/groups/presentation/graphql/inputs/invite-user-to-group.input.ts
apps/api/src/modules/groups/presentation/graphql/inputs/share-deck-with-group.input.ts
```

## Requirements

Inputs:

```txt
CreateGroupInput:
- name
- description optional nullable

InviteUserToGroupInput:
- groupId
- email

ShareDeckWithGroupInput:
- deckId
- groupId
```

Types:

```txt
GroupType:
- id
- name
- description
- createdById
- createdAt
- updatedAt

GroupMemberType:
- id
- groupId
- userId
- role
- createdAt

GroupInvitationType:
- id
- groupId
- email
- invitedById
- status
- expiresAt
- createdAt
- acceptedAt
- declinedAt

DeckGroupShareType:
- id
- deckId
- groupId
- permission
- createdById
- createdAt

ShareDeckWithGroupPayloadType:
- share
```

Do not expose:

```txt
deletedAt
```

in normal GraphQL outputs.

## Security Requirements

```txt
- GraphQL types must not expose sensitive auth fields.
- User can see only groups/invitations they are allowed to see.
```

## Acceptance Criteria

```txt
- Group GraphQL types exist.
- Group GraphQL inputs exist.
- API builds.
```

## Commands to Run

```bash
pnpm --filter @flashcards/api build
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
chore(groups): add group GraphQL types
```

---

# TASK-10.10 Add CreateGroupUseCase

## Status

TODO

## Context

Authenticated users need to create groups.

## Goal

Add `CreateGroupUseCase`.

## Files to Create

```txt
apps/api/src/modules/groups/application/use-cases/create-group.use-case.ts
```

## Files to Modify

```txt
apps/api/src/modules/groups/groups.module.ts
```

## Requirements

Input:

```ts
export type CreateGroupUseCaseInput = {
  currentUser: AuthUser
  name: string
  description?: string | null
}
```

Output:

```ts
export type CreateGroupUseCaseResult = Group
```

Use case must:

```txt
1. Validate authenticated user exists.
2. Reject blocked user.
3. Validate group name.
4. Validate description.
5. Create group with current user as createdById.
6. Add current user as OWNER member.
7. Return group.
```

Validation:

```txt
name:
- required
- trim
- min 1 character
- max 120 characters

description:
- optional
- trim
- max 1000 characters
```

## Security Requirements

```txt
- User cannot create group for another user.
- Current user becomes OWNER.
```

## Architecture Constraints

```txt
- Use case depends on ports.
- Use case must not import Prisma.
- Use case must not import GraphQL decorators.
```

## Acceptance Criteria

```txt
- CreateGroupUseCase exists.
- Authenticated user can create group.
- Creator becomes OWNER.
- Blocked user cannot create group.
- API builds.
```

## Commands to Run

```bash
pnpm --filter @flashcards/api build
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
feat(groups): add create group use case
```

---

# TASK-10.11 Add createGroup mutation

## Status

TODO

## Context

Frontend needs a mutation to create groups.

## Goal

Add protected `createGroup` mutation.

## Files to Create

```txt
apps/api/src/modules/groups/presentation/graphql/resolvers/groups.resolver.ts
```

## Files to Modify

```txt
apps/api/src/modules/groups/groups.module.ts
```

## Requirements

Add mutation:

```graphql
createGroup(input: CreateGroupInput!): GroupType!
```

Mutation must:

```txt
- require GqlAuthGuard
- use CurrentUser
- call CreateGroupUseCase
- return group
```

Resolver must not:

```txt
- query Prisma
- add owner membership directly
```

## Acceptance Criteria

```txt
- createGroup mutation exists.
- Mutation requires auth.
- Creator becomes OWNER.
- API builds.
```

## Commands to Run

```bash
pnpm --filter @flashcards/api build
pnpm --filter @flashcards/api start:dev
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
feat(groups): add create group mutation
```

---

# TASK-10.12 Add MyGroupsUseCase

## Status

TODO

## Context

Authenticated users need to list groups they belong to.

## Goal

Add `MyGroupsUseCase`.

## Files to Create

```txt
apps/api/src/modules/groups/application/use-cases/my-groups.use-case.ts
```

## Files to Modify

```txt
apps/api/src/modules/groups/groups.module.ts
```

## Requirements

Input:

```ts
export type MyGroupsUseCaseInput = {
  currentUser: AuthUser
}
```

Output:

```ts
export type MyGroupsUseCaseResult = GroupWithMyRole[]
```

Use case must:

```txt
1. Validate authenticated user exists.
2. Reject blocked user.
3. Load groups where current user is member.
4. Return groups with myRole.
```

## Security Requirements

```txt
- User can list only groups where user is member.
```

## Architecture Constraints

```txt
- Use case depends on repository port.
- Use case must not import Prisma.
- Use case must not import GraphQL decorators.
```

## Acceptance Criteria

```txt
- MyGroupsUseCase exists.
- User gets only own groups.
- API builds.
```

## Commands to Run

```bash
pnpm --filter @flashcards/api build
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
feat(groups): add my groups use case
```

---

# TASK-10.13 Add myGroups query

## Status

TODO

## Context

Frontend needs a query for current user's groups.

## Goal

Add protected `myGroups` query.

## Files to Modify

```txt
apps/api/src/modules/groups/presentation/graphql/resolvers/groups.resolver.ts
apps/api/src/modules/groups/groups.module.ts
```

## Requirements

Add query:

```graphql
myGroups: [GroupType!]!
```

Query must:

```txt
- require GqlAuthGuard
- use CurrentUser
- call MyGroupsUseCase
- return groups
```

Resolver must not:

```txt
- query Prisma
- accept userId input
```

## Acceptance Criteria

```txt
- myGroups query exists.
- Query requires auth.
- Query returns only user's groups.
- API builds.
```

## Commands to Run

```bash
pnpm --filter @flashcards/api build
pnpm --filter @flashcards/api start:dev
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
feat(groups): add my groups query
```

---

# TASK-10.14 Add GroupDetailUseCase

## Status

TODO

## Context

Group members need to view group details.

## Goal

Add `GroupDetailUseCase`.

## Files to Create

```txt
apps/api/src/modules/groups/application/use-cases/group-detail.use-case.ts
```

## Files to Modify

```txt
apps/api/src/modules/groups/groups.module.ts
```

## Requirements

Input:

```ts
export type GroupDetailUseCaseInput = {
  currentUser: AuthUser
  groupId: string
}
```

Output:

```ts
export type GroupDetailUseCaseResult = {
  group: Group
  myMember: GroupMember
  members: GroupMember[]
}
```

Use case must:

```txt
1. Validate authenticated user exists.
2. Reject blocked user.
3. Load group.
4. If missing/deleted, throw GROUP_NOT_FOUND.
5. Load current user's membership.
6. Check GroupPermissionService.canViewGroup.
7. If forbidden, throw GROUP_FORBIDDEN.
8. Load members.
9. Return group, myMember, members.
```

## Security Requirements

```txt
- Only group members can view group detail.
- Non-members cannot view group membership list.
```

## Acceptance Criteria

```txt
- GroupDetailUseCase exists.
- Member can view group.
- Non-member cannot view group.
- API builds.
```

## Commands to Run

```bash
pnpm --filter @flashcards/api build
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
feat(groups): add group detail use case
```

---

# TASK-10.15 Add group query

## Status

TODO

## Context

Frontend needs a query for group details.

## Goal

Add protected `group(id)` query.

## Files to Modify

```txt
apps/api/src/modules/groups/presentation/graphql/resolvers/groups.resolver.ts
apps/api/src/modules/groups/groups.module.ts
```

## Requirements

Add query:

```graphql
group(id: ID!): GroupType!
```

Query must:

```txt
- require GqlAuthGuard
- use CurrentUser
- call GroupDetailUseCase
- return group
```

Resolver must not:

```txt
- query Prisma
- check membership directly
```

## Acceptance Criteria

```txt
- group query exists.
- Query requires auth.
- Member can view group.
- Non-member is rejected.
- API builds.
```

## Commands to Run

```bash
pnpm --filter @flashcards/api build
pnpm --filter @flashcards/api start:dev
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
feat(groups): add group query
```

---

# TASK-10.16 Add InviteUserToGroupUseCase

## Status

TODO

## Context

Group OWNER or ADMIN can invite users by email.

## Goal

Add `InviteUserToGroupUseCase`.

## Files to Create

```txt
apps/api/src/modules/groups/application/use-cases/invite-user-to-group.use-case.ts
```

## Files to Modify

```txt
apps/api/src/modules/groups/groups.module.ts
```

## Requirements

Input:

```ts
export type InviteUserToGroupUseCaseInput = {
  currentUser: AuthUser
  groupId: string
  email: string
}
```

Output:

```ts
export type InviteUserToGroupUseCaseResult = GroupInvitation
```

Use case must:

```txt
1. Validate authenticated user exists.
2. Reject blocked user.
3. Load group.
4. If missing/deleted, throw GROUP_NOT_FOUND.
5. Load current user's group membership.
6. Check GroupPermissionService.canInviteToGroup.
7. If forbidden, throw GROUP_FORBIDDEN.
8. Normalize invitation email.
9. Avoid duplicate pending invitation for same group/email.
10. Create pending invitation with expiry.
11. Return invitation.
```

Expiry:

```txt
7 days
```

Email sending:

```txt
MVP may skip sending group invitation email.
If email sending is added, use EmailProviderPort.
```

## Security Requirements

```txt
- Only OWNER or ADMIN can invite.
- MEMBER cannot invite.
- Non-member cannot invite.
- Do not expose whether invited email is registered unless needed.
```

## Acceptance Criteria

```txt
- InviteUserToGroupUseCase exists.
- OWNER can invite.
- ADMIN can invite.
- MEMBER cannot invite.
- Duplicate pending invitation is avoided.
- API builds.
```

## Commands to Run

```bash
pnpm --filter @flashcards/api build
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
feat(groups): add invite user use case
```

---

# TASK-10.17 Add inviteUserToGroup mutation

## Status

TODO

## Context

Frontend needs a mutation to invite users to a group.

## Goal

Add protected `inviteUserToGroup` mutation.

## Files to Modify

```txt
apps/api/src/modules/groups/presentation/graphql/resolvers/groups.resolver.ts
apps/api/src/modules/groups/groups.module.ts
```

## Requirements

Add mutation:

```graphql
inviteUserToGroup(input: InviteUserToGroupInput!): GroupInvitationType!
```

Mutation must:

```txt
- require GqlAuthGuard
- use CurrentUser
- call InviteUserToGroupUseCase
- return invitation
```

Resolver must not:

```txt
- query Prisma
- check role directly
```

## Acceptance Criteria

```txt
- inviteUserToGroup mutation exists.
- Mutation requires auth.
- OWNER/ADMIN can invite.
- MEMBER is rejected.
- API builds.
```

## Commands to Run

```bash
pnpm --filter @flashcards/api build
pnpm --filter @flashcards/api start:dev
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
feat(groups): add invite user mutation
```

---

# TASK-10.18 Add MyGroupInvitationsUseCase

## Status

TODO

## Context

Authenticated users need to see pending invitations sent to their email.

## Goal

Add `MyGroupInvitationsUseCase`.

## Files to Create

```txt
apps/api/src/modules/groups/application/use-cases/my-group-invitations.use-case.ts
```

## Files to Modify

```txt
apps/api/src/modules/groups/groups.module.ts
```

## Requirements

Input:

```ts
export type MyGroupInvitationsUseCaseInput = {
  currentUser: AuthUser
}
```

Output:

```ts
export type MyGroupInvitationsUseCaseResult = GroupInvitation[]
```

Use case must:

```txt
1. Validate authenticated user exists.
2. Reject blocked user.
3. Find pending invitations for current user's normalized email.
4. Return non-expired pending invitations.
```

## Security Requirements

```txt
- User sees only invitations for own email.
- User cannot query invitations for arbitrary email.
```

## Acceptance Criteria

```txt
- MyGroupInvitationsUseCase exists.
- User sees own pending invitations.
- User cannot see another email's invitations.
- API builds.
```

## Commands to Run

```bash
pnpm --filter @flashcards/api build
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
feat(groups): add my group invitations use case
```

---

# TASK-10.19 Add myGroupInvitations query

## Status

TODO

## Context

Frontend needs a query to display pending group invitations.

## Goal

Add protected `myGroupInvitations` query.

## Files to Modify

```txt
apps/api/src/modules/groups/presentation/graphql/resolvers/groups.resolver.ts
apps/api/src/modules/groups/groups.module.ts
```

## Requirements

Add query:

```graphql
myGroupInvitations: [GroupInvitationType!]!
```

Query must:

```txt
- require GqlAuthGuard
- use CurrentUser
- call MyGroupInvitationsUseCase
- return invitations
```

Resolver must not:

```txt
- accept email input
- query Prisma
```

## Acceptance Criteria

```txt
- myGroupInvitations query exists.
- Query requires auth.
- Query returns only current user's invitations.
- API builds.
```

## Commands to Run

```bash
pnpm --filter @flashcards/api build
pnpm --filter @flashcards/api start:dev
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
feat(groups): add my group invitations query
```

---

# TASK-10.20 Add AcceptGroupInvitationUseCase

## Status

TODO

## Context

Users need to accept group invitations sent to their email.

## Goal

Add `AcceptGroupInvitationUseCase`.

## Files to Create

```txt
apps/api/src/modules/groups/application/use-cases/accept-group-invitation.use-case.ts
```

## Files to Modify

```txt
apps/api/src/modules/groups/groups.module.ts
```

## Requirements

Input:

```ts
export type AcceptGroupInvitationUseCaseInput = {
  currentUser: AuthUser
  invitationId: string
}
```

Output:

```ts
export type AcceptGroupInvitationUseCaseResult = {
  invitation: GroupInvitation
  member: GroupMember
}
```

Use case must:

```txt
1. Validate authenticated user exists.
2. Reject blocked user.
3. Load invitation.
4. If missing, throw GROUP_INVITATION_NOT_FOUND.
5. Check invitation status is PENDING.
6. Check invitation is not expired.
7. Check invitation email matches current user email.
8. Load group.
9. If group missing/deleted, reject.
10. Add current user as MEMBER if not already member.
11. Mark invitation ACCEPTED.
12. Return invitation and member.
```

## Security Requirements

```txt
- User can accept only own invitation.
- Expired invitation cannot be accepted.
- Accepted/declined/cancelled invitation cannot be accepted.
```

## Acceptance Criteria

```txt
- AcceptGroupInvitationUseCase exists.
- User can accept own pending invitation.
- User cannot accept another email's invitation.
- Expired invitation is rejected.
- Member is created.
- API builds.
```

## Commands to Run

```bash
pnpm --filter @flashcards/api build
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
feat(groups): add accept invitation use case
```

---

# TASK-10.21 Add acceptGroupInvitation mutation

## Status

TODO

## Context

Frontend needs a mutation to accept group invitations.

## Goal

Add protected `acceptGroupInvitation` mutation.

## Files to Create

```txt
apps/api/src/modules/groups/presentation/graphql/types/accept-group-invitation-payload.type.ts
```

## Files to Modify

```txt
apps/api/src/modules/groups/presentation/graphql/resolvers/groups.resolver.ts
apps/api/src/modules/groups/groups.module.ts
```

## Requirements

Create payload:

```txt
AcceptGroupInvitationPayloadType:
- invitation
- member
```

Add mutation:

```graphql
acceptGroupInvitation(invitationId: ID!): AcceptGroupInvitationPayloadType!
```

Mutation must:

```txt
- require GqlAuthGuard
- use CurrentUser
- call AcceptGroupInvitationUseCase
- return payload
```

Resolver must not:

```txt
- query Prisma
- check email directly
```

## Acceptance Criteria

```txt
- acceptGroupInvitation mutation exists.
- Mutation requires auth.
- User can accept own invitation.
- API builds.
```

## Commands to Run

```bash
pnpm --filter @flashcards/api build
pnpm --filter @flashcards/api start:dev
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
feat(groups): add accept invitation mutation
```

---

# TASK-10.22 Add DeclineGroupInvitationUseCase

## Status

TODO

## Context

Users need to decline group invitations sent to their email.

## Goal

Add `DeclineGroupInvitationUseCase`.

## Files to Create

```txt
apps/api/src/modules/groups/application/use-cases/decline-group-invitation.use-case.ts
```

## Files to Modify

```txt
apps/api/src/modules/groups/groups.module.ts
```

## Requirements

Input:

```ts
export type DeclineGroupInvitationUseCaseInput = {
  currentUser: AuthUser
  invitationId: string
}
```

Output:

```ts
export type DeclineGroupInvitationUseCaseResult = GroupInvitation
```

Use case must:

```txt
1. Validate authenticated user exists.
2. Reject blocked user.
3. Load invitation.
4. If missing, throw GROUP_INVITATION_NOT_FOUND.
5. Check invitation status is PENDING.
6. Check invitation email matches current user email.
7. Mark invitation DECLINED.
8. Return invitation.
```

## Security Requirements

```txt
- User can decline only own invitation.
- User cannot decline another user's invitation.
```

## Acceptance Criteria

```txt
- DeclineGroupInvitationUseCase exists.
- User can decline own pending invitation.
- User cannot decline another email's invitation.
- API builds.
```

## Commands to Run

```bash
pnpm --filter @flashcards/api build
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
feat(groups): add decline invitation use case
```

---

# TASK-10.23 Add declineGroupInvitation mutation

## Status

TODO

## Context

Frontend needs a mutation to decline group invitations.

## Goal

Add protected `declineGroupInvitation` mutation.

## Files to Modify

```txt
apps/api/src/modules/groups/presentation/graphql/resolvers/groups.resolver.ts
apps/api/src/modules/groups/groups.module.ts
```

## Requirements

Add mutation:

```graphql
declineGroupInvitation(invitationId: ID!): GroupInvitationType!
```

Mutation must:

```txt
- require GqlAuthGuard
- use CurrentUser
- call DeclineGroupInvitationUseCase
- return invitation
```

Resolver must not:

```txt
- query Prisma
- check email directly
```

## Acceptance Criteria

```txt
- declineGroupInvitation mutation exists.
- Mutation requires auth.
- User can decline own invitation.
- API builds.
```

## Commands to Run

```bash
pnpm --filter @flashcards/api build
pnpm --filter @flashcards/api start:dev
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
feat(groups): add decline invitation mutation
```

---

# TASK-10.24 Add ShareDeckWithGroupUseCase

## Status

TODO

## Context

Group OWNER/ADMIN can share their own deck with a group.

MVP share permission is VIEW only.

## Goal

Add `ShareDeckWithGroupUseCase`.

## Files to Create

```txt
apps/api/src/modules/groups/application/use-cases/share-deck-with-group.use-case.ts
```

## Files to Modify

```txt
apps/api/src/modules/groups/groups.module.ts
```

## Requirements

Input:

```ts
export type ShareDeckWithGroupUseCaseInput = {
  currentUser: AuthUser
  deckId: string
  groupId: string
}
```

Output:

```ts
export type ShareDeckWithGroupUseCaseResult = DeckGroupShare
```

Use case must:

```txt
1. Validate authenticated user exists.
2. Reject blocked user.
3. Load deck.
4. If missing/deleted, throw DECK_NOT_FOUND.
5. Check DeckPermissionService.canManageDeck.
6. If forbidden, throw DECK_FORBIDDEN.
7. Load group.
8. If missing/deleted, throw GROUP_NOT_FOUND.
9. Load current user's group membership.
10. Check GroupPermissionService.canShareDeckWithGroup.
11. If forbidden, throw GROUP_FORBIDDEN.
12. Avoid duplicate active share.
13. Create DeckGroupShare with permission VIEW.
14. Return share.
```

## Security Requirements

```txt
- User must own/manage deck.
- User must be group OWNER or ADMIN.
- MEMBER cannot share.
- Share gives VIEW permission only.
- Share does not grant edit permission.
```

## Acceptance Criteria

```txt
- ShareDeckWithGroupUseCase exists.
- OWNER can share owned deck.
- ADMIN can share owned deck.
- MEMBER cannot share.
- Non-owner cannot share deck.
- Duplicate share is avoided.
- API builds.
```

## Commands to Run

```bash
pnpm --filter @flashcards/api build
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
feat(groups): add share deck with group use case
```

---

# TASK-10.25 Add shareDeckWithGroup mutation

## Status

TODO

## Context

Frontend needs a mutation to share decks with groups.

## Goal

Add protected `shareDeckWithGroup` mutation.

## Files to Modify

```txt
apps/api/src/modules/groups/presentation/graphql/resolvers/groups.resolver.ts
apps/api/src/modules/groups/groups.module.ts
```

## Requirements

Add mutation:

```graphql
shareDeckWithGroup(input: ShareDeckWithGroupInput!): ShareDeckWithGroupPayloadType!
```

Mutation must:

```txt
- require GqlAuthGuard
- use CurrentUser
- call ShareDeckWithGroupUseCase
- return share payload
```

Resolver must not:

```txt
- query Prisma
- check deck owner directly
- check group role directly
```

## Acceptance Criteria

```txt
- shareDeckWithGroup mutation exists.
- Mutation requires auth.
- OWNER/ADMIN can share owned deck.
- MEMBER is rejected.
- Non-owner deck sharing is rejected.
- API builds.
```

## Commands to Run

```bash
pnpm --filter @flashcards/api build
pnpm --filter @flashcards/api start:dev
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
feat(groups): add share deck with group mutation
```

---

# TASK-10.26 Add GroupSharedDecksUseCase

## Status

TODO

## Context

Group members need to view decks shared with their group.

## Goal

Add `GroupSharedDecksUseCase`.

## Files to Create

```txt
apps/api/src/modules/groups/application/use-cases/group-shared-decks.use-case.ts
```

## Files to Modify

```txt
apps/api/src/modules/groups/groups.module.ts
```

## Requirements

Input:

```ts
export type GroupSharedDecksUseCaseInput = {
  currentUser: AuthUser
  groupId: string
}
```

Output:

```ts
export type GroupSharedDecksUseCaseResult = Deck[]
```

Use case must:

```txt
1. Validate authenticated user exists.
2. Reject blocked user.
3. Load group.
4. If missing/deleted, throw GROUP_NOT_FOUND.
5. Load current user's membership.
6. Check GroupPermissionService.canViewGroup.
7. If forbidden, throw GROUP_FORBIDDEN.
8. Load decks shared with group.
9. Return non-deleted shared decks.
```

## Security Requirements

```txt
- Only group members can view shared decks.
- Shared deck visibility is group-limited.
- Non-members cannot list shared decks.
```

## Acceptance Criteria

```txt
- GroupSharedDecksUseCase exists.
- Group member can list shared decks.
- Non-member cannot list shared decks.
- API builds.
```

## Commands to Run

```bash
pnpm --filter @flashcards/api build
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
feat(groups): add group shared decks use case
```

---

# TASK-10.27 Add groupSharedDecks query

## Status

TODO

## Context

Frontend needs a query to show decks shared with a group.

## Goal

Add protected `groupSharedDecks` query.

## Files to Modify

```txt
apps/api/src/modules/groups/presentation/graphql/resolvers/groups.resolver.ts
apps/api/src/modules/groups/groups.module.ts
```

## Requirements

Add query:

```graphql
groupSharedDecks(groupId: ID!): [DeckType!]!
```

Query must:

```txt
- require GqlAuthGuard
- use CurrentUser
- call GroupSharedDecksUseCase
- return shared decks
```

Resolver must not:

```txt
- query Prisma
- check membership directly
```

## Acceptance Criteria

```txt
- groupSharedDecks query exists.
- Query requires auth.
- Group member can view shared decks.
- Non-member is rejected.
- API builds.
```

## Commands to Run

```bash
pnpm --filter @flashcards/api build
pnpm --filter @flashcards/api start:dev
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
feat(groups): add group shared decks query
```

---

# TASK-10.28 Extend deck permissions for group shared decks

## Status

TODO

## Context

After deck sharing exists, deck visibility and lesson access must include group-shared decks.

This affects deck/card queries and lessons.

## Goal

Extend deck permissions and use cases to support group-shared decks.

## Files to Modify

```txt
apps/api/src/modules/decks/domain/services/deck-permission.service.ts
apps/api/src/modules/decks/application/use-cases/get-deck.use-case.ts
apps/api/src/modules/decks/application/use-cases/deck-cards.use-case.ts
apps/api/src/modules/lessons/application/use-cases/start-lesson.use-case.ts
apps/api/src/modules/lessons/application/use-cases/deck-learning-stats.use-case.ts
```

## Requirements

Update view permission to include:

```txt
- user owns deck
- deck is public and approved
- deck is shared with a group where user is a member
```

Implementation approach:

```txt
1. Keep DeckPermissionService pure for owner/public checks.
2. Use DeckGroupShareRepositoryPort.userHasAccessToDeck in use cases where group access is needed.
3. If owner/public check fails, check group access.
4. If group access is true, allow view/study.
```

Must affect:

```txt
deck query
deckCards query
startLesson mutation
deckLearningStats query
```

Must not affect edit permissions:

```txt
updateDeck
deleteDeck
createCard
updateCard
deleteCard
CSV import
AI example generation/save
```

## Security Requirements

```txt
- Group share grants view/study only.
- Group share does not grant edit permission.
- Non-members cannot view group-shared decks.
```

## Acceptance Criteria

```txt
- Group member can view shared deck.
- Group member can view shared deck cards.
- Group member can start lesson from shared deck.
- Group member gets own review state.
- Group member cannot edit shared deck.
- Group member cannot edit shared cards.
- API builds.
```

## Commands to Run

```bash
pnpm --filter @flashcards/api build
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
feat(groups): allow viewing and studying group shared decks
```

---

# TASK-10.29 Add groups and sharing final checks

## Status

TODO

## Context

Groups and sharing are permission-sensitive.

## Goal

Run final checks for groups and sharing.

## Manual GraphQL Checks

Verify:

```txt
- createGroup requires auth
- creator becomes OWNER
- myGroups returns user's groups
- group query works for member
- group query fails for non-member
- OWNER can invite user
- ADMIN can invite user
- MEMBER cannot invite user
- invited user sees own invitation
- invited user can accept own invitation
- invited user cannot accept another user's invitation
- invited user can decline own invitation
- OWNER can share owned deck with group
- ADMIN can share owned deck with group
- MEMBER cannot share deck
- non-owner cannot share deck with group
- group member can view shared deck
- group member can view shared deck cards
- group member can start lesson from shared deck
- group member cannot update shared deck
- group member cannot create/update/delete cards in shared deck
```

## Security Checks

Verify:

```txt
- Backend enforces all group permissions.
- Frontend role visibility is not relied on.
- Resolvers do not access Prisma directly.
- Permission logic is not inside resolvers.
- Group share grants VIEW only.
- Group share does not grant edit permission.
```

## Commands to Run

```bash
pnpm format:check
pnpm lint
pnpm --filter @flashcards/api exec prisma validate
pnpm --filter @flashcards/api build
pnpm --filter @flashcards/api start:dev
```

## Do Not Do

```txt
- Do not move to notifications until group permission checks pass.
- Do not allow edit access through group sharing.
```

## Acceptance Criteria

```txt
- Groups work.
- Invitations work.
- Deck sharing works.
- Group-shared deck viewing works.
- Group-shared lessons work.
- Group-shared decks remain view-only.
- Format check passes.
- Lint passes.
- Prisma validate passes.
- API build passes.
- git status is clean after commit.
```

## Expected Commit Message

```txt
chore(groups): finalize groups and sharing
```

---

## Epic Completion Criteria

EPIC-10 is complete when:

```txt
- Groups Prisma schema exists.
- GroupsModule exists.
- Group domain types exist.
- Group repository ports exist.
- GroupPermissionService exists.
- Prisma group repository exists.
- Prisma group invitation repository exists.
- Prisma deck group share repository exists.
- Group GraphQL types exist.
- CreateGroupUseCase exists.
- createGroup mutation works.
- MyGroupsUseCase exists.
- myGroups query works.
- GroupDetailUseCase exists.
- group query works.
- InviteUserToGroupUseCase exists.
- inviteUserToGroup mutation works.
- MyGroupInvitationsUseCase exists.
- myGroupInvitations query works.
- AcceptGroupInvitationUseCase exists.
- acceptGroupInvitation mutation works.
- DeclineGroupInvitationUseCase exists.
- declineGroupInvitation mutation works.
- ShareDeckWithGroupUseCase exists.
- shareDeckWithGroup mutation works.
- GroupSharedDecksUseCase exists.
- groupSharedDecks query works.
- Group members can view/study shared decks.
- Group members cannot edit shared decks.
- implementation follows docs/domain/permissions.md.
- implementation follows docs/security/security-checklist.md.
```

After this epic is complete, move to:

```txt
docs/tasks/11-notifications.md
```
