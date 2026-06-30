# EPIC-05 Decks & Cards

## Epic Goal

Implement backend deck and card management for Flashcards.

This epic covers:

```txt
- creating decks
- listing my decks
- viewing deck details
- updating decks
- deleting decks with soft delete
- creating cards
- listing cards in a deck
- updating cards
- deleting cards with soft delete
- owner-only edit permissions
```

Public decks, publishing, public search, and copying public decks are handled in:

```txt
docs/tasks/06-public-decks.md
```

Lessons and SRS are handled in:

```txt
docs/tasks/07-srs-lessons.md
```

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
docs/tasks/04-user-profile-settings.md
```

## Epic Prerequisites

EPIC-04 should be complete.

Expected state:

```txt
- AuthModule exists.
- GqlAuthGuard exists.
- CurrentUser decorator exists.
- User model exists.
- Account/profile/settings work.
- Prisma infrastructure exists.
- Common error foundation exists.
```

## Epic Rules

```txt
1. Follow docs/domain/permissions.md exactly.
2. Follow docs/security/security-checklist.md exactly.
3. Backend is the source of truth for permissions.
4. Frontend visibility is not security.
5. Only deck owner can create/update/delete cards in own deck.
6. Only deck owner can update/delete own deck.
7. Soft delete decks and cards.
8. Do not expose deleted decks/cards in normal queries.
9. Do not put business logic in GraphQL resolvers.
10. Do not access Prisma directly from GraphQL resolvers.
11. Do not implement public deck search in this epic.
12. Do not implement lessons/SRS in this epic.
```

## Domain Scope

Deck fields:

```txt
id
ownerId
title
description
visibility
moderationStatus
isOfficial
sourceDeckId
createdAt
updatedAt
deletedAt
```

Card fields:

```txt
id
deckId
front
back
example
notes
position
createdAt
updatedAt
deletedAt
```

## MVP Visibility Defaults

When user creates a deck:

```txt
visibility = PRIVATE
moderationStatus = NONE
isOfficial = false
sourceDeckId = null
```

## Validation Rules

Deck:

```txt
title:
- required
- trim
- min 1 character
- max 120 characters

description:
- optional
- trim
- max 1000 characters
```

Card:

```txt
front:
- required
- trim
- min 1 character
- max 2000 characters

back:
- required
- trim
- min 1 character
- max 4000 characters

example:
- optional
- trim
- max 4000 characters

notes:
- optional
- trim
- max 4000 characters

position:
- integer
- min 0
```

## Epic Summary

```md
- [x] TASK-05.01 Add deck/card Prisma schema
- [x] TASK-05.02 Add decks module skeleton
- [x] TASK-05.03 Add deck/card domain types
- [x] TASK-05.04 Add deck/card repository ports
- [x] TASK-05.05 Add DeckPermissionService
- [x] TASK-05.06 Add Prisma deck repository
- [x] TASK-05.07 Add Prisma card repository
- [x] TASK-05.08 Add deck/card GraphQL types and inputs
- [x] TASK-05.09 Add CreateDeckUseCase
- [x] TASK-05.10 Add createDeck mutation
- [x] TASK-05.11 Add MyDecksUseCase
- [x] TASK-05.12 Add myDecks query
- [x] TASK-05.13 Add GetDeckUseCase
- [x] TASK-05.14 Add deck query
- [x] TASK-05.15 Add UpdateDeckUseCase
- [x] TASK-05.16 Add updateDeck mutation
- [x] TASK-05.17 Add DeleteDeckUseCase
- [x] TASK-05.18 Add deleteDeck mutation
- [x] TASK-05.19 Add CreateCardUseCase
- [x] TASK-05.20 Add createCard mutation
- [x] TASK-05.21 Add DeckCardsUseCase
- [x] TASK-05.22 Add deckCards query
- [x] TASK-05.23 Add UpdateCardUseCase
- [x] TASK-05.24 Add updateCard mutation
- [ ] TASK-05.25 Add DeleteCardUseCase
- [ ] TASK-05.26 Add deleteCard mutation
- [ ] TASK-05.27 Add decks/cards final checks
```

---

# TASK-05.01 Add deck/card Prisma schema

## Status

DONE

## Context

Decks and cards are core Flashcards entities.

This task adds persistence models only.

## Goal

Add deck and card models to Prisma schema.

## Files to Modify

```txt
apps/api/prisma/schema.prisma
```

## Requirements

Add enums:

```prisma
enum DeckVisibility {
  PRIVATE
  PUBLIC
}

enum DeckModerationStatus {
  NONE
  PENDING
  APPROVED
  REJECTED
  HIDDEN
}
```

Add relations to `User` model:

```prisma
decks Deck[]
```

Add `Deck` model:

```prisma
model Deck {
  id               String               @id @default(uuid())
  ownerId          String
  title            String
  description      String?
  visibility       DeckVisibility       @default(PRIVATE)
  moderationStatus DeckModerationStatus @default(NONE)
  isOfficial       Boolean              @default(false)
  sourceDeckId     String?

  createdAt        DateTime             @default(now())
  updatedAt        DateTime             @updatedAt
  deletedAt        DateTime?

  owner            User                 @relation(fields: [ownerId], references: [id], onDelete: Cascade)
  cards            Card[]

  @@index([ownerId])
  @@index([visibility])
  @@index([moderationStatus])
  @@index([isOfficial])
  @@index([deletedAt])
}
```

Add `Card` model:

```prisma
model Card {
  id        String    @id @default(uuid())
  deckId    String
  front     String
  back      String
  example   String?
  notes     String?
  position  Int       @default(0)

  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  deletedAt DateTime?

  deck      Deck      @relation(fields: [deckId], references: [id], onDelete: Cascade)

  @@index([deckId])
  @@index([position])
  @@index([deletedAt])
}
```

## Security Requirements

```txt
- Do not expose deleted decks/cards in normal queries.
- Do not expose private decks to non-owners.
```

## Architecture Constraints

```txt
- This task only changes persistence schema.
- Do not add repositories yet.
- Do not add GraphQL types yet.
```

## Do Not Do

```txt
- Do not add public search logic.
- Do not add SRS state.
- Do not add groups.
```

## Acceptance Criteria

```txt
- DeckVisibility enum exists.
- DeckModerationStatus enum exists.
- Deck model exists.
- Card model exists.
- User has decks relation.
- Prisma schema validates.
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
chore(db): add deck and card schema
```

---

# TASK-05.02 Add decks module skeleton

## Status

DONE

## Context

Deck and card features should live in a dedicated module.

## Goal

Create decks module folder structure.

## Files to Create

```txt
apps/api/src/modules/decks/decks.module.ts

apps/api/src/modules/decks/domain/.gitkeep
apps/api/src/modules/decks/domain/entities/.gitkeep
apps/api/src/modules/decks/domain/types/.gitkeep
apps/api/src/modules/decks/domain/services/.gitkeep

apps/api/src/modules/decks/application/.gitkeep
apps/api/src/modules/decks/application/ports/.gitkeep
apps/api/src/modules/decks/application/use-cases/.gitkeep

apps/api/src/modules/decks/infrastructure/.gitkeep
apps/api/src/modules/decks/infrastructure/persistence/.gitkeep
apps/api/src/modules/decks/infrastructure/mappers/.gitkeep

apps/api/src/modules/decks/presentation/.gitkeep
apps/api/src/modules/decks/presentation/graphql/.gitkeep
apps/api/src/modules/decks/presentation/graphql/inputs/.gitkeep
apps/api/src/modules/decks/presentation/graphql/types/.gitkeep
apps/api/src/modules/decks/presentation/graphql/resolvers/.gitkeep
```

## Files to Modify

```txt
apps/api/src/app.module.ts
```

## Requirements

Create `DecksModule`:

```ts
import { Module } from '@nestjs/common'

@Module({})
export class DecksModule {}
```

Import `DecksModule` into `AppModule`.

## Architecture Constraints

```txt
- Keep module empty for now.
- Do not implement business logic in this task.
```

## Do Not Do

```txt
- Do not add resolvers yet.
- Do not add repositories yet.
```

## Acceptance Criteria

```txt
- DecksModule exists.
- DecksModule is imported into AppModule.
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
chore(decks): add decks module skeleton
```

---

# TASK-05.03 Add deck/card domain types

## Status

DONE

## Context

Deck and card use cases need framework-independent types.

## Goal

Add domain types for decks and cards.

## Files to Create

```txt
apps/api/src/modules/decks/domain/types/deck-visibility.type.ts
apps/api/src/modules/decks/domain/types/deck-moderation-status.type.ts
apps/api/src/modules/decks/domain/types/deck.type.ts
apps/api/src/modules/decks/domain/types/card.type.ts
apps/api/src/modules/decks/domain/types/index.ts
```

## Requirements

Create `DeckVisibility`:

```ts
export type DeckVisibility = 'PRIVATE' | 'PUBLIC'
```

Create `DeckModerationStatus`:

```ts
export type DeckModerationStatus = 'NONE' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'HIDDEN'
```

Create `Deck`:

```ts
import { DeckModerationStatus } from './deck-moderation-status.type'
import { DeckVisibility } from './deck-visibility.type'

export type Deck = {
  id: string
  ownerId: string
  title: string
  description: string | null
  visibility: DeckVisibility
  moderationStatus: DeckModerationStatus
  isOfficial: boolean
  sourceDeckId: string | null
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
}
```

Create `Card`:

```ts
export type Card = {
  id: string
  deckId: string
  front: string
  back: string
  example: string | null
  notes: string | null
  position: number
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
}
```

## Security Requirements

```txt
- Types may include deletedAt for backend internal logic.
- GraphQL public output should avoid exposing unnecessary internal fields where not needed.
```

## Architecture Constraints

```txt
- Domain types must not import Prisma.
- Domain types must not import GraphQL decorators.
- Domain types must not import NestJS.
```

## Do Not Do

```txt
- Do not create GraphQL types yet.
- Do not implement repositories yet.
```

## Acceptance Criteria

```txt
- Deck type exists.
- Card type exists.
- Visibility and moderation status types exist.
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
chore(decks): add deck and card domain types
```

---

# TASK-05.04 Add deck/card repository ports

## Status

DONE

## Context

Use cases must depend on repository ports, not Prisma.

## Goal

Add repository ports for decks and cards.

## Files to Create

```txt
apps/api/src/modules/decks/application/ports/deck-repository.port.ts
apps/api/src/modules/decks/application/ports/card-repository.port.ts
```

## Requirements

Create `DeckRepositoryPort`:

```ts
import { Deck } from '../../domain/types'

export const DECK_REPOSITORY = Symbol('DECK_REPOSITORY')

export type CreateDeckInput = {
  ownerId: string
  title: string
  description?: string | null
}

export type UpdateDeckInput = {
  deckId: string
  title?: string
  description?: string | null
}

export type DeckRepositoryPort = {
  create(input: CreateDeckInput): Promise<Deck>
  findById(deckId: string): Promise<Deck | null>
  findByOwner(ownerId: string): Promise<Deck[]>
  update(input: UpdateDeckInput): Promise<Deck>
  softDelete(deckId: string): Promise<void>
}
```

Create `CardRepositoryPort`:

```ts
import { Card } from '../../domain/types'

export const CARD_REPOSITORY = Symbol('CARD_REPOSITORY')

export type CreateCardInput = {
  deckId: string
  front: string
  back: string
  example?: string | null
  notes?: string | null
  position?: number
}

export type UpdateCardInput = {
  cardId: string
  front?: string
  back?: string
  example?: string | null
  notes?: string | null
  position?: number
}

export type CardRepositoryPort = {
  create(input: CreateCardInput): Promise<Card>
  findById(cardId: string): Promise<Card | null>
  findByDeckId(deckId: string): Promise<Card[]>
  update(input: UpdateCardInput): Promise<Card>
  softDelete(cardId: string): Promise<void>
  softDeleteByDeckId(deckId: string): Promise<void>
  countByDeckId(deckId: string): Promise<number>
}
```

## Security Requirements

```txt
- Repository should exclude deleted records in normal find/list methods.
- Use cases still enforce permissions.
```

## Architecture Constraints

```txt
- Ports live in application layer.
- Ports must not import Prisma.
- Ports must not import GraphQL decorators.
```

## Do Not Do

```txt
- Do not implement Prisma repositories yet.
- Do not implement permission checks inside repository ports.
```

## Acceptance Criteria

```txt
- DeckRepositoryPort exists.
- CardRepositoryPort exists.
- Ports do not import Prisma.
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
chore(decks): add deck and card repository ports
```

---

# TASK-05.05 Add DeckPermissionService

## Status

DONE

## Context

Deck/card permissions must follow:

```txt
docs/domain/permissions.md
```

Backend permission logic must not live in resolvers.

## Goal

Add deck permission service.

## Files to Create

```txt
apps/api/src/modules/decks/domain/services/deck-permission.service.ts
```

## Requirements

Create `DeckPermissionService` with methods:

```ts
import { AuthUser } from '../../../auth/domain/types'
import { Deck } from '../types'

export class DeckPermissionService {
  canViewDeck(input: { user: AuthUser | null; deck: Deck }): boolean {
    // implementation
  }

  canManageDeck(input: { user: AuthUser | null; deck: Deck }): boolean {
    // implementation
  }

  canCreateCard(input: { user: AuthUser | null; deck: Deck }): boolean {
    // implementation
  }

  canManageCard(input: { user: AuthUser | null; deck: Deck }): boolean {
    // implementation
  }
}
```

MVP rules:

```txt
canViewDeck:
- owner can view own deck
- any user/anonymous can view PUBLIC + APPROVED + non-deleted deck
- private decks are not viewable by non-owner yet
- group sharing is added later

canManageDeck:
- owner only
- deck must not be deleted

canCreateCard:
- owner only
- deck must not be deleted

canManageCard:
- owner only
- deck must not be deleted
```

## Security Requirements

```txt
- Deny by default.
- Deleted decks cannot be viewed/managed in normal user flows.
- Public deck must be APPROVED before non-owner can view it.
```

## Architecture Constraints

```txt
- Service must not import Prisma.
- Service must not import GraphQL decorators.
- Service must not import NestJS.
- Use cases call this service.
```

## Do Not Do

```txt
- Do not add group permissions yet.
- Do not add admin moderation logic here unless needed later.
```

## Acceptance Criteria

```txt
- DeckPermissionService exists.
- Owner can view/manage own deck.
- Non-owner cannot manage deck.
- Anonymous can view only public approved non-deleted deck.
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
chore(decks): add deck permission service
```

---

# TASK-05.06 Add Prisma deck repository

## Status

DONE

## Context

Deck persistence should be implemented through Prisma infrastructure.

## Goal

Add Prisma implementation of `DeckRepositoryPort`.

## Files to Create

```txt
apps/api/src/modules/decks/infrastructure/persistence/prisma-deck.repository.ts
apps/api/src/modules/decks/infrastructure/mappers/deck.mapper.ts
```

## Files to Modify

```txt
apps/api/src/modules/decks/decks.module.ts
```

## Requirements

Implement:

```txt
create
findById
findByOwner
update
softDelete
```

Normal find/list methods must exclude deleted decks:

```txt
deletedAt = null
```

`softDelete` should set:

```txt
deletedAt = new Date()
```

Mapper:

```ts
toDeck(prismaDeck): Deck
```

## Security Requirements

```txt
- Do not return deleted decks from normal queries.
- Do not decide permissions in repository.
- Do not expose unrelated private decks through repository methods called by public flows.
```

## Architecture Constraints

```txt
- Prisma repository lives in infrastructure.
- Use cases depend on DeckRepositoryPort.
- Resolver must not use repository directly.
```

## Do Not Do

```txt
- Do not implement public search yet.
- Do not implement copy deck yet.
```

## Acceptance Criteria

```txt
- PrismaDeckRepository exists.
- Repository implements DeckRepositoryPort.
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
chore(decks): add Prisma deck repository
```

---

# TASK-05.07 Add Prisma card repository

## Status

DONE

## Context

Card persistence should be implemented through Prisma infrastructure.

## Goal

Add Prisma implementation of `CardRepositoryPort`.

## Files to Create

```txt
apps/api/src/modules/decks/infrastructure/persistence/prisma-card.repository.ts
apps/api/src/modules/decks/infrastructure/mappers/card.mapper.ts
```

## Files to Modify

```txt
apps/api/src/modules/decks/decks.module.ts
```

## Requirements

Implement:

```txt
create
findById
findByDeckId
update
softDelete
softDeleteByDeckId
countByDeckId
```

Normal find/list methods must exclude deleted cards:

```txt
deletedAt = null
```

`findByDeckId` order:

```txt
position ascending
createdAt ascending
```

`softDelete` should set:

```txt
deletedAt = new Date()
```

`softDeleteByDeckId` should soft-delete all non-deleted cards in deck.

Mapper:

```ts
toCard(prismaCard): Card
```

## Security Requirements

```txt
- Do not return deleted cards from normal queries.
- Do not decide deck permissions in repository.
```

## Architecture Constraints

```txt
- Prisma repository lives in infrastructure.
- Use cases depend on CardRepositoryPort.
- Resolver must not use repository directly.
```

## Do Not Do

```txt
- Do not implement SRS state.
- Do not implement CSV import yet.
```

## Acceptance Criteria

```txt
- PrismaCardRepository exists.
- Repository implements CardRepositoryPort.
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
chore(decks): add Prisma card repository
```

---

# TASK-05.08 Add deck/card GraphQL types and inputs

## Status

DONE

## Context

GraphQL needs safe types and inputs for decks and cards.

## Goal

Add GraphQL types and inputs.

## Files to Create

```txt
apps/api/src/modules/decks/presentation/graphql/types/deck-visibility.type.ts
apps/api/src/modules/decks/presentation/graphql/types/deck-moderation-status.type.ts
apps/api/src/modules/decks/presentation/graphql/types/deck.type.ts
apps/api/src/modules/decks/presentation/graphql/types/card.type.ts

apps/api/src/modules/decks/presentation/graphql/inputs/create-deck.input.ts
apps/api/src/modules/decks/presentation/graphql/inputs/update-deck.input.ts
apps/api/src/modules/decks/presentation/graphql/inputs/create-card.input.ts
apps/api/src/modules/decks/presentation/graphql/inputs/update-card.input.ts
```

## Requirements

GraphQL `DeckType` fields:

```txt
id
ownerId
title
description
visibility
moderationStatus
isOfficial
sourceDeckId
createdAt
updatedAt
```

Do not include `deletedAt` in normal public GraphQL deck type.

GraphQL `CardType` fields:

```txt
id
deckId
front
back
example
notes
position
createdAt
updatedAt
```

Do not include `deletedAt` in normal public GraphQL card type.

Inputs:

```txt
CreateDeckInput:
- title
- description optional nullable

UpdateDeckInput:
- deckId
- title optional
- description optional nullable

CreateCardInput:
- deckId
- front
- back
- example optional nullable
- notes optional nullable
- position optional

UpdateCardInput:
- cardId
- front optional
- back optional
- example optional nullable
- notes optional nullable
- position optional
```

## Security Requirements

```txt
- Do not expose deletedAt in normal GraphQL output.
- Do not expose private decks through public queries.
```

## Architecture Constraints

```txt
- GraphQL types live in presentation layer.
- GraphQL types contain no business logic.
```

## Do Not Do

```txt
- Do not implement resolvers yet.
- Do not expose admin-only fields beyond MVP-safe fields.
```

## Acceptance Criteria

```txt
- DeckType exists.
- CardType exists.
- Deck inputs exist.
- Card inputs exist.
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
chore(decks): add deck and card GraphQL types
```

---

# TASK-05.09 Add CreateDeckUseCase

## Status

DONE

## Context

Authenticated users need to create decks.

## Goal

Add `CreateDeckUseCase`.

## Files to Create

```txt
apps/api/src/modules/decks/application/use-cases/create-deck.use-case.ts
```

## Files to Modify

```txt
apps/api/src/modules/decks/decks.module.ts
```

## Requirements

Input:

```ts
export type CreateDeckUseCaseInput = {
  currentUserId: string
  title: string
  description?: string | null
}
```

Output:

```ts
export type CreateDeckUseCaseResult = Deck
```

Use case must:

```txt
1. Validate current user exists.
2. Reject blocked user.
3. Validate title.
4. Validate description.
5. Create private deck owned by current user.
6. Return deck.
```

Defaults:

```txt
visibility = PRIVATE
moderationStatus = NONE
isOfficial = false
sourceDeckId = null
```

## Security Requirements

```txt
- Must require authenticated user.
- Blocked user cannot create deck.
- User cannot set ownerId from GraphQL input.
```

## Architecture Constraints

```txt
- Use case depends on ports.
- Use case must not import Prisma.
- Use case must not import GraphQL decorators.
```

## Do Not Do

```txt
- Do not implement resolver in this task.
- Do not allow creating public deck directly.
```

## Acceptance Criteria

```txt
- CreateDeckUseCase exists.
- Deck title is validated.
- Deck is private by default.
- Owner is current user.
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
feat(decks): add create deck use case
```

---

# TASK-05.10 Add createDeck mutation

## Status

DONE

## Context

Frontend needs a mutation to create a deck.

## Goal

Add protected `createDeck` mutation.

## Files to Create

```txt
apps/api/src/modules/decks/presentation/graphql/resolvers/decks.resolver.ts
```

## Files to Modify

```txt
apps/api/src/modules/decks/decks.module.ts
```

## Requirements

Add mutation:

```graphql
createDeck(input: CreateDeckInput!): DeckType!
```

Mutation must:

```txt
- require GqlAuthGuard
- use CurrentUser
- call CreateDeckUseCase
- return created deck
```

Resolver must not:

```txt
- query Prisma
- accept ownerId
- set visibility directly
```

## Security Requirements

```txt
- User can create only own deck.
- ownerId must come from CurrentUser.
```

## Acceptance Criteria

```txt
- createDeck mutation exists.
- Mutation requires auth.
- Deck owner is current user.
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
feat(decks): add create deck mutation
```

---

# TASK-05.11 Add MyDecksUseCase

## Status

DONE

## Context

Authenticated users need to list their own decks.

## Goal

Add `MyDecksUseCase`.

## Files to Create

```txt
apps/api/src/modules/decks/application/use-cases/my-decks.use-case.ts
```

## Files to Modify

```txt
apps/api/src/modules/decks/decks.module.ts
```

## Requirements

Input:

```ts
export type MyDecksUseCaseInput = {
  currentUserId: string
}
```

Output:

```ts
export type MyDecksUseCaseResult = Deck[]
```

Use case must:

```txt
1. Validate current user exists.
2. Reject blocked user.
3. Load non-deleted decks owned by user.
4. Return decks ordered by updatedAt descending or createdAt descending.
```

## Security Requirements

```txt
- User can list only own decks.
- Blocked user cannot list decks.
```

## Architecture Constraints

```txt
- Use case depends on ports.
- Use case must not import Prisma.
- Use case must not import GraphQL decorators.
```

## Do Not Do

```txt
- Do not include public search here.
- Do not include group-shared decks here.
```

## Acceptance Criteria

```txt
- MyDecksUseCase exists.
- Only current user's decks are returned.
- Deleted decks are excluded.
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
feat(decks): add my decks use case
```

---

# TASK-05.12 Add myDecks query

## Status

DONE

## Context

Frontend needs a query to list current user's decks.

## Goal

Add protected `myDecks` query.

## Files to Modify

```txt
apps/api/src/modules/decks/presentation/graphql/resolvers/decks.resolver.ts
apps/api/src/modules/decks/decks.module.ts
```

## Requirements

Add query:

```graphql
myDecks: [DeckType!]!
```

Query must:

```txt
- require GqlAuthGuard
- use CurrentUser
- call MyDecksUseCase
- return decks
```

Resolver must not:

```txt
- query Prisma
- accept userId input
```

## Security Requirements

```txt
- User can list only own decks.
- userId must come from CurrentUser.
```

## Acceptance Criteria

```txt
- myDecks query exists.
- Query requires auth.
- Query returns only current user's decks.
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
feat(decks): add my decks query
```

---

# TASK-05.13 Add GetDeckUseCase

## Status

DONE

## Context

Users need to view deck details.

For this epic, private deck visibility is owner-only.

Public approved visibility is included as foundation for EPIC-06.

## Goal

Add `GetDeckUseCase`.

## Files to Create

```txt
apps/api/src/modules/decks/application/use-cases/get-deck.use-case.ts
```

## Files to Modify

```txt
apps/api/src/modules/decks/decks.module.ts
```

## Requirements

Input:

```ts
export type GetDeckUseCaseInput = {
  currentUser: AuthUser | null
  deckId: string
}
```

Output:

```ts
export type GetDeckUseCaseResult = Deck
```

Use case must:

```txt
1. Load deck by id.
2. If missing or deleted, throw DECK_NOT_FOUND.
3. Use DeckPermissionService.canViewDeck.
4. If cannot view, throw DECK_NOT_FOUND or DECK_FORBIDDEN according to privacy policy.
5. Return deck.
```

Recommended privacy behavior:

```txt
- For private inaccessible deck, return DECK_NOT_FOUND.
- For authenticated owner, return deck.
```

## Security Requirements

```txt
- Do not reveal private deck existence to non-owner.
- Deleted decks are not viewable.
```

## Architecture Constraints

```txt
- Use case depends on ports/services.
- Use case must not import Prisma.
- Use case must not import GraphQL decorators.
```

## Acceptance Criteria

```txt
- GetDeckUseCase exists.
- Owner can view own deck.
- Non-owner cannot view private deck.
- Deleted deck is not returned.
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
feat(decks): add get deck use case
```

---

# TASK-05.14 Add deck query

## Status

DONE

## Context

Frontend needs a query to view deck details.

## Goal

Add `deck(id)` query.

## Files to Modify

```txt
apps/api/src/modules/decks/presentation/graphql/resolvers/decks.resolver.ts
apps/api/src/modules/decks/decks.module.ts
```

## Requirements

Add query:

```graphql
deck(id: ID!): DeckType!
```

Query behavior:

```txt
- current user is optional
- authenticated user may view own private deck
- anonymous user may view public approved deck
- inaccessible private deck is not returned
```

Resolver must:

```txt
- read optional current user if available
- call GetDeckUseCase
- return deck
```

Resolver must not:

```txt
- query Prisma
- implement permission rules
```

## Security Requirements

```txt
- Private deck existence should not leak to non-owner.
- Deleted deck should not be returned.
```

## Acceptance Criteria

```txt
- deck query exists.
- Owner can query own deck.
- Anonymous cannot query private deck.
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
feat(decks): add deck query
```

---

# TASK-05.15 Add UpdateDeckUseCase

## Status

DONE

## Context

Deck owners need to update deck metadata.

## Goal

Add `UpdateDeckUseCase`.

## Files to Create

```txt
apps/api/src/modules/decks/application/use-cases/update-deck.use-case.ts
```

## Files to Modify

```txt
apps/api/src/modules/decks/decks.module.ts
```

## Requirements

Input:

```ts
export type UpdateDeckUseCaseInput = {
  currentUser: AuthUser
  deckId: string
  title?: string
  description?: string | null
}
```

Output:

```ts
export type UpdateDeckUseCaseResult = Deck
```

Use case must:

```txt
1. Load deck.
2. If missing/deleted, throw DECK_NOT_FOUND.
3. Check DeckPermissionService.canManageDeck.
4. If forbidden, throw DECK_FORBIDDEN.
5. Validate provided fields.
6. Update deck.
7. Return updated deck.
```

## Security Requirements

```txt
- Only owner can update deck.
- User cannot update ownerId.
- User cannot update visibility here.
- User cannot update moderationStatus here.
- User cannot update isOfficial here.
```

## Architecture Constraints

```txt
- Use case depends on ports/services.
- Use case must not import Prisma.
- Use case must not import GraphQL decorators.
```

## Acceptance Criteria

```txt
- UpdateDeckUseCase exists.
- Owner can update deck.
- Non-owner cannot update deck.
- Restricted fields cannot be updated here.
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
feat(decks): add update deck use case
```

---

# TASK-05.16 Add updateDeck mutation

## Status

DONE

## Context

Frontend needs a mutation to update deck metadata.

## Goal

Add protected `updateDeck` mutation.

## Files to Modify

```txt
apps/api/src/modules/decks/presentation/graphql/resolvers/decks.resolver.ts
apps/api/src/modules/decks/decks.module.ts
```

## Requirements

Add mutation:

```graphql
updateDeck(input: UpdateDeckInput!): DeckType!
```

Mutation must:

```txt
- require GqlAuthGuard
- use CurrentUser
- call UpdateDeckUseCase
- return updated deck
```

Resolver must not:

```txt
- query Prisma
- check owner directly
- allow visibility/moderation/isOfficial updates
```

## Security Requirements

```txt
- Only owner can update.
- Restricted fields are not accepted from input.
```

## Acceptance Criteria

```txt
- updateDeck mutation exists.
- Mutation requires auth.
- Owner can update deck.
- Non-owner is rejected.
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
feat(decks): add update deck mutation
```

---

# TASK-05.17 Add DeleteDeckUseCase

## Status

DONE

## Context

Deck owners need to delete decks.

Deletion should be soft delete.

## Goal

Add `DeleteDeckUseCase`.

## Files to Create

```txt
apps/api/src/modules/decks/application/use-cases/delete-deck.use-case.ts
```

## Files to Modify

```txt
apps/api/src/modules/decks/decks.module.ts
```

## Requirements

Input:

```ts
export type DeleteDeckUseCaseInput = {
  currentUser: AuthUser
  deckId: string
}
```

Output:

```ts
export type DeleteDeckUseCaseResult = {
  success: boolean
}
```

Use case must:

```txt
1. Load deck.
2. If missing/deleted, throw DECK_NOT_FOUND.
3. Check DeckPermissionService.canManageDeck.
4. If forbidden, throw DECK_FORBIDDEN.
5. Soft delete all cards in deck.
6. Soft delete deck.
7. Return success.
```

## Security Requirements

```txt
- Only owner can delete deck.
- Delete is soft delete.
- Deleted deck/cards should not appear in normal queries.
```

## Architecture Constraints

```txt
- Use case depends on ports/services.
- Use case must not import Prisma.
- Use case must not import GraphQL decorators.
```

## Acceptance Criteria

```txt
- DeleteDeckUseCase exists.
- Owner can soft delete deck.
- Non-owner cannot delete deck.
- Cards are soft-deleted with deck.
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
feat(decks): add delete deck use case
```

---

# TASK-05.18 Add deleteDeck mutation

## Status

DONE

## Context

Frontend needs a mutation to delete a deck.

## Goal

Add protected `deleteDeck` mutation.

## Files to Modify

```txt
apps/api/src/modules/decks/presentation/graphql/resolvers/decks.resolver.ts
apps/api/src/modules/decks/decks.module.ts
```

## Requirements

Add mutation:

```graphql
deleteDeck(deckId: ID!): Boolean!
```

Mutation must:

```txt
- require GqlAuthGuard
- use CurrentUser
- call DeleteDeckUseCase
- return success boolean
```

Resolver must not:

```txt
- query Prisma
- check owner directly
```

## Security Requirements

```txt
- Only owner can delete deck.
- Deleted deck is soft deleted.
```

## Acceptance Criteria

```txt
- deleteDeck mutation exists.
- Mutation requires auth.
- Owner can delete deck.
- Non-owner is rejected.
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
feat(decks): add delete deck mutation
```

---

# TASK-05.19 Add CreateCardUseCase

## Status

DONE

## Context

Deck owners need to create cards inside their decks.

## Goal

Add `CreateCardUseCase`.

## Files to Create

```txt
apps/api/src/modules/decks/application/use-cases/create-card.use-case.ts
```

## Files to Modify

```txt
apps/api/src/modules/decks/decks.module.ts
```

## Requirements

Input:

```ts
export type CreateCardUseCaseInput = {
  currentUser: AuthUser
  deckId: string
  front: string
  back: string
  example?: string | null
  notes?: string | null
  position?: number
}
```

Output:

```ts
export type CreateCardUseCaseResult = Card
```

Use case must:

```txt
1. Load deck.
2. If missing/deleted, throw DECK_NOT_FOUND.
3. Check DeckPermissionService.canCreateCard.
4. If forbidden, throw DECK_FORBIDDEN.
5. Validate card fields.
6. If position is not provided, append to end.
7. Create card.
8. Return card.
```

Position append behavior:

```txt
position = current card count in deck
```

## Security Requirements

```txt
- Only deck owner can create card.
- User cannot create card in another user's private deck.
```

## Architecture Constraints

```txt
- Use case depends on ports/services.
- Use case must not import Prisma.
- Use case must not import GraphQL decorators.
```

## Acceptance Criteria

```txt
- CreateCardUseCase exists.
- Owner can create card.
- Non-owner cannot create card.
- Card fields are validated.
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
feat(decks): add create card use case
```

---

# TASK-05.20 Add createCard mutation

## Status

DONE

## Context

Frontend needs a mutation to create cards.

## Goal

Add protected `createCard` mutation.

## Files to Modify

```txt
apps/api/src/modules/decks/presentation/graphql/resolvers/decks.resolver.ts
apps/api/src/modules/decks/decks.module.ts
```

## Requirements

Add mutation:

```graphql
createCard(input: CreateCardInput!): CardType!
```

Mutation must:

```txt
- require GqlAuthGuard
- use CurrentUser
- call CreateCardUseCase
- return created card
```

Resolver must not:

```txt
- query Prisma
- check owner directly
```

## Security Requirements

```txt
- Only deck owner can create card.
```

## Acceptance Criteria

```txt
- createCard mutation exists.
- Mutation requires auth.
- Owner can create card.
- Non-owner is rejected.
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
feat(decks): add create card mutation
```

---

# TASK-05.21 Add DeckCardsUseCase

## Status

DONE

## Context

Users need to list cards in a deck they can view.

## Goal

Add `DeckCardsUseCase`.

## Files to Create

```txt
apps/api/src/modules/decks/application/use-cases/deck-cards.use-case.ts
```

## Files to Modify

```txt
apps/api/src/modules/decks/decks.module.ts
```

## Requirements

Input:

```ts
export type DeckCardsUseCaseInput = {
  currentUser: AuthUser | null
  deckId: string
}
```

Output:

```ts
export type DeckCardsUseCaseResult = Card[]
```

Use case must:

```txt
1. Load deck.
2. If missing/deleted, throw DECK_NOT_FOUND.
3. Check DeckPermissionService.canViewDeck.
4. If cannot view, throw DECK_NOT_FOUND or DECK_FORBIDDEN according to privacy policy.
5. Load non-deleted cards by deck.
6. Return cards ordered by position ascending.
```

## Security Requirements

```txt
- Private deck cards are visible only to owner.
- Public approved deck cards can be visible to anonymous/authenticated users.
- Deleted cards are excluded.
```

## Architecture Constraints

```txt
- Use case depends on ports/services.
- Use case must not import Prisma.
- Use case must not import GraphQL decorators.
```

## Acceptance Criteria

```txt
- DeckCardsUseCase exists.
- Owner can list own cards.
- Anonymous cannot list private deck cards.
- Deleted cards are excluded.
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
feat(decks): add deck cards use case
```

---

# TASK-05.22 Add deckCards query

## Status

DONE

## Context

Frontend needs a query to list cards in a deck.

## Goal

Add `deckCards(deckId)` query.

## Files to Modify

```txt
apps/api/src/modules/decks/presentation/graphql/resolvers/decks.resolver.ts
apps/api/src/modules/decks/decks.module.ts
```

## Requirements

Add query:

```graphql
deckCards(deckId: ID!): [CardType!]!
```

Query behavior:

```txt
- current user is optional
- owner can view own deck cards
- anonymous can view public approved deck cards
- inaccessible private deck cards are not returned
```

Resolver must:

```txt
- read optional current user if available
- call DeckCardsUseCase
- return cards
```

Resolver must not:

```txt
- query Prisma
- check owner directly
```

## Security Requirements

```txt
- Do not leak private deck cards.
- Do not return deleted cards.
```

## Acceptance Criteria

```txt
- deckCards query exists.
- Owner can list own cards.
- Anonymous cannot list private deck cards.
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
feat(decks): add deck cards query
```

---

# TASK-05.23 Add UpdateCardUseCase

## Status

DONE

## Context

Deck owners need to update cards.

## Goal

Add `UpdateCardUseCase`.

## Files to Create

```txt
apps/api/src/modules/decks/application/use-cases/update-card.use-case.ts
```

## Files to Modify

```txt
apps/api/src/modules/decks/decks.module.ts
```

## Requirements

Input:

```ts
export type UpdateCardUseCaseInput = {
  currentUser: AuthUser
  cardId: string
  front?: string
  back?: string
  example?: string | null
  notes?: string | null
  position?: number
}
```

Output:

```ts
export type UpdateCardUseCaseResult = Card
```

Use case must:

```txt
1. Load card.
2. If missing/deleted, throw CARD_NOT_FOUND.
3. Load card deck.
4. If deck missing/deleted, throw DECK_NOT_FOUND.
5. Check DeckPermissionService.canManageCard.
6. If forbidden, throw CARD_FORBIDDEN.
7. Validate provided fields.
8. Update card.
9. Return updated card.
```

## Security Requirements

```txt
- Only deck owner can update card.
- User cannot move card to another deck in this mutation.
```

## Architecture Constraints

```txt
- Use case depends on ports/services.
- Use case must not import Prisma.
- Use case must not import GraphQL decorators.
```

## Acceptance Criteria

```txt
- UpdateCardUseCase exists.
- Owner can update card.
- Non-owner cannot update card.
- Cannot update deckId.
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
feat(decks): add update card use case
```

---

# TASK-05.24 Add updateCard mutation

## Status

DONE

## Context

Frontend needs a mutation to update cards.

## Goal

Add protected `updateCard` mutation.

## Files to Modify

```txt
apps/api/src/modules/decks/presentation/graphql/resolvers/decks.resolver.ts
apps/api/src/modules/decks/decks.module.ts
```

## Requirements

Add mutation:

```graphql
updateCard(input: UpdateCardInput!): CardType!
```

Mutation must:

```txt
- require GqlAuthGuard
- use CurrentUser
- call UpdateCardUseCase
- return updated card
```

Resolver must not:

```txt
- query Prisma
- check owner directly
```

## Security Requirements

```txt
- Only deck owner can update card.
- deckId must not be accepted from update input.
```

## Acceptance Criteria

```txt
- updateCard mutation exists.
- Mutation requires auth.
- Owner can update card.
- Non-owner is rejected.
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
feat(decks): add update card mutation
```

---

# TASK-05.25 Add DeleteCardUseCase

## Status

TODO

## Context

Deck owners need to delete cards.

Deletion should be soft delete.

## Goal

Add `DeleteCardUseCase`.

## Files to Create

```txt
apps/api/src/modules/decks/application/use-cases/delete-card.use-case.ts
```

## Files to Modify

```txt
apps/api/src/modules/decks/decks.module.ts
```

## Requirements

Input:

```ts
export type DeleteCardUseCaseInput = {
  currentUser: AuthUser
  cardId: string
}
```

Output:

```ts
export type DeleteCardUseCaseResult = {
  success: boolean
}
```

Use case must:

```txt
1. Load card.
2. If missing/deleted, throw CARD_NOT_FOUND.
3. Load card deck.
4. If deck missing/deleted, throw DECK_NOT_FOUND.
5. Check DeckPermissionService.canManageCard.
6. If forbidden, throw CARD_FORBIDDEN.
7. Soft delete card.
8. Return success.
```

## Security Requirements

```txt
- Only deck owner can delete card.
- Delete is soft delete.
- Deleted card should not appear in normal queries.
```

## Architecture Constraints

```txt
- Use case depends on ports/services.
- Use case must not import Prisma.
- Use case must not import GraphQL decorators.
```

## Acceptance Criteria

```txt
- DeleteCardUseCase exists.
- Owner can delete card.
- Non-owner cannot delete card.
- Card is soft-deleted.
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
feat(decks): add delete card use case
```

---

# TASK-05.26 Add deleteCard mutation

## Status

TODO

## Context

Frontend needs a mutation to delete cards.

## Goal

Add protected `deleteCard` mutation.

## Files to Modify

```txt
apps/api/src/modules/decks/presentation/graphql/resolvers/decks.resolver.ts
apps/api/src/modules/decks/decks.module.ts
```

## Requirements

Add mutation:

```graphql
deleteCard(cardId: ID!): Boolean!
```

Mutation must:

```txt
- require GqlAuthGuard
- use CurrentUser
- call DeleteCardUseCase
- return success boolean
```

Resolver must not:

```txt
- query Prisma
- check owner directly
```

## Security Requirements

```txt
- Only deck owner can delete card.
```

## Acceptance Criteria

```txt
- deleteCard mutation exists.
- Mutation requires auth.
- Owner can delete card.
- Non-owner is rejected.
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
feat(decks): add delete card mutation
```

---

# TASK-05.27 Add decks/cards final checks

## Status

TODO

## Context

Deck and card permissions are security-sensitive because private decks must not leak.

## Goal

Run final checks for this epic.

## Manual GraphQL Checks

Verify:

```txt
- createDeck requires auth
- createDeck creates private deck
- myDecks returns only current user's decks
- deck query returns own private deck
- deck query does not return another user's private deck
- updateDeck owner works
- updateDeck non-owner fails
- deleteDeck owner works
- deleted deck is not listed
- createCard owner works
- createCard non-owner fails
- deckCards owner works
- deckCards private non-owner fails
- updateCard owner works
- updateCard non-owner fails
- deleteCard owner works
- deleted card is not listed
```

## Security Checks

Verify:

```txt
- Resolvers do not access Prisma directly.
- Permission logic is not inside resolvers.
- DeckPermissionService is used by use cases.
- Private deck existence is not leaked unnecessarily.
- Deleted decks/cards are excluded from normal queries.
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
- Do not move to public decks until owner permissions pass.
- Do not expose private decks for frontend convenience.
```

## Acceptance Criteria

```txt
- Deck CRUD works.
- Card CRUD works.
- Owner-only permissions work.
- Deleted decks/cards are hidden.
- Format check passes.
- Lint passes.
- Prisma validate passes.
- API build passes.
- git status is clean after commit.
```

## Expected Commit Message

```txt
chore(decks): finalize deck and card management
```

---

## Epic Completion Criteria

EPIC-05 is complete when:

```txt
- Deck/Card Prisma schema exists.
- DecksModule exists.
- Deck domain types exist.
- Card domain types exist.
- DeckRepositoryPort exists.
- CardRepositoryPort exists.
- DeckPermissionService exists.
- Prisma deck repository exists.
- Prisma card repository exists.
- GraphQL deck/card types exist.
- CreateDeckUseCase exists.
- createDeck mutation works.
- MyDecksUseCase exists.
- myDecks query works.
- GetDeckUseCase exists.
- deck query works.
- UpdateDeckUseCase exists.
- updateDeck mutation works.
- DeleteDeckUseCase exists.
- deleteDeck mutation works.
- CreateCardUseCase exists.
- createCard mutation works.
- DeckCardsUseCase exists.
- deckCards query works.
- UpdateCardUseCase exists.
- updateCard mutation works.
- DeleteCardUseCase exists.
- deleteCard mutation works.
- Owner-only permissions are enforced.
- Private decks do not leak.
- Deleted decks/cards are excluded.
- implementation follows docs/domain/permissions.md.
- implementation follows docs/security/security-checklist.md.
```

After this epic is complete, move to:

```txt
docs/tasks/06-public-decks.md
```
