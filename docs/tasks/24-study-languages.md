# EPIC-24 Study Languages

## Epic Goal

Implement study/learning languages for Flashcards: language catalog, user study context, deck language pairs, onboarding, deck list sections, public catalog filtering, copy/regenerate preview flows, and legacy deck handling.

This epic covers:

```txt
- Language catalog (DB seed + API query)
- UserStudyLanguage list + activeTargetLanguage context
- nativeLanguage in UserSettings
- Deck.targetLanguage + Deck.sourceLanguage (front=target, back=source)
- Blocking onboarding for users without study languages
- Top language selector + searchable language picker modal
- Decks page sections: Own → Group → Public → No language
- Public catalog inline on Decks (remove Public tab)
- Copy public/group deck with optional sourceLanguage change + preview + approve
- Regenerate translations/examples after deck language change (preview + approve)
- Legacy decks (null languages) + assign flow
- CSV import language step for new decks
- Publish requires language pair
- Study languages i18n (en/uk UI strings)
```

Study languages are **separate** from `interfaceLocale` (UI language from EPIC-23).

## Epic Status

TODO

## Related Documents

Cursor must read these documents before working on this epic:

```txt
docs/architecture.md
docs/backend-clean-architecture.md
docs/domain/permissions.md
docs/security/security-checklist.md
docs/tasks/README.md
docs/tasks/cursor-task-template.md
docs/tasks/04-user-profile-settings.md
docs/tasks/05-decks-cards.md
docs/tasks/06-public-decks.md
docs/tasks/08-csv-import.md
docs/tasks/09-ai-examples.md
docs/tasks/10-groups-sharing.md
docs/tasks/17-frontend-public-csv-ai.md
docs/tasks/23-i18n.md
```

## Epic Prerequisites

EPIC-23 should be complete.

Expected state:

```txt
- interfaceLocale (en/uk) works on mobile + backend UserSettings
- Deck/Card CRUD works
- Public decks browse + copy works (1:1 clone today)
- Groups + view-only shared decks work
- CSV import into existing deck works
- AI example generation works (single-card, user picks from suggestions)
- CopyPublicDeckUseCase exists
```

## Agreed Decisions (Source of Truth)

### Core model

```txt
- User learns one or more target languages (UserStudyLanguage).
- Each Deck has targetLanguage + sourceLanguage.
- Card mapping is fixed: front = targetLanguage text, back = sourceLanguage text.
- interfaceLocale (en/uk) is UI language only; unrelated to study languages.
- Language codes: ISO 639-1 where possible; extensions allowed (zh-Hans, ku, or, etc.).
```

### User settings

```txt
- UserSettings.nativeLanguage — default "en"; editable in Settings after onboarding.
- nativeLanguage affects default sourceLanguage for NEW decks only (not existing decks).
- UserSettings.activeTargetLanguage — nullable until onboarding; backend source of truth.
- Mobile may cache activeTargetLanguage locally (like interfaceLocale) for fast bootstrap.
- activeTargetLanguage must exist in UserStudyLanguage when not null (auto-add on set/copy/assign).
- Removing a study language: allowed with warning if N decks use that target; decks unchanged.
- If removed language was active: fallback to first remaining study language or null.
- Top selector order: active first, rest by date added (newest first among non-active).
```

### Language catalog seed

```txt
- Store in Language table + Prisma seed migration.
- Expose via API languages query.
- Fields per language:
  - code
  - englishName
  - nativeName
  - flag (emoji)
  - popularSortOrder (Int?, null = not in popular block)
- Popular languages (MVP): EN, ES, FR, DE, PT, IT (6).
- en flag: 🇬🇧
- Picker display: two lines — nativeName (primary) + englishName (secondary).
- Search: englishName + nativeName + code.
- Full curated list (~100+ languages): seed from provided catalog list (see TASK-24.01).
```

### Onboarding

```txt
- If user has zero UserStudyLanguage rows → blocking onboarding screen.
- Required: targetLanguage + nativeLanguage.
- On submit: create UserStudyLanguage(target), set activeTargetLanguage, set nativeLanguage.
- Additional onboarding steps may be skipped or shown after language selection.
- Existing users after deploy: same blocking onboarding + hint about "No language" section.
```

### Legacy decks

```txt
- Deck.targetLanguage / sourceLanguage nullable for legacy data.
- New decks: both languages required on create.
- Legacy decks stay null until user assigns languages.
- Soft gate before language-dependent actions (lesson, AI, CSV import, publish, etc.).
- Assign flow: target + source (source defaults to nativeLanguage); source !== target soft warning allowed.
- After assign: if target not in UserStudyLanguage → auto-add.
```

### Decks page (mobile)

```txt
- Single Decks screen with sections in order:
  1. Own (owned decks)
  2. Group (group-shared decks)
  3. Public (official catalog for active targetLanguage)
  4. No language (targetLanguage = null, any origin — own/group/public badge)
- Sections 1–3 filter by activeTargetLanguage.
- Section 4 ignores active filter; hidden when empty.
- Empty sections 1–3: show section header + empty state (do not hide section).
- Remove Public bottom tab; catalog only in Decks section 3.
- Groups management stays in Profile → My Groups.
```

### Copy / regenerate preview

```txt
- Shared server-side DeckPreviewSession (~24h TTL).
- One active preview session per user (copy public, copy group, regenerate deck share slot).
- New preview while one exists → prompt: discard current preview?
- Resume on app return: "You have an unfinished copy preview" [Continue] [Discard].
- Approve → create/update deck; Cancel/Discard/TTL → delete session.

Copy public deck:
- Same sourceLanguage → 1:1 copy (current behavior).
- Changed sourceLanguage → preview: front unchanged, back regenerated, example regenerated, notes empty.
- Approve creates private owned deck; targetLanguage unchanged.

Copy group shared deck:
- Same as public: preview only if sourceLanguage changes; otherwise 1:1.

Regenerate after deck language edit (deck settings):
- Deck-level preview + approve (same UX as copy).
- Regenerates back + example only; notes untouched; review state not reset.
- Changing languages in settings: allowed with warning; no auto-regeneration.

AI failure in preview: field empty or failed status; user can edit manually or retry per card.
```

### Other flows

```txt
- sourceLanguage === targetLanguage: allowed with soft warning ("Usually source and target should differ").
- Publish private → public: targetLanguage + sourceLanguage required (assign if legacy).
- CSV import into deck with languages: skip language step (use deck languages).
- CSV for new deck: language step with defaults (target=active, source=native), editable before preview.
- CSV into legacy deck: assign languages first.
- Public deck catalog filter: targetLanguage = activeTargetLanguage.
- Public decks have targetLanguage + sourceLanguage (required for new public decks).
```

## Epic Rules

```txt
1. Keep each TASK small and reviewable (one task = one focused commit).
2. Do not refactor unrelated code.
3. Backend is source of truth for permissions and language context.
4. Do not mix interfaceLocale with study language codes.
5. Do not auto-regenerate card content when deck languages change (except explicit preview+approve actions).
6. Do not reset SRS review state on language assign or language edit.
7. Preview sessions must not appear in My Decks until approved.
8. Do not log AI prompts/responses with PII beyond existing patterns.
9. Follow docs/domain/permissions.md for deck/group/public access.
10. Translate new user-facing strings (en/uk) in dedicated i18n task.
```

## Recommended Task Order

```txt
24.01 → 24.02                    schema + seed
24.03 → 24.04 → 24.05 → 24.06   languages + study languages + settings API
24.07 → 24.08                    deck language fields + validation
24.09 → 24.10 → 24.11 → 24.12   preview session + AI translate/regenerate + preview use cases
24.13 → 24.14                    copy public + copy group
24.15 → 24.16 → 24.17 → 24.18   publish, public filter, CSV, onboarding API
24.19                            unified decks page query
24.20 → 24.21 → 24.22 → 24.23   mobile foundation, selector, onboarding, decks page
24.24 → 24.25 → 24.26           deck forms, legacy assign, preview UI
24.27 → 24.28 → 24.29           settings, i18n, smoke checks
```

## Epic Summary

```md
- [x] TASK-24.01 Add Language catalog Prisma schema + seed
- [x] TASK-24.02 Add study languages + preview session Prisma schema
- [x] TASK-24.03 Add languages module skeleton (backend)
- [x] TASK-24.04 Add Language repository + languages GraphQL query
- [x] TASK-24.05 Add UserStudyLanguage use cases + GraphQL
- [x] TASK-24.06 Extend UserSettings for nativeLanguage and activeTargetLanguage
- [x] TASK-24.07 Extend Deck with targetLanguage and sourceLanguage
- [x] TASK-24.08 Add deck language validation (soft same-language warning)
- [x] TASK-24.09 Add DeckPreviewSession persistence + TTL cleanup
- [x] TASK-24.10 Add AI translate card back use case
- [x] TASK-24.11 Add AI generate example for language pair use case
- [x] TASK-24.12 Add deck preview use cases (start/update/confirm/cancel/resume)
- [x] TASK-24.13 Extend copy public deck (1:1 vs preview path)
- [x] TASK-24.14 Add copy group shared deck use case
- [x] TASK-24.15 Require languages before publishDeck
- [x] TASK-24.16 Filter public decks by targetLanguage
- [x] TASK-24.17 Extend CSV import language step for new decks
- [x] TASK-24.18 Add onboarding completion API + bootstrap gate
- [x] TASK-24.19 Add unified decks page GraphQL query (4 sections)
- [x] TASK-24.20 Add study languages mobile GraphQL + hooks
- [x] TASK-24.21 Add top language selector + language picker modal
- [x] TASK-24.22 Add blocking onboarding screen
- [x] TASK-24.23 Refactor Decks screen (4 sections, remove Public tab)
- [x] TASK-24.24 Extend deck create/edit/settings with language pair
- [x] TASK-24.25 Add legacy assign languages + language-gated actions
- [ ] TASK-24.26 Add copy/regenerate preview UI flows
- [ ] TASK-24.27 Extend settings UI for nativeLanguage
- [ ] TASK-24.28 Add study languages i18n strings (en/uk)
- [ ] TASK-24.29 Study languages smoke checks + final epic checks
```

---

# TASK-24.01 Add Language catalog Prisma schema + seed

## Status

DONE

## Context

Study languages need a stable curated catalog (~100+ languages) with display metadata and popular ordering.

## Goal

Add `Language` model and seed migration with catalog data.

## Related Documents

```txt
docs/architecture.md
docs/backend-clean-architecture.md
```

## Files to Create

```txt
apps/api/prisma/seeds/languages.catalog.ts (provided — 107 languages)
apps/api/prisma/seeds/languages.seed.ts
```

## Files to Modify

```txt
apps/api/prisma/schema.prisma
apps/api/package.json (if seed script hook needed)
```

## Requirements

Add model:

```prisma
model Language {
  code              String  @id
  englishName       String
  nativeName        String
  flag              String
  popularSortOrder  Int?

  studyLanguages UserStudyLanguage[]
  decksAsTarget  Deck[] @relation("DeckTargetLanguage")
  decksAsSource  Deck[] @relation("DeckSourceLanguage")
}
```

Seed requirements:

```txt
1. Import LANGUAGE_CATALOG from apps/api/prisma/seeds/languages.catalog.ts (107 languages, product-provided list).
2. Set popularSortOrder for: en(1), es(2), fr(3), de(4), pt(5), it(6).
3. en flag must be 🇬🇧.
4. Use stable codes (ISO 639-1 + approved extensions).
5. Seed must be idempotent (upsert by code).
```

Example seed row:

```ts
{
  code: 'es',
  englishName: 'Spanish',
  nativeName: 'Español',
  flag: '🇪🇸',
  popularSortOrder: 2,
}
```

## Security Requirements

```txt
- Catalog is public read data; no user PII in seed.
```

## Acceptance Criteria

```txt
- Language model exists.
- Seed runs without error.
- Popular languages have popularSortOrder set.
- Prisma validate + generate pass.
```

## Commands to Run

```bash
pnpm --filter @flashcards/api exec prisma validate
pnpm --filter @flashcards/api exec prisma generate
pnpm --filter @flashcards/api build
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
TASK-24.01 Add Language catalog Prisma schema + seed
```

---

# TASK-24.02 Add study languages + preview session Prisma schema

## Status

DONE

## Context

Users study multiple target languages. Preview flows need temporary server-side sessions before committing deck copies or regenerations.

## Goal

Add `UserStudyLanguage`, deck language FK fields, `UserSettings` language fields, and `DeckPreviewSession`.

## Files to Modify

```txt
apps/api/prisma/schema.prisma
```

## Requirements

Add enum:

```prisma
enum DeckPreviewSessionType {
  COPY_PUBLIC
  COPY_GROUP
  REGENERATE_DECK
}

enum DeckPreviewSessionStatus {
  GENERATING
  READY
  EXPIRED
}
```

Add `UserStudyLanguage`:

```prisma
model UserStudyLanguage {
  id           String   @id @default(uuid())
  userId       String
  languageCode String
  createdAt    DateTime @default(now())

  user     User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  language Language @relation(fields: [languageCode], references: [code], onDelete: Restrict)

  @@unique([userId, languageCode])
  @@index([userId])
  @@index([languageCode])
}
```

Extend `UserSettings`:

```prisma
nativeLanguage         String  @default("en")
activeTargetLanguage   String?
```

Extend `Deck`:

```prisma
targetLanguage String?
sourceLanguage String?

targetLanguageRef Language? @relation("DeckTargetLanguage", fields: [targetLanguage], references: [code], onDelete: Restrict)
sourceLanguageRef Language? @relation("DeckSourceLanguage", fields: [sourceLanguage], references: [code], onDelete: Restrict)
```

Add `DeckPreviewSession`:

```prisma
model DeckPreviewSession {
  id                   String                   @id @default(uuid())
  userId               String
  type                 DeckPreviewSessionType
  status               DeckPreviewSessionStatus @default(GENERATING)
  sourceDeckId         String?
  targetLanguage       String
  chosenSourceLanguage String
  cards                Json
  expiresAt            DateTime
  createdAt            DateTime                 @default(now())
  updatedAt            DateTime                 @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([expiresAt])
  @@index([status])
}
```

Add relation fields on `User` for `UserStudyLanguage[]` and `DeckPreviewSession[]`.

## Acceptance Criteria

```txt
- All models/enums exist.
- Existing decks remain valid (nullable language fields).
- Prisma validate + generate pass.
```

## Commands to Run

```bash
pnpm --filter @flashcards/api exec prisma validate
pnpm --filter @flashcards/api exec prisma generate
pnpm --filter @flashcards/api build
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
TASK-24.02 Add study languages + preview session Prisma schema
```

---

# TASK-24.03 Add languages module skeleton (backend)

## Status

DONE

## Context

Language catalog and study-language operations belong in a dedicated backend module.

## Goal

Create `LanguagesModule` folder structure and register in `AppModule`.

## Files to Create

```txt
apps/api/src/modules/languages/languages.module.ts
apps/api/src/modules/languages/domain/.gitkeep
apps/api/src/modules/languages/application/.gitkeep
apps/api/src/modules/languages/infrastructure/.gitkeep
apps/api/src/modules/languages/presentation/.gitkeep
```

## Files to Modify

```txt
apps/api/src/app.module.ts
```

## Acceptance Criteria

```txt
- LanguagesModule exists and is imported into AppModule.
- Folder structure matches project conventions.
```

## Expected Commit Message

```txt
TASK-24.03 Add languages module skeleton (backend)
```

---

# TASK-24.04 Add Language repository + languages GraphQL query

## Status

DONE

## Context

Mobile needs searchable language catalog for picker modal and onboarding.

## Goal

Implement language repository port, Prisma adapter, and public/authenticated `languages` query.

## Files to Create

```txt
apps/api/src/modules/languages/application/ports/language-repository.port.ts
apps/api/src/modules/languages/infrastructure/persistence/prisma-language.repository.ts
apps/api/src/modules/languages/application/use-cases/list-languages.use-case.ts
apps/api/src/modules/languages/presentation/graphql/types/language.type.ts
apps/api/src/modules/languages/presentation/graphql/resolvers/languages.resolver.ts
```

## Requirements

```txt
1. languages query returns all languages ordered by:
   - popularSortOrder ASC (nulls last)
   - englishName ASC
2. Optional search argument filters englishName, nativeName, code (case-insensitive).
3. Return: code, englishName, nativeName, flag, popularSortOrder.
4. No auth required for catalog read (or auth-required if project standard prefers — match existing public queries).
```

## Acceptance Criteria

```txt
- languages query works in GraphQL.
- Popular languages appear first.
- Search filters correctly.
```

## Expected Commit Message

```txt
TASK-24.04 Add Language repository + languages GraphQL query
```

---

# TASK-24.05 Add UserStudyLanguage use cases + GraphQL

## Status

DONE

## Context

Users maintain a list of study target languages and switch active context.

## Goal

Add use cases and GraphQL for myStudyLanguages, addStudyLanguage, removeStudyLanguage, setActiveTargetLanguage.

## Requirements

```txt
1. myStudyLanguages — list for current user ordered: active first, then createdAt DESC.
2. addStudyLanguage(languageCode) — idempotent upsert.
3. removeStudyLanguage(languageCode):
   - return affectedDeckCount (decks where ownerId=user and targetLanguage=code)
   - delete UserStudyLanguage row after client confirm
   - if removed was activeTargetLanguage → set to first remaining or null
4. setActiveTargetLanguage(languageCode):
   - auto-add to UserStudyLanguage if missing
   - update UserSettings.activeTargetLanguage
5. Validate languageCode exists in Language catalog.
```

## Acceptance Criteria

```txt
- All mutations/queries work for authenticated user.
- affectedDeckCount returned on remove preview endpoint or mutation payload.
- Active language invariant enforced.
```

## Expected Commit Message

```txt
TASK-24.05 Add UserStudyLanguage use cases + GraphQL
```

---

# TASK-24.06 Extend UserSettings for nativeLanguage and activeTargetLanguage

## Status

DONE

## Context

Settings API must expose and update nativeLanguage; activeTargetLanguage may be updated via study-language mutations.

## Goal

Extend updateUserSettings / me query for nativeLanguage.

## Files to Modify

```txt
apps/api/src/modules/account/** (or settings module paths)
apps/api/prisma schema mappers as needed
```

## Requirements

```txt
1. Expose nativeLanguage and activeTargetLanguage in UserSettings GraphQL type.
2. updateUserSettings accepts nativeLanguage (must be valid catalog code).
3. nativeLanguage change does NOT bulk-update existing deck sourceLanguage values.
4. activeTargetLanguage updated via setActiveTargetLanguage mutation (not generic settings form unless explicitly wired).
```

## Acceptance Criteria

```txt
- Settings round-trip nativeLanguage.
- activeTargetLanguage readable from me/settings query.
```

## Expected Commit Message

```txt
TASK-24.06 Extend UserSettings for nativeLanguage and activeTargetLanguage
```

---

# TASK-24.07 Extend Deck with targetLanguage and sourceLanguage

## Status

DONE

## Context

Decks need language pair metadata for filtering, AI, copy, and card semantics.

## Goal

Extend create/update deck use cases and GraphQL inputs/types.

## Requirements

```txt
1. createDeck requires targetLanguage + sourceLanguage (non-null for new decks).
2. Default sourceLanguage from UserSettings.nativeLanguage when not provided.
3. updateDeck may set languages for legacy assign flow.
4. Deck GraphQL type exposes targetLanguage + sourceLanguage.
5. myDecks / deck queries include language fields.
6. Validate codes exist in Language catalog.
```

## Acceptance Criteria

```txt
- New decks cannot be created without language pair.
- Legacy decks still load with null languages.
```

## Expected Commit Message

```txt
TASK-24.07 Extend Deck with targetLanguage and sourceLanguage
```

---

# TASK-24.08 Add deck language validation (soft same-language warning)

## Status

DONE

## Context

sourceLanguage === targetLanguage is allowed but atypical (definitions/synonyms decks).

## Goal

Add domain validation service returning warnings (not hard errors).

## Requirements

```txt
1. Warning code: SOURCE_TARGET_SAME.
2. Used in createDeck, updateDeck languages, assign legacy, preview start, CSV language step, publish assign.
3. API returns success with warnings[] OR GraphQL payload includes warnings for client confirm dialog.
4. Client must allow continue after explicit confirmation.
```

## Acceptance Criteria

```txt
- Same-language pair returns warning, not hard error.
- Different languages produce no warning.
```

## Expected Commit Message

```txt
TASK-24.08 Add deck language validation (soft same-language warning)
```

---

# TASK-24.09 Add DeckPreviewSession persistence + TTL cleanup

## Status

DONE

## Context

Preview sessions persist ~24h for resume; must not accumulate forever.

## Goal

Repository port, Prisma adapter, and expired session cleanup (cron or scheduled job pattern matching project).

## Requirements

```txt
1. One active non-expired session per user (enforce in start use case).
2. expiresAt = now + 24h on create; refresh updatedAt on card edits.
3. Cleanup job deletes EXPIRED or past expiresAt sessions.
4. cards JSON shape: [{ sourceCardId?, front, back, example, backError?, exampleError? }]
5. Status transitions: GENERATING → READY (or stay GENERATING with partial cards until done).
```

## Acceptance Criteria

```txt
- Session CRUD works.
- TTL cleanup removes old sessions.
- Second start while active returns conflict or requires discard flag.
```

## Expected Commit Message

```txt
TASK-24.09 Add DeckPreviewSession persistence + TTL cleanup
```

---

# TASK-24.10 Add AI translate card back use case

## Status

DONE

## Context

Copy/regenerate preview needs bulk translation of front → back for a target/source language pair.

## Goal

Add AI use case to translate a single card back given front + language pair.

## Requirements

```txt
1. Input: front, targetLanguage, sourceLanguage (and optional monolingual hint when equal).
2. Output: translated back string or structured error.
3. Reuse AiProviderPort + AiRequestLog patterns from EPIC-09.
4. Feature flag/name distinct from generate-card-examples.
5. Do not log full card content at info level.
```

## Acceptance Criteria

```txt
- Use case translates a card back for es→uk pair in mock provider tests.
- Failures return safe error for preview UI.
```

## Expected Commit Message

```txt
TASK-24.10 Add AI translate card back use case
```

---

# TASK-24.11 Add AI generate example for language pair use case

## Status

DONE

## Context

Preview must regenerate example after back exists, using deck language pair context.

## Goal

Add AI use case that generates one example sentence (not 3 suggestions) for preview flows.

## Requirements

```txt
1. Input: front, back, targetLanguage, sourceLanguage.
2. Output: single example string (target language sentence using front).
3. Run after back is available in preview pipeline.
4. Reuse AiProviderPort + logging patterns.
```

## Acceptance Criteria

```txt
- Example generated after back in preview pipeline unit test.
- Failure handled gracefully (empty example + error field).
```

## Expected Commit Message

```txt
TASK-24.11 Add AI generate example for language pair use case
```

---

# TASK-24.12 Add deck preview use cases (start/update/confirm/cancel/resume)

## Status

DONE

## Context

Copy public, copy group, and regenerate deck share preview infrastructure.

## Goal

Implement startPreview, updatePreviewCard, confirmPreview, cancelPreview, getActivePreview use cases.

## Requirements

```txt
1. startPreview:
   - types: COPY_PUBLIC, COPY_GROUP, REGENERATE_DECK
   - validates permissions on source deck
   - if chosenSourceLanguage === deck.sourceLanguage for copy → reject (client should use 1:1 copy path)
   - generates back then example per card (async progress supported)
2. updatePreviewCard — manual edits to back/example in session.
3. confirmPreview:
   - COPY_* → create private deck + cards; set languages; auto-add UserStudyLanguage for target
   - REGENERATE_DECK → update existing deck cards back/example in transaction; delete session
4. cancelPreview — delete session.
5. getActivePreview — for resume banner.
6. Enforce one session per user.
```

## Acceptance Criteria

```txt
- Full preview lifecycle covered by unit tests.
- Confirm creates deck only on approve (copy flows).
- Regenerate confirm updates cards without touching review state.
```

## Expected Commit Message

```txt
TASK-24.12 Add deck preview use cases (start/update/confirm/cancel/resume)
```

---

# TASK-24.13 Extend copy public deck (1:1 vs preview path)

## Status

DONE

## Context

CopyPublicDeckUseCase currently clones all cards 1:1. Must support optional sourceLanguage + preview delegation.

## Goal

Extend copy flow entry points and GraphQL API.

## Requirements

```txt
1. copyPublicDeck(sourceDeckId) — unchanged 1:1 when sourceLanguage not changed.
2. startPublicDeckCopyPreview(sourceDeckId, chosenSourceLanguage) — starts preview session.
3. Optional UX default chosenSourceLanguage = UserSettings.nativeLanguage.
4. targetLanguage copied from public deck unchanged.
5. GraphQL mutations wired; mobile uses preview flow when language differs.
```

## Acceptance Criteria

```txt
- Same-language copy still 1:1 immediate.
- Changed sourceLanguage uses preview session, not immediate deck in library.
```

## Expected Commit Message

```txt
TASK-24.13 Extend copy public deck (1:1 vs preview path)
```

---

# TASK-24.14 Add copy group shared deck use case

## Status

DONE

## Context

Group members can copy shared decks to private library (EPIC-10). Must align with public copy language behavior.

## Goal

Add copyGroupDeck mutation with same 1:1 vs preview rules.

## Requirements

```txt
1. Permission: user must be group member with view access to shared deck.
2. chosenSourceLanguage optional; preview only when different from deck.sourceLanguage.
3. Creates private owned copy with sourceDeckId reference.
4. Reuse preview session type COPY_GROUP.
```

## Acceptance Criteria

```txt
- Group member can 1:1 copy shared deck.
- Changed sourceLanguage uses preview flow.
```

## Expected Commit Message

```txt
TASK-24.14 Add copy group shared deck use case
```

---

# TASK-24.15 Require languages before publishDeck

## Status

DONE

## Context

Public catalog requires language metadata for filtering and copy UX.

## Goal

Block publish when deck languages missing; return clear error / trigger assign flow on client.

## Requirements

```txt
1. publishDeck requires targetLanguage and sourceLanguage non-null.
2. Legacy private decks must assign languages before publish.
3. Existing public legacy decks out of scope for auto-migration (none deployed yet).
```

## Acceptance Criteria

```txt
- publishDeck fails validation without languages.
- Publish succeeds when languages set.
```

## Expected Commit Message

```txt
TASK-24.15 Require languages before publishDeck
```

---

# TASK-24.16 Filter public decks by targetLanguage

## Status

DONE

## Context

Decks page section 3 and catalog browse must show official decks for active target language.

## Goal

Extend publicDecks search/query with targetLanguage filter.

## Requirements

```txt
1. publicDecks(input) accepts targetLanguage (required for mobile section; default from active context on client).
2. Return only APPROVED public decks matching targetLanguage.
3. Include targetLanguage + sourceLanguage in public deck GraphQL type.
```

## Acceptance Criteria

```txt
- Public catalog filtered by targetLanguage works.
- New public decks expose language fields.
```

## Expected Commit Message

```txt
TASK-24.16 Filter public decks by targetLanguage
```

---

# TASK-24.17 Extend CSV import language step for new decks

## Status

DONE

## Context

CSV import into existing deck uses deck languages. New deck + CSV needs language pair step.

## Goal

Support language pair on CSV import when creating new deck (if flow exists) or document deck-scoped rule + legacy gate.

## Requirements

```txt
1. Import into deck WITH languages → no language step (unchanged).
2. Import into legacy deck → block with LANGUAGES_REQUIRED (client shows assign flow).
3. If new-deck CSV flow added: language step defaults target=activeTargetLanguage, source=nativeLanguage, editable before preview.
4. Map CSV front/back to target/source semantics after languages set.
```

## Acceptance Criteria

```txt
- Legacy deck CSV import blocked until languages assigned.
- Existing language-assigned deck import unchanged.
```

## Expected Commit Message

```txt
TASK-24.17 Extend CSV import language step for new decks
```

---

# TASK-24.18 Add onboarding completion API + bootstrap gate

## Status

DONE

## Context

Users without study languages must complete blocking onboarding.

## Goal

Add completeStudyLanguageOnboarding mutation and me/bootstrap flag needsStudyLanguageOnboarding.

## Requirements

```txt
1. Input: targetLanguage, nativeLanguage.
2. Creates UserStudyLanguage, sets activeTargetLanguage + nativeLanguage.
3. Idempotent if already has study languages (no-op or error — pick one, document).
4. me query exposes: studyLanguages[], needsStudyLanguageOnboarding boolean.
5. Existing users with zero study languages get needsStudyLanguageOnboarding=true after deploy.
```

## Acceptance Criteria

```txt
- Onboarding mutation sets all fields atomically.
- Bootstrap flag drives mobile gate.
```

## Expected Commit Message

```txt
TASK-24.18 Add onboarding completion API + bootstrap gate
```

---

# TASK-24.19 Add unified decks page GraphQL query (4 sections)

## Status

DONE

## Context

Mobile Decks screen needs one query returning four sections filtered by activeTargetLanguage.

## Goal

Add decksPage query (or extend existing queries) returning own, groupShared, publicCatalog, noLanguage sections.

## Requirements

```txt
1. Input: activeTargetLanguage (from client context).
2. ownDecks: ownerId=me, targetLanguage=active.
3. groupDecks: shared decks user can view, targetLanguage=active.
4. publicDecks: official catalog, targetLanguage=active.
5. noLanguageDecks: targetLanguage IS NULL (any accessible origin), with origin badge field.
6. Each deck item includes targetLanguage, sourceLanguage, origin (OWN/GROUP/PUBLIC).
```

## Acceptance Criteria

```txt
- Single query powers Decks screen sections.
- noLanguage section returns cross-origin null decks.
```

## Expected Commit Message

```txt
TASK-24.19 Add unified decks page GraphQL query (4 sections)
```

---

# TASK-24.20 Add study languages mobile GraphQL + hooks

## Status

DONE

## Context

Mobile needs typed operations and hooks for languages, study languages, onboarding, preview.

## Goal

Add GraphQL documents, run codegen, add hooks for study language context.

## Files to Create

```txt
apps/mobile/src/features/study-languages/graphql/study-languages.graphql
apps/mobile/src/features/study-languages/hooks/use-study-language-context.ts
```

## Acceptance Criteria

```txt
- Codegen succeeds.
- Hooks expose active language, study list, loading/error states.
```

## Expected Commit Message

```txt
TASK-24.20 Add study languages mobile GraphQL + hooks
```

---

# TASK-24.21 Add top language selector + language picker modal

## Status

DONE

## Context

User switches active target language and adds new study languages from header selector.

## Goal

Implement top-center flag selector, + button, searchable modal with popular block + full list.

## Requirements

```txt
1. Shows current active language flag.
2. Tap opens list: active first, then by date added.
3. + opens catalog modal: popular (6) block, then alphabetical by englishName.
4. Row display: nativeName + englishName (two lines) + flag.
5. Search filters englishName, nativeName, code.
6. Remove study language shows warning with affectedDeckCount.
7. Cache activeTargetLanguage locally; sync with backend (like interfaceLocale).
```

## Acceptance Criteria

```txt
- User can switch active language and add/remove study languages.
- Picker matches agreed UX.
```

## Expected Commit Message

```txt
TASK-24.21 Add top language selector + language picker modal
```

---

# TASK-24.22 Add blocking onboarding screen

## Status

DONE

## Context

First launch (or existing user without study languages) requires target + native selection.

## Goal

Blocking screen before main tabs when needsStudyLanguageOnboarding=true.

## Requirements

```txt
1. Required fields: targetLanguage, nativeLanguage (picker modals).
2. Submit calls completeStudyLanguageOnboarding.
3. Optional additional onboarding steps after submit (skip allowed) — stub or wire if already planned.
4. After success → enter app + one-time hint about "No language" section for legacy decks.
```

## Acceptance Criteria

```txt
- User cannot reach tabs without completing language onboarding.
- Existing user path shows same screen when no study languages.
```

## Expected Commit Message

```txt
TASK-24.22 Add blocking onboarding screen
```

---

# TASK-24.23 Refactor Decks screen (4 sections, remove Public tab)

## Status

DONE

## Context

Decks page consolidates own, group, public catalog, and legacy decks. Public tab removed.

## Goal

Refactor my-decks screen into sectioned list; remove Public tab from tabs layout.

## Files to Modify

```txt
apps/mobile/src/features/decks/screens/my-decks-screen.tsx
apps/mobile/src/features/decks/components/*
apps/mobile/app/(tabs)/_layout.tsx
apps/mobile/app/(tabs)/public.tsx (remove or redirect)
```

## Requirements

```txt
1. Sections order: Own → Group → Public → No language.
2. Sections 1–3 filtered by activeTargetLanguage.
3. Empty sections 1–3 show header + empty state (not hidden).
4. Section 4 hidden when empty.
5. Remove Public tab from bottom navigation.
6. Public deck tap → detail → copy flow (existing routes adapted).
```

## Acceptance Criteria

```txt
- Decks screen shows four sections correctly.
- Public tab no longer visible.
- Switching active language refreshes sections 1–3.
```

## Expected Commit Message

```txt
TASK-24.23 Refactor Decks screen (4 sections, remove Public tab)
```

---

# TASK-24.24 Extend deck create/edit/settings with language pair

## Status

DONE

## Context

New decks require languages; users may edit languages later with warning.

## Goal

Add language fields to create/edit deck forms and deck settings.

## Requirements

```txt
1. createDeck: targetLanguage (default active), sourceLanguage (default native).
2. edit/settings: change both languages with confirmation warning (content not auto-regenerated).
3. Show same-language soft warning (SOURCE_TARGET_SAME) with continue option.
4. Link to regenerate preview action (TASK-24.26).
```

## Acceptance Criteria

```txt
- Create deck requires language pair.
- Edit languages shows warning and saves without regen.
```

## Expected Commit Message

```txt
TASK-24.24 Extend deck create/edit/settings with language pair
```

---

# TASK-24.25 Add legacy assign languages + language-gated actions

## Status

DONE

## Context

Legacy decks (null languages) need assign flow before language-dependent features.

## Goal

Implement assign languages modal/screen and gate lesson, AI, CSV import, publish.

## Requirements

```txt
1. Assign sets targetLanguage + sourceLanguage on deck (source defaults native).
2. Auto-add target to UserStudyLanguage if missing.
3. Gate actions with modal: "Assign languages to continue".
4. After onboarding, show hint pointing to No language section.
5. No language section lists null-target decks with origin badge.
```

## Acceptance Criteria

```txt
- Legacy deck lesson start prompts assign flow.
- After assign, deck appears in filtered Own section.
```

## Expected Commit Message

```txt
TASK-24.25 Add legacy assign languages + language-gated actions
```

---

# TASK-24.26 Add copy/regenerate preview UI flows

## Status

TODO

## Context

Copy public/group with changed sourceLanguage and regenerate deck need preview + approve UX.

## Goal

Preview screens with progress, per-card edit, regenerate per card, approve/cancel, resume banner.

## Requirements

```txt
1. Copy flow: choose keep original source vs my nativeLanguage before preview.
2. Progress: "12/50 cards ready" during GENERATING.
3. Summary before approve: counts of missing back/example.
4. Approve → deck in library; Cancel → nothing created.
5. Resume banner: "You have an unfinished copy preview" [Continue] [Discard].
6. Regenerate deck: same UI pattern; approve updates existing deck.
7. One active preview — discard prompt on new start.
```

## Acceptance Criteria

```txt
- Full copy preview lifecycle works on mobile.
- Regenerate preview updates deck on approve.
- Unfinished preview resumes within 24h.
```

## Expected Commit Message

```txt
TASK-24.26 Add copy/regenerate preview UI flows
```

---

# TASK-24.27 Extend settings UI for nativeLanguage

## Status

TODO

## Context

Users may update nativeLanguage after onboarding; affects default source for new decks only.

## Goal

Add nativeLanguage picker to settings form.

## Requirements

```txt
1. Picker uses same language catalog modal pattern.
2. Save via updateUserSettings.
3. Help text: affects default source language for new decks only.
```

## Acceptance Criteria

```txt
- nativeLanguage editable in settings.
- activeTargetLanguage not duplicated in settings form (controlled via top selector).
```

## Expected Commit Message

```txt
TASK-24.27 Extend settings UI for nativeLanguage
```

---

# TASK-24.28 Add study languages i18n strings (en/uk)

## Status

TODO

## Context

All new study-language UI must follow EPIC-23 i18n conventions.

## Goal

Add en/uk strings for onboarding, selector, picker, sections, warnings, preview, assign flow.

## Files to Create

```txt
apps/mobile/src/i18n/resources/en/study-languages.ts
apps/mobile/src/i18n/resources/uk/study-languages.ts
```

## Acceptance Criteria

```txt
- No hardcoded primary strings in study-languages feature.
- en/uk parity for new UI.
```

## Expected Commit Message

```txt
TASK-24.28 Add study languages i18n strings (en/uk)
```

---

# TASK-24.29 Study languages smoke checks + final epic checks

## Status

TODO

## Context

Epic needs manual smoke checklist covering core flows.

## Goal

Document smoke checks and verify epic acceptance.

## Files to Create

```txt
docs/smoke/study-languages.md (optional)
```

## Manual Checks

```txt
- New user: blocking onboarding → target + native → enters app.
- Existing user without study languages: same onboarding + legacy hint.
- Top selector switches active language; decks sections 1–3 filter.
- Add/remove study language; remove shows affected deck count warning.
- Create deck with language pair; front/back semantics respected.
- Legacy deck in section 4; assign languages moves to section 1.
- Public section shows catalog for active language; Public tab removed.
- Copy public 1:1 (same source) immediate.
- Copy public with changed source → preview → approve → private deck.
- Copy group shared deck: preview only when source changes.
- Edit deck languages → warning → no auto regen.
- Regenerate preview → approve updates back/example only.
- Publish blocked without languages.
- CSV import blocked on legacy deck until assign.
- nativeLanguage change in settings affects new deck default source only.
- Unfinished preview resume + discard works.
- en/uk UI strings render correctly.
```

## Acceptance Criteria

```txt
- All TASK-24.01–24.28 acceptance criteria satisfied.
- Smoke checks pass on web and at least one native platform.
```

## Expected Commit Message

```txt
TASK-24.29 Study languages smoke checks + final epic checks
```
