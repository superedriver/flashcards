# Permissions

## Purpose

This document defines permission rules for Flashcards.

It is a source-of-truth document for backend authorization and frontend role-based visibility.

The backend is always the source of truth for permissions.

Frontend permission checks are only for UX.

Relevant task files:

```txt
docs/tasks/05-decks-cards.md
docs/tasks/06-public-decks.md
docs/tasks/07-srs-lessons.md
docs/tasks/10-groups-sharing.md
docs/tasks/12-admin-analytics.md
docs/tasks/15-frontend-decks-cards.md
docs/tasks/16-frontend-lessons.md
docs/tasks/19-frontend-groups-admin.md
```

## Core Principles

```txt
- Never rely only on frontend permission checks.
- Backend use cases must validate permissions.
- GraphQL resolvers must not contain permission business logic.
- Permission logic should live in domain/application services.
- Prisma repositories should not decide business permissions.
- Return generic forbidden errors where detailed reason would leak data.
```

## User Roles

Flashcards has three user roles:

```txt
USER
MODERATOR
ADMIN
```

## Role Meaning

### USER

Regular user.

Can:

```txt
- manage own decks
- manage own cards
- study own decks
- study public approved decks
- study group-shared decks where user is a member
- create groups
- accept/decline own group invitations
```

Cannot:

```txt
- access admin operations
- moderate public decks
- block users
- set decks as official
```

### MODERATOR

Moderator user.

Can:

```txt
- do everything USER can do
- access moderation queue
- approve/reject/hide public decks
```

Cannot:

```txt
- block users
- unblock users
- set official decks
- change user roles
```

### ADMIN

Admin user.

Can:

```txt
- do everything USER can do
- access platform stats
- list users
- block users
- unblock users
- moderate public decks
- set official decks
```

Cannot:

```txt
- access password hashes
- access token hashes
- bypass domain invariants
```

## Safe User Rule

GraphQL output must never expose:

```txt
passwordHash
refreshTokenHash
emailVerificationTokenHash
passwordResetTokenHash
```

Safe user fields:

```txt
id
email
role
emailVerifiedAt
blockedAt
createdAt
updatedAt
```

## Blocked Users

If `user.blockedAt` is not null, the user is blocked.

Blocked users must not be able to:

```txt
- log in
- refresh tokens
- access protected GraphQL operations
- create decks
- study decks
- create groups
- accept invitations
```

If a user is blocked while already logged in:

```txt
- refresh token must fail
- protected operations should reject when user is loaded
- existing access token may expire naturally if no DB check is performed per request
```

## Deck Permissions

Deck-related permission checks should be handled by a domain/application service.

Recommended service:

```txt
DeckPermissionService
```

## Deck Visibility

Deck visibility values:

```txt
PRIVATE
PUBLIC
```

Deck moderation status values:

```txt
NONE
PENDING
APPROVED
REJECTED
HIDDEN
```

## Own Deck Permissions

Deck owner can:

```txt
- view own deck
- update own deck
- delete own deck
- create cards in own deck
- update cards in own deck
- delete cards in own deck
- start lessons from own deck
- publish own deck
- unpublish own deck
- import CSV into own deck
- generate AI examples for own cards
```

Deck owner cannot:

```txt
- bypass validation
- set isOfficial unless ADMIN
- moderate own deck through admin-only moderation unless role allows
```

## Private Deck Permissions

Private deck can be viewed by:

```txt
- owner
- group members if deck is shared with their group
```

Private deck cannot be viewed by:

```txt
- anonymous users
- unrelated users
```

## Public Deck Permissions

Public deck can be viewed by anyone only when:

```txt
visibility = PUBLIC
moderationStatus = APPROVED
deletedAt = null
```

Public deck must not appear in public search if:

```txt
visibility != PUBLIC
moderationStatus != APPROVED
deletedAt != null
```

## Public Deck Search

Public deck search can be used by:

```txt
- anonymous users
- authenticated users
```

Search results must include only:

```txt
- public approved decks
- non-deleted decks
```

Search must not include:

```txt
- private decks
- rejected decks
- hidden decks
- deleted decks
```

## Publish Deck

User can publish deck if:

```txt
- user is authenticated
- user owns the deck
- deck is not deleted
- deck has at least one card
```

MVP behavior:

```txt
publishDeck:
- sets visibility = PUBLIC
- sets moderationStatus = APPROVED
```

Post-MVP moderation behavior may change to:

```txt
publishDeck:
- sets visibility = PUBLIC
- sets moderationStatus = PENDING
```

## Unpublish Deck

User can unpublish deck if:

```txt
- user is authenticated
- user owns the deck
- deck is not deleted
```

MVP behavior:

```txt
unpublishDeck:
- sets visibility = PRIVATE
- sets moderationStatus = NONE
```

## Copy Public Deck

User can copy deck if:

```txt
- user is authenticated
- source deck is PUBLIC
- source deck is APPROVED
- source deck is not deleted
```

Copy behavior:

```txt
- creates new deck owned by current user
- copied deck visibility = PRIVATE
- copied deck moderationStatus = NONE
- copied deck sourceDeckId = source deck id
- copies cards
- does not copy SRS state
- does not copy study sessions
- does not copy review history
```

## Card Permissions

User can create/update/delete card if:

```txt
- user is authenticated
- user owns the deck
- deck is not deleted
```

User can view cards if:

```txt
- user owns the deck
- deck is public and approved
- deck is shared with a group where user is a member
```

For anonymous users:

```txt
- can view cards only for public approved decks
```

## Lesson Permissions

User can start a lesson if:

```txt
- user is authenticated
- deck is visible to user
- deck is not deleted
- deck has available cards
```

Deck is visible to user if:

```txt
- user owns deck
- deck is public and approved
- deck is shared with a group where user is a member
```

User can submit review if:

```txt
- user is authenticated
- study session belongs to user
- study session is active
- card belongs to session deck
```

User cannot submit review if:

```txt
- session belongs to another user
- session is completed
- session is abandoned
- card is not part of deck/session
```

## CSV Import Permissions

User can preview CSV import if:

```txt
- user is authenticated
- user owns the deck
- deck is not deleted
```

User can confirm CSV import if:

```txt
- user is authenticated
- user owns the deck
- import belongs to user
- import belongs to deck
- import is not already confirmed
```

CSV import is not allowed for:

```txt
- public deck viewer
- group member with view-only access
- anonymous user
```

## AI Example Permissions

User can generate AI examples if:

```txt
- user is authenticated
- user owns the card's deck
- deck is not deleted
```

User can save generated example if:

```txt
- user is authenticated
- user owns the card's deck
- selected example is valid
```

AI examples must not automatically update card content.

User must explicitly save a generated example.

## Group Roles

Group roles:

```txt
OWNER
ADMIN
MEMBER
```

## Group Role Meaning

### OWNER

Group owner can:

```txt
- view group
- invite users
- share decks with group
- view group shared decks
- manage group metadata if implemented
```

### ADMIN

Group admin can:

```txt
- view group
- invite users
- share decks with group
- view group shared decks
```

### MEMBER

Group member can:

```txt
- view group
- view group shared decks
- study group shared decks
```

Group member cannot:

```txt
- invite users
- share decks with group
- edit shared decks unless they own them
```

## Group Creation

Authenticated user can create group.

Creator becomes:

```txt
GroupMember role = OWNER
```

## Group Invitation Permissions

User can invite to group if:

```txt
- user is authenticated
- user is group OWNER or ADMIN
- group is not deleted
```

Invitation rules:

```txt
- invite is sent to email
- pending duplicate invitations should be avoided
- invitation expires
- invited user can accept or decline own invitation
```

User can accept invitation if:

```txt
- user is authenticated
- invitation email matches user's email
- invitation status = PENDING
- invitation is not expired
```

User can decline invitation if:

```txt
- user is authenticated
- invitation email matches user's email
- invitation status = PENDING
```

User cannot accept:

```txt
- another user's invitation
- expired invitation
- accepted invitation
- declined invitation
- cancelled invitation
```

## Deck Group Sharing Permissions

User can share deck with group if:

```txt
- user is authenticated
- user owns the deck
- user is OWNER or ADMIN of the group
- deck is not deleted
- group is not deleted
```

MVP share permission:

```txt
VIEW
```

Group-shared deck can be viewed by:

```txt
- group OWNER
- group ADMIN
- group MEMBER
```

Group-shared deck can be edited by:

```txt
- deck owner only
```

Group members do not automatically get edit rights.

## Admin Permissions

Admin operations must require authenticated user with role:

```txt
ADMIN
```

Admin-only operations:

```txt
- adminPlatformStats
- adminUsers
- blockUser
- unblockUser
- set deck as official
```

Admin users must not be able to:

```txt
- see password hashes
- see token hashes
- directly mutate database from resolver
```

## Moderator Permissions

Moderator operations require:

```txt
ADMIN or MODERATOR
```

Moderator operations:

```txt
- view public deck moderation queue
- approve public deck
- reject public deck
- hide public deck
```

Moderator cannot:

```txt
- block users
- unblock users
- set official deck
- change user role
```

## Public Deck Moderation

Deck moderation statuses:

```txt
NONE
PENDING
APPROVED
REJECTED
HIDDEN
```

Allowed transitions for ADMIN/MODERATOR:

```txt
PENDING -> APPROVED
PENDING -> REJECTED
APPROVED -> HIDDEN
REJECTED -> APPROVED
HIDDEN -> APPROVED
```

MVP may allow direct transition between statuses through admin mutation.

Official deck flag:

```txt
isOfficial
```

Only ADMIN can set:

```txt
isOfficial = true
```

MODERATOR cannot set official flag.

## Frontend Role Visibility

Frontend can hide routes/buttons based on role.

Examples:

```txt
- USER does not see Admin link.
- MODERATOR sees Moderation link.
- ADMIN sees Admin Dashboard link.
```

But frontend role visibility is not security.

Backend must still reject unauthorized requests.

## Error Codes

Permission-related error codes:

```txt
UNAUTHORIZED
FORBIDDEN
DECK_NOT_FOUND
DECK_FORBIDDEN
CARD_NOT_FOUND
CARD_FORBIDDEN
GROUP_NOT_FOUND
GROUP_FORBIDDEN
GROUP_INVITATION_NOT_FOUND
GROUP_INVITATION_INVALID
ADMIN_FORBIDDEN
```

Recommended behavior:

```txt
- Use UNAUTHORIZED when user is not authenticated.
- Use FORBIDDEN when user is authenticated but lacks permission.
- Use NOT_FOUND when revealing existence would leak private resource.
```

## Resolver Rules

GraphQL resolvers must:

```txt
- read current user from auth context
- pass current user id/role to use case
- not implement permission logic directly
- not query Prisma directly
```

Bad:

```ts
if (deck.ownerId !== currentUser.id) {
  throw new ForbiddenException()
}
```

Good:

```ts
return this.updateDeckUseCase.execute({
  currentUser,
  input,
})
```

Permission check belongs in use case/domain service.

## Use Case Rules

Use cases must:

```txt
- load required resource
- check permissions
- call domain services/policies where appropriate
- call repository ports
- return safe output
```

Use cases must not:

```txt
- depend on GraphQL decorators
- return Prisma models directly
- expose sensitive fields
```

## Repository Rules

Repositories must:

```txt
- fetch data
- save data
- map Prisma models to domain/application models
```

Repositories must not:

```txt
- decide business permissions
- know about GraphQL current user
- return password hashes unless specifically needed by auth use case
```

## Testing Requirements

Permission tests should cover:

```txt
- owner can manage own deck
- non-owner cannot update private deck
- anonymous cannot view private deck
- anonymous can view public approved deck
- public rejected deck is not visible
- group member can view shared deck
- group member cannot edit shared deck
- group OWNER can invite user
- group MEMBER cannot invite user
- invited user can accept own invitation
- user cannot accept another user's invitation
- ADMIN can block user
- MODERATOR cannot block user
- MODERATOR can moderate deck
- MODERATOR cannot set official deck
- USER cannot access admin operations
```

## Cursor Implementation Rules

Cursor must read this document before implementing or modifying:

```txt
deck permissions
card permissions
lesson permissions
CSV import permissions
AI example permissions
group permissions
admin permissions
frontend role visibility
```

Implementation must follow this document exactly unless this document is explicitly updated.
