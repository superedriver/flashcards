# EPIC-03 Email Verification & Password Reset

## Epic Goal

Implement backend email verification and password reset flows for Flashcards.

This epic covers:

```txt
- email provider abstraction
- development email provider
- email verification token creation
- verification email sending after registration
- verify email mutation
- resend verification email mutation
- password reset request mutation
- password reset confirmation mutation
- refresh token revocation after password reset
```

This epic builds on backend auth from:

```txt
docs/tasks/02-auth.md
```

## Epic Status

TODO

## Related Documents

Cursor must read these documents before working on this epic:

```txt
docs/architecture.md
docs/backend-clean-architecture.md
docs/domain/auth-token-strategy.md
docs/security/security-checklist.md
docs/tasks/README.md
docs/tasks/cursor-task-template.md
docs/tasks/02-auth.md
```

## Epic Prerequisites

EPIC-02 should be complete.

Expected state:

```txt
- AuthModule exists.
- User model exists.
- EmailVerificationToken model exists.
- PasswordResetToken model exists.
- RegisterUserUseCase exists.
- LoginUseCase exists.
- RefreshTokenRepositoryPort exists.
- RefreshTokenRepositoryPort.revokeAllForUser exists.
- PasswordHasherPort exists.
- TokenGeneratorPort exists or can generate random tokens.
- TokenHasherPort exists.
```

## Epic Rules

```txt
1. Follow docs/domain/auth-token-strategy.md exactly.
2. Follow docs/security/security-checklist.md exactly.
3. Store only token hashes.
4. Never store raw verification/reset tokens.
5. Never log raw verification/reset tokens.
6. Never log passwords.
7. Password reset must revoke all active refresh tokens.
8. Email provider must be abstracted behind a port.
9. Development provider may log safe email content locally.
10. Do not add production email provider until configured.
```

## Token Rules

Email verification token:

```txt
- random high-entropy token
- stored only as hash
- expires in 24 hours
- single-use
```

Password reset token:

```txt
- random high-entropy token
- stored only as hash
- expires in 1 hour
- single-use
```

## Email Provider Strategy

MVP providers:

```txt
dev
resend later
brevo later
```

Development behavior:

```txt
- Dev provider logs recipient, subject, and verification/reset link.
- Dev provider must not log provider secrets.
```

Production behavior:

```txt
- Production provider must be selected by EMAIL_PROVIDER.
- Real provider implementation can be added later if not needed immediately.
```

## Epic Summary

```md
- [x] TASK-03.01 Add email module and email provider port
- [ ] TASK-03.02 Add development email provider
- [ ] TASK-03.03 Add email token repository ports
- [ ] TASK-03.04 Add Prisma email verification token repository
- [ ] TASK-03.05 Add Prisma password reset token repository
- [ ] TASK-03.06 Add email template helpers
- [ ] TASK-03.07 Add CreateEmailVerificationTokenUseCase
- [ ] TASK-03.08 Send verification email after registration
- [ ] TASK-03.09 Add VerifyEmailUseCase
- [ ] TASK-03.10 Add verifyEmail mutation
- [ ] TASK-03.11 Add ResendVerificationEmailUseCase
- [ ] TASK-03.12 Add resendVerificationEmail mutation
- [ ] TASK-03.13 Add RequestPasswordResetUseCase
- [ ] TASK-03.14 Add requestPasswordReset mutation
- [ ] TASK-03.15 Add ResetPasswordUseCase
- [ ] TASK-03.16 Add resetPassword mutation
- [ ] TASK-03.17 Add email verification and password reset final checks
```

---

# TASK-03.01 Add email module and email provider port

## Status

DONE

## Context

Email sending should be abstracted behind a provider port.

Auth use cases should not depend on a concrete email provider.

## Goal

Create email module and email provider port.

## Files to Create

```txt
apps/api/src/modules/email/email.module.ts
apps/api/src/modules/email/application/ports/email-provider.port.ts
apps/api/src/modules/email/application/types/email-message.type.ts
```

## Files to Modify

```txt
apps/api/src/app.module.ts
```

## Requirements

Create `EmailMessage` type:

```ts
export type EmailMessage = {
  to: string
  subject: string
  text: string
  html?: string
}
```

Create email provider port:

```ts
import { EmailMessage } from '../types/email-message.type'

export const EMAIL_PROVIDER = Symbol('EMAIL_PROVIDER')

export type EmailProviderPort = {
  send(message: EmailMessage): Promise<void>
}
```

Create `EmailModule`:

```ts
import { Module } from '@nestjs/common'

@Module({})
export class EmailModule {}
```

Import `EmailModule` into `AppModule`.

## Security Requirements

```txt
- Email provider must not expose API keys.
- Email provider must not log secrets.
- Email provider must not accept raw provider credentials from GraphQL input.
```

## Architecture Constraints

```txt
- Email provider port lives in application layer.
- Concrete email providers live in infrastructure.
- Auth use cases depend on EmailProviderPort, not concrete provider.
```

## Do Not Do

```txt
- Do not implement real Resend provider yet.
- Do not implement Brevo provider yet.
- Do not send email from GraphQL resolver.
```

## Acceptance Criteria

```txt
- EmailModule exists.
- EmailProviderPort exists.
- EmailMessage type exists.
- EmailModule is imported into AppModule.
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
chore(email): add email provider foundation
```

---

# TASK-03.02 Add development email provider

## Status

TODO

## Context

Local development needs a safe email provider that does not require a real external service.

## Goal

Add development email provider.

## Files to Create

```txt
apps/api/src/modules/email/infrastructure/dev-email.provider.ts
```

## Files to Modify

```txt
apps/api/src/modules/email/email.module.ts
```

## Requirements

Create `DevEmailProvider` implementing `EmailProviderPort`.

Behavior:

```txt
- log email recipient
- log email subject
- log text body
- log html body if present
```

It may use NestJS `Logger`.

Example log:

```txt
[DevEmailProvider] To: user@example.com
[DevEmailProvider] Subject: Verify your email
[DevEmailProvider] Text: ...
```

Register provider in `EmailModule`.

For MVP, `EMAIL_PROVIDER=dev` should use `DevEmailProvider`.

## Security Requirements

```txt
- Do not log provider API keys.
- Do not log passwords.
- Do not log refresh tokens.
- Dev provider may log verification/reset links locally only.
```

## Architecture Constraints

```txt
- Dev provider lives in infrastructure.
- Use cases still depend on EmailProviderPort.
```

## Do Not Do

```txt
- Do not integrate Resend yet.
- Do not integrate Brevo yet.
- Do not add frontend email UI.
```

## Acceptance Criteria

```txt
- DevEmailProvider exists.
- DevEmailProvider implements EmailProviderPort.
- EmailModule provides EMAIL_PROVIDER.
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
chore(email): add development email provider
```

---

# TASK-03.03 Add email token repository ports

## Status

TODO

## Context

Email verification and password reset use token records.

Use cases must depend on repository ports, not Prisma.

## Goal

Add repository ports for email verification and password reset tokens.

## Files to Create

```txt
apps/api/src/modules/auth/application/ports/email-verification-token-repository.port.ts
apps/api/src/modules/auth/application/ports/password-reset-token-repository.port.ts
```

## Requirements

Create `EmailVerificationTokenRepositoryPort`:

```ts
export const EMAIL_VERIFICATION_TOKEN_REPOSITORY = Symbol('EMAIL_VERIFICATION_TOKEN_REPOSITORY')

export type CreateEmailVerificationTokenInput = {
  userId: string
  tokenHash: string
  expiresAt: Date
}

export type EmailVerificationTokenRecord = {
  id: string
  userId: string
  tokenHash: string
  expiresAt: Date
  usedAt: Date | null
  createdAt: Date
}

export type EmailVerificationTokenRepositoryPort = {
  create(input: CreateEmailVerificationTokenInput): Promise<EmailVerificationTokenRecord>
  findValidByHash(tokenHash: string): Promise<EmailVerificationTokenRecord | null>
  markUsed(id: string): Promise<void>
  revokeActiveForUser(userId: string): Promise<void>
}
```

Create `PasswordResetTokenRepositoryPort`:

```ts
export const PASSWORD_RESET_TOKEN_REPOSITORY = Symbol('PASSWORD_RESET_TOKEN_REPOSITORY')

export type CreatePasswordResetTokenInput = {
  userId: string
  tokenHash: string
  expiresAt: Date
}

export type PasswordResetTokenRecord = {
  id: string
  userId: string
  tokenHash: string
  expiresAt: Date
  usedAt: Date | null
  createdAt: Date
}

export type PasswordResetTokenRepositoryPort = {
  create(input: CreatePasswordResetTokenInput): Promise<PasswordResetTokenRecord>
  findValidByHash(tokenHash: string): Promise<PasswordResetTokenRecord | null>
  markUsed(id: string): Promise<void>
  revokeActiveForUser(userId: string): Promise<void>
}
```

## Security Requirements

```txt
- Ports must not expose raw tokens.
- Ports may expose tokenHash only inside auth application internals.
- GraphQL must never return tokenHash.
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
- Do not implement use cases yet.
```

## Acceptance Criteria

```txt
- Email verification token repository port exists.
- Password reset token repository port exists.
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
chore(auth): add email token repository ports
```

---

# TASK-03.04 Add Prisma email verification token repository

## Status

TODO

## Context

Email verification tokens are stored as hashes.

## Goal

Add Prisma implementation of email verification token repository.

## Files to Create

```txt
apps/api/src/modules/auth/infrastructure/persistence/prisma-email-verification-token.repository.ts
```

## Files to Modify

```txt
apps/api/src/modules/auth/auth.module.ts
```

## Requirements

Implement:

```txt
create
findValidByHash
markUsed
revokeActiveForUser
```

`findValidByHash` should return token only when:

```txt
usedAt = null
expiresAt > now
```

`markUsed` should set:

```txt
usedAt = new Date()
```

`revokeActiveForUser` should mark all unused active verification tokens as used.

## Security Requirements

```txt
- Store tokenHash only.
- Never store raw verification token.
- Never log raw token.
- Never expose tokenHash through GraphQL.
```

## Architecture Constraints

```txt
- Repository lives in infrastructure.
- Use cases depend on EmailVerificationTokenRepositoryPort.
```

## Do Not Do

```txt
- Do not implement verification use case yet.
- Do not implement GraphQL mutation yet.
```

## Acceptance Criteria

```txt
- PrismaEmailVerificationTokenRepository exists.
- Repository implements port.
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
chore(auth): add Prisma email verification token repository
```

---

# TASK-03.05 Add Prisma password reset token repository

## Status

TODO

## Context

Password reset tokens are stored as hashes.

## Goal

Add Prisma implementation of password reset token repository.

## Files to Create

```txt
apps/api/src/modules/auth/infrastructure/persistence/prisma-password-reset-token.repository.ts
```

## Files to Modify

```txt
apps/api/src/modules/auth/auth.module.ts
```

## Requirements

Implement:

```txt
create
findValidByHash
markUsed
revokeActiveForUser
```

`findValidByHash` should return token only when:

```txt
usedAt = null
expiresAt > now
```

`markUsed` should set:

```txt
usedAt = new Date()
```

`revokeActiveForUser` should mark all unused active reset tokens as used.

## Security Requirements

```txt
- Store tokenHash only.
- Never store raw reset token.
- Never log raw token.
- Never expose tokenHash through GraphQL.
```

## Architecture Constraints

```txt
- Repository lives in infrastructure.
- Use cases depend on PasswordResetTokenRepositoryPort.
```

## Do Not Do

```txt
- Do not implement reset use case yet.
- Do not implement GraphQL mutation yet.
```

## Acceptance Criteria

```txt
- PrismaPasswordResetTokenRepository exists.
- Repository implements port.
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
chore(auth): add Prisma password reset token repository
```

---

# TASK-03.06 Add email template helpers

## Status

TODO

## Context

Verification and password reset emails need consistent text/html content.

## Goal

Add email template helper functions.

## Files to Create

```txt
apps/api/src/modules/auth/application/email/email-templates.ts
```

## Requirements

Create functions:

```ts
export function buildVerificationEmail(input: { appWebUrl: string; token: string }): {
  subject: string
  text: string
  html: string
}

export function buildPasswordResetEmail(input: { appWebUrl: string; token: string }): {
  subject: string
  text: string
  html: string
}
```

Verification link:

```txt
${APP_WEB_URL}/verify-email?token=<raw_token>
```

Password reset link:

```txt
${APP_WEB_URL}/reset-password?token=<raw_token>
```

Email copy should be simple:

```txt
- explain purpose
- include link
- mention expiration
- say ignore if user did not request it
```

## Security Requirements

```txt
- Do not include password.
- Do not include refresh token.
- Do not include access token.
- Only include verification/reset raw token inside intended email link.
```

## Architecture Constraints

```txt
- Template helpers should not call provider directly.
- Template helpers should not query database.
```

## Do Not Do

```txt
- Do not add complex template engine.
- Do not add branding assets.
```

## Acceptance Criteria

```txt
- Verification email template helper exists.
- Password reset email template helper exists.
- Links use APP_WEB_URL.
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
chore(auth): add auth email templates
```

---

# TASK-03.07 Add CreateEmailVerificationTokenUseCase

## Status

TODO

## Context

After registration or resend request, backend needs to create a verification token and send verification email.

## Goal

Implement use case to create email verification token and send email.

## Files to Create

```txt
apps/api/src/modules/auth/application/use-cases/create-email-verification-token.use-case.ts
```

## Files to Modify

```txt
apps/api/src/modules/auth/auth.module.ts
```

## Requirements

Input:

```ts
export type CreateEmailVerificationTokenInput = {
  userId: string
  email: string
}
```

Use case must:

```txt
1. Revoke active verification tokens for user.
2. Generate raw token.
3. Hash raw token.
4. Store token hash with 24h expiry.
5. Build verification email.
6. Send email through EmailProviderPort.
7. Return success.
```

Use config:

```txt
APP_WEB_URL
```

Expiry:

```txt
24 hours
```

## Security Requirements

```txt
- Store only token hash.
- Send raw token only through email link.
- Do not log raw token except dev email provider local output.
- Do not expose tokenHash.
```

## Architecture Constraints

```txt
- Use case depends on ports.
- Use case must not import Prisma.
- Use case must not import GraphQL decorators.
- Email sending must happen through EmailProviderPort.
```

## Do Not Do

```txt
- Do not implement resolver in this task.
- Do not verify email in this task.
```

## Acceptance Criteria

```txt
- Use case exists.
- Active old verification tokens are revoked.
- New token hash is stored.
- Verification email is sent.
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
feat(auth): add email verification token use case
```

---

# TASK-03.08 Send verification email after registration

## Status

TODO

## Context

After a user registers, the backend should send a verification email.

Registration itself was implemented in EPIC-02.

## Goal

Update registration flow to send verification email.

## Files to Modify

```txt
apps/api/src/modules/auth/application/use-cases/register-user.use-case.ts
apps/api/src/modules/auth/auth.module.ts
```

## Requirements

After successful user creation:

```txt
1. Create auth tokens as before.
2. Trigger CreateEmailVerificationTokenUseCase or equivalent service.
3. Return auth payload.
```

If email sending fails:

Recommended MVP behavior:

```txt
- registration still succeeds
- log safe error internally
- user can request resend verification later
```

Do not return raw verification token in GraphQL.

## Security Requirements

```txt
- Do not return verification token from register mutation.
- Do not expose tokenHash.
- Do not log provider secrets.
```

## Architecture Constraints

```txt
- Resolver should not send email.
- Registration use case or an application service should trigger email sending.
```

## Do Not Do

```txt
- Do not make email verification required for login yet.
- Do not block registration if dev email provider logs only.
```

## Acceptance Criteria

```txt
- Register creates verification token.
- Register sends verification email through provider.
- Register still returns auth payload.
- Verification token is not returned in GraphQL.
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
feat(auth): send verification email after registration
```

---

# TASK-03.09 Add VerifyEmailUseCase

## Status

TODO

## Context

Users need to verify their email address through a token.

## Goal

Implement email verification use case.

## Files to Create

```txt
apps/api/src/modules/auth/application/use-cases/verify-email.use-case.ts
```

## Files to Modify

```txt
apps/api/src/modules/auth/application/ports/user-repository.port.ts
apps/api/src/modules/auth/infrastructure/persistence/prisma-user.repository.ts
apps/api/src/modules/auth/auth.module.ts
```

## Requirements

Extend `UserRepositoryPort` with:

```ts
markEmailVerified(userId: string, verifiedAt: Date): Promise<SafeUser>
```

Use case input:

```ts
export type VerifyEmailInput = {
  token: string
}
```

Use case must:

```txt
1. Hash raw token.
2. Find valid verification token by hash.
3. If missing/expired/used, throw validation error.
4. Mark user's email as verified.
5. Mark token as used.
6. Return safe user.
```

## Security Requirements

```txt
- Do not log raw token.
- Do not expose tokenHash.
- Token is single-use.
```

## Architecture Constraints

```txt
- Use case depends on repository ports.
- Use case must not import Prisma.
- Use case must not import GraphQL decorators.
```

## Do Not Do

```txt
- Do not implement resolver yet.
- Do not change login policy unless explicitly required.
```

## Acceptance Criteria

```txt
- VerifyEmailUseCase exists.
- Valid token verifies user email.
- Used token cannot be reused.
- Expired token fails.
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
feat(auth): add verify email use case
```

---

# TASK-03.10 Add verifyEmail mutation

## Status

TODO

## Context

Frontend needs a mutation to verify email.

## Goal

Add `verifyEmail` GraphQL mutation.

## Files to Create

```txt
apps/api/src/modules/auth/presentation/graphql/inputs/verify-email.input.ts
```

## Files to Modify

```txt
apps/api/src/modules/auth/presentation/graphql/resolvers/auth.resolver.ts
apps/api/src/modules/auth/auth.module.ts
```

## Requirements

Input:

```txt
VerifyEmailInput:
- token
```

Add mutation:

```graphql
verifyEmail(input: VerifyEmailInput!): SafeUserType!
```

Resolver must:

```txt
- accept token
- call VerifyEmailUseCase
- return safe user
```

Resolver must not:

```txt
- hash token directly
- query Prisma
- expose tokenHash
```

## Security Requirements

```txt
- Do not log token.
- Do not return tokenHash.
- Do not expose internal reason if token invalid.
```

## Acceptance Criteria

```txt
- verifyEmail mutation exists.
- Valid token verifies email.
- Invalid token fails.
- Sensitive fields are not returned.
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
feat(auth): add verify email mutation
```

---

# TASK-03.11 Add ResendVerificationEmailUseCase

## Status

TODO

## Context

Users may need to resend email verification.

## Goal

Implement resend verification email use case.

## Files to Create

```txt
apps/api/src/modules/auth/application/use-cases/resend-verification-email.use-case.ts
```

## Files to Modify

```txt
apps/api/src/modules/auth/auth.module.ts
```

## Requirements

Input:

```ts
export type ResendVerificationEmailInput = {
  userId: string
}
```

Use case must:

```txt
1. Load user.
2. If user missing, throw not found/unauthorized.
3. If user blocked, reject.
4. If email already verified, return success without sending or return user state.
5. Create new email verification token.
6. Send verification email.
7. Return success.
```

Recommended output:

```ts
export type ResendVerificationEmailResult = {
  success: boolean
}
```

## Security Requirements

```txt
- Do not expose token.
- Do not expose tokenHash.
- Do not allow resending for another user.
```

## Architecture Constraints

```txt
- Use case depends on ports/use cases.
- Resolver must pass current authenticated user id.
```

## Do Not Do

```txt
- Do not implement resolver in this task.
- Do not allow anonymous resend by arbitrary email in MVP.
```

## Acceptance Criteria

```txt
- ResendVerificationEmailUseCase exists.
- Authenticated user can resend own verification email.
- Already verified user does not create unnecessary token.
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
feat(auth): add resend verification use case
```

---

# TASK-03.12 Add resendVerificationEmail mutation

## Status

TODO

## Context

Frontend needs a mutation for resending verification email.

## Goal

Add protected `resendVerificationEmail` mutation.

## Files to Modify

```txt
apps/api/src/modules/auth/presentation/graphql/resolvers/auth.resolver.ts
apps/api/src/modules/auth/auth.module.ts
```

## Requirements

Add mutation:

```graphql
resendVerificationEmail: Boolean!
```

Mutation must:

```txt
- require GqlAuthGuard
- use CurrentUser
- call ResendVerificationEmailUseCase
- return success boolean
```

Resolver must not:

```txt
- accept arbitrary email
- send email directly
- query Prisma
```

## Security Requirements

```txt
- User can resend only for own account.
- Do not expose token.
- Do not expose tokenHash.
```

## Acceptance Criteria

```txt
- resendVerificationEmail mutation exists.
- Mutation requires auth.
- Mutation sends verification email for current user.
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
feat(auth): add resend verification mutation
```

---

# TASK-03.13 Add RequestPasswordResetUseCase

## Status

TODO

## Context

Users need to request password reset by email.

This operation should not reveal whether an email exists.

## Goal

Implement password reset request use case.

## Files to Create

```txt
apps/api/src/modules/auth/application/use-cases/request-password-reset.use-case.ts
```

## Files to Modify

```txt
apps/api/src/modules/auth/auth.module.ts
```

## Requirements

Input:

```ts
export type RequestPasswordResetInput = {
  email: string
}
```

Output:

```ts
export type RequestPasswordResetResult = {
  success: boolean
}
```

Use case must:

```txt
1. Normalize email.
2. Try to find user by email.
3. Always return success from public API.
4. If user does not exist, do nothing.
5. If user exists and is not blocked:
   - revoke active reset tokens
   - generate raw reset token
   - hash token
   - store token hash with 1h expiry
   - send password reset email
```

Password reset link:

```txt
${APP_WEB_URL}/reset-password?token=<raw_token>
```

## Security Requirements

```txt
- Do not reveal whether email exists.
- Do not log raw reset token.
- Do not expose tokenHash.
- Do not send reset email for blocked user unless policy explicitly allows.
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
- Do not reset password in this task.
```

## Acceptance Criteria

```txt
- RequestPasswordResetUseCase exists.
- Existing user gets reset email.
- Missing user still returns success.
- Reset token hash is stored.
- Raw token is not stored.
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
feat(auth): add password reset request use case
```

---

# TASK-03.14 Add requestPasswordReset mutation

## Status

TODO

## Context

Frontend needs a mutation to request password reset.

## Goal

Add public `requestPasswordReset` mutation.

## Files to Create

```txt
apps/api/src/modules/auth/presentation/graphql/inputs/request-password-reset.input.ts
```

## Files to Modify

```txt
apps/api/src/modules/auth/presentation/graphql/resolvers/auth.resolver.ts
apps/api/src/modules/auth/auth.module.ts
```

## Requirements

Input:

```txt
RequestPasswordResetInput:
- email
```

Add mutation:

```graphql
requestPasswordReset(input: RequestPasswordResetInput!): Boolean!
```

Resolver must:

```txt
- accept email
- call RequestPasswordResetUseCase
- return success boolean
```

Resolver must not:

```txt
- reveal if email exists
- send email directly
- query Prisma
```

## Security Requirements

```txt
- Always return generic success where practical.
- Do not expose reset token.
- Do not expose tokenHash.
```

## Acceptance Criteria

```txt
- requestPasswordReset mutation exists.
- Mutation is public.
- Existing and missing email both return generic success.
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
feat(auth): add password reset request mutation
```

---

# TASK-03.15 Add ResetPasswordUseCase

## Status

TODO

## Context

Users need to set a new password with a valid password reset token.

After password reset, all active refresh tokens must be revoked.

## Goal

Implement reset password use case.

## Files to Create

```txt
apps/api/src/modules/auth/application/use-cases/reset-password.use-case.ts
```

## Files to Modify

```txt
apps/api/src/modules/auth/application/ports/user-repository.port.ts
apps/api/src/modules/auth/infrastructure/persistence/prisma-user.repository.ts
apps/api/src/modules/auth/auth.module.ts
```

## Requirements

Extend `UserRepositoryPort`:

```ts
updatePasswordHash(userId: string, passwordHash: string): Promise<void>
```

Input:

```ts
export type ResetPasswordInput = {
  token: string
  newPassword: string
}
```

Output:

```ts
export type ResetPasswordResult = {
  success: boolean
}
```

Use case must:

```txt
1. Validate new password length.
2. Hash raw reset token.
3. Find valid password reset token by hash.
4. If missing/expired/used, reject.
5. Hash new password with Argon2.
6. Update user's passwordHash.
7. Mark reset token as used.
8. Revoke all active refresh tokens for user.
9. Return success.
```

Recommended password rules:

```txt
min length = 8
max length = 128
```

## Security Requirements

```txt
- Do not log new password.
- Do not log reset token.
- Do not expose tokenHash.
- Password reset must revoke all active refresh tokens.
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
- Do not auto-login user after reset in MVP.
```

## Acceptance Criteria

```txt
- ResetPasswordUseCase exists.
- Valid token updates password.
- Used token cannot be reused.
- Expired token fails.
- All active refresh tokens are revoked.
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
feat(auth): add reset password use case
```

---

# TASK-03.16 Add resetPassword mutation

## Status

TODO

## Context

Frontend needs a mutation to complete password reset.

## Goal

Add public `resetPassword` mutation.

## Files to Create

```txt
apps/api/src/modules/auth/presentation/graphql/inputs/reset-password.input.ts
```

## Files to Modify

```txt
apps/api/src/modules/auth/presentation/graphql/resolvers/auth.resolver.ts
apps/api/src/modules/auth/auth.module.ts
```

## Requirements

Input:

```txt
ResetPasswordInput:
- token
- newPassword
```

Add mutation:

```graphql
resetPassword(input: ResetPasswordInput!): Boolean!
```

Resolver must:

```txt
- accept token and new password
- call ResetPasswordUseCase
- return success boolean
```

Resolver must not:

```txt
- hash password directly
- hash token directly
- query Prisma
```

## Security Requirements

```txt
- Do not log token.
- Do not log password.
- Do not expose tokenHash.
- Do not auto-login user.
```

## Acceptance Criteria

```txt
- resetPassword mutation exists.
- Valid token resets password.
- All refresh tokens are revoked.
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
feat(auth): add reset password mutation
```

---

# TASK-03.17 Add email verification and password reset final checks

## Status

TODO

## Context

Email verification and password reset are security-sensitive flows.

## Goal

Run final checks for this epic.

## Manual GraphQL Checks

Verify:

```txt
- register sends verification email
- verifyEmail works with valid token
- verifyEmail fails with invalid token
- verifyEmail token cannot be reused
- resendVerificationEmail requires auth
- resendVerificationEmail sends new token
- requestPasswordReset returns success for existing email
- requestPasswordReset returns success for missing email
- resetPassword works with valid token
- resetPassword fails with invalid token
- resetPassword token cannot be reused
- resetPassword revokes all refresh tokens
- old refresh token cannot be used after password reset
```

## Security Checks

Verify:

```txt
- raw verification tokens are not stored
- raw reset tokens are not stored
- token hashes are not exposed in GraphQL
- passwords are not logged
- reset token is not logged except inside dev email link output
- password reset does not reveal whether email exists
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
- Do not move to profile/settings until checks pass.
- Do not expose tokens for frontend convenience.
- Do not skip refresh token revocation after reset.
```

## Acceptance Criteria

```txt
- Email verification works.
- Password reset works.
- Password reset revokes refresh tokens.
- Token hashes only are stored.
- Sensitive fields are not exposed.
- Format check passes.
- Lint passes.
- Prisma validate passes.
- API build passes.
- git status is clean after commit.
```

## Expected Commit Message

```txt
chore(auth): finalize email verification and password reset
```

---

## Epic Completion Criteria

EPIC-03 is complete when:

```txt
- EmailModule exists.
- EmailProviderPort exists.
- DevEmailProvider exists.
- Email verification token repository port exists.
- Password reset token repository port exists.
- Prisma email verification token repository exists.
- Prisma password reset token repository exists.
- Email template helpers exist.
- CreateEmailVerificationTokenUseCase exists.
- Register sends verification email.
- VerifyEmailUseCase exists.
- verifyEmail mutation works.
- ResendVerificationEmailUseCase exists.
- resendVerificationEmail mutation works.
- RequestPasswordResetUseCase exists.
- requestPasswordReset mutation works.
- ResetPasswordUseCase exists.
- resetPassword mutation works.
- password reset revokes all refresh tokens.
- token hashes only are stored.
- sensitive fields are not exposed.
- implementation follows docs/domain/auth-token-strategy.md.
- implementation follows docs/security/security-checklist.md.
```

After this epic is complete, move to:

```txt
docs/tasks/04-user-profile-settings.md
```
