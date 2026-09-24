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

---

# TASK-38.04 Redesign verify email prompt screen

## Status

DONE

## Context

The verify email prompt had two identical grey buttons with no visual hierarchy. Redesign to a
confirmation state with icon, accented email line, outlined primary Resend button with cooldown,
and a text-only Continue link.

## What Was Done

- Centered layout with `maxWidth: 400`, icon ✉️ at top
- `promptBody` split into label + accented email line (bold)
- `Resend email` → outlined primary button (`#1976d2` border), disabled + grey during cooldown
- Cooldown: 45s timer after successful resend, shows "Resend in Xs"
- Feedback "Verification email sent." shown after successful resend
- `Continue to app` → plain text pressable (`#888888`)
- Added `resendCooldown` i18n key in en and uk

## Files Modified

```txt
apps/mobile/src/features/auth/components/verify-email-prompt.tsx
apps/mobile/src/i18n/resources/en/auth.ts
apps/mobile/src/i18n/resources/uk/auth.ts
```

## Commit

```txt
TASK-38.04 Redesign verify email prompt screen
```

---

# TASK-38.05 Remove duplicate Create Deck CTA from decks page empty state

## Status

DONE

## Context

The decks page had two identical "Create Deck" actions: one in the page header (+ Create Deck button)
and one in the empty state of the "My Decks" section ("Create your first deck"). Two equal CTAs
with no hierarchy.

## What Was Done

Removed `emptyActionLabel` and `onEmptyAction` from the "My Decks" `DeckSection` in
`DecksPageSections`. The header button remains as the single primary CTA. Empty state now shows
text only.

## Files Modified

```txt
apps/mobile/src/features/decks/components/decks-page-sections.tsx
```

## Commit

```txt
TASK-38.05 Remove duplicate Create Deck CTA from decks page empty state
```

---

# TASK-38.06 Redesign home screen empty state when no cards exist

## Status

DONE

## Context

When a user has no cards, the Home screen showed the stats block (due count = 0, all counters = 0)
plus a grey "Add cards for learning." EmptyState with a secondary button. The zero stats block
added noise with no value, and the CTA had no visual weight.

## What Was Done

- When `!hasCards`: hide `HomeLearningCounters` entirely, show full empty state with title +
  subtitle + primary blue "Go to decks" button
- When `hasCards && !hasDue`: keep counters, show secondary EmptyState as before
- Added `title` key to `addCards` in en and uk translations

## Files Modified

```txt
apps/mobile/src/features/home/screens/home-screen.tsx
apps/mobile/src/i18n/resources/en/home.ts
apps/mobile/src/i18n/resources/uk/home.ts
```

## Commit

```txt
TASK-38.06 Redesign home screen empty state when no cards exist
```

---

# TASK-38.07 Fix nested button HTML violations on web

## Status

DONE

## Context

On web, `Pressable` with `accessibilityRole="button"` renders as a `<button>` element.
Nesting interactive elements inside a `<button>` is invalid HTML and causes browser warnings.
Four locations were found during web testing.

## What Was Done

**study-languages-list-modal.tsx** — `LanguageListRow` with `onPress` rendered as `<button>`,
and its `rightAccessory` contained another `<Pressable accessibilityRole="button">` (Remove button).
Fix: stopped using `LanguageListRow` for these rows; replaced with a flat `View` containing two
sibling `Pressable` elements — one for selecting the language, one for removing it.

**deck-list-item.tsx** — outer `<Pressable accessibilityRole="button">` (card navigation) wrapped
`DeckStartPlayButton` (another `Pressable`). Fix: moved card content into a `<View>` wrapper;
`Pressable` now covers only the non-interactive content. `DeckStartPlayButton` moved outside
the `Pressable` as an absolutely positioned sibling (`position: 'absolute'`, `pointerEvents: 'box-none'`).
`OwnFooter` now shows only the due-count badge.

**deck-more-menu.tsx** — backdrop `<Pressable accessibilityRole="button">` wrapping a panel
`<Pressable>` wrapping menu item `<Pressable accessibilityRole="button">` elements (triple nesting).
Fix: removed `accessibilityRole="button"` from backdrop and panel Pressables — they render as
`<div>` on web; menu items remain as `<button>`.

**group-owner-menu.tsx** — same triple nesting pattern as `deck-more-menu.tsx`.
Fix: removed `accessibilityRole="button"` from backdrop Pressable.

## Files Modified

```txt
apps/mobile/src/features/study-languages/components/study-languages-list-modal.tsx
apps/mobile/src/features/decks/components/deck-list-item.tsx
apps/mobile/src/features/decks/components/deck-more-menu.tsx
apps/mobile/src/features/groups/components/group-owner-menu.tsx
```

## Commit

```txt
TASK-38.07 Fix nested button HTML violations on web
```
