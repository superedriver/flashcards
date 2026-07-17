# EPIC-25 Bugfixes (post–EPIC-24 smoke)

## Epic Goal

Fix bugs found during manual verification of EPIC-24 and related local smoke.

This epic covers:

```txt
- critical auth/API regressions that block local smoke
- web UI regressions in shared primitives (e.g. password fields)
- follow-up bugs discovered while re-running study-languages smoke
```

This epic does **not** add new product features.

New bugs found during smoke should be appended here as new TASK-25.XX items (one bug ≈ one task ≈ one commit).

## Epic Status

DONE

## Related Documents

Cursor must read these documents before working on this epic:

```txt
docs/architecture.md
docs/backend-clean-architecture.md
docs/domain/auth-token-strategy.md
docs/security/security-checklist.md
docs/tasks/README.md
docs/tasks/cursor-task-template.md
docs/tasks/02-auth.md
docs/tasks/14-frontend-auth.md
docs/tasks/22-auth-security-hardening.md
docs/tasks/24-study-languages.md
docs/smoke/study-languages.md
docs/release/mvp-smoke-tests.md
```

## Epic Prerequisites

EPIC-24 should be complete (feature work DONE).

Expected state:

```txt
- Study languages feature code is on main
- Local stack: Postgres + API (:3000) + mobile web (:8081)
- Manual smoke of EPIC-24 in progress or blocked by known bugs below
```

## Known Bugs (backlog source)

```txt
1. register/login crash: Cannot read properties of undefined (reading 'setHeader')
   - Auth resolver sets refresh cookie via context.res, but GraphQL context has no res
2. Web Sign Up/Sign In password fields: collapsed height / missing border
   - AppInput web secureTextEntry path uses unstyled RN TextInput (after TASK-22.01)
```

## Epic Rules

```txt
1. One task = one focused bugfix = one commit.
2. Do not add features or drive-by refactors.
3. Prefer smallest fix that restores acceptance / smoke.
4. Keep auth-token-strategy and security-checklist rules.
5. Do not weaken validation or permissions.
6. Do not commit secrets.
7. After each fix, re-check the manual step that failed.
8. When a new smoke bug appears, add TASK-25.XX before fixing it.
9. Run Commands to Run in each task before committing.
10. Mark epic DONE only when known checklist bugs are fixed and smoke can proceed.
```

## Recommended Task Order

```txt
25.01   GraphQL context res (blocks register/login)
25.02   Web password field layout
25.03   Match web password field colors to Tamagui Input
25.04   Localize bottom tab titles (en/uk)
25.05   Keep bottom tabs visible on deck detail stack
25.06   Deck list vertical bordered cards
25.07   Add bottom tab icons (keep full-width bar)
25.08   Fix vertical scroll on My Decks, forms, and list screens
25.09   Rename “My language” to “My native language”
25.10   Modal close control: X icon instead of Cancel
25.11   Keep bottom tabs on public deck + preview screens
25.12   Show target/source flags on deck cards
25.13   Guest UI locale always English
(+ append new bugs in discovery order)
```

## Epic Summary

```md
- [x] TASK-25.01 Fix GraphQL context to expose Express res for auth cookies
- [x] TASK-25.02 Fix web password field layout in AppInput
- [x] TASK-25.03 Match web password field colors to Tamagui Input
- [x] TASK-25.04 Localize bottom tab navigation titles
- [x] TASK-25.05 Keep bottom tabs visible on deck screens
- [x] TASK-25.06 Show decks as vertical bordered cards
- [x] TASK-25.07 Add bottom tab icons (keep full-width bar)
- [x] TASK-25.08 Fix vertical scroll on My Decks, forms, and list screens
- [x] TASK-25.09 Rename “My language” to “My native language”
- [x] TASK-25.10 Use X icon to close study-language modals
- [x] TASK-25.11 Keep bottom tabs on public deck and preview screens
- [x] TASK-25.12 Show target/source language flags on deck displays
- [x] TASK-25.13 Force English UI locale when logged out
```

---

# TASK-25.01 Fix GraphQL context to expose Express res for auth cookies

## Status

DONE

## Context

During local EPIC-24 smoke, Sign Up / Sign In fail with:

```txt
Cannot read properties of undefined (reading 'setHeader')
```

`AuthResolver` calls `RefreshTokenCookieService.setRefreshTokenCookie(context.res, …)` on `register`, `login`, `refreshToken`, and `logout`.

`GraphQLModule.forRoot` in `apps/api/src/app.module.ts` does not provide `context: ({ req, res }) => ({ req, res })`, so `context.res` is undefined.

Related symptoms: client may show `Session expired` when stale tokens trigger refresh that also needs `res`.

## Goal

GraphQL context always includes Express `req` and `res` so auth cookie set/clear works on web.

## Related Documents

```txt
docs/domain/auth-token-strategy.md
docs/tasks/22-auth-security-hardening.md
apps/api/src/app.module.ts
apps/api/src/modules/auth/presentation/graphql/resolvers/auth.resolver.ts
apps/api/src/modules/auth/presentation/http/refresh-token-cookie.service.ts
```

## Files to Create

```txt
None
```

## Files to Modify

```txt
apps/api/src/app.module.ts
```

Optional (only if needed for coverage):

```txt
apps/api/src/modules/auth/**/*.spec.ts
```

## Requirements

```txt
1. Add GraphQL context factory: ({ req, res }) => ({ req, res }).
2. Do not change cookie name, flags, or auth use-case logic unless required.
3. register / login / refreshToken / logout must set or clear refresh cookie without throwing.
4. Keep playground and existing GraphQL operations working.
```

## Security Requirements

```txt
- Do not log refresh tokens or cookie values.
- Do not move refresh tokens to localStorage/sessionStorage.
- Keep httpOnly cookie behavior for web.
```

## Architecture Constraints

```txt
- Fix belongs in GraphQL module config / HTTP boundary, not in use cases.
- Resolvers may keep using context.res via RefreshTokenCookieService.
```

## Acceptance Criteria

```txt
- register mutation succeeds without setHeader error.
- login mutation succeeds without setHeader error.
- Web Sign Up reaches study-language onboarding (or next post-auth screen).
- API build/tests for auth area still pass.
```

## Commands to Run

```txt
cd apps/api && pnpm exec tsc --noEmit -p tsconfig.build.json
cd apps/api && pnpm test -- --testPathPatterns=auth
```

Manual check:

```txt
1. Restart API (pnpm dev:api)
2. Clear site data for localhost:8081
3. Sign Up with a fresh email → no setHeader / Session expired error
```

## Expected Commit Message

```txt
TASK-25.01 Fix GraphQL context to expose Express res for auth cookies
```

---

# TASK-25.02 Fix web password field layout in AppInput

## Status

DONE

## Context

On web Sign Up (`pnpm mobile:web`), Password and Confirm password fields render broken:

```txt
- Password input height collapses; placeholder text is clipped
- Confirm password loses the bordered box styling used by Email
```

Root cause: TASK-22.01 switched web `secureTextEntry` inputs to bare `react-native` `TextInput` for masking, without applying Tamagui `Input`-equivalent layout styles.

## Goal

Password fields on web match Email field height, padding, and border while remaining masked.

## Related Documents

```txt
docs/tasks/22-auth-security-hardening.md
docs/tasks/14-frontend-auth.md
apps/mobile/src/ui/primitives/app-input.tsx
```

## Files to Create

```txt
None
```

## Files to Modify

```txt
apps/mobile/src/ui/primitives/app-input.tsx
```

## Requirements

```txt
1. Keep web password masking (secureTextEntry / type=password from TASK-22.01).
2. Apply explicit web styles so password TextInput matches Email/AppInput size:
   - min height comparable to Tamagui Input
   - padding, border, borderRadius, readable font (no clipped placeholder)
3. Cover Sign Up, Sign In, and reset-password fields using AppInput + secureTextEntry.
4. Do not break non-password AppInput on web or native.
5. Do not add a show/hide password toggle.
```

## Security Requirements

```txt
- Password characters must remain masked on web.
- Do not log password values.
```

## Architecture Constraints

```txt
- Fix in shared AppInput primitive only (unless a tiny shared style helper is needed).
- Do not change auth form validation logic.
```

## Acceptance Criteria

```txt
- On web Sign Up, Password and Confirm password look like Email.
- Placeholder text is not clipped.
- Typed characters remain masked on web.
- Sign In password field looks correct on web.
- Native password fields still work.
```

## Commands to Run

```txt
cd apps/mobile && pnpm typecheck
cd apps/mobile && pnpm lint
```

Manual check:

```txt
1. pnpm mobile:web → Sign Up
2. Password + Confirm password match Email layout
3. Type into password fields → masked
4. Spot-check Sign In password field
```

## Expected Commit Message

```txt
TASK-25.02 Fix web password field layout in AppInput
```

---

# TASK-25.03 Match web password field colors to Tamagui Input

## Status

DONE

## Context

After TASK-25.02, web password fields have correct height/border but a white background, while Email (Tamagui `Input`) uses the light theme grey (`color2` ≈ `hsla(0, 0%, 95%, 1)`). Placeholder and border tokens also differ.

## Goal

Web `secureTextEntry` AppInput background, border, text, and placeholder colors match Tamagui light `Input` / Email field.

## Files to Modify

```txt
apps/mobile/src/ui/primitives/app-input.tsx
docs/tasks/25-bugfixes.md
```

## Requirements

```txt
1. Align web password styles with Tamagui light theme tokens used by Input:
   - background ≈ color2 (95% gray)
   - border ≈ borderColor token
   - placeholder ≈ placeholderColor token
2. Keep masking and layout from TASK-25.02.
3. Do not change native AppInput path.
```

## Acceptance Criteria

```txt
- On web Sign Up, Password / Confirm password background matches Email grey.
- Placeholder tone matches Email.
- Characters remain masked.
```

## Commands to Run

```txt
cd apps/mobile && pnpm typecheck
cd apps/mobile && pnpm lint
```

## Expected Commit Message

```txt
TASK-25.03 Match web password field colors to Tamagui Input
```

---

# TASK-25.04 Localize bottom tab navigation titles

## Status

DONE

## Context

During EPIC-24 smoke with `interfaceLocale=uk`, Decks content is Ukrainian but bottom tabs stay English (`Home`, `Decks`, `Profile`) because `app/(tabs)/_layout.tsx` hardcodes titles.

## Goal

Bottom tab titles follow `interfaceLocale` (en/uk).

## Files to Modify

```txt
apps/mobile/app/(tabs)/_layout.tsx
apps/mobile/app/(tabs)/index.tsx
apps/mobile/src/i18n/resources/en.ts
apps/mobile/src/i18n/resources/uk.ts
docs/tasks/25-bugfixes.md
```

## Requirements

```txt
1. Add common.tabs.home / decks / profile strings in en and uk.
2. Use useTranslation in tabs layout for Tabs.Screen title options.
3. Localize Home screen PageTitle the same way.
4. Do not change tab routes or StudyLanguageSelector header.
```

## Acceptance Criteria

```txt
- With interface language Ukrainian, tabs show Ukrainian labels.
- Switching back to English restores English tab labels.
```

## Commands to Run

```txt
cd apps/mobile && pnpm typecheck
cd apps/mobile && pnpm lint
```

## Expected Commit Message

```txt
TASK-25.04 Localize bottom tab navigation titles
```

---

# TASK-25.05 Keep bottom tabs visible on deck screens

## Status

DONE

## Context

After creating a deck, navigation goes to `/decks/[deckId]`. That stack lived outside `(tabs)`, so the bottom tab bar disappeared (and there was no in-app back header).

## Goal

Deck list, create, detail, edit, cards, CSV, and assign-languages screens stay inside the tabs navigator so Home / Decks / Profile remain visible.

## Files to Modify

```txt
apps/mobile/app/_layout.tsx
apps/mobile/app/(tabs)/decks/** (moved from apps/mobile/app/decks/**)
docs/tasks/25-bugfixes.md
```

## Requirements

```txt
1. Move app/decks/* under app/(tabs)/decks/ (index = former decks.tsx).
2. Remove root Stack.Screen name="decks".
3. Keep StudyLanguageProtectedStack as decks group layout.
4. Keep existing hrefs (/decks/..., /(tabs)/decks) working.
```

## Acceptance Criteria

```txt
- Open deck detail from Decks tab → bottom tabs still visible.
- Create deck → lands on detail with tabs still visible.
- Can switch to Profile/Home from deck detail via tabs.
```

## Commands to Run

```txt
cd apps/mobile && pnpm typecheck
cd apps/mobile && pnpm lint
```

## Expected Commit Message

```txt
TASK-25.05 Keep bottom tabs visible on deck screens
```

---

# TASK-25.06 Show decks as vertical bordered cards

## Status

DONE

## Context

During smoke, deck sections rendered as full-width list rows. Product feedback: show decks as vertical bordered cards (carousel/rail inspiration; not a 1:1 visual copy).

## Goal

Decks page sections show vertical bordered cards in a horizontal rail per section.

## Files to Modify

```txt
apps/mobile/src/features/decks/components/deck-list-item.tsx
apps/mobile/src/features/decks/components/decks-page-sections.tsx
apps/mobile/src/features/decks/components/deck-list.tsx
docs/tasks/25-bugfixes.md
```

## Requirements

```txt
1. Deck card: bordered tile, accent header band, title, optional description, status badges.
2. Sections use horizontal ScrollView of cards.
3. Keep DeckList grid usage working via layout="fill".
4. No stock images; no purple/glow redesign of the whole app.
```

## Acceptance Criteria

```txt
- Decks tab sections show vertical bordered cards in a horizontal row.
- Tap still opens deck detail / public deck.
- Empty sections unchanged.
```

## Commands to Run

```txt
cd apps/mobile && pnpm typecheck
cd apps/mobile && pnpm lint
```

## Expected Commit Message

```txt
TASK-25.06 Show decks as vertical bordered cards
```

---

# TASK-25.07 Add bottom tab icons (keep full-width bar)

## Status

DONE

## Context

Bottom tabs were text-only. Compact/centered bar was rejected — the bar must stay full-width pinned to the bottom. Only icons were requested.

## Goal

Add Home / Decks / Profile icons without changing full-width tab bar layout.

## Files to Modify

```txt
apps/mobile/app/(tabs)/_layout.tsx
apps/mobile/package.json
pnpm-lock.yaml
docs/tasks/25-bugfixes.md
```

## Requirements

```txt
1. Add Ionicons: home, albums (decks), person.
2. Keep default full-width bottom tab bar (no maxWidth / centered compact bar).
3. Keep localized titles.
```

## Acceptance Criteria

```txt
- Tabs show icons + labels.
- Tab bar remains full width at the bottom of the screen.
```

## Commands to Run

```txt
cd apps/mobile && pnpm typecheck
cd apps/mobile && pnpm lint
```

## Expected Commit Message

```txt
TASK-25.07 Add bottom tab icons (keep full-width bar)
```

---

# TASK-25.08 Fix vertical scroll on My Decks, forms, and list screens

## Status

DONE

## Context

My Decks content is clipped by the bottom tab bar. Nested `ScrollView` inside non-scrollable `Screen` does not get a bounded height, so the page does not scroll (especially on web).

The same overflow pattern appears on form/auth screens (`Screen` without `scrollable`) and on list screens that host `FlatList` without `flex: 1` (deck detail, public decks, deck preview).

## Goal

Restore vertical scrolling for long screens: `Screen scrollable` for form-style pages, and bounded `FlatList` for list pages.

## Files to Modify

```txt
apps/mobile/src/features/decks/screens/my-decks-screen.tsx
apps/mobile/src/features/decks/screens/create-card-screen.tsx
apps/mobile/src/features/decks/screens/edit-card-screen.tsx
apps/mobile/src/features/decks/components/card-list.tsx
apps/mobile/src/features/decks/components/deck-list.tsx
apps/mobile/src/features/groups/screens/create-group-screen.tsx
apps/mobile/src/features/public-decks/components/public-deck-list.tsx
apps/mobile/src/features/study-languages/screens/deck-preview-session-screen.tsx
apps/mobile/src/features/lessons/screens/lesson-summary-screen.tsx
apps/mobile/src/ui/components/screen.tsx
apps/mobile/app/(auth)/sign-in.tsx
apps/mobile/app/(auth)/sign-up.tsx
apps/mobile/src/features/auth/components/forgot-password-form.tsx
apps/mobile/src/features/auth/components/reset-password-form.tsx
apps/mobile/src/features/auth/components/verify-email-screen.tsx
apps/mobile/src/features/auth/components/verify-email-prompt.tsx
docs/tasks/25-bugfixes.md
```

## Requirements

```txt
1. My Decks: use Screen scrollable; remove nested vertical ScrollView.
2. Forms/auth (create/edit card, create group, sign-in/up, forgot/reset, verify email, lesson summary): Screen scrollable on content paths.
3. List hosts (CardList, PublicDeckList, DeckList, deck preview FlatList): style={{ flex: 1 }} so lists scroll inside Screen.
4. Screen content wrapper uses flex: 1 so nested FlatLists get a bounded height.
5. Prefer FlatList ListEmptyComponent over non-scrolling empty fragments when the screen uses a list.
6. Keep horizontal deck section rails as-is.
```

## Acceptance Criteria

```txt
- Long My Decks content scrolls; last section reachable above the tab bar.
- Card / group / auth forms scroll when content or keyboard overflows.
- Deck detail, public decks, and deck preview lists scroll when long.
- Horizontal deck rails still work.
```

## Commands to Run

```txt
cd apps/mobile && pnpm typecheck
cd apps/mobile && pnpm lint
```

## Expected Commit Message

```txt
TASK-25.08 Fix vertical scroll on My Decks, forms, and list screens
```

---

# TASK-25.09 Rename “My language” to “My native language”

## Status

DONE

## Context

Settings and onboarding label `My language` / `Моя мова` is ambiguous next to study languages. It should read as native language.

## Goal

Rename user-facing copy for `nativeLanguage` to “My native language” (EN) / “Моя рідна мова” (UK).

## Files to Modify

```txt
apps/mobile/src/i18n/resources/en/settings.ts
apps/mobile/src/i18n/resources/uk/settings.ts
apps/mobile/src/i18n/resources/en/study-languages.ts
apps/mobile/src/i18n/resources/uk/study-languages.ts
docs/smoke/study-languages.md
docs/release/mvp-smoke-tests.md
docs/tasks/25-bugfixes.md
```

## Requirements

```txt
1. Settings field label: My native language / Моя рідна мова.
2. Onboarding nativeLabel and related “use my language” actions use “native language” wording.
3. Update smoke docs that mention Settings **My language**.
```

## Acceptance Criteria

```txt
- Settings and onboarding show “My native language” / “Моя рідна мова”.
- Copy/preview action no longer says only “My language”.
```

## Commands to Run

```txt
cd apps/mobile && pnpm typecheck
cd apps/mobile && pnpm lint
```

## Expected Commit Message

```txt
TASK-25.09 Rename “My language” to “My native language”
```

---

# TASK-25.10 Use X icon to close study-language modals

## Status

DONE

## Context

Study language list/catalog modals used a text “Cancel” / “Скасувати” control. Elsewhere modals close with an X icon.

## Goal

Replace Cancel text with a close (X) icon on study-language modals.

## Files to Modify

```txt
apps/mobile/src/features/study-languages/components/language-catalog-modal.tsx
apps/mobile/src/features/study-languages/components/study-languages-list-modal.tsx
apps/mobile/src/i18n/resources/en.ts
apps/mobile/src/i18n/resources/uk.ts
docs/tasks/25-bugfixes.md
```

## Requirements

```txt
1. Both LanguageCatalogModal and StudyLanguagesListModal close via Ionicons close (X).
2. Keep accessibility label via common.close (en/uk).
```

## Acceptance Criteria

```txt
- Modal headers show X instead of Cancel / Скасувати.
- Tapping X closes the modal.
```

## Commands to Run

```txt
cd apps/mobile && pnpm typecheck
cd apps/mobile && pnpm lint
```

## Expected Commit Message

```txt
TASK-25.10 Use X icon to close study-language modals
```

---

# TASK-25.11 Keep bottom tabs on public deck and preview screens

## Status

DONE

## Context

Public deck detail (`/public/[deckId]`) and deck preview (`/preview/[sessionId]`) live outside `(tabs)`, so the bottom tab bar disappears and there is no reliable way back to My Decks (same class of bug as TASK-25.05 for owned decks).

## Goal

Keep Home / Decks / Profile tabs visible on public deck detail and copy/regenerate preview screens.

## Files to Modify

```txt
apps/mobile/app/_layout.tsx
apps/mobile/app/(tabs)/_layout.tsx
apps/mobile/app/(tabs)/public/** (from app/(tabs)/public.tsx + app/public/**)
apps/mobile/app/(tabs)/preview/** (from app/preview/**)
docs/tasks/25-bugfixes.md
```

## Requirements

```txt
1. Move public deck routes under app/(tabs)/public/ (index + [deckId]).
2. Move preview routes under app/(tabs)/preview/.
3. Remove root Stack.Screen entries for public and preview.
4. Register preview tab screen with href: null (hidden), same as public.
5. Keep existing hrefs (/public/..., /preview/...) working.
```

## Acceptance Criteria

```txt
- Open public deck from Decks → bottom tabs still visible.
- Open copy/regenerate preview → bottom tabs still visible.
- Can switch to Decks / Home / Profile via tabs from those screens.
```

## Commands to Run

```txt
cd apps/mobile && pnpm typecheck
cd apps/mobile && pnpm lint
```

## Expected Commit Message

```txt
TASK-25.11 Keep bottom tabs on public deck and preview screens
```

---

# TASK-25.12 Show target/source language flags on deck displays

## Status

DONE

## Context

Deck cards do not show which language pair they use. Flags should appear on deck list/detail surfaces only — not on word cards inside a deck.

## Goal

Show target → source language flags on deck list cards and deck headers.

## Files to Create

```txt
apps/mobile/src/features/decks/components/deck-language-flags.tsx
```

## Files to Modify

```txt
apps/mobile/src/features/decks/components/deck-list-item.tsx
apps/mobile/src/features/decks/components/deck-header.tsx
apps/mobile/src/features/decks/components/index.ts
apps/mobile/src/features/public-decks/components/public-deck-header.tsx
apps/mobile/src/features/public-decks/components/public-deck-list-item.tsx
docs/tasks/25-bugfixes.md
```

## Requirements

```txt
1. Resolve flags via languages catalog (Apollo-cached useLanguagesQuery).
2. Render target → source on deck list cards and deck/public headers.
3. Hide flags when both languages are null (legacy / no-language decks).
4. Do not add flags to card list items or preview word rows.
```

## Acceptance Criteria

```txt
- Decks page cards show target/source flags when languages are set.
- Deck detail and public deck headers show the same pair.
- Word cards inside a deck remain unchanged.
```

## Commands to Run

```txt
cd apps/mobile && pnpm typecheck
cd apps/mobile && pnpm lint
```

## Expected Commit Message

```txt
TASK-25.12 Show target/source language flags on deck displays
```

---

# TASK-25.13 Force English UI locale when logged out

## Status

DONE

## Context

Guest / logged-out screens followed device locale or a previously persisted `uk` locale. Product rule: unauthenticated UI must be English; after login, backend `interfaceLocale` still wins.

## Goal

Always use English for guest bootstrap and after logout; restore user locale only after successful auth sync.

## Files to Modify

```txt
apps/mobile/src/i18n/bootstrap-locale.ts
apps/mobile/src/i18n/index.ts
apps/mobile/src/features/auth/services/auth-session.ts
apps/mobile/src/features/auth/services/bootstrap-auth.ts
docs/tasks/25-bugfixes.md
```

## Requirements

```txt
1. bootstrapLocale applies DEFAULT_LOCALE (en), not device locale / prior guest persistence of uk.
2. clearAuthSession resets UI locale to English.
3. Failed / missing auth bootstrap also applies guest English.
4. Logged-in syncLocaleFromBackend / applyLocaleFromBackend unchanged.
```

## Acceptance Criteria

```txt
- Signed-out auth screens are English even on a uk device.
- After logout, UI switches to English.
- After login, interfaceLocale from settings still applies.
```

## Commands to Run

```txt
cd apps/mobile && pnpm typecheck
cd apps/mobile && pnpm lint
```

## Expected Commit Message

```txt
TASK-25.13 Force English UI locale when logged out
```
