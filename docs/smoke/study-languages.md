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

- [ ] New user without study languages sees blocking onboarding (cannot use main tabs).
- [ ] Completing target + native languages enters the app.
- [ ] Existing user without study languages gets the same onboarding; legacy decks hint appears after complete.

### Study language selector

- [ ] Top flag selector switches `activeTargetLanguage`.
- [ ] Decks sections Own / Group / Public filter by active target.
- [ ] Add study language from catalog (+); remove shows affected deck count when > 0.

### Decks

- [ ] Create deck requires language pair; front = target, back = source.
- [ ] Legacy decks appear in **No language**; assign languages moves deck to **Own**.
- [ ] Public section lists catalog for active language; dedicated Public tab is gone.

### Copy / regenerate preview

- [ ] Copy public 1:1 (keep original source) creates private deck immediately.
- [ ] Copy public with native source → preview progress → approve → private deck.
- [ ] Copy group shared deck: preview only when source language changes.
- [ ] Regenerate translations on owned deck → preview → approve updates back/example.
- [ ] Unfinished preview shows resume banner; Continue / Discard work within TTL.

### Gates & settings

- [ ] Edit deck languages shows warning; no auto regeneration.
- [ ] Publish blocked until languages assigned.
- [ ] CSV import blocked on legacy deck until assign.
- [ ] Settings **My native language** (`nativeLanguage`) changes default source for **new** decks only.
- [ ] en/uk study-language strings render (onboarding, selector, preview, assign).

## Sign-off

```txt
Tester: <name>
Date: <yyyy-mm-dd>
Platforms: web / ios / android
Environment: local / staging / production
Overall: PASS / FAIL
Notes:
```
