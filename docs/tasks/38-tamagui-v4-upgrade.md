# EPIC-38 Tamagui Web Accessibility Fix

## Epic Goal

Fix React 19 DOM accessibility prop warnings in Tamagui UI primitives on web.

Tamagui v2 (latest stable) passes React Native accessibility props (`accessibilityRole`, `accessibilityLabel`, `accessibilityHint`) directly to DOM elements on web. React 19.2 (introduced via Expo 57 / EPIC-37) warns about unknown DOM attributes for these props, producing console errors on every render.

Tamagui v3 is in beta and not yet stable. The fix is to intercept RN accessibility props in UI primitives and either drop them or map them to ARIA equivalents on web.

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

# TASK-38.01 Fix Tamagui primitives: filter RN accessibility props on web

## Status

DONE

## Context

Tamagui v2.7.7 passes `accessibilityRole`, `accessibilityLabel`, `accessibilityHint` directly to DOM
elements on web. React 19.2 warns about unknown DOM attributes for these props on every render.
Tamagui v3 is still in beta — no stable upgrade path exists.

## What Was Done

In `app-button.tsx` and `app-card.tsx`: destructured `accessibilityRole`, `accessibilityLabel`,
`accessibilityHint` from props. On web, passed `aria-label` instead; on native, passed original RN props.

In `app-input.tsx`: added `Platform.OS === 'web'` branch that renders `<Input>` without
`accessibilityRole` (already had a web branch for `secureTextEntry`).

`app-text.tsx` was already correct — web branch uses `RNText`, not Tamagui.

## Files Modified

```txt
apps/mobile/src/ui/primitives/app-button.tsx
apps/mobile/src/ui/primitives/app-card.tsx
apps/mobile/src/ui/primitives/app-input.tsx
```

## Commit

```txt
TASK-38.01 Fix Tamagui primitives: filter RN accessibility props on web
```
