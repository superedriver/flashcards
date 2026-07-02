# EPIC-09 AI Examples

## Epic Goal

Implement backend AI-generated examples for cards.

This epic covers:

```txt
- AI provider abstraction
- mock AI provider for local development
- Gemini provider integration
- generating example sentences for cards
- previewing generated examples
- saving selected example to card
- owner-only AI permissions
- AI request logging with safe previews
```

AI generation must be backend-only.

Frontend must never call AI providers directly.

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
docs/tasks/08-csv-import.md
```

Expected state:

```txt
- Deck/Card Prisma schema exists.
- DecksModule exists.
- DeckRepositoryPort exists.
- CardRepositoryPort exists.
- DeckPermissionService exists.
- Card CRUD works.
- Auth guard works.
- CurrentUser decorator works.
```

## Epic Rules

```txt
1. Follow docs/domain/permissions.md exactly.
2. Follow docs/security/security-checklist.md exactly.
3. AI provider calls happen only on backend.
4. Frontend must not receive AI provider API keys.
5. User must own/manage the card's deck to generate examples.
6. Public deck viewers cannot generate examples for someone else's card.
7. Group viewers cannot generate examples for shared decks.
8. AI generation must not auto-save to card.
9. User must explicitly save a selected generated example.
10. Do not put business logic in GraphQL resolvers.
11. Do not access Prisma directly from GraphQL resolvers.
12. Log safe metadata only.
```

## MVP AI Provider Strategy

MVP providers:

```txt
mock
gemini
```

Default local provider:

```txt
mock
```

Production provider:

```txt
gemini
```

Configured with:

```txt
AI_PROVIDER=mock
AI_API_KEY=
```

or:

```txt
AI_PROVIDER=gemini
AI_API_KEY=<provider-key>
```

## AI Feature Scope

MVP supports:

```txt
- generating example sentences for one card
- returning multiple candidate examples
- saving one selected example to card.example
```

MVP does not support:

```txt
- generating whole decks
- generating translations
- generating cards from documents
- audio generation
- image generation
- direct frontend AI provider calls
```

## Safe Logging Rule

AI logs may store:

```txt
provider
feature
status
cardId
deckId
userId
promptPreview
outputPreview
errorMessage
createdAt
```

AI logs must not store:

```txt
AI_API_KEY
raw provider secret
unbounded full prompt
unbounded full output
access token
refresh token
password
```

Preview length limit:

```txt
promptPreview max = 500 characters
outputPreview max = 1000 characters
```

## Epic Summary

```md
- [x] TASK-09.01 Add AI Prisma schema
- [x] TASK-09.02 Add AI module skeleton
- [x] TASK-09.03 Add AI domain types
- [x] TASK-09.04 Add AI provider port
- [x] TASK-09.05 Add mock AI provider
- [x] TASK-09.06 Add Gemini AI provider
- [x] TASK-09.07 Add AI log repository port
- [x] TASK-09.08 Add Prisma AI log repository
- [x] TASK-09.09 Add AI prompt builder
- [x] TASK-09.10 Add AI GraphQL types and inputs
- [ ] TASK-09.11 Add GenerateCardExamplesUseCase
- [ ] TASK-09.12 Add generateCardExamples mutation
- [ ] TASK-09.13 Add SaveGeneratedCardExampleUseCase
- [ ] TASK-09.14 Add saveGeneratedCardExample mutation
- [ ] TASK-09.15 Add AI examples final checks
```

---

# TASK-09.01 Add AI Prisma schema

## Status

DONE

## Context

AI requests should be logged safely for debugging, analytics, and abuse monitoring.

Logs must store only safe previews, not secrets or unbounded prompt/output text.

## Goal

Add AI request log model.

## Files to Modify

```txt
apps/api/prisma/schema.prisma
```

## Requirements

Add relation to `User`:

```prisma
aiRequestLogs AiRequestLog[]
```

Add relation to `Deck`:

```prisma
aiRequestLogs AiRequestLog[]
```

Add relation to `Card`:

```prisma
aiRequestLogs AiRequestLog[]
```

Add enum:

```prisma
enum AiProvider {
  MOCK
  GEMINI
}

enum AiRequestStatus {
  SUCCESS
  FAILED
}
```

Add model:

```prisma
model AiRequestLog {
  id            String          @id @default(uuid())
  userId        String
  deckId        String
  cardId        String
  provider      AiProvider
  feature       String
  status        AiRequestStatus
  promptPreview String?
  outputPreview String?
  errorMessage  String?

  createdAt     DateTime        @default(now())

  user          User            @relation(fields: [userId], references: [id], onDelete: Cascade)
  deck          Deck            @relation(fields: [deckId], references: [id], onDelete: Cascade)
  card          Card            @relation(fields: [cardId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([deckId])
  @@index([cardId])
  @@index([provider])
  @@index([status])
  @@index([createdAt])
}
```

## Security Requirements

```txt
- Do not store AI_API_KEY.
- Do not store access token.
- Do not store refresh token.
- Do not store passwords.
- Store promptPreview only, not full unbounded prompt.
- Store outputPreview only, not full unbounded output.
```

## Architecture Constraints

```txt
- This task only changes persistence schema.
- Do not implement AI provider yet.
- Do not implement GraphQL yet.
```

## Acceptance Criteria

```txt
- AiProvider enum exists.
- AiRequestStatus enum exists.
- AiRequestLog model exists.
- User relation exists.
- Deck relation exists.
- Card relation exists.
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
chore(db): add AI request log schema
```

---

# TASK-09.02 Add AI module skeleton

## Status

DONE

## Context

AI generation should live in a dedicated backend module.

## Goal

Create AI module folder structure.

## Files to Create

```txt
apps/api/src/modules/ai/ai.module.ts

apps/api/src/modules/ai/domain/.gitkeep
apps/api/src/modules/ai/domain/types/.gitkeep
apps/api/src/modules/ai/domain/services/.gitkeep

apps/api/src/modules/ai/application/.gitkeep
apps/api/src/modules/ai/application/ports/.gitkeep
apps/api/src/modules/ai/application/use-cases/.gitkeep

apps/api/src/modules/ai/infrastructure/.gitkeep
apps/api/src/modules/ai/infrastructure/providers/.gitkeep
apps/api/src/modules/ai/infrastructure/persistence/.gitkeep
apps/api/src/modules/ai/infrastructure/mappers/.gitkeep

apps/api/src/modules/ai/presentation/.gitkeep
apps/api/src/modules/ai/presentation/graphql/.gitkeep
apps/api/src/modules/ai/presentation/graphql/inputs/.gitkeep
apps/api/src/modules/ai/presentation/graphql/types/.gitkeep
apps/api/src/modules/ai/presentation/graphql/resolvers/.gitkeep
```

## Files to Modify

```txt
apps/api/src/app.module.ts
```

## Requirements

Create `AiModule`:

```ts
import { Module } from '@nestjs/common'

@Module({})
export class AiModule {}
```

Import `AiModule` into `AppModule`.

## Architecture Constraints

```txt
- Keep module empty for now.
- Do not implement business logic in this task.
```

## Acceptance Criteria

```txt
- AiModule exists.
- AiModule is imported into AppModule.
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
chore(ai): add AI module skeleton
```

---

# TASK-09.03 Add AI domain types

## Status

DONE

## Context

AI use cases need framework-independent types.

## Goal

Add AI domain types.

## Files to Create

```txt
apps/api/src/modules/ai/domain/types/ai-provider.type.ts
apps/api/src/modules/ai/domain/types/ai-request-status.type.ts
apps/api/src/modules/ai/domain/types/generated-card-example.type.ts
apps/api/src/modules/ai/domain/types/ai-request-log.type.ts
apps/api/src/modules/ai/domain/types/index.ts
```

## Requirements

Create `AiProvider`:

```ts
export type AiProvider = 'MOCK' | 'GEMINI'
```

Create `AiRequestStatus`:

```ts
export type AiRequestStatus = 'SUCCESS' | 'FAILED'
```

Create `GeneratedCardExample`:

```ts
export type GeneratedCardExample = {
  text: string
}
```

Create `AiRequestLog`:

```ts
import { AiProvider } from './ai-provider.type'
import { AiRequestStatus } from './ai-request-status.type'

export type AiRequestLog = {
  id: string
  userId: string
  deckId: string
  cardId: string
  provider: AiProvider
  feature: string
  status: AiRequestStatus
  promptPreview: string | null
  outputPreview: string | null
  errorMessage: string | null
  createdAt: Date
}
```

## Security Requirements

```txt
- Types must not include provider API keys.
- Types must not include access tokens.
- Types must not include refresh tokens.
```

## Architecture Constraints

```txt
- Types must not import Prisma.
- Types must not import GraphQL decorators.
- Types must not import NestJS.
```

## Acceptance Criteria

```txt
- AI provider type exists.
- AI request status type exists.
- GeneratedCardExample type exists.
- AiRequestLog type exists.
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
chore(ai): add AI domain types
```

---

# TASK-09.04 Add AI provider port

## Status

DONE

## Context

AI providers must be abstracted so Gemini can be swapped with mock/local providers.

## Goal

Add AI provider port.

## Files to Create

```txt
apps/api/src/modules/ai/application/ports/ai-provider.port.ts
```

## Requirements

Create port:

```ts
import { GeneratedCardExample } from '../../domain/types'

export const AI_PROVIDER = Symbol('AI_PROVIDER')

export type GenerateCardExamplesInput = {
  front: string
  back: string
  existingExample?: string | null
  notes?: string | null
  locale?: string | null
}

export type GenerateCardExamplesResult = {
  examples: GeneratedCardExample[]
  rawOutputPreview: string | null
}

export type AiProviderPort = {
  generateCardExamples(input: GenerateCardExamplesInput): Promise<GenerateCardExamplesResult>
}
```

## Security Requirements

```txt
- Provider port must not expose API keys.
- Provider port must not depend on frontend env.
```

## Architecture Constraints

```txt
- Port lives in application layer.
- Port must not import Prisma.
- Port must not import GraphQL decorators.
- Use cases depend on AiProviderPort.
```

## Acceptance Criteria

```txt
- AiProviderPort exists.
- GenerateCardExamplesInput exists.
- GenerateCardExamplesResult exists.
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
chore(ai): add AI provider port
```

---

# TASK-09.05 Add mock AI provider

## Status

DONE

## Context

Local development should work without a real AI provider API key.

## Goal

Add mock AI provider.

## Files to Create

```txt
apps/api/src/modules/ai/infrastructure/providers/mock-ai.provider.ts
```

## Files to Modify

```txt
apps/api/src/modules/ai/ai.module.ts
```

## Requirements

Create `MockAiProvider` implementing `AiProviderPort`.

Behavior:

```txt
- return 3 deterministic example sentences
- use the card front/back in the examples
- do not call external services
```

Example output shape:

```ts
{
  examples: [
    { text: `Example with ${input.front}: ...` },
    { text: `Another example for ${input.back}: ...` },
    { text: `Practice sentence: ...` },
  ],
  rawOutputPreview: 'mock output'
}
```

Register it as `AI_PROVIDER` when:

```txt
AI_PROVIDER=mock
```

For early MVP, it is acceptable to register mock provider unconditionally until Gemini provider is added.

## Security Requirements

```txt
- No external API calls.
- No API keys required.
- Do not log sensitive data.
```

## Architecture Constraints

```txt
- Mock provider lives in infrastructure.
- Use cases depend on AiProviderPort.
```

## Acceptance Criteria

```txt
- MockAiProvider exists.
- MockAiProvider implements AiProviderPort.
- Provider can be registered.
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
chore(ai): add mock AI provider
```

---

# TASK-09.06 Add Gemini AI provider

## Status

DONE

## Context

Gemini is the first real AI provider for MVP.

The backend calls Gemini through infrastructure provider code.

## Goal

Add Gemini AI provider implementation.

## Files to Create

```txt
apps/api/src/modules/ai/infrastructure/providers/gemini-ai.provider.ts
```

## Files to Modify

```txt
apps/api/src/modules/ai/ai.module.ts
apps/api/src/config/ai.config.ts
apps/api/package.json
```

## Requirements

Use official or simple HTTP client approach.

If adding package:

```bash
pnpm --filter @flashcards/api add @google/generative-ai
```

Provider must:

```txt
1. Read AI_API_KEY from backend config.
2. Build prompt from input.
3. Call Gemini.
4. Parse examples from response.
5. Return GeneratedCardExample[].
6. Return rawOutputPreview with length limit.
```

Provider should return 3 examples.

If provider fails:

```txt
- throw application error
- do not expose API key
- do not log full provider response
```

Provider selection:

```txt
AI_PROVIDER=mock -> MockAiProvider
AI_PROVIDER=gemini -> GeminiAiProvider
```

## Security Requirements

```txt
- AI_API_KEY must never be exposed to frontend.
- AI_API_KEY must never be logged.
- Do not store full unbounded prompt/output.
- Prompt/output previews must be length-limited.
```

## Architecture Constraints

```txt
- Gemini provider lives in infrastructure.
- Use cases depend on AiProviderPort.
- No GraphQL decorators in provider.
```

## Do Not Do

```txt
- Do not call Gemini from frontend.
- Do not hardcode API key.
- Do not auto-save generated examples.
```

## Acceptance Criteria

```txt
- GeminiAiProvider exists.
- Provider reads AI_API_KEY from config.
- Provider selection supports mock/gemini.
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
feat(ai): add Gemini provider
```

---

# TASK-09.07 Add AI log repository port

## Status

DONE

## Context

AI requests should be logged with safe previews.

Use cases must depend on repository ports, not Prisma.

## Goal

Add AI log repository port.

## Files to Create

```txt
apps/api/src/modules/ai/application/ports/ai-request-log-repository.port.ts
```

## Requirements

Create port:

```ts
import { AiProvider, AiRequestLog, AiRequestStatus } from '../../domain/types'

export const AI_REQUEST_LOG_REPOSITORY = Symbol('AI_REQUEST_LOG_REPOSITORY')

export type CreateAiRequestLogInput = {
  userId: string
  deckId: string
  cardId: string
  provider: AiProvider
  feature: string
  status: AiRequestStatus
  promptPreview?: string | null
  outputPreview?: string | null
  errorMessage?: string | null
}

export type AiRequestLogRepositoryPort = {
  create(input: CreateAiRequestLogInput): Promise<AiRequestLog>
}
```

## Security Requirements

```txt
- Port must not include API key.
- Port must not include raw access/refresh tokens.
- Use case must pass safe previews only.
```

## Architecture Constraints

```txt
- Port lives in application layer.
- Port must not import Prisma.
- Port must not import GraphQL decorators.
```

## Acceptance Criteria

```txt
- AiRequestLogRepositoryPort exists.
- CreateAiRequestLogInput exists.
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
chore(ai): add AI request log repository port
```

---

# TASK-09.08 Add Prisma AI log repository

## Status

DONE

## Context

AI request logs should be persisted through Prisma infrastructure.

## Goal

Add Prisma implementation of `AiRequestLogRepositoryPort`.

## Files to Create

```txt
apps/api/src/modules/ai/infrastructure/persistence/prisma-ai-request-log.repository.ts
apps/api/src/modules/ai/infrastructure/mappers/ai-request-log.mapper.ts
```

## Files to Modify

```txt
apps/api/src/modules/ai/ai.module.ts
```

## Requirements

Implement:

```txt
create
```

Mapper:

```ts
toAiRequestLog(prismaAiRequestLog): AiRequestLog
```

Ensure preview values are length-limited before storing.

Recommended limits:

```txt
promptPreview max = 500 characters
outputPreview max = 1000 characters
errorMessage max = 1000 characters
```

## Security Requirements

```txt
- Do not store AI_API_KEY.
- Do not store full unbounded prompt/output.
- Do not store access/refresh tokens.
```

## Architecture Constraints

```txt
- Prisma repository lives in infrastructure.
- Use cases depend on AiRequestLogRepositoryPort.
- Resolver must not use repository directly.
```

## Acceptance Criteria

```txt
- PrismaAiRequestLogRepository exists.
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
chore(ai): add Prisma AI request log repository
```

---

# TASK-09.09 Add AI prompt builder

## Status

DONE

## Context

Prompt construction should be centralized and testable.

## Goal

Add prompt builder service.

## Files to Create

```txt
apps/api/src/modules/ai/domain/services/card-example-prompt.service.ts
```

## Requirements

Create `CardExamplePromptService`.

Input:

```ts
export type BuildCardExamplePromptInput = {
  front: string
  back: string
  existingExample?: string | null
  notes?: string | null
  locale?: string | null
}
```

Output:

```ts
export type BuildCardExamplePromptResult = {
  prompt: string
}
```

Prompt should ask provider to generate:

```txt
- 3 concise example sentences
- clear context
- no markdown
- no numbering if possible
- examples suitable for flashcard learning
```

The prompt should include:

```txt
front
back
existing example if available
notes if available
locale/language preference if available
```

## Security Requirements

```txt
- Do not include user auth tokens.
- Do not include secrets.
- Keep prompt bounded.
```

## Architecture Constraints

```txt
- Service must not import Prisma.
- Service must not import GraphQL decorators.
- Service must not import NestJS.
```

## Acceptance Criteria

```txt
- Prompt builder exists.
- Prompt includes card front/back.
- Prompt is bounded.
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
chore(ai): add card example prompt builder
```

---

# TASK-09.10 Add AI GraphQL types and inputs

## Status

DONE

## Context

GraphQL needs safe inputs and outputs for AI example generation.

## Goal

Add AI GraphQL types and inputs.

## Files to Create

```txt
apps/api/src/modules/ai/presentation/graphql/types/generated-card-example.type.ts
apps/api/src/modules/ai/presentation/graphql/types/generate-card-examples-payload.type.ts
apps/api/src/modules/ai/presentation/graphql/types/save-generated-card-example-payload.type.ts

apps/api/src/modules/ai/presentation/graphql/inputs/generate-card-examples.input.ts
apps/api/src/modules/ai/presentation/graphql/inputs/save-generated-card-example.input.ts
```

## Requirements

Inputs:

```txt
GenerateCardExamplesInput:
- cardId
- locale optional nullable

SaveGeneratedCardExampleInput:
- cardId
- exampleText
```

Types:

```txt
GeneratedCardExampleType:
- text

GenerateCardExamplesPayloadType:
- cardId
- examples

SaveGeneratedCardExamplePayloadType:
- card
```

## Security Requirements

```txt
- Do not expose AI provider API key.
- Do not expose AI request logs in normal user mutation output.
- Do not expose internal prompt by default.
```

## Architecture Constraints

```txt
- GraphQL types live in presentation layer.
- No business logic in GraphQL types.
```

## Acceptance Criteria

```txt
- AI GraphQL inputs exist.
- AI GraphQL output types exist.
- Sensitive provider data is not exposed.
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
chore(ai): add AI GraphQL types
```

---

# TASK-09.11 Add GenerateCardExamplesUseCase

## Status

TODO

## Context

Users can generate example candidates for cards they own/manage.

Generation must not auto-save to the card.

## Goal

Add `GenerateCardExamplesUseCase`.

## Files to Create

```txt
apps/api/src/modules/ai/application/use-cases/generate-card-examples.use-case.ts
```

## Files to Modify

```txt
apps/api/src/modules/ai/ai.module.ts
```

## Requirements

Input:

```ts
export type GenerateCardExamplesUseCaseInput = {
  currentUser: AuthUser
  cardId: string
  locale?: string | null
}
```

Output:

```ts
export type GenerateCardExamplesUseCaseResult = {
  cardId: string
  examples: GeneratedCardExample[]
}
```

Use case must:

```txt
1. Validate authenticated user exists.
2. Reject blocked user.
3. Load card.
4. If missing/deleted, throw CARD_NOT_FOUND.
5. Load card deck.
6. If deck missing/deleted, throw DECK_NOT_FOUND.
7. Check DeckPermissionService.canManageCard.
8. If forbidden, throw CARD_FORBIDDEN.
9. Build prompt/input for AI provider.
10. Call AiProviderPort.generateCardExamples.
11. Log safe success AI request.
12. Return examples.
```

If AI provider fails:

```txt
- log safe failed AI request
- return application error
- do not expose API key or raw provider internals
```

## Security Requirements

```txt
- Only deck owner/manager can generate examples.
- Public deck viewers cannot generate examples.
- Do not auto-save generated examples.
- Do not expose API key.
- Do not log full unbounded prompt/output.
```

## Architecture Constraints

```txt
- Use case depends on ports/services.
- Use case must not import Prisma.
- Use case must not import GraphQL decorators.
- Use case must not call Gemini directly.
```

## Acceptance Criteria

```txt
- GenerateCardExamplesUseCase exists.
- Owner can generate examples.
- Non-owner cannot generate examples.
- Generated examples are not auto-saved.
- AI request is logged safely.
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
feat(ai): add generate card examples use case
```

---

# TASK-09.12 Add generateCardExamples mutation

## Status

TODO

## Context

Frontend needs a mutation to generate AI examples for a card.

## Goal

Add protected `generateCardExamples` mutation.

## Files to Create

```txt
apps/api/src/modules/ai/presentation/graphql/resolvers/ai.resolver.ts
```

## Files to Modify

```txt
apps/api/src/modules/ai/ai.module.ts
```

## Requirements

Add mutation:

```graphql
generateCardExamples(input: GenerateCardExamplesInput!): GenerateCardExamplesPayloadType!
```

Mutation must:

```txt
- require GqlAuthGuard
- use CurrentUser
- call GenerateCardExamplesUseCase
- return generated examples
```

Resolver must not:

```txt
- call AI provider directly
- query Prisma
- check owner directly
- save example automatically
```

## Security Requirements

```txt
- Must require auth.
- Must not expose provider API key.
- Must not allow generation for another user's private deck.
```

## Acceptance Criteria

```txt
- generateCardExamples mutation exists.
- Mutation requires auth.
- Owner can generate examples.
- Non-owner is rejected.
- Generated examples are not auto-saved.
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
feat(ai): add generate card examples mutation
```

---

# TASK-09.13 Add SaveGeneratedCardExampleUseCase

## Status

TODO

## Context

Generated examples are suggestions only.

User must explicitly save one selected example to the card.

## Goal

Add `SaveGeneratedCardExampleUseCase`.

## Files to Create

```txt
apps/api/src/modules/ai/application/use-cases/save-generated-card-example.use-case.ts
```

## Files to Modify

```txt
apps/api/src/modules/ai/ai.module.ts
```

## Requirements

Input:

```ts
export type SaveGeneratedCardExampleUseCaseInput = {
  currentUser: AuthUser
  cardId: string
  exampleText: string
}
```

Output:

```ts
export type SaveGeneratedCardExampleUseCaseResult = {
  card: Card
}
```

Use case must:

```txt
1. Validate authenticated user exists.
2. Reject blocked user.
3. Load card.
4. If missing/deleted, throw CARD_NOT_FOUND.
5. Load card deck.
6. If deck missing/deleted, throw DECK_NOT_FOUND.
7. Check DeckPermissionService.canManageCard.
8. If forbidden, throw CARD_FORBIDDEN.
9. Validate exampleText.
10. Update card.example.
11. Return updated card.
```

Validation:

```txt
exampleText:
- required
- trim
- min 1 character
- max 4000 characters
```

## Security Requirements

```txt
- Only deck owner/manager can save example.
- User cannot update another user's card.
- Do not trust frontend ownership.
```

## Architecture Constraints

```txt
- Use case depends on card/deck repository ports and DeckPermissionService.
- Use case must not import Prisma.
- Use case must not import GraphQL decorators.
```

## Acceptance Criteria

```txt
- SaveGeneratedCardExampleUseCase exists.
- Owner can save selected example.
- Non-owner cannot save selected example.
- exampleText validation works.
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
feat(ai): add save generated card example use case
```

---

# TASK-09.14 Add saveGeneratedCardExample mutation

## Status

TODO

## Context

Frontend needs a mutation to save a selected generated example.

## Goal

Add protected `saveGeneratedCardExample` mutation.

## Files to Modify

```txt
apps/api/src/modules/ai/presentation/graphql/resolvers/ai.resolver.ts
apps/api/src/modules/ai/ai.module.ts
```

## Requirements

Add mutation:

```graphql
saveGeneratedCardExample(input: SaveGeneratedCardExampleInput!): SaveGeneratedCardExamplePayloadType!
```

Mutation must:

```txt
- require GqlAuthGuard
- use CurrentUser
- call SaveGeneratedCardExampleUseCase
- return updated card
```

Resolver must not:

```txt
- query Prisma
- check owner directly
- call AI provider
```

## Security Requirements

```txt
- Must require auth.
- Must not allow saving to another user's card.
```

## Acceptance Criteria

```txt
- saveGeneratedCardExample mutation exists.
- Mutation requires auth.
- Owner can save example.
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
feat(ai): add save generated card example mutation
```

---

# TASK-09.15 Add AI examples final checks

## Status

TODO

## Context

AI examples touch user content, permissions, and external provider secrets.

## Goal

Run final checks for AI examples.

## Manual GraphQL Checks

Verify:

```txt
- generateCardExamples requires auth
- generateCardExamples works for card owner
- generateCardExamples fails for non-owner
- generateCardExamples does not auto-save card.example
- saveGeneratedCardExample requires auth
- saveGeneratedCardExample works for card owner
- saveGeneratedCardExample fails for non-owner
- saveGeneratedCardExample validates exampleText
- mock provider works without AI_API_KEY
- Gemini provider does not expose AI_API_KEY
```

## Security Checks

Verify:

```txt
- Frontend does not call AI provider directly.
- AI_API_KEY is not exposed through GraphQL.
- AI_API_KEY is not stored in database.
- AI_API_KEY is not logged.
- AI request logs store safe previews only.
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
- Do not move to groups until AI checks pass.
- Do not expose provider secrets for frontend convenience.
- Do not auto-save generated examples.
```

## Acceptance Criteria

```txt
- AI generation works with mock provider.
- Gemini provider is implemented/configurable.
- Owner-only permissions work.
- Generated examples are not auto-saved.
- Saving selected example works.
- AI logs are safe.
- Format check passes.
- Lint passes.
- Prisma validate passes.
- API build passes.
- git status is clean after commit.
```

## Expected Commit Message

```txt
chore(ai): finalize AI examples
```

---

## Epic Completion Criteria

EPIC-09 is complete when:

```txt
- AiRequestLog Prisma schema exists.
- AiModule exists.
- AI domain types exist.
- AiProviderPort exists.
- MockAiProvider exists.
- GeminiAiProvider exists.
- AiRequestLogRepositoryPort exists.
- Prisma AI request log repository exists.
- Card example prompt builder exists.
- AI GraphQL types exist.
- GenerateCardExamplesUseCase exists.
- generateCardExamples mutation works.
- SaveGeneratedCardExampleUseCase exists.
- saveGeneratedCardExample mutation works.
- AI generation is owner-only.
- AI does not auto-save generated content.
- AI provider secrets are not exposed.
- AI logs are safe.
- implementation follows docs/domain/permissions.md.
- implementation follows docs/security/security-checklist.md.
```

After this epic is complete, move to:

```txt
docs/tasks/10-groups-sharing.md
```
