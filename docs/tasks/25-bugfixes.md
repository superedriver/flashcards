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
