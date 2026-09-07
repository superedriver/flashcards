# Account Deletion

## Purpose

This document defines how an authenticated user permanently deletes their own account.

It is the live source of truth for self-serve account deletion: Profile Danger zone, two confirms, hard-delete of the User row, GraphQL `deleteAccount`, reminder-job no-op, and the public `/account-deletion` explainer.

Relevant task files:

```txt
docs/tasks/34-account-deletion.md
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
  User.deletedAt (unused for this flow).
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
Then the same local teardown as logout (clear auth session and Apollo store).
Then navigate to /(auth)/sign-in.
Do not send a deletion email.
Prefer not calling the logout mutation after the user row is already gone.
```

## After failure

```txt
Stay logged in. Do not clear auth. Do not show Account deleted.
Show: Couldn't delete your account. Please try again.
```

## Who can delete

```txt
Any valid authenticated session, including ADMIN and MODERATOR deleting themselves.
The mutation always deletes the current user only (currentUser.id).
Blocked users stay rejected by existing auth (they cannot call the mutation).
Unauthenticated callers cannot call deleteAccount.
```

## What is removed

```txt
Hard-delete the User row (prisma.user.delete via repository).
End state is no User row. Do not use User.deletedAt as the deletion end state
(the column may exist unused).
Email becomes free. No "Deleted user" placeholder.
Owned application data goes with Prisma onDelete: Cascade
(profile, settings, tokens, decks, cards, reviews, sessions, CSV, AI logs,
push tokens, study languages, preview sessions, memberships).
Owner groups go with Group.createdById cascade.
No leftover memberships for that user.
Personal learning/review/session/due/stats data is deleted.
No anonymous analytics row for the deleted user in v1.
```

## Public decks and copies

```txt
Public decks the user owns are deleted.
Copies owned by other users stay.
Deck.sourceDeckId is a string, not an FK.
Do not null or rewrite sourceDeckId on those copies.
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

## Public page (web)

```txt
Unauthenticated /account-deletion explains how to delete, what is removed,
that it is irreversible, and that the user must sign in.
It does not call deleteAccount.
CTA goes to sign-in; after login the user deletes from Profile.
```

## Re-registration

```txt
The same email may register immediately as a fully new empty account.
Nothing is restored.
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
Blocking re-registration of the same email.
OAuth revoke / file-store cleanup jobs (add when Google/Apple or a file store exists).
Editing database backups (standard retention; restore policy is infrastructure).
A separate Settings screen.
```

## Permissions

```txt
deleteAccount requires authentication.
Blocked users are rejected.
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
Profile Danger zone
/account-deletion
due-card reminder no-op for missing users
```

Implementation must follow this document exactly unless this document is explicitly updated.
