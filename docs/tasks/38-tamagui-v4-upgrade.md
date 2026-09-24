# EPIC-38 Tamagui v4 Upgrade

## Epic Goal

Upgrade Tamagui from v2.7.7 to v4.x across the mobile app.

Tamagui v2 passes React Native accessibility props (`accessibilityRole`, `accessibilityLabel`, `accessibilityHint`) directly to DOM elements on web. React 19.2 (introduced via Expo 57 / EPIC-37) now warns about unknown DOM attributes for these props, producing console errors on every render.

Tamagui v4 has native React 19 and `react-native-web` 0.21 support and resolves these warnings.

## Scope

Tamagui is used only in UI primitives:

```txt
apps/mobile/src/ui/tamagui-provider.tsx
apps/mobile/src/ui/primitives/app-button.tsx
apps/mobile/src/ui/primitives/app-card.tsx
apps/mobile/src/ui/primitives/app-input.tsx
apps/mobile/src/ui/primitives/app-text.tsx
```

## This Epic Does Not Include

```txt
- Any feature work
- Changes to screens or business logic
- Backend changes
- Design system changes beyond what the upgrade requires
```

## Epic Status

TODO

## Related Documents

Cursor must read these documents before working on this epic:

```txt
docs/architecture.md
docs/tasks/README.md
docs/tasks/cursor-task-template.md
docs/tasks/done/37-dependency-updates.md
```

## Epic Prerequisites

EPIC-37 is complete (in `docs/tasks/done/`).

## Epic Rules

```txt
- Each task must have one commit.
- Commit format: TASK-38.XX <task title>
- Each commit must include both the code change and the updated epic doc (task description added).
- Do not push to remote.
- Do not add Claude as co-author.
```

---

# TASK-38.01 Upgrade Tamagui packages from v2 to v4

## Status

TODO

## Context

Tamagui v2.7.7 is incompatible with React 19.2 and react-native-web 0.21 (both introduced in EPIC-37). Console errors appear on every render in the web app because v2 passes RN accessibility props to raw DOM elements.

Tamagui v4 officially supports React 19 and react-native-web 0.21.

## Goal

Upgrade all Tamagui packages in `apps/mobile` to v4.x and fix any breaking changes in the 5 affected primitive files.

## Files to Modify

```txt
apps/mobile/package.json
apps/mobile/src/ui/tamagui-provider.tsx
apps/mobile/src/ui/primitives/app-button.tsx
apps/mobile/src/ui/primitives/app-card.tsx
apps/mobile/src/ui/primitives/app-input.tsx
apps/mobile/src/ui/primitives/app-text.tsx
apps/mobile/tamagui.config.ts (if config API changed)
pnpm-lock.yaml
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm format:check
pnpm lint
```

## Manual Checks

```txt
- Start pnpm mobile:web
- Open http://localhost:8081 in browser
- Confirm sign-in form renders without console errors
- Confirm accessibilityRole/accessibilityLabel/accessibilityHint warnings are gone
```

## Do Not Do

```txt
- Do not change screens or business logic
- Do not change design tokens unless the upgrade requires it
- Do not add new UI components
```

## Expected Commit Message

```txt
TASK-38.01 Upgrade Tamagui packages from v2 to v4
```
