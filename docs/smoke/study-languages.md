# Study Languages Smoke Checks (EPIC-24)

Manual + automated verification checklist for study languages.

Related:

```txt
docs/tasks/24-study-languages.md
docs/release/mvp-smoke-tests.md (section 32)
```

## Automated verification (done in TASK-24.29)

```txt
- API unit/integration suites matching language / study-language / deck-preview /
  translate-card / copy / publish / decks-page / onboarding / csv-import: PASS
- Mobile typecheck: PASS
- Mobile eslint: PASS
- TASK-24.01–24.28 statuses: DONE
```

## Manual checks (web + at least one native)

Run against a local or staging API with language seed applied.

### Onboarding

- [x] New user without study languages sees blocking onboarding (cannot use main tabs).
- [x] Completing target + native languages enters the app.
- [x] Existing user without study languages gets the same onboarding; legacy decks hint appears after complete.

### Study language selector

- [x] Top flag selector switches `activeTargetLanguage`.
- [x] Decks sections Own / Group / Public filter by active target.
- [x] Add study language from catalog (+); remove shows affected deck count when > 0.

### Decks

- [x] Create deck requires language pair; front = target, back = source.
- [x] Legacy decks appear in **No language**; assign languages moves deck to **Own**.
- [x] Public section lists catalog for active language; dedicated Public tab is gone.

### Copy / regenerate preview

- [x] Copy public 1:1 (keep original source) creates private deck immediately.
- [x] Copy public with native source → preview progress → approve → private deck.
- [ ] Copy group shared deck: preview only when source language changes. _(N/A — no group setup this run)_
- [x] Regenerate translations on owned deck → preview → approve updates back/example.
- [x] Unfinished preview shows resume banner; Continue / Discard work within TTL.

### Gates & settings

- [x] Edit deck languages shows warning; no auto regeneration.
- [x] Publish blocked until languages assigned.
- [ ] CSV import blocked on legacy deck until assign. _(not tested this run)_
- [x] Settings **My native language** (`nativeLanguage`) changes default source for **new** decks only.
- [x] en/uk study-language strings render (onboarding, selector, preview, assign).

## Sign-off

```txt
Tester: Maks
Date: 2026-07-17
Platforms: web
Environment: local
Overall: PASS
Notes:
- Manual smoke on Expo web (localhost:8081) + local API/Postgres with seed.
- Follow-up UI fixes during smoke landed in EPIC-25 (tabs, scroll, copy labels, flags, etc.).
- Mock AI expected: translated backs prefixed with [sourceLanguage] (e.g. [en] food).
- CSV import legacy gate: not tested.
- Group shared deck copy: N/A (no group flow this run).
- Native platform (ios/android): not re-run this session.
```
