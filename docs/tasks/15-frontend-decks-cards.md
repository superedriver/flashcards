# EPIC-15 Frontend Decks & Cards

## Epic Goal

Implement frontend deck and card management screens for Flashcards.

This epic covers:

```txt
- my decks list
- deck detail
- create deck
- edit deck
- delete deck
- card list
- create card
- edit card
- delete card
- publish/unpublish deck actions
- copy public deck entry point if available
```

Public browsing, CSV import, and AI examples are handled in:

```txt
docs/tasks/17-frontend-public-csv-ai.md
```

Lessons are handled in:

```txt
docs/tasks/16-frontend-lessons.md
```

## Epic Status

TODO

## Related Documents

Cursor must read these documents before working on this epic:

```txt
docs/architecture.md
docs/domain/permissions.md
docs/security/security-checklist.md
docs/tasks/README.md
docs/tasks/cursor-task-template.md
docs/tasks/05-decks-cards.md
docs/tasks/06-public-decks.md
docs/tasks/13-frontend-foundation.md
docs/tasks/14-frontend-auth.md
```

## Epic Prerequisites

EPIC-14 should be complete.

Expected state:

```txt
- Expo app exists.
- Expo Router works.
- Tamagui works.
- Apollo Client works.
- Auth state works.
- Protected tabs work.
- GraphQL codegen works.
- Shared UI primitives exist.
```

## Epic Rules

```txt
1. Use Apollo Client for GraphQL operations.
2. Use generated GraphQL types/hooks when available.
3. Do not call backend directly with fetch from screens.
4. Do not implement backend permissions in frontend.
5. Frontend may hide/show UI based on ownership, but backend remains source of truth.
6. Do not store secrets in frontend.
7. Do not store auth tokens in localStorage/sessionStorage.
8. Keep forms validated on frontend, but backend validation remains source of truth.
9. Keep screens usable on native and web.
10. Do not implement SRS logic here.
```

## Frontend Scope

This epic implements authenticated deck/card management.

Screens:

```txt
/(tabs)/decks
/decks/new
/decks/[deckId]
/decks/[deckId]/edit
/decks/[deckId]/cards/new
/decks/[deckId]/cards/[cardId]/edit
```

Optional route if useful:

```txt
/decks/[deckId]/settings
```

## Expected Backend Operations

Deck/card operations from EPIC-05:

```graphql
query MyDecks {
  myDecks {
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
  }
}

query Deck($id: ID!) {
  deck(id: $id) {
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
  }
}

query DeckCards($deckId: ID!) {
  deckCards(deckId: $deckId) {
    id
    deckId
    front
    back
    example
    notes
    position
    createdAt
    updatedAt
  }
}

mutation CreateDeck($input: CreateDeckInput!) {
  createDeck(input: $input) {
    id
    title
    description
    visibility
    moderationStatus
    createdAt
    updatedAt
  }
}

mutation UpdateDeck($input: UpdateDeckInput!) {
  updateDeck(input: $input) {
    id
    title
    description
    visibility
    moderationStatus
    updatedAt
  }
}

mutation DeleteDeck($deckId: ID!) {
  deleteDeck(deckId: $deckId)
}

mutation CreateCard($input: CreateCardInput!) {
  createCard(input: $input) {
    id
    deckId
    front
    back
    example
    notes
    position
    createdAt
    updatedAt
  }
}

mutation UpdateCard($input: UpdateCardInput!) {
  updateCard(input: $input) {
    id
    deckId
    front
    back
    example
    notes
    position
    updatedAt
  }
}

mutation DeleteCard($cardId: ID!) {
  deleteCard(cardId: $cardId)
}
```

Public deck operations from EPIC-06 if available:

```graphql
mutation PublishDeck($deckId: ID!) {
  publishDeck(deckId: $deckId) {
    id
    visibility
    moderationStatus
    updatedAt
  }
}

mutation UnpublishDeck($deckId: ID!) {
  unpublishDeck(deckId: $deckId) {
    id
    visibility
    moderationStatus
    updatedAt
  }
}
```

## Epic Summary

```md
- [ ] TASK-15.01 Add deck/card GraphQL documents
- [ ] TASK-15.02 Generate deck/card GraphQL types
- [ ] TASK-15.03 Add deck/card feature structure
- [ ] TASK-15.04 Add deck form validation
- [ ] TASK-15.05 Add card form validation
- [ ] TASK-15.06 Add my decks screen
- [ ] TASK-15.07 Add create deck screen
- [ ] TASK-15.08 Add deck detail screen
- [ ] TASK-15.09 Add edit deck screen
- [ ] TASK-15.10 Add delete deck action
- [ ] TASK-15.11 Add card list UI
- [ ] TASK-15.12 Add create card screen
- [ ] TASK-15.13 Add edit card screen
- [ ] TASK-15.14 Add delete card action
- [ ] TASK-15.15 Add publish/unpublish deck actions
- [ ] TASK-15.16 Add deck/card frontend final checks
```

---

# TASK-15.01 Add deck/card GraphQL documents

## Status

TODO

## Context

Frontend deck/card screens should use GraphQL documents and generated types.

## Goal

Add deck/card GraphQL operation documents.

## Files to Create

```txt
apps/mobile/src/features/decks/graphql/decks.graphql
```

## Requirements

Add operations:

```graphql
query MyDecks {
  myDecks {
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
  }
}

query Deck($id: ID!) {
  deck(id: $id) {
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
  }
}

query DeckCards($deckId: ID!) {
  deckCards(deckId: $deckId) {
    id
    deckId
    front
    back
    example
    notes
    position
    createdAt
    updatedAt
  }
}

mutation CreateDeck($input: CreateDeckInput!) {
  createDeck(input: $input) {
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
  }
}

mutation UpdateDeck($input: UpdateDeckInput!) {
  updateDeck(input: $input) {
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
  }
}

mutation DeleteDeck($deckId: ID!) {
  deleteDeck(deckId: $deckId)
}

mutation CreateCard($input: CreateCardInput!) {
  createCard(input: $input) {
    id
    deckId
    front
    back
    example
    notes
    position
    createdAt
    updatedAt
  }
}

mutation UpdateCard($input: UpdateCardInput!) {
  updateCard(input: $input) {
    id
    deckId
    front
    back
    example
    notes
    position
    createdAt
    updatedAt
  }
}

mutation DeleteCard($cardId: ID!) {
  deleteCard(cardId: $cardId)
}

mutation PublishDeck($deckId: ID!) {
  publishDeck(deckId: $deckId) {
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
  }
}

mutation UnpublishDeck($deckId: ID!) {
  unpublishDeck(deckId: $deckId) {
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
  }
}
```

## Security Requirements

```txt
- Do not request deletedAt from normal frontend queries.
- Do not request sensitive fields.
- Do not expose backend-only moderation internals beyond safe fields.
```

## Acceptance Criteria

```txt
- Deck/card GraphQL document exists.
- All required operations are included.
- Only safe fields are requested.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
TASK-15.01 Add deck/card GraphQL documents
```

---

# TASK-15.02 Generate deck/card GraphQL types

## Status

TODO

## Context

Frontend should use generated GraphQL types and hooks.

## Goal

Run codegen for deck/card operations.

## Files to Modify

```txt
apps/mobile/src/graphql/generated/index.ts
```

## Requirements

Run backend locally if schema is loaded from local GraphQL endpoint.

Then run:

```bash
pnpm --filter @flashcards/mobile codegen
```

Generated output should include hooks/types for:

```txt
MyDecks
Deck
DeckCards
CreateDeck
UpdateDeck
DeleteDeck
CreateCard
UpdateCard
DeleteCard
PublishDeck
UnpublishDeck
```

## Do Not Do

```txt
- Do not manually edit generated file.
- Do not commit generated file if repository convention excludes generated files.
```

## Acceptance Criteria

```txt
- Deck/card generated types exist or codegen successfully runs.
- Mobile typecheck passes.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile codegen
pnpm --filter @flashcards/mobile typecheck
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
TASK-15.02 Generate deck/card GraphQL types
```

---

# TASK-15.03 Add deck/card feature structure

## Status

TODO

## Context

Deck/card frontend code should be isolated in a feature folder.

## Goal

Create feature folder structure.

## Files to Create

```txt
apps/mobile/src/features/decks/components/.gitkeep
apps/mobile/src/features/decks/hooks/.gitkeep
apps/mobile/src/features/decks/screens/.gitkeep
apps/mobile/src/features/decks/validation/.gitkeep
apps/mobile/src/features/decks/graphql/.gitkeep
apps/mobile/src/features/decks/types/.gitkeep
apps/mobile/src/features/decks/index.ts
```

## Requirements

Create feature exports:

```ts
export * from './components'
export * from './hooks'
export * from './types'
```

Create index files as needed:

```txt
apps/mobile/src/features/decks/components/index.ts
apps/mobile/src/features/decks/hooks/index.ts
apps/mobile/src/features/decks/types/index.ts
```

## Architecture Constraints

```txt
- Deck feature code lives in src/features/decks.
- Generic UI remains in src/ui.
- No auth token logic in deck feature.
```

## Acceptance Criteria

```txt
- Deck feature structure exists.
- Exports exist.
- Typecheck passes.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
TASK-15.03 Add deck/card feature structure
```

---

# TASK-15.04 Add deck form validation

## Status

TODO

## Context

Frontend should validate deck forms before submitting.

Backend remains the source of truth.

## Goal

Add deck form schema.

## Files to Create

```txt
apps/mobile/src/features/decks/validation/deck-form.schema.ts
```

## Requirements

Create Zod schema:

```txt
title:
- required
- trim
- min 1
- max 120

description:
- optional
- trim
- max 1000
```

Export:

```ts
export const deckFormSchema = z.object({
  title: z.string().trim().min(1).max(120),
  description: z.string().trim().max(1000).optional().or(z.literal('')),
})

export type DeckFormValues = z.infer<typeof deckFormSchema>
```

## Acceptance Criteria

```txt
- Deck form schema exists.
- Validation matches backend constraints.
- Typecheck passes.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
TASK-15.04 Add deck form validation
```

---

# TASK-15.05 Add card form validation

## Status

TODO

## Context

Frontend should validate card forms before submitting.

Backend remains the source of truth.

## Goal

Add card form schema.

## Files to Create

```txt
apps/mobile/src/features/decks/validation/card-form.schema.ts
```

## Requirements

Create Zod schema:

```txt
front:
- required
- trim
- min 1
- max 2000

back:
- required
- trim
- min 1
- max 4000

example:
- optional
- trim
- max 4000

notes:
- optional
- trim
- max 4000
```

Export:

```ts
export const cardFormSchema = z.object({
  front: z.string().trim().min(1).max(2000),
  back: z.string().trim().min(1).max(4000),
  example: z.string().trim().max(4000).optional().or(z.literal('')),
  notes: z.string().trim().max(4000).optional().or(z.literal('')),
})

export type CardFormValues = z.infer<typeof cardFormSchema>
```

## Acceptance Criteria

```txt
- Card form schema exists.
- Validation matches backend constraints.
- Typecheck passes.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
TASK-15.05 Add card form validation
```

---

# TASK-15.06 Add my decks screen

## Status

TODO

## Context

Authenticated users need to see their deck library.

## Goal

Implement my decks screen.

## Files to Modify

```txt
apps/mobile/app/(tabs)/decks.tsx
```

## Files to Create

```txt
apps/mobile/src/features/decks/screens/my-decks-screen.tsx
apps/mobile/src/features/decks/components/deck-list.tsx
apps/mobile/src/features/decks/components/deck-list-item.tsx
```

## Requirements

Screen should:

```txt
- call MyDecks query
- show loading state
- show error state
- show empty state
- list deck title and description
- show visibility/moderation status badge
- navigate to deck detail on press
- show create deck button
```

Create deck navigation:

```txt
/decks/new
```

Deck detail navigation:

```txt
/decks/[deckId]
```

## Security Requirements

```txt
- Do not accept userId input.
- Use current authenticated user's myDecks query.
```

## Acceptance Criteria

```txt
- My decks screen renders.
- Loading/error/empty states exist.
- User can navigate to create deck.
- User can navigate to deck detail.
- Typecheck passes.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm --filter @flashcards/mobile web
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
TASK-15.06 Add my decks screen
```

---

# TASK-15.07 Add create deck screen

## Status

TODO

## Context

Users need to create decks from the frontend.

## Goal

Implement create deck screen.

## Files to Create

```txt
apps/mobile/app/decks/new.tsx
apps/mobile/src/features/decks/screens/create-deck-screen.tsx
apps/mobile/src/features/decks/components/deck-form.tsx
```

## Requirements

Deck form fields:

```txt
title
description
```

Submit behavior:

```txt
1. Validate form.
2. Call CreateDeck mutation.
3. Refetch MyDecks or update Apollo cache.
4. Navigate to created deck detail.
```

UX:

```txt
- show submit loading state
- show validation errors
- show backend errors
- include cancel/back action
```

## Security Requirements

```txt
- Do not allow ownerId input.
- Do not allow visibility input here.
- Do not allow moderationStatus input here.
```

## Acceptance Criteria

```txt
- Create deck screen exists.
- Deck form validates.
- CreateDeck mutation is used.
- New deck appears in list.
- User navigates to created deck.
- Typecheck passes.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm --filter @flashcards/mobile web
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
TASK-15.07 Add create deck screen
```

---

# TASK-15.08 Add deck detail screen

## Status

TODO

## Context

Users need to view deck details and cards.

## Goal

Implement deck detail screen.

## Files to Create

```txt
apps/mobile/app/decks/[deckId]/index.tsx
apps/mobile/src/features/decks/screens/deck-detail-screen.tsx
apps/mobile/src/features/decks/components/deck-header.tsx
apps/mobile/src/features/decks/components/deck-actions.tsx
```

## Requirements

Screen should:

```txt
- read deckId from route params
- call Deck query
- call DeckCards query
- show loading state
- show error state
- show deck title/description/status
- show card count
- show card list
- show add card button
- show edit deck button
- show start lesson button if lesson route exists
```

Navigation:

```txt
edit deck -> /decks/[deckId]/edit
add card -> /decks/[deckId]/cards/new
start lesson -> /lessons/start?deckId=<deckId> or route from EPIC-16
```

## Security Requirements

```txt
- Frontend may show owner actions based on data, but backend enforces permissions.
- Do not expose deleted cards.
```

## Acceptance Criteria

```txt
- Deck detail screen exists.
- Deck query is used.
- DeckCards query is used.
- Cards render.
- Navigation actions exist.
- Typecheck passes.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm --filter @flashcards/mobile web
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
TASK-15.08 Add deck detail screen
```

---

# TASK-15.09 Add edit deck screen

## Status

TODO

## Context

Deck owners need to edit deck metadata.

## Goal

Implement edit deck screen.

## Files to Create

```txt
apps/mobile/app/decks/[deckId]/edit.tsx
apps/mobile/src/features/decks/screens/edit-deck-screen.tsx
```

## Files to Modify

```txt
apps/mobile/src/features/decks/components/deck-form.tsx
```

## Requirements

Screen should:

```txt
- read deckId from route params
- load deck
- prefill title and description
- validate form
- call UpdateDeck mutation
- update Apollo cache or refetch Deck/MyDecks
- navigate back to deck detail after success
```

Do not include fields:

```txt
ownerId
visibility
moderationStatus
isOfficial
```

## Security Requirements

```txt
- Backend enforces owner-only update.
- Frontend should not send restricted fields.
```

## Acceptance Criteria

```txt
- Edit deck screen exists.
- Existing deck data is prefilled.
- UpdateDeck mutation is used.
- Restricted fields are not editable.
- Typecheck passes.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm --filter @flashcards/mobile web
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
TASK-15.09 Add edit deck screen
```

---

# TASK-15.10 Add delete deck action

## Status

TODO

## Context

Deck owners need to delete decks.

## Goal

Implement delete deck action.

## Files to Modify

```txt
apps/mobile/src/features/decks/components/deck-actions.tsx
apps/mobile/src/features/decks/screens/deck-detail-screen.tsx
```

## Requirements

Delete behavior:

```txt
1. Show confirmation dialog.
2. Call DeleteDeck mutation.
3. Update Apollo cache or refetch MyDecks.
4. Navigate back to /(tabs)/decks.
```

UX:

```txt
- destructive action styling
- loading state while deleting
- backend error handling
```

## Security Requirements

```txt
- Backend enforces owner-only delete.
- Frontend should not assume delete succeeded without mutation result.
```

## Acceptance Criteria

```txt
- Delete deck action exists.
- Confirmation is shown.
- DeleteDeck mutation is used.
- User returns to decks list after success.
- Typecheck passes.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm --filter @flashcards/mobile web
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
TASK-15.10 Add delete deck action
```

---

# TASK-15.11 Add card list UI

## Status

TODO

## Context

Deck detail should display cards clearly.

## Goal

Add reusable card list components.

## Files to Create

```txt
apps/mobile/src/features/decks/components/card-list.tsx
apps/mobile/src/features/decks/components/card-list-item.tsx
```

## Requirements

Card list item should show:

```txt
front
back
example if available
position
```

Actions:

```txt
- press card to edit
- optional delete action
```

Navigation:

```txt
/decks/[deckId]/cards/[cardId]/edit
```

## Acceptance Criteria

```txt
- CardList exists.
- CardListItem exists.
- Deck detail uses CardList.
- Pressing card navigates to edit card screen.
- Typecheck passes.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm --filter @flashcards/mobile web
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
TASK-15.11 Add card list UI
```

---

# TASK-15.12 Add create card screen

## Status

TODO

## Context

Deck owners need to create cards.

## Goal

Implement create card screen.

## Files to Create

```txt
apps/mobile/app/decks/[deckId]/cards/new.tsx
apps/mobile/src/features/decks/screens/create-card-screen.tsx
apps/mobile/src/features/decks/components/card-form.tsx
```

## Requirements

Card form fields:

```txt
front
back
example
notes
```

Submit behavior:

```txt
1. Read deckId from route params.
2. Validate form.
3. Call CreateCard mutation.
4. Refetch DeckCards or update Apollo cache.
5. Navigate back to deck detail.
```

UX:

```txt
- loading state
- validation errors
- backend errors
- cancel/back action
```

## Security Requirements

```txt
- Do not allow user to enter ownerId.
- Do not allow creating card in arbitrary deck without backend permission.
- Backend enforces owner-only creation.
```

## Acceptance Criteria

```txt
- Create card screen exists.
- Card form validates.
- CreateCard mutation is used.
- New card appears in deck detail.
- Typecheck passes.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm --filter @flashcards/mobile web
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
TASK-15.12 Add create card screen
```

---

# TASK-15.13 Add edit card screen

## Status

TODO

## Context

Deck owners need to edit cards.

## Goal

Implement edit card screen.

## Files to Create

```txt
apps/mobile/app/decks/[deckId]/cards/[cardId]/edit.tsx
apps/mobile/src/features/decks/screens/edit-card-screen.tsx
```

## Files to Modify

```txt
apps/mobile/src/features/decks/components/card-form.tsx
```

## Requirements

Screen should:

```txt
- read deckId and cardId from route params
- load DeckCards or card data from cache
- prefill card form
- validate form
- call UpdateCard mutation
- update Apollo cache or refetch DeckCards
- navigate back to deck detail after success
```

Do not include fields:

```txt
deckId editing
position editing unless explicitly supported
```

## Security Requirements

```txt
- Backend enforces owner-only card update.
- Frontend should not send deckId in UpdateCardInput.
```

## Acceptance Criteria

```txt
- Edit card screen exists.
- Existing card data is prefilled.
- UpdateCard mutation is used.
- deckId is not editable.
- Typecheck passes.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm --filter @flashcards/mobile web
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
TASK-15.13 Add edit card screen
```

---

# TASK-15.14 Add delete card action

## Status

TODO

## Context

Deck owners need to delete cards.

## Goal

Implement delete card action.

## Files to Modify

```txt
apps/mobile/src/features/decks/components/card-list-item.tsx
apps/mobile/src/features/decks/screens/edit-card-screen.tsx
apps/mobile/src/features/decks/screens/deck-detail-screen.tsx
```

## Requirements

Delete behavior:

```txt
1. Show confirmation dialog.
2. Call DeleteCard mutation.
3. Update Apollo cache or refetch DeckCards.
4. Navigate back to deck detail if deleted from edit screen.
```

UX:

```txt
- destructive action styling
- loading state while deleting
- backend error handling
```

## Security Requirements

```txt
- Backend enforces owner-only delete.
- Frontend should not assume delete succeeded without mutation result.
```

## Acceptance Criteria

```txt
- Delete card action exists.
- Confirmation is shown.
- DeleteCard mutation is used.
- Deleted card disappears from list.
- Typecheck passes.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm --filter @flashcards/mobile web
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
TASK-15.14 Add delete card action
```

---

# TASK-15.15 Add publish/unpublish deck actions

## Status

TODO

## Context

Deck owners need to publish decks and make them private again.

## Goal

Add publish/unpublish actions to deck detail.

## Files to Modify

```txt
apps/mobile/src/features/decks/components/deck-actions.tsx
apps/mobile/src/features/decks/screens/deck-detail-screen.tsx
```

## Requirements

Publish behavior:

```txt
1. Show confirmation.
2. Call PublishDeck mutation.
3. Update deck status in cache/refetch Deck.
4. Show success/error feedback.
```

Unpublish behavior:

```txt
1. Show confirmation.
2. Call UnpublishDeck mutation.
3. Update deck status in cache/refetch Deck.
4. Show success/error feedback.
```

UI rules:

```txt
- PRIVATE deck shows Publish action.
- PUBLIC deck shows Unpublish action.
- Show moderationStatus.
- If publish fails because deck has no cards, show backend error.
```

## Security Requirements

```txt
- Backend enforces owner-only publish/unpublish.
- Frontend must not set visibility directly.
- Frontend must not set moderationStatus directly.
```

## Acceptance Criteria

```txt
- Publish action exists.
- Unpublish action exists.
- PublishDeck mutation is used.
- UnpublishDeck mutation is used.
- Visibility/status updates after action.
- Typecheck passes.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm --filter @flashcards/mobile web
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
TASK-15.15 Add publish/unpublish deck actions
```

---

# TASK-15.16 Add deck/card frontend final checks

## Status

TODO

## Context

Deck/card frontend screens are core product screens.

## Goal

Run final checks for frontend deck/card management.

## Manual Checks

Verify:

```txt
- my decks screen requires authenticated app state
- my decks list loads
- empty state works
- create deck works
- created deck appears in list
- deck detail loads
- edit deck works
- delete deck works
- create card works
- card appears in deck detail
- edit card works
- delete card works
- publish deck works
- publish empty deck shows backend error
- unpublish deck works
- loading states are visible
- error states are understandable
```

## Security Checks

Verify:

```txt
- frontend does not send ownerId on create deck
- frontend does not send visibility/moderationStatus on update deck
- frontend does not send deckId on update card
- frontend does not store tokens in localStorage/sessionStorage
- frontend does not include backend secrets
```

Suggested checks:

```bash
grep -R "localStorage" apps/mobile || true
grep -R "sessionStorage" apps/mobile || true
grep -R "JWT_ACCESS_SECRET\|JWT_REFRESH_SECRET\|DATABASE_URL\|AI_API_KEY\|INTERNAL_JOB_SECRET" apps/mobile || true
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm --filter @flashcards/mobile web
pnpm format:check
pnpm lint
```

## Do Not Do

```txt
- Do not move to frontend lessons until deck/card screens pass.
- Do not implement SRS calculations in frontend.
- Do not rely on frontend permission checks for security.
```

## Acceptance Criteria

```txt
- Deck list works.
- Deck create/edit/delete works.
- Card create/edit/delete works.
- Publish/unpublish works.
- UI handles loading/error/empty states.
- Typecheck passes.
- Format check passes.
- Lint passes.
- No frontend secrets are present.
- git status is clean after commit.
```

## Expected Commit Message

```txt
TASK-15.16 Add deck/card frontend final checks
```

---

## Epic Completion Criteria

EPIC-15 is complete when:

```txt
- Deck/card GraphQL documents exist.
- Deck/card generated types exist.
- Deck feature structure exists.
- Deck form validation exists.
- Card form validation exists.
- My decks screen works.
- Create deck screen works.
- Deck detail screen works.
- Edit deck screen works.
- Delete deck action works.
- Card list UI works.
- Create card screen works.
- Edit card screen works.
- Delete card action works.
- Publish/unpublish deck actions work.
- UI handles loading/error/empty states.
- frontend does not send restricted backend fields.
- implementation follows docs/security/security-checklist.md.
```

After this epic is complete, move to:

```txt
docs/tasks/16-frontend-lessons.md
```
