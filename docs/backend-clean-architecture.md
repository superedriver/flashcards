# Backend Clean Architecture

## 1. Purpose

This document defines the backend architecture rules for the Flashcards API.

The backend is built with:

```txt
NestJS
GraphQL
Prisma
PostgreSQL
TypeScript
Clean Architecture
```

The goal is to keep business logic independent from frameworks, database implementation, GraphQL transport, and external providers.

Flashcards is not a simple CRUD app. It includes:

```txt
Authentication
Email verification
Public/private decks
Group sharing
Deck copying
Lesson queue logic
SM-2 spaced repetition
CSV import validation
AI example generation
Notifications
Admin moderation
Future premium features
```

Because of that, the backend must have clear boundaries.

---

## 2. Main Rule

```txt
GraphQL resolvers must not access Prisma directly.
Use cases must not depend on GraphQL.
Domain logic must not depend on NestJS.
Prisma must exist only in the infrastructure layer.
```

This is the most important rule.

---

## 3. Backend Folder Structure

Recommended structure:

```txt
apps/api/src/
  main.ts
  app.module.ts

  common/
    decorators/
    errors/
    filters/
    guards/
    scalars/
    types/

  config/

  infrastructure/
    prisma/
    email/
    crypto/
    ai/
    push/
    scheduler/

  modules/
    auth/
    users/
    decks/
    cards/
    lessons/
    groups/
    imports/
    ai/
    notifications/
    admin/
    analytics/
    languages/
```

Each core module should follow this internal structure:

```txt
modules/<feature>/
  domain/
    entities/
    value-objects/
    policies/
    repositories/

  application/
    use-cases/
    commands/
    queries/
    ports/
    services/

  infrastructure/
    prisma-*.repository.ts
    *.mapper.ts

  presentation/
    graphql/
      *.resolver.ts
      *.types.ts
      *.inputs.ts

  <feature>.module.ts
```

Example:

```txt
modules/decks/
  domain/
    entities/
      deck.entity.ts
    enums/
      deck-visibility.enum.ts
      deck-moderation-status.enum.ts
    policies/
      deck-access.policy.ts
    repositories/
      deck.repository.port.ts

  application/
    commands/
      create-deck.command.ts
      update-deck.command.ts
      copy-deck.command.ts
    use-cases/
      create-deck.use-case.ts
      update-deck.use-case.ts
      delete-deck.use-case.ts
      copy-deck.use-case.ts
      make-deck-public.use-case.ts
      make-deck-private.use-case.ts
    services/
      deck-permission.service.ts

  infrastructure/
    prisma-deck.repository.ts
    prisma-deck.mapper.ts

  presentation/
    graphql/
      deck.resolver.ts
      deck.types.ts
      deck.inputs.ts

  decks.module.ts
```

---

## 4. Architecture Layers

## 4.1 Presentation Layer

Location:

```txt
presentation/graphql/
```

Responsible for:

```txt
GraphQL resolvers
GraphQL object types
GraphQL input types
GraphQL guards
Current user extraction
Mapping GraphQL input to application commands
Returning application results to the client
```

Not allowed:

```txt
Direct Prisma access
Business rules
Permission implementation
SM-2 logic
External API calls
Complex transactions
```

Example:

```ts
@Mutation(() => DeckType)
@UseGuards(GqlAuthGuard, VerifiedEmailGuard)
async createDeck(
  @CurrentUser() user: AuthUser,
  @Args('input') input: CreateDeckInput,
) {
  return this.createDeckUseCase.execute({
    ownerId: user.id,
    title: input.title,
    description: input.description,
    sourceLanguageCode: input.sourceLanguageCode,
    targetLanguageCode: input.targetLanguageCode,
  })
}
```

The resolver only receives GraphQL input, extracts the current user, and calls a use case.

---

## 4.2 Application Layer

Location:

```txt
application/
```

Responsible for:

```txt
Use cases
Application orchestration
Transactions
Calling repositories through ports
Calling external providers through ports
Calling domain policies
Permission checks
Analytics tracking
```

The application layer contains the actual user actions:

```txt
CreateDeckUseCase
CopyDeckUseCase
StartLessonUseCase
SubmitReviewUseCase
PreviewCsvImportUseCase
GenerateExampleSentencesUseCase
InviteUserToGroupUseCase
SendDailyRemindersUseCase
```

Example:

```ts
export class CreateDeckUseCase {
  constructor(
    private readonly deckRepository: DeckRepositoryPort,
    private readonly analytics: AnalyticsPort,
  ) {}

  async execute(command: CreateDeckCommand): Promise<Deck> {
    const deck = Deck.create({
      ownerId: command.ownerId,
      title: command.title,
      description: command.description,
      sourceLanguageCode: command.sourceLanguageCode,
      targetLanguageCode: command.targetLanguageCode,
    })

    const savedDeck = await this.deckRepository.save(deck)

    await this.analytics.track({
      userId: command.ownerId,
      eventName: 'deck_created',
      metadata: {
        deckId: savedDeck.id,
      },
    })

    return savedDeck
  }
}
```

The use case does not know that Prisma exists.

---

## 4.3 Domain Layer

Location:

```txt
domain/
```

Responsible for:

```txt
Entities
Value objects
Domain policies
Business rules
Invariants
Pure business logic
```

The domain layer must not import:

```txt
@nestjs/*
@prisma/client
GraphQL decorators
HTTP exceptions
External SDKs
```

Example:

```ts
export class Deck {
  constructor(
    public readonly id: string,
    public readonly ownerId: string,
    public title: string,
    public description: string | null,
    public visibility: DeckVisibility,
    public moderationStatus: DeckModerationStatus,
    public readonly isOfficial: boolean,
    public readonly sourceLanguageCode: string,
    public readonly targetLanguageCode: string,
  ) {}

  static create(props: CreateDeckProps): Deck {
    const title = props.title.trim()

    if (!title) {
      throw new DomainError('DECK_TITLE_REQUIRED')
    }

    if (title.length > 120) {
      throw new DomainError('DECK_TITLE_TOO_LONG')
    }

    return new Deck(
      props.id,
      props.ownerId,
      title,
      props.description?.trim() || null,
      DeckVisibility.PRIVATE,
      DeckModerationStatus.ACTIVE,
      false,
      props.sourceLanguageCode,
      props.targetLanguageCode,
    )
  }

  makePublic(): void {
    if (this.moderationStatus === DeckModerationStatus.REJECTED) {
      throw new DomainError('REJECTED_DECK_CANNOT_BE_PUBLIC')
    }

    this.visibility = DeckVisibility.PUBLIC
  }

  makePrivate(): void {
    this.visibility = DeckVisibility.PRIVATE
  }

  copyForUser(newDeckId: string, userId: string): Deck {
    return new Deck(
      newDeckId,
      userId,
      this.title,
      this.description,
      DeckVisibility.PRIVATE,
      DeckModerationStatus.ACTIVE,
      false,
      this.sourceLanguageCode,
      this.targetLanguageCode,
    )
  }
}
```

---

## 4.4 Infrastructure Layer

Location:

```txt
infrastructure/
```

Responsible for:

```txt
Prisma repositories
Database mappers
Email providers
AI providers
Push notification providers
Password hashing
Token generation
External SDK integrations
Transaction manager implementation
```

Example:

```ts
@Injectable()
export class PrismaDeckRepository implements DeckRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Deck | null> {
    const row = await this.prisma.deck.findUnique({
      where: { id },
    })

    return row ? PrismaDeckMapper.toDomain(row) : null
  }

  async save(deck: Deck): Promise<Deck> {
    const row = await this.prisma.deck.create({
      data: PrismaDeckMapper.toPersistence(deck),
    })

    return PrismaDeckMapper.toDomain(row)
  }
}
```

Prisma rows are mapped to domain entities through mapper classes.

---

## 5. Dependency Direction

Dependencies must point inward:

```txt
presentation -> application -> domain
infrastructure -> application/domain through ports
```

Allowed:

```txt
Resolver -> UseCase
UseCase -> RepositoryPort
UseCase -> Domain Entity
UseCase -> Domain Policy
PrismaRepository -> RepositoryPort
PrismaRepository -> PrismaService
```

Not allowed:

```txt
Domain -> Prisma
Domain -> NestJS
Domain -> GraphQL
UseCase -> PrismaService
Resolver -> PrismaService
Resolver -> external provider SDK
```

---

## 6. Ports and Adapters

Application code depends on ports, not concrete implementations.

Example repository port:

```ts
export abstract class DeckRepositoryPort {
  abstract findById(id: string): Promise<Deck | null>
  abstract findByIdOrThrow(id: string): Promise<Deck>
  abstract save(deck: Deck): Promise<Deck>
  abstract update(deck: Deck): Promise<Deck>
  abstract softDelete(id: string): Promise<void>
}
```

Concrete implementation:

```ts
@Injectable()
export class PrismaDeckRepository implements DeckRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  // Implementation here
}
```

NestJS provider binding:

```ts
@Module({
  providers: [
    CreateDeckUseCase,
    UpdateDeckUseCase,
    CopyDeckUseCase,
    {
      provide: DeckRepositoryPort,
      useClass: PrismaDeckRepository,
    },
  ],
})
export class DecksModule {}
```

External service ports:

```ts
export abstract class EmailServicePort {
  abstract sendVerificationEmail(input: SendVerificationEmailInput): Promise<void>
  abstract sendPasswordResetEmail(input: SendPasswordResetEmailInput): Promise<void>
  abstract sendGroupInvitationEmail(input: SendGroupInvitationEmailInput): Promise<void>
}

export abstract class AiProviderPort {
  abstract generateExamples(input: GenerateExamplesInput): Promise<string[]>
}

export abstract class PushProviderPort {
  abstract sendPush(input: SendPushInput): Promise<void>
}

export abstract class PasswordHasherPort {
  abstract hash(password: string): Promise<string>
  abstract verify(hash: string, password: string): Promise<boolean>
}
```

---

## 7. Transactions

Transactions belong to the application layer, but the implementation is infrastructure-specific.

Use a transaction manager port:

```ts
export abstract class TransactionManagerPort {
  abstract run<T>(callback: () => Promise<T>): Promise<T>
}
```

Prisma implementation:

```ts
@Injectable()
export class PrismaTransactionManager implements TransactionManagerPort {
  constructor(private readonly prisma: PrismaService) {}

  async run<T>(callback: () => Promise<T>): Promise<T> {
    return this.prisma.$transaction(async () => {
      return callback()
    })
  }
}
```

Use cases that should be transactional:

```txt
Register user
Verify email
Copy deck
Confirm CSV import
Submit lesson review
Complete lesson
Accept group invitation
Share deck with group
Send notification batch
Admin hide/reject public deck
```

Example:

```ts
export class CopyDeckUseCase {
  constructor(
    private readonly deckRepository: DeckRepositoryPort,
    private readonly cardRepository: CardRepositoryPort,
    private readonly permissionService: DeckPermissionService,
    private readonly transactionManager: TransactionManagerPort,
    private readonly analytics: AnalyticsPort,
  ) {}

  async execute(command: CopyDeckCommand): Promise<Deck> {
    await this.permissionService.assertCanViewDeck(command.userId, command.sourceDeckId)

    return this.transactionManager.run(async () => {
      const sourceDeck = await this.deckRepository.findByIdOrThrow(command.sourceDeckId)

      const sourceCards = await this.cardRepository.findByDeckId(sourceDeck.id)

      const copiedDeck = sourceDeck.copyForUser(command.newDeckId, command.userId)

      const savedDeck = await this.deckRepository.save(copiedDeck)

      const copiedCards = sourceCards.map((card) =>
        card.copyToDeck(command.newCardId(), savedDeck.id),
      )

      await this.cardRepository.saveMany(copiedCards)

      await this.analytics.track({
        userId: command.userId,
        eventName: 'deck_copied',
        metadata: {
          sourceDeckId: sourceDeck.id,
          copiedDeckId: savedDeck.id,
        },
      })

      return savedDeck
    })
  }
}
```

---

## 8. Error Strategy

Domain errors should be framework-independent.

Example:

```ts
export class DomainError extends Error {
  constructor(
    public readonly code: string,
    message?: string,
  ) {
    super(message ?? code)
  }
}
```

Application errors:

```ts
export class ApplicationError extends Error {
  constructor(
    public readonly code: string,
    message?: string,
  ) {
    super(message ?? code)
  }
}
```

Example error codes:

```txt
DECK_TITLE_REQUIRED
DECK_TITLE_TOO_LONG
DECK_NOT_FOUND
DECK_ACCESS_DENIED
CARD_NOT_FOUND
EMAIL_NOT_VERIFIED
INVALID_CREDENTIALS
GROUP_INVITATION_EXPIRED
CSV_TOO_LARGE
CSV_INVALID_FORMAT
AI_RATE_LIMIT_EXCEEDED
```

GraphQL error filter maps internal errors to API errors:

```txt
DomainError -> BAD_USER_INPUT
ApplicationError with access issue -> FORBIDDEN
ApplicationError with missing resource -> NOT_FOUND
Unexpected Error -> INTERNAL_SERVER_ERROR
```

Never expose internal stack traces in production.

---

## 9. Permission Rules

Permissions must be enforced in application services/use cases.

Frontend checks are only for user experience.

A user can view a deck if:

```txt
1. The user owns the deck.
2. The deck is public and active.
3. The deck is shared with a group where the user is an active member.
4. The user is an admin.
```

A user can edit a deck if:

```txt
1. The user owns the deck.
2. The user is an admin editing an official deck.
```

A group member can:

```txt
View decks shared with the group.
Copy shared decks.
```

A group member cannot:

```txt
Edit the original shared deck.
Delete the original shared deck.
Share the original deck with another group.
```

Central service:

```ts
export class DeckPermissionService {
  constructor(
    private readonly deckRepository: DeckRepositoryPort,
    private readonly groupRepository: GroupRepositoryPort,
  ) {}

  async assertCanViewDeck(user: AuthUser, deckId: string): Promise<void> {
    if (user.role === 'ADMIN') {
      return
    }

    const deck = await this.deckRepository.findByIdOrThrow(deckId)

    if (deck.ownerId === user.id) {
      return
    }

    if (deck.isPublicActive()) {
      return
    }

    const isSharedWithUserGroup = await this.groupRepository.userHasAccessToDeckThroughGroup(
      user.id,
      deckId,
    )

    if (isSharedWithUserGroup) {
      return
    }

    throw new ApplicationError('DECK_ACCESS_DENIED')
  }

  async assertCanEditDeck(user: AuthUser, deckId: string): Promise<void> {
    const deck = await this.deckRepository.findByIdOrThrow(deckId)

    if (deck.ownerId === user.id) {
      return
    }

    if (user.role === 'ADMIN' && deck.isOfficial) {
      return
    }

    throw new ApplicationError('DECK_EDIT_DENIED')
  }
}
```

All operations that read or mutate deck data must use this service.

---

## 10. Authentication Rules

Authentication module should follow Clean Architecture as well.

Important use cases:

```txt
RegisterUserUseCase
LoginUseCase
RefreshTokenUseCase
LogoutUseCase
VerifyEmailUseCase
ResendVerificationEmailUseCase
RequestPasswordResetUseCase
ResetPasswordUseCase
GoogleLoginUseCase
```

Token strategy:

```txt
Mobile:
  Access token in memory
  Refresh token in Expo SecureStore

Web:
  Access token in memory
  Refresh token in httpOnly secure cookie

Backend:
  Store only hashed refresh tokens.
  Rotate refresh tokens on every refresh.
  Revoke refresh token on logout.
```

Before email verification, users can only:

```txt
Read current session
Resend verification email
Logout
```

Before email verification, users cannot:

```txt
Create decks
Create cards
Start lessons
Use AI features
Import CSV
Create groups
Copy public decks
```

Google login should mark email as verified only when Google returns:

```txt
email_verified = true
```

---

## 11. SRS and SM-2 Rules

SM-2 logic must be pure TypeScript.

Location:

```txt
packages/srs/
  src/
    sm2.ts
    types.ts
    index.ts
```

Rules:

```txt
No NestJS imports.
No Prisma imports.
No GraphQL imports.
No React imports.
No database access.
```

Function:

```ts
export function calculateNextReview(
  state: ReviewState,
  answer: ReviewAnswer,
  reviewedAt: Date,
): ReviewResult {
  // Pure SM-2 logic
}
```

Answer mapping:

```txt
Know       -> quality = 5
Don't know -> quality = 2
```

The backend is the source of truth for:

```txt
repetition
interval
easinessFactor
dueDate
lastReviewedAt
lapses
```

MVP learned card definition:

```txt
card_review_state.repetition >= 2
```

---

## 12. Lesson Use Cases

Core lesson use cases:

```txt
StartLessonUseCase
SubmitReviewUseCase
CompleteLessonUseCase
GetLessonResultUseCase
```

Lesson queue rules:

```txt
Due cards first.
New cards second.
Maximum 20 cards in MVP.
Only cards from accessible decks.
Only non-deleted cards.
Unknown cards are repeated once later in the same lesson.
Unknown cards are not repeated infinitely.
```

`SubmitReviewUseCase` is responsible for:

```txt
Validating session ownership.
Validating card belongs to the session.
Mapping Know/Don't know to SM-2 quality.
Saving study_session_review.
Updating card_review_state.
Adding one in-lesson repeat for Don't know.
Tracking analytics.
```

---

## 13. CSV Import Use Cases

Core CSV import use cases:

```txt
PreviewCsvImportUseCase
ConfirmCsvImportUseCase
CancelCsvImportUseCase
```

Rules:

```txt
Do not create cards during preview.
Create cards only after confirmation.
Do not store raw CSV files long-term.
Do not generate AI examples during CSV import.
Do not generate audio during CSV import.
```

Validation rules:

```txt
word is required
translation is required
max field length
duplicate rows inside CSV
duplicates inside target deck
invalid format
invalid encoding
CSV formula injection risk
row count limit
file size limit
```

---

## 14. AI Use Cases

Core AI use cases:

```txt
GenerateExampleSentencesUseCase
```

Rules:

```txt
AI generation is only for manual card create/edit.
CSV import must not trigger AI generation.
Input must be validated.
Input length must be limited.
Generation must be rate-limited.
Every request must be logged.
Do not send unnecessary personal data to AI provider.
```

AI provider must be abstracted:

```ts
export abstract class AiProviderPort {
  abstract generateExamples(input: GenerateExamplesInput): Promise<string[]>
}
```

---

## 15. Notification Use Cases

Core notification use cases:

```txt
RegisterPushTokenUseCase
UnregisterPushTokenUseCase
UpdateNotificationSettingsUseCase
SendDailyRemindersUseCase
```

Rules:

```txt
Notifications are disabled by default.
Maximum one reminder per day.
Send only if user has due cards.
Respect user timezone.
Push tokens belong to specific users.
Never send to tokens not owned by the user.
Delete or disable tokens on unregister/logout.
```

The scheduled job must be protected with a secret.

Example endpoint:

```txt
POST /internal/jobs/send-daily-reminders
Header: X-Job-Secret: <secret>
```

---

## 16. Admin Use Cases

Admin write operations must go through use cases and audit logs.

Core admin use cases:

```txt
BlockUserUseCase
UnblockUserUseCase
HidePublicDeckUseCase
RejectPublicDeckUseCase
CreateOfficialDeckUseCase
UpdateOfficialDeckUseCase
```

Every admin write action must create an audit log:

```txt
admin_user_id
action
target_type
target_id
metadata
created_at
```

Admin resolvers must use:

```txt
GqlAuthGuard
VerifiedEmailGuard
RolesGuard(ADMIN)
```

---

## 17. Testing Strategy

Clean Architecture makes testing easier.

Test levels:

```txt
Domain tests
Use case tests
Repository integration tests
GraphQL resolver tests
End-to-end tests
```

Domain tests should not require:

```txt
NestJS
Prisma
PostgreSQL
GraphQL
```

Use case tests should use fake repositories:

```ts
const useCase = new StartLessonUseCase(
  fakeDeckRepository,
  fakeCardRepository,
  fakeReviewStateRepository,
  fakeStudySessionRepository,
)
```

Important use cases to test early:

```txt
RegisterUserUseCase
VerifyEmailUseCase
CreateDeckUseCase
CopyDeckUseCase
StartLessonUseCase
SubmitReviewUseCase
PreviewCsvImportUseCase
ConfirmCsvImportUseCase
InviteUserToGroupUseCase
AcceptGroupInvitationUseCase
```

---

## 18. What Should Not Be Overengineered

Clean Architecture should be applied pragmatically.

Strict Clean Architecture is required for:

```txt
auth
decks
cards
lessons
srs
groups
imports
notifications
AI usage limits
admin write actions
```

Simpler services are acceptable for:

```txt
languages
interface locales
basic analytics reads
admin dashboard read-only stats
health checks
static legal pages
```

Do not create unnecessary layers for simple read-only functionality.

---

## 19. Development Order

Recommended backend implementation order:

```txt
1. Create NestJS API app.
2. Add common errors, guards, decorators, and config.
3. Add Prisma infrastructure.
4. Add crypto infrastructure.
5. Implement auth module.
6. Implement users and settings.
7. Implement decks module.
8. Implement cards module.
9. Implement packages/srs.
10. Implement lessons module.
11. Implement public decks and deck copying.
12. Implement CSV import.
13. Implement AI examples.
14. Implement groups and invitations.
15. Implement notifications.
16. Implement admin write actions and audit logs.
17. Implement analytics dashboard reads.
```

---

## 20. Architecture Checklist

Before merging backend code, check:

```txt
Does the resolver avoid PrismaService?
Does the use case avoid PrismaService?
Does the domain avoid NestJS?
Are permissions checked on the backend?
Are external providers accessed through ports?
Are Prisma rows mapped to domain entities?
Are GraphQL DTOs separate from domain entities?
Are tokens hashed before storing?
Are sensitive fields hidden from GraphQL?
Is the operation covered by a use case?
Does the operation need a transaction?
Does the operation need analytics tracking?
Does the operation need an admin audit log?
```

---

## 21. Final Principle

The backend should be clean where the product needs protection and simple where complexity is unnecessary.

```txt
Core business logic -> Clean Architecture.
Simple read-only functionality -> pragmatic NestJS services.
```

The goal is not to create many files.

The goal is to keep Flashcards maintainable when the product grows from:

```txt
Decks and cards
```

to:

```txt
Groups
Public decks
Lessons
SM-2
CSV import
AI generation
Notifications
Admin moderation
Premium features
Offline sync
```
