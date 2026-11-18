# EPIC-41 Password Strength Validation

## Epic Goal

Enforce stronger password requirements everywhere a password is set or changed: minimum 8 characters, at least one uppercase letter, one lowercase letter, and one digit. Show live per-rule feedback on the sign-up form (red → green as rules are met); enable the submit button only when all rules pass. Apply the same rules on the backend and to the reset-password and change-password flows.

## Scope

```txt
- Backend: stricter password validation in RegisterUserUseCase and ResetPasswordUseCase
- Backend: new ChangePasswordUseCase + GraphQL mutation (requires current password)
- Frontend sign-up: live password strength checklist (red/green per rule), submit disabled until all pass
- Frontend reset-password: same stricter schema validation (no live checklist needed)
- Frontend: new change-password screen and form in profile/settings
- i18n: new keys for each rule and for change-password UI in en and uk
```

## This Epic Does Not Include

```txt
- Password strength meter / score bar
- Special character requirements
```

## Epic Status

IN PROGRESS

## Related Documents

Cursor must read these documents before working on this epic:

```txt
docs/architecture.md
docs/backend-clean-architecture.md
docs/security/security-checklist.md
docs/tasks/README.md
docs/tasks/cursor-task-template.md
```

## Epic Rules

```txt
- Each task must have one commit.
- Commit format: TASK-41.XX <task title>
- Each commit must include both the code change and the updated epic doc (task description added).
- Do not push to remote.
- Do not add Claude as co-author.
```

---

# TASK-41.01 Backend: enforce uppercase, lowercase, digit rules in password validation

## Status

DONE

## Context

`RegisterUserUseCase` and `ResetPasswordUseCase` currently validate only password length (8–128 chars). With payment features planned, stronger validation is needed on the backend — the frontend is UX only and must not be the sole guard.

## Goal

Add three new regex checks to both use cases: at least one uppercase letter, one lowercase letter, one digit.

## Related Documents

```txt
docs/backend-clean-architecture.md
docs/security/security-checklist.md
```

## Files to Create

```txt
None
```

## Files to Modify

```txt
apps/api/src/modules/auth/application/use-cases/register-user.use-case.ts
apps/api/src/modules/auth/application/use-cases/reset-password.use-case.ts
```

## Requirements

```txt
1. Add PASSWORD_UPPERCASE_REGEX = /[A-Z]/ constant.
2. Add PASSWORD_LOWERCASE_REGEX = /[a-z]/ constant.
3. Add PASSWORD_DIGIT_REGEX = /[0-9]/ constant.
4. After the length check, test each regex; throw ApplicationError(ErrorCodes.VALIDATION_ERROR, ...) for each failure.
5. Apply the same changes to ResetPasswordUseCase.
6. Update register-user.use-case.spec.ts and reset-password.use-case.spec.ts:
   - Replace any test passwords that no longer pass the new rules with strong ones (e.g. "Password1").
   - Add test cases that confirm each new rule is enforced (uppercase, lowercase, digit).
```

## Security Requirements

```txt
- Do not log the password value.
- Do not expose passwordHash.
```

## Architecture Constraints

```txt
- Validation stays in the use case (application layer).
- Do not add validation to the GraphQL input class.
- Do not import Prisma in the use case.
```

## Acceptance Criteria

```txt
- Registering with "password1" (no uppercase) returns a VALIDATION_ERROR.
- Registering with "Password" (no digit) returns a VALIDATION_ERROR.
- Registering with "PASSWORD1" (no lowercase) returns a VALIDATION_ERROR.
- Registering with "Password1" succeeds (length ≥ 8, has upper, lower, digit).
- API builds without errors.
- Existing unit tests pass; update test cases that use weak passwords.
```

## Commands to Run

```bash
pnpm --filter @flashcards/api test
pnpm --filter @flashcards/api build
pnpm format:check
pnpm lint
```

## Manual Checks

```txt
None — covered by unit tests and acceptance criteria above.
```

## Do Not Do

```txt
- Do not add special character requirements.
- Do not change the GraphQL schema.
- Do not touch frontend files.
```

## Expected Commit Message

```txt
TASK-41.01 Backend: enforce uppercase, lowercase, digit rules in password validation
```

---

# TASK-41.02 Frontend: add password strength checklist to sign-up form

## Status

TODO

## Context

The sign-up form (`sign-up-form.tsx`) shows a single hint "Password must be at least 8 characters". After TASK-41.01 the backend requires uppercase, lowercase, and digit as well. The form must show live per-rule feedback so the user knows exactly what is missing before submitting.

## Goal

Replace the existing single password hint with a `PasswordStrengthChecklist` component that shows four rules. Each rule is red by default and turns green as the user types. The submit button stays disabled until all four rules are green.

## Related Documents

```txt
docs/tasks/cursor-task-template.md
```

## Files to Create

```txt
apps/mobile/src/features/auth/components/password-strength-checklist.tsx
```

## Files to Modify

```txt
apps/mobile/src/features/auth/validation/sign-up.schema.ts
apps/mobile/src/features/auth/components/sign-up-form.tsx
apps/mobile/src/i18n/resources/en/auth.ts
apps/mobile/src/i18n/resources/uk/auth.ts
```

## Requirements

```txt
1. Create PasswordStrengthChecklist component:
   - Accepts `password: string` prop.
   - Shows four rows, each with a colored dot (red / green) and label:
       • At least 8 characters
       • At least one uppercase letter
       • At least one lowercase letter
       • At least one digit
   - Rule is green when its condition is met, red otherwise.
   - Use AppText for labels; no external libraries needed.

2. Update sign-up.schema.ts:
   - Add .regex(/[A-Z]/, t('auth.validation.passwordUppercase'))
   - Add .regex(/[a-z]/, t('auth.validation.passwordLowercase'))
   - Add .regex(/[0-9]/, t('auth.validation.passwordDigit'))

3. Update sign-up-form.tsx:
   - Render PasswordStrengthChecklist below the password input, passing the current password value.
   - Show checklist when the password field is focused OR has a value.
   - Disable the submit button while any rule is not met (derive from password value directly, not from form errors).
   - Remove the old showPasswordHint / passwordMin hint.

4. Add i18n keys (en + uk):
   - auth.validation.passwordUppercase
   - auth.validation.passwordLowercase
   - auth.validation.passwordDigit
   - auth.passwordStrength.minLength
   - auth.passwordStrength.uppercase
   - auth.passwordStrength.lowercase
   - auth.passwordStrength.digit
```

## Security Requirements

```txt
- Do not store password value outside React state.
- Do not log password.
```

## Architecture Constraints

```txt
- Frontend only — no backend changes in this task.
- Use existing AppText primitive.
- Do not use external password-strength libraries.
```

## Acceptance Criteria

```txt
- Checklist appears when the password field is focused.
- Each rule starts red.
- Each rule turns green as soon as its condition is satisfied.
- Submit button is disabled while any rule is red.
- Submit button becomes enabled when all four rules are green and passwords match.
- Mobile typecheck passes.
```

## Commands to Run

```bash
pnpm mobile:typecheck
pnpm format:check
pnpm lint
```

## Manual Checks

```txt
- Open sign-up screen in the browser.
- Click into the password field — checklist appears, all rules red.
- Type "a" — only lowercase turns green.
- Type "aA" — lowercase and uppercase green.
- Type "aA1" — three green.
- Type "aA1bbbbb" (8+ chars) — all four green, submit enabled.
- Submit with a weak password — button stays disabled.
```

## Do Not Do

```txt
- Do not add the checklist to the reset-password form.
- Do not add special character rule.
- Do not change the backend in this task.
```

## Expected Commit Message

```txt
TASK-41.02 Frontend: add password strength checklist to sign-up form
```

---

# TASK-41.03 Frontend: apply stricter password schema to reset-password form

## Status

TODO

## Context

`reset-password.schema.ts` currently validates only length. After TASK-41.01 the backend rejects passwords without uppercase, lowercase, or digit. The reset-password form must use the same rules so the user sees a clear error message instead of a generic backend error.

## Goal

Add the three new regex rules to `createResetPasswordSchema`. No checklist UI needed — field-level errors from react-hook-form are sufficient.

## Related Documents

```txt
docs/tasks/cursor-task-template.md
```

## Files to Create

```txt
None
```

## Files to Modify

```txt
apps/mobile/src/features/auth/validation/reset-password.schema.ts
```

## Requirements

```txt
1. Add .regex(/[A-Z]/, t('auth.validation.passwordUppercase')) to newPassword.
2. Add .regex(/[a-z]/, t('auth.validation.passwordLowercase')) to newPassword.
3. Add .regex(/[0-9]/, t('auth.validation.passwordDigit')) to newPassword.
   (i18n keys added in TASK-41.02)
```

## Security Requirements

```txt
- Do not log password.
```

## Architecture Constraints

```txt
- Frontend only.
- Reuse i18n keys from TASK-41.02 — do not add new keys.
```

## Acceptance Criteria

```txt
- Submitting "password1" (no uppercase) shows a field error.
- Submitting "Password" (no digit) shows a field error.
- Submitting "Password1" passes frontend validation and submits.
- Mobile typecheck passes.
```

## Commands to Run

```bash
pnpm mobile:typecheck
pnpm format:check
pnpm lint
```

## Manual Checks

```txt
- Open reset-password screen.
- Enter "password1" — field error about uppercase appears on submit.
- Enter "Password1" — no field error, form submits.
```

## Do Not Do

```txt
- Do not add a checklist UI to this form.
- Do not add new i18n keys — reuse keys from TASK-41.02.
- Do not touch sign-up form.
```

## Expected Commit Message

```txt
TASK-41.03 Frontend: apply stricter password schema to reset-password form
```

---

# TASK-41.04 Backend: add ChangePasswordUseCase and GraphQL mutation

## Status

TODO

## Context

There is no change-password feature in the app. OAuth users register without a password, so the change-password mutation must be available only to email/password users. The current password must be verified before setting a new one.

## Goal

Add `ChangePasswordUseCase` in the account module and expose it as a `changePassword` GraphQL mutation.

## Related Documents

```txt
docs/architecture.md
docs/backend-clean-architecture.md
docs/security/security-checklist.md
docs/domain/auth-token-strategy.md
```

## Files to Create

```txt
apps/api/src/modules/account/application/use-cases/change-password.use-case.ts
apps/api/src/modules/account/application/use-cases/change-password.use-case.spec.ts
apps/api/src/modules/account/presentation/graphql/inputs/change-password.input.ts
```

## Files to Modify

```txt
apps/api/src/modules/account/presentation/graphql/resolvers/account.resolver.ts
apps/api/src/modules/account/account.module.ts
apps/api/src/modules/account/application/use-cases/index.ts
```

## Requirements

```txt
1. ChangePasswordUseCase input: { userId, currentPassword, newPassword }.
2. Load user with passwordHash via UserRepositoryPort.
3. If user has no passwordHash (OAuth user) — throw ApplicationError(FORBIDDEN, 'Password change is not available for OAuth accounts').
4. Verify currentPassword against stored hash via PasswordHasherPort; throw ApplicationError(VALIDATION_ERROR, 'Current password is incorrect') on mismatch.
5. Apply the same strength rules as TASK-41.01 to newPassword (length, uppercase, lowercase, digit).
6. Hash newPassword and update via UserRepositoryPort.
7. Expose as mutation: changePassword(input: ChangePasswordInput): Boolean — requires GqlAuthGuard.
8. Write unit tests covering: success, wrong current password, OAuth user, weak new password.
```

## Security Requirements

```txt
- Do not log currentPassword or newPassword.
- Do not expose passwordHash.
- Operation requires authenticated user (GqlAuthGuard).
- Blocked users must be rejected by the guard.
```

## Architecture Constraints

```txt
- Use case in application layer; must not import Prisma directly.
- Resolver in presentation layer; must not contain business logic.
- Reuse PasswordHasherPort — do not call argon2 directly from the use case.
```

## Acceptance Criteria

```txt
- changePassword mutation exists in the GraphQL schema.
- Calling with wrong currentPassword returns VALIDATION_ERROR.
- Calling for an OAuth user returns FORBIDDEN.
- Calling with a weak newPassword returns VALIDATION_ERROR.
- Calling with correct currentPassword and strong newPassword returns true.
- Unit tests pass.
- API builds.
```

## Commands to Run

```bash
pnpm --filter @flashcards/api test
pnpm --filter @flashcards/api build
pnpm format:check
pnpm lint
```

## Manual Checks

```txt
None — covered by unit tests.
```

## Do Not Do

```txt
- Do not invalidate existing refresh tokens after password change (out of scope).
- Do not touch frontend files.
- Do not add special character requirements.
```

## Expected Commit Message

```txt
TASK-41.04 Backend: add ChangePasswordUseCase and GraphQL mutation
```

---

# TASK-41.05 Frontend: add change-password screen to profile

## Status

TODO

## Context

After TASK-41.04 the backend exposes a `changePassword` mutation. OAuth users do not have a password, so the change-password entry point must be hidden for them. The profile screen (`profile-screen.tsx`) is the right place to add a "Change password" navigation row — only visible when the user has a `passwordHash` (i.e. is an email/password user). The actual form lives on a separate screen.

## Goal

Add a change-password screen with a form (current password, new password, confirm new password + strength checklist). Show a "Change password" row in the profile only for email/password users.

## Related Documents

```txt
docs/tasks/cursor-task-template.md
docs/domain/auth-token-strategy.md
```

## Files to Create

```txt
apps/mobile/src/features/profile/components/change-password-form.tsx
apps/mobile/src/features/profile/validation/change-password.schema.ts
apps/mobile/app/(tabs)/change-password.tsx
```

## Files to Modify

```txt
apps/mobile/app/(tabs)/_layout.tsx
apps/mobile/src/features/profile/screens/profile-screen.tsx
apps/mobile/src/i18n/resources/en/auth.ts
apps/mobile/src/i18n/resources/uk/auth.ts
apps/mobile/src/graphql/ (or generated — run codegen after backend is done)
```

## Requirements

```txt
1. Run GraphQL codegen after TASK-41.04 to get the generated hook.
2. Create change-password.schema.ts:
   - currentPassword: required string.
   - newPassword: same rules as sign-up schema (length, uppercase, lowercase, digit).
   - confirmPassword: must match newPassword.
3. Create ChangePasswordForm:
   - Fields: current password (with show/hide toggle), new password (with show/hide toggle + PasswordStrengthChecklist), confirm new password (with show/hide toggle).
   - On success: show a success message and navigate back.
   - On error: show the error message from the mutation.
4. Add route apps/mobile/app/(tabs)/change-password.tsx.
5. Register the route in (tabs)/_layout.tsx with headerShown: true and a localized title.
6. In profile-screen.tsx: show "Change password" nav row only when myAccount.user has no OAuth provider
   (check via a `hasPassword` field — or simply hide for OAuth users based on available account data).
7. Add i18n keys for the change-password UI in en and uk.
```

## Security Requirements

```txt
- Do not store currentPassword or newPassword outside React state.
- Do not log passwords.
- Do not show the change-password row to OAuth-only users.
- Access token stays in memory only — do not store it.
```

## Architecture Constraints

```txt
- Frontend only in this task.
- Use generated GraphQL hook from codegen.
- Reuse PasswordStrengthChecklist from TASK-41.02.
- Reuse i18n validation keys from TASK-41.02.
```

## Acceptance Criteria

```txt
- "Change password" row is visible in profile for email/password users.
- "Change password" row is hidden for OAuth-only users.
- Entering wrong current password shows an error.
- Entering a weak new password keeps the submit button disabled.
- Entering matching strong passwords and correct current password succeeds and navigates back.
- Mobile typecheck passes.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile codegen
pnpm mobile:typecheck
pnpm format:check
pnpm lint
```

## Manual Checks

```txt
- Sign in with an email/password account.
- Open Profile — "Change password" row is visible.
- Tap it — change-password screen opens.
- Enter wrong current password — error shown.
- Enter weak new password — submit disabled.
- Enter correct current password and strong new password — success, navigated back.
- Sign in with a Google/Apple account — "Change password" row is not visible.
```

## Do Not Do

```txt
- Do not add the checklist to reset-password form.
- Do not invalidate existing sessions after password change.
- Do not add backend changes in this task.
```

## Expected Commit Message

```txt
TASK-41.05 Frontend: add change-password screen to profile
```
