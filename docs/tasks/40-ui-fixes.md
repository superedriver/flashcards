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

IN PROGRESS

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
