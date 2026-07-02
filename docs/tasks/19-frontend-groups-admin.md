# EPIC-19 Frontend Groups & Admin

## Epic Goal

Implement frontend screens for groups, deck sharing, invitations, admin, moderation, and basic analytics.

This epic covers:

```txt
- groups list
- group details
- creating groups
- inviting users to groups
- accepting and declining group invitations
- sharing decks with groups
- viewing group-shared decks
- admin dashboard
- user search
- block/unblock user actions
- moderation queue
- approve/reject/hide deck actions
- official deck actions
```

Backend features are handled in:

```txt
docs/tasks/10-groups-sharing.md
docs/tasks/12-admin-analytics.md
```

## Epic Status

TODO

## Related Documents

Cursor must read these documents before working on this epic:

```txt
docs/architecture.md
docs/domain/permissions.md
docs/security/security-checklist.md
docs/tasks/README.md
docs/tasks/cursor-task-template.md
docs/tasks/10-groups-sharing.md
docs/tasks/12-admin-analytics.md
docs/tasks/13-frontend-foundation.md
docs/tasks/14-frontend-auth.md
docs/tasks/15-frontend-decks-cards.md
docs/tasks/18-frontend-profile-settings-notifications.md
```

## Epic Prerequisites

EPIC-18 should be complete.

Expected state:

```txt
- Expo app works.
- Auth works.
- Current user role is available in auth state.
- Apollo Client works.
- GraphQL codegen works.
- Deck/card frontend screens work.
- Profile screen works.
- Shared UI primitives exist.
- Backend groups API exists.
- Backend admin API exists.
```

## Epic Rules

```txt
1. Use Apollo Client for GraphQL operations.
2. Use generated GraphQL types/hooks when available.
3. Do not call backend directly with fetch from screens.
4. Do not implement backend permissions in frontend.
5. Frontend role-based UI is UX only.
6. Backend remains source of truth for all group/admin permissions.
7. Do not expose sensitive user fields.
8. Do not expose token hashes or passwords.
9. Do not expose push tokens.
10. Do not store auth tokens in localStorage/sessionStorage.
11. Keep UI usable on native and web.
```

## Permission Notes

Frontend may hide admin UI unless:

```txt
currentUser.role = ADMIN or MODERATOR
```

But backend must still enforce every operation.

Frontend may show group actions based on current user's group role:

```txt
OWNER or ADMIN:
- invite users
- share decks with group

MEMBER:
- view group
- view shared decks
```

But backend remains the source of truth.

## MVP Scope

Groups MVP:

```txt
- create group
- list my groups
- view group detail
- invite user by email
- view my invitations
- accept invitation
- decline invitation
- share owned deck with group
- view shared decks
```

Admin MVP:

```txt
- admin dashboard stats
- admin user search
- block user
- unblock user
- moderation queue
- approve deck
- reject deck
- hide deck
- set/unset official deck
```

MVP does not include:

```txt
- member removal
- role changes
- group ownership transfer
- group chat
- advanced analytics charts
- audit log UI
```

## Expected Backend Operations

Group operations:

```graphql
query MyGroups {
  myGroups {
    id
    name
    description
    createdById
    createdAt
    updatedAt
  }
}

query Group($id: ID!) {
  group(id: $id) {
    id
    name
    description
    createdById
    createdAt
    updatedAt
  }
}

mutation CreateGroup($input: CreateGroupInput!) {
  createGroup(input: $input) {
    id
    name
    description
    createdById
    createdAt
    updatedAt
  }
}

mutation InviteUserToGroup($input: InviteUserToGroupInput!) {
  inviteUserToGroup(input: $input) {
    id
    groupId
    email
    invitedById
    status
    expiresAt
    createdAt
    acceptedAt
    declinedAt
  }
}

query MyGroupInvitations {
  myGroupInvitations {
    id
    groupId
    email
    invitedById
    status
    expiresAt
    createdAt
    acceptedAt
    declinedAt
  }
}

mutation AcceptGroupInvitation($invitationId: ID!) {
  acceptGroupInvitation(invitationId: $invitationId) {
    invitation {
      id
      groupId
      email
      status
      acceptedAt
    }
    member {
      id
      groupId
      userId
      role
      createdAt
    }
  }
}

mutation DeclineGroupInvitation($invitationId: ID!) {
  declineGroupInvitation(invitationId: $invitationId) {
    id
    groupId
    email
    status
    declinedAt
  }
}

mutation ShareDeckWithGroup($input: ShareDeckWithGroupInput!) {
  shareDeckWithGroup(input: $input) {
    share {
      id
      deckId
      groupId
      permission
      createdById
      createdAt
    }
  }
}

query GroupSharedDecks($groupId: ID!) {
  groupSharedDecks(groupId: $groupId) {
    id
    ownerId
    title
    description
    visibility
    moderationStatus
    isOfficial
    sourceDeckId
    createdAt
    updatedAt
  }
}
```

Admin operations:

```graphql
query AdminDashboardStats {
  adminDashboardStats {
    totalUsers
    totalDecks
    totalPublicDecks
    totalCards
    totalStudySessions
    totalReviews
    usersCreatedLast7Days
    decksCreatedLast7Days
    reviewsSubmittedLast7Days
  }
}

query AdminSearchUsers($input: AdminSearchUsersInput) {
  adminSearchUsers(input: $input) {
    items {
      id
      email
      role
      emailVerifiedAt
      blockedAt
      createdAt
      updatedAt
    }
    total
  }
}

mutation BlockUser($userId: ID!) {
  blockUser(userId: $userId) {
    id
    email
    role
    blockedAt
    updatedAt
  }
}

mutation UnblockUser($userId: ID!) {
  unblockUser(userId: $userId) {
    id
    email
    role
    blockedAt
    updatedAt
  }
}

query ModerationQueue($input: ModerationQueueInput) {
  moderationQueue(input: $input) {
    items {
      id
      ownerId
      ownerEmail
      title
      description
      visibility
      moderationStatus
      isOfficial
      sourceDeckId
      cardCount
      createdAt
      updatedAt
    }
    total
  }
}

mutation ApproveDeck($deckId: ID!) {
  approveDeck(deckId: $deckId) {
    id
    moderationStatus
    updatedAt
  }
}

mutation RejectDeck($deckId: ID!) {
  rejectDeck(deckId: $deckId) {
    id
    moderationStatus
    updatedAt
  }
}

mutation HideDeck($deckId: ID!) {
  hideDeck(deckId: $deckId) {
    id
    moderationStatus
    updatedAt
  }
}

mutation SetOfficialDeck($deckId: ID!, $isOfficial: Boolean!) {
  setOfficialDeck(deckId: $deckId, isOfficial: $isOfficial) {
    id
    isOfficial
    updatedAt
  }
}
```

## Frontend Routes

Implement:

```txt
/groups
/groups/new
/groups/invitations
/groups/[groupId]
/groups/[groupId]/share-deck
/admin
/admin/users
/admin/moderation
```

Optional:

```txt
/admin/decks/[deckId]
```

## Epic Summary

```md
- [ ] TASK-19.01 Add groups/admin GraphQL documents
- [ ] TASK-19.02 Generate groups/admin GraphQL types
- [ ] TASK-19.03 Add groups feature structure
- [ ] TASK-19.04 Add admin feature structure
- [ ] TASK-19.05 Add groups navigation entry points
- [ ] TASK-19.06 Add my groups screen
- [ ] TASK-19.07 Add create group screen
- [ ] TASK-19.08 Add group detail screen
- [ ] TASK-19.09 Add invite user to group flow
- [ ] TASK-19.10 Add group invitations screen
- [ ] TASK-19.11 Add accept/decline invitation actions
- [ ] TASK-19.12 Add share deck with group flow
- [ ] TASK-19.13 Add group shared decks UI
- [ ] TASK-19.14 Add admin navigation entry points
- [ ] TASK-19.15 Add admin dashboard screen
- [ ] TASK-19.16 Add admin user search screen
- [ ] TASK-19.17 Add block/unblock user actions
- [ ] TASK-19.18 Add moderation queue screen
- [ ] TASK-19.19 Add deck moderation actions
- [ ] TASK-19.20 Add official deck action
- [ ] TASK-19.21 Add frontend groups/admin final checks
```

---

# TASK-19.01 Add groups/admin GraphQL documents

## Status

TODO

## Context

Frontend groups and admin screens should use GraphQL documents and generated types.

## Goal

Add GraphQL documents.

## Files to Create

```txt
apps/mobile/src/features/groups/graphql/groups.graphql
apps/mobile/src/features/admin/graphql/admin.graphql
```

## Requirements

Add group operations:

```graphql
query MyGroups {
  myGroups {
    id
    name
    description
    createdById
    createdAt
    updatedAt
  }
}

query Group($id: ID!) {
  group(id: $id) {
    id
    name
    description
    createdById
    createdAt
    updatedAt
  }
}

mutation CreateGroup($input: CreateGroupInput!) {
  createGroup(input: $input) {
    id
    name
    description
    createdById
    createdAt
    updatedAt
  }
}

mutation InviteUserToGroup($input: InviteUserToGroupInput!) {
  inviteUserToGroup(input: $input) {
    id
    groupId
    email
    invitedById
    status
    expiresAt
    createdAt
    acceptedAt
    declinedAt
  }
}

query MyGroupInvitations {
  myGroupInvitations {
    id
    groupId
    email
    invitedById
    status
    expiresAt
    createdAt
    acceptedAt
    declinedAt
  }
}

mutation AcceptGroupInvitation($invitationId: ID!) {
  acceptGroupInvitation(invitationId: $invitationId) {
    invitation {
      id
      groupId
      email
      status
      acceptedAt
    }
    member {
      id
      groupId
      userId
      role
      createdAt
    }
  }
}

mutation DeclineGroupInvitation($invitationId: ID!) {
  declineGroupInvitation(invitationId: $invitationId) {
    id
    groupId
    email
    status
    declinedAt
  }
}

mutation ShareDeckWithGroup($input: ShareDeckWithGroupInput!) {
  shareDeckWithGroup(input: $input) {
    share {
      id
      deckId
      groupId
      permission
      createdById
      createdAt
    }
  }
}

query GroupSharedDecks($groupId: ID!) {
  groupSharedDecks(groupId: $groupId) {
    id
    ownerId
    title
    description
    visibility
    moderationStatus
    isOfficial
    sourceDeckId
    createdAt
    updatedAt
  }
}
```

Add admin operations:

```graphql
query AdminDashboardStats {
  adminDashboardStats {
    totalUsers
    totalDecks
    totalPublicDecks
    totalCards
    totalStudySessions
    totalReviews
    usersCreatedLast7Days
    decksCreatedLast7Days
    reviewsSubmittedLast7Days
  }
}

query AdminSearchUsers($input: AdminSearchUsersInput) {
  adminSearchUsers(input: $input) {
    items {
      id
      email
      role
      emailVerifiedAt
      blockedAt
      createdAt
      updatedAt
    }
    total
  }
}

mutation BlockUser($userId: ID!) {
  blockUser(userId: $userId) {
    id
    email
    role
    emailVerifiedAt
    blockedAt
    createdAt
    updatedAt
  }
}

mutation UnblockUser($userId: ID!) {
  unblockUser(userId: $userId) {
    id
    email
    role
    emailVerifiedAt
    blockedAt
    createdAt
    updatedAt
  }
}

query ModerationQueue($input: ModerationQueueInput) {
  moderationQueue(input: $input) {
    items {
      id
      ownerId
      ownerEmail
      title
      description
      visibility
      moderationStatus
      isOfficial
      sourceDeckId
      cardCount
      createdAt
      updatedAt
    }
    total
  }
}

mutation ApproveDeck($deckId: ID!) {
  approveDeck(deckId: $deckId) {
    id
    ownerId
    ownerEmail
    title
    description
    visibility
    moderationStatus
    isOfficial
    sourceDeckId
    cardCount
    createdAt
    updatedAt
  }
}

mutation RejectDeck($deckId: ID!) {
  rejectDeck(deckId: $deckId) {
    id
    ownerId
    ownerEmail
    title
    description
    visibility
    moderationStatus
    isOfficial
    sourceDeckId
    cardCount
    createdAt
    updatedAt
  }
}

mutation HideDeck($deckId: ID!) {
  hideDeck(deckId: $deckId) {
    id
    ownerId
    ownerEmail
    title
    description
    visibility
    moderationStatus
    isOfficial
    sourceDeckId
    cardCount
    createdAt
    updatedAt
  }
}

mutation SetOfficialDeck($deckId: ID!, $isOfficial: Boolean!) {
  setOfficialDeck(deckId: $deckId, isOfficial: $isOfficial) {
    id
    ownerId
    ownerEmail
    title
    description
    visibility
    moderationStatus
    isOfficial
    sourceDeckId
    cardCount
    createdAt
    updatedAt
  }
}
```

## Security Requirements

```txt
- Do not request passwordHash.
- Do not request refresh token hashes.
- Do not request reset/verification token hashes.
- Do not request push token values.
- Do not request deletedAt in normal UI unless admin use case explicitly needs it.
```

## Acceptance Criteria

```txt
- Groups GraphQL document exists.
- Admin GraphQL document exists.
- Only safe fields are requested.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
TASK-19.01 Add groups/admin GraphQL documents
```

---

# TASK-19.02 Generate groups/admin GraphQL types

## Status

TODO

## Context

Frontend should use generated GraphQL types and hooks.

## Goal

Run codegen for groups and admin operations.

## Files to Modify

```txt
apps/mobile/src/graphql/generated/index.ts
```

## Requirements

Run backend locally if schema is loaded from local GraphQL endpoint.

Then run:

```bash
pnpm --filter @flashcards/mobile codegen
```

Generated output should include hooks/types for:

```txt
MyGroups
Group
CreateGroup
InviteUserToGroup
MyGroupInvitations
AcceptGroupInvitation
DeclineGroupInvitation
ShareDeckWithGroup
GroupSharedDecks
AdminDashboardStats
AdminSearchUsers
BlockUser
UnblockUser
ModerationQueue
ApproveDeck
RejectDeck
HideDeck
SetOfficialDeck
```

## Do Not Do

```txt
- Do not manually edit generated file.
- Do not commit generated file if repository convention excludes generated files.
```

## Acceptance Criteria

```txt
- Groups/admin generated types exist or codegen successfully runs.
- Mobile typecheck passes.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile codegen
pnpm --filter @flashcards/mobile typecheck
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
TASK-19.02 Generate groups/admin GraphQL types
```

---

# TASK-19.03 Add groups feature structure

## Status

TODO

## Context

Groups frontend code should be isolated in a feature folder.

## Goal

Create groups feature folder structure.

## Files to Create

```txt
apps/mobile/src/features/groups/components/.gitkeep
apps/mobile/src/features/groups/hooks/.gitkeep
apps/mobile/src/features/groups/screens/.gitkeep
apps/mobile/src/features/groups/graphql/.gitkeep
apps/mobile/src/features/groups/validation/.gitkeep
apps/mobile/src/features/groups/types/.gitkeep
apps/mobile/src/features/groups/index.ts
```

## Requirements

Create index exports:

```ts
export * from './components'
export * from './hooks'
export * from './types'
```

Create index files as needed:

```txt
apps/mobile/src/features/groups/components/index.ts
apps/mobile/src/features/groups/hooks/index.ts
apps/mobile/src/features/groups/types/index.ts
```

## Architecture Constraints

```txt
- Groups feature code lives in src/features/groups.
- Generic UI remains in src/ui.
- Auth token logic remains in auth feature.
```

## Acceptance Criteria

```txt
- Groups feature structure exists.
- Exports exist.
- Typecheck passes.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
TASK-19.03 Add groups feature structure
```

---

# TASK-19.04 Add admin feature structure

## Status

TODO

## Context

Admin frontend code should be isolated in a feature folder.

## Goal

Create admin feature folder structure.

## Files to Create

```txt
apps/mobile/src/features/admin/components/.gitkeep
apps/mobile/src/features/admin/hooks/.gitkeep
apps/mobile/src/features/admin/screens/.gitkeep
apps/mobile/src/features/admin/graphql/.gitkeep
apps/mobile/src/features/admin/types/.gitkeep
apps/mobile/src/features/admin/index.ts
```

## Requirements

Create index exports:

```ts
export * from './components'
export * from './hooks'
export * from './types'
```

Create index files as needed:

```txt
apps/mobile/src/features/admin/components/index.ts
apps/mobile/src/features/admin/hooks/index.ts
apps/mobile/src/features/admin/types/index.ts
```

## Architecture Constraints

```txt
- Admin feature code lives in src/features/admin.
- Generic UI remains in src/ui.
- Admin UI must not be treated as backend security.
```

## Acceptance Criteria

```txt
- Admin feature structure exists.
- Exports exist.
- Typecheck passes.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
TASK-19.04 Add admin feature structure
```

---

# TASK-19.05 Add groups navigation entry points

## Status

TODO

## Context

Users need to navigate to groups from the app.

## Goal

Add group routes and navigation links.

## Files to Create

```txt
apps/mobile/app/groups/index.tsx
apps/mobile/app/groups/new.tsx
apps/mobile/app/groups/invitations.tsx
apps/mobile/app/groups/[groupId]/index.tsx
apps/mobile/app/groups/[groupId]/share-deck.tsx
```

## Files to Modify

```txt
apps/mobile/app/(tabs)/profile.tsx
apps/mobile/src/features/profile/screens/profile-screen.tsx
```

## Requirements

Add profile links/buttons:

```txt
- My groups
- Group invitations
```

Routes should render placeholder screens until implemented in later tasks.

## Security Requirements

```txt
- Routes are behind app auth gating.
- Backend still enforces access.
```

## Acceptance Criteria

```txt
- Group routes exist.
- Profile screen links to groups.
- Profile screen links to invitations.
- Typecheck passes.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm --filter @flashcards/mobile web
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
TASK-19.05 Add groups navigation entry points
```

---

# TASK-19.06 Add my groups screen

## Status

TODO

## Context

Users need to view groups they belong to.

## Goal

Implement my groups screen.

## Files to Modify

```txt
apps/mobile/app/groups/index.tsx
```

## Files to Create

```txt
apps/mobile/src/features/groups/screens/my-groups-screen.tsx
apps/mobile/src/features/groups/components/group-list.tsx
apps/mobile/src/features/groups/components/group-list-item.tsx
```

## Requirements

Screen should:

```txt
- call MyGroups query
- show loading state
- show error state
- show empty state
- list group name and description
- navigate to group detail on press
- show create group button
- show invitations button
```

Navigation:

```txt
create group -> /groups/new
group detail -> /groups/[groupId]
invitations -> /groups/invitations
```

## Security Requirements

```txt
- Do not accept userId input.
- Use current user's myGroups query.
```

## Acceptance Criteria

```txt
- My groups screen renders.
- Loading/error/empty states exist.
- User can navigate to create group.
- User can navigate to group detail.
- Typecheck passes.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm --filter @flashcards/mobile web
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
TASK-19.06 Add my groups screen
```

---

# TASK-19.07 Add create group screen

## Status

TODO

## Context

Users need to create groups.

## Goal

Implement create group screen.

## Files to Modify

```txt
apps/mobile/app/groups/new.tsx
```

## Files to Create

```txt
apps/mobile/src/features/groups/screens/create-group-screen.tsx
apps/mobile/src/features/groups/components/group-form.tsx
apps/mobile/src/features/groups/validation/group-form.schema.ts
```

## Requirements

Form fields:

```txt
name
description
```

Validation:

```txt
name:
- required
- trim
- min 1
- max 120

description:
- optional
- trim
- max 1000
```

Submit behavior:

```txt
1. Validate form.
2. Call CreateGroup mutation.
3. Refetch MyGroups or update Apollo cache.
4. Navigate to created group detail.
```

## Security Requirements

```txt
- Do not send createdById.
- Backend sets current user as owner.
```

## Acceptance Criteria

```txt
- Create group screen exists.
- Group form validates.
- CreateGroup mutation is used.
- User navigates to created group.
- Typecheck passes.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm --filter @flashcards/mobile web
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
TASK-19.07 Add create group screen
```

---

# TASK-19.08 Add group detail screen

## Status

TODO

## Context

Group members need to view group details.

## Goal

Implement group detail screen.

## Files to Modify

```txt
apps/mobile/app/groups/[groupId]/index.tsx
```

## Files to Create

```txt
apps/mobile/src/features/groups/screens/group-detail-screen.tsx
apps/mobile/src/features/groups/components/group-header.tsx
apps/mobile/src/features/groups/components/group-actions.tsx
```

## Requirements

Screen should:

```txt
- read groupId from route params
- call Group query
- call GroupSharedDecks query
- show loading state
- show error state
- show group name and description
- show shared decks section
- show invite user action
- show share deck action
```

Navigation:

```txt
invite user -> action inside screen or modal
share deck -> /groups/[groupId]/share-deck
shared deck -> /decks/[deckId]
```

## Security Requirements

```txt
- Frontend action visibility is UX only.
- Backend enforces group membership and role.
```

## Acceptance Criteria

```txt
- Group detail screen exists.
- Group query is used.
- Shared decks query is used.
- Group actions render.
- Typecheck passes.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm --filter @flashcards/mobile web
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
TASK-19.08 Add group detail screen
```

---

# TASK-19.09 Add invite user to group flow

## Status

TODO

## Context

Group OWNER or ADMIN can invite users by email.

## Goal

Implement invite user UI.

## Files to Create

```txt
apps/mobile/src/features/groups/components/invite-user-form.tsx
apps/mobile/src/features/groups/validation/invite-user.schema.ts
```

## Files to Modify

```txt
apps/mobile/src/features/groups/screens/group-detail-screen.tsx
apps/mobile/src/features/groups/components/group-actions.tsx
```

## Requirements

Form field:

```txt
email
```

Validation:

```txt
email:
- required
- valid email
```

Submit behavior:

```txt
1. Call InviteUserToGroup mutation.
2. Show success state.
3. Clear form.
```

UI:

```txt
- show invite form in modal or inline section
- show backend errors
- explain invited user can accept from invitations screen
```

## Security Requirements

```txt
- Backend enforces OWNER/ADMIN role.
- MEMBER may see no button, but backend is source of truth.
- Do not expose whether email is registered unless backend returns it intentionally.
```

## Acceptance Criteria

```txt
- Invite user form exists.
- InviteUserToGroup mutation is used.
- Success/error states work.
- Typecheck passes.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm --filter @flashcards/mobile web
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
TASK-19.09 Add invite user to group flow
```

---

# TASK-19.10 Add group invitations screen

## Status

TODO

## Context

Users need to see pending group invitations.

## Goal

Implement group invitations screen.

## Files to Modify

```txt
apps/mobile/app/groups/invitations.tsx
```

## Files to Create

```txt
apps/mobile/src/features/groups/screens/group-invitations-screen.tsx
apps/mobile/src/features/groups/components/group-invitation-list.tsx
apps/mobile/src/features/groups/components/group-invitation-list-item.tsx
```

## Requirements

Screen should:

```txt
- call MyGroupInvitations query
- show loading state
- show error state
- show empty state
- list pending invitations
- show accept action
- show decline action
```

Invitation item should show:

```txt
groupId
email
status
expiresAt
```

If backend later returns group name, display it.

## Security Requirements

```txt
- Do not accept email input for invitation query.
- Backend returns only current user's invitations.
```

## Acceptance Criteria

```txt
- Group invitations screen exists.
- MyGroupInvitations query is used.
- Loading/error/empty states exist.
- Accept/decline action entry points exist.
- Typecheck passes.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm --filter @flashcards/mobile web
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
TASK-19.10 Add group invitations screen
```

---

# TASK-19.11 Add accept/decline invitation actions

## Status

TODO

## Context

Users need to accept or decline invitations.

## Goal

Implement accept and decline actions.

## Files to Modify

```txt
apps/mobile/src/features/groups/components/group-invitation-list-item.tsx
apps/mobile/src/features/groups/screens/group-invitations-screen.tsx
```

## Requirements

Accept behavior:

```txt
1. Call AcceptGroupInvitation mutation.
2. Refetch MyGroupInvitations.
3. Refetch MyGroups or update Apollo cache.
4. Show success.
```

Decline behavior:

```txt
1. Call DeclineGroupInvitation mutation.
2. Refetch MyGroupInvitations.
3. Show success.
```

UX:

```txt
- prevent double submit
- show mutation loading state
- show backend errors
```

## Security Requirements

```txt
- Backend validates invitation belongs to current user's email.
- Frontend must not accept/decline arbitrary invitations as source of truth.
```

## Acceptance Criteria

```txt
- Accept action works.
- Decline action works.
- Mutations are used.
- Lists update after action.
- Typecheck passes.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm --filter @flashcards/mobile web
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
TASK-19.11 Add accept/decline invitation actions
```

---

# TASK-19.12 Add share deck with group flow

## Status

TODO

## Context

Group OWNER/ADMIN can share owned decks with the group.

## Goal

Implement share deck with group screen.

## Files to Modify

```txt
apps/mobile/app/groups/[groupId]/share-deck.tsx
```

## Files to Create

```txt
apps/mobile/src/features/groups/screens/share-deck-with-group-screen.tsx
apps/mobile/src/features/groups/components/share-deck-form.tsx
```

## Requirements

Screen should:

```txt
- read groupId from route params
- call MyDecks query
- allow selecting one owned deck
- call ShareDeckWithGroup mutation
- show success/error state
- navigate back to group detail after success
```

UI should explain:

```txt
Shared decks are view-only for group members.
```

## Security Requirements

```txt
- Backend enforces group OWNER/ADMIN role.
- Backend enforces deck ownership/manage permission.
- Frontend must not grant edit access.
```

## Acceptance Criteria

```txt
- Share deck screen exists.
- MyDecks query is used.
- ShareDeckWithGroup mutation is used.
- Success/error states work.
- Typecheck passes.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm --filter @flashcards/mobile web
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
TASK-19.12 Add share deck with group flow
```

---

# TASK-19.13 Add group shared decks UI

## Status

TODO

## Context

Group members need to open shared decks.

## Goal

Add shared decks UI.

## Files to Create

```txt
apps/mobile/src/features/groups/components/group-shared-deck-list.tsx
apps/mobile/src/features/groups/components/group-shared-deck-list-item.tsx
```

## Files to Modify

```txt
apps/mobile/src/features/groups/screens/group-detail-screen.tsx
```

## Requirements

Shared deck list should:

```txt
- render decks from GroupSharedDecks query
- show title and description
- show visibility/status
- navigate to deck detail on press
- show empty state when none
```

Deck detail route should remain:

```txt
/decks/[deckId]
```

Backend deck query should allow group members to view shared deck.

## Security Requirements

```txt
- Shared deck UI is read/study only for group members.
- Backend prevents edit access.
```

## Acceptance Criteria

```txt
- Shared deck list exists.
- Group detail uses shared deck list.
- Shared deck opens deck detail.
- Typecheck passes.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm --filter @flashcards/mobile web
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
TASK-19.13 Add group shared decks UI
```

---

# TASK-19.14 Add admin navigation entry points

## Status

TODO

## Context

Admins and moderators need access to admin/moderation screens.

## Goal

Add admin routes and profile navigation links.

## Files to Create

```txt
apps/mobile/app/admin/index.tsx
apps/mobile/app/admin/users.tsx
apps/mobile/app/admin/moderation.tsx
```

## Files to Modify

```txt
apps/mobile/src/features/profile/screens/profile-screen.tsx
```

## Requirements

Profile screen should show admin links when:

```txt
currentUser.role = ADMIN or MODERATOR
```

Links:

```txt
Admin dashboard -> /admin
User management -> /admin/users
Moderation queue -> /admin/moderation
```

UI rule:

```txt
- ADMIN can see all admin links.
- MODERATOR can see moderation queue link.
```

Important:

```txt
This is UX only. Backend still enforces permissions.
```

## Security Requirements

```txt
- Do not rely on hidden links for security.
- Backend must reject unauthorized users.
```

## Acceptance Criteria

```txt
- Admin routes exist.
- ADMIN sees dashboard/users/moderation links.
- MODERATOR sees moderation link.
- USER sees no admin links.
- Typecheck passes.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm --filter @flashcards/mobile web
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
TASK-19.14 Add admin navigation entry points
```

---

# TASK-19.15 Add admin dashboard screen

## Status

TODO

## Context

Admins need to see platform-level stats.

## Goal

Implement admin dashboard screen.

## Files to Modify

```txt
apps/mobile/app/admin/index.tsx
```

## Files to Create

```txt
apps/mobile/src/features/admin/screens/admin-dashboard-screen.tsx
apps/mobile/src/features/admin/components/admin-stats-grid.tsx
apps/mobile/src/features/admin/components/admin-stat-card.tsx
```

## Requirements

Screen should:

```txt
- call AdminDashboardStats query
- show loading state
- show error state
- show stat cards
```

Stats to show:

```txt
totalUsers
totalDecks
totalPublicDecks
totalCards
totalStudySessions
totalReviews
usersCreatedLast7Days
decksCreatedLast7Days
reviewsSubmittedLast7Days
```

If backend rejects:

```txt
show a forbidden/error state
```

## Security Requirements

```txt
- Backend enforces ADMIN only.
- Frontend should not fabricate stats.
```

## Acceptance Criteria

```txt
- Admin dashboard screen exists.
- AdminDashboardStats query is used.
- Stats render.
- Forbidden state is handled.
- Typecheck passes.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm --filter @flashcards/mobile web
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
TASK-19.15 Add admin dashboard screen
```

---

# TASK-19.16 Add admin user search screen

## Status

TODO

## Context

Admins need to search users and manage blocked status.

## Goal

Implement admin user search screen.

## Files to Modify

```txt
apps/mobile/app/admin/users.tsx
```

## Files to Create

```txt
apps/mobile/src/features/admin/screens/admin-users-screen.tsx
apps/mobile/src/features/admin/components/admin-user-search.tsx
apps/mobile/src/features/admin/components/admin-user-list.tsx
apps/mobile/src/features/admin/components/admin-user-list-item.tsx
```

## Requirements

Screen should:

```txt
- call AdminSearchUsers query
- support search input
- debounce search input
- show loading state
- show error state
- show empty state
- list user email, role, verified status, blocked status
- show block/unblock action entry points
```

## Security Requirements

```txt
- Backend enforces ADMIN only.
- Do not request/display password hashes or token hashes.
- Do not display push token values.
```

## Acceptance Criteria

```txt
- Admin users screen exists.
- AdminSearchUsers query is used.
- Search works.
- Safe user fields render.
- Typecheck passes.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm --filter @flashcards/mobile web
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
TASK-19.16 Add admin user search screen
```

---

# TASK-19.17 Add block/unblock user actions

## Status

TODO

## Context

Admins need to block and unblock users.

## Goal

Implement user block/unblock actions.

## Files to Modify

```txt
apps/mobile/src/features/admin/components/admin-user-list-item.tsx
apps/mobile/src/features/admin/screens/admin-users-screen.tsx
```

## Requirements

Block behavior:

```txt
1. Show confirmation.
2. Call BlockUser mutation.
3. Update list item or refetch AdminSearchUsers.
4. Show success/error state.
```

Unblock behavior:

```txt
1. Show confirmation.
2. Call UnblockUser mutation.
3. Update list item or refetch AdminSearchUsers.
4. Show success/error state.
```

UX:

```txt
- destructive styling for block
- mutation loading state
- prevent double submit
```

## Security Requirements

```txt
- Backend enforces ADMIN only.
- MODERATOR must be rejected by backend.
- Frontend must not assume role hiding is sufficient.
```

## Acceptance Criteria

```txt
- Block user action works.
- Unblock user action works.
- Confirmations exist.
- List updates after action.
- Typecheck passes.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm --filter @flashcards/mobile web
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
TASK-19.17 Add block/unblock user actions
```

---

# TASK-19.18 Add moderation queue screen

## Status

TODO

## Context

Admins and moderators need to review public deck submissions.

## Goal

Implement moderation queue screen.

## Files to Modify

```txt
apps/mobile/app/admin/moderation.tsx
```

## Files to Create

```txt
apps/mobile/src/features/admin/screens/moderation-queue-screen.tsx
apps/mobile/src/features/admin/components/moderation-deck-list.tsx
apps/mobile/src/features/admin/components/moderation-deck-list-item.tsx
apps/mobile/src/features/admin/components/moderation-status-filter.tsx
```

## Requirements

Screen should:

```txt
- call ModerationQueue query
- support status filter
- show loading state
- show error state
- show empty state
- list title, ownerEmail, cardCount, moderationStatus, official badge
- show approve/reject/hide action entry points
- show official toggle entry point for ADMIN users
```

Status filters:

```txt
PENDING
APPROVED
REJECTED
HIDDEN
```

## Security Requirements

```txt
- Backend enforces ADMIN or MODERATOR.
- Do not expose sensitive owner fields beyond safe email.
```

## Acceptance Criteria

```txt
- Moderation queue screen exists.
- ModerationQueue query is used.
- Status filter works.
- Moderation deck list renders.
- Typecheck passes.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm --filter @flashcards/mobile web
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
TASK-19.18 Add moderation queue screen
```

---

# TASK-19.19 Add deck moderation actions

## Status

TODO

## Context

Admins and moderators need to approve, reject, and hide public decks.

## Goal

Implement moderation actions.

## Files to Modify

```txt
apps/mobile/src/features/admin/components/moderation-deck-list-item.tsx
apps/mobile/src/features/admin/screens/moderation-queue-screen.tsx
```

## Requirements

Actions:

```txt
Approve
Reject
Hide
```

Behavior:

```txt
1. Show confirmation.
2. Call correct mutation.
3. Update list item or refetch ModerationQueue.
4. Show success/error feedback.
```

Mutation mapping:

```txt
Approve -> ApproveDeck
Reject  -> RejectDeck
Hide    -> HideDeck
```

## Security Requirements

```txt
- Backend enforces ADMIN/MODERATOR.
- USER cannot moderate.
```

## Acceptance Criteria

```txt
- Approve action works.
- Reject action works.
- Hide action works.
- Confirmations exist.
- Queue updates after action.
- Typecheck passes.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm --filter @flashcards/mobile web
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
TASK-19.19 Add deck moderation actions
```

---

# TASK-19.20 Add official deck action

## Status

TODO

## Context

Admins can mark or unmark official decks.

Moderators cannot.

## Goal

Implement official deck toggle action.

## Files to Modify

```txt
apps/mobile/src/features/admin/components/moderation-deck-list-item.tsx
apps/mobile/src/features/admin/screens/moderation-queue-screen.tsx
```

## Requirements

Official action behavior:

```txt
1. Show toggle or button.
2. Call SetOfficialDeck mutation with isOfficial true/false.
3. Update list item or refetch ModerationQueue.
4. Show success/error feedback.
```

UI rule:

```txt
- Show official toggle only for currentUser.role = ADMIN.
- Hide or disable for MODERATOR.
```

Important:

```txt
This UI rule is not security. Backend must reject MODERATOR.
```

## Security Requirements

```txt
- Backend enforces ADMIN only.
- Frontend must not rely on hidden toggle for security.
```

## Acceptance Criteria

```txt
- ADMIN can toggle official state.
- MODERATOR does not see official toggle.
- SetOfficialDeck mutation is used.
- Queue updates after action.
- Typecheck passes.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm --filter @flashcards/mobile web
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
TASK-19.20 Add official deck action
```

---

# TASK-19.21 Add frontend groups/admin final checks

## Status

TODO

## Context

Groups and admin screens are permission-sensitive.

## Goal

Run final checks.

## Manual Checks

Verify groups:

```txt
- profile links to groups
- my groups loads
- create group works
- group detail loads for member
- invite user works for OWNER/ADMIN
- invitation list loads for invited user
- accept invitation works
- decline invitation works
- share deck with group works
- group shared decks display
- shared deck opens deck detail
```

Verify admin:

```txt
- USER does not see admin links
- MODERATOR sees moderation link
- ADMIN sees admin links
- admin dashboard loads for ADMIN
- admin dashboard rejects MODERATOR/USER
- admin user search works for ADMIN
- block user works for ADMIN
- unblock user works for ADMIN
- moderation queue works for ADMIN
- moderation queue works for MODERATOR
- approve/reject/hide work for ADMIN/MODERATOR
- official toggle works for ADMIN
- official toggle is unavailable for MODERATOR
```

## Security Checks

Verify:

```txt
- frontend does not request passwordHash
- frontend does not request token hashes
- frontend does not request push token values
- frontend does not include backend secrets
- frontend does not store auth tokens in localStorage/sessionStorage
- backend rejects unauthorized group/admin operations
```

Suggested checks:

```bash
grep -R "passwordHash\|refreshTokenHash\|passwordResetTokenHash\|emailVerificationTokenHash" apps/mobile || true
grep -R "localStorage" apps/mobile || true
grep -R "sessionStorage" apps/mobile || true
grep -R "AI_API_KEY\|JWT_ACCESS_SECRET\|JWT_REFRESH_SECRET\|DATABASE_URL\|INTERNAL_JOB_SECRET" apps/mobile || true
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm --filter @flashcards/mobile web
pnpm format:check
pnpm lint
```

## Do Not Do

```txt
- Do not move to deployment until groups/admin checks pass.
- Do not expose sensitive admin fields for convenience.
- Do not rely on frontend role hiding for security.
```

## Acceptance Criteria

```txt
- Groups screens work.
- Group invitations work.
- Group deck sharing works.
- Admin dashboard works.
- Admin user search works.
- Block/unblock user works.
- Moderation queue works.
- Deck moderation actions work.
- Official deck toggle works for ADMIN.
- Sensitive fields are not exposed.
- Typecheck passes.
- Format check passes.
- Lint passes.
- No frontend secrets are present.
- git status is clean after commit.
```

## Expected Commit Message

```txt
TASK-19.21 Add frontend groups/admin final checks
```

---

## Epic Completion Criteria

EPIC-19 is complete when:

```txt
- Groups GraphQL documents exist.
- Admin GraphQL documents exist.
- Generated GraphQL types exist.
- Groups feature structure exists.
- Admin feature structure exists.
- Group routes exist.
- My groups screen works.
- Create group screen works.
- Group detail screen works.
- Invite user flow works.
- Group invitations screen works.
- Accept/decline invitation actions work.
- Share deck with group flow works.
- Group shared decks UI works.
- Admin routes exist.
- Admin dashboard screen works.
- Admin user search screen works.
- Block/unblock user actions work.
- Moderation queue screen works.
- Deck moderation actions work.
- Official deck toggle works for ADMIN.
- Frontend does not expose sensitive fields.
- implementation follows docs/security/security-checklist.md.
```

After this epic is complete, move to:

```txt
docs/tasks/20-deployment-mvp.md
```
