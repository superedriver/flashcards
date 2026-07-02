# EPIC-13 Frontend Foundation

## Epic Goal

Create the Expo React Native frontend foundation for Flashcards.

This epic covers:

```txt
- Expo app setup
- Expo Router setup
- TypeScript setup
- Tamagui setup
- Apollo Client setup
- GraphQL codegen setup
- environment config
- navigation foundation
- shared UI foundation
- basic app shell
```

This epic does not implement product screens yet.

Auth screens are handled in:

```txt
docs/tasks/14-frontend-auth.md
```

Deck/card screens are handled in:

```txt
docs/tasks/15-frontend-decks-cards.md
```

Lesson screens are handled in:

```txt
docs/tasks/16-frontend-lessons.md
```

## Epic Status

TODO

## Related Documents

Cursor must read these documents before working on this epic:

```txt
docs/architecture.md
docs/tasks/README.md
docs/tasks/cursor-task-template.md
docs/tasks/00-repository.md
docs/tasks/01-backend-foundation.md
```

## Epic Prerequisites

Backend foundation should exist.

Expected state:

```txt
- monorepo exists
- apps/api exists
- packages/shared exists if created earlier
- pnpm workspace works
- TypeScript base config exists
- root format/lint scripts exist
```

## Frontend Stack

Use:

```txt
- Expo
- React Native
- React Native Web
- Expo Router
- TypeScript
- Tamagui
- Apollo Client
- GraphQL Code Generator
- Hermes
```

## Epic Rules

```txt
1. Use Expo Router.
2. Use TypeScript.
3. Use Tamagui for UI foundation.
4. Use Apollo Client for GraphQL.
5. Do not store auth tokens in localStorage.
6. Do not implement auth flow in this epic.
7. Do not implement product screens in this epic.
8. Do not call backend directly with fetch from screens when Apollo should be used.
9. Keep frontend env public-safe.
10. Do not put secrets in EXPO_PUBLIC variables.
```

## Environment Rules

Frontend may use:

```txt
EXPO_PUBLIC_API_URL
```

Frontend must not use:

```txt
JWT_ACCESS_SECRET
JWT_REFRESH_SECRET
DATABASE_URL
AI_API_KEY
INTERNAL_JOB_SECRET
EMAIL_PROVIDER_SECRET
```

## Epic Summary

```md
- [x] TASK-13.01 Create Expo app
- [x] TASK-13.02 Configure TypeScript and app package scripts
- [x] TASK-13.03 Configure Expo Router
- [x] TASK-13.04 Configure Tamagui
- [x] TASK-13.05 Add frontend environment config
- [x] TASK-13.06 Add Apollo Client foundation
- [x] TASK-13.07 Add GraphQL codegen foundation
- [ ] TASK-13.08 Add app providers
- [ ] TASK-13.09 Add app layout shell
- [ ] TASK-13.10 Add shared UI primitives
- [ ] TASK-13.11 Add frontend foundation checks
```

---

# TASK-13.01 Create Expo app

## Status

DONE

## Context

Flashcards needs a universal frontend app.

## Goal

Create Expo app in `apps/mobile`.

## Files to Create

```txt
apps/mobile/package.json
apps/mobile/app.json
apps/mobile/babel.config.js
apps/mobile/metro.config.js
apps/mobile/tsconfig.json
apps/mobile/index.ts
```

## Requirements

Create Expo app package:

```json
{
  "name": "@flashcards/mobile",
  "version": "0.1.0",
  "private": true,
  "main": "expo-router/entry",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web",
    "typecheck": "tsc --noEmit",
    "lint": "eslint ."
  },
  "dependencies": {
    "expo": "latest",
    "expo-router": "latest",
    "react": "latest",
    "react-dom": "latest",
    "react-native": "latest",
    "react-native-web": "latest"
  },
  "devDependencies": {
    "@types/react": "latest",
    "typescript": "latest"
  }
}
```

Adjust versions to match Expo install output if needed.

Install dependencies using Expo-compatible commands when possible.

## App Config

Create `app.json` with:

```json
{
  "expo": {
    "name": "Flashcards",
    "slug": "flashcards",
    "scheme": "flashcards",
    "platforms": ["ios", "android", "web"],
    "orientation": "portrait",
    "newArchEnabled": true,
    "jsEngine": "hermes"
  }
}
```

## Architecture Constraints

```txt
- App must live in apps/mobile.
- Do not create frontend inside apps/api.
- Do not implement screens yet.
```

## Acceptance Criteria

```txt
- apps/mobile exists.
- Expo starts.
- Web target starts.
- Mobile package is included in workspace.
```

## Commands to Run

```bash
pnpm install
pnpm --filter @flashcards/mobile typecheck
pnpm --filter @flashcards/mobile web
```

## Expected Commit Message

```txt
TASK-13.01 Create Expo app
```

---

# TASK-13.02 Configure TypeScript and app package scripts

## Status

DONE

## Context

Frontend must follow monorepo TypeScript conventions.

## Goal

Configure TypeScript and scripts for mobile app.

## Files to Modify

```txt
apps/mobile/tsconfig.json
apps/mobile/package.json
package.json
pnpm-workspace.yaml
```

## Requirements

`apps/mobile/tsconfig.json` should extend root base config where possible:

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "jsx": "react-jsx",
    "strict": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["app", "src", "index.ts", "expo-env.d.ts"]
}
```

Add root scripts if missing:

```json
{
  "scripts": {
    "mobile:start": "pnpm --filter @flashcards/mobile start",
    "mobile:web": "pnpm --filter @flashcards/mobile web",
    "mobile:typecheck": "pnpm --filter @flashcards/mobile typecheck"
  }
}
```

Ensure workspace includes:

```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

## Do Not Do

```txt
- Do not disable strict TypeScript.
- Do not add product UI yet.
```

## Acceptance Criteria

```txt
- Mobile TypeScript config works.
- Root scripts can start/typecheck mobile app.
- Typecheck passes.
```

## Commands to Run

```bash
pnpm install
pnpm mobile:typecheck
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
TASK-13.02 Configure TypeScript and app package scripts
```

---

# TASK-13.03 Configure Expo Router

## Status

DONE

## Context

Flashcards uses Expo Router for navigation.

## Goal

Add basic app routes.

## Files to Create

```txt
apps/mobile/app/_layout.tsx
apps/mobile/app/index.tsx
apps/mobile/app/(auth)/_layout.tsx
apps/mobile/app/(auth)/sign-in.tsx
apps/mobile/app/(auth)/sign-up.tsx
apps/mobile/app/(tabs)/_layout.tsx
apps/mobile/app/(tabs)/index.tsx
apps/mobile/app/(tabs)/decks.tsx
apps/mobile/app/(tabs)/public.tsx
apps/mobile/app/(tabs)/profile.tsx
```

## Requirements

Create root layout with stack.

Create auth group layout.

Create tabs group layout.

Initial placeholder routes:

```txt
/                 redirect or welcome placeholder
/(auth)/sign-in   placeholder
/(auth)/sign-up   placeholder
/(tabs)           home placeholder
/(tabs)/decks     decks placeholder
/(tabs)/public    public placeholder
/(tabs)/profile   profile placeholder
```

Use simple placeholder components for now.

## Navigation Rule

Auth gating is implemented later in:

```txt
docs/tasks/14-frontend-auth.md
```

For this epic, routes can be accessible without real auth logic.

## Do Not Do

```txt
- Do not implement login form yet.
- Do not implement real deck screens yet.
- Do not implement protected route redirect logic yet.
```

## Acceptance Criteria

```txt
- Expo Router routes exist.
- App renders on web.
- Tabs shell renders.
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
TASK-13.03 Configure Expo Router
```

---

# TASK-13.04 Configure Tamagui

## Status

DONE

## Context

Flashcards uses Tamagui for cross-platform UI.

## Goal

Add Tamagui configuration.

## Files to Create

```txt
apps/mobile/tamagui.config.ts
apps/mobile/src/ui/tamagui-provider.tsx
apps/mobile/src/ui/theme.ts
```

## Files to Modify

```txt
apps/mobile/package.json
apps/mobile/babel.config.js
apps/mobile/metro.config.js
apps/mobile/tsconfig.json
```

## Requirements

Install Tamagui dependencies:

```bash
pnpm --filter @flashcards/mobile add tamagui @tamagui/config @tamagui/core @tamagui/animations-react-native
```

Configure Tamagui for Expo.

Create `tamagui.config.ts`.

Create app-level provider wrapper.

Add Babel plugin if required.

Add Metro config support if required.

## Architecture Constraints

```txt
- UI foundation belongs in apps/mobile/src/ui.
- Keep Tamagui config minimal.
- Do not build full design system yet.
```

## Acceptance Criteria

```txt
- Tamagui provider exists.
- App can render Tamagui components.
- Web target works.
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
TASK-13.04 Configure Tamagui
```

---

# TASK-13.05 Add frontend environment config

## Status

DONE

## Context

Frontend needs to know the API URL.

Only public-safe values can be exposed through Expo public env.

## Goal

Add frontend environment config helper.

## Files to Create

```txt
apps/mobile/src/config/env.ts
apps/mobile/.env.example
```

## Requirements

Create `.env.example`:

```env
EXPO_PUBLIC_API_URL="http://localhost:3000/graphql"
```

Create config helper:

```ts
export const env = {
  apiUrl: process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000/graphql',
} as const
```

## Security Requirements

Frontend env must not include:

```txt
DATABASE_URL
JWT_ACCESS_SECRET
JWT_REFRESH_SECRET
AI_API_KEY
INTERNAL_JOB_SECRET
EMAIL provider secrets
```

## Acceptance Criteria

```txt
- env helper exists.
- .env.example exists.
- Only public API URL is exposed.
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
TASK-13.05 Add frontend environment config
```

---

# TASK-13.06 Add Apollo Client foundation

## Status

DONE

## Context

Frontend uses Apollo Client for GraphQL.

Auth token attachment is implemented later in EPIC-14.

## Goal

Add Apollo Client foundation.

## Files to Create

```txt
apps/mobile/src/graphql/apollo-client.ts
apps/mobile/src/graphql/apollo-provider.tsx
```

## Files to Modify

```txt
apps/mobile/package.json
```

## Requirements

Install dependencies:

```bash
pnpm --filter @flashcards/mobile add @apollo/client graphql
```

Create Apollo Client with:

```txt
- HttpLink using env.apiUrl
- InMemoryCache
```

For this epic:

```txt
- no auth link yet
- no refresh flow yet
```

Auth link will be added in:

```txt
docs/tasks/14-frontend-auth.md
```

## Security Requirements

```txt
- Do not store tokens in localStorage.
- Do not implement token storage here.
```

## Acceptance Criteria

```txt
- Apollo Client exists.
- Apollo Provider exists.
- Client points to EXPO_PUBLIC_API_URL.
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
TASK-13.06 Add Apollo Client foundation
```

---

# TASK-13.07 Add GraphQL codegen foundation

## Status

DONE

## Context

Frontend should use generated GraphQL types and hooks where possible.

## Goal

Add GraphQL Code Generator setup.

## Files to Create

```txt
apps/mobile/codegen.ts
apps/mobile/src/graphql/generated/.gitkeep
```

## Files to Modify

```txt
apps/mobile/package.json
```

## Requirements

Install dependencies:

```bash
pnpm --filter @flashcards/mobile add -D @graphql-codegen/cli @graphql-codegen/typescript @graphql-codegen/typescript-operations @graphql-codegen/typescript-react-apollo
```

Add scripts:

```json
{
  "scripts": {
    "codegen": "graphql-codegen --config codegen.ts"
  }
}
```

Codegen config should:

```txt
- read schema from EXPO_PUBLIC_API_URL or local schema file if available
- read documents from src/**/*.graphql or src/**/*.ts(x)
- output to src/graphql/generated/index.ts
```

Recommended MVP config can point to backend running locally:

```txt
http://localhost:3000/graphql
```

## Do Not Do

```txt
- Do not commit generated files if project convention excludes them.
- Do not add auth operations here unless needed later.
```

## Acceptance Criteria

```txt
- Codegen config exists.
- codegen script exists.
- Generated output path exists.
- Typecheck passes.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm format:check
pnpm lint
```

Optional when backend is running:

```bash
pnpm --filter @flashcards/mobile codegen
```

## Expected Commit Message

```txt
TASK-13.07 Add GraphQL codegen foundation
```

---

# TASK-13.08 Add app providers

## Status

TODO

## Context

The app needs a single providers wrapper for Tamagui and Apollo.

## Goal

Create app providers.

## Files to Create

```txt
apps/mobile/src/app/app-providers.tsx
```

## Files to Modify

```txt
apps/mobile/app/_layout.tsx
```

## Requirements

`AppProviders` should wrap:

```txt
- TamaguiProvider
- ApolloProvider
```

Root layout should use `AppProviders`.

Example structure:

```tsx
export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <TamaguiAppProvider>
      <ApolloAppProvider>{children}</ApolloAppProvider>
    </TamaguiAppProvider>
  )
}
```

## Architecture Constraints

```txt
- Providers should live in src/app.
- Keep root layout small.
```

## Acceptance Criteria

```txt
- AppProviders exists.
- Root layout uses AppProviders.
- App renders.
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
TASK-13.08 Add app providers
```

---

# TASK-13.09 Add app layout shell

## Status

TODO

## Context

The app needs simple layout components before real screens are implemented.

## Goal

Add app shell components.

## Files to Create

```txt
apps/mobile/src/ui/components/screen.tsx
apps/mobile/src/ui/components/page-title.tsx
apps/mobile/src/ui/components/loading-state.tsx
apps/mobile/src/ui/components/error-state.tsx
apps/mobile/src/ui/components/empty-state.tsx
apps/mobile/src/ui/components/index.ts
```

## Requirements

Create simple reusable components:

```txt
Screen
PageTitle
LoadingState
ErrorState
EmptyState
```

Use Tamagui primitives where possible.

Components should support web and native.

## Do Not Do

```txt
- Do not create final visual design yet.
- Do not implement product-specific components yet.
```

## Acceptance Criteria

```txt
- App shell components exist.
- Placeholder routes use Screen/PageTitle.
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
TASK-13.09 Add app layout shell
```

---

# TASK-13.10 Add shared UI primitives

## Status

TODO

## Context

Common UI primitives reduce duplication across future frontend epics.

## Goal

Add minimal UI primitives.

## Files to Create

```txt
apps/mobile/src/ui/primitives/app-button.tsx
apps/mobile/src/ui/primitives/app-input.tsx
apps/mobile/src/ui/primitives/app-card.tsx
apps/mobile/src/ui/primitives/app-text.tsx
apps/mobile/src/ui/primitives/index.ts
```

## Requirements

Create:

```txt
AppButton
AppInput
AppCard
AppText
```

Each component should:

```txt
- wrap Tamagui primitive
- expose simple props
- remain reusable
- avoid product-specific behavior
```

## Architecture Constraints

```txt
- Keep primitives generic.
- Do not put GraphQL logic in UI primitives.
- Do not put auth logic in UI primitives.
```

## Acceptance Criteria

```txt
- Shared UI primitives exist.
- Placeholder screens can use them.
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
TASK-13.10 Add shared UI primitives
```

---

# TASK-13.11 Add frontend foundation checks

## Status

TODO

## Context

Frontend foundation should be stable before implementing auth and product screens.

## Goal

Run final checks for frontend foundation.

## Manual Checks

Verify:

```txt
- Expo app starts.
- Web app starts.
- Expo Router routes render.
- Tabs render.
- Tamagui provider works.
- Apollo Provider is mounted.
- EXPO_PUBLIC_API_URL is used for GraphQL URL.
- No secret env vars are exposed.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm --filter @flashcards/mobile web
pnpm format:check
pnpm lint
```

## Security Checks

Verify frontend does not contain:

```txt
DATABASE_URL
JWT_ACCESS_SECRET
JWT_REFRESH_SECRET
AI_API_KEY
INTERNAL_JOB_SECRET
```

Suggested check:

```bash
grep -R "JWT_ACCESS_SECRET\|JWT_REFRESH_SECRET\|DATABASE_URL\|AI_API_KEY\|INTERNAL_JOB_SECRET" apps/mobile || true
```

## Do Not Do

```txt
- Do not move to frontend auth until foundation checks pass.
- Do not add localStorage token storage.
- Do not expose backend secrets.
```

## Acceptance Criteria

```txt
- Mobile app starts.
- Web app starts.
- Typecheck passes.
- Format check passes.
- Lint passes.
- No frontend secrets are present.
- git status is clean after commit.
```

## Expected Commit Message

```txt
TASK-13.11 Add frontend foundation checks
```

---

## Epic Completion Criteria

EPIC-13 is complete when:

```txt
- Expo app exists.
- Expo Router works.
- Tamagui is configured.
- Apollo Client foundation exists.
- GraphQL codegen foundation exists.
- App providers exist.
- App shell exists.
- Shared UI primitives exist.
- EXPO_PUBLIC_API_URL is used.
- No secrets are exposed to frontend.
- Typecheck passes.
- Web app starts.
```

After this epic is complete, move to:

```txt
docs/tasks/14-frontend-auth.md
```
