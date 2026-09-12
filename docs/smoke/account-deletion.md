# Account Deletion Smoke Checks (EPIC-35)

Manual verification for Profile Danger zone, hard-delete, invitations, banned email, blocked Profile-only access, stale JWT, copies without provenance, and the public explainer.

Related:

```txt
docs/tasks/35-account-deletion-prod-gaps.md
docs/domain/account-deletion.md
docs/release/mvp-smoke-tests.md (section 37)
```

Use **disposable local users**, not a shared seed account you still need (`demo@` and similar fixtures). Do not record real passwords.

## Automated verification (done in TASK-35.01–35.09)

```txt
- Block/unblock BlockedIdentity specs: PASS
- Register banned email = USER_ALREADY_EXISTS: PASS
- Blocked login / refresh / me / GetMyAccount: PASS
- DeleteAccount (blocked deletes; invitations in deleteById tx): PASS
- GqlAuthGuard missing user UNAUTHORIZED: PASS
- Copy/preview createCopiedDeck sourceDeckId null: PASS
- API build + mobile typecheck: PASS
- TASK-35.01–35.09 statuses: DONE
```

GraphQL `deleteAccount` and the Profile hook are implemented. Full deletion still needs human QA on web.

## Manual checks (web)

### Profile confirms (nothing deleted yet)

- [ ] Profile Account shows Danger zone **below Log out** with Delete account / Видалити акаунт.
- [ ] Confirm 1: title `Delete account?` / text about being sure. Cancel: still signed in, account intact.
- [ ] Confirm 2: title `Delete account permanently?` / decks, cards, progress, groups, history gone. Cancel: still signed in, account intact.
- [ ] No typed DELETE. No password / OAuth re-auth.

### Failure (optional if hard to simulate)

- [ ] Failed `deleteAccount` that is **not** unauthenticated (stop API or force a non-auth GraphQL error): stay on Profile, still signed in, no Account deleted Alert.
- [ ] Error copy: Couldn't delete your account. Please try again.

### Success (non-blocked user)

- [ ] After both confirms, Alert `Account deleted` / `Акаунт видалено`.
- [ ] OK → sign-in. Session, refresh cookie, push-token memory, and Apollo store cleared (no leftover Profile data).
- [ ] Same email can register immediately as a **new empty** account. Nothing is restored.

### Incoming invitations

Prepare **before** deleting the disposable user:

```txt
User B invites disposable User A’s email to a group (any status is fine).
```

- [ ] After User A is deleted, User B’s group has **no** invitation row for that email (pending or otherwise).

### Banned vs free email

```txt
Banned path: ADMIN blocks disposable User C, then User C deletes from Profile.
Normal path: unblocked User D deletes from Profile.
```

- [ ] Register with User C’s email: same copy as a live duplicate (`USER_ALREADY_EXISTS` / already exists). Do **not** mention banned or blocked.
- [ ] Register with User D’s email: succeeds as a new empty account.

### Blocked user (live account, not yet deleted)

- [ ] Blocked user can sign in.
- [ ] Lands on Profile only: Home/Decks tabs hidden; settings/groups/admin chrome hidden.
- [ ] Deep link to Home/Decks/groups/onboarding redirects to Profile.
- [ ] Profile still shows account status, Log out, and Delete account.
- [ ] Blocked user can complete delete (same two confirms + Account deleted + sign-in).

### Stale JWT after delete

- [ ] After a successful delete, a leftover access token (or a retry of `me` / `deleteAccount`) is unauthorized. Public pages still load.

### Copies and groups

Prepare **before** deleting the disposable user:

```txt
User A (disposable): owns a public deck; User B copies it (or confirms a copy preview).
User A created a group that still has User B as a member.
```

- [ ] After User A is deleted, User B still has their copy. The copy’s `sourceDeckId` is **null** (no provenance).
- [ ] User A’s public deck is gone.
- [ ] The group User A created is gone (ownership was not transferred).
- [ ] `DeckPreviewSession.sourceDeckId` is unchanged for any leftover preview rows (preview only).

### Public page

- [ ] Logged out: `http://localhost:8081/account-deletion` loads.
- [ ] Copy covers how-to (sign in → Profile Account → Delete account → two confirms), what is removed, irreversible.
- [ ] CTA goes to sign-in. This page does **not** call `deleteAccount` and has no delete button.

### Jobs / i18n

- [ ] Due-card reminders do not error if a previously scheduled user is already deleted (job still returns).
- [ ] New strings exist in en and uk.

## Sign-off

```txt
Tester: Auto (Cursor agent)
Date: 2026-09-12
Platforms: automated only (api jest + mobile tsc)
Environment: local
Overall: PASS (automated)
Notes:
- TASK-35.01–35.09 implementation + automated checks green.
- Manual Profile deletion, invitations, banned email, blocked Profile-only,
  stale JWT, copies, and re-register remain for human QA on web.
- Do not use shared seed accounts for the success path.
```
