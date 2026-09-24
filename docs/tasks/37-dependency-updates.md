# EPIC-37 Dependency Updates

## Epic Goal

Update all outdated dependencies across the monorepo. Each major version bump is a separate task with its own build/typecheck/test verification. Patch and minor updates are batched by workspace.

This epic covers:

```txt
- patch/minor updates: root, api, mobile (batched)
- NestJS 11 → 12 (api)
- Expo 53 → 57 (mobile)
- Apollo Client 3 → 4 (mobile)
- graphql-codegen 5 → 7 (mobile, devDependencies)
- babel-preset-expo 13 → 57 (mobile, tied to Expo version)
- @react-native-async-storage 2 → 3 (mobile)
- tamagui 2.4 → 2.7 (mobile)
```

This epic does **not** include:

```txt
- Prisma major upgrade (separate epic, requires migration planning)
- React 19 minor bump (Expo manages React version — follow Expo's peer requirements)
- Node.js runtime upgrade
- Any feature work or refactoring beyond what upgrades require
```

## Epic Status

TODO

## Related Documents

Cursor must read these documents before working on this epic:

```txt
docs/architecture.md
docs/backend-clean-architecture.md
docs/tasks/README.md
docs/tasks/cursor-task-template.md
docs/tasks/done/36-security-hardening.md
```

## Epic Prerequisites

EPIC-36 is complete (in `docs/tasks/done/`).

## Epic Rules

```txt
1. One task = one focused commit. Do not combine tasks.
2. Do not start the next task until the current task is Status DONE and committed.
3. Each task's Commands to Run must pass before commit. If blocked, stop and ask.
4. Do not change application logic — only update dependencies and fix compilation/type errors introduced by the upgrade.
5. Do not push.
```

## Recommended Task Order

```txt
37.01                            patch/minor updates (root + api + mobile)
37.02                            NestJS 11 → 12
37.03                            tamagui 2.4 → 2.7
37.04                            @react-native-async-storage 2 → 3
37.05                            Apollo Client 3 → 4
37.06                            graphql-codegen 5 → 7
37.07                            Expo 53 → 57 + babel-preset-expo
```

## Epic Summary

```md
- [ ] TASK-37.01 Update patch/minor dependencies
- [ ] TASK-37.02 Upgrade NestJS to v12
- [ ] TASK-37.03 Upgrade Tamagui to v2.7
- [ ] TASK-37.04 Upgrade @react-native-async-storage to v3
- [ ] TASK-37.05 Upgrade Apollo Client to v4
- [ ] TASK-37.06 Upgrade graphql-codegen to v7
- [ ] TASK-37.07 Upgrade Expo to v57
```

---

# TASK-37.01 Update patch/minor dependencies

## Status

TODO

## Context

Many patch and minor versions are behind across all three workspaces (root, api, mobile). These carry no breaking changes and can be updated together safely.

## Goal

Update all patch/minor outdated packages in root, api, and mobile. Verify the build and typecheck still pass.

## Related Documents

```txt
docs/tasks/done/36-security-hardening.md
```

## Files to Create

```txt
None
```

## Files to Modify

```txt
package.json
pnpm-lock.yaml
apps/api/package.json
apps/mobile/package.json
```

## Requirements

```txt
1. Run pnpm update --recursive --latest in a controlled way:
   update only packages where latest is a patch or minor bump
   (i.e. same major as currently installed).
2. Do not update any package whose latest is a major version bump —
   those are handled in later tasks.
3. Verify api builds and mobile typechecks pass after update.
```

## Security Requirements

```txt
- Do not commit secrets.
```

## Architecture Constraints

```txt
- Do not change any application code.
```

## Implementation Notes

```txt
- Packages to skip (major bumps, handled in later tasks):
  @nestjs/* (37.02), tamagui/* + @tamagui/* (37.03),
  @react-native-async-storage (37.04), @apollo/client (37.05),
  @graphql-codegen/* (37.06), expo + babel-preset-expo (37.07),
  @expo/vector-icons (tied to Expo), react-native-screens,
  react-native-safe-area-context (tied to Expo).
- @types/csv-parse is deprecated — remove it; csv-parse v7 ships its own types.
- react/react-dom minor bump: only update if Expo 53 peer allows it,
  otherwise leave at current version.
```

## Acceptance Criteria

```txt
- No patch/minor outdated packages remain (excluding packages reserved for later tasks).
- pnpm --filter @flashcards/api build passes.
- pnpm --filter @flashcards/mobile typecheck passes.
- pnpm lint passes.
```

## Commands to Run

```bash
pnpm --filter @flashcards/api build
pnpm --filter @flashcards/mobile typecheck
pnpm format:check
pnpm lint
```

## Manual Checks

```txt
None
```

## Do Not Do

```txt
- Do not update packages reserved for later tasks (see Implementation Notes).
- Do not change application code.
- Do not push.
```

## Expected Commit Message

```txt
TASK-37.01 Update patch/minor dependencies
```

---

# TASK-37.02 Upgrade NestJS to v12

## Status

TODO

## Context

All `@nestjs/*` packages are on v11. NestJS v12 is the latest major. This task upgrades the entire NestJS ecosystem (common, core, graphql, apollo, jwt, config, platform-express, throttler, cli, schematics, testing) together — they must stay in sync.

## Goal

Upgrade all `@nestjs/*` packages from v11 to v12. Fix any compilation or type errors introduced by the upgrade.

## Related Documents

```txt
docs/architecture.md
docs/backend-clean-architecture.md
docs/tasks/done/36-security-hardening.md
```

## Files to Create

```txt
None
```

## Files to Modify

```txt
apps/api/package.json
pnpm-lock.yaml
apps/api/src/* (only if NestJS v12 introduces breaking changes that require fixes)
```

## Requirements

```txt
1. Upgrade all @nestjs/* packages to their v12 equivalents.
2. Read the NestJS v12 migration guide before making changes.
3. Fix any TypeScript compilation errors or breaking API changes.
4. Do not change business logic — only adapt to new NestJS APIs if required.
5. API must build successfully after upgrade.
```

## Security Requirements

```txt
- Do not expose secrets.
- Do not weaken auth or guard behavior.
```

## Architecture Constraints

```txt
- Clean Architecture layers must remain intact.
- Do not change resolver, use case, or domain code unless NestJS v12 forces it.
```

## Implementation Notes

```txt
- Check https://docs.nestjs.com/migration-guide for v12 breaking changes before starting.
- @nestjs/throttler v6 may require a matching upgrade — check peer deps.
- If a breaking change requires significant refactor, stop and document it before proceeding.
```

## Acceptance Criteria

```txt
- All @nestjs/* packages are on v12.
- pnpm --filter @flashcards/api build passes.
- pnpm lint passes.
- No functional behavior changed.
```

## Commands to Run

```bash
pnpm --filter @flashcards/api build
pnpm format:check
pnpm lint
```

## Manual Checks

```txt
- Start API locally (pnpm --filter @flashcards/api start:dev).
- Confirm GraphQL playground loads (or health endpoint responds).
- Confirm login mutation works.
```

## Do Not Do

```txt
- Do not upgrade Prisma in this task.
- Do not change application logic.
- Do not push.
```

## Expected Commit Message

```txt
TASK-37.02 Upgrade NestJS to v12
```

---

# TASK-37.03 Upgrade Tamagui to v2.7

## Status

TODO

## Context

Tamagui (tamagui, @tamagui/core, @tamagui/config, @tamagui/babel-plugin, @tamagui/metro-plugin) is on v2.4.0; latest is v2.7.7. This is a minor bump within v2 but Tamagui's internal APIs can change between minor releases.

## Goal

Upgrade all tamagui packages to v2.7.x. Fix any type or runtime errors.

## Related Documents

```txt
docs/architecture.md
```

## Files to Create

```txt
None
```

## Files to Modify

```txt
apps/mobile/package.json
pnpm-lock.yaml
apps/mobile/src/* (only if Tamagui v2.7 introduces breaking changes)
```

## Requirements

```txt
1. Upgrade tamagui, @tamagui/core, @tamagui/config, @tamagui/babel-plugin,
   @tamagui/metro-plugin to v2.7.x together (they must stay in sync).
2. Fix any TypeScript or Metro bundler errors.
3. Mobile typecheck must pass.
```

## Security Requirements

```txt
- Do not expose secrets.
```

## Architecture Constraints

```txt
- Do not change UI logic beyond adapting to new Tamagui APIs if required.
```

## Implementation Notes

```txt
- Check Tamagui changelog between 2.4 and 2.7 for breaking changes before starting.
- If a component API changed, update only the affected import/prop — do not redesign screens.
```

## Acceptance Criteria

```txt
- All tamagui packages are on v2.7.x.
- pnpm --filter @flashcards/mobile typecheck passes.
- pnpm lint passes.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm format:check
pnpm lint
```

## Manual Checks

```txt
- Run mobile web locally (pnpm --filter @flashcards/mobile web).
- Open a few screens and confirm UI renders correctly.
```

## Do Not Do

```txt
- Do not redesign or change component structure.
- Do not push.
```

## Expected Commit Message

```txt
TASK-37.03 Upgrade Tamagui to v2.7
```

---

# TASK-37.04 Upgrade @react-native-async-storage to v3

## Status

TODO

## Context

`@react-native-async-storage/async-storage` is on v2.1.2; v3.x is the latest major. The project uses AsyncStorage for non-auth local storage (auth tokens use SecureStore).

## Goal

Upgrade `@react-native-async-storage/async-storage` to v3. Fix any API changes.

## Related Documents

```txt
docs/architecture.md
docs/domain/auth-token-strategy.md
```

## Files to Create

```txt
None
```

## Files to Modify

```txt
apps/mobile/package.json
pnpm-lock.yaml
apps/mobile/src/* (only if v3 API changed)
```

## Requirements

```txt
1. Upgrade @react-native-async-storage/async-storage to v3.
2. Check the v3 migration guide for breaking changes.
3. Fix any import or API usage changes in the mobile app.
4. Mobile typecheck must pass.
```

## Security Requirements

```txt
- Confirm auth tokens are still stored in SecureStore, not AsyncStorage.
- Do not move any sensitive data to AsyncStorage.
```

## Architecture Constraints

```txt
- Auth token storage strategy must not change (SecureStore for refresh token).
```

## Implementation Notes

```txt
- Search the codebase for AsyncStorage usages before upgrading:
  grep -r "async-storage" apps/mobile/src
- v3 may require Expo SDK >= 53 — confirm compatibility.
```

## Acceptance Criteria

```txt
- @react-native-async-storage/async-storage is on v3.
- pnpm --filter @flashcards/mobile typecheck passes.
- pnpm lint passes.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm format:check
pnpm lint
```

## Manual Checks

```txt
None
```

## Do Not Do

```txt
- Do not store auth tokens in AsyncStorage.
- Do not push.
```

## Expected Commit Message

```txt
TASK-37.04 Upgrade @react-native-async-storage to v3
```

---

# TASK-37.05 Upgrade Apollo Client to v4

## Status

TODO

## Context

`@apollo/client` is on v3.14.1; v4 is a major release with breaking changes to cache, link, and hooks APIs. This is the highest-risk frontend upgrade.

## Goal

Upgrade `@apollo/client` to v4. Fix all breaking changes in the mobile app's GraphQL client setup, links, and hooks usage.

## Related Documents

```txt
docs/architecture.md
docs/domain/auth-token-strategy.md
docs/tasks/done/14-frontend-auth.md
```

## Files to Create

```txt
None
```

## Files to Modify

```txt
apps/mobile/package.json
pnpm-lock.yaml
apps/mobile/src/* (Apollo client setup, links, hooks)
```

## Requirements

```txt
1. Read the Apollo Client v4 migration guide before making any changes.
2. Upgrade @apollo/client to v4.
3. Fix all breaking changes in:
   - Apollo client initialization
   - Auth link / refresh link setup
   - InMemoryCache configuration
   - useQuery / useMutation / useLazyQuery hook usage
4. Mobile typecheck must pass.
```

## Security Requirements

```txt
- Access token must remain in memory only — not written to storage.
- Refresh token handling must not change (SecureStore on native, httpOnly cookie on web).
- Do not log tokens.
```

## Architecture Constraints

```txt
- Apollo Client is the only GraphQL client. Do not introduce fetch-based calls.
- Token refresh logic must remain intact.
```

## Implementation Notes

```txt
- Apollo v4 removes some deprecated APIs from v3 — check all usages of
  ApolloClient, InMemoryCache, ApolloLink, useQuery, useMutation.
- The auth/refresh link pattern may need updating — read v4 link docs carefully.
- If the upgrade is too large, stop and split into sub-tasks before proceeding.
```

## Acceptance Criteria

```txt
- @apollo/client is on v4.
- pnpm --filter @flashcards/mobile typecheck passes.
- pnpm lint passes.
- Login, logout, and token refresh still work.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm format:check
pnpm lint
```

## Manual Checks

```txt
- Run mobile web locally.
- Log in, navigate around, log out.
- Confirm token refresh works (wait for access token to expire or simulate).
```

## Do Not Do

```txt
- Do not store access token outside memory.
- Do not change auth flow beyond adapting to Apollo v4 APIs.
- Do not push.
```

## Expected Commit Message

```txt
TASK-37.05 Upgrade Apollo Client to v4
```

---

# TASK-37.06 Upgrade graphql-codegen to v7

## Status

TODO

## Context

`@graphql-codegen/cli` and related plugins are on v5/v4; v7 is the latest. graphql-codegen is a dev tool — it only affects code generation, not runtime behavior.

## Goal

Upgrade `@graphql-codegen/cli`, `@graphql-codegen/typescript`, `@graphql-codegen/typescript-operations`, and `@graphql-codegen/typescript-react-apollo` to their v7/latest equivalents. Re-run codegen and fix any generated type changes.

## Related Documents

```txt
docs/architecture.md
```

## Files to Create

```txt
None
```

## Files to Modify

```txt
apps/mobile/package.json
pnpm-lock.yaml
apps/mobile/src/generated/* (re-generated)
apps/mobile/codegen.ts (if config format changed)
```

## Requirements

```txt
1. Upgrade all @graphql-codegen/* packages to their latest compatible versions.
2. Run pnpm --filter @flashcards/mobile codegen to regenerate types.
3. Fix any TypeScript errors in files that import generated types.
4. Mobile typecheck must pass.
```

## Security Requirements

```txt
- Do not expose secrets in generated files.
```

## Architecture Constraints

```txt
- Generated files go in their existing location. Do not move them.
```

## Implementation Notes

```txt
- Check codegen v7 migration guide for config format changes in codegen.ts.
- The typescript-react-apollo plugin version must be compatible with the
  @apollo/client version installed (v4 from TASK-37.05).
- Run codegen after upgrading, before typechecking.
```

## Acceptance Criteria

```txt
- All @graphql-codegen/* packages are on v7.
- pnpm --filter @flashcards/mobile codegen runs without errors.
- pnpm --filter @flashcards/mobile typecheck passes.
- pnpm lint passes.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile codegen
pnpm --filter @flashcards/mobile typecheck
pnpm format:check
pnpm lint
```

## Manual Checks

```txt
None
```

## Do Not Do

```txt
- Do not manually edit generated files.
- Do not push.
```

## Expected Commit Message

```txt
TASK-37.06 Upgrade graphql-codegen to v7
```

---

# TASK-37.07 Upgrade Expo to v57

## Status

TODO

## Context

`expo` is on v53.0.x; v57 is the latest. Expo major upgrades also require upgrading all Expo SDK packages (`expo-*`), `babel-preset-expo`, `@expo/vector-icons`, `react-native-screens`, `react-native-safe-area-context`, and peer React/React Native versions. This is the largest and riskiest upgrade in the epic.

## Goal

Upgrade Expo from v53 to v57 using the official Expo upgrade tool. Fix all breaking changes. Verify the app runs on iOS and Android simulators.

## Related Documents

```txt
docs/architecture.md
docs/domain/auth-token-strategy.md
```

## Files to Create

```txt
None
```

## Files to Modify

```txt
apps/mobile/package.json
apps/mobile/app.json (if SDK version field needs updating)
pnpm-lock.yaml
apps/mobile/src/* (only if Expo v57 introduces breaking changes)
```

## Requirements

```txt
1. Read the Expo SDK 54, 55, 56, 57 changelogs and migration guides
   (each major SDK version may have breaking changes).
2. Use `npx expo install --fix` to align all expo-* peer dependencies
   to the versions Expo 57 expects.
3. Upgrade babel-preset-expo, @expo/vector-icons, react-native-screens,
   react-native-safe-area-context to Expo 57 compatible versions.
4. Fix any breaking changes in app code.
5. Mobile typecheck must pass.
6. App must start on iOS simulator and Android emulator.
```

## Security Requirements

```txt
- SecureStore usage must remain intact.
- Do not change token storage strategy.
```

## Architecture Constraints

```txt
- Expo Router file-based routing must remain intact.
- Do not change navigation structure.
```

## Implementation Notes

```txt
- Run: npx expo install --fix   (inside apps/mobile) to auto-align SDK deps.
- Then run: npx expo-doctor     to identify remaining incompatibilities.
- React Native version is managed by Expo — do not set it manually.
- If a breaking change is too large, stop and split before proceeding.
- Test on both simulators after upgrade (this is the main acceptance gate).
```

## Acceptance Criteria

```txt
- expo is on v57.
- npx expo-doctor reports no critical issues.
- pnpm --filter @flashcards/mobile typecheck passes.
- pnpm lint passes.
- App starts and core flows work on iOS simulator.
- App starts and core flows work on Android emulator.
```

## Commands to Run

```bash
npx expo install --fix
npx expo-doctor
pnpm --filter @flashcards/mobile typecheck
pnpm format:check
pnpm lint
```

## Manual Checks

```txt
- Start iOS simulator, run app, log in, navigate home, open a deck.
- Start Android emulator, run app, log in, navigate home, open a deck.
```

## Do Not Do

```txt
- Do not manually pin React Native version.
- Do not change navigation or routing structure.
- Do not push.
```

## Expected Commit Message

```txt
TASK-37.07 Upgrade Expo to v57
```
