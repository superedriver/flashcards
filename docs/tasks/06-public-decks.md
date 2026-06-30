# EPIC-06 Public Decks

## Epic Goal

Implement public deck publishing, public deck browsing, public search, and copying public decks.

This epic covers:

```txt
- publishing own deck
- unpublishing own deck
- public approved deck visibility
- public deck search
- public deck details
- copying public decks
- public deck permissions
```

Deck/card owner CRUD is handled in:

```txt
docs/tasks/05-decks-cards.md
```

Lessons and SRS are handled in:

```txt
docs/tasks/07-srs-lessons.md
```

Admin moderation is handled in:

```txt
docs/tasks/12-admin-analytics.md
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
docs/tasks/05-decks-cards.md
```

## Epic Prerequisites

EPIC-05 should be complete.

Expected state:

```txt
- Deck/Card Prisma schema exists.
- DecksModule exists.
- DeckRepositoryPort exists.
- CardRepositoryPort exists.
- DeckPermissionService exists.
- Deck CRUD works.
- Card CRUD works.
- Owner-only permissions work.
- Deleted decks/cards are excluded from normal queries.
```

## Epic Rules

```txt
1. Follow docs/domain/permissions.md exactly.
2. Follow docs/security/security-checklist.md exactly.
3. Backend is the source of truth for public visibility.
4. Public search must include only PUBLIC + APPROVED + non-deleted decks.
5. Anonymous users may browse public approved decks.
6. Anonymous users may view cards only for public approved decks.
7. Only deck owner can publish or unpublish own deck.
8. Copying public deck creates a private copy owned by current user.
9. Copying does not copy SRS state.
10. Copying does not copy study sessions.
11. Do not put business logic in GraphQL resolvers.
12. Do not access Prisma directly from GraphQL resolvers.
```

## MVP Public Deck Policy

For MVP, publishing a deck immediately approves it:

```txt
publishDeck:
- visibility = PUBLIC
- moderationStatus = APPROVED
```

Post-MVP moderation may change this to:

```txt
publishDeck:
- visibility = PUBLIC
- moderationStatus = PENDING
```

If that policy changes later, update:

```txt
docs/domain/permissions.md
docs/tasks/06-public-decks.md
docs/tasks/12-admin-analytics.md
```

## Public Deck Visibility Rule

A deck is publicly visible only when:

```txt
visibility = PUBLIC
moderationStatus = APPROVED
deletedAt = null
```

Public search must not return:

```txt
- PRIVATE decks
- PUBLIC decks with PENDING status
- PUBLIC decks with REJECTED status
- PUBLIC decks with HIDDEN status
- deleted decks
```

## Epic Summary

```md
- [x] TASK-06.01 Extend deck repository port for public deck operations
- [ ] TASK-06.02 Extend Prisma deck repository for public deck operations
- [ ] TASK-06.03 Add PublishDeckUseCase
- [ ] TASK-06.04 Add publishDeck mutation
- [ ] TASK-06.05 Add UnpublishDeckUseCase
- [ ] TASK-06.06 Add unpublishDeck mutation
- [ ] TASK-06.07 Add PublicDecksUseCase
- [ ] TASK-06.08 Add publicDecks query
- [ ] TASK-06.09 Add PublicDeckUseCase
- [ ] TASK-06.10 Add publicDeck query
- [ ] TASK-06.11 Add PublicDeckCardsUseCase
- [ ] TASK-06.12 Add publicDeckCards query
- [ ] TASK-06.13 Add CopyPublicDeckUseCase
- [ ] TASK-06.14 Add copyPublicDeck mutation
- [ ] TASK-06.15 Add public decks final checks
```

---

# TASK-06.01 Extend deck repository port for public deck operations

## Status

DONE

## Context

Public deck features need repository methods for publishing, unpublishing, public search, and copying.

Use cases must depend on repository ports, not Prisma.

## Goal

Extend deck/card repository ports for public deck operations.

## Files to Modify

```txt
apps/api/src/modules/decks/application/ports/deck-repository.port.ts
apps/api/src/modules/decks/application/ports/card-repository.port.ts
```

## Requirements

Extend `DeckRepositoryPort` with:

```ts
export type PublicDeckSearchInput = {
  query?: string | null
  limit: number
  offset: number
}

export type PublicDeckSearchResult = {
  items: Deck[]
  total: number
}

export type PublishDeckInput = {
  deckId: string
}

export type UnpublishDeckInput = {
  deckId: string
}

export type CreateCopiedDeckInput = {
  ownerId: string
  sourceDeckId: string
  title: string
  description?: string | null
}

export type DeckRepositoryPort = {
  create(input: CreateDeckInput): Promise<Deck>
  findById(deckId: string): Promise<Deck | null>
  findByOwner(ownerId: string): Promise<Deck[]>
  update(input: UpdateDeckInput): Promise<Deck>
  softDelete(deckId: string): Promise<void>

  publish(input: PublishDeckInput): Promise<Deck>
  unpublish(input: UnpublishDeckInput): Promise<Deck>
  findPublicApprovedById(deckId: string): Promise<Deck | null>
  searchPublicApproved(input: PublicDeckSearchInput): Promise<PublicDeckSearchResult>
  createCopiedDeck(input: CreateCopiedDeckInput): Promise<Deck>
}
```

Extend `CardRepositoryPort` with:

```ts
export type CreateManyCardsInput = {
  cards: Array<{
    deckId: string
    front: string
    back: string
    example?: string | null
    notes?: string | null
    position: number
  }>
}

export type CardRepositoryPort = {
  create(input: CreateCardInput): Promise<Card>
  findById(cardId: string): Promise<Card | null>
  findByDeckId(deckId: string): Promise<Card[]>
  update(input: UpdateCardInput): Promise<Card>
  softDelete(cardId: string): Promise<void>
  softDeleteByDeckId(deckId: string): Promise<void>
  countByDeckId(deckId: string): Promise<number>

  createMany(input: CreateManyCardsInput): Promise<Card[]>
}
```

## Security Requirements

```txt
- searchPublicApproved must return only public approved non-deleted decks.
- findPublicApprovedById must return only public approved non-deleted decks.
- createCopiedDeck must create PRIVATE deck by default.
```

## Architecture Constraints

```txt
- Ports must not import Prisma.
- Ports must not import GraphQL decorators.
- Use cases enforce permissions.
```

## Do Not Do

```txt
- Do not implement Prisma changes in this task.
- Do not add GraphQL operations yet.
```

## Acceptance Criteria

```txt
- DeckRepositoryPort supports publish/unpublish/public search/copy creation.
- CardRepositoryPort supports createMany.
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
chore(public-decks): extend deck repository ports
```

---

# TASK-06.02 Extend Prisma deck repository for public deck operations

## Status

TODO

## Context

Repository ports from TASK-06.01 need Prisma implementations.

## Goal

Implement public deck repository methods.

## Files to Modify

```txt
apps/api/src/modules/decks/infrastructure/persistence/prisma-deck.repository.ts
apps/api/src/modules/decks/infrastructure/persistence/prisma-card.repository.ts
```

## Requirements

Implement in `PrismaDeckRepository`:

```txt
publish
unpublish
findPublicApprovedById
searchPublicApproved
createCopiedDeck
```

`publish` MVP behavior:

```txt
visibility = PUBLIC
moderationStatus = APPROVED
```

`unpublish` behavior:

```txt
visibility = PRIVATE
moderationStatus = NONE
```

`findPublicApprovedById` filter:

```txt
id = deckId
visibility = PUBLIC
moderationStatus = APPROVED
deletedAt = null
```

`searchPublicApproved` filter:

```txt
visibility = PUBLIC
moderationStatus = APPROVED
deletedAt = null
```

Search behavior:

```txt
- If query is empty/null, return recent public approved decks.
- If query exists, search title and description.
- MVP can use PostgreSQL ILIKE through Prisma contains with mode insensitive.
- Order by updatedAt descending or createdAt descending.
- Enforce limit max 50.
```

Example Prisma query:

```ts
where: {
  visibility: 'PUBLIC',
  moderationStatus: 'APPROVED',
  deletedAt: null,
  OR: [
    { title: { contains: query, mode: 'insensitive' } },
    { description: { contains: query, mode: 'insensitive' } },
  ],
}
```

`createCopiedDeck` behavior:

```txt
- ownerId = current user
- sourceDeckId = source deck id
- visibility = PRIVATE
- moderationStatus = NONE
- isOfficial = false
```

Implement in `PrismaCardRepository`:

```txt
createMany
```

`createMany` should create cards and return created cards.

If Prisma `createManyAndReturn` is unavailable, use transaction with individual create operations.

## Security Requirements

```txt
- Public search must not include private decks.
- Public search must not include rejected/hidden/pending decks.
- Public search must not include deleted decks.
- Copy must create private deck.
```

## Architecture Constraints

```txt
- Repositories implement persistence only.
- Repositories do not decide user permissions.
- Resolvers must not use Prisma repositories directly.
```

## Do Not Do

```txt
- Do not implement use cases here.
- Do not add moderation queue here.
- Do not copy review state.
```

## Acceptance Criteria

```txt
- PrismaDeckRepository implements public deck methods.
- PrismaCardRepository implements createMany.
- Public search filters correctly.
- Copy creates private deck.
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
chore(public-decks): add Prisma public deck repository methods
```

---

# TASK-06.03 Add PublishDeckUseCase

## Status

TODO

## Context

Deck owners need to publish their own decks.

For MVP, publishing immediately approves a deck.

## Goal

Add `PublishDeckUseCase`.

## Files to Create

```txt
apps/api/src/modules/decks/application/use-cases/publish-deck.use-case.ts
```

## Files to Modify

```txt
apps/api/src/modules/decks/decks.module.ts
```

## Requirements

Input:

```ts
export type PublishDeckUseCaseInput = {
  currentUser: AuthUser
  deckId: string
}
```

Output:

```ts
export type PublishDeckUseCaseResult = Deck
```

Use case must:

```txt
1. Load deck.
2. If missing/deleted, throw DECK_NOT_FOUND.
3. Check DeckPermissionService.canManageDeck.
4. If forbidden, throw DECK_FORBIDDEN.
5. Count non-deleted cards in deck.
6. If deck has zero cards, reject.
7. Publish deck.
8. Return updated deck.
```

MVP publish behavior:

```txt
visibility = PUBLIC
moderationStatus = APPROVED
```

## Security Requirements

```txt
- Only owner can publish deck.
- Deleted deck cannot be published.
- Empty deck cannot be published.
- User cannot set moderationStatus manually.
- User cannot set isOfficial.
```

## Architecture Constraints

```txt
- Use case depends on repository ports and DeckPermissionService.
- Use case must not import Prisma.
- Use case must not import GraphQL decorators.
```

## Do Not Do

```txt
- Do not add admin moderation here.
- Do not allow publishing another user's deck.
```

## Acceptance Criteria

```txt
- PublishDeckUseCase exists.
- Owner can publish own non-empty deck.
- Non-owner cannot publish.
- Empty deck cannot be published.
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
feat(public-decks): add publish deck use case
```

---

# TASK-06.04 Add publishDeck mutation

## Status

TODO

## Context

Frontend needs a mutation to publish a deck.

## Goal

Add protected `publishDeck` mutation.

## Files to Modify

```txt
apps/api/src/modules/decks/presentation/graphql/resolvers/decks.resolver.ts
apps/api/src/modules/decks/decks.module.ts
```

## Requirements

Add mutation:

```graphql
publishDeck(deckId: ID!): DeckType!
```

Mutation must:

```txt
- require GqlAuthGuard
- use CurrentUser
- call PublishDeckUseCase
- return updated deck
```

Resolver must not:

```txt
- query Prisma
- check owner directly
- set visibility directly
- set moderationStatus directly
```

## Security Requirements

```txt
- Only owner can publish.
- User cannot set approved status manually through input.
```

## Acceptance Criteria

```txt
- publishDeck mutation exists.
- Mutation requires auth.
- Owner can publish deck.
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
feat(public-decks): add publish deck mutation
```

---

# TASK-06.05 Add UnpublishDeckUseCase

## Status

TODO

## Context

Deck owners need to make public decks private again.

## Goal

Add `UnpublishDeckUseCase`.

## Files to Create

```txt
apps/api/src/modules/decks/application/use-cases/unpublish-deck.use-case.ts
```

## Files to Modify

```txt
apps/api/src/modules/decks/decks.module.ts
```

## Requirements

Input:

```ts
export type UnpublishDeckUseCaseInput = {
  currentUser: AuthUser
  deckId: string
}
```

Output:

```ts
export type UnpublishDeckUseCaseResult = Deck
```

Use case must:

```txt
1. Load deck.
2. If missing/deleted, throw DECK_NOT_FOUND.
3. Check DeckPermissionService.canManageDeck.
4. If forbidden, throw DECK_FORBIDDEN.
5. Unpublish deck.
6. Return updated deck.
```

Unpublish behavior:

```txt
visibility = PRIVATE
moderationStatus = NONE
```

## Security Requirements

```txt
- Only owner can unpublish deck.
- Deleted deck cannot be unpublished.
- User cannot change isOfficial here.
```

## Architecture Constraints

```txt
- Use case depends on repository ports and DeckPermissionService.
- Use case must not import Prisma.
- Use case must not import GraphQL decorators.
```

## Do Not Do

```txt
- Do not implement admin moderation here.
```

## Acceptance Criteria

```txt
- UnpublishDeckUseCase exists.
- Owner can unpublish deck.
- Non-owner cannot unpublish.
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
feat(public-decks): add unpublish deck use case
```

---

# TASK-06.06 Add unpublishDeck mutation

## Status

TODO

## Context

Frontend needs a mutation to unpublish a deck.

## Goal

Add protected `unpublishDeck` mutation.

## Files to Modify

```txt
apps/api/src/modules/decks/presentation/graphql/resolvers/decks.resolver.ts
apps/api/src/modules/decks/decks.module.ts
```

## Requirements

Add mutation:

```graphql
unpublishDeck(deckId: ID!): DeckType!
```

Mutation must:

```txt
- require GqlAuthGuard
- use CurrentUser
- call UnpublishDeckUseCase
- return updated deck
```

Resolver must not:

```txt
- query Prisma
- check owner directly
- set visibility directly
```

## Security Requirements

```txt
- Only owner can unpublish.
```

## Acceptance Criteria

```txt
- unpublishDeck mutation exists.
- Mutation requires auth.
- Owner can unpublish deck.
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
feat(public-decks): add unpublish deck mutation
```

---

# TASK-06.07 Add PublicDecksUseCase

## Status

TODO

## Context

Users and anonymous visitors need to browse/search public decks.

## Goal

Add `PublicDecksUseCase`.

## Files to Create

```txt
apps/api/src/modules/decks/application/use-cases/public-decks.use-case.ts
```

## Files to Modify

```txt
apps/api/src/modules/decks/decks.module.ts
```

## Requirements

Input:

```ts
export type PublicDecksUseCaseInput = {
  query?: string | null
  limit?: number
  offset?: number
}
```

Output:

```ts
export type PublicDecksUseCaseResult = {
  items: Deck[]
  total: number
}
```

Use case must:

```txt
1. Normalize query.
2. Clamp limit.
3. Normalize offset.
4. Search only public approved non-deleted decks.
5. Return items and total.
```

Limit rules:

```txt
default limit = 20
max limit = 50
min limit = 1
```

Offset rules:

```txt
default offset = 0
min offset = 0
```

## Security Requirements

```txt
- Must return only public approved non-deleted decks.
- Must not return private decks.
- Must not return rejected/hidden/pending decks.
```

## Architecture Constraints

```txt
- Use case depends on repository port.
- Use case must not import Prisma.
- Use case must not import GraphQL decorators.
```

## Do Not Do

```txt
- Do not use external search service.
- Do not implement ranking beyond simple MVP search.
```

## Acceptance Criteria

```txt
- PublicDecksUseCase exists.
- Public search returns only public approved decks.
- Limit is clamped.
- Offset is normalized.
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
feat(public-decks): add public decks search use case
```

---

# TASK-06.08 Add publicDecks query

## Status

TODO

## Context

Frontend needs a public query for browsing/searching public decks.

## Goal

Add `publicDecks` query.

## Files to Create

```txt
apps/api/src/modules/decks/presentation/graphql/types/public-deck-search-result.type.ts
apps/api/src/modules/decks/presentation/graphql/inputs/public-decks.input.ts
```

## Files to Modify

```txt
apps/api/src/modules/decks/presentation/graphql/resolvers/decks.resolver.ts
apps/api/src/modules/decks/decks.module.ts
```

## Requirements

Input:

```txt
PublicDecksInput:
- query optional nullable
- limit optional
- offset optional
```

Output type:

```txt
PublicDeckSearchResultType:
- items: [DeckType!]!
- total: Int!
```

Add query:

```graphql
publicDecks(input: PublicDecksInput): PublicDeckSearchResultType!
```

Query must be public:

```txt
- no auth required
- anonymous users can call it
```

Resolver must:

```txt
- call PublicDecksUseCase
- return items and total
```

Resolver must not:

```txt
- query Prisma
- implement search filtering directly
```

## Security Requirements

```txt
- Query must never return private decks.
- Query must never return non-approved public decks.
- Query must never return deleted decks.
```

## Acceptance Criteria

```txt
- publicDecks query exists.
- Query works without auth.
- Only public approved decks are returned.
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
feat(public-decks): add public decks query
```

---

# TASK-06.09 Add PublicDeckUseCase

## Status

TODO

## Context

Anonymous users need to view public deck details.

## Goal

Add `PublicDeckUseCase`.

## Files to Create

```txt
apps/api/src/modules/decks/application/use-cases/public-deck.use-case.ts
```

## Files to Modify

```txt
apps/api/src/modules/decks/decks.module.ts
```

## Requirements

Input:

```ts
export type PublicDeckUseCaseInput = {
  deckId: string
}
```

Output:

```ts
export type PublicDeckUseCaseResult = Deck
```

Use case must:

```txt
1. Load deck by id using findPublicApprovedById.
2. If not found, throw DECK_NOT_FOUND.
3. Return deck.
```

## Security Requirements

```txt
- Must return only PUBLIC + APPROVED + non-deleted deck.
- Must not leak private deck existence.
- Must not return pending/rejected/hidden decks.
```

## Architecture Constraints

```txt
- Use case depends on repository port.
- Use case must not import Prisma.
- Use case must not import GraphQL decorators.
```

## Acceptance Criteria

```txt
- PublicDeckUseCase exists.
- Public approved deck is returned.
- Private deck is not returned.
- Rejected/hidden/pending deck is not returned.
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
feat(public-decks): add public deck use case
```

---

# TASK-06.10 Add publicDeck query

## Status

TODO

## Context

Frontend needs a public query to view public deck details.

## Goal

Add `publicDeck` query.

## Files to Modify

```txt
apps/api/src/modules/decks/presentation/graphql/resolvers/decks.resolver.ts
apps/api/src/modules/decks/decks.module.ts
```

## Requirements

Add query:

```graphql
publicDeck(deckId: ID!): DeckType!
```

Query must:

```txt
- be public
- not require auth
- call PublicDeckUseCase
- return deck
```

Resolver must not:

```txt
- query Prisma
- implement visibility filtering directly
```

## Security Requirements

```txt
- Query must return only public approved non-deleted deck.
- Query must not leak private deck existence.
```

## Acceptance Criteria

```txt
- publicDeck query exists.
- Query works without auth.
- Public approved deck is returned.
- Private deck is not returned.
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
feat(public-decks): add public deck query
```

---

# TASK-06.11 Add PublicDeckCardsUseCase

## Status

TODO

## Context

Anonymous users should be able to view cards of public approved decks.

## Goal

Add `PublicDeckCardsUseCase`.

## Files to Create

```txt
apps/api/src/modules/decks/application/use-cases/public-deck-cards.use-case.ts
```

## Files to Modify

```txt
apps/api/src/modules/decks/decks.module.ts
```

## Requirements

Input:

```ts
export type PublicDeckCardsUseCaseInput = {
  deckId: string
}
```

Output:

```ts
export type PublicDeckCardsUseCaseResult = Card[]
```

Use case must:

```txt
1. Load deck using findPublicApprovedById.
2. If not found, throw DECK_NOT_FOUND.
3. Load non-deleted cards by deck id.
4. Return cards ordered by position ascending.
```

## Security Requirements

```txt
- Must return cards only for public approved non-deleted deck.
- Must not return cards for private deck.
- Must not return cards for rejected/hidden/pending deck.
- Must not return deleted cards.
```

## Architecture Constraints

```txt
- Use case depends on repository ports.
- Use case must not import Prisma.
- Use case must not import GraphQL decorators.
```

## Acceptance Criteria

```txt
- PublicDeckCardsUseCase exists.
- Public approved deck cards are returned.
- Private deck cards are not returned.
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
feat(public-decks): add public deck cards use case
```

---

# TASK-06.12 Add publicDeckCards query

## Status

TODO

## Context

Frontend needs a public query to view cards in a public deck.

## Goal

Add `publicDeckCards` query.

## Files to Modify

```txt
apps/api/src/modules/decks/presentation/graphql/resolvers/decks.resolver.ts
apps/api/src/modules/decks/decks.module.ts
```

## Requirements

Add query:

```graphql
publicDeckCards(deckId: ID!): [CardType!]!
```

Query must:

```txt
- be public
- not require auth
- call PublicDeckCardsUseCase
- return cards
```

Resolver must not:

```txt
- query Prisma
- implement public visibility filtering directly
```

## Security Requirements

```txt
- Query must return cards only for public approved deck.
- Query must not leak private deck cards.
```

## Acceptance Criteria

```txt
- publicDeckCards query exists.
- Query works without auth.
- Public approved deck cards are returned.
- Private deck cards are not returned.
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
feat(public-decks): add public deck cards query
```

---

# TASK-06.13 Add CopyPublicDeckUseCase

## Status

TODO

## Context

Authenticated users should be able to copy public approved decks into their own private deck library.

Copying must not copy SRS state or study sessions.

## Goal

Add `CopyPublicDeckUseCase`.

## Files to Create

```txt
apps/api/src/modules/decks/application/use-cases/copy-public-deck.use-case.ts
```

## Files to Modify

```txt
apps/api/src/modules/decks/decks.module.ts
```

## Requirements

Input:

```ts
export type CopyPublicDeckUseCaseInput = {
  currentUser: AuthUser
  sourceDeckId: string
}
```

Output:

```ts
export type CopyPublicDeckUseCaseResult = {
  deck: Deck
  cards: Card[]
}
```

Use case must:

```txt
1. Validate current user exists.
2. Reject blocked user.
3. Load source deck using findPublicApprovedById.
4. If not found, throw DECK_NOT_FOUND.
5. Load source deck non-deleted cards.
6. Create private copied deck owned by current user.
7. Copy cards into new deck.
8. Preserve card order.
9. Return copied deck and cards.
```

Copied deck behavior:

```txt
ownerId = current user id
sourceDeckId = source deck id
visibility = PRIVATE
moderationStatus = NONE
isOfficial = false
```

Copied card behavior:

```txt
- copy front
- copy back
- copy example
- copy notes
- copy position
```

Must not copy:

```txt
- CardReviewState
- StudySession
- StudySessionReview
- owner information
- public moderation state
```

Title behavior:

```txt
Copied deck title may be:
"Copy of <source title>"
```

or simply source title.

Recommended MVP:

```txt
title = source title
description = source description
```

## Security Requirements

```txt
- User must be authenticated.
- User cannot copy private decks.
- User cannot copy rejected/hidden/pending decks.
- Copied deck must be private.
- SRS state must not be copied.
```

## Architecture Constraints

```txt
- Use case depends on repository ports.
- Use case must not import Prisma.
- Use case must not import GraphQL decorators.
```

## Do Not Do

```txt
- Do not implement group-shared deck copying in MVP.
- Do not copy review state.
- Do not publish copied deck automatically.
```

## Acceptance Criteria

```txt
- CopyPublicDeckUseCase exists.
- Authenticated user can copy public approved deck.
- Private source deck cannot be copied.
- Copied deck belongs to current user.
- Copied deck is private.
- Cards are copied.
- SRS state is not copied.
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
feat(public-decks): add copy public deck use case
```

---

# TASK-06.14 Add copyPublicDeck mutation

## Status

TODO

## Context

Frontend needs a mutation to copy public decks.

## Goal

Add protected `copyPublicDeck` mutation.

## Files to Create

```txt
apps/api/src/modules/decks/presentation/graphql/types/copy-public-deck-payload.type.ts
```

## Files to Modify

```txt
apps/api/src/modules/decks/presentation/graphql/resolvers/decks.resolver.ts
apps/api/src/modules/decks/decks.module.ts
```

## Requirements

Create payload type:

```txt
CopyPublicDeckPayloadType:
- deck: DeckType!
- cards: [CardType!]!
```

Add mutation:

```graphql
copyPublicDeck(sourceDeckId: ID!): CopyPublicDeckPayloadType!
```

Mutation must:

```txt
- require GqlAuthGuard
- use CurrentUser
- call CopyPublicDeckUseCase
- return copied deck and cards
```

Resolver must not:

```txt
- query Prisma
- copy cards directly
- check visibility directly
```

## Security Requirements

```txt
- User must be authenticated.
- Only public approved decks can be copied.
- Copied deck is private.
```

## Acceptance Criteria

```txt
- copyPublicDeck mutation exists.
- Mutation requires auth.
- Public approved deck can be copied.
- Private deck cannot be copied.
- Copied deck belongs to current user.
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
feat(public-decks): add copy public deck mutation
```

---

# TASK-06.15 Add public decks final checks

## Status

TODO

## Context

Public decks are privacy-sensitive because private decks must not leak.

## Goal

Run final checks for public decks.

## Manual GraphQL Checks

Verify:

```txt
- publishDeck requires auth
- publishDeck owner works
- publishDeck non-owner fails
- publishDeck empty deck fails
- publicDecks returns published approved deck
- publicDecks does not return private deck
- publicDecks does not return deleted deck
- publicDecks search works by title
- publicDeck works for public approved deck
- publicDeck does not return private deck
- publicDeckCards works for public approved deck
- publicDeckCards does not return private deck cards
- copyPublicDeck requires auth
- copyPublicDeck copies public approved deck
- copyPublicDeck creates private deck for current user
- copyPublicDeck does not copy SRS state
- unpublishDeck hides deck from publicDecks
```

## Security Checks

Verify:

```txt
- Public search filters visibility = PUBLIC.
- Public search filters moderationStatus = APPROVED.
- Public search filters deletedAt = null.
- Copy creates private deck.
- Copy does not copy review state.
- Resolvers do not access Prisma directly.
- Permission logic is not inside resolvers.
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
- Do not move to lessons until public/private visibility checks pass.
- Do not expose private decks for frontend convenience.
```

## Acceptance Criteria

```txt
- Publish works.
- Unpublish works.
- Public search works.
- Public deck detail works.
- Public deck cards work.
- Copy public deck works.
- Private decks do not leak.
- Deleted decks do not appear publicly.
- Format check passes.
- Lint passes.
- Prisma validate passes.
- API build passes.
- git status is clean after commit.
```

## Expected Commit Message

```txt
chore(public-decks): finalize public decks
```

---

## Epic Completion Criteria

EPIC-06 is complete when:

```txt
- DeckRepositoryPort supports public operations.
- PrismaDeckRepository supports public operations.
- PublishDeckUseCase exists.
- publishDeck mutation works.
- UnpublishDeckUseCase exists.
- unpublishDeck mutation works.
- PublicDecksUseCase exists.
- publicDecks query works.
- PublicDeckUseCase exists.
- publicDeck query works.
- PublicDeckCardsUseCase exists.
- publicDeckCards query works.
- CopyPublicDeckUseCase exists.
- copyPublicDeck mutation works.
- Public search returns only PUBLIC + APPROVED + non-deleted decks.
- Private decks do not leak.
- Copied decks are private.
- SRS state is not copied.
- implementation follows docs/domain/permissions.md.
- implementation follows docs/security/security-checklist.md.
```

After this epic is complete, move to:

```txt
docs/tasks/07-srs-lessons.md
```
