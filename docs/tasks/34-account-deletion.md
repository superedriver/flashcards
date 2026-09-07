# EPIC-34 Account Deletion

## Epic Goal

Let an authenticated user permanently delete their account from Profile before production, with the same flow on mobile and web.

This epic covers:

```txt
- Live SoT for immediate, irreversible account deletion
- Hard-delete User in one DB transaction (Prisma cascade of owned rows)
- GraphQL deleteAccount
- Reminder job no-op if the user is already gone
- Profile Account Danger zone: two confirms, success Alert, then sign-in
- Public /account-deletion explainer (web)
- Smoke checklist
```

This epic does **not** include:

```txt
- Grace period or restore deleted account
- Soft-delete User as the end state
- Typing DELETE or password / Google / Apple re-auth
- Transferring group ownership
- Anonymizing public decks instead of deleting them
- Email after deletion
- Audit row for the deletion
- Keeping personal learning history or anonymous analytics for deleted users
- Blocking re-registration of the same email
- OAuth revoke / file-store cleanup jobs (no OAuth or user file store yet)
- Editing database backups
- A separate Settings screen
```

## Epic Status

TODO

## Related Documents

Cursor must read these documents before working on this epic:

```txt
docs/architecture.md
docs/backend-clean-architecture.md
docs/domain/permissions.md
docs/domain/auth-token-strategy.md
docs/security/security-checklist.md
docs/tasks/README.md
docs/tasks/cursor-task-template.md
docs/tasks/done/02-auth.md
docs/tasks/done/04-user-profile-settings.md
docs/tasks/done/10-groups-sharing.md
docs/tasks/done/11-notifications.md
docs/tasks/done/18-frontend-profile-settings-notifications.md
docs/tasks/done/22-auth-security-hardening.md
```

After TASK-34.01, also follow:

```txt
docs/domain/account-deletion.md
```

## Epic Prerequisites

EPIC-33 is complete (in `docs/tasks/done/`).

Expected state:

```txt
- Authenticated Profile shows settings + Account / Log out
- User.email is unique; User.deletedAt exists but self-delete is not implemented
- Owned rows cascade from User in Prisma (profile, settings, tokens, decks, reviews,
  sessions, CSV, AI logs, push tokens, study languages, preview sessions, memberships)
- Group.createdById cascades (owner's groups go with the user)
- Deck.sourceDeckId is a string, not an FK (copies of other users survive)
- Google/Apple login are not live; no user file store
- Logout clears auth + Apollo and goes to /(auth)/sign-in
- Local stack: Postgres + API (:3000) + mobile web (:8081)
```

## Agreed Decisions (Source of Truth)

`docs/domain/account-deletion.md` is the live SoT after TASK-34.01. This section is the decision record used to write that document.

### Flow

```txt
Profile (Account) → Delete account → confirm 1 → confirm 2 → deleteAccount
  → success Alert "Account deleted" → clear local auth/Apollo → /(auth)/sign-in
```

Confirm 1 (nothing deleted yet):

```txt
Title: Delete account?
Text: Are you sure you want to delete your account?
Buttons: Cancel, Continue
```

Confirm 2:

```txt
Title: Delete account permanently?
Text: Your account, decks, cards, learning progress, groups, and history will be
  permanently deleted. This action cannot be undone.
Buttons: Cancel, Delete account permanently
```

Do not require typing DELETE. Do not re-auth with password or OAuth.

### Placement

```txt
No separate Settings screen. Delete account is a Danger zone under Profile Account,
below Log out (same chrome idea as Delete Deck).
```

### After success / failure

```txt
Success: Alert Account deleted, then the same local teardown as logout, then sign-in.
Do not send a deletion email.

Failure of the mutation: do not logout, do not clear auth, do not show Account deleted.
Show: Couldn't delete your account. Please try again.
```

### Who can delete

```txt
Any valid authenticated session, including ADMIN and MODERATOR deleting themselves.
Blocked users stay rejected by existing auth (they cannot call the mutation).
```

### What is removed (our DB)

```txt
Hard-delete the User row (prisma.user.delete via repository). Email becomes free.
Owned application data goes with Prisma onDelete: Cascade (and owner groups via
Group.createdById). No "Deleted user" placeholder. No leftover memberships for that user.

Public decks the user owns are deleted. Copies owned by other users stay.
Do not null or rewrite sourceDeckId on those copies.

If the user created a group, the group is deleted even if it has other members.
Ownership is not transferred.

Personal learning/review/session/due/stats data is deleted. No anonymous analytics
row for the deleted user in v1.
```

### Jobs

```txt
due-card-reminders (and any other user-scoped job): if the user no longer exists, no-op.
Do not send push/email/import work for a deleted user.
```

### Out of epic (document in SoT, do not implement)

```txt
OAuth revoke and external file cleanup: add when Google/Apple or a file store exists.
Backups: standard retention; restore policy is infrastructure, not this epic.
```

### Public page (web)

```txt
Unauthenticated /account-deletion explains how to delete, what is removed, that it is
irreversible, and that the user must sign in. It does not call deleteAccount.
CTA goes to sign-in; after login the user deletes from Profile.
```

### Re-registration

```txt
The same email may register immediately as a fully new account. Nothing is restored.
```

### i18n

```txt
All new UI strings en and uk, in the task that introduces them.
```

## Epic Rules

```txt
1. One task = one focused commit. Do not combine tasks.
2. Do not start the next task until the current task is Status DONE and committed.
3. Do not refactor unrelated code.
4. Follow Agreed Decisions; after 34.01 follow docs/domain/account-deletion.md.
5. Backend is source of truth. Frontend must not delete local-only and pretend success.
6. Hard-delete User. Do not use User.deletedAt as the deletion end state.
7. Do not add OAuth revoke or file cleanup jobs in this epic.
8. Do not weaken auth, permissions, or the security checklist.
9. Translate any new user-facing strings (en/uk) in the task that adds them.
10. Each task’s Commands to Run must pass before commit. If blocked, stop and ask.
11. Do not push.
```

## Recommended Task Order

```txt
34.01                            live SoT
34.02 → 34.03                    use case, GraphQL mutation
34.04                            reminder job no-op
34.05                            Profile Danger zone + confirms + success/fail
34.06                            public /account-deletion
34.07                            smoke
```

## Epic Summary

```md
- [x] TASK-34.01 Add live account-deletion source of truth
- [x] TASK-34.02 Add DeleteAccountUseCase
- [x] TASK-34.03 Add deleteAccount GraphQL mutation
- [x] TASK-34.04 No-op due-card reminders when the user is gone
- [ ] TASK-34.05 Add Profile delete-account Danger zone
- [ ] TASK-34.06 Add public account-deletion page
- [ ] TASK-34.07 Add account-deletion smoke checks
```

---

# TASK-34.01 Add live account-deletion source of truth

## Status

DONE

## Context

Account deletion was agreed in chat. Live docs have no self-serve delete path.

## Goal

Write `docs/domain/account-deletion.md` from Agreed Decisions and point architecture + security + permissions at it.

## Related Documents

```txt
docs/tasks/34-account-deletion.md
docs/architecture.md
docs/backend-clean-architecture.md
docs/domain/permissions.md
docs/security/security-checklist.md
docs/tasks/README.md
```

## Files to Create

```txt
docs/domain/account-deletion.md
```

## Files to Modify

```txt
docs/architecture.md
docs/domain/permissions.md
docs/security/security-checklist.md
docs/tasks/34-account-deletion.md
```

## Requirements

```txt
1. Copy Agreed Decisions into account-deletion.md in product language.
2. architecture.md: Profile Danger zone; hard-delete User; copies of other users survive;
   no OAuth/file jobs in v1; success → Alert → sign-in.
3. permissions.md + security-checklist: deleteAccount is authenticated; blocked users rejected;
   no password in the mutation; do not log tokens.
4. Do not rewrite docs/tasks/done/*.
5. Mark TASK-34.01 DONE.
```

## Security Requirements

```txt
- Docs-only. Do not weaken permissions.
- Do not commit secrets.
```

## Architecture Constraints

```txt
- This task is documentation only.
```

## Implementation Notes

```txt
- State that User.deletedAt is unused for this flow; end state is no User row.
```

## Acceptance Criteria

```txt
- A reader of live SoT knows the two confirms, hard delete, group/deck copy rules, and failure UX.
- pnpm docs:lint and pnpm format:check pass.
```

## Commands to Run

```bash
pnpm format:check
pnpm docs:lint
```

## Manual Checks

```txt
None
```

## Do Not Do

```txt
- Do not change application code.
- Do not implement deleteAccount yet.
- Do not push.
```

## Expected Commit Message

```txt
TASK-34.01 Add live account-deletion source of truth
```

---

# TASK-34.02 Add DeleteAccountUseCase

## Status

DONE

## Context

There is no self-delete use case. Prisma already cascades owned rows from User. Copies owned by others must remain.

## Goal

Add DeleteAccountUseCase that hard-deletes the current user through USER_REPOSITORY in one operation. Reject missing and blocked users.

## Related Documents

```txt
docs/tasks/34-account-deletion.md
docs/domain/account-deletion.md
docs/backend-clean-architecture.md
docs/security/security-checklist.md
```

## Files to Create

```txt
apps/api/src/modules/account/application/use-cases/delete-account.use-case.ts
apps/api/src/modules/account/application/use-cases/delete-account.use-case.spec.ts
```

## Files to Modify

```txt
apps/api/src/modules/auth/application/ports/user-repository.port.ts
apps/api/src/modules/auth/infrastructure/persistence/prisma-user.repository.ts
apps/api/src/modules/account/account.module.ts
docs/tasks/34-account-deletion.md
```

## Requirements

```txt
1. UserRepositoryPort.deleteById(userId): Promise<void> implemented with prisma.user.delete.
2. DeleteAccountUseCase: load user; UNAUTHORIZED if missing; USER_BLOCKED if blockedAt set;
   then deleteById.
3. Use case does not import Prisma or GraphQL.
4. Tests: success calls deleteById; missing user; blocked user does not delete.
5. Mark TASK-34.02 DONE.
```

## Security Requirements

```txt
- Operation is for the authenticated user id only (caller passes currentUser.id).
- Blocked users must be rejected.
- Do not log password hashes or tokens.
- Do not commit secrets.
```

## Architecture Constraints

```txt
- Use case depends on USER_REPOSITORY port, not PrismaService.
- Prisma delete stays in the user repository.
- Do not soft-delete (no deletedAt).
```

## Implementation Notes

```txt
- prisma.user.delete cascades owned data. Do not enumerate every child table in the use case.
- Do not update other users' sourceDeckId.
```

## Acceptance Criteria

```txt
- deleteById exists on the user repository port and Prisma adapter.
- Use case tests pass.
- API build / account specs pass.
```

## Commands to Run

```bash
pnpm --filter @flashcards/api test -- delete-account.use-case.spec.ts
pnpm --filter @flashcards/api build
pnpm format:check
pnpm lint
```

## Manual Checks

```txt
None
```

## Do Not Do

```txt
- Do not add GraphQL yet.
- Do not add OAuth revoke.
- Do not push.
```

## Expected Commit Message

```txt
TASK-34.02 Add DeleteAccountUseCase
```

---

# TASK-34.03 Add deleteAccount GraphQL mutation

## Status

DONE

## Context

The use case exists. Clients need an authenticated mutation with no extra input.

## Goal

Expose `deleteAccount: Boolean!` (or a small success payload consistent with logout/deleteDeck) on AccountResolver. No password field.

## Related Documents

```txt
docs/tasks/34-account-deletion.md
docs/domain/account-deletion.md
docs/backend-clean-architecture.md
docs/security/security-checklist.md
```

## Files to Create

```txt
None unless a tiny payload type is required to match existing mutations
```

## Files to Modify

```txt
apps/api/src/modules/account/presentation/graphql/resolvers/account.resolver.ts
apps/api/src/modules/account/account.module.ts
apps/mobile/src/features/profile/graphql/ (or account graphql next to existing me/settings)
apps/mobile/codegen.ts if needed
docs/tasks/34-account-deletion.md
```

## Requirements

```txt
1. Mutation requires GqlAuthGuard. Resolver passes currentUser.id only.
2. Resolver contains no Prisma and no extra business rules.
3. Register the use case in AccountModule.
4. Add the mobile GraphQL document and run codegen.
5. Mark TASK-34.03 DONE.
```

## Security Requirements

```txt
- Authenticated only. Blocked users rejected by existing auth/use case.
- Do not accept password, DELETE token, or target userId from the client.
- Do not log access or refresh tokens.
- Do not commit secrets.
```

## Architecture Constraints

```txt
- GraphQL resolver must not access Prisma.
- GraphQL resolver must not contain business logic.
```

## Implementation Notes

```txt
- Match deleteDeck / logout style (Boolean or { success }) already used in the API.
```

## Acceptance Criteria

```txt
- Authenticated playground/client can call deleteAccount.
- Unauthenticated request is rejected.
- Mobile generated hook exists.
```

## Commands to Run

```bash
pnpm --filter @flashcards/api build
pnpm --filter @flashcards/mobile codegen
pnpm --filter @flashcards/mobile typecheck
pnpm format:check
pnpm lint
```

## Manual Checks

```txt
None (human deletion is TASK-34.05 / smoke)
```

## Do Not Do

```txt
- Do not wire the Profile button yet.
- Do not push.
```

## Expected Commit Message

```txt
TASK-34.03 Add deleteAccount GraphQL mutation
```

---

# TASK-34.04 No-op due-card reminders when the user is gone

## Status

DONE

## Context

due-card-reminders loads users via settings. After hard-delete, settings are gone, but any race or stale id must not send push.

## Goal

If a reminder target user no longer exists, skip that user (no-op). Do not fail the whole job.

## Related Documents

```txt
docs/tasks/34-account-deletion.md
docs/domain/account-deletion.md
docs/tasks/done/11-notifications.md
```

## Files to Create

```txt
None
```

## Files to Modify

```txt
apps/api/src/modules/notifications/application/use-cases/send-due-card-reminders.use-case.ts
apps/api/src/modules/notifications/application/use-cases/send-due-card-reminders.use-case.spec.ts
docs/tasks/34-account-deletion.md
```

## Requirements

```txt
1. Before sending to a userId, ensure the user still exists (findById). Missing → skip.
2. Cover with a unit test.
3. Mark TASK-34.04 DONE.
```

## Security Requirements

```txt
- Internal job stays guarded by InternalJobGuard (unchanged).
- Do not log push token values.
- Do not commit secrets.
```

## Architecture Constraints

```txt
- Use USER_REPOSITORY (or existing user lookup already in the module graph). Do not query Prisma in the use case.
```

## Implementation Notes

```txt
- cleanup-deck-preview-sessions deletes expired rows only; no user-exists change required unless a test proves it acts for a deleted user.
```

## Acceptance Criteria

```txt
- Reminder spec: missing user is skipped; job still returns.
- API tests for that use case pass.
```

## Commands to Run

```bash
pnpm --filter @flashcards/api test -- send-due-card-reminders.use-case.spec.ts
pnpm --filter @flashcards/api build
pnpm format:check
pnpm lint
```

## Manual Checks

```txt
None
```

## Do Not Do

```txt
- Do not add OAuth/file cleanup jobs.
- Do not push.
```

## Expected Commit Message

```txt
TASK-34.04 No-op due-card reminders when the user is gone
```

---

# TASK-34.05 Add Profile delete-account Danger zone

## Status

TODO

## Context

Profile Account only has Log out. Users need the two-confirm flow and the mutation.

## Goal

Add Delete account under Profile Account. Two confirms, mutation, failure stays logged in, success Alert then the same teardown as logout and sign-in.

## Related Documents

```txt
docs/tasks/34-account-deletion.md
docs/domain/account-deletion.md
docs/tasks/done/18-frontend-profile-settings-notifications.md
```

## Files to Create

```txt
apps/mobile/src/features/profile/hooks/use-delete-account.ts
```

## Files to Modify

```txt
apps/mobile/src/features/profile/screens/profile-screen.tsx
apps/mobile/src/i18n/resources/en/profile.ts
apps/mobile/src/i18n/resources/uk/profile.ts
docs/tasks/34-account-deletion.md
```

## Requirements

```txt
1. Danger zone text action under Log out (Delete account / Видалити акаунт).
2. Confirm 1 then confirm 2 with the agreed copy (en/uk). Cancel stops. Nothing is deleted until the mutation succeeds.
3. On GraphQL error: Couldn't delete your account. Please try again. Keep session.
4. On success: Alert Account deleted / Акаунт видалено; OK → clearAuthSession, Apollo clearStore,
   sign-in (reuse logout teardown; do not call logout mutation after the user row is gone).
5. Mark TASK-34.05 DONE.
```

## Security Requirements

```txt
- Frontend visibility is UX only.
- Do not store tokens in localStorage or sessionStorage.
- Do not log tokens.
- Do not commit secrets.
```

## Architecture Constraints

```txt
- Use the generated deleteAccount hook.
- Do not call the API with fetch from the screen.
```

## Implementation Notes

```txt
- Web: window.confirm for both steps is OK (same as other confirms). Step 2 may use confirmDestructiveAction.
- After deleteAccount succeeds, logout(refreshToken) is optional; the user no longer exists.
  Prefer local teardown only so a 401 from logout does not confuse the success path.
```

## Acceptance Criteria

```txt
- Profile shows Delete account. Two cancels leave the account intact.
- Failed mutation keeps the user on Profile, still signed in.
- Successful mutation shows Account deleted then sign-in.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm format:check
pnpm lint
```

## Manual Checks

```txt
1. Cancel on confirm 1 and 2: still signed in.
2. (After local API) complete deletion: Alert, then sign-in. Same email can register again.
```

## Do Not Do

```txt
- Do not add a Settings route.
- Do not add a full-screen success page.
- Do not push.
```

## Expected Commit Message

```txt
TASK-34.05 Add Profile delete-account Danger zone
```

---

# TASK-34.06 Add public account-deletion page

## Status

TODO

## Context

Store / web policy pages need a URL that explains deletion without performing it.

## Goal

Add unauthenticated `/account-deletion` (en/uk) with how-to, what is deleted, irreversible, must sign in. CTA to sign-in.

## Related Documents

```txt
docs/tasks/34-account-deletion.md
docs/domain/account-deletion.md
```

## Files to Create

```txt
apps/mobile/app/account-deletion.tsx
apps/mobile/src/features/profile/screens/account-deletion-info-screen.tsx
```

## Files to Modify

```txt
apps/mobile/app/_layout.tsx
apps/mobile/src/i18n/resources/en/profile.ts
apps/mobile/src/i18n/resources/uk/profile.ts
docs/tasks/34-account-deletion.md
```

## Requirements

```txt
1. Public route, no auth guard. Does not call deleteAccount.
2. Copy covers: sign in, Profile Account Delete account, two confirms, what is removed, irreversible.
3. Primary CTA → /(auth)/sign-in.
4. en/uk.
5. Register the Stack screen in the root layout.
6. Mark TASK-34.06 DONE.
```

## Security Requirements

```txt
- Page must not expose whether an email exists.
- Do not commit secrets.
```

## Architecture Constraints

```txt
- Informational UI only. No GraphQL on this screen.
```

## Implementation Notes

```txt
- Keep the layout in the same ~480–600px content column as other simple pages.
```

## Acceptance Criteria

```txt
- http://localhost:8081/account-deletion loads logged out.
- CTA opens sign-in. No deletion happens from this page.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm format:check
pnpm lint
```

## Manual Checks

```txt
1. Open /account-deletion in web logged out. Read copy. Tap CTA → sign-in.
```

## Do Not Do

```txt
- Do not put a delete button on this page.
- Do not push.
```

## Expected Commit Message

```txt
TASK-34.06 Add public account-deletion page
```

---

# TASK-34.07 Add account-deletion smoke checks

## Status

TODO

## Context

Manual QA needs a local checklist: Profile flow, copies/groups, re-register, public page, failure path.

## Goal

Add `docs/smoke/account-deletion.md` and a short section in mvp-smoke-tests.md.

## Related Documents

```txt
docs/tasks/34-account-deletion.md
docs/domain/account-deletion.md
docs/release/mvp-smoke-tests.md
```

## Files to Create

```txt
docs/smoke/account-deletion.md
```

## Files to Modify

```txt
docs/release/mvp-smoke-tests.md
docs/tasks/34-account-deletion.md
```

## Requirements

```txt
1. Checklist: two confirms, cancel, success Alert + sign-in, re-register same email empty account,
   other user's copied deck still there, owner group gone, /account-deletion logged out,
   failed API stays signed in (optional if hard to simulate).
2. Do not record real passwords.
3. Mark TASK-34.07 DONE.
```

## Security Requirements

```txt
- Do not commit secrets or real user emails from production.
```

## Architecture Constraints

```txt
- Docs only.
```

## Implementation Notes

```txt
- Use a disposable local user, not demo@ if that would wipe shared seed fixtures the tester still needs.
```

## Acceptance Criteria

```txt
- Smoke file exists and mvp-smoke-tests.md links it.
- pnpm docs:lint passes.
```

## Commands to Run

```bash
pnpm format:check
pnpm docs:lint
```

## Manual Checks

```txt
None (the smoke file is the checklist)
```

## Do Not Do

```txt
- Do not change application code.
- Do not push.
```

## Expected Commit Message

```txt
TASK-34.07 Add account-deletion smoke checks
```
