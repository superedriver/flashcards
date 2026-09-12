# Account Deletion

## Purpose

This document defines how an authenticated user permanently deletes their own account.

It is the live source of truth for self-serve account deletion: Profile Danger zone, two confirms, hard-delete of the User row, incoming invitations, blocked identity, GraphQL `deleteAccount`, reminder-job no-op, and the public `/account-deletion` explainer.

Relevant task files:

```txt
docs/tasks/35-account-deletion-prod-gaps.md
docs/tasks/done/34-account-deletion.md
docs/tasks/done/02-auth.md
docs/tasks/done/04-user-profile-settings.md
docs/tasks/done/10-groups-sharing.md
docs/tasks/done/11-notifications.md
docs/architecture.md
docs/domain/permissions.md
docs/security/security-checklist.md
```

## Product terminology

```txt
User-facing:
  Delete account — Profile Account Danger zone action.
  Delete account? — first confirm title.
  Delete account permanently? — second confirm title.
  Delete account permanently — second confirm destructive button.
  Account deleted — success Alert.
  Account deletion — public web explainer page title.

Technical:
  deleteAccount, prisma.user.delete, USER_REPOSITORY.deleteById,
  BlockedIdentity, User.deletedAt (unused for this flow).
```

## Placement

```txt
No separate Settings screen.
Delete account lives in Profile Account, Danger zone, below Log out
(same chrome idea as Delete Deck).
```

## Flow

```txt
Profile (Account) → Delete account → confirm 1 → confirm 2 → deleteAccount
  → success Alert "Account deleted" → clear local auth/Apollo → /(auth)/sign-in
```

Nothing is deleted until `deleteAccount` succeeds.

Do not require typing DELETE. Do not re-auth with password or OAuth.

### Confirm 1

```txt
Title: Delete account?
Text: Are you sure you want to delete your account?
Buttons: Cancel, Continue
```

Cancel stops. Continue opens confirm 2. No mutation yet.

### Confirm 2

```txt
Title: Delete account permanently?
Text: Your account, decks, cards, learning progress, groups, and history will be
  permanently deleted. This action cannot be undone.
Buttons: Cancel, Delete account permanently
```

Cancel stops. Delete account permanently calls `deleteAccount`.

## After success

```txt
Show Alert: Account deleted.
Then the same local teardown as logout (clear auth session, Apollo store,
and current push-token memory).
API also clears the HttpOnly refresh cookie (like logout).
Then navigate to /(auth)/sign-in.
Do not send a deletion email.
Do not call the logout mutation after the user row is already gone.
```

If the mutation already committed and the client gets UNAUTHENTICATED / missing user
(lost response), treat it as success: same Alert and teardown.

## After failure

```txt
Stay logged in. Do not clear auth. Do not show Account deleted.
Show: Couldn't delete your account. Please try again.
```

Other errors (not unauthenticated after a confirmed delete) stay on this path.

## Who can delete

```txt
Any valid authenticated session, including ADMIN and MODERATOR deleting themselves.
The mutation always deletes the current user only (currentUser.id).
Blocked users MAY log in, refresh, call me, and call deleteAccount.
Blocked users MUST NOT use the rest of the product (decks, lessons, groups,
settings mutations, admin, etc.).
Unauthenticated callers cannot call deleteAccount.
```

Frontend for a blocked user: Profile only (account status, Log out, Delete account).
Hide Home/Decks and other product chrome. Deep links to decks/lessons/groups
redirect to Profile. Skip study-language onboarding.

## What is removed

```txt
Hard-delete the User row (prisma.user.delete via repository) in one transaction
with incoming invitations (see below).
End state is no User row. Do not use User.deletedAt as the deletion end state
(the column may exist unused).
No "Deleted user" placeholder.
Owned application data goes with Prisma onDelete: Cascade
(profile, settings, tokens, decks, cards, reviews, sessions, CSV, AI logs,
push tokens, study languages, preview sessions, memberships).
Owner groups go with Group.createdById cascade.
No leftover memberships for that user.
Personal learning/review/session/due/stats data is deleted.
No anonymous analytics row for the deleted user in v1.
```

## Incoming invitations

```txt
GroupInvitation stores the invitee as email (no User FK).
Cascade only covers invitedById and the group.
With User.delete, in the same Prisma transaction, delete ALL invitations for
that email (every status, not only PENDING).
Normalize with trim + lower-case (same as group invite email).
```

## Blocked identity

```txt
BlockedIdentity stores a unique normalized email. It is not a User stub and
holds no learning data. No admin list/unban screen in v1.

Write the row when ADMIN blocks a user.
Keep the row when that blocked user self-deletes.
Remove the row when ADMIN unblocks a still-existing user.
Admin may later unban a deleted identity by deleting the row (no GraphQL/UI yet).
```

## Public decks and copies

```txt
Public decks the user owns are deleted.
Copies owned by other users stay.
Finalized copies (copy public, copy group, confirm preview) do not store
sourceDeckId on Deck (null). Existing Deck.sourceDeckId values are cleared
by migration. Do not rewrite sourceDeckId during User.delete.
DeckPreviewSession.sourceDeckId stays (preview only).
sourceDeckId on Deck is a string, not an FK.
```

## Groups

```txt
If the user created a group, the group is deleted even if it has other members.
Ownership is not transferred.
```

## Jobs

```txt
due-card-reminders (and any other user-scoped job): if the user no longer exists,
no-op. Do not send push, email, or import work for a deleted user.
```

## Auth after delete

```txt
Authenticated request = valid access JWT AND User still exists.
Missing user → UNAUTHORIZED (same as bad/expired token) on GqlAuthGuard.
OptionalGqlAuthGuard: token present but user gone → no authUser (anonymous);
do not 401 public operations.
```

## Public page (web)

```txt
Unauthenticated /account-deletion explains how to delete, what is removed,
that it is irreversible, and that the user must sign in.
It does not call deleteAccount.
CTA goes to sign-in; after login the user deletes from Profile.
```

## Re-registration

```txt
Normal (not blocked) delete: email is free. The same email may register
immediately as a fully new empty account. Nothing is restored.

Banned email (BlockedIdentity): must not register again.
Register returns the same USER_ALREADY_EXISTS as a live duplicate email.
Do not say the identity is banned.
```

## Out of v1 (document only; do not implement here)

```txt
Grace period or restore deleted account.
Soft-delete User as the end state.
Typing DELETE or password / Google / Apple re-auth.
Transferring group ownership.
Anonymizing public decks instead of deleting them.
Email after deletion.
Audit row for the deletion.
Keeping personal learning history or anonymous analytics for deleted users.
Admin UI to list or unban emails.
OAuth revoke / file-store cleanup jobs (add when Google/Apple or a file store exists).
Editing database backups (standard retention; restore policy is infrastructure).
A separate Settings screen.
A separate welcome screen after delete (sign-in is the guest landing).
Live-Postgres integration tests and CI running unit tests.
```

## Permissions

```txt
deleteAccount requires authentication.
Blocked users may call deleteAccount, me, login, and refresh.
Other protected operations stay USER_BLOCKED.
No password, OAuth token, or typed DELETE in the mutation.
Frontend visibility is UX only. Backend is the source of truth.
```

## i18n

```txt
All new UI strings en and uk, in the task that introduces them.
```

## Cursor Implementation Rules

Cursor must read this document before implementing or modifying:

```txt
account deletion
deleteAccount
BlockedIdentity
incoming group invitations on delete
Profile Danger zone
blocked profile-only access
/account-deletion
due-card reminder no-op for missing users
finalized copy sourceDeckId
```

Implementation must follow this document exactly unless this document is explicitly updated.
