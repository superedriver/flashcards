# EPIC-08 CSV Import

## Epic Goal

Implement CSV import for Flashcards decks.

This epic covers:

```txt
- CSV preview
- CSV validation
- CSV import confirmation
- frontend-free backend flow
- owner-only CSV import permissions
- card creation from CSV rows
```

MVP import strategy:

```txt
Frontend reads CSV text
  -> sends csvText to backend GraphQL mutation
  -> backend validates and previews rows
  -> user confirms import
  -> backend creates cards
```

No file storage is used in MVP.

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

Recommended but not strictly required:

```txt
docs/tasks/06-public-decks.md
docs/tasks/07-srs-lessons.md
```

Expected state:

```txt
- Deck/Card Prisma schema exists.
- DecksModule exists.
- DeckRepositoryPort exists.
- CardRepositoryPort exists.
- DeckPermissionService exists.
- Owner-only card creation works.
- Auth guard works.
- CurrentUser decorator works.
```

## Epic Rules

```txt
1. Follow docs/domain/permissions.md exactly.
2. Follow docs/security/security-checklist.md exactly.
3. Backend is the source of truth for CSV validation.
4. CSV import is owner-only.
5. Group viewers cannot import.
6. Public deck viewers cannot import.
7. Frontend sends csvText; backend does not receive file upload in MVP.
8. Backend must validate CSV size and row count.
9. Preview must not create cards.
10. Confirm import creates cards.
11. Do not put business logic in GraphQL resolvers.
12. Do not access Prisma directly from GraphQL resolvers.
```

## MVP CSV Format

Supported columns:

```txt
front
back
example
notes
```

Required columns:

```txt
front
back
```

Optional columns:

```txt
example
notes
```

Header row is required.

Example CSV:

```csv
front,back,example,notes
hello,привіт,Hello world,Common greeting
cat,кіт,The cat sleeps,
```

## CSV Limits

MVP limits:

```txt
max csvText size = 1 MB
max rows = 1000
max columns = 20
max front length = 2000
max back length = 4000
max example length = 4000
max notes length = 4000
```

## Epic Summary

```md
- [x] TASK-08.01 Add CSV import Prisma schema
- [x] TASK-08.02 Add CSV import module skeleton
- [x] TASK-08.03 Add CSV import domain types
- [ ] TASK-08.04 Add CSV parser service
- [ ] TASK-08.05 Add CSV import repository port
- [ ] TASK-08.06 Add Prisma CSV import repository
- [ ] TASK-08.07 Add CSV import GraphQL types and inputs
- [ ] TASK-08.08 Add PreviewCsvImportUseCase
- [ ] TASK-08.09 Add previewCsvImport mutation
- [ ] TASK-08.10 Add ConfirmCsvImportUseCase
- [ ] TASK-08.11 Add confirmCsvImport mutation
- [ ] TASK-08.12 Add CSV import final checks
```

---

# TASK-08.01 Add CSV import Prisma schema

## Status

DONE

## Context

CSV preview should not immediately create cards.

Backend should store a pending import preview so the user can confirm it.

## Goal

Add CSV import persistence models.

## Files to Modify

```txt
apps/api/prisma/schema.prisma
```

## Requirements

Add relations to `User`:

```prisma
csvImports CsvImport[]
```

Add relations to `Deck`:

```prisma
csvImports CsvImport[]
```

Add enum:

```prisma
enum CsvImportStatus {
  PENDING
  CONFIRMED
  CANCELLED
  EXPIRED
}
```

Add model:

```prisma
model CsvImport {
  id          String          @id @default(uuid())
  userId      String
  deckId      String
  status      CsvImportStatus @default(PENDING)
  totalRows   Int
  validRows   Int
  invalidRows Int
  previewRows Json
  errors      Json?

  createdAt   DateTime        @default(now())
  updatedAt   DateTime        @updatedAt
  confirmedAt DateTime?
  expiresAt   DateTime

  user        User            @relation(fields: [userId], references: [id], onDelete: Cascade)
  deck        Deck            @relation(fields: [deckId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([deckId])
  @@index([status])
  @@index([expiresAt])
}
```

## Expiry Rule

Pending imports should expire.

Recommended MVP expiry:

```txt
24 hours
```

## Security Requirements

```txt
- CsvImport belongs to one user.
- User can confirm only own import.
- User can confirm import only for deck they own.
```

## Architecture Constraints

```txt
- This task only changes persistence schema.
- Do not implement parser here.
- Do not implement GraphQL here.
```

## Do Not Do

```txt
- Do not add file storage.
- Do not store uploaded files.
- Do not create cards during preview.
```

## Acceptance Criteria

```txt
- CsvImportStatus enum exists.
- CsvImport model exists.
- User has csvImports relation.
- Deck has csvImports relation.
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
chore(db): add CSV import schema
```

---

# TASK-08.02 Add CSV import module skeleton

## Status

DONE

## Context

CSV import should live in its own backend module.

## Goal

Create CSV import module folder structure.

## Files to Create

```txt
apps/api/src/modules/csv-import/csv-import.module.ts

apps/api/src/modules/csv-import/domain/.gitkeep
apps/api/src/modules/csv-import/domain/types/.gitkeep
apps/api/src/modules/csv-import/domain/services/.gitkeep

apps/api/src/modules/csv-import/application/.gitkeep
apps/api/src/modules/csv-import/application/ports/.gitkeep
apps/api/src/modules/csv-import/application/use-cases/.gitkeep

apps/api/src/modules/csv-import/infrastructure/.gitkeep
apps/api/src/modules/csv-import/infrastructure/persistence/.gitkeep
apps/api/src/modules/csv-import/infrastructure/mappers/.gitkeep

apps/api/src/modules/csv-import/presentation/.gitkeep
apps/api/src/modules/csv-import/presentation/graphql/.gitkeep
apps/api/src/modules/csv-import/presentation/graphql/inputs/.gitkeep
apps/api/src/modules/csv-import/presentation/graphql/types/.gitkeep
apps/api/src/modules/csv-import/presentation/graphql/resolvers/.gitkeep
```

## Files to Modify

```txt
apps/api/src/app.module.ts
```

## Requirements

Create `CsvImportModule`:

```ts
import { Module } from '@nestjs/common'

@Module({})
export class CsvImportModule {}
```

Import `CsvImportModule` into `AppModule`.

## Architecture Constraints

```txt
- Keep module empty for now.
- Do not implement business logic in this task.
```

## Acceptance Criteria

```txt
- CsvImportModule exists.
- CsvImportModule is imported into AppModule.
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
chore(csv): add CSV import module skeleton
```

---

# TASK-08.03 Add CSV import domain types

## Status

DONE

## Context

CSV import use cases need framework-independent types.

## Goal

Add CSV import domain types.

## Files to Create

```txt
apps/api/src/modules/csv-import/domain/types/csv-import-status.type.ts
apps/api/src/modules/csv-import/domain/types/csv-import-row.type.ts
apps/api/src/modules/csv-import/domain/types/csv-import.type.ts
apps/api/src/modules/csv-import/domain/types/index.ts
```

## Requirements

Create `CsvImportStatus`:

```ts
export type CsvImportStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'EXPIRED'
```

Create row types:

```ts
export type CsvImportParsedRow = {
  rowNumber: number
  front: string
  back: string
  example: string | null
  notes: string | null
}

export type CsvImportRowError = {
  rowNumber: number
  field: string
  message: string
}

export type CsvImportPreviewRow = CsvImportParsedRow & {
  isValid: boolean
  errors: CsvImportRowError[]
}
```

Create `CsvImport`:

```ts
import { CsvImportStatus } from './csv-import-status.type'
import { CsvImportPreviewRow, CsvImportRowError } from './csv-import-row.type'

export type CsvImport = {
  id: string
  userId: string
  deckId: string
  status: CsvImportStatus
  totalRows: number
  validRows: number
  invalidRows: number
  previewRows: CsvImportPreviewRow[]
  errors: CsvImportRowError[]
  createdAt: Date
  updatedAt: Date
  confirmedAt: Date | null
  expiresAt: Date
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
- CsvImportStatus type exists.
- CsvImport row types exist.
- CsvImport type exists.
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
chore(csv): add CSV import domain types
```

---

# TASK-08.04 Add CSV parser service

## Status

TODO

## Context

Backend must parse and validate CSV text.

CSV preview should validate rows without creating cards.

## Goal

Add framework-independent CSV parser service.

## Files to Create

```txt
apps/api/src/modules/csv-import/domain/services/csv-parser.service.ts
```

## Requirements

Parser input:

```ts
export type ParseCsvInput = {
  csvText: string
}
```

Parser output:

```ts
export type ParseCsvResult = {
  totalRows: number
  validRows: number
  invalidRows: number
  previewRows: CsvImportPreviewRow[]
  errors: CsvImportRowError[]
}
```

Parser must:

```txt
1. Validate csvText size.
2. Parse header row.
3. Validate required columns.
4. Ignore empty trailing lines.
5. Validate row count.
6. Validate required fields.
7. Trim text fields.
8. Return preview rows and errors.
```

Supported headers:

```txt
front
back
example
notes
```

Required headers:

```txt
front
back
```

Validation:

```txt
front:
- required
- max 2000 characters

back:
- required
- max 4000 characters

example:
- optional
- max 4000 characters

notes:
- optional
- max 4000 characters
```

Limits:

```txt
max csvText size = 1 MB
max rows = 1000
max columns = 20
```

Recommended package:

```bash
pnpm --filter @flashcards/api add csv-parse
```

If avoiding dependency, implement a minimal parser only if it correctly handles quoted values.

## Security Requirements

```txt
- Do not execute CSV contents.
- Do not write CSV to disk.
- Do not create cards in parser.
- Do not log full CSV text.
```

## Architecture Constraints

```txt
- Parser service should be framework-independent.
- Parser must not import Prisma.
- Parser must not import GraphQL decorators.
```

## Acceptance Criteria

```txt
- CsvParserService exists.
- Required headers are validated.
- Row limits are enforced.
- Field length validation works.
- Parser handles quoted CSV values.
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
feat(csv): add CSV parser service
```

---

# TASK-08.05 Add CSV import repository port

## Status

TODO

## Context

Use cases must depend on repository ports, not Prisma.

## Goal

Add CSV import repository port.

## Files to Create

```txt
apps/api/src/modules/csv-import/application/ports/csv-import-repository.port.ts
```

## Requirements

Create port:

```ts
import { CsvImport, CsvImportPreviewRow, CsvImportRowError } from '../../domain/types'

export const CSV_IMPORT_REPOSITORY = Symbol('CSV_IMPORT_REPOSITORY')

export type CreateCsvImportInput = {
  userId: string
  deckId: string
  totalRows: number
  validRows: number
  invalidRows: number
  previewRows: CsvImportPreviewRow[]
  errors: CsvImportRowError[]
  expiresAt: Date
}

export type CsvImportRepositoryPort = {
  create(input: CreateCsvImportInput): Promise<CsvImport>
  findById(importId: string): Promise<CsvImport | null>
  markConfirmed(importId: string, confirmedAt: Date): Promise<CsvImport>
  markExpired(importId: string): Promise<CsvImport>
}
```

## Security Requirements

```txt
- Repository can return import data only to use cases.
- Use cases must enforce user/deck permissions.
```

## Architecture Constraints

```txt
- Port must not import Prisma.
- Port must not import GraphQL decorators.
```

## Acceptance Criteria

```txt
- CsvImportRepositoryPort exists.
- Port is framework-independent.
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
chore(csv): add CSV import repository port
```

---

# TASK-08.06 Add Prisma CSV import repository

## Status

TODO

## Context

CSV import preview and confirmation data should be persisted through Prisma infrastructure.

## Goal

Add Prisma implementation of `CsvImportRepositoryPort`.

## Files to Create

```txt
apps/api/src/modules/csv-import/infrastructure/persistence/prisma-csv-import.repository.ts
apps/api/src/modules/csv-import/infrastructure/mappers/csv-import.mapper.ts
```

## Files to Modify

```txt
apps/api/src/modules/csv-import/csv-import.module.ts
```

## Requirements

Implement:

```txt
create
findById
markConfirmed
markExpired
```

Mapper:

```ts
toCsvImport(prismaCsvImport): CsvImport
```

JSON fields:

```txt
previewRows
errors
```

should be mapped safely to domain types.

`markConfirmed`:

```txt
status = CONFIRMED
confirmedAt = provided date
```

`markExpired`:

```txt
status = EXPIRED
```

## Security Requirements

```txt
- Repository does not decide user permissions.
- Use cases enforce import ownership.
```

## Architecture Constraints

```txt
- Prisma repository lives in infrastructure.
- Use cases depend on CsvImportRepositoryPort.
- Resolver must not use repository directly.
```

## Acceptance Criteria

```txt
- PrismaCsvImportRepository exists.
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
chore(csv): add Prisma CSV import repository
```

---

# TASK-08.07 Add CSV import GraphQL types and inputs

## Status

TODO

## Context

GraphQL needs safe types and inputs for CSV preview and confirmation.

## Goal

Add CSV import GraphQL types and inputs.

## Files to Create

```txt
apps/api/src/modules/csv-import/presentation/graphql/types/csv-import-row-error.type.ts
apps/api/src/modules/csv-import/presentation/graphql/types/csv-import-preview-row.type.ts
apps/api/src/modules/csv-import/presentation/graphql/types/csv-import.type.ts
apps/api/src/modules/csv-import/presentation/graphql/types/csv-import-status.type.ts

apps/api/src/modules/csv-import/presentation/graphql/inputs/preview-csv-import.input.ts
apps/api/src/modules/csv-import/presentation/graphql/inputs/confirm-csv-import.input.ts
```

## Requirements

Inputs:

```txt
PreviewCsvImportInput:
- deckId
- csvText

ConfirmCsvImportInput:
- importId
```

Types:

```txt
CsvImportRowErrorType:
- rowNumber
- field
- message

CsvImportPreviewRowType:
- rowNumber
- front
- back
- example
- notes
- isValid
- errors

CsvImportType:
- id
- deckId
- status
- totalRows
- validRows
- invalidRows
- previewRows
- errors
- createdAt
- confirmedAt
- expiresAt
```

Do not expose:

```txt
userId
updatedAt
```

unless needed.

## Security Requirements

```txt
- Do not expose imports belonging to other users.
- Resolver/use case must enforce ownership.
```

## Architecture Constraints

```txt
- GraphQL types live in presentation layer.
- No business logic in GraphQL types.
```

## Acceptance Criteria

```txt
- CSV import GraphQL types exist.
- CSV import inputs exist.
- Sensitive/internal fields are not exposed unnecessarily.
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
chore(csv): add CSV import GraphQL types
```

---

# TASK-08.08 Add PreviewCsvImportUseCase

## Status

TODO

## Context

Preview validates CSV rows and stores a pending import.

It must not create cards.

## Goal

Add `PreviewCsvImportUseCase`.

## Files to Create

```txt
apps/api/src/modules/csv-import/application/use-cases/preview-csv-import.use-case.ts
```

## Files to Modify

```txt
apps/api/src/modules/csv-import/csv-import.module.ts
```

## Requirements

Input:

```ts
export type PreviewCsvImportUseCaseInput = {
  currentUser: AuthUser
  deckId: string
  csvText: string
}
```

Output:

```ts
export type PreviewCsvImportUseCaseResult = CsvImport
```

Use case must:

```txt
1. Validate authenticated user exists.
2. Reject blocked user.
3. Load deck.
4. If missing/deleted, throw DECK_NOT_FOUND.
5. Check DeckPermissionService.canManageDeck.
6. If forbidden, throw DECK_FORBIDDEN.
7. Parse CSV text with CsvParserService.
8. Store CsvImport with status PENDING.
9. Return preview import.
```

Expiry:

```txt
expiresAt = now + 24 hours
```

Important:

```txt
Preview must not create cards.
```

## Security Requirements

```txt
- Only deck owner can preview import.
- Do not log full CSV content.
- Do not create cards during preview.
```

## Architecture Constraints

```txt
- Use case depends on ports/services.
- Use case must not import Prisma.
- Use case must not import GraphQL decorators.
```

## Acceptance Criteria

```txt
- PreviewCsvImportUseCase exists.
- Owner can preview CSV import.
- Non-owner cannot preview CSV import.
- Invalid rows are reported.
- Preview does not create cards.
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
feat(csv): add CSV import preview use case
```

---

# TASK-08.09 Add previewCsvImport mutation

## Status

TODO

## Context

Frontend needs a mutation to preview CSV import.

## Goal

Add protected `previewCsvImport` mutation.

## Files to Create

```txt
apps/api/src/modules/csv-import/presentation/graphql/resolvers/csv-import.resolver.ts
```

## Files to Modify

```txt
apps/api/src/modules/csv-import/csv-import.module.ts
```

## Requirements

Add mutation:

```graphql
previewCsvImport(input: PreviewCsvImportInput!): CsvImportType!
```

Mutation must:

```txt
- require GqlAuthGuard
- use CurrentUser
- call PreviewCsvImportUseCase
- return preview import
```

Resolver must not:

```txt
- parse CSV directly
- create cards
- query Prisma
- check owner directly
```

## Security Requirements

```txt
- Must require auth.
- Must not allow importing into another user's deck.
```

## Acceptance Criteria

```txt
- previewCsvImport mutation exists.
- Mutation requires auth.
- Owner can preview CSV.
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
feat(csv): add CSV import preview mutation
```

---

# TASK-08.10 Add ConfirmCsvImportUseCase

## Status

TODO

## Context

After preview, user confirms import and backend creates cards.

## Goal

Add `ConfirmCsvImportUseCase`.

## Files to Create

```txt
apps/api/src/modules/csv-import/application/use-cases/confirm-csv-import.use-case.ts
```

## Files to Modify

```txt
apps/api/src/modules/csv-import/csv-import.module.ts
```

## Requirements

Input:

```ts
export type ConfirmCsvImportUseCaseInput = {
  currentUser: AuthUser
  importId: string
}
```

Output:

```ts
export type ConfirmCsvImportUseCaseResult = {
  import: CsvImport
  createdCardsCount: number
}
```

Use case must:

```txt
1. Validate authenticated user exists.
2. Reject blocked user.
3. Load CsvImport by id.
4. If missing, reject.
5. Check import belongs to current user.
6. Check import status is PENDING.
7. Check import is not expired.
8. Load deck.
9. Check DeckPermissionService.canManageDeck.
10. Use only valid preview rows.
11. Create cards from valid rows.
12. Mark import CONFIRMED.
13. Return import and createdCardsCount.
```

Card positions:

```txt
- If deck already has cards, append imported cards after existing cards.
- Preserve CSV row order.
```

If import has zero valid rows:

```txt
- reject confirmation
- do not create cards
```

## Security Requirements

```txt
- User can confirm only own import.
- User can import only into own/manageable deck.
- Expired import cannot be confirmed.
- Confirmed import cannot be confirmed again.
```

## Architecture Constraints

```txt
- Use case depends on ports/services.
- Use case must not import Prisma.
- Use case must not import GraphQL decorators.
```

## Acceptance Criteria

```txt
- ConfirmCsvImportUseCase exists.
- Owner can confirm own pending import.
- Non-owner cannot confirm.
- Expired import is rejected.
- Confirmed import cannot be reused.
- Valid rows create cards.
- Invalid rows do not create cards.
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
feat(csv): add CSV import confirm use case
```

---

# TASK-08.11 Add confirmCsvImport mutation

## Status

TODO

## Context

Frontend needs a mutation to confirm CSV import.

## Goal

Add protected `confirmCsvImport` mutation.

## Files to Create

```txt
apps/api/src/modules/csv-import/presentation/graphql/types/confirm-csv-import-payload.type.ts
```

## Files to Modify

```txt
apps/api/src/modules/csv-import/presentation/graphql/resolvers/csv-import.resolver.ts
apps/api/src/modules/csv-import/csv-import.module.ts
```

## Requirements

Create payload:

```txt
ConfirmCsvImportPayloadType:
- import: CsvImportType!
- createdCardsCount: Int!
```

Add mutation:

```graphql
confirmCsvImport(input: ConfirmCsvImportInput!): ConfirmCsvImportPayloadType!
```

Mutation must:

```txt
- require GqlAuthGuard
- use CurrentUser
- call ConfirmCsvImportUseCase
- return payload
```

Resolver must not:

```txt
- query Prisma
- create cards directly
- check owner directly
```

## Security Requirements

```txt
- Must require auth.
- Must not allow confirming another user's import.
```

## Acceptance Criteria

```txt
- confirmCsvImport mutation exists.
- Mutation requires auth.
- Owner can confirm own pending import.
- Created card count is returned.
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
feat(csv): add CSV import confirm mutation
```

---

# TASK-08.12 Add CSV import final checks

## Status

TODO

## Context

CSV import touches user content and must be permission-safe.

## Goal

Run final checks for CSV import.

## Manual GraphQL Checks

Verify:

```txt
- previewCsvImport requires auth
- previewCsvImport owner works
- previewCsvImport non-owner fails
- previewCsvImport validates missing required headers
- previewCsvImport validates missing front/back
- previewCsvImport validates row limits
- previewCsvImport does not create cards
- confirmCsvImport requires auth
- confirmCsvImport owner works
- confirmCsvImport non-owner fails
- confirmCsvImport creates cards from valid rows
- confirmCsvImport skips invalid rows
- confirmCsvImport cannot be reused
- confirmCsvImport rejects expired import
```

## Security Checks

Verify:

```txt
- Full CSV text is not logged.
- CSV is not written to disk.
- Preview does not create cards.
- User can import only into own/manageable deck.
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
- Do not move to AI examples until CSV checks pass.
- Do not add file storage for MVP CSV.
- Do not expose another user's imports.
```

## Acceptance Criteria

```txt
- CSV preview works.
- CSV confirmation works.
- Owner-only permission works.
- Preview does not create cards.
- Confirm creates cards only once.
- Invalid rows are handled safely.
- Format check passes.
- Lint passes.
- Prisma validate passes.
- API build passes.
- git status is clean after commit.
```

## Expected Commit Message

```txt
chore(csv): finalize CSV import
```

---

## Epic Completion Criteria

EPIC-08 is complete when:

```txt
- CsvImport Prisma schema exists.
- CsvImportModule exists.
- CSV import domain types exist.
- CSV parser service exists.
- CsvImportRepositoryPort exists.
- Prisma CSV import repository exists.
- CSV import GraphQL types exist.
- PreviewCsvImportUseCase exists.
- previewCsvImport mutation works.
- ConfirmCsvImportUseCase exists.
- confirmCsvImport mutation works.
- Preview does not create cards.
- Confirm creates cards.
- Owner-only permissions are enforced.
- CSV limits are enforced.
- implementation follows docs/domain/permissions.md.
- implementation follows docs/security/security-checklist.md.
```

After this epic is complete, move to:

```txt
docs/tasks/09-ai-examples.md
```
