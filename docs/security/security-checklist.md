# Security Checklist

## Purpose

This document defines the security checklist for Flashcards.

It is a source-of-truth document for backend, frontend, deployment, and release security.

Relevant task files:

```txt
docs/tasks/02-auth.md
docs/tasks/03-email-verification-password-reset.md
docs/tasks/05-decks-cards.md
docs/tasks/06-public-decks.md
docs/tasks/07-srs-lessons.md
docs/tasks/10-groups-sharing.md
docs/tasks/11-notifications.md
docs/tasks/12-admin-analytics.md
docs/tasks/14-frontend-auth.md
docs/tasks/18-frontend-profile-settings-notifications.md
docs/tasks/19-frontend-groups-admin.md
docs/tasks/20-deployment-mvp.md
docs/tasks/21-mvp-polish-and-release.md
```

## Core Security Principles

```txt
- Never commit real secrets.
- Never log passwords.
- Never log access tokens.
- Never log refresh tokens.
- Never store raw refresh tokens in the database.
- Never return sensitive fields through GraphQL.
- Never rely only on frontend permission checks.
- Backend must enforce authentication and authorization.
- Production config must fail fast if critical secrets are missing.
- Production CORS must not use wildcard origins.
```

## Secret Management

Secrets must only exist in:

```txt
- local .env files
- hosting provider environment variables
- GitHub Actions secrets
```

Secrets must not be committed to Git.

Forbidden in repository:

```txt
DATABASE_URL with real credentials
JWT_ACCESS_SECRET
JWT_REFRESH_SECRET
RESEND_API_KEY
BREVO_API_KEY
AI_API_KEY
INTERNAL_JOB_SECRET
real admin passwords
real user passwords
raw access tokens
raw refresh tokens
```

Allowed in repository:

```txt
.env.example with placeholder values
documentation with placeholder values
non-secret public frontend env names
```

## .gitignore Requirements

The repository must ignore:

```txt
.env
.env.local
.env.*.local
```

The repository should not ignore:

```txt
.env.example
```

## Backend Production Env Requirements

Production backend must require:

```txt
NODE_ENV=production
DATABASE_URL
APP_WEB_URL
CORS_ORIGIN
JWT_ACCESS_SECRET
JWT_REFRESH_SECRET
INTERNAL_JOB_SECRET
```

If any critical production env variable is missing, backend startup must fail.

Do not print secret values in startup errors.

Good error:

```txt
Missing required production environment variable: JWT_ACCESS_SECRET
```

Bad error:

```txt
JWT_ACCESS_SECRET is abc123...
```

## Password Security

Passwords must be hashed with:

```txt
Argon2
```

Password rules:

```txt
- Never store plaintext password.
- Never log password.
- Never return passwordHash in GraphQL.
- Never use SHA-256 for passwords.
- Use Argon2 for user password hashing.
```

Recommended password requirements for MVP:

```txt
min length: 8
max length: 128
```

Password reset must:

```txt
- validate reset token
- hash new password with Argon2
- mark reset token as used
- revoke all active refresh tokens for the user
```

## Token Security

Token strategy must follow:

```txt
docs/domain/auth-token-strategy.md
```

Access token rules:

```txt
- JWT
- short-lived
- stored in frontend memory only
- sent through Authorization header
- never stored in localStorage
- never logged
```

Refresh token rules:

```txt
- random opaque token
- long-lived
- stored as hash in database
- raw token stored only on client
- mobile stores raw token in Expo SecureStore
- web should use httpOnly secure cookie later
- never stored in localStorage
- never logged
- rotated on refresh
- revoked on logout
```

## Refresh Token Hashing

Refresh tokens must be stored as hashes.

Recommended hash:

```txt
SHA-256
```

Reason:

```txt
Refresh tokens are random high-entropy tokens, not user passwords.
```

Database should store:

```txt
tokenHash
expiresAt
revokedAt
rotatedFromTokenId optional
```

Database must not store:

```txt
raw refresh token
```

## GraphQL Security

GraphQL resolvers must not:

```txt
- access Prisma directly
- implement permission logic directly
- return sensitive fields
- expose stack traces in production
```

GraphQL resolvers should:

```txt
- call use cases
- pass current user context
- return safe DTOs/types
```

GraphQL outputs must never expose:

```txt
passwordHash
refreshTokenHash
emailVerificationTokenHash
passwordResetTokenHash
raw push token
internal job secret
provider API keys
```

## GraphQL Error Security

Production errors should not expose:

```txt
stack traces
SQL errors
Prisma internals
secret values
token hashes
raw tokens
```

Recommended behavior:

```txt
- use application/domain error codes
- return friendly messages
- log internal details only if safe
```

## Authentication Guards

Protected GraphQL operations must require authentication.

Examples:

```txt
me
createDeck
updateDeck
deleteDeck
createCard
updateCard
deleteCard
startLesson
submitReview
completeLesson
createGroup
admin operations
```

Unauthenticated users may access only explicitly public operations:

```txt
publicDecks
publicDeck
health endpoint
register
login
requestPasswordReset
resetPassword
verifyEmail
```

## Authorization Rules

Authorization must follow:

```txt
docs/domain/permissions.md
```

Backend use cases must validate:

```txt
- user owns the resource
- user can view the resource
- user has correct role
- user is group member where required
- user is not blocked
```

Frontend role checks are UX only.

Backend must reject unauthorized operations even if frontend hides buttons.

## Blocked User Rules

If `blockedAt` is not null, user is blocked.

Blocked users must not:

```txt
- log in
- refresh token
- access protected operations
- create or modify resources
```

Admin block action should not expose sensitive data.

## Email Token Security

Email verification tokens and password reset tokens must be:

```txt
- random
- high entropy
- stored as hash
- time-limited
- single-use where applicable
```

Email verification token recommended expiry:

```txt
24 hours
```

Password reset token recommended expiry:

```txt
1 hour
```

Never store raw email/password reset tokens in database.

Never log raw email/password reset tokens.

## CSV Import Security

CSV import must:

```txt
- require authentication
- require deck owner/manage permission
- validate input size
- validate row count
- validate column count
- validate required fields
- avoid creating cards during preview
```

Limits:

```txt
max csvText size: 1 MB
max rows: 1000
max columns: 20
```

CSV import must not:

```txt
- write uploaded files to disk
- execute CSV contents
- allow formula injection in exported files if export is added later
```

## AI Security

AI generation must:

```txt
- happen only through backend AiProviderPort
- require authenticated user
- require permission to manage the card/deck
- not be called directly from frontend
- not auto-save generated content
- log safe metadata only
```

AI logs must not store:

```txt
API key
raw provider secret
unbounded prompt/output text
sensitive user data beyond what is required
```

Recommended logs:

```txt
provider
type
status
promptPreview
outputPreview
errorMessage
createdAt
```

Prompt/output previews should be length-limited.

## Push Notification Security

Push token registration must:

```txt
- require authentication
- associate token with current user
- avoid duplicate active tokens
- not expose raw token in normal UI
```

Push sending must:

```txt
- happen from backend only
- use provider port
- log safe delivery status
```

Frontend must not send push notifications directly.

## Internal Job Security

Internal scheduled endpoints must require:

```txt
x-internal-job-secret
```

Example endpoint:

```txt
POST /internal/jobs/send-due-reminders
```

Rules:

```txt
- reject missing secret
- reject invalid secret
- do not log secret
- store secret only in hosting env and GitHub Actions secrets
```

GitHub Actions must use:

```txt
PRODUCTION_API_URL
INTERNAL_JOB_SECRET
```

Do not hardcode internal job secret in workflow file.

## CORS Security

Development CORS may allow localhost.

Production CORS must:

```txt
- allow only configured production frontend origin
- not use wildcard origin
- not allow arbitrary credentials
```

Production env:

```txt
CORS_ORIGIN=https://your-frontend-domain.example
```

Forbidden production setting:

```txt
CORS_ORIGIN=*
```

## Database Security

Database rules:

```txt
- DATABASE_URL must not be committed.
- Production database must not be reset.
- Prisma migrate reset must never run against production.
- Database access should happen only through Prisma repositories.
- Resolvers must not query Prisma directly.
```

Production migration command:

```txt
pnpm --filter @flashcards/api prisma:migrate:deploy
```

Forbidden in production:

```txt
pnpm --filter @flashcards/api prisma:migrate:reset
```

## Clean Architecture Security

Security-sensitive logic must not be scattered.

Rules:

```txt
- Authentication guard identifies current user.
- Use cases enforce authorization.
- Domain/application services hold permission rules.
- Infrastructure handles hashing/token providers.
- Resolvers do not contain business permission logic.
```

Bad:

```ts
// Resolver directly checks ownership and queries Prisma
```

Good:

```ts
// Resolver passes currentUser to use case.
// Use case loads resource and checks permission service.
```

## Admin Security

Admin operations must require role:

```txt
ADMIN
```

Moderator operations may allow:

```txt
ADMIN
MODERATOR
```

Admin operations must not expose:

```txt
password hashes
token hashes
private reset tokens
internal secrets
```

Admin user list may expose only safe user fields:

```txt
id
email
role
emailVerifiedAt
blockedAt
createdAt
deletedAt
```

Only ADMIN can:

```txt
block user
unblock user
set official deck
```

MODERATOR can:

```txt
moderate public decks
```

MODERATOR cannot:

```txt
block users
set official deck
change roles
```

## Frontend Security

Frontend must not:

```txt
- store access token in localStorage
- store refresh token in localStorage
- store secrets in EXPO_PUBLIC variables
- call AI provider directly
- call push provider directly
- rely on role visibility as security
```

Frontend may store:

```txt
- access token in memory
- mobile refresh token in Expo SecureStore
- public API URL in EXPO_PUBLIC_API_URL
```

## EXPO_PUBLIC Env Rule

Anything starting with:

```txt
EXPO_PUBLIC_
```

is public.

Do not put secrets there.

Allowed:

```txt
EXPO_PUBLIC_API_URL
```

Forbidden:

```txt
EXPO_PUBLIC_JWT_SECRET
EXPO_PUBLIC_AI_API_KEY
EXPO_PUBLIC_INTERNAL_JOB_SECRET
EXPO_PUBLIC_DATABASE_URL
```

## Logging Rules

Safe to log:

```txt
request id
user id
operation name
error code
safe error message
timestamp
delivery status
```

Do not log:

```txt
password
passwordHash
access token
refresh token
token hash
DATABASE_URL
API keys
internal job secret
raw push token
```

## Deployment Security

Before deploying, verify:

```txt
- no real secrets are committed
- production env variables are configured in hosting dashboards
- backend production config fails on missing secrets
- production CORS is configured
- database migrations are applied
- internal job secret is set
- frontend uses production GraphQL URL
- frontend env contains no secrets
```

## Release Security Checklist

Before MVP release:

```txt
- Search repository for "DATABASE_URL="
- Search repository for "JWT_"
- Search repository for "API_KEY"
- Search repository for "SECRET"
- Confirm .env files are not tracked
- Confirm .env.example has placeholders only
- Confirm GraphQL safe user output
- Confirm token hashes only in database
- Confirm production CORS is not wildcard
- Confirm internal job endpoint rejects invalid secret
```

Suggested local checks:

```bash
git status
git grep "DATABASE_URL="
git grep "JWT_ACCESS_SECRET"
git grep "JWT_REFRESH_SECRET"
git grep "INTERNAL_JOB_SECRET"
git grep "API_KEY"
```

If a real secret was committed:

```txt
- rotate the secret immediately
- remove it from Git history if necessary
- do not just delete it in a later commit
```

## Testing Requirements

Security-related tests should cover:

```txt
- register does not return passwordHash
- login does not return passwordHash
- refresh token rotation works
- reused refresh token fails
- logout revokes refresh token
- password reset revokes refresh tokens
- blocked user cannot refresh
- private deck forbidden for non-owner
- public rejected deck hidden
- group member can view shared deck
- group member cannot edit shared deck
- USER cannot access admin operations
- MODERATOR cannot block users
- internal job rejects invalid secret
```

## Cursor Implementation Rules

Cursor must read this document before implementing or modifying:

```txt
auth
tokens
password reset
GraphQL guards
deck permissions
group permissions
admin features
CSV import
AI examples
notifications
deployment
GitHub Actions
release checklist
```

Implementation must follow this document exactly unless this document is explicitly updated.
