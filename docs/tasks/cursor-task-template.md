# Cursor Task Template

Use this template when creating new implementation tasks for Flashcards.

Each task should be small enough to complete in one focused commit.

---

# TASK-XX.XX Task Title

## Status

TODO

## Context

Explain why this task exists.

Include the feature area, current state, and what problem this task solves.

Example:

```txt
The backend needs a use case for creating decks.
GraphQL resolvers must delegate business logic to application use cases.
```

## Goal

Describe the concrete outcome of this task.

Example:

```txt
Add CreateDeckUseCase and register it in the DecksModule.
```

## Related Documents

Cursor must read these documents before working on this task:

```txt
docs/architecture.md
docs/backend-clean-architecture.md
docs/domain/permissions.md
docs/security/security-checklist.md
```

Add task-specific documents when relevant:

```txt
docs/domain/auth-token-strategy.md
docs/domain/lesson-flow.md
docs/algorithms/sm-2.md
docs/tasks/05-decks-cards.md
```

## Files to Create

```txt
path/to/new-file.ts
path/to/another-new-file.ts
```

If no files need to be created, write:

```txt
None
```

## Files to Modify

```txt
path/to/existing-file.ts
path/to/another-existing-file.ts
```

If no files need to be modified, write:

```txt
None
```

## Requirements

List exactly what must be implemented.

Example:

```txt
1. Create use case input type.
2. Create use case result type.
3. Validate authenticated user.
4. Validate input fields.
5. Call repository port.
6. Return safe output.
```

Use code examples only when they reduce ambiguity.

Example:

```ts
export type CreateDeckUseCaseInput = {
  currentUser: AuthUser
  title: string
  description?: string | null
}
```

## Security Requirements

List security requirements explicitly.

Use this section even for simple tasks.

Example:

```txt
- Do not expose passwordHash.
- Do not expose refresh token hashes.
- Do not log access tokens.
- Do not log refresh tokens.
- Do not commit real secrets.
- Do not store auth tokens in localStorage or sessionStorage.
- Do not expose push token values.
```

For protected backend operations, include:

```txt
- Operation must require authenticated user.
- Blocked users must be rejected.
- Backend must enforce permissions.
- Frontend visibility is UX only and is not security.
```

## Architecture Constraints

List architectural rules explicitly.

Backend examples:

```txt
- GraphQL resolver must not access Prisma directly.
- GraphQL resolver must not contain business logic.
- Use case must not import GraphQL decorators.
- Use case must not import Prisma.
- Domain code must not import NestJS.
- Prisma code must stay in infrastructure.
- Use case must depend on ports, not concrete infrastructure classes.
```

Frontend examples:

```txt
- Use Apollo Client for GraphQL operations.
- Use generated GraphQL types/hooks when available.
- Do not call backend directly with fetch from screens.
- Do not store auth tokens in localStorage or sessionStorage.
- Do not expose backend secrets through EXPO_PUBLIC variables.
```

## Implementation Notes

Add practical guidance for Cursor.

Example:

```txt
- Keep this task focused.
- Do not refactor unrelated modules.
- Do not change schema unless this task explicitly asks for it.
- Do not change architecture decisions.
- Prefer small, readable files.
- Keep names consistent with existing modules.
```

## Acceptance Criteria

Define exactly how to know the task is complete.

Example:

```txt
- CreateDeckUseCase exists.
- Use case validates current user.
- Use case creates a deck through repository port.
- Resolver delegates to use case.
- Resolver does not access Prisma.
- API builds.
- Tests pass if tests exist for this area.
```

## Commands to Run

List commands that must pass before committing.

Backend example:

```bash
pnpm --filter @flashcards/api build
pnpm format:check
pnpm lint
```

Prisma example:

```bash
pnpm --filter @flashcards/api exec prisma validate
pnpm --filter @flashcards/api exec prisma generate
pnpm --filter @flashcards/api build
pnpm format:check
pnpm lint
```

Frontend example:

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm --filter @flashcards/mobile web
pnpm format:check
pnpm lint
```

Deployment example:

```bash
pnpm format:check
pnpm lint
pnpm --filter @flashcards/api db:validate
pnpm --filter @flashcards/api build
pnpm --filter @flashcards/mobile typecheck
pnpm --filter @flashcards/mobile build:web
```

## Manual Checks

Add manual checks when the task affects runtime behavior.

Example:

```txt
- Start API locally.
- Open GraphQL playground or client.
- Run the mutation/query.
- Confirm successful response.
- Confirm unauthorized request is rejected.
- Confirm forbidden request is rejected when applicable.
```

If no manual checks are needed, write:

```txt
None
```

## Do Not Do

List boundaries to prevent scope creep.

Example:

```txt
- Do not implement unrelated screens.
- Do not change database schema unless required.
- Do not change auth token strategy.
- Do not expose sensitive fields.
- Do not add external services without explicit task requirement.
- Do not skip listed commands.
```

## Expected Commit Message

```txt
type(scope): concise task summary
```

Examples:

```txt
feat(auth): add login use case
feat(decks): add create deck mutation
chore(frontend): configure Apollo Client
docs(tasks): update cursor task template
```

---

# Cursor Execution Rules

When working on a task, Cursor must follow these rules:

```txt
1. Read all Related Documents first.
2. Keep the task focused.
3. Do not change architecture decisions unless the task explicitly asks for it.
4. Do not access Prisma directly from GraphQL resolvers.
5. Do not put business logic in presentation layer.
6. Do not expose secrets, passwords, token hashes, or push token values.
7. Do not log access tokens, refresh tokens, reset tokens, verification tokens, API keys, or database URLs.
8. Run all commands listed in Commands to Run.
9. Fix issues discovered by the commands.
10. Commit only after checks pass.
```

## Recommended Task Size

A task should usually fit into one commit.

Good task size:

```txt
- one use case
- one resolver operation
- one repository implementation
- one screen
- one form
- one provider
- one deployment config file
```

Too large:

```txt
- full auth system
- full frontend app
- backend and frontend for a feature at the same time
- multiple epics in one task
```

If a task becomes too large, split it before implementing.

## Safe Output Rules

For user-facing GraphQL/API output:

```txt
Never expose:
- passwordHash
- refresh token hashes
- email verification token hashes
- password reset token hashes
- raw push tokens
- API keys
- internal job secrets
- DATABASE_URL
```

Use safe user fields only:

```txt
id
email
role
emailVerifiedAt
blockedAt
createdAt
updatedAt
```

## Backend Layer Rules

Presentation layer:

```txt
- GraphQL resolvers
- GraphQL types
- GraphQL inputs
- HTTP controllers
- Guards/decorators
```

Presentation layer may:

```txt
- parse input
- call use cases
- return DTOs
```

Presentation layer must not:

```txt
- access Prisma directly
- contain business rules
- calculate permissions directly
- calculate SRS
- hash passwords or tokens directly
```

Application layer:

```txt
- use cases
- ports
- orchestration
- transactions
```

Application layer may:

```txt
- validate workflow rules
- call domain services
- call repository ports
- call provider ports
- coordinate transactions
```

Application layer must not:

```txt
- import GraphQL decorators
- import Prisma client directly
- depend on NestJS request/response objects
```

Domain layer:

```txt
- entities
- value objects
- policies
- pure services
- algorithms
```

Domain layer must not:

```txt
- import NestJS
- import Prisma
- import GraphQL
- call external services
```

Infrastructure layer:

```txt
- Prisma repositories
- mappers
- provider implementations
- email provider
- AI provider
- push provider
- token/hash implementations
```

Infrastructure layer may:

```txt
- import Prisma
- call external APIs
- implement ports
```

## Frontend Rules

Frontend must:

```txt
- use Apollo Client for GraphQL operations
- use generated GraphQL types/hooks when available
- keep access token in memory only
- use Expo SecureStore for native refresh token
- avoid localStorage/sessionStorage for auth tokens
- expose only public-safe EXPO_PUBLIC variables
```

Frontend must not:

```txt
- store auth tokens in localStorage
- store auth tokens in sessionStorage
- expose backend secrets
- call AI providers directly
- calculate SM-2
- calculate due dates
- select lesson cards
- treat hidden buttons as security
```

## Security Checklist Reminder

Before finishing any task, verify:

```txt
- No real secrets were added.
- No sensitive fields are returned.
- No raw tokens are logged.
- Backend permission checks are server-side.
- Frontend-only checks are UX only.
- Production-facing changes do not weaken CORS, auth, or error safety.
```
