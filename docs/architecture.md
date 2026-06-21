# Flashcards Architecture

## 1. Product Overview

Flashcards is a mobile-first language learning application for studying vocabulary with flashcards, swipe-based lessons, and spaced repetition.

The MVP focuses on learning English words from Ukrainian:

* Source language: Ukrainian (`uk`)
* Target language: English (`en`)
* Interface languages: English (`en`) and Ukrainian (`uk`)

The core product flow is:

1. A user registers and verifies their email.
2. The user creates decks.
3. The user adds cards to decks.
4. The user starts a lesson.
5. The app shows an English word.
6. The user taps to reveal the Ukrainian translation.
7. The user answers with:

    * Know
    * Don't know
8. The backend updates the card review state using an adapted SM-2 spaced repetition algorithm.

The backend is the source of truth for all learning progress and scheduling.

---

## 2. High-Level Architecture

```txt
[Expo Android App]          [Expo Web App]
        |                         |
        | GraphQL over HTTPS      |
        v                         v
              [NestJS GraphQL API]
                       |
        ---------------------------------
        |               |               |
   [Auth Module]   [Deck Module]   [Lesson/SRS Module]
        |               |               |
        ---------------------------------
                       |
                   [Prisma]
                       |
              [PostgreSQL / Neon]

External services:

[Google OAuth] -> Auth Module

[Transactional Email Provider]
  -> email verification
  -> password reset
  -> group invitations

[AI Provider]
  -> generate example sentences

[Expo Push Service]
  -> daily review reminders

[GitHub Actions Cron]
  -> secured backend reminder job endpoint
```

---

## 3. Recommended Stack

### Frontend

```txt
Expo React Native
Expo Router
TypeScript
React Native Web
Tamagui
Apollo Client
GraphQL Code Generator
React Native Gesture Handler
Reanimated
Expo Notifications
Expo Speech
Hermes
```

### Backend

```txt
NestJS
GraphQL
TypeScript
Prisma
PostgreSQL
JWT authentication
Argon2 password hashing
Clean Architecture
```

### Infrastructure for MVP

```txt
Database: Neon Postgres Free
Backend: Render Free Web Service
Web: Vercel Hobby or Netlify Free
Email: Resend as primary, Brevo as fallback
Scheduler: GitHub Actions cron
Push notifications: Expo Push Notifications
Storage: none in MVP
```

---

## 4. Monorepo Structure

```txt
flashcards/
  apps/
    app/
      app/
      src/
        components/
        features/
        graphql/
        hooks/
        i18n/
        theme/
        utils/
      package.json

    api/
      src/
        main.ts
        app.module.ts
        common/
        config/
        infrastructure/
        modules/
      prisma/
        schema.prisma
        migrations/
      package.json

  packages/
    graphql/
      operations/
      generated/
      codegen.ts

    srs/
      src/
        sm2.ts
        types.ts
        index.ts

    validation/
      src/

    shared/
      src/

    ui/
      src/

    config/
      eslint/
      tsconfig/
      prettier/
```

---

## 5. Backend Architecture Style

The backend uses Clean Architecture.

Main rule:

```txt
GraphQL resolvers do not access Prisma directly.
Use cases do not depend on GraphQL.
Domain logic does not depend on NestJS.
Prisma exists only in the infrastructure layer.
```

Each core module should follow this structure:

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
    policies/
      deck-access.policy.ts
    repositories/
      deck.repository.port.ts

  application/
    use-cases/
      create-deck.use-case.ts
      update-deck.use-case.ts
      delete-deck.use-case.ts
      copy-deck.use-case.ts
      make-deck-public.use-case.ts
    commands/
      create-deck.command.ts
      update-deck.command.ts
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

## 6. Backend Modules

The initial backend modules are:

```txt
auth
users
decks
cards
lessons
srs
groups
imports
ai
notifications
admin
analytics
languages
```

### Core modules

These modules should strictly follow Clean Architecture:

```txt
auth
decks
cards
lessons
groups
imports
notifications
```

### Simpler modules

These can be more pragmatic at MVP stage:

```txt
languages
analytics
admin read dashboard
user settings
```

---

## 7. Clean Architecture Layers

### Presentation Layer

Responsible for:

```txt
GraphQL resolvers
GraphQL types
GraphQL inputs
Guards
Current user extraction
Mapping GraphQL input to application commands
```

Not allowed:

```txt
Direct Prisma queries
Business logic
Permission logic implementation
SM-2 calculations
```

### Application Layer

Responsible for:

```txt
Use cases
Application orchestration
Transactions
Calling repositories through ports
Calling external services through ports
Calling domain policies
Analytics tracking
```

### Domain Layer

Responsible for:

```txt
Entities
Value objects
Business rules
Domain policies
Invariants
Pure logic
```

The domain layer must not import:

```txt
@nestjs/*
@prisma/client
GraphQL decorators
HTTP exceptions
External SDKs
```

### Infrastructure Layer

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
```

---

## 8. Important Architecture Rules

```txt
1. Resolvers must not import PrismaService.
2. Use cases must not import PrismaService.
3. Domain entities must not import NestJS.
4. Business rules must not live in GraphQL resolvers.
5. Permissions must be enforced on the backend.
6. External services must be accessed through ports.
7. Prisma models must not be used as domain entities.
8. GraphQL DTOs must not be used as domain entities.
9. SM-2 logic must be implemented as pure TypeScript.
10. The backend is the source of truth for spaced repetition state.
```

---

## 9. Authentication Architecture

MVP authentication includes:

```txt
Email/password registration
Email verification
Login
Logout
Password reset
Google login
JWT access tokens
Refresh token rotation
```

Recommended token strategy:

```txt
Mobile:
  Access token: memory
  Refresh token: Expo SecureStore

Web:
  Access token: memory
  Refresh token: httpOnly secure cookie

Backend:
  Refresh tokens are stored hashed in the database.
  Refresh tokens are rotated on every refresh.
  Logout revokes the current refresh token.
```

Email verification is required before accessing product functionality.

Before email verification, the user may only:

```txt
Read current user session
Resend verification email
Logout
```

The user may not:

```txt
Create decks
Create cards
Start lessons
Use AI features
Import CSV files
Create groups
Copy public decks
```

Google login should mark the user as verified only if Google returns `email_verified = true`.

---

## 10. Core Database Models

Initial core models:

```txt
users
user_profiles
user_settings
auth_accounts
refresh_tokens
email_verification_tokens
password_reset_tokens
decks
cards
card_review_states
study_sessions
study_session_reviews
groups
group_members
group_invitations
deck_group_shares
deck_imports
deck_import_rows
ai_generation_logs
push_tokens
notification_logs
analytics_events
admin_audit_logs
```

Important database conventions:

```txt
Use UUID primary keys.
Use created_at and updated_at on mutable tables.
Use deleted_at for soft delete where useful.
Use indexes for ownership and access patterns.
Use hashed tokens, never raw tokens.
Do not expose private auth fields through GraphQL.
```

---

## 11. Decks and Cards

A deck belongs to one user.

Deck visibility:

```txt
PRIVATE
PUBLIC
UNLISTED - reserved for future use
```

Public decks appear in search immediately after publication.

Moderation happens after publication:

```txt
ACTIVE
HIDDEN
REJECTED
```

Cards belong to exactly one deck.

MVP card fields:

```txt
word
translation
example_sentence
```

Future fields:

```txt
image_url
audio_url
part_of_speech
tags
difficulty
multiple translations
multiple examples
```

Deck copying behavior:

```txt
When a user copies a public or group-shared deck:
  - a new private deck is created
  - source_deck_id points to the original deck
  - all current cards are copied
  - the copy is independent
  - future changes to the source deck do not update the copy
```

---

## 12. Permission Model

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

All permission checks must be enforced in backend services/use cases, not only in the frontend.

---

## 13. Spaced Repetition Architecture

The app uses an adapted SM-2 algorithm.

The UI has two answers:

```txt
Know
Don't know
```

Mapping:

```txt
Know       -> quality = 5
Don't know -> quality = 2
```

Per-user per-card review state:

```txt
repetition
interval
easiness_factor
due_date
last_reviewed_at
lapses
```

MVP learned card definition:

```txt
A card is learned when card_review_state.repetition >= 2.
```

The SM-2 algorithm must live in:

```txt
packages/srs
```

It must be pure TypeScript and must not depend on:

```txt
NestJS
Prisma
GraphQL
React
```

The backend uses this package when processing lesson reviews.

---

## 14. Lesson Flow

MVP lesson type:

```txt
Swipe-based flashcard lesson
```

Lesson size:

```txt
20 cards
```

Flow:

```txt
1. User starts a lesson from a deck.
2. Backend creates a study session.
3. Backend selects due cards first.
4. Backend fills remaining slots with new cards.
5. Frontend shows the English word.
6. User taps to reveal Ukrainian translation.
7. Example sentence is shown if available.
8. User can press Listen to hear the word.
9. User answers Know or Don't know.
10. Backend saves the review.
11. Backend updates card_review_state.
12. Lesson is completed.
13. Result screen is shown.
```

If the user answers Don't know:

```txt
The card appears once more later in the same lesson.
The card is not repeated infinitely.
After the lesson, its due date is tomorrow.
```

---

## 15. CSV Import

MVP CSV format:

```csv
word,translation
apple,яблуко
book,книга
house,будинок
```

MVP import strategy:

```txt
Frontend reads the CSV file as text.
Frontend sends csvText to the backend.
Backend parses and validates the CSV.
Backend stores preview rows.
User confirms selected rows.
Backend creates cards only from selected valid rows.
Raw CSV file is not stored long-term.
```

Limits:

```txt
Max file size: 1 MB
Max rows: 1000
Required fields: word, translation
```

Validation:

```txt
Required word
Required translation
Max field length
Duplicate rows inside CSV
Duplicates in target deck
Invalid format
Invalid encoding
CSV formula injection risk
```

AI examples must not be generated during CSV import.

---

## 16. AI Examples

AI examples are generated only during manual card creation or editing.

Flow:

```txt
1. User enters word and translation.
2. User clicks Generate examples.
3. Backend validates input.
4. Backend checks rate limits.
5. Backend calls AI provider.
6. Backend returns exactly 3 example sentences.
7. User selects one example.
8. User can manually edit the selected example.
9. Selected example is saved to the card.
```

AI provider must be abstracted behind a port:

```ts
interface AiProvider {
  generateExamples(input: GenerateExamplesInput): Promise<string[]>
}
```

MVP safety rules:

```txt
Do not send unnecessary personal data to the AI provider.
Limit input length.
Rate-limit generation per user.
Log every AI generation.
Support future usage limits and premium restrictions.
```

---

## 17. Groups and Sharing

A user can create groups.

Group roles in MVP:

```txt
OWNER
MEMBER
```

Invite flow:

```txt
1. Owner enters an email.
2. Backend creates a pending invitation.
3. Backend hashes the invitation token.
4. Backend sends an invitation email.
5. Existing user can accept the invitation in the app.
6. New user registers with the invited email and verifies it.
7. User accepts invitation.
8. Backend creates group membership.
```

Important rule:

```txt
A group invitation can only be accepted by a verified user whose email matches the invited email.
```

Deck sharing:

```txt
A deck can be shared with one or multiple groups.
Sharing is stored in deck_group_shares.
Group members can view and copy shared decks.
Group members cannot edit the original deck unless they own it.
```

---

## 18. Notifications

Notifications are disabled by default.

MVP reminder rules:

```txt
Maximum one reminder per day.
Default reminder time: 18:00.
Respect user timezone.
Send only if the user has due cards.
Do not send if notifications are disabled.
```

MVP mobile strategy:

```txt
Expo Push Notifications
Backend stores Expo push tokens
GitHub Actions cron calls a secured backend endpoint
Backend checks due cards
Backend sends push notifications
```

Web MVP strategy:

```txt
Use in-app reminders and due card badges.
Do not implement Web Push in MVP.
```

---

## 19. Admin Panel

MVP admin panel can be implemented inside Expo Web.

Admin capabilities:

```txt
View users
Block/unblock users
View decks
View public decks
Hide/reject public decks
Create official public decks
Edit official decks and cards
View basic analytics
```

Every admin write action must be logged in:

```txt
admin_audit_logs
```

Admin operations must be protected by:

```txt
GqlAuthGuard
VerifiedEmailGuard
RolesGuard(ADMIN)
```

---

## 20. Analytics

MVP analytics are stored internally in PostgreSQL.

Table:

```txt
analytics_events
```

Events to track:

```txt
user_registered
user_logged_in
deck_created
deck_made_public
deck_copied
deck_shared_to_group
card_created
card_imported_from_csv
lesson_started
lesson_completed
card_reviewed
ai_examples_generated
group_created
group_invitation_sent
group_invitation_accepted
```

External analytics tools are not required in MVP.

Future options:

```txt
PostHog
Plausible
ClickHouse
BigQuery
```

---

## 21. Security Requirements

MVP security checklist:

```txt
Use Argon2 for password hashing.
Require email verification.
Hash verification tokens.
Hash password reset tokens.
Hash refresh tokens.
Use token expiration.
Use refresh token rotation.
Rate-limit auth endpoints.
Rate-limit password reset.
Rate-limit resend verification.
Rate-limit group invitations.
Rate-limit AI generation.
Validate all GraphQL inputs.
Use GraphQL depth limits.
Use GraphQL complexity limits.
Do not expose private fields.
Enforce ownership checks on backend.
Protect admin operations with role guards.
Log admin actions.
Limit CSV file size.
Limit CSV row count.
Reject CSV formula injection.
Do not store uploaded CSV files long-term.
Store push tokens per user.
Allow users to disable notifications.
Do not send notifications to disabled tokens.
```

Future security improvements:

```txt
Admin 2FA
User session management
Account export
Account deletion
Deck report workflow
Advanced abuse detection
Web Application Firewall
```

---

## 22. Apollo Client Notes

The frontend uses Apollo Client.

Recommended structure:

```txt
apps/app/src/graphql/
  apolloClient.ts
  authLink.ts
  errorLink.ts
  refreshToken.ts
  cache.ts
```

Apollo cache recommendations:

```txt
Use InMemoryCache.
Use normalized IDs.
Always return id from GraphQL types.
Use refetchQueries in MVP after create/update/delete.
Add manual cache updates later where needed.
Use limit/offset pagination for MVP.
Use cursor pagination later if needed.
```

Initial Apollo type policies should cover:

```txt
User
Deck
Card
Group
StudySession
```

---

## 23. MVP Scope

MVP includes:

```txt
Expo universal app
Android support
Expo Web support
Tamagui UI
Light/dark/system theme
English/Ukrainian interface
Email/password auth
Email verification
Google login
Password reset
Deck CRUD
Card CRUD
Private/public decks
Public deck search
Copy public deck
Swipe lesson
SM-2 scheduling
Basic stats
Text-to-speech in lessons
AI example generation for manual cards
CSV import with preview/confirm
Groups
Group invitations by email
Deck sharing with groups
Daily review notifications
Simple admin panel
Basic analytics
Legal pages
Landing page
```

MVP does not include:

```txt
iOS App Store publication
Next.js web app
Images
Generated audio files
Excel import
Anki import
Multiple exercise types
Offline mode
Web Push
Premium payments
Public deck report button
Complex moderation workflow
```

---

## 24. Development Order

Recommended development order:

```txt
1. Set up pnpm monorepo.
2. Create NestJS API app.
3. Add Prisma and connect Neon Postgres.
4. Create base database schema.
5. Implement auth module.
6. Implement users and settings.
7. Create Expo app shell.
8. Configure Apollo Client.
9. Implement register/login/me flow.
10. Implement decks and cards.
11. Implement SM-2 package.
12. Implement lessons.
13. Implement public decks and copy deck.
14. Implement CSV import.
15. Implement AI examples.
16. Implement groups and invitations.
17. Implement notifications.
18. Implement admin panel.
19. Implement analytics dashboard.
20. Prepare deployment.
```

---

## 25. First Milestone

The first milestone should be:

```txt
A verified user can log in, create a deck, add cards, start a lesson, answer Know or Don't know, and have the backend schedule the next review date.
```

This milestone proves the core product loop:

```txt
User -> Deck -> Card -> Lesson -> Review -> SRS schedule
```

Everything else should be built after this loop works reliably.
