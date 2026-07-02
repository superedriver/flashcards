# EPIC-18 Frontend Profile, Settings & Notifications

## Epic Goal

Implement frontend profile, user settings, and notification preference flows for Flashcards.

This epic covers:

```txt
- profile screen
- current user display
- user settings form
- lesson size setting
- daily reminder settings
- notification permission request
- Expo push token registration
- push token removal
- notification enable/disable flow
```

Backend features are handled in:

```txt
docs/tasks/04-user-profile-settings.md
docs/tasks/11-notifications.md
```

Frontend auth is handled in:

```txt
docs/tasks/14-frontend-auth.md
```

## Epic Status

TODO

## Related Documents

Cursor must read these documents before working on this epic:

```txt
docs/architecture.md
docs/domain/auth-token-strategy.md
docs/security/security-checklist.md
docs/tasks/README.md
docs/tasks/cursor-task-template.md
docs/tasks/04-user-profile-settings.md
docs/tasks/11-notifications.md
docs/tasks/13-frontend-foundation.md
docs/tasks/14-frontend-auth.md
```

## Epic Prerequisites

EPIC-17 should be complete.

Expected state:

```txt
- Expo app works.
- Auth works.
- Profile tab exists.
- Apollo Client works.
- GraphQL codegen works.
- User settings backend exists.
- Notification backend exists.
- Shared UI primitives exist.
```

## Epic Rules

```txt
1. Use Apollo Client for GraphQL operations.
2. Use generated GraphQL types/hooks when available.
3. Do not store auth tokens in localStorage/sessionStorage.
4. Do not expose backend secrets in frontend env.
5. Do not expose push tokens in UI.
6. Do not log push tokens.
7. Ask for notification permission only after user action.
8. Register push token only for authenticated user.
9. Remove push token on logout if available.
10. Backend remains source of truth for settings.
11. Frontend settings validation is UX only.
12. Keep UI usable on native and web.
```

## Notification Policy

MVP notification flow:

```txt
1. User opens profile/settings.
2. User enables notifications.
3. Frontend asks OS notification permission.
4. If permission granted, frontend gets Expo push token.
5. Frontend calls registerPushToken.
6. Frontend updates user settings notificationsEnabled = true.
```

Disable notification flow:

```txt
1. User disables notifications.
2. Frontend calls removePushToken if current token is known.
3. Frontend updates user settings notificationsEnabled = false.
```

Important:

```txt
- Push token belongs to current user.
- Push token must not be shown in UI.
- Push token must not be logged.
- Backend sends reminders.
- Frontend does not schedule backend reminders itself.
```

## Expected Backend Operations

User profile/settings operations from EPIC-04:

```graphql
query Me {
  me {
    id
    email
    role
    emailVerifiedAt
    blockedAt
    createdAt
    updatedAt
  }
}

query MySettings {
  mySettings {
    userId
    lessonSize
    notificationsEnabled
    reminderTime
    timezone
    createdAt
    updatedAt
  }
}

mutation UpdateMySettings($input: UpdateMySettingsInput!) {
  updateMySettings(input: $input) {
    userId
    lessonSize
    notificationsEnabled
    reminderTime
    timezone
    createdAt
    updatedAt
  }
}
```

Notification operations from EPIC-11:

```graphql
mutation RegisterPushToken($input: RegisterPushTokenInput!) {
  registerPushToken(input: $input) {
    success
  }
}

mutation RemovePushToken($input: RemovePushTokenInput!) {
  removePushToken(input: $input)
}
```

## Frontend Routes

Update:

```txt
/(tabs)/profile
```

Optional routes:

```txt
/profile/settings
/profile/notifications
```

MVP can keep all profile/settings/notification controls inside the profile tab.

## Epic Summary

```md
- [ ] TASK-18.01 Add profile/settings/notification GraphQL documents
- [ ] TASK-18.02 Generate profile/settings/notification GraphQL types
- [ ] TASK-18.03 Add profile feature structure
- [ ] TASK-18.04 Add settings feature structure
- [ ] TASK-18.05 Add notifications feature structure
- [ ] TASK-18.06 Add profile screen
- [ ] TASK-18.07 Add settings form validation
- [ ] TASK-18.08 Add user settings screen section
- [ ] TASK-18.09 Add notification permission service
- [ ] TASK-18.10 Add push token service
- [ ] TASK-18.11 Add notification settings UI
- [ ] TASK-18.12 Integrate push token removal with logout
- [ ] TASK-18.13 Add profile/settings/notifications final checks
```

---

# TASK-18.01 Add profile/settings/notification GraphQL documents

## Status

TODO

## Context

Frontend profile and settings screens should use GraphQL documents and generated types.

## Goal

Add GraphQL documents.

## Files to Create

```txt
apps/mobile/src/features/profile/graphql/profile.graphql
apps/mobile/src/features/settings/graphql/settings.graphql
apps/mobile/src/features/notifications/graphql/notifications.graphql
```

## Requirements

Add profile operations:

```graphql
query ProfileMe {
  me {
    id
    email
    role
    emailVerifiedAt
    blockedAt
    createdAt
    updatedAt
  }
}
```

Add settings operations:

```graphql
query MySettings {
  mySettings {
    userId
    lessonSize
    notificationsEnabled
    reminderTime
    timezone
    createdAt
    updatedAt
  }
}

mutation UpdateMySettings($input: UpdateMySettingsInput!) {
  updateMySettings(input: $input) {
    userId
    lessonSize
    notificationsEnabled
    reminderTime
    timezone
    createdAt
    updatedAt
  }
}
```

Add notification operations:

```graphql
mutation RegisterPushToken($input: RegisterPushTokenInput!) {
  registerPushToken(input: $input) {
    success
  }
}

mutation RemovePushToken($input: RemovePushTokenInput!) {
  removePushToken(input: $input)
}
```

## Security Requirements

```txt
- Do not request passwordHash.
- Do not request token hashes.
- Do not request push token values.
- Do not request backend secrets.
```

## Acceptance Criteria

```txt
- Profile GraphQL document exists.
- Settings GraphQL document exists.
- Notifications GraphQL document exists.
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
TASK-18.01 Add profile/settings/notification GraphQL documents
```

---

# TASK-18.02 Generate profile/settings/notification GraphQL types

## Status

TODO

## Context

Frontend should use generated GraphQL types and hooks.

## Goal

Run codegen for profile, settings, and notification operations.

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
ProfileMe
MySettings
UpdateMySettings
RegisterPushToken
RemovePushToken
```

## Do Not Do

```txt
- Do not manually edit generated file.
- Do not commit generated file if repository convention excludes generated files.
```

## Acceptance Criteria

```txt
- Profile/settings/notification generated types exist or codegen successfully runs.
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
TASK-18.02 Generate profile/settings/notification GraphQL types
```

---

# TASK-18.03 Add profile feature structure

## Status

TODO

## Context

Profile frontend code should be isolated in a feature folder.

## Goal

Create profile feature folder structure.

## Files to Create

```txt
apps/mobile/src/features/profile/components/.gitkeep
apps/mobile/src/features/profile/hooks/.gitkeep
apps/mobile/src/features/profile/screens/.gitkeep
apps/mobile/src/features/profile/graphql/.gitkeep
apps/mobile/src/features/profile/types/.gitkeep
apps/mobile/src/features/profile/index.ts
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
apps/mobile/src/features/profile/components/index.ts
apps/mobile/src/features/profile/hooks/index.ts
apps/mobile/src/features/profile/types/index.ts
```

## Architecture Constraints

```txt
- Profile feature code lives in src/features/profile.
- Generic UI remains in src/ui.
- Auth token logic remains in auth feature.
```

## Acceptance Criteria

```txt
- Profile feature structure exists.
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
TASK-18.03 Add profile feature structure
```

---

# TASK-18.04 Add settings feature structure

## Status

TODO

## Context

User settings frontend code should be isolated in a feature folder.

## Goal

Create settings feature folder structure.

## Files to Create

```txt
apps/mobile/src/features/settings/components/.gitkeep
apps/mobile/src/features/settings/hooks/.gitkeep
apps/mobile/src/features/settings/screens/.gitkeep
apps/mobile/src/features/settings/graphql/.gitkeep
apps/mobile/src/features/settings/validation/.gitkeep
apps/mobile/src/features/settings/types/.gitkeep
apps/mobile/src/features/settings/index.ts
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
apps/mobile/src/features/settings/components/index.ts
apps/mobile/src/features/settings/hooks/index.ts
apps/mobile/src/features/settings/types/index.ts
```

## Architecture Constraints

```txt
- Settings feature code lives in src/features/settings.
- Backend remains source of truth for saved settings.
```

## Acceptance Criteria

```txt
- Settings feature structure exists.
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
TASK-18.04 Add settings feature structure
```

---

# TASK-18.05 Add notifications feature structure

## Status

TODO

## Context

Notification frontend code should be isolated in a feature folder.

## Goal

Create notifications feature folder structure.

## Files to Create

```txt
apps/mobile/src/features/notifications/components/.gitkeep
apps/mobile/src/features/notifications/hooks/.gitkeep
apps/mobile/src/features/notifications/graphql/.gitkeep
apps/mobile/src/features/notifications/services/.gitkeep
apps/mobile/src/features/notifications/types/.gitkeep
apps/mobile/src/features/notifications/index.ts
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
apps/mobile/src/features/notifications/components/index.ts
apps/mobile/src/features/notifications/hooks/index.ts
apps/mobile/src/features/notifications/types/index.ts
```

## Architecture Constraints

```txt
- Notification feature code lives in src/features/notifications.
- Backend sends scheduled reminders.
- Frontend registers/removes device push tokens only.
```

## Acceptance Criteria

```txt
- Notifications feature structure exists.
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
TASK-18.05 Add notifications feature structure
```

---

# TASK-18.06 Add profile screen

## Status

TODO

## Context

Users need to see their profile and access account actions.

## Goal

Implement profile tab screen.

## Files to Modify

```txt
apps/mobile/app/(tabs)/profile.tsx
```

## Files to Create

```txt
apps/mobile/src/features/profile/screens/profile-screen.tsx
apps/mobile/src/features/profile/components/profile-card.tsx
apps/mobile/src/features/profile/components/account-status-card.tsx
```

## Requirements

Profile screen should show:

```txt
- current user email
- role
- email verification status
- blocked status if present
- createdAt
- logout action
```

Use:

```txt
- auth state user if available
- ProfileMe query if needed for refresh
```

Account status card should show:

```txt
- Verified if emailVerifiedAt exists
- Email not verified if emailVerifiedAt is null
- Blocked if blockedAt exists
```

## Security Requirements

```txt
- Show only current user's safe fields.
- Do not expose tokens.
- Do not expose password hashes.
```

## Acceptance Criteria

```txt
- Profile screen renders.
- Profile shows current user email.
- Profile shows verification status.
- Logout action remains available.
- Loading/error states exist.
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
TASK-18.06 Add profile screen
```

---

# TASK-18.07 Add settings form validation

## Status

TODO

## Context

Frontend should validate settings before submitting.

Backend remains source of truth.

## Goal

Add settings validation schema.

## Files to Create

```txt
apps/mobile/src/features/settings/validation/settings-form.schema.ts
```

## Requirements

Create Zod schema:

```txt
lessonSize:
- number
- min 5
- max 100

notificationsEnabled:
- boolean

reminderTime:
- HH:mm string
- optional nullable

timezone:
- string
- min 1
- max 100
```

Export:

```ts
export const settingsFormSchema = z.object({
  lessonSize: z.coerce.number().int().min(5).max(100),
  notificationsEnabled: z.boolean(),
  reminderTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/)
    .nullable()
    .optional(),
  timezone: z.string().trim().min(1).max(100),
})

export type SettingsFormValues = z.infer<typeof settingsFormSchema>
```

## Acceptance Criteria

```txt
- Settings form schema exists.
- Lesson size limits match backend.
- Reminder time format is validated.
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
TASK-18.07 Add settings form validation
```

---

# TASK-18.08 Add user settings screen section

## Status

TODO

## Context

Users need to manage their lesson and reminder preferences.

## Goal

Add settings UI section inside profile screen.

## Files to Create

```txt
apps/mobile/src/features/settings/components/user-settings-form.tsx
apps/mobile/src/features/settings/components/lesson-size-field.tsx
apps/mobile/src/features/settings/components/reminder-time-field.tsx
apps/mobile/src/features/settings/components/timezone-field.tsx
```

## Files to Modify

```txt
apps/mobile/src/features/profile/screens/profile-screen.tsx
```

## Requirements

Settings section should:

```txt
- call MySettings query
- show loading state
- show error state
- prefill settings form
- allow editing lessonSize
- allow editing reminderTime
- allow editing timezone
- call UpdateMySettings mutation
- show saved/success feedback
```

Default timezone:

```txt
Use device timezone if backend setting is missing.
```

Use:

```ts
Intl.DateTimeFormat().resolvedOptions().timeZone
```

where available.

## Security Requirements

```txt
- User updates only own settings.
- Do not allow userId input.
- Backend enforces ownership.
```

## Acceptance Criteria

```txt
- Settings form renders in profile screen.
- MySettings query is used.
- UpdateMySettings mutation is used.
- Lesson size updates.
- Reminder time updates.
- Timezone updates.
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
TASK-18.08 Add user settings screen section
```

---

# TASK-18.09 Add notification permission service

## Status

TODO

## Context

Frontend needs to request notification permission and get Expo push token.

## Goal

Add notification permission service.

## Files to Create

```txt
apps/mobile/src/features/notifications/services/notification-permission.service.ts
```

## Files to Modify

```txt
apps/mobile/package.json
app/mobile/app.json
```

## Requirements

Install Expo notifications:

```bash
pnpm --filter @flashcards/mobile add expo-notifications
```

Create service functions:

```ts
export type NotificationPermissionResult = {
  granted: boolean
  status: string
}

export async function requestNotificationPermission(): Promise<NotificationPermissionResult>

export async function getExpoPushToken(): Promise<string | null>
```

Behavior:

```txt
- request permission only when called by user action
- return granted/status
- get Expo push token only if permission is granted
- handle web gracefully
```

App config may need notification plugin/settings depending on Expo version.

## Security Requirements

```txt
- Do not log Expo push token.
- Do not request permission on app startup without user action.
- Do not expose token in UI.
```

## Acceptance Criteria

```txt
- Notification permission service exists.
- Permission request works on supported platforms.
- Web fallback is safe.
- Push token is not logged.
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
TASK-18.09 Add notification permission service
```

---

# TASK-18.10 Add push token service

## Status

TODO

## Context

Frontend needs to register and remove push tokens through backend GraphQL.

## Goal

Add push token service/hook.

## Files to Create

```txt
apps/mobile/src/features/notifications/hooks/use-push-token-registration.ts
apps/mobile/src/features/notifications/services/current-push-token-memory.ts
```

## Requirements

`current-push-token-memory` should:

```txt
- store current push token in memory only
- getCurrentPushToken()
- setCurrentPushToken(token)
- clearCurrentPushToken()
```

`usePushTokenRegistration` should support:

```txt
- request permission
- get Expo push token
- call RegisterPushToken mutation
- remember current token in memory
- remove current token via RemovePushToken mutation
- clear memory token
```

Register payload:

```txt
token
deviceId optional
platform optional
```

Platform can use:

```ts
Platform.OS
```

## Security Requirements

```txt
- Do not store push token in localStorage/sessionStorage.
- Do not log push token.
- Do not display push token.
- Backend owns final token storage.
```

## Acceptance Criteria

```txt
- Push token memory service exists.
- Push token registration hook exists.
- RegisterPushToken mutation is used.
- RemovePushToken mutation is used.
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
TASK-18.10 Add push token service
```

---

# TASK-18.11 Add notification settings UI

## Status

TODO

## Context

Users need to enable and disable notifications from the profile/settings screen.

## Goal

Add notification settings UI.

## Files to Create

```txt
apps/mobile/src/features/notifications/components/notification-settings-card.tsx
```

## Files to Modify

```txt
apps/mobile/src/features/profile/screens/profile-screen.tsx
apps/mobile/src/features/settings/components/user-settings-form.tsx
```

## Requirements

Notification settings card should show:

```txt
- notifications enabled/disabled state
- enable notifications button/switch
- disable notifications button/switch
- permission status if available
- helpful error state if permission denied
```

Enable behavior:

```txt
1. User taps enable.
2. Request notification permission.
3. If granted, get Expo push token.
4. Call RegisterPushToken mutation.
5. Call UpdateMySettings with notificationsEnabled = true.
6. Show success state.
```

Disable behavior:

```txt
1. User taps disable.
2. Call RemovePushToken mutation if token is known.
3. Call UpdateMySettings with notificationsEnabled = false.
4. Show success state.
```

## Security Requirements

```txt
- Permission request happens only after user action.
- Push token is not shown.
- Push token is not logged.
- Backend stores token.
```

## Acceptance Criteria

```txt
- Notification settings UI exists.
- Enable flow registers push token.
- Disable flow removes known push token.
- Settings are updated after enable/disable.
- Permission denied state is handled.
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
TASK-18.11 Add notification settings UI
```

---

# TASK-18.12 Integrate push token removal with logout

## Status

TODO

## Context

When a user logs out, the app should remove the current push token if it was registered during the session.

## Goal

Update logout flow to remove current push token.

## Files to Modify

```txt
apps/mobile/src/features/auth/hooks/use-logout.ts
apps/mobile/src/features/notifications/hooks/use-push-token-registration.ts
apps/mobile/src/features/notifications/services/current-push-token-memory.ts
```

## Requirements

Logout behavior should:

```txt
1. Try to remove current push token if known.
2. Continue logout even if push token removal fails.
3. Clear current push token memory.
4. Clear auth tokens.
5. Clear auth state.
6. Reset Apollo cache.
```

Important:

```txt
Push token removal failure must not block logout.
```

## Security Requirements

```txt
- Do not log push token.
- Do not leave token in memory after logout.
- Do not block logout because of notification cleanup failure.
```

## Acceptance Criteria

```txt
- Logout attempts push token removal.
- Logout continues if removal fails.
- Push token memory clears on logout.
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
TASK-18.12 Integrate push token removal with logout
```

---

# TASK-18.13 Add profile/settings/notifications final checks

## Status

TODO

## Context

Profile/settings/notifications involve user preferences and device tokens.

## Goal

Run final checks.

## Manual Checks

Verify profile:

```txt
- profile tab renders
- current user email displays
- role displays
- email verification status displays
- logout still works
```

Verify settings:

```txt
- settings load
- lesson size updates
- lesson size validation works
- reminder time updates
- timezone updates
- settings success/error states work
```

Verify notifications:

```txt
- enabling notifications asks permission after user action
- denied permission shows helpful message
- granted permission registers push token
- disabling notifications removes known token
- notification settings update backend settings
- logout clears current push token memory
```

## Security Checks

Verify:

```txt
- push token is not displayed
- push token is not logged
- push token is not stored in localStorage/sessionStorage
- auth tokens are not stored in localStorage/sessionStorage
- frontend does not include backend secrets
```

Suggested checks:

```bash
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
- Do not move to groups/admin frontend until checks pass.
- Do not display push token for debugging.
- Do not log push token.
- Do not request notification permission on app startup.
```

## Acceptance Criteria

```txt
- Profile screen works.
- Settings form works.
- Notification enable flow works.
- Notification disable flow works.
- Logout notification cleanup works.
- Push tokens are not exposed.
- Typecheck passes.
- Format check passes.
- Lint passes.
- No frontend secrets are present.
- git status is clean after commit.
```

## Expected Commit Message

```txt
TASK-18.13 Add profile/settings/notifications final checks
```

---

## Epic Completion Criteria

EPIC-18 is complete when:

```txt
- Profile GraphQL documents exist.
- Settings GraphQL documents exist.
- Notification GraphQL documents exist.
- Generated GraphQL types exist.
- Profile feature structure exists.
- Settings feature structure exists.
- Notifications feature structure exists.
- Profile screen works.
- User settings form works.
- Notification permission service exists.
- Push token registration hook exists.
- Notification settings UI works.
- Push token removal is integrated with logout.
- Push token is not displayed or logged.
- implementation follows docs/security/security-checklist.md.
```

After this epic is complete, move to:

```txt
docs/tasks/19-frontend-groups-admin.md
```
