# EPIC-40 UI Fixes

## Epic Goal

Fix visual and layout issues found during end-to-end testing on Android and web.

## Scope

```txt
- Safe area / notch overlaps on screens with headerShown: false
- Other UI bugs found during testing
```

## This Epic Does Not Include

```txt
- New features
- Backend changes
```

## Epic Status

DONE

## Related Documents

Cursor must read these documents before working on this epic:

```txt
docs/architecture.md
docs/tasks/README.md
docs/tasks/cursor-task-template.md
```

## Epic Rules

```txt
- Each task must have one commit.
- Commit format: TASK-40.XX <task title>
- Each commit must include both the code change and the updated epic doc (task description added).
- Do not push to remote.
- Do not add Claude as co-author.
```

---

# TASK-40.01 Fix Screen component: respect safe area insets on screens with hidden header

## Status

DONE

## What Was Done

- `screen.tsx`: added `useSafeAreaInsets` from `react-native-safe-area-context`.
  `paddingTop` is now `Math.max(padding, insets.top)` for both scrollable and non-scrollable variants.
  Fixes title overlap with camera notch on screens where `headerShown: false` (e.g. onboarding).

## Commit

```txt
TASK-40.01 Fix Screen component: respect safe area insets on screens with hidden header
```

---

# TASK-40.02 Card form: show language flags and localized field labels

## Status

DONE

## What Was Done

- `field-label.tsx`: added optional `flag` prop — renders flag emoji next to label text
- `card-form.tsx`: replaced hardcoded `front`/`back` i18n keys with `frontFlag`/`backFlag` props
  and `frontPlaceholder`/`backPlaceholder` props; labels use new `frontLabel`/`backLabel` i18n keys
- `language-examples.ts`: new static map of language code → example word (30 languages)
- `create-card-screen.tsx` and `edit-card-screen.tsx`: load deck languages via `useDeckQuery` and
  flags via `useLanguagesQuery`; compute `frontFlag`, `backFlag`, `frontPlaceholder`, `backPlaceholder`
  and pass to `CardForm`
- i18n `uk` and `en`: added `frontLabel`, `backLabel`, `frontPlaceholderWithExample`,
  `backPlaceholderWithExample` keys
- `apollo-client.ts`: added `typePolicies` for `MyAccount` and `UserSettings` (keyFields: []) to fix
  Apollo cache merge warning for singleton types without `id`

## Commit

```txt
TASK-40.02 Card form: show language flags and localized field labels
```

---

# TASK-40.03 Card form: fix placeholder fallback for unknown languages, expand example words

## Status

DONE

## What Was Done

- `card-form.tsx`: when flag is known but no example word exists, placeholder is now empty string
  instead of falling back to "Лицьова сторона" / "Зворотна сторона"
- `language-examples.ts`: replaced "house" examples with "water" across all languages;
  expanded map to 58 languages (added African, Caucasian, Central Asian, Southeast Asian languages)

## Commit

```txt
TASK-40.03 Card form: fix placeholder fallback for unknown languages, expand example words
```

---

# TASK-40.04 Languages: put Ukrainian first in all language lists

## Status

DONE

## What Was Done

- `languages.catalog.ts`: set `popularSortOrder: 1` for Ukrainian (was `null`);
  shifted English 1→2, Spanish 2→3, French 3→4, German 4→5, Portuguese 5→6, Italian 6→7
- Re-ran `db:seed` to apply changes to the database

## Commit

```txt
TASK-40.04 Languages: put Ukrainian first in all language lists
```

---

# TASK-40.05 Fix prepare script: skip husky in production

## Status

DONE

## What Was Done

- `package.json`: changed `prepare` script to skip husky when `NODE_ENV=production`,
  fixes build failure on Render where devDependencies are not installed

## Commit

```txt
TASK-40.05 Fix prepare script: skip husky in production
```

---

# TASK-40.06 Remove ios/ from git tracking

## Status

DONE

## What Was Done

- Added `apps/mobile/ios/` to `.gitignore`
- Removed `ios/` from git tracking via `git rm --cached`
- Folder stays on disk locally, regenerated via `expo prebuild` when needed

## Commit

```txt
TASK-40.06 Remove ios/ from git tracking
```

---

# TASK-40.07 Fix API build: use pnpm exec for prisma and nest commands

## Status

DONE

## What Was Done

- `apps/api/package.json`: replaced direct `prisma` and `nest` calls with `pnpm exec prisma` / `pnpm exec nest`
  in `build`, `db:generate`, `db:validate`, `db:migrate:deploy` scripts —
  fixes "prisma: not found" on Render where devDependencies are not on PATH

## Commit

```txt
TASK-40.07 Fix API build: use pnpm exec for prisma and nest commands
```

---

# TASK-40.08 Fix API build: move prisma and @nestjs/cli to dependencies

## Status

DONE

## What Was Done

- `apps/api/package.json`: moved `prisma` and `@nestjs/cli` from `devDependencies` to `dependencies`
  so they are available on Render where devDependencies are skipped in production builds

## Commit

```txt
TASK-40.08 Fix API build: move prisma and @nestjs/cli to dependencies
```

---

# TASK-40.09 Fix password input on web: use Tamagui Input with type="password"

## Status

DONE

## What Was Done

- `app-input.tsx`: removed the `RNTextInput` fallback for `secureTextEntry` on web — it rendered without
  Tamagui styles (no border, wrong width). Replaced with Tamagui `Input` and `type="password"` HTML
  attribute so the password field looks identical to the email field on web.

## Commit

```txt
TASK-40.09 Fix password input on web: use Tamagui Input with type="password"
```

---

# TASK-40.10 Replace "Лицьова/Зворотна сторона" with "Слово/Переклад" in i18n

## Status

DONE

## What Was Done

- `uk/decks.ts`: replaced `front`/`back` placeholder keys and `frontRequired`/`frontTooLong`/`backRequired`/`backTooLong` validation messages — "Лицьова сторона" → "Слово / фраза", "Зворотна сторона" → "Переклад"
- `en/decks.ts`: same replacements in English — "Front" → "Word / phrase", "Back" → "Translation", validation messages updated accordingly
- `uk/csv-import.ts`: `front`/`back` preview keys updated — "Лицьова сторона: {{value}}" → "Слово: {{value}}", "Зворотна сторона: {{value}}" → "Переклад: {{value}}"
- `en/csv-import.ts`: same in English

## Commit

```txt
TASK-40.10 Replace front/back labels with Word/Translation in i18n
```

---

# TASK-40.12 Add locale switcher to onboarding screen

## Status

TODO

## Context

The auth screens (`(auth)/_layout.tsx`) already show `AuthLocaleSwitcher` in the header via `headerRight`. The onboarding screen (`onboarding/study-languages.tsx`) uses `headerShown: false` (set in `onboarding/_layout.tsx`), so there is no header and no way to switch the interface language before completing onboarding.

## Goal

Add `AuthLocaleSwitcher` to the onboarding screen so the user can switch the interface language (EN / UK) before selecting study languages.

## Related Documents

```txt
docs/tasks/README.md
docs/tasks/cursor-task-template.md
```

## Files to Create

```txt
None
```

## Files to Modify

```txt
apps/mobile/src/features/study-languages/screens/study-language-onboarding-screen.tsx
```

## Requirements

```txt
1. Import AuthLocaleSwitcher into study-language-onboarding-screen.tsx.
2. Render AuthLocaleSwitcher in the top-right corner of the screen, above the content.
3. Do not enable the header in the layout — keep headerShown: false.
4. The switcher must work the same way as on auth screens (tapping EN / UK changes the language immediately).
```

## Security Requirements

```txt
- Do not expose backend secrets.
- Do not store auth tokens in localStorage or sessionStorage.
```

## Architecture Constraints

```txt
- Use the existing AuthLocaleSwitcher component — do not duplicate logic.
- Frontend only — no backend changes.
```

## Implementation Notes

```txt
- Place the switcher in the top-right corner using position: absolute or a header row View.
- Keep the change minimal — only touch study-language-onboarding-screen.tsx.
```

## Acceptance Criteria

```txt
- AuthLocaleSwitcher is visible on the onboarding screen.
- Tapping EN / UK switches the interface language immediately.
- The rest of the screen layout is unchanged.
- Mobile typecheck passes.
```

## Commands to Run

```bash
pnpm mobile:typecheck
pnpm format:check
pnpm lint
```

## Manual Checks

```txt
- Open the onboarding screen in the browser (localhost:8081/onboarding/study-languages).
- Confirm the EN / UK switcher is visible in the top-right area.
- Tap UK — confirm the screen text switches to Ukrainian.
- Tap EN — confirm the screen text switches back to English.
```

## Do Not Do

```txt
- Do not enable the navigation header.
- Do not change onboarding/_layout.tsx.
- Do not modify AuthLocaleSwitcher.
- Do not add backend changes.
```

## Expected Commit Message

```txt
TASK-40.12 Add locale switcher to onboarding screen
```

---

# TASK-40.11 Improve CLAUDE.md: add dev commands, architecture overview, and task execution rule

## Status

DONE

## What Was Done

- `CLAUDE.md`: added Project Overview section with monorepo structure
- Added Development Commands for API, mobile, SRS, whole-repo checks, and database operations
- Added Architecture section with Clean Architecture layer table, frontend structure overview, and source-of-truth doc index
- Added Pre-commit Checks by Task Type section
- Added Task Execution Rule: one task at a time, do not proceed until current task is complete

## Commit

```txt
TASK-40.11 Improve CLAUDE.md: add dev commands, architecture overview, and task execution rule
```
