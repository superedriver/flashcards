# EPIC-17 Frontend Public Decks, CSV Import & AI Examples

## Epic Goal

Implement frontend screens and flows for public decks, CSV import, and AI-generated examples.

This epic covers:

```txt
- public deck browsing
- public deck search
- public deck detail
- copying public decks
- CSV import preview
- CSV import confirmation
- AI example generation
- saving selected AI example to a card
```

Backend features are handled in:

```txt
docs/tasks/06-public-decks.md
docs/tasks/08-csv-import.md
docs/tasks/09-ai-examples.md
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
docs/tasks/06-public-decks.md
docs/tasks/08-csv-import.md
docs/tasks/09-ai-examples.md
docs/tasks/13-frontend-foundation.md
docs/tasks/14-frontend-auth.md
docs/tasks/15-frontend-decks-cards.md
```

## Epic Prerequisites

EPIC-16 should be complete.

Expected state:

```txt
- Expo app works.
- Auth works.
- Apollo Client works.
- GraphQL codegen works.
- Deck/card frontend screens work.
- Deck detail and card edit screens exist.
- Shared UI primitives exist.
```

## Epic Rules

```txt
1. Use Apollo Client for GraphQL operations.
2. Use generated GraphQL types/hooks when available.
3. Do not call backend directly with fetch from screens.
4. Do not implement backend permissions in frontend.
5. Frontend visibility is UX only.
6. Backend remains source of truth for public visibility, CSV validation, and AI permissions.
7. Frontend must not call AI providers directly.
8. Frontend must not contain AI_API_KEY.
9. Frontend sends csvText to backend; no file upload storage in MVP.
10. CSV preview must not create cards.
11. CSV confirmation creates cards through backend.
12. Generated AI examples must not auto-save.
13. User must explicitly save selected AI example.
14. Do not store auth tokens in localStorage/sessionStorage.
15. Keep UI usable on native and web.
```

## Feature Scope

Public decks MVP:

```txt
- browse public approved decks
- search public approved decks
- view public deck detail/cards
- copy public deck into user's library
```

CSV MVP:

```txt
- user selects/pastes CSV text
- frontend sends csvText to backend preview mutation
- frontend displays preview rows/errors
- user confirms import
- backend creates cards
```

AI examples MVP:

```txt
- user opens card edit/create context
- user asks backend to generate example candidates
- frontend displays candidates
- user chooses one candidate
- frontend calls save mutation
```

## Security Notes

Frontend must not include:

```txt
DATABASE_URL
JWT_ACCESS_SECRET
JWT_REFRESH_SECRET
AI_API_KEY
INTERNAL_JOB_SECRET
EMAIL provider secrets
```

Frontend must not send:

```txt
- AI provider API keys
- direct Gemini requests
- moderationStatus changes
- ownerId changes
```

## Expected Backend Operations

Public deck operations:

```graphql
query PublicDecks($input: PublicDecksInput) {
  publicDecks(input: $input) {
    items {
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
    total
  }
}

query PublicDeck($id: ID!) {
  publicDeck(id: $id) {
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

mutation CopyPublicDeck($deckId: ID!) {
  copyPublicDeck(deckId: $deckId) {
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

CSV operations:

```graphql
mutation PreviewCsvImport($input: PreviewCsvImportInput!) {
  previewCsvImport(input: $input) {
    id
    deckId
    status
    totalRows
    validRows
    invalidRows
    previewRows {
      rowNumber
      front
      back
      example
      notes
      isValid
      errors {
        rowNumber
        field
        message
      }
    }
    errors {
      rowNumber
      field
      message
    }
    createdAt
    confirmedAt
    expiresAt
  }
}

mutation ConfirmCsvImport($input: ConfirmCsvImportInput!) {
  confirmCsvImport(input: $input) {
    import {
      id
      deckId
      status
      totalRows
      validRows
      invalidRows
      createdAt
      confirmedAt
      expiresAt
    }
    createdCardsCount
  }
}
```

AI operations:

```graphql
mutation GenerateCardExamples($input: GenerateCardExamplesInput!) {
  generateCardExamples(input: $input) {
    cardId
    examples {
      text
    }
  }
}

mutation SaveGeneratedCardExample($input: SaveGeneratedCardExampleInput!) {
  saveGeneratedCardExample(input: $input) {
    card {
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
}
```

## Frontend Routes

Implement or update:

```txt
/(tabs)/public
/public/[deckId]
/decks/[deckId]/import-csv
```

AI example generation should be integrated into:

```txt
/decks/[deckId]/cards/new
/decks/[deckId]/cards/[cardId]/edit
```

## Epic Summary

```md
- [ ] TASK-17.01 Add public/CSV/AI GraphQL documents
- [ ] TASK-17.02 Generate public/CSV/AI GraphQL types
- [ ] TASK-17.03 Add public decks feature structure
- [ ] TASK-17.04 Add public decks screen
- [ ] TASK-17.05 Add public deck detail screen
- [ ] TASK-17.06 Add copy public deck action
- [ ] TASK-17.07 Add CSV import feature structure
- [ ] TASK-17.08 Add CSV import screen
- [ ] TASK-17.09 Add CSV preview UI
- [ ] TASK-17.10 Add CSV confirm flow
- [ ] TASK-17.11 Add AI examples feature structure
- [ ] TASK-17.12 Add AI example generator component
- [ ] TASK-17.13 Integrate AI examples into card forms
- [ ] TASK-17.14 Add public/CSV/AI frontend final checks
```

---

# TASK-17.01 Add public/CSV/AI GraphQL documents

## Status

TODO

## Context

Frontend should use GraphQL documents and generated types for public decks, CSV import, and AI examples.

## Goal

Add GraphQL documents.

## Files to Create

```txt
apps/mobile/src/features/public-decks/graphql/public-decks.graphql
apps/mobile/src/features/csv-import/graphql/csv-import.graphql
apps/mobile/src/features/ai-examples/graphql/ai-examples.graphql
```

## Requirements

Add public deck operations:

```graphql
query PublicDecks($input: PublicDecksInput) {
  publicDecks(input: $input) {
    items {
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
    total
  }
}

query PublicDeck($id: ID!) {
  publicDeck(id: $id) {
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

query PublicDeckCards($deckId: ID!) {
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

mutation CopyPublicDeck($deckId: ID!) {
  copyPublicDeck(deckId: $deckId) {
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

Add CSV operations:

```graphql
mutation PreviewCsvImport($input: PreviewCsvImportInput!) {
  previewCsvImport(input: $input) {
    id
    deckId
    status
    totalRows
    validRows
    invalidRows
    previewRows {
      rowNumber
      front
      back
      example
      notes
      isValid
      errors {
        rowNumber
        field
        message
      }
    }
    errors {
      rowNumber
      field
      message
    }
    createdAt
    confirmedAt
    expiresAt
  }
}

mutation ConfirmCsvImport($input: ConfirmCsvImportInput!) {
  confirmCsvImport(input: $input) {
    import {
      id
      deckId
      status
      totalRows
      validRows
      invalidRows
      createdAt
      confirmedAt
      expiresAt
    }
    createdCardsCount
  }
}
```

Add AI operations:

```graphql
mutation GenerateCardExamples($input: GenerateCardExamplesInput!) {
  generateCardExamples(input: $input) {
    cardId
    examples {
      text
    }
  }
}

mutation SaveGeneratedCardExample($input: SaveGeneratedCardExampleInput!) {
  saveGeneratedCardExample(input: $input) {
    card {
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
}
```

## Security Requirements

```txt
- Do not request sensitive fields.
- Do not request AI logs.
- Do not request provider prompts.
- Do not expose deletedAt in normal user UI.
```

## Acceptance Criteria

```txt
- Public deck GraphQL document exists.
- CSV import GraphQL document exists.
- AI examples GraphQL document exists.
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
chore(frontend-public): add public CSV AI GraphQL documents
```

---

# TASK-17.02 Generate public/CSV/AI GraphQL types

## Status

TODO

## Context

Frontend should use generated GraphQL types and hooks.

## Goal

Run codegen for public decks, CSV import, and AI examples.

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
PublicDecks
PublicDeck
PublicDeckCards
CopyPublicDeck
PreviewCsvImport
ConfirmCsvImport
GenerateCardExamples
SaveGeneratedCardExample
```

## Do Not Do

```txt
- Do not manually edit generated file.
- Do not commit generated file if repository convention excludes generated files.
```

## Acceptance Criteria

```txt
- Public/CSV/AI generated types exist or codegen successfully runs.
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
chore(frontend-public): generate public CSV AI GraphQL types
```

---

# TASK-17.03 Add public decks feature structure

## Status

TODO

## Context

Public deck frontend code should be isolated in a feature folder.

## Goal

Create public decks feature folder structure.

## Files to Create

```txt
apps/mobile/src/features/public-decks/components/.gitkeep
apps/mobile/src/features/public-decks/hooks/.gitkeep
apps/mobile/src/features/public-decks/screens/.gitkeep
apps/mobile/src/features/public-decks/graphql/.gitkeep
apps/mobile/src/features/public-decks/types/.gitkeep
apps/mobile/src/features/public-decks/index.ts
```

## Requirements

Create index exports:

```ts
export * from './components'
export * from './hooks'
export * from './types'
```

Create index files as needed:

```txt
apps/mobile/src/features/public-decks/components/index.ts
apps/mobile/src/features/public-decks/hooks/index.ts
apps/mobile/src/features/public-decks/types/index.ts
```

## Architecture Constraints

```txt
- Public deck feature code lives in src/features/public-decks.
- Generic UI remains in src/ui.
- Do not put auth token logic in public deck feature.
```

## Acceptance Criteria

```txt
- Public deck feature structure exists.
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
chore(frontend-public): add public decks feature structure
```

---

# TASK-17.04 Add public decks screen

## Status

TODO

## Context

Users need to browse and search public decks.

## Goal

Implement public decks screen.

## Files to Modify

```txt
apps/mobile/app/(tabs)/public.tsx
```

## Files to Create

```txt
apps/mobile/src/features/public-decks/screens/public-decks-screen.tsx
apps/mobile/src/features/public-decks/components/public-deck-list.tsx
apps/mobile/src/features/public-decks/components/public-deck-list-item.tsx
apps/mobile/src/features/public-decks/components/public-deck-search.tsx
```

## Requirements

Screen should:

```txt
- call PublicDecks query
- support search input
- debounce search input
- show loading state
- show error state
- show empty state
- list title, description, official badge, updatedAt
- navigate to public deck detail on press
```

Search behavior:

```txt
- send query/search input to backend
- backend is source of truth for search and public visibility
```

Navigation:

```txt
/public/[deckId]
```

## Security Requirements

```txt
- Public list must rely on backend publicDecks query.
- Do not display private deck data.
```

## Acceptance Criteria

```txt
- Public decks screen renders.
- Search works.
- Loading/error/empty states exist.
- Public deck cards navigate to detail.
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
feat(frontend-public): add public decks screen
```

---

# TASK-17.05 Add public deck detail screen

## Status

TODO

## Context

Users need to view public deck details and cards before copying.

## Goal

Implement public deck detail screen.

## Files to Create

```txt
apps/mobile/app/public/[deckId].tsx
apps/mobile/src/features/public-decks/screens/public-deck-detail-screen.tsx
apps/mobile/src/features/public-decks/components/public-deck-header.tsx
apps/mobile/src/features/public-decks/components/public-deck-actions.tsx
```

## Requirements

Screen should:

```txt
- read deckId from route params
- call PublicDeck query
- call PublicDeckCards query
- show loading state
- show error state
- show title, description, official badge, card count
- show cards read-only
- show copy deck action
```

Read-only rule:

```txt
- public deck detail must not show edit card/deck actions
```

## Security Requirements

```txt
- Backend enforces PUBLIC + APPROVED visibility.
- Frontend does not assume public access for arbitrary deck ids.
```

## Acceptance Criteria

```txt
- Public deck detail screen exists.
- Public deck metadata renders.
- Public deck cards render read-only.
- Copy action entry point exists.
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
feat(frontend-public): add public deck detail screen
```

---

# TASK-17.06 Add copy public deck action

## Status

TODO

## Context

Users need to copy public decks into their own library.

## Goal

Implement copy public deck action.

## Files to Modify

```txt
apps/mobile/src/features/public-decks/components/public-deck-actions.tsx
apps/mobile/src/features/public-decks/screens/public-deck-detail-screen.tsx
```

## Requirements

Copy behavior:

```txt
1. Show confirmation.
2. Call CopyPublicDeck mutation.
3. Refetch MyDecks or update Apollo cache.
4. Navigate to copied deck detail in user's library.
```

UX:

```txt
- loading state while copying
- backend error handling
- success feedback
```

## Security Requirements

```txt
- Backend enforces copy permission.
- Frontend must not create deck/card copies manually.
- Frontend must not copy SRS/review/session state.
```

## Acceptance Criteria

```txt
- Copy public deck action exists.
- CopyPublicDeck mutation is used.
- Copied deck appears in user's library.
- User navigates to copied deck.
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
feat(frontend-public): add copy public deck action
```

---

# TASK-17.07 Add CSV import feature structure

## Status

TODO

## Context

CSV import frontend code should be isolated in a feature folder.

## Goal

Create CSV import feature folder structure.

## Files to Create

```txt
apps/mobile/src/features/csv-import/components/.gitkeep
apps/mobile/src/features/csv-import/hooks/.gitkeep
apps/mobile/src/features/csv-import/screens/.gitkeep
apps/mobile/src/features/csv-import/graphql/.gitkeep
apps/mobile/src/features/csv-import/types/.gitkeep
apps/mobile/src/features/csv-import/index.ts
```

## Requirements

Create index exports:

```ts
export * from './components'
export * from './hooks'
export * from './types'
```

Create index files as needed:

```txt
apps/mobile/src/features/csv-import/components/index.ts
apps/mobile/src/features/csv-import/hooks/index.ts
apps/mobile/src/features/csv-import/types/index.ts
```

## Architecture Constraints

```txt
- CSV import feature code lives in src/features/csv-import.
- CSV import feature does not create cards locally.
- Backend performs validation and creation.
```

## Acceptance Criteria

```txt
- CSV import feature structure exists.
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
chore(frontend-csv): add CSV import feature structure
```

---

# TASK-17.08 Add CSV import screen

## Status

TODO

## Context

Deck owners need a screen to paste or select CSV text for import.

## Goal

Implement CSV import screen.

## Files to Create

```txt
apps/mobile/app/decks/[deckId]/import-csv.tsx
apps/mobile/src/features/csv-import/screens/csv-import-screen.tsx
apps/mobile/src/features/csv-import/components/csv-input-form.tsx
```

## Files to Modify

```txt
apps/mobile/src/features/decks/components/deck-actions.tsx
apps/mobile/src/features/decks/screens/deck-detail-screen.tsx
```

## Requirements

Screen should:

```txt
- read deckId from route params
- show CSV format instructions
- allow user to paste csvText
- validate non-empty csvText before submit
- call PreviewCsvImport mutation
- show preview after response
```

Instructions should show:

```csv
front,back,example,notes
hello,привіт,Hello world,Common greeting
```

Deck detail should add:

```txt
Import CSV
```

action that navigates to:

```txt
/decks/[deckId]/import-csv
```

## Security Requirements

```txt
- Frontend sends csvText to backend.
- Frontend does not write CSV to disk.
- Frontend does not create cards during preview.
- Backend enforces owner-only import.
```

## Acceptance Criteria

```txt
- CSV import route exists.
- CSV input form exists.
- PreviewCsvImport mutation is used.
- Deck detail links to CSV import.
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
feat(frontend-csv): add CSV import screen
```

---

# TASK-17.09 Add CSV preview UI

## Status

TODO

## Context

Users need to review CSV validation results before importing.

## Goal

Add CSV preview components.

## Files to Create

```txt
apps/mobile/src/features/csv-import/components/csv-import-summary.tsx
apps/mobile/src/features/csv-import/components/csv-preview-table.tsx
apps/mobile/src/features/csv-import/components/csv-row-errors.tsx
```

## Requirements

Preview UI should show:

```txt
- total rows
- valid rows
- invalid rows
- preview table
- row-level errors
- global errors
```

Row UI should indicate:

```txt
- valid row
- invalid row
- row number
- front
- back
- example
- notes
```

If there are invalid rows:

```txt
- allow user to confirm only valid rows if backend supports it
- otherwise explain invalid rows will be skipped or import cannot continue depending on backend behavior
```

Use backend response as source of truth.

## Security Requirements

```txt
- Do not create cards from preview.
- Do not attempt frontend-only CSV validation as source of truth.
```

## Acceptance Criteria

```txt
- CSV summary component exists.
- CSV preview table exists.
- Row errors component exists.
- Invalid rows are clearly displayed.
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
feat(frontend-csv): add CSV preview UI
```

---

# TASK-17.10 Add CSV confirm flow

## Status

TODO

## Context

After preview, user confirms import.

Backend creates cards.

## Goal

Add CSV import confirmation flow.

## Files to Modify

```txt
apps/mobile/src/features/csv-import/screens/csv-import-screen.tsx
apps/mobile/src/features/csv-import/components/csv-import-summary.tsx
```

## Requirements

Confirm behavior:

```txt
1. User previews CSV.
2. If there are valid rows, show Confirm import button.
3. On confirm, call ConfirmCsvImport mutation.
4. Show createdCardsCount.
5. Refetch DeckCards.
6. Navigate back to deck detail or show success action.
```

Disable confirm if:

```txt
- no importId exists
- validRows = 0
- import status is not PENDING
- confirm mutation is loading
```

## Security Requirements

```txt
- Backend creates cards.
- Frontend must not create cards directly.
- Backend enforces import ownership and deck ownership.
```

## Acceptance Criteria

```txt
- Confirm import button exists.
- ConfirmCsvImport mutation is used.
- Created card count is shown.
- Deck cards are refreshed after import.
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
feat(frontend-csv): add CSV import confirm flow
```

---

# TASK-17.11 Add AI examples feature structure

## Status

TODO

## Context

AI example frontend code should be isolated in a feature folder.

## Goal

Create AI examples feature folder structure.

## Files to Create

```txt
apps/mobile/src/features/ai-examples/components/.gitkeep
apps/mobile/src/features/ai-examples/hooks/.gitkeep
apps/mobile/src/features/ai-examples/graphql/.gitkeep
apps/mobile/src/features/ai-examples/types/.gitkeep
apps/mobile/src/features/ai-examples/index.ts
```

## Requirements

Create index exports:

```ts
export * from './components'
export * from './hooks'
export * from './types'
```

Create index files as needed:

```txt
apps/mobile/src/features/ai-examples/components/index.ts
apps/mobile/src/features/ai-examples/hooks/index.ts
apps/mobile/src/features/ai-examples/types/index.ts
```

## Architecture Constraints

```txt
- AI examples feature code lives in src/features/ai-examples.
- Frontend does not call Gemini/OpenAI/AI provider directly.
- Frontend only calls backend GraphQL mutations.
```

## Acceptance Criteria

```txt
- AI examples feature structure exists.
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
chore(frontend-ai): add AI examples feature structure
```

---

# TASK-17.12 Add AI example generator component

## Status

TODO

## Context

Users need to generate example candidates for a card from the backend.

## Goal

Add AI example generator component.

## Files to Create

```txt
apps/mobile/src/features/ai-examples/components/ai-example-generator.tsx
apps/mobile/src/features/ai-examples/components/generated-example-list.tsx
apps/mobile/src/features/ai-examples/components/generated-example-list-item.tsx
```

## Requirements

Component props:

```ts
export type AiExampleGeneratorProps = {
  cardId: string
  currentExample?: string | null
  onExampleSelected: (exampleText: string) => void
}
```

Behavior:

```txt
- show Generate examples button
- call GenerateCardExamples mutation
- show loading state
- show backend errors
- display generated examples
- allow selecting one generated example
- call onExampleSelected with chosen text
```

Important:

```txt
- selecting a generated example fills form/example field only
- selecting does not save to backend unless card form is saved or SaveGeneratedCardExample is called explicitly
```

## Security Requirements

```txt
- Frontend does not call AI provider directly.
- Frontend does not store AI provider keys.
- Generated examples are not auto-saved.
```

## Acceptance Criteria

```txt
- AI example generator component exists.
- GenerateCardExamples mutation is used.
- Generated candidates render.
- User can select a candidate.
- Candidate is not auto-saved by selection alone.
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
feat(frontend-ai): add AI example generator
```

---

# TASK-17.13 Integrate AI examples into card forms

## Status

TODO

## Context

Card create/edit forms should help users fill the example field with AI.

## Goal

Integrate AI example generator into card forms.

## Files to Modify

```txt
apps/mobile/src/features/decks/components/card-form.tsx
apps/mobile/src/features/decks/screens/create-card-screen.tsx
apps/mobile/src/features/decks/screens/edit-card-screen.tsx
```

## Requirements

Create card screen behavior:

```txt
- if card has not been created yet, AI generation may be hidden or disabled
- show helper text: Save the card first to generate AI examples
```

Edit card screen behavior:

```txt
- show AI example generator for existing cardId
- selected candidate fills example field
- user must save card to persist, or use SaveGeneratedCardExample mutation if implementing explicit save
```

If using `SaveGeneratedCardExample` mutation:

```txt
- show Save this example button per generated candidate
- call SaveGeneratedCardExample mutation only when user explicitly taps save
- update card form/cache after success
```

## Security Requirements

```txt
- Backend enforces owner-only AI generation.
- Frontend does not expose AI API keys.
- Generated examples do not auto-save.
```

## Acceptance Criteria

```txt
- Card form supports AI example suggestions.
- Create card screen handles no cardId case safely.
- Edit card screen can generate examples for existing card.
- Selected example fills example field.
- Save behavior is explicit.
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
feat(frontend-ai): integrate AI examples into card forms
```

---

# TASK-17.14 Add public/CSV/AI frontend final checks

## Status

TODO

## Context

Public decks, CSV import, and AI examples cross permissions, user content, and external services.

## Goal

Run final checks.

## Manual Checks

Verify public decks:

```txt
- public tab loads public decks
- search works
- official badge displays
- public deck detail loads
- public deck cards are read-only
- copy public deck works
- copied deck appears in my decks
```

Verify CSV:

```txt
- CSV import route opens from deck detail
- CSV instructions are visible
- preview works for valid CSV
- preview shows row errors for invalid CSV
- preview does not create cards
- confirm import creates cards
- created card count is shown
- imported cards appear in deck detail
```

Verify AI:

```txt
- AI generator is not available before card exists or is safely disabled
- AI generator works on edit card screen
- generated examples display
- selecting example fills example field
- example is not auto-saved unless explicit save is used
- explicit save works if implemented
```

## Security Checks

Verify:

```txt
- frontend does not contain AI_API_KEY
- frontend does not call AI provider directly
- frontend does not create cards directly from CSV preview
- frontend does not manually copy public deck content
- frontend does not store tokens in localStorage/sessionStorage
- frontend does not include backend secrets
```

Suggested checks:

```bash
grep -R "AI_API_KEY\|JWT_ACCESS_SECRET\|JWT_REFRESH_SECRET\|DATABASE_URL\|INTERNAL_JOB_SECRET" apps/mobile || true
grep -R "localStorage" apps/mobile || true
grep -R "sessionStorage" apps/mobile || true
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
- Do not move to profile/settings/notifications until checks pass.
- Do not expose AI provider secrets.
- Do not make frontend CSV validation the source of truth.
- Do not auto-save AI generated examples.
```

## Acceptance Criteria

```txt
- Public deck browsing works.
- Public deck copying works.
- CSV preview works.
- CSV confirmation works.
- AI example generation works.
- AI selected examples require explicit save.
- Frontend does not expose secrets.
- Typecheck passes.
- Format check passes.
- Lint passes.
- git status is clean after commit.
```

## Expected Commit Message

```txt
chore(frontend-public): finalize public CSV AI flows
```

---

## Epic Completion Criteria

EPIC-17 is complete when:

```txt
- Public deck GraphQL documents exist.
- CSV import GraphQL documents exist.
- AI example GraphQL documents exist.
- Generated GraphQL types exist.
- Public decks feature structure exists.
- Public decks screen works.
- Public deck detail screen works.
- Copy public deck action works.
- CSV import feature structure exists.
- CSV import screen works.
- CSV preview UI works.
- CSV confirm flow works.
- AI examples feature structure exists.
- AI example generator works.
- AI examples are integrated into card forms.
- Generated examples are not auto-saved.
- Frontend does not expose AI provider keys.
- implementation follows docs/security/security-checklist.md.
```

After this epic is complete, move to:

```txt
docs/tasks/18-frontend-profile-settings-notifications.md
```
