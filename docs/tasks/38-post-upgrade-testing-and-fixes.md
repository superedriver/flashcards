# EPIC-38 Post-upgrade Testing and Fixes

## Epic Goal

Test the app after EPIC-37 dependency upgrades and fix issues found during testing.

Covers web runtime fixes, accessibility prop warnings introduced by React 19.2 and react-native-web 0.21, and UI improvements discovered during manual testing.

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

---

# TASK-38.02 Fix app-input: destructure accessibilityLabel/accessibilityHint to prevent DOM leak

## Status

DONE

## Context

After TASK-38.01, `app-input.tsx` still leaked `accessibilityLabel` to the DOM via `...props` spread
on the web branch. The original destructure only removed `accessibilityRole`.

## What Was Done

Destructured `accessibilityHint` and `accessibilityLabel` from `AppInput` props. On the web branch,
mapped `accessibilityLabel` to `aria-label` on `<Input>`.

## Files Modified

```txt
apps/mobile/src/ui/primitives/app-input.tsx
```

## Commit

```txt
TASK-38.02 Fix app-input: destructure accessibilityLabel/accessibilityHint to prevent DOM leak
```

---

# TASK-38.03 Redesign study language onboarding screen

## Status

DONE

## Context

The onboarding screen used generic labels ("My native language", "target language"), a plain bordered
pressable with no visual affordance, and a long description. The user requested a cleaner UI:
human labels, card-style selectors with flag + chevron, a language pair preview, and a primary blue
Continue button that is disabled until both languages are selected.

## What Was Done

- Changed `nativeLabel` from "My native language" → "I speak" (en) / "Я розмовляю" (uk)
- Shortened description to one sentence in both locales
- Replaced plain `Pressable` selectors with `LanguageRow` component: flag, name, english name, chevron
- Added language pair preview row (`🇬🇧 → 🇪🇸 English → Spanish`) when both selected
- Continue button: primary blue `#1976d2` when enabled, grey when disabled
- Wrapped content in `maxWidth: 480` for compact layout

## Files Modified

```txt
apps/mobile/src/features/study-languages/screens/study-language-onboarding-screen.tsx
apps/mobile/src/i18n/resources/en/study-languages.ts
apps/mobile/src/i18n/resources/uk/study-languages.ts
```

## Commit

```txt
TASK-38.03 Redesign study language onboarding screen
```
