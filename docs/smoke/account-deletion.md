# Account Deletion Smoke Checks (EPIC-34)

Manual verification for Profile Danger zone, hard-delete, copies/groups, re-register, and the public explainer.

Related:

```txt
docs/tasks/34-account-deletion.md
docs/domain/account-deletion.md
docs/release/mvp-smoke-tests.md (section 37)
```

Use a **disposable local user**, not a shared seed account you still need (`demo@` and similar fixtures). Do not record real passwords.

## Automated verification (done in TASK-34.01–34.06)

```txt
- DeleteAccountUseCase unit tests: PASS
- SendDueCardReminders missing-user skip: PASS
- API build: PASS
- Mobile codegen + typecheck: PASS
- TASK-34.01–34.06 statuses: DONE
```

GraphQL `deleteAccount` and the Profile hook are implemented. Full deletion still needs human QA on web.

## Manual checks (web)

### Profile confirms (nothing deleted yet)

- [ ] Profile Account shows Danger zone **below Log out** with Delete account / Видалити акаунт.
- [ ] Confirm 1: title `Delete account?` / text about being sure. Cancel: still signed in, account intact.
- [ ] Confirm 2: title `Delete account permanently?` / decks, cards, progress, groups, history gone. Cancel: still signed in, account intact.
- [ ] No typed DELETE. No password / OAuth re-auth.

### Failure (optional if hard to simulate)

- [ ] Failed `deleteAccount` (stop API or force GraphQL error): stay on Profile, still signed in, no Account deleted Alert.
- [ ] Error copy: Couldn't delete your account. Please try again.

### Success

- [ ] After both confirms, Alert `Account deleted` / `Акаунт видалено`.
- [ ] OK → sign-in. Session and Apollo store cleared (no leftover Profile data).
- [ ] Same email can register immediately as a **new empty** account. Nothing is restored.

### Copies and groups

Prepare **before** deleting the disposable user:

```txt
User A (disposable): owns a public deck; User B copies it.
User A created a group that still has User B as a member.
```

- [ ] After User A is deleted, User B still has their copy. `sourceDeckId` is unchanged.
- [ ] User A’s public deck is gone.
- [ ] The group User A created is gone (ownership was not transferred).

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
Date: 2026-09-07
Platforms: automated only (api jest + mobile tsc)
Environment: local
Overall: PASS (automated)
Notes:
- TASK-34.01–34.06 implementation + automated checks green.
- Manual Profile deletion, copies/groups, and re-register remain for human QA on web.
- Do not use shared seed accounts for the success path.
```
