# EPIC-35 Account Deletion Prod Gaps

## Epic Goal

Close production gaps in self-serve account deletion after EPIC-34: leftover invitations, blocked-identity re-registration, blocked-user access limited to Profile + delete, stale JWTs, local/web session leftovers, and copy provenance.

This epic covers:

```txt
- SoT updates from post-34 review
- Incoming GroupInvitation rows deleted with the User (same DB transaction)
- Blocked email identity stored in DB (no admin UI yet)
- Blocked user may log in and delete; cannot use the rest of the product
- Register of a banned email looks like “email already exists”
- GqlAuthGuard: valid JWT and User row still exists
- Web refresh cookie cleared on deleteAccount
- clearCurrentPushToken + treat lost-response UNAUTHENTICATED as success
- Finalized deck copies do not keep sourceDeckId (migration + new copies)
- Smoke updates
```

This epic does **not** include:

```txt
- Admin UI to list/unban emails (DB row only; unban live users still via existing Unblock)
- Postgres integration tests or CI running pnpm test
- OAuth revoke / file-store jobs
- A separate welcome screen after delete (sign-in stays the guest landing)
- Soft-delete User as the end state
- Grace period / restore
```

## Epic Status

TODO

## Related Documents

Cursor must read these documents before working on this epic:

```txt
docs/architecture.md
docs/backend-clean-architecture.md
docs/domain/account-deletion.md
docs/domain/permissions.md
docs/domain/auth-token-strategy.md
docs/security/security-checklist.md
docs/tasks/README.md
docs/tasks/cursor-task-template.md
docs/tasks/done/34-account-deletion.md
docs/tasks/done/02-auth.md
docs/tasks/done/10-groups-sharing.md
docs/tasks/done/12-admin-analytics.md
docs/tasks/done/19-frontend-groups-admin.md
docs/smoke/account-deletion.md
```

After TASK-35.01, follow the updated:

```txt
docs/domain/account-deletion.md
```

## Epic Prerequisites

EPIC-34 is complete (in `docs/tasks/done/`).

Expected state:

```txt
- deleteAccount + DeleteAccountUseCase hard-delete User (cascade owned rows)
- Blocked users currently rejected by login/refresh/me/deleteAccount
- GroupInvitation.email is a string (no FK to User)
- GqlAuthGuard verifies JWT only
- Copies write Deck.sourceDeckId; preview sessions have their own sourceDeckId
- Profile Danger zone + /account-deletion page exist
- Local stack: Postgres + API (:3000) + mobile web (:8081)
```

## Agreed Decisions (Source of Truth)

`docs/domain/account-deletion.md` is the live SoT after TASK-35.01. This section is the decision record used to update that document.

### Incoming invitations

```txt
GroupInvitation stores the invitee as email (no User FK). Cascade only covers
invitedById and the group. Before/with User.delete, delete ALL invitations for
that email (every status, not only PENDING), same Prisma transaction.
Normalize with normalizeGroupEmail (trim + lower-case).
```

### Blocked identity vs normal re-register

```txt
Normal (not blocked) delete: email is free. Same email may register as a new empty account.

Blocked identity: must not register again. Otherwise delete bypasses moderation.
Store normalized email in BlockedIdentity (unique). No admin list/unban screen in this epic.

Write the row when ADMIN blocks a user.
Keep the row when that blocked user self-deletes (User row goes away).
Remove the row when ADMIN unblocks a still-existing user (existing unblockUser).
Admin may later unban a deleted identity by deleting the row; no GraphQL/UI for that yet.
```

### Register message

```txt
Register with a banned email returns the same error as “email already exists”
(USER_ALREADY_EXISTS). Do not say the identity is banned.
```

### Blocked user: login, profile, delete

```txt
Blocked user MAY log in and refresh tokens.
They MAY call me and deleteAccount.
They MUST NOT use the rest of the product (decks, lessons, groups, settings
mutations, admin, etc. stay USER_BLOCKED).

Frontend: after login, only Profile (account status + Delete account + Log out).
Hide Home/Decks tabs (and other product chrome). Deep links to decks/lessons/groups
redirect to Profile. Skip study-language onboarding for blocked users.

GetMyAccount / settings form: hide for blocked (do not need to allow updateSettings).
```

### JWT after delete

```txt
Authenticated request = valid access JWT AND User still exists.
Missing user → UNAUTHORIZED (same as bad/expired token).
Apply in GqlAuthGuard. OptionalGqlAuthGuard: if a token is present but user is gone,
do not attach authUser (treat as anonymous), do not 401 public operations.
```

### Lost delete response

```txt
If deleteAccount already committed and the client gets UNAUTHENTICATED / missing user,
treat it as success: Alert Account deleted, then local teardown, then sign-in.
```

### Web cookie and push memory

```txt
After successful deleteAccount, API clears the HttpOnly refresh cookie (like logout).
Frontend also calls clearCurrentPushToken() (logout already does this).
```

### Copy provenance

```txt
Finalized copies (copy public deck, copy group deck, confirm preview) must not store
sourceDeckId on Deck (null). DeckPreviewSession.sourceDeckId stays.

One Prisma migration: SET sourceDeckId = NULL on all Deck rows where it is not null.
Do not rewrite sourceDeckId during User.delete.
```

### Tests

```txt
Unit tests only in this epic (repository transaction, register banned email, guard,
delete invitations, blocked login/delete). No live-Postgres integration test.
Do not change GitHub CI to run pnpm test.
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
4. Follow Agreed Decisions; after 35.01 follow docs/domain/account-deletion.md.
5. Backend is source of truth.
6. Hard-delete User. Do not use User.deletedAt as the deletion end state.
7. Do not add admin unban UI or OAuth/file jobs.
8. Do not weaken auth except the agreed blocked login / me / deleteAccount exceptions.
9. Translate any new user-facing strings (en/uk) in the task that adds them.
10. Each task’s Commands to Run must pass before commit. If blocked, stop and ask.
11. Do not push.
```

## Recommended Task Order

```txt
35.01                            live SoT
35.02                            BlockedIdentity + block/unblock
35.03                            register banned email
35.04                            blocked login / me / refresh
35.05                            delete: invitations tx + blocked may delete
35.06                            guard: user must exist
35.07                            blocked UI: profile + delete only
35.08                            cookie, push memory, retry-as-success
35.09                            copy provenance + migration
35.10                            smoke
```

## Epic Summary

```md
- [x] TASK-35.01 Update account-deletion source of truth
- [ ] TASK-35.02 Persist blocked email identity
- [ ] TASK-35.03 Reject banned email on register like already exists
- [ ] TASK-35.04 Allow blocked users to log in and load me
- [ ] TASK-35.05 Delete invitations with the user and allow blocked self-delete
- [ ] TASK-35.06 Reject access tokens whose user no longer exists
- [ ] TASK-35.07 Limit blocked users to Profile and delete
- [ ] TASK-35.08 Clear cookie, push token, and treat lost delete as success
- [ ] TASK-35.09 Stop storing sourceDeckId on finalized copies
- [ ] TASK-35.10 Update account-deletion smoke checks
```

---

# TASK-35.01 Update account-deletion source of truth

## Status

DONE

## Context

EPIC-34 SoT forbids blocked self-delete, frees every email, keeps copy sourceDeckId, and does not mention incoming invitations or JWT existence in the guard.

## Goal

Rewrite live SoT from Agreed Decisions. Point architecture, permissions, auth-token-strategy, and security-checklist at it.

## Related Documents

```txt
docs/tasks/35-account-deletion-prod-gaps.md
docs/domain/account-deletion.md
docs/architecture.md
docs/domain/permissions.md
docs/domain/auth-token-strategy.md
docs/security/security-checklist.md
docs/tasks/README.md
```

## Files to Create

```txt
None
```

## Files to Modify

```txt
docs/domain/account-deletion.md
docs/architecture.md
docs/domain/permissions.md
docs/domain/auth-token-strategy.md
docs/security/security-checklist.md
docs/tasks/35-account-deletion-prod-gaps.md
```

## Requirements

```txt
1. Update account-deletion.md: invitations tx; blocked identity table; blocked may
   login/me/delete but not the rest of the product; banned register looks like already exists;
   JWT+user exists; cookie/push/retry; copies have no sourceDeckId.
2. permissions.md: blocked can log in and deleteAccount; other protected ops still USER_BLOCKED;
   register banned email = already exists (no extra leak).
3. architecture.md: copy provenance; Profile-only for blocked; BlockedIdentity.
4. auth-token-strategy.md + security-checklist: guard loads user; missing user unauthorized.
5. Do not rewrite docs/tasks/done/*.
6. Mark TASK-35.01 DONE.
```

## Security Requirements

```txt
- Docs-only. Do not weaken permissions except the agreed blocked exceptions.
- Do not commit secrets.
```

## Architecture Constraints

```txt
- This task is documentation only.
```

## Implementation Notes

```txt
- User.deletedAt stays unused. End state is still no User row.
- BlockedIdentity is not a User stub and has no personal learning data.
```

## Acceptance Criteria

```txt
- A reader of live SoT knows invitations, banned email, blocked profile-only, and copy provenance.
- pnpm docs:lint and prettier on touched docs pass.
```

## Commands to Run

```bash
pnpm docs:lint
pnpm exec prettier --check docs/domain/account-deletion.md docs/architecture.md docs/domain/permissions.md docs/domain/auth-token-strategy.md docs/security/security-checklist.md docs/tasks/35-account-deletion-prod-gaps.md
```

## Manual Checks

```txt
None
```

## Do Not Do

```txt
- Do not change application code.
- Do not add admin unban UI.
- Do not push.
```

## Expected Commit Message

```txt
TASK-35.01 Update account-deletion source of truth
```

---

# TASK-35.02 Persist blocked email identity

## Status

TODO

## Context

Hard-delete removes the User row. A blocked email must survive so register cannot recreate the identity.

## Goal

Add BlockedIdentity (unique normalized email). Upsert on admin block. Delete on admin unblock of a live user.

## Related Documents

```txt
docs/tasks/35-account-deletion-prod-gaps.md
docs/domain/account-deletion.md
docs/backend-clean-architecture.md
```

## Files to Create

```txt
apps/api/prisma/migrations/<timestamp>_add_blocked_identity/migration.sql
apps/api/src/modules/auth/application/ports/blocked-identity-repository.port.ts
apps/api/src/modules/auth/infrastructure/persistence/prisma-blocked-identity.repository.ts
```

## Files to Modify

```txt
apps/api/prisma/schema.prisma
apps/api/src/modules/auth/auth.module.ts
apps/api/src/modules/admin/application/use-cases/block-user.use-case.ts
apps/api/src/modules/admin/application/use-cases/block-user.use-case.spec.ts
apps/api/src/modules/admin/application/use-cases/unblock-user.use-case.ts
apps/api/src/modules/admin/application/use-cases/unblock-user.use-case.spec.ts
apps/api/src/modules/admin/admin.module.ts
docs/tasks/35-account-deletion-prod-gaps.md
```

## Requirements

```txt
1. Prisma model BlockedIdentity: id, email @unique, createdAt. Email stored normalizeGroupEmail-style
   (trim + lower-case). Same normalize as User.email on register.
2. Port: upsertByEmail, existsByEmail, deleteByEmail. Prisma only in infrastructure.
3. BlockUserUseCase upserts after successful block.
4. UnblockUserUseCase deletes by the target user’s email after successful unblock.
5. Unit tests: block writes identity; unblock removes it; blocked user still cannot block others (unchanged).
6. Mark TASK-35.02 DONE.
```

## Security Requirements

```txt
- Admin-only block/unblock (existing permission service).
- Do not log password hashes or tokens.
- Do not commit secrets.
```

## Architecture Constraints

```txt
- Use cases depend on the port, not PrismaService.
- Do not add GraphQL for listing/unbanning deleted identities.
```

## Implementation Notes

```txt
- upsert so a second block after a failed delete is safe.
- Do not change login/register/delete yet (later tasks).
```

## Acceptance Criteria

```txt
- Schema migrates. Block/unblock specs pass. API build passes.
```

## Commands to Run

```bash
pnpm --filter @flashcards/api exec prisma validate
pnpm --filter @flashcards/api exec prisma generate
pnpm --filter @flashcards/api test -- block-user.use-case.spec.ts unblock-user.use-case.spec.ts
pnpm --filter @flashcards/api build
pnpm lint
```

## Manual Checks

```txt
None
```

## Do Not Do

```txt
- Do not add admin banned-email screen.
- Do not change register yet.
- Do not push.
```

## Expected Commit Message

```txt
TASK-35.02 Persist blocked email identity
```

---

# TASK-35.03 Reject banned email on register like already exists

## Status

TODO

## Context

Register only checks User.email unique. After a blocked user is deleted, BlockedIdentity is the only record.

## Goal

If existsByEmail on BlockedIdentity, RegisterUserUseCase throws the same USER_ALREADY_EXISTS as a live duplicate email.

## Related Documents

```txt
docs/tasks/35-account-deletion-prod-gaps.md
docs/domain/account-deletion.md
docs/security/security-checklist.md
```

## Files to Create

```txt
None
```

## Files to Modify

```txt
apps/api/src/modules/auth/application/use-cases/register-user.use-case.ts
apps/api/src/modules/auth/application/use-cases/register-user.use-case.spec.ts
apps/api/src/modules/auth/auth.module.ts
docs/tasks/35-account-deletion-prod-gaps.md
```

## Requirements

```txt
1. After normalize email, if BlockedIdentity exists → USER_ALREADY_EXISTS, same message as live user.
2. Do not mention blocked/banned in the error.
3. Tests: banned email; live duplicate still works; new email still registers (mocks).
4. Mark TASK-35.03 DONE.
```

## Security Requirements

```txt
- Do not leak whether the email is banned vs taken.
- Do not log password hashes.
- Do not commit secrets.
```

## Architecture Constraints

```txt
- Use BLOCKED_IDENTITY_REPOSITORY port.
```

## Implementation Notes

```txt
- Check banned email before create, same place as findByEmail duplicate.
```

## Acceptance Criteria

```txt
- Register specs pass. API build passes.
```

## Commands to Run

```bash
pnpm --filter @flashcards/api test -- register-user.use-case.spec.ts
pnpm --filter @flashcards/api build
pnpm lint
```

## Manual Checks

```txt
None
```

## Do Not Do

```txt
- Do not change login yet.
- Do not push.
```

## Expected Commit Message

```txt
TASK-35.03 Reject banned email on register like already exists
```

---

# TASK-35.04 Allow blocked users to log in and load me

## Status

TODO

## Context

Login, refresh, and me reject blockedAt, so a blocked user cannot reach Profile to delete.

## Goal

Allow login, refresh, and GetMe / GetMyAccount user-load for blocked users. Keep USER_BLOCKED on other product use cases.

## Related Documents

```txt
docs/tasks/35-account-deletion-prod-gaps.md
docs/domain/account-deletion.md
docs/domain/permissions.md
```

## Files to Create

```txt
None
```

## Files to Modify

```txt
apps/api/src/modules/auth/application/use-cases/login.use-case.ts
apps/api/src/modules/auth/application/use-cases/login.use-case.spec.ts
apps/api/src/modules/auth/application/use-cases/refresh-token.use-case.ts
apps/api/src/modules/auth/application/use-cases/refresh-token.use-case.spec.ts
apps/api/src/modules/auth/application/use-cases/get-me.use-case.ts
apps/api/src/modules/auth/application/use-cases/get-me.use-case.spec.ts
apps/api/src/modules/account/application/use-cases/get-my-account.use-case.ts
apps/api/src/modules/account/application/use-cases/get-my-account.use-case.spec.ts
docs/tasks/35-account-deletion-prod-gaps.md
```

## Requirements

```txt
1. Remove blockedAt rejection from Login, RefreshToken, GetMe.
2. GetMyAccount: allow blocked (Profile may still query it); do not open updateSettings.
3. Tests: blocked user can login (tokens issued); refresh works; me returns user with blockedAt set.
4. Existing USER_BLOCKED tests on createDeck / startLesson stay (do not weaken).
5. Mark TASK-35.04 DONE.
```

## Security Requirements

```txt
- Blocked users still cannot manage decks/lessons/groups/admin (other use cases).
- Do not log tokens.
- Do not commit secrets.
```

## Architecture Constraints

```txt
- Do not move blocked checks into GraphQL resolvers.
```

## Implementation Notes

```txt
- Block still revokes refresh tokens at block time; they log in again to get new tokens.
- Do not change DeleteAccountUseCase yet (next task).
```

## Acceptance Criteria

```txt
- Login/refresh/me specs pass. createDeck (or similar) still rejects blocked.
- API build passes.
```

## Commands to Run

```bash
pnpm --filter @flashcards/api test -- login.use-case.spec.ts refresh-token.use-case.spec.ts get-me.use-case.spec.ts get-my-account.use-case.spec.ts
pnpm --filter @flashcards/api build
pnpm lint
```

## Manual Checks

```txt
None
```

## Do Not Do

```txt
- Do not allow blocked createDeck/startLesson.
- Do not change frontend yet.
- Do not push.
```

## Expected Commit Message

```txt
TASK-35.04 Allow blocked users to log in and load me
```

---

# TASK-35.05 Delete invitations with the user and allow blocked self-delete

## Status

TODO

## Context

deleteById only prisma.user.delete. Incoming invitations by email remain. DeleteAccountUseCase still throws USER_BLOCKED.

## Goal

In one Prisma transaction: deleteMany GroupInvitation by normalized email, then user.delete. Blocked users may delete. If blockedAt is set, ensure BlockedIdentity upsert so the email stays banned after the User row is gone.

## Related Documents

```txt
docs/tasks/35-account-deletion-prod-gaps.md
docs/domain/account-deletion.md
docs/backend-clean-architecture.md
```

## Files to Create

```txt
None
```

## Files to Modify

```txt
apps/api/src/modules/auth/application/ports/user-repository.port.ts
apps/api/src/modules/auth/infrastructure/persistence/prisma-user.repository.ts
apps/api/src/modules/account/application/use-cases/delete-account.use-case.ts
apps/api/src/modules/account/application/use-cases/delete-account.use-case.spec.ts
apps/api/src/modules/account/account.module.ts
docs/tasks/35-account-deletion-prod-gaps.md
```

## Requirements

```txt
1. deleteById(userId) runs $transaction: invitations where email = normalize(user.email), all statuses; then user.delete.
2. If user missing inside deleteById, behave as today (use case still UNAUTHORIZED if findById null).
3. DeleteAccountUseCase: remove USER_BLOCKED check. After load, if blockedAt set, upsert BlockedIdentity, then deleteById.
4. Tests: success; missing user; blocked user DOES delete; invitations deleted (repository mock or use-case verifying ports).
5. Mark TASK-35.05 DONE.
```

## Security Requirements

```txt
- Only currentUser.id.
- Do not log tokens or password hashes.
- Do not commit secrets.
```

## Architecture Constraints

```txt
- Prisma $transaction stays in PrismaUserRepository (may call prisma.groupInvitation inside that repo method; do not put Prisma in the use case).
- Use case may depend on USER_REPOSITORY + BLOCKED_IDENTITY_REPOSITORY.
```

## Implementation Notes

```txt
- Load email from findById before delete (SafeUser has email).
- Do not touch other users’ sourceDeckId.
```

## Acceptance Criteria

```txt
- delete-account specs pass (blocked deletes; missing still unauthorized).
- API build passes.
```

## Commands to Run

```bash
pnpm --filter @flashcards/api test -- delete-account.use-case.spec.ts
pnpm --filter @flashcards/api build
pnpm lint
```

## Manual Checks

```txt
None
```

## Do Not Do

```txt
- Do not add GraphQL changes except if module providers need the new port.
- Do not push.
```

## Expected Commit Message

```txt
TASK-35.05 Delete invitations with the user and allow blocked self-delete
```

---

# TASK-35.06 Reject access tokens whose user no longer exists

## Status

TODO

## Context

GqlAuthGuard only verifies JWT. After User.delete, a 15-minute access token still works until expiry.

## Goal

GqlAuthGuard: verify JWT, then findById. Missing user → UNAUTHORIZED. OptionalGqlAuthGuard: missing/invalid user means no authUser (public ops still work).

## Related Documents

```txt
docs/tasks/35-account-deletion-prod-gaps.md
docs/domain/auth-token-strategy.md
docs/security/security-checklist.md
```

## Files to Create

```txt
apps/api/src/modules/auth/presentation/graphql/guards/gql-auth.guard.spec.ts
apps/api/src/modules/auth/presentation/graphql/guards/optional-gql-auth.guard.spec.ts
```

## Files to Modify

```txt
apps/api/src/modules/auth/presentation/graphql/guards/gql-auth.guard.ts
apps/api/src/modules/auth/presentation/graphql/guards/optional-gql-auth.guard.ts
apps/api/src/modules/auth/auth.module.ts
docs/tasks/35-account-deletion-prod-gaps.md
```

## Requirements

```txt
1. Inject USER_REPOSITORY. After verify, findById(authUser.id); null → UNAUTHORIZED for GqlAuthGuard.
2. Optional: token present but user gone → do not set authUser, return true.
3. Guard unit tests: valid user; missing user; no/invalid token.
4. Mark TASK-35.06 DONE.
```

## Security Requirements

```txt
- Do not log the access token.
- Do not commit secrets.
```

## Architecture Constraints

```txt
- Guard may load user via port. Do not query Prisma in the guard.
- Do not also reject blocked users in the guard (blocked must reach me/deleteAccount).
```

## Implementation Notes

```txt
- AuthUser on request can stay as JWT payload; existence check is enough.
```

## Acceptance Criteria

```txt
- Guard specs pass. API build passes.
```

## Commands to Run

```bash
pnpm --filter @flashcards/api test -- gql-auth.guard.spec.ts optional-gql-auth.guard.spec.ts
pnpm --filter @flashcards/api build
pnpm lint
```

## Manual Checks

```txt
None
```

## Do Not Do

```txt
- Do not add a token denylist.
- Do not push.
```

## Expected Commit Message

```txt
TASK-35.06 Reject access tokens whose user no longer exists
```

---

# TASK-35.07 Limit blocked users to Profile and delete

## Status

TODO

## Context

Blocked users can log in (35.04) but the app still shows Home/Decks and product screens.

## Goal

If blockedAt is set: only Profile with account status, Log out, and Delete account. Hide other tabs and settings/groups/admin chrome. Redirect other authenticated routes to Profile. Skip study-language onboarding.

## Related Documents

```txt
docs/tasks/35-account-deletion-prod-gaps.md
docs/domain/account-deletion.md
docs/tasks/done/18-frontend-profile-settings-notifications.md
```

## Files to Create

```txt
None unless a tiny use-blocked-user-gate helper is cleaner than inline checks
```

## Files to Modify

```txt
apps/mobile/app/(tabs)/_layout.tsx
apps/mobile/src/features/profile/screens/profile-screen.tsx
apps/mobile/src/features/auth/hooks/use-auth-gate.ts
apps/mobile/src/features/study-languages/hooks/use-study-language-onboarding-gate.ts
apps/mobile/src/features/auth/utils/get-post-auth-redirect.ts
docs/tasks/35-account-deletion-prod-gaps.md
```

## Requirements

```txt
1. Post-auth redirect for blocked → Profile (not onboarding, not home).
2. Tabs: only Profile visible for blocked (href null on Home/Decks).
3. Profile: hide settings form, groups/admin rows; keep status + logout + Danger zone.
4. Protected non-profile routes redirect blocked users to Profile.
5. en/uk only if a short “account blocked” line is needed beyond existing copy.
6. Mark TASK-35.07 DONE.
```

## Security Requirements

```txt
- Frontend is UX only. Backend still rejects product mutations.
- Do not store tokens in localStorage/sessionStorage.
- Do not commit secrets.
```

## Architecture Constraints

```txt
- Use existing auth store / me blockedAt. Do not fetch admin APIs.
```

## Implementation Notes

```txt
- Match existing Redirect + useAuthGate patterns.
```

## Acceptance Criteria

```txt
- Mobile typecheck and lint pass.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm lint
```

## Manual Checks

```txt
None in this task (smoke in 35.10).
```

## Do Not Do

```txt
- Do not build a new Settings-only app shell.
- Do not push.
```

## Expected Commit Message

```txt
TASK-35.07 Limit blocked users to Profile and delete
```

---

# TASK-35.08 Clear cookie, push token, and treat lost delete as success

## Status

TODO

## Context

logout clears the HttpOnly cookie and clearCurrentPushToken. deleteAccount does neither. A dropped response after commit shows a false failure.

## Goal

deleteAccount resolver clears refresh cookie. Success path calls clearCurrentPushToken. If the mutation errors with unauthenticated/unauthorized after the user confirmed, run the same success teardown (Alert + clear + sign-in).

## Related Documents

```txt
docs/tasks/35-account-deletion-prod-gaps.md
docs/domain/account-deletion.md
```

## Files to Create

```txt
None
```

## Files to Modify

```txt
apps/api/src/modules/account/presentation/graphql/resolvers/account.resolver.ts
apps/api/src/modules/account/account.module.ts
apps/mobile/src/features/profile/hooks/use-delete-account.ts
docs/tasks/35-account-deletion-prod-gaps.md
```

## Requirements

```txt
1. After successful use case, clearRefreshTokenCookie on the GraphQL response (same helper as logout).
   Inject RefreshTokenCookieService; use @Context() like AuthResolver.logout.
2. Frontend success: clearCurrentPushToken then clearAuthSession, clearStore, sign-in.
3. Frontend: GraphQL unauthenticated/unauthorized (Apollo error code) → same success path as true success.
4. Other errors still: Couldn't delete your account. Stay logged in.
5. Mark TASK-35.08 DONE.
```

## Security Requirements

```txt
- Do not log tokens.
- Do not commit secrets.
```

## Architecture Constraints

```txt
- Resolver still has no Prisma and no extra business rules.
```

## Implementation Notes

```txt
- Match logout cookie clearing even when there is no refresh token in the body.
- Detect UNAUTHENTICATED / Unauthorized from the Apollo error extensions/code already used in the app.
```

## Acceptance Criteria

```txt
- API build + mobile typecheck pass.
```

## Commands to Run

```bash
pnpm --filter @flashcards/api build
pnpm --filter @flashcards/mobile typecheck
pnpm lint
```

## Manual Checks

```txt
None
```

## Do Not Do

```txt
- Do not call logout mutation after delete.
- Do not push.
```

## Expected Commit Message

```txt
TASK-35.08 Clear cookie, push token, and treat lost delete as success
```

---

# TASK-35.09 Stop storing sourceDeckId on finalized copies

## Status

TODO

## Context

Copy public/group and confirm preview write Deck.sourceDeckId. After the source owner deletes, copies keep a dead id. Product: finalized copies have no provenance. Preview sessions keep sourceDeckId.

## Goal

New finalized copies persist sourceDeckId null. Prisma migration sets existing Deck.sourceDeckId to null.

## Related Documents

```txt
docs/tasks/35-account-deletion-prod-gaps.md
docs/domain/account-deletion.md
docs/architecture.md
```

## Files to Create

```txt
apps/api/prisma/migrations/<timestamp>_clear_deck_source_deck_id/migration.sql
```

## Files to Modify

```txt
apps/api/src/modules/decks/application/ports/deck-repository.port.ts
apps/api/src/modules/decks/infrastructure/persistence/prisma-deck.repository.ts
apps/api/src/modules/decks/application/use-cases/copy-public-deck.use-case.ts
apps/api/src/modules/decks/application/use-cases/copy-public-deck.use-case.spec.ts
apps/api/src/modules/groups/application/use-cases/copy-group-deck.use-case.ts
apps/api/src/modules/groups/application/use-cases/copy-group-deck.use-case.spec.ts
apps/api/src/modules/languages/application/use-cases/confirm-deck-preview.use-case.ts
apps/api/src/modules/languages/application/use-cases/deck-preview.use-cases.spec.ts
docs/tasks/35-account-deletion-prod-gaps.md
```

## Requirements

```txt
1. createCopiedDeck stores sourceDeckId: null (or stop passing source id).
2. copy-public, copy-group, confirm-preview tests expect null.
3. SQL migration: UPDATE "Deck" SET "sourceDeckId" = NULL WHERE "sourceDeckId" IS NOT NULL;
4. Do not change DeckPreviewSession.sourceDeckId.
5. Mark TASK-35.09 DONE.
```

## Security Requirements

```txt
- Do not commit secrets.
```

## Architecture Constraints

```txt
- Do not add an FK from Deck.sourceDeckId.
```

## Implementation Notes

```txt
- GraphQL Deck.sourceDeckId field may remain nullable; copies return null.
```

## Acceptance Criteria

```txt
- Copy/preview specs pass. prisma validate + API build pass.
```

## Commands to Run

```bash
pnpm --filter @flashcards/api exec prisma validate
pnpm --filter @flashcards/api test -- copy-public-deck.use-case.spec.ts copy-group-deck.use-case.spec.ts deck-preview.use-cases.spec.ts
pnpm --filter @flashcards/api build
pnpm lint
```

## Manual Checks

```txt
None
```

## Do Not Do

```txt
- Do not delete DeckPreviewSession.sourceDeckId.
- Do not push.
```

## Expected Commit Message

```txt
TASK-35.09 Stop storing sourceDeckId on finalized copies
```

---

# TASK-35.10 Update account-deletion smoke checks

## Status

TODO

## Context

Smoke still matches EPIC-34 (blocked cannot delete; email always free; sourceDeckId kept).

## Goal

Update docs/smoke/account-deletion.md and mvp-smoke-tests section 37 for EPIC-35.

## Related Documents

```txt
docs/tasks/35-account-deletion-prod-gaps.md
docs/domain/account-deletion.md
docs/release/mvp-smoke-tests.md
docs/smoke/account-deletion.md
```

## Files to Create

```txt
None
```

## Files to Modify

```txt
docs/smoke/account-deletion.md
docs/release/mvp-smoke-tests.md
docs/tasks/35-account-deletion-prod-gaps.md
```

## Requirements

```txt
1. Checklist: incoming invite gone after delete; banned email cannot register (same already-exists copy);
   non-blocked email can; blocked login → Profile only + delete; JWT after delete fails;
   copies have no sourceDeckId.
2. Do not record real passwords.
3. Mark TASK-35.10 DONE.
```

## Security Requirements

```txt
- Do not commit secrets or production emails.
```

## Architecture Constraints

```txt
- Docs only.
```

## Implementation Notes

```txt
- Disposable local users. Do not use shared seed accounts for the success path.
```

## Acceptance Criteria

```txt
- pnpm docs:lint passes.
```

## Commands to Run

```bash
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
TASK-35.10 Update account-deletion smoke checks
```
