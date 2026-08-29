# EPIC-30 SoT Discrepancies

## Epic Goal

Fix mismatches between live sources of truth and the current implementation. Keep one standing bucket: when docs and code disagree, record the discrepancy here, then align docs and/or code in focused tasks.

This epic covers:

```txt
- a discrepancy register (append new entries as they are found)
- focused tasks to make live SoT unambiguous and to make code match that SoT
```

This epic does **not** include:

```txt
- new product features unrelated to a registered discrepancy
- general repository dead-code cleanup
- cosmetic refactoring
- silently making product decisions during implementation
- changing learning-steps intervals or promptDirection
```

New discrepancies found later should be appended here as new register entries and TASK-30.XX items (one discrepancy ≈ one or more focused tasks ≈ one commit each).

## Epic Status

DONE

## Related Documents

Cursor must read these documents before working on this epic:

```txt
docs/architecture.md
docs/backend-clean-architecture.md
docs/domain/lesson-flow.md
docs/algorithms/learning-steps.md
docs/security/security-checklist.md
docs/tasks/README.md
docs/tasks/cursor-task-template.md
docs/tasks/done/29-lesson-queue.md
docs/smoke/lesson-queue.md
```

## Epic Prerequisites

EPIC-29 should be complete (lesson queue on main).

Expected state:

```txt
- Backend is SoT for lesson queue and SRS
- Queue picker lives in lessons domain (pure TypeScript)
- StudySession persists snapshotCardIds + queueState
- Local stack: Postgres + API (:3000) + mobile
```

## Known Discrepancies (backlog source)

```txt
1. Repeat gap frozen at display time vs SoT “after answering”
   - Fixed in TASK-30.01–30.03
2. Product says review session / Повторення; UI and live docs still said Lesson / Урок
   - Technical identifiers Lesson, StudySession, lessonSize stay in code
3. Summary showed Know / Don't know / % as attempts; product wants unique cards only
   - Fixed in TASK-30.06 (UI only; GraphQL completeLesson payload unchanged)
4. Own deck cards had no Start when due > 0 (only deck detail)
   - Fixed in TASK-30.07
5. Owner deck detail is a flat stack of equally weighted buttons
   - Fixed in TASK-30.08
6. Card rows show 0-based #, bulky Edit/Delete, flush to the scrollbar
   - Fixed in TASK-30.09
7. Owner deck detail stats are a stacked list; Edit/Add are labeled buttons;
   Delete is a large red button in the middle of the screen
   - Fixed in TASK-30.10
8. Deck detail: Next review contradicts Due now; Danger zone looks like the
   card-list header; flags sit under the deck title; card rows are same-color
   with large gaps
   - Fixed in TASK-30.11
9. Delete Deck does not look like a button; Cards has no frame; Start review
   is still a labeled primary button
   - Fixed in TASK-30.12
10. Play has no label/circle; stats are a flat pair of rows; word rows lack
    their own border
    - Fixed in TASK-30.13
11. Play caption is part of the hit target; stats items are left-aligned on
    gray; word padding ignored; status is plain text
    - Fixed in TASK-30.14
12. Word inset too large; group badges have no icons; stats groups do not
    match word-badge colors; Private pill blends into the page
    - Fixed in TASK-30.15
13. Private sits under the deck name; stats group labels are not pills;
    More actions are still live
    - Fixed in TASK-30.16
14. Stats group icon and count are split; Start is a circled Play under stats;
    status pills are capsules
    - Fixed in TASK-30.17
15. Stats group labels are left-aligned; Own counters are plain text; rail
    cards clip two pills; Create Deck is full-width; deck card caps are 96px
    - Fixed in TASK-30.18
16. My Decks cards use one chrome for Own/Group/Public; Approved noise;
    no Group/Public seed fixtures
    - Fixed in TASK-30.19
17. Own rail cards are 260px so only ~2 fit in the 720px column
    - Fixed in TASK-30.20
18. My Decks sections stay a horizontal rail, so extra cards clip
    - Fixed in TASK-30.21
19. Wrapped My Decks cards stay 228px and leave a gap on the right
    - Fixed in TASK-30.22
20. Own compact stats stack emoji above the count; cards still say To learn
    - Fixed in TASK-30.23
21. Own compact stats use per-group color tiles instead of one bordered row
    - Fixed in TASK-30.24
22. Own cards are tall, badges loud, titles shift stats, CTA says Start review
    - Fixed in TASK-30.25
23. Own footer wraps / sits too close to the stats box
    - Fixed in TASK-30.26
24. Home is stretched; Due now is weak; START is a gray button labeled START
    - Fixed in TASK-30.27
25. Profile is one long form; settings need a save click; Role: User is noise
    - Fixed in TASK-30.28
26. My Groups is two full-width buttons plus untitled name cards
    - Fixed in TASK-30.29
27. Group invitations is a verbose status card with a bare empty line
    - Fixed in TASK-30.30
28. Create Group is two inputs and two full-width gray buttons
    - Fixed in TASK-30.31
29. Group screens leave the tab navigator, so Home/Decks/Profile disappear
    - Fixed in TASK-30.32
30. Edit Card is a tall stack of equal inputs and full-width gray buttons
    - Fixed in TASK-30.33
31. Temporarily disable Profile Groups and Invitations
    - Fixed in TASK-30.34
32. Edit Deck is a long form with two huge language fields
    - Fixed in TASK-30.35
33. Language pair arrow on deck forms is noise
    - Fixed in TASK-30.36
34. Cards section is a bordered box with a duplicate Add card
    - Fixed in TASK-30.37
35. Deck Detail stats icons differ from My Decks
    - Fixed in TASK-30.38
36. Review is text plus Reveal / Know / Don't know buttons, not a card
    - Fixed in TASK-30.39
37. Review card shows Front/Back, both sides after flip, and too much empty space
    - Fixed in TASK-30.40
38. Deck card badges say To learn and use 🌱 / 🔁 instead of Learn with 📖 / ✏️ / ✅
    - Fixed in TASK-30.41
39. Adding a card does not update deck/My Decks counts until reload
    - Fixed in TASK-30.42
40. Review complete is three equal buttons plus a card count
    - Fixed in TASK-30.43
41. Review complete leaves the tab navigator
    - Fixed in TASK-30.44
42. Deleting a deck does not refresh Home counts
    - Fixed in TASK-30.45
43. Finishing a review does not refresh Home or My Decks counts
    - Fixed in TASK-30.46
```

## Discrepancy Register

Decision records for this epic. Implementation tasks are below.

### Register statuses

```txt
OPEN       — documented, no decision yet
APPROVED   — decision approved; implementation task may proceed
DONE       — approved fix landed (docs and code match)
DEFERRED   — explicitly postponed with owner note
```

### DISC-001 Repeat gap frozen at display, not at answer

Status:

```txt
DONE
```

Conflicting sources (as found; fixed in TASK-30.01–30.03):

```txt
SoT after TASK-30.01:
  - docs/domain/lesson-flow.md: display ≠ answer ≠ freeze N; N at answer time
  - docs/architecture.md and backend-clean-architecture.md match that timing

Implementation after TASK-30.03:
  - recordLessonCardAnswer in select-next-lesson-card.ts (answer event, not display)
  - Start persists empty showCounts; first card is display only
  - SubmitReview records the answered card, then returns nextCard without recording that display

Was wrong (before 30.03):
  - recordLessonCardShowing at Start (first card) and SubmitReview (nextCard)
```

---

### DISC-002 UI and live docs say Lesson / Урок

Status:

```txt
DONE
```

Conflicting sources (as found; fixed in TASK-30.04):

```txt
Product:
  - Review session / Повторення
  - Completion title: "Review complete" / "Повторення завершено"

Was wrong:
  - UI en/uk: Lesson / Урок (start, leave, summary, settings lessonSize)
  - Live docs described a “lesson” as the product session name
```

Product decision (approved in chat):

```txt
User-facing: Повторення, not Урок.
Live docs: review session / repeat session as the product model.
Technical names in code (Lesson, StudySession, lessonSize, GraphQL) stay
if they do not change logic.

Queue “repeat” (2nd/3rd answer of the same cardId) is not the product name
of the session.
```

Action:

```txt
TASK-30.04 Use review session and Повторення in UI and live docs
```

Impact:

```txt
docs: lesson-flow.md, architecture.md, permissions.md, smoke, mvp-smoke-tests
frontend i18n: lessons, home, decks, settings (en/uk)
backend / Prisma / GraphQL identifiers: unchanged
```

Product decision (approved in chat):

```txt
Show, answer, and planning a repeat are separate.

1. Show A — user sees the card. No answer yet, no new dueAt.
   Do not increment showCount. Do not freeze gap N.
2. Answer Know / Don’t know.
3. Then apply learning-steps, persist new step/dueAt, increment showCount for A,
   freeze N = min(3, other currently ready AND showable cards) at answer time.

Example:
  Show A at 18:00 with only B ready.
  C due 18:00:20, D due 18:00:35.
  User answers A at 18:00:40.
  Others ready+showable: B, C, D → N = 3
  Sequence: A → B → C → D → A repeat.

Gap fill = a completed showing of another card (that other card was answered).
Display without an answer does not fill anyone’s gap.
```

Action:

```txt
TASK-30.01  make SoT wording unambiguous (display ≠ answer ≠ freeze N)
TASK-30.02  picker tests for answer-time freeze, including late-due C/D
TASK-30.03  Start + SubmitReview call record on the answered card, not on display
```

Impact:

```txt
docs: lesson-flow.md, architecture.md, backend-clean-architecture.md, smoke/lesson-queue.md
backend: picker tests; StartLesson, StartHomeLesson, SubmitReview
frontend / Prisma / GraphQL: none expected
```

---

### DISC-003 Review summary shows attempt stats, not unique cards

Status:

```txt
DONE
```

Conflicting sources (as found; fixed in TASK-30.06):

```txt
Product (approved in chat during EPIC-29 QA):
  - Summary: title, Nice work, completedAt, “Cards in this review: N”
  - N = unique answered cardIds in this session
  - Do not show Reviewed, Know, Don't know, Known %

Was wrong:
  - UI showed cardsInLesson + reviewedCards + knownCount + dontKnowCount + %
  - Home completeLesson.totalCards equals reviewedCards (attempts)
  - Live SoT said Know / Don't know on the result screen are attempts
```

Product decision (approved in chat):

```txt
Hide attempt stats for now. Unique card count only.
Keep Start another review / Home / Back to deck as today.
Do not change CompleteLessonUseCase or GraphQL payload.
```

Action:

```txt
TASK-30.06 Show unique card count on review summary
```

Impact:

```txt
frontend: lesson summary screen, LessonCompletion uniqueCardCount
docs: lesson-flow.md, architecture.md, smoke/lesson-queue.md, mvp-smoke-tests
backend / Prisma / GraphQL: unchanged
```

---

### DISC-004 Own deck cards have no Start when due > 0

Status:

```txt
DONE
```

Conflicting sources (as found; fixed in TASK-30.07):

```txt
Product (approved in chat during EPIC-29 QA):
  - Own My Decks cards: Play bottom-right when dueCount > 0
  - Tap card → deck detail
  - Tap Play → startLesson (same path as deck detail Start), no extra visit to detail
  - dueCount = 0 → no Play
  - Group / Public / No language cards: no Play

Was wrong:
  - Start existed only on deck detail for the owner
```

Action:

```txt
TASK-30.07 Add Play start on own deck cards when due
```

Impact:

```txt
frontend: DeckListItem + Play control; /lessons/start?deckId=
docs: live SoT for deck start entry points (code is SoT)
backend / Prisma / GraphQL: unchanged
```

---

### DISC-005 Owner deck detail has no action hierarchy

Status:

```txt
DONE
```

Conflicting sources (as found; fixed in TASK-30.08):

```txt
Product (approved in chat):
  - One primary: Start review (owner + dueCount > 0)
  - Quick: Edit, Add card (labeled, not icon-only)
  - More ⋯: Import CSV, Regenerate translations, Publish / Make private
  - Danger zone: Delete deck
  - Assign languages stays visible when the deck has no languages
  - Non-owner copy flow unchanged
  - Rare actions stay labeled in a menu, not mystery icons

Was wrong:
  - Deck detail listed Edit, Add card, CSV, Regenerate, Publish, Delete
    as equal full-width buttons
```

Action:

```txt
TASK-30.08 Restructure owner deck detail actions
```

Impact:

```txt
frontend: deck header More, stats Start below card, DeckActions, DeckMoreMenu
docs: lesson-flow Deck UI
backend / Prisma / GraphQL: unchanged
```

---

### DISC-006 Card rows: 0-based index, bulky actions, flush scrollbar

Status:

```txt
DONE
```

Conflicting sources (as found; fixed in TASK-30.09):

```txt
Product (approved in chat):
  - Display index is 1-based (#{position + 1}); storage stays 0-based
  - Owner Edit / Delete are icons on the right, with a11y labels
  - List content has padding from the scrollbar
  - UI only

Was wrong:
  - #{card.position} showed #0 for the first card
  - Full-width Edit / Delete under the text
```

Action:

```txt
TASK-30.09 Compact card rows with 1-based index
```

Impact:

```txt
frontend: CardList, CardListItem, public deck card rows
docs: lesson-flow card row note
backend / Prisma / GraphQL: unchanged
```

---

### DISC-007 Deck detail stats and secondary actions still too heavy

Status:

```txt
DONE
```

Conflicting sources (as found; fixed in TASK-30.10):

```txt
Product (approved in chat after 30.08/30.09):
  - Stats: Total left, Due now right (space-between), with emoji
  - To learn / Practiced / Learned on one row: number on top, short label below, emoji
  - Start review stays the only large primary
  - Edit / Add card / More are icon buttons (a11y labels)
  - Delete deck is a compact Danger zone row (icon + label), not a large red button
  - Delete stays out of More; still confirm-destructive
  - Assign languages stays a visible CTA when the deck has no languages

Was wrong:
  - Stats were five stacked lines plus a title
  - Edit / Add card were labeled full-width-in-row buttons
  - More lived in the header
  - Delete was a large red button
```

Action:

```txt
TASK-30.10 Compact deck detail stats and secondary actions
```

Impact:

```txt
frontend: DeckLearningStatsCard, DeckActions, deck-detail header More placement
docs: lesson-flow Deck UI
backend / Prisma / GraphQL: unchanged
```

---

### DISC-008 Deck detail Next review, Danger zone, flags, and card list

Status:

```txt
DONE
```

Conflicting sources (as found; fixed in TASK-30.11):

```txt
Product (approved in chat after 30.10):
  - Remove Next review from stats (including “No cards scheduled yet”)
  - Danger zone is a distinct card so it is not a header for the word list
  - Word list has a Cards / Картки heading
  - Even/odd word rows have alternating backgrounds
  - Tighter gap between word rows
  - Language flags sit on the same row as the page title “Deck Detail”

Was wrong:
  - Next review showed null as “No cards scheduled yet” while Due now > 0
  - Danger zone label sat directly above card #1
  - Flags were under the deck title (G1)
```

Action:

```txt
TASK-30.11 Separate deck detail sections and tighten the card list
```

Impact:

```txt
frontend: stats card, DeckActions, PageTitle row, CardList/CardListItem, DeckHeader
docs: lesson-flow Deck UI
backend / Prisma / GraphQL: unchanged (nextDueAt may remain unused in this UI)
```

---

### DISC-009 Deck detail Play, Delete button, and Cards frame

Status:

```txt
DONE
```

Conflicting sources (as found; fixed in TASK-30.12):

```txt
Product (approved in chat after 30.11):
  - Start review is a large Play icon (a11y Start review), not a labeled button
  - Delete Deck is a clear button on the right of the Danger zone
  - Cards section has a border and inner padding

Was wrong:
  - Start was a full-width AppButton
  - Delete Deck was icon+text without button chrome, left-aligned
  - Cards heading sat flush above rows with no frame
```

Action:

```txt
TASK-30.12 Play start, Delete button, and Cards frame
```

Impact:

```txt
frontend: DeckLearningStatsCard, DeckActions, CardList
docs: lesson-flow Deck UI
backend / Prisma / GraphQL: unchanged
```

---

### DISC-010 Deck detail stats tiles, Play circle, and word borders

Status:

```txt
DONE
```

Conflicting sources (as found; fixed in TASK-30.13):

```txt
Product (approved in chat after 30.12):
  - Stats: two bordered cards. Top: Total cards | Due now. Bottom: To learn |
    Practiced | Learned. Icon in a rounded square, large number, label below,
    vertical dividers
  - Play in a circle with Start review / Почати повторення under it
  - Each word row has its own border and inner padding

Was wrong:
  - Stats were one card with inline Total/Due and a 3-up group row
  - Play was a bare triangle
  - Word rows used zebra fill without a per-row border
```

Action:

```txt
TASK-30.13 Restyle stats tiles, circled Play, and word borders
```

Impact:

```txt
frontend: DeckLearningStatsCard, CardListItem, i18n stats labels
docs: lesson-flow Deck UI
backend / Prisma / GraphQL: unchanged
```

---

### DISC-011 Deck detail Play hit target, stats centering, word inset, status pills

Status:

```txt
DONE
```

Conflicting sources (as found; fixed in TASK-30.14):

```txt
Product (approved in chat after 30.13):
  - Only the Play circle is tappable; caption is muted and not clickable
  - Stats cards white; each item centered in its column
  - Word row content inset from the border (Tamagui padding is not enough)
  - Visibility/moderation as pill badges with icons:
    Private lock gray, Public globe blue, Pending time amber,
    Published check green, Rejected close red, Hidden eye-off brown

Was wrong:
  - Whole Play+caption Pressable, caption same blue
  - Stat cells left-packed, card background not white
  - Word text flush to the row border
  - Status was colored text only
```

Action:

```txt
TASK-30.14 Center stats, isolate Play, inset words, pill badges
```

Impact:

```txt
frontend: DeckLearningStatsCard, CardListItem, DeckStatusBadge
docs: lesson-flow Deck UI
backend / Prisma / GraphQL: unchanged
```

---

### DISC-012 Learning-group chrome, tighter word inset, bordered status pills

Status:

```txt
DONE
```

Conflicting sources (as found; fixed in TASK-30.15):

```txt
Product (approved in chat after 30.14):
  - Word row inner padding 8px
  - Word badges: 🌱 To learn, 🔁 Practiced, ✅ Learned
  - Stats To learn / Practiced / Learned use the same badge colors/backgrounds
  - Status pills have a 1px accent border; Private bg #e8edf2 / border #98a2b3
    Public/Pending/Published/Rejected/Hidden get matching borders

Was wrong:
  - 14px word inset
  - Group badges were text-only
  - Stats group chips were generic gray
  - Private pill had no border and blended with the page
```

Action:

```txt
TASK-30.15 Align group chrome, tighten word inset, border status pills
```

Impact:

```txt
frontend: learning-group style, LearningGroupBadge, stats cells, DeckStatusBadge, CardListItem
docs: lesson-flow Deck UI
backend / Prisma / GraphQL: unchanged
```

---

### DISC-013 Status pill placement, stats label pills, More disabled

Status:

```txt
DONE
```

Conflicting sources (as found; fixed in TASK-30.16):

```txt
Product (approved in chat after 30.15):
  - Visibility/moderation pills sit after “Deck Detail”; flags stay right
  - Stats To learn / Practiced / Learned labels use the same pill background
    as word badges
  - More menu items (CSV, regenerate, publish/unpublish) are disabled for now

Was wrong:
  - Pills were under the deck title (G1)
  - Stats group labels were colored text without a pill fill
  - More actions were still tappable
```

Action:

```txt
TASK-30.16 Move status pills, pill stats labels, disable More
```

Impact:

```txt
frontend: PageTitle, deck-detail, DeckHeader, stats labels, DeckMoreMenu
docs: lesson-flow Deck UI
backend / Prisma / GraphQL: unchanged
```

---

### DISC-014 Stats group tiles, header Start, status pill radius

Status:

```txt
DONE
```

Conflicting sources (as found; fixed in TASK-30.17):

```txt
Product (approved in chat after 30.16):
  - Stats group: emoji + count share one group-colored tile; label pill below
  - Total / Due now stay as today
  - Start review is a filled #1a56db button (white play + label) top-right
    of the deck header; owner + dueCount > 0 only
  - Status pills use borderRadius 8 (same as chips), not 999
  - Use existing group/status colors, not the mock palette
  - Do not change word rows

Was wrong:
  - Group emoji in a 36×36 chip, count beside it
  - Circled Play under stats
  - Status pills were fully rounded capsules
```

Action:

```txt
TASK-30.17 Restyle stats tiles, header Start, status pill radius
```

Impact:

```txt
frontend: stats cells, DeckHeader trailing Start, DeckStatusBadge radius
docs: lesson-flow Deck UI
backend / Prisma / GraphQL: unchanged
```

---

### DISC-015 My Decks chrome and stats label alignment

Status:

```txt
DONE
```

Conflicting sources (as found; fixed in TASK-30.18):

```txt
Product (approved in chat after 30.17):
  - Stats group label pills centered under the tiles
  - Own My Decks counters use the same group emoji + background pills
  - Rail status slot fits two wrapping pills (Public + Published)
  - Create Deck sits on the My Decks title row, right-aligned, with a +
  - Deck card accent cap is shorter (~56px); flags (and origin on No language)
    stay in the cap

Was wrong:
  - LearningGroupBadge alignSelf flex-start left-aligned the stats labels
  - Compact counters were gray text
  - STATUS_SLOT_HEIGHT 36 + overflow hidden clipped the second pill
  - Create Deck was a full-width button under the title
  - Accent cap was 96px for only flags
```

Action:

```txt
TASK-30.18 Compact My Decks cards and center stats labels
```

Impact:

```txt
frontend: LearningGroupBadge, stats labels, compact counters, deck list item,
  MyDecks PageTitle trailing
docs: lesson-flow Deck UI
backend / Prisma / GraphQL: unchanged
```

---

### DISC-016 My Decks cards should match section purpose

Status:

```txt
DONE
```

Conflicting sources (as found; fixed in TASK-30.19):

```txt
Product (approved in chat after 30.18, Own mock + variant A):
  - Same shell: width, radius, border, flags/title/footer
  - Own: flags + visibility top, title, divider, 3-col group stats
    (🌱🔁✅), Due + filled Start review; hide Approved; show
    Pending/Rejected/Hidden; no colored cap; no Play overlay
  - Group: Shared (not Private), View; no stats
  - Public: Official if isOfficial else Public; no Approved; View; no stats
  - No language: origin + visibility + Language not selected; keep section name
  - Create Deck: outline blue +
  - Seed Group + Public fixtures so demo user can see those sections

Was wrong:
  - One card chrome (pastel cap, full status pills, stats only on Own)
  - Approved shown on list cards
  - Group looked Private; Public catalog empty because demo owned the only
    public deck and it had no language
```

Action:

```txt
TASK-30.19 Differentiate My Decks cards by section
```

Impact:

```txt
frontend: DeckListItem, compact stats, status badge hideApproved, MyDecks Create
seed: catalog owner, group share, official public es deck
docs: lesson-flow Deck UI, smoke Play label
GraphQL / Prisma schema / use cases: unchanged
```

---

### DISC-017 Own rail cards do not fit three-across

Status:

```txt
DONE
```

Conflicting sources (as found; fixed in TASK-30.20):

```txt
Product (approved in chat after 30.19):
  - Three Own cards fully visible in the default 720px column
  - Change only RAIL_WIDTH; keep inner fonts and control sizes

Was wrong:
  - RAIL_WIDTH 260 + 12px gap clipped the third card
```

Action:

```txt
TASK-30.20 Narrow My Decks rail cards to fit three
```

Impact:

```txt
frontend: DeckListItem RAIL_WIDTH only
docs: lesson-flow Deck UI
backend / Prisma / GraphQL: unchanged
```

---

### DISC-018 My Decks extra cards clip in a horizontal rail

Status:

```txt
DONE
```

Conflicting sources (as found; fixed in TASK-30.21):

```txt
Product (approved in chat after 30.20):
  - Section cards wrap to the next row (grid), not a horizontal rail
  - Keep ~228px card width and inner sizes

Was wrong:
  - Nested horizontal ScrollView clipped cards past the 720px column
```

Action:

```txt
TASK-30.21 Wrap My Decks section cards into a grid
```

Impact:

```txt
frontend: DeckSection layout (wrap grid), DeckListItem rail margin
docs: lesson-flow Deck UI
backend / Prisma / GraphQL: unchanged
```

---

### DISC-019 My Decks card row does not fill the content column

Status:

```txt
DONE
```

Conflicting sources (as found; fixed in TASK-30.22):

```txt
Product (approved in chat after 30.21):
  - The deck row uses the full content width
  - Cards share the row equally (3-across on default web) and wrap

Was wrong:
  - Fixed 228px cards left leftover space on the right of a 720px column
```

Action:

```txt
TASK-30.22 Stretch My Decks cards to fill the row
```

Impact:

```txt
frontend: DeckSection grid, DeckListItem width, responsive helpers
docs: lesson-flow Deck UI
backend / Prisma / GraphQL: unchanged
```

---

### DISC-020 Own compact stats stack emoji above count

Status:

```txt
DONE
```

Conflicting sources (as found; fixed in TASK-30.23):

```txt
Product (approved in chat after 30.22):
  - Compact stats: emoji + count on one centered row, short label below
  - Group tiles use LEARNING_GROUP_STYLE backgrounds
  - Card icons 📖 / ✏️ / 🎓 and label Learn (not To learn)
  - Deck detail and word badges keep 🌱🔁✅ and To learn

Was wrong:
  - Emoji stacked above the number with vertical dividers, no tile fill
  - Card label To learn
```

Action:

```txt
TASK-30.23 Restyle Own compact stats tiles
```

Impact:

```txt
frontend: compact stats layout, card Learn i18n
docs: lesson-flow Deck UI
backend / Prisma / GraphQL: unchanged
```

---

### DISC-021 Own compact stats should be one bordered 3-column row

Status:

```txt
DONE
```

Conflicting sources (as found; fixed in TASK-30.24):

```txt
Product (approved mock after 30.23):
  - Keep flags, title, Private/Public
  - One shared bordered stats container, 3 equal columns
  - Column: emoji, large count, gray label under
  - Thin vertical dividers; no per-status background fills
  - Footer: Due left, Start review right only when dueCount > 0
  - Card tap → deck detail. UI only

Was wrong:
  - Separate group-colored tiles, emoji+count on one row, 🎓 for Learned
```

Action:

```txt
TASK-30.24 Restyle Own card stats into one bordered row
```

Impact:

```txt
frontend: compact stats chrome, Own card divider
docs: lesson-flow Deck UI
backend / Prisma / GraphQL: unchanged
```

---

### DISC-022 Own cards need tighter chrome and a locked title slot

Status:

```txt
DONE
```

Conflicting sources (as found; fixed in TASK-30.25):

```txt
Product (approved in chat after 30.24):
  - Tighter vertical padding; muted compact Private/Public
  - Stats stay one bordered 3-col row; larger counts, smaller emoji; gray labels
  - Due chip left, Review → right when dueCount > 0
  - Title max 2 lines, ellipsis, fixed 2-line height; web tooltip; full title on detail
  - Equal card size in the grid. UI only

Was wrong:
  - Large gaps, accented badge, Start review label, title height followed content
```

Action:

```txt
TASK-30.25 Compact Own cards and lock the title slot
```

Impact:

```txt
frontend: Own card chrome, compact badge, Review CTA, title slot, web tooltip
docs: lesson-flow Deck UI
backend / Prisma / GraphQL: unchanged
```

---

### DISC-023 Own footer is not one clear row

Status:

```txt
DONE
```

Conflicting sources (as found; fixed in TASK-30.26):

```txt
Product (approved in chat after 30.25):
  - Footer is one nowrap row: Due left, Review → right
  - A bit more space between the stats box and the footer

Was wrong:
  - Footer sat tight under stats; Due and Review did not read as one line
```

Action:

```txt
TASK-30.26 Align Own card footer into one row
```

Impact:

```txt
frontend: Own footer row, stats-to-footer gap
docs: lesson-flow Deck UI
backend / Prisma / GraphQL: unchanged
```

---

### DISC-024 Home Due now is weak and START is gray

Status:

```txt
DONE
```

Conflicting sources (as found; fixed in TASK-30.27):

```txt
Product (approved in chat after 30.26):
  - Home matches Own-card chrome: Due now is the hero metric
  - One bordered 3-col 📖/✏️/✅ stats box
  - Full-width primary Start review → when dueCount > 0
  - Flag + add stay on the Home title row; same content width as other pages

Was wrong:
  - Three AppCards + “Due now: N” + gray START; extra native tab header
  - SoT said do not add a ready-count UI
```

Action:

```txt
TASK-30.27 Restyle Home around Due now and Start review
```

Impact:

```txt
frontend: Home screen, shared stats row, Home tab header
docs: lesson-flow Home UI, architecture flow, smoke Home labels
backend / Prisma / GraphQL: unchanged
```

---

### DISC-025 Profile is one long equal-weight form

Status:

```txt
DONE
```

Conflicting sources (as found; fixed in TASK-30.28):

```txt
Product (approved in chat after 30.27):
  - Four blocks: profile card, groups rows, preferences, reminders, account
  - Hide Role for USER; compact Groups/Invitations; review-size stepper
  - Autosave; no Save settings; no technical reminder/IANA copy
  - Web push: available in the mobile app. Log out is secondary text.

Was wrong:
  - One long form; Role: User; gray Log Out; Save settings; verbose help text
```

Action:

```txt
TASK-30.28 Group Profile into compact autosave settings
```

Impact:

```txt
frontend: Profile screen, settings fields, notifications row
docs: lesson-flow Profile UI
backend / Prisma / GraphQL: unchanged
```

---

### DISC-026 My Groups is two full-width buttons plus untitled cards

Status:

```txt
DONE
```

Conflicting sources (as found; fixed in TASK-30.29):

```txt
Product (approved in chat after 30.28):
  - Compact Create Group / Invitations action cards
  - Your Groups list of equal-height rows: name, description, member count,
    Owner/Member badge, avatar initials, chevron; ⋯ on owner rows
  - Seed several demo groups with mixed roles and sizes
  - Do not change group permission rules

Was wrong:
  - Two gray full-width AppButtons and a stack of name-only cards
```

Action:

```txt
TASK-30.29 Restyle My Groups into compact rows and seed demo groups
```

Impact:

```txt
frontend: My Groups screen, group list rows, action cards
api: myGroups exposes myRole, memberCount, membersPreview (no permission change)
seed: extra demo groups and fixture members
docs: lesson-flow Groups UI
```

---

### DISC-027 Group invitations is a verbose status card with a bare empty line

Status:

```txt
DONE
```

Conflicting sources (as found; fixed in TASK-30.30):

```txt
Product (approved in chat after 30.29):
  - Pending invitation cards: group name, invited by, member/deck counts
  - Accept primary, Decline secondary; card leaves the list on either action
  - Empty: envelope, No invitations, back to My Groups
  - Do not change invite/accept permission rules

Was wrong:
  - “Group invitation” + invited-as + status + expiry; confirm dialogs
  - Empty is only “You have no group invitations.”
  - Accept navigates to group detail
```

Action:

```txt
TASK-30.30 Restyle group invitations into pending cards and a clear empty state
```

Impact:

```txt
frontend: invitations screen and cards
api: myGroupInvitations exposes group name, inviter, counts (no permission change)
seed: pending invitation fixtures for the demo user
docs: lesson-flow Groups UI
```

---

### DISC-028 Create Group is two inputs and two full-width gray buttons

Status:

```txt
DONE
```

Conflicting sources (as found; fixed in TASK-30.31):

```txt
Product (approved in chat after 30.30):
  - Compact bordered form card, ~500–600px on desktop
  - Primary Create group; Cancel is text. Description is a textarea
  - Name 1–60, description up to 300. Create disabled while name is empty
  - Loading on submit; success goes to Group Detail
  - Short view-only copy under the title, not inside the form

Was wrong:
  - Loose inputs plus two large gray AppButtons; long view-only copy in the form
```

Action:

```txt
TASK-30.31 Restyle Create Group into a compact form card
```

Impact:

```txt
frontend: Create Group screen and GroupForm
api: create-group name/description max 60/300 (validation only)
docs: lesson-flow Groups UI
```

---

### DISC-029 Group screens hide Home / Decks / Profile tabs

Status:

```txt
DONE
```

Conflicting sources (as found; fixed in TASK-30.32):

```txt
Product (approved in chat after 30.31):
  - My Groups and Invitations keep the bottom tab bar
  - Same class of fix as owned/public decks inside (tabs)

Was wrong:
  - app/groups lives on the root stack, so /groups and /groups/invitations
    leave (tabs) and hide Home / Decks / Profile
```

Action:

```txt
TASK-30.32 Keep bottom tabs visible on group screens
```

Impact:

```txt
frontend: move groups routes under (tabs); hide groups as a tab
docs: lesson-flow Groups UI
```

---

### DISC-030 Edit Card is a tall stack of equal inputs and full-width gray buttons

Status:

```txt
DONE
```

Conflicting sources (as found; fixed in TASK-30.33):

```txt
Product (approved in chat after 30.32):
  - Compact form card (~600–700px): Front/Back single-line; Example/Notes textarea
  - Generate is a compact action next to Example; AI suggestions + Use selected
  - Save changes is primary blue; Cancel is text; Delete is a small Danger zone
  - Save disabled when nothing changed or Front/Back invalid
  - Unsaved changes: confirm before leaving

Was wrong:
  - Four equal multiline inputs; large Generate examples block
  - Save / Cancel / Delete Card as full-width gray/red buttons
```

Action:

```txt
TASK-30.33 Restyle Edit Card into a compact form with AI helper
```

Impact:

```txt
frontend: CardForm, AI example helper, Edit Card screen
docs: lesson-flow Edit Card UI
```

---

### DISC-031 Temporarily disable Profile Groups and Invitations

Status:

```txt
DONE
```

Conflicting sources (as found; fixed in TASK-30.34):

```txt
Product (approved in chat after 30.33):
  - Keep groups functionality
  - Disable Groups and Invitations buttons on Profile for now

Was wrong:
  - Profile Groups / Invitations rows still navigate
```

Action:

```txt
TASK-30.34 Disable Groups and Invitations on Profile
```

Impact:

```txt
frontend: Profile Groups/Invitations rows disabled
docs: lesson-flow Profile UI
```

---

### DISC-032 Edit Deck is a long form with two huge language fields

Status:

```txt
DONE
```

Conflicting sources (as found; fixed in TASK-30.35):

```txt
Product (approved in chat after 30.34):
  - Compact form card like Edit Card (~600–700px)
  - Description textarea; Languages is one pair block 🇪🇸 → 🇬🇧
  - Labels Target / Source, no (front)/(back)
  - Selector rows with chevron; language-change warning only when changing
  - Save changes primary, disabled when clean; Cancel is text

Was wrong:
  - Two large language fields with native+english names
  - Full-width gray Save/Cancel; same-language warning always on screen
```

Action:

```txt
TASK-30.35 Restyle Edit Deck into a compact form with a language pair
```

Impact:

```txt
frontend: DeckForm, Edit/Create/Assign deck screens
docs: lesson-flow Edit Deck UI
```

---

### DISC-033 Language pair arrow on deck forms is noise

Status:

```txt
DONE
```

Conflicting sources (as found; fixed in TASK-30.36):

```txt
Product (approved in chat after 30.35):
  - Remove the → between Target and Source on Create/Edit Deck

Was wrong:
  - Decorative → sat between two chevron selectors
```

Action:

```txt
TASK-30.36 Remove the language pair arrow from deck forms
```

Impact:

```txt
frontend: DeckForm language block
docs: lesson-flow Edit Deck UI
```

---

### DISC-034 Cards section is a bordered box with a duplicate Add card

Status:

```txt
DONE
```

Conflicting sources (as found; fixed in TASK-30.37):

```txt
Product (approved in chat after 30.36):
  - Cards is a section header with count and + Add card on the right
  - No outer border around the list; no full-width gray Add card
  - Empty: icon + No cards yet + hint. Remove the + next to Edit

Was wrong:
  - Bordered Cards box plus gray empty-state button plus header +
```

Action:

```txt
TASK-30.37 Restyle deck Cards into a header, count, and empty state
```

Impact:

```txt
frontend: CardList, DeckActions, deck detail
docs: lesson-flow deck detail
```

---

### DISC-035 Deck Detail stats icons differ from My Decks

Status:

```txt
DONE
```

Conflicting sources (as found; fixed in TASK-30.38):

```txt
Product (approved in chat after 30.37):
  - Deck Detail group stats use the same icons as My Decks: 📖 / ✏️ / ✅

Was wrong:
  - Deck Detail group tiles used 🌱 / 🔁 / ✅
```

Action:

```txt
TASK-30.38 Align Deck Detail stats icons with My Decks
```

Impact:

```txt
frontend: deck detail stats emojis
docs: lesson-flow deck detail
```

---

### DISC-036 Review is buttons, not a physical flashcard

Status:

```txt
DONE
```

Conflicting sources (as found; fixed in TASK-30.39):

```txt
Product (approved in chat after 30.38):
  - Centered flashcard; tap/click to flip (~200ms); no Reveal answer button
  - After reveal: swipe right Know, swipe left Don't know, short swipe-out
  - Compact fallback Know / Don't know buttons; Leave review is secondary text
  - Gestures off until reveal. SRS / submitReview / queue unchanged

Was wrong:
  - Prompt text plus Reveal answer and two large answer buttons
```

Action:

```txt
TASK-30.39 Make review a tap-to-flip card with swipe answers
```

Impact:

```txt
frontend: review flashcard, answer actions, review screen
docs: lesson-flow Review UI, architecture lesson flow
```

---

### DISC-037 Review card shows Front/Back and too much empty space

Status:

```txt
DONE
```

Conflicting sources (as found; fixed in TASK-30.40):

```txt
Product (approved in chat after 30.39):
  - UI shows question then answer from promptDirection; no Front/Back labels
  - After flip, only the opposite side (not both)
  - Card sits under the header, taller (~1.5–1.7 width:height), actions close below
  - Swipe hint under the card; hide after the first few answers

Was wrong:
  - Front/Back labels; prompt stayed visible after reveal
  - Card vertically centered in the viewport with a large empty band above it
```

Action:

```txt
TASK-30.40 Show question/answer only and tighten the review layout
```

Impact:

```txt
frontend: review flashcard, review screen, swipe-hint storage
docs: lesson-flow Review UI
```

---

### DISC-038 Deck card badges use To learn and the wrong icons

Status:

```txt
DONE
```

Conflicting sources (as found; fixed in TASK-30.41):

```txt
Product (approved in chat after 30.40):
  - Deck card-row badges: 📖 Learn, ✏️ Practiced, ✅ Learned
  - Same icons as My Decks / Deck Detail group stats

Was wrong:
  - Word-row badges: 🌱 To learn, 🔁 Practiced, ✅ Learned
```

Action:

```txt
TASK-30.41 Use Learn / Practiced / Learned icons on deck card badges
```

Impact:

```txt
frontend: learning-group badge emojis and labels
docs: lesson-flow deck card badges
```

---

### DISC-039 Card create does not refresh learning-stats counts

Status:

```txt
DONE
```

Conflicting sources (as found; fixed in TASK-30.42):

```txt
Product:
  - After add/delete card (and CSV import), deck detail Total/Due/groups and
    My Decks compact counts update without a full reload

Was wrong:
  - createCard/deleteCard/CSV only refetchQueries DeckCards
  - DeckLearningStats (detail + My Decks) stayed cached until reload
```

Action:

```txt
TASK-30.42 Refetch learning stats after card create and delete
```

Impact:

```txt
frontend: create/delete/CSV card cache refetch
docs: lesson-flow Deck UI, architecture Apollo notes
```

---

### DISC-040 Review complete has three equal buttons and a card count

Status:

```txt
DONE
```

Conflicting sources (as found; fixed in TASK-30.43):

```txt
Product (approved in chat after 30.42):
  - Narrow centered completion: icon, Nice work, success line, muted date
  - Start another review primary; Back to deck or Home secondary; All decks text
  - No Cards in this review. Home vs deck from session scope

Was wrong:
  - Three full-width AppButtons and Cards in this review: N
```

Action:

```txt
TASK-30.43 Simplify the review complete screen
```

Impact:

```txt
frontend: lesson summary screen
docs: lesson-flow summary UI
```

---

### DISC-041 Review complete leaves the tab navigator

Status:

```txt
DONE
```

Conflicting sources (as found; fixed in TASK-30.44):

```txt
Product (approved in chat after 30.43):
  - Completion screen shows bottom tabs (Home / Decks / Profile)
  - URLs stay /lessons/.../summary
  - Active review still hides the tab bar

Was wrong:
  - app/lessons is a root stack, so summary has no tab bar
```

Action:

```txt
TASK-30.44 Keep bottom tabs visible on review complete
```

Impact:

```txt
frontend: lessons routes under (tabs)
docs: lesson-flow Review complete UI
```

---

### DISC-042 Delete deck does not refresh Home counts

Status:

```txt
DONE
```

Conflicting sources (as found; fixed in TASK-30.45):

```txt
Product:
  - After delete deck, Home Due now / Learn / Practiced / Learned update without reload

Was wrong:
  - deleteDeck only refetchQueries MyDecks and DecksPage
  - HomeLearningProgress stayed cached
```

Action:

```txt
TASK-30.45 Refetch Home stats after deleting a deck
```

Impact:

```txt
frontend: delete deck cache refetch
docs: lesson-flow Deck UI, architecture Apollo notes
```

---

### DISC-043 Review session does not refresh Home or My Decks counts

Status:

```txt
DONE
```

Conflicting sources (as found; fixed in TASK-30.46):

```txt
Product:
  - After a review session, Home Due now / Learn / Practiced / Learned and
    My Decks deck stats update without reload

Was wrong:
  - completeLesson and abandonLesson did not refetch HomeLearningProgress
    or DeckLearningStats
```

Action:

```txt
TASK-30.46 Refetch Home and My Decks stats after a review session
```

Impact:

```txt
frontend: complete/abandon lesson cache refetch
docs: lesson-flow Deck UI, architecture Apollo notes
```

## Epic Rules

```txt
1. One task = one focused commit. Do not combine tasks.
2. Do not start the next task until the current task is Status DONE and committed.
3. Do not add features or drive-by refactors.
4. Do not implement an OPEN discrepancy without approval (chat or register Status: APPROVED).
5. After 30.01, follow docs/domain/lesson-flow.md as live SoT for lesson queue timing.
6. Backend is source of truth for the queue; frontend must not calculate it.
7. Do not change learning-steps formulas or promptDirection rules.
8. Do not weaken auth, permissions, or the security checklist.
9. Do not rewrite docs/tasks/done/* to erase history.
10. Append new discrepancies here; do not start a parallel epic for the same class of fix.
11. Each task’s Commands to Run must pass before commit. If blocked, stop and ask.
```

## Recommended Task Order

```txt
30.01                            SoT wording (docs + smoke)
30.02                            picker tests (answer-time freeze)
30.03                            Start + SubmitReview call timing
30.04                            review session / Повторення in UI and live docs
30.05                            local demo seed for queue QA
30.06                            unique card count on review summary (no attempt stats)
30.07                            Play start on own deck cards when due
30.08                            owner deck detail action hierarchy
30.09                            compact card rows, 1-based index, scrollbar inset
30.10                            compact deck detail stats and secondary actions
30.11                            deck detail sections, flags, zebra card list
30.12                            Play start, Delete button, Cards frame
30.13                            stats tiles, circled Play, word row borders
30.14                            stats center, Play hit, word inset, status pills
30.15                            group chrome, word inset 8px, bordered status pills
30.16                            status after title, stats label pills, More disabled
30.17                            stats tiles, header Start, status pill radius
30.18                            compact My Decks cards, center stats labels
30.19                            My Decks cards by section + group/public seed
30.20                            narrow rail cards to fit three
30.21                            wrap My Decks section cards into a grid
30.22                            stretch My Decks cards to fill the row
30.23                            restyle Own compact stats tiles
30.24                            restyle Own card stats into one bordered row
30.25                            compact Own cards and lock the title slot
30.26                            align Own card footer into one row
30.27                            restyle Home around Due now and Start review
30.28                            group Profile into compact autosave settings
30.29                            restyle My Groups into compact rows and seed demo groups
30.30                            restyle group invitations into pending cards and empty state
30.31                            restyle Create Group into a compact form card
30.32                            keep bottom tabs visible on group screens
30.33                            restyle Edit Card into a compact form with AI helper
30.34                            disable Groups and Invitations on Profile
30.35                            restyle Edit Deck into a compact form with a language pair
30.36                            remove the language pair arrow from deck forms
30.37                            restyle deck Cards into a header, count, and empty state
30.38                            align Deck Detail stats icons with My Decks
30.39                            make review a tap-to-flip card with swipe answers
30.40                            show question/answer only and tighten the review layout
30.41                            use Learn / Practiced / Learned icons on deck card badges
30.42                            refetch learning stats after card create and delete
30.43                            simplify the review complete screen
30.44                            keep bottom tabs visible on review complete
30.45                            refetch Home stats after deleting a deck
30.46                            refetch Home and My Decks stats after a review session
```

## Epic Summary

```md
- [x] TASK-30.01 Clarify show vs answer vs freeze-N in lesson-flow SoT
- [x] TASK-30.02 Freeze lesson-queue gap from answer-time candidates
- [x] TASK-30.03 Record queue showing after answer, not on display
- [x] TASK-30.04 Use review session and Повторення in UI and live docs
- [x] TASK-30.05 Seed lesson-queue QA decks for local demo
- [x] TASK-30.06 Show unique card count on review summary
- [x] TASK-30.07 Add Play start on own deck cards when due
- [x] TASK-30.08 Restructure owner deck detail actions
- [x] TASK-30.09 Compact card rows with 1-based index
- [x] TASK-30.10 Compact deck detail stats and secondary actions
- [x] TASK-30.11 Separate deck detail sections and tighten the card list
- [x] TASK-30.12 Play start, Delete button, and Cards frame
- [x] TASK-30.13 Restyle stats tiles, circled Play, and word borders
- [x] TASK-30.14 Center stats, isolate Play, inset words, pill badges
- [x] TASK-30.15 Align group chrome, tighten word inset, border status pills
- [x] TASK-30.16 Move status pills, pill stats labels, disable More
- [x] TASK-30.17 Restyle stats tiles, header Start, status pill radius
- [x] TASK-30.18 Compact My Decks cards and center stats labels
- [x] TASK-30.19 Differentiate My Decks cards by section
- [x] TASK-30.20 Narrow My Decks rail cards to fit three
- [x] TASK-30.21 Wrap My Decks section cards into a grid
- [x] TASK-30.22 Stretch My Decks cards to fill the row
- [x] TASK-30.23 Restyle Own compact stats tiles
- [x] TASK-30.24 Restyle Own card stats into one bordered row
- [x] TASK-30.25 Compact Own cards and lock the title slot
- [x] TASK-30.26 Align Own card footer into one row
- [x] TASK-30.27 Restyle Home around Due now and Start review
- [x] TASK-30.28 Group Profile into compact autosave settings
- [x] TASK-30.29 Restyle My Groups into compact rows and seed demo groups
- [x] TASK-30.30 Restyle group invitations into pending cards and a clear empty state
- [x] TASK-30.31 Restyle Create Group into a compact form card
- [x] TASK-30.32 Keep bottom tabs visible on group screens
- [x] TASK-30.33 Restyle Edit Card into a compact form with AI helper
- [x] TASK-30.34 Disable Groups and Invitations on Profile
- [x] TASK-30.35 Restyle Edit Deck into a compact form with a language pair
- [x] TASK-30.36 Remove the language pair arrow from deck forms
- [x] TASK-30.37 Restyle deck Cards into a header, count, and empty state
- [x] TASK-30.38 Align Deck Detail stats icons with My Decks
- [x] TASK-30.39 Make review a tap-to-flip card with swipe answers
- [x] TASK-30.40 Show question/answer only and tighten the review layout
- [x] TASK-30.41 Use Learn / Practiced / Learned icons on deck card badges
- [x] TASK-30.42 Refetch learning stats after card create and delete
- [x] TASK-30.43 Simplify the review complete screen
- [x] TASK-30.44 Keep bottom tabs visible on review complete
- [x] TASK-30.45 Refetch Home stats after deleting a deck
- [x] TASK-30.46 Refetch Home and My Decks stats after a review session
```

---

# TASK-30.01 Clarify show vs answer vs freeze-N in lesson-flow SoT

## Status

DONE

## Context

DISC-001: live SoT already says freeze N after answering, but still talks about “showing” for gap fill and never states that display is not an answer. Agents and tests treated returning a card as a showing. Make the three steps explicit, including the A/B/C/D timeline, before changing picker tests or use cases.

## Goal

A reader of live SoT cannot conclude that displaying a card increments showCount or freezes gap N.

## Related Documents

```txt
docs/tasks/30-sot-discrepancies.md
docs/domain/lesson-flow.md
docs/architecture.md
docs/backend-clean-architecture.md
docs/smoke/lesson-queue.md
docs/tasks/done/29-lesson-queue.md
```

## Files to Create

```txt
None
```

## Files to Modify

```txt
docs/domain/lesson-flow.md
docs/architecture.md
docs/backend-clean-architecture.md
docs/smoke/lesson-queue.md
docs/tasks/30-sot-discrepancies.md
```

## Requirements

```txt
1. In lesson-flow.md, state explicitly:
   - Display (returning nextCard / first card) is not an answer.
   - Display does not increment showCount and does not freeze N.
   - After Know / Don’t know: persist learning-steps, then increment showCount for the
     answered cardId, then freeze N from other cards that are ready AND showable at that moment.
   - Gap fill = another card was answered (a completed showing), not merely displayed.
2. Include the timeline example:
   Show A at 18:00 with only B ready; C due 18:00:20; D due 18:00:35;
   answer A at 18:00:40 → others B,C,D → N = 3 → A → B → C → D → A repeat.
3. Keep max 3, shrink-to-0, primary vs repeat, Home snapshot vs Deck live, owner-only deck start.
4. architecture.md section 14 and backend-clean-architecture lesson-queue bullets must match.
5. Add one smoke line in docs/smoke/lesson-queue.md: display ≠ answer ≠ freeze N; late-due
   cards at answer time count toward N. Do not rewrite the whole smoke file.
6. Point lesson-flow.md related task files at this epic as well as EPIC-29.
7. Do not rewrite docs/tasks/done/* or EPIC-29 task logs.
8. Mark TASK-30.01 done in this file’s Epic Summary. Leave DISC-001 APPROVED until 30.03.
```

## Security Requirements

```txt
- Docs-only. Do not weaken permissions.
- Do not commit secrets.
```

## Architecture Constraints

```txt
- This task is documentation only.
- Backend remains SoT for queue; frontend must not calculate gap or showCount.
```

## Implementation Notes

```txt
- Copy the product decision from DISC-001 into lesson-flow.md in product language.
- Do not describe the current (wrong) call sites as the intended behavior.
```

## Acceptance Criteria

```txt
- Display, answer, and freeze N are three distinct steps in live SoT.
- The A/B/C/D answer-time N=3 example is in lesson-flow.md.
- architecture.md and backend-clean-architecture.md do not contradict that timing.
- docs/smoke/lesson-queue.md has a check that N is frozen at answer time.
- pnpm docs:lint and pnpm format:check pass.
```

## Commands to Run

```bash
pnpm format:check
pnpm docs:lint
```

## Manual Checks

```txt
None
```

## Do Not Do

```txt
- Do not change application code.
- Do not implement the picker or use-case timing yet.
- Do not add a fourth task or extra smoke files.
```

## Expected Commit Message

```txt
TASK-30.01 Clarify show vs answer vs freeze-N in lesson-flow SoT
```

---

# TASK-30.02 Freeze lesson-queue gap from answer-time candidates

## Status

DONE

## Context

`recordLessonCardShowing` already freezes N from the candidate list passed at call time, but tests describe that call as a display. DISC-001 needs an explicit answer-time case: cards that were not due at display but are due at answer must count toward N.

## Goal

Picker unit tests treat `recordLessonCardShowing` as an answer event and cover late-due others (C/D) so N is computed from candidates at answer time.

## Related Documents

```txt
docs/tasks/30-sot-discrepancies.md
docs/domain/lesson-flow.md
docs/backend-clean-architecture.md
```

## Files to Create

```txt
None
```

## Files to Modify

```txt
apps/api/src/modules/lessons/domain/services/select-next-lesson-card.ts
apps/api/src/modules/lessons/domain/services/select-next-lesson-card.spec.ts
```

Rename-only imports (no call-timing change) if the function is renamed:

```txt
apps/api/src/modules/lessons/application/use-cases/start-lesson.use-case.ts
apps/api/src/modules/lessons/application/use-cases/start-lesson.use-case.spec.ts
apps/api/src/modules/lessons/application/use-cases/start-home-lesson.use-case.ts
apps/api/src/modules/lessons/application/use-cases/start-home-lesson.use-case.spec.ts
apps/api/src/modules/lessons/application/use-cases/submit-review.use-case.ts
apps/api/src/modules/lessons/application/use-cases/submit-review.use-case.spec.ts
```

## Requirements

```txt
1. Keep freeze / fill / shrink / max-3 / primary-vs-repeat / Home vs Deck membership.
   Only clarify that record runs on answer, not on display.
2. Candidates passed into record are the ready+showable list at answer time (caller supplies them).
3. Add a test for the DISC-001 timeline:
   At display of A only B is due; at answer of A, candidates are B, C, D (all ready+showable).
   After recording A, N = 3. Sequence of later answers B, C, D then A is showable as a repeat.
4. Add a contrast test: if A is recorded with only B in candidates, N = 1 even if C and D
   appear later in selectNextLessonCard candidates. N does not grow after freeze.
5. Existing tests that call record must be readable as answer events (names/comments), not display.
6. Optional rename: recordLessonCardShowing → recordLessonCardAnswer (and input type).
   If renamed, update imports only. Do not change Start/SubmitReview call timing in this task.
7. Do not freeze N inside selectNextLessonCard. Picking the next card is not an answer.
```

## Security Requirements

```txt
- Domain-only. No auth change.
- Do not commit secrets.
```

## Architecture Constraints

```txt
- Domain must not import NestJS, Prisma, or GraphQL.
- Do not move this logic into packages/srs or GraphQL resolvers.
```

## Implementation Notes

```txt
- Caller still supplies the ready candidate list; the picker does not query the database.
- If the rename makes 30.03 diffs smaller, do it here; otherwise keep the name.
```

## Acceptance Criteria

```txt
- Late-due C/D at answer time freeze N = 3 for A.
- Recording with only B freezes N = 1; later-ready C/D do not raise that N.
- Picker tests pass.
- API builds.
```

## Commands to Run

```bash
pnpm --filter @flashcards/api test -- select-next-lesson-card
pnpm --filter @flashcards/api build
pnpm format:check
pnpm lint
```

## Manual Checks

```txt
None
```

## Do Not Do

```txt
- Do not change Start/SubmitReview when they call record (except a rename import).
- Do not change Prisma, GraphQL, or frontend.
- Do not change learning-steps formulas.
```

## Expected Commit Message

```txt
TASK-30.02 Freeze lesson-queue gap from answer-time candidates
```

---

# TASK-30.03 Record queue showing after answer, not on display

## Status

DONE

## Context

Start records the first returned card as a showing. SubmitReview records `nextCard`, not the card that was just answered. DISC-001: persist empty `showCounts` on start; after learning-steps on submit, record the answered card with current ready+showable candidates, then pick nextCard without recording that display.

## Goal

Queue state advances only when a card is answered. Displaying the first or next card does not increment showCount or freeze N.

## Related Documents

```txt
docs/tasks/30-sot-discrepancies.md
docs/domain/lesson-flow.md
docs/algorithms/learning-steps.md
docs/security/security-checklist.md
```

## Files to Create

```txt
None
```

## Files to Modify

```txt
apps/api/src/modules/lessons/application/use-cases/start-lesson.use-case.ts
apps/api/src/modules/lessons/application/use-cases/start-lesson.use-case.spec.ts
apps/api/src/modules/lessons/application/use-cases/start-home-lesson.use-case.ts
apps/api/src/modules/lessons/application/use-cases/start-home-lesson.use-case.spec.ts
apps/api/src/modules/lessons/application/use-cases/submit-review.use-case.ts
apps/api/src/modules/lessons/application/use-cases/submit-review.use-case.spec.ts
docs/tasks/30-sot-discrepancies.md
```

## Requirements

```txt
1. StartLessonUseCase and StartHomeLessonUseCase:
   - Persist createLessonQueueState (empty showCounts, empty pendingRepeats).
   - selectNextLessonCard for the first card.
   - Return that card without calling recordLessonCardShowing / recordLessonCardAnswer.
2. SubmitReviewUseCase, after calculateNextLearningState and persisting the review row
   and CardReviewState:
   - Load ready+showable candidates at answer time (now / reviewedAt), same membership
     rules as today (Deck live; Home snapshot ∩ ready own cards).
   - Record the answered cardId with those candidates (increment showCount, freeze N,
     fill other cards’ gaps).
   - Then selectNextLessonCard on the updated state.
   - Persist queueState.
   - Return nextCard without recording that card as a showing.
3. If nextCard is null, still persist the answered-card queueState.
4. Skip / exclude deleted or inaccessible cards as today; that is not a showing.
5. Tests to update:
   - Start specs must not expect showCount 1 for the first returned card.
   - Submit specs that seed “card already shown on start” must seed empty (or zero)
     showCounts for a displayed-but-unanswered card.
   - After answering A, showCounts[A] === 1 and nextCard is not yet in showCounts.
   - Late-due others at answer time: answering A with B,C,D ready freezes N = 3.
   - Answering B fills A’s gap by 1 (display of B without submit does not).
6. Keep session ownership, ACTIVE, blocked-user, and card-in-scope checks.
7. Mark TASK-30.03 and DISC-001 DONE in this epic file when finished.
```

## Security Requirements

```txt
- Session must belong to the current user and be ACTIVE.
- Blocked users rejected.
- Do not leak other users’ cards.
- Frontend visibility is not security.
```

## Architecture Constraints

```txt
- Use case must not import Prisma or GraphQL.
- Queue math stays in the lessons domain picker.
- Do not compute gap or showCount on the client.
```

## Implementation Notes

```txt
- Load candidates after the answered card’s new dueAt is persisted so A is only
  “ready” if learning-steps still say dueAt <= now. A is excluded from N as the
  answered card regardless.
- C and D that became due between display of A and submit of A must be in the
  candidate list passed to record.
- Frontend still calls completeLesson when nextCard is null.
```

## Acceptance Criteria

```txt
- Start does not increment showCount for the first card.
- Submit records the answered card, not nextCard.
- N uses other ready+showable cards at answer time (late-due C/D included).
- Start and SubmitReview specs pass; API builds.
```

## Commands to Run

```bash
pnpm --filter @flashcards/api test -- start-lesson.use-case
pnpm --filter @flashcards/api test -- start-home-lesson.use-case
pnpm --filter @flashcards/api test -- submit-review.use-case
pnpm --filter @flashcards/api build
pnpm format:check
pnpm lint
```

## Manual Checks

```txt
None (human smoke stays in docs/smoke/lesson-queue.md after 30.01).
```

## Do Not Do

```txt
- Do not change Prisma schema or GraphQL contracts.
- Do not change frontend.
- Do not change learning-steps formulas or promptDirection.
- Do not add wait/countdown UI or in-lesson progress.
```

## Expected Commit Message

```txt
TASK-30.03 Record queue showing after answer, not on display
```

---

# TASK-30.04 Use review session and Повторення in UI and live docs

## Status

DONE

## Context

DISC-002: product name is review session / Повторення. UI and live docs still said Lesson / Урок. Queue “repeat” (another answer of the same cardId) must stay distinct from the session name.

## Goal

User-facing copy and live SoT say review session / Повторення. Code identifiers stay Lesson / StudySession / lessonSize.

## Related Documents

```txt
docs/tasks/30-sot-discrepancies.md
docs/domain/lesson-flow.md
docs/architecture.md
docs/domain/permissions.md
docs/smoke/lesson-queue.md
```

## Files to Create

```txt
None
```

## Files to Modify

```txt
apps/mobile/src/i18n/resources/en/lessons.ts
apps/mobile/src/i18n/resources/uk/lessons.ts
apps/mobile/src/i18n/resources/en/home.ts
apps/mobile/src/i18n/resources/uk/home.ts
apps/mobile/src/i18n/resources/en/decks.ts
apps/mobile/src/i18n/resources/uk/decks.ts
apps/mobile/src/i18n/resources/en/settings.ts
apps/mobile/src/i18n/resources/uk/settings.ts
docs/domain/lesson-flow.md
docs/architecture.md
docs/backend-clean-architecture.md
docs/domain/permissions.md
docs/smoke/lesson-queue.md
docs/release/mvp-smoke-tests.md
docs/tasks/30-sot-discrepancies.md
```

## Requirements

```txt
1. UI uk: Повторення, not Урок. Completion title exactly: Повторення завершено.
2. UI en: Review / review session, not Lesson. Completion title: Review complete.
3. Settings lessonSize label: Розмір повторення / Review size (field name stays lessonSize).
4. Live SoT: product model is review session / Повторення. Add a terminology note
   that technical Lesson* names stay, and queue repeat ≠ session name.
5. Do not rename GraphQL, Prisma, use cases, or routes.
6. Do not rewrite docs/tasks/done/*.
7. Mark TASK-30.04 and DISC-002 DONE in this epic file.
```

## Security Requirements

```txt
- Copy-only / docs. Do not weaken permissions.
- Do not commit secrets.
```

## Architecture Constraints

```txt
- Frontend must not start calculating the queue.
- Backend identifiers may stay Lesson / StudySession.
```

## Implementation Notes

```txt
- Keep i18n keys (lessons.summary.completeTitle, decks.deckDetail.startLesson).
- Change values only.
```

## Acceptance Criteria

```txt
- No user-facing Урок / Lesson for the session (en/uk i18n).
- Summary title is Повторення завершено / Review complete.
- lesson-flow.md states the product terminology.
- Mobile typecheck, format:check, and docs:lint pass.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm format:check
pnpm docs:lint
```

## Manual Checks

```txt
None (smoke i18n checklist updated for human QA).
```

## Do Not Do

```txt
- Do not rename Lesson / StudySession / lessonSize in code.
- Do not change queue repeat-gap rules.
- Do not change learning-steps formulas.
```

## Expected Commit Message

```txt
TASK-30.04 Use review session and Повторення in UI and live docs
```

---

# TASK-30.05 Seed lesson-queue QA decks for local demo

## Status

DONE

## Context

Local QA of the lesson queue needs G1 / G2 / Q / S, lessonSize 5, active target es, and CardReviewState so Home and deck Start are visible. The previous demo seed only created language-less Demo Spanish Basics / Demo Public Phrases.

This is a local fixture follow-up, not a SoT discrepancy. Keep it in this epic so queue QA work stays in one place.

## Goal

`pnpm --filter @flashcards/api db:seed` leaves the demo user ready for Home snapshot and deck-queue checks.

## Related Documents

```txt
docs/tasks/30-sot-discrepancies.md
docs/smoke/lesson-queue.md
docs/domain/lesson-flow.md
docs/security/security-checklist.md
```

## Files to Create

```txt
None
```

## Files to Modify

```txt
apps/api/prisma/seed.ts
docs/tasks/30-sot-discrepancies.md
```

## Requirements

```txt
1. Keep demo@example.com and the two language-less demo decks (they must not
   join the Spanish Home snapshot).
2. Seed private decks G1, G2, Q, S with targetLanguage es and sourceLanguage en.
3. G1 cards in createdAt order: apple, bread, cheese, milk, wine, oil, salt.
4. G2: dog/perro. Q: river/río and forest/bosque only. S: one/uno.
5. Demo settings: lessonSize 5, nativeLanguage en, activeTargetLanguage es,
   plus UserStudyLanguage es.
6. Create initial CardReviewState (step 0, due in the past) for those decks so
   dueCount > 0 and Start is shown.
7. Keep the existing production seed guard. Do not add migrate reset as a script.
8. Mark TASK-30.05 DONE in this file’s Epic Summary.
```

## Security Requirements

```txt
- Do not commit real secrets or DATABASE_URL.
- Demo password may stay as the existing local-only seed credential.
- Do not add prisma migrate reset as a package script.
```

## Architecture Constraints

```txt
- Seed may use Prisma directly (it is not a GraphQL/use-case path).
- Do not change queue picker, StartLesson, or learning-steps.
```

## Implementation Notes

```txt
- Stagger G1–S card createdAt so Home snapshot of 5 is apple…wine.
- createMany CardReviewState with skipDuplicates so re-seed is safe.
```

## Acceptance Criteria

```txt
- After seed, Мої for Spanish shows G1, G2, Q, S with due counts 7 / 1 / 2 / 1.
- Demo decks remain under Без мови.
- format:check and docs:lint pass.
```

## Commands to Run

```bash
pnpm format:check
pnpm docs:lint
```

## Manual Checks

```txt
- Local: pnpm --filter @flashcards/api db:seed, then Мої shows G1–S for es.
```

## Do Not Do

```txt
- Do not seed mountain/sea on Q.
- Do not run migrate reset against any non-local database.
- Do not change GraphQL or Prisma schema.
- Do not start a new epic for this fixture.
```

## Expected Commit Message

```txt
TASK-30.05 Seed lesson-queue QA decks for local demo
```

---

# TASK-30.06 Show unique card count on review summary

## Status

DONE

## Context

DISC-003: after a Home review with 5 unique cards and repeats, the summary showed Cards in this review: 9, Reviewed: 9, Know / Don't know, and Known %. Those numbers are attempts. Product wants only unique answered cards and no attempt stats.

## Goal

Review complete shows title, Nice work, completedAt, and Cards in this review: N where N is unique answered cardIds. Buttons stay as today.

## Related Documents

```txt
docs/tasks/30-sot-discrepancies.md
docs/domain/lesson-flow.md
docs/architecture.md
docs/smoke/lesson-queue.md
docs/security/security-checklist.md
```

## Files to Create

```txt
None
```

## Files to Modify

```txt
apps/mobile/src/features/lessons/types/active-lesson.ts
apps/mobile/src/features/lessons/screens/lesson-review-screen.tsx
apps/mobile/src/features/lessons/screens/lesson-summary-screen.tsx
docs/domain/lesson-flow.md
docs/architecture.md
docs/smoke/lesson-queue.md
docs/release/mvp-smoke-tests.md
docs/tasks/30-sot-discrepancies.md
```

## Requirements

```txt
1. Persist uniqueCardCount on LessonCompletion from reviewedCardIds.length before
   clearActiveLesson. Do not use completeLesson.totalCards or reviewedCards for N.
2. Summary layout: completeTitle, then Nice work, then completedAt, then
   Cards in this review: uniqueCardCount.
3. Remove Reviewed, Know, Don't know, and Known % from the summary screen.
4. Do not change Start another review / Home / Back to deck / Back to decks.
5. Do not change CompleteLessonUseCase, Prisma, or GraphQL schema/resolvers.
6. Live SoT: UI summary unique count; API knownCount/dontKnowCount remain attempts
   but are not shown. Update architecture.md result-screen bullet and smoke checks.
7. Do not rewrite docs/tasks/done/*.
8. Mark TASK-30.06 and DISC-003 DONE in this epic file.
```

## Security Requirements

```txt
- Do not weaken permissions.
- Do not commit secrets.
- Frontend unique count is UX only; backend remains SoT for queue and reviews.
```

## Architecture Constraints

```txt
- Frontend must not calculate learning-steps, dueAt, or the lesson queue.
- Unique card count may be derived from client reviewedCardIds for this screen.
- Do not add a new GraphQL field in this task.
```

## Implementation Notes

```txt
- reviewedCardIds already skips duplicate cardIds.
- Keep unused completeLesson fields in the GraphQL query if already requested.
- Keep unused i18n keys unless this screen was their only use and removal is smaller.
```

## Acceptance Criteria

```txt
- Summary shows unique answered cards, not attempts.
- Attempt stats are not on the summary screen.
- Navigation buttons unchanged.
- API is unchanged.
- Mobile typecheck, format:check, and docs:lint pass.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm format:check
pnpm docs:lint
```

## Manual Checks

```txt
None (human QA after this commit: Home snapshot of 5 with repeats → N is 5).
```

## Do Not Do

```txt
- Do not change the backend completeLesson payload.
- Do not add countdown, in-lesson progress, or new summary stats.
- Do not change queue picker or learning-steps.
- Do not push.
```

## Expected Commit Message

```txt
TASK-30.06 Show unique card count on review summary
```

---

# TASK-30.07 Add Play start on own deck cards when due

## Status

DONE

## Context

DISC-004: Own cards on My Decks show Due but Start exists only on deck detail. Product: Play bottom-right when dueCount > 0; tap card still opens detail; Play starts the same owner deck review as deck detail.

## Goal

Own deck cards with dueCount > 0 show a Play control that starts `/lessons/start?deckId=`. Group, Public, and No language cards do not. Live SoT matches this code.

## Related Documents

```txt
docs/tasks/30-sot-discrepancies.md
docs/domain/lesson-flow.md
docs/architecture.md
docs/algorithms/learning-steps.md
docs/smoke/lesson-queue.md
docs/security/security-checklist.md
```

## Files to Create

```txt
apps/mobile/src/features/decks/components/deck-start-play-button.tsx
```

## Files to Modify

```txt
apps/mobile/src/features/decks/components/deck-list-item.tsx
docs/domain/lesson-flow.md
docs/architecture.md
docs/algorithms/learning-steps.md
docs/smoke/lesson-queue.md
docs/tasks/30-sot-discrepancies.md
```

## Requirements

```txt
1. Own section only (showLearningCounters). Play bottom-right when dueCount > 0.
2. Tap card → existing deck detail href. Tap Play → /lessons/start?deckId= (same as
   deck detail Start). Play must not open detail.
3. dueCount = 0 → no Play. Group / Public / No language → no Play.
4. Reuse deckLearningStats dueCount (Apollo cache ok). Accessibility label = startLesson i18n.
5. Do not change StartLessonUseCase, GraphQL, or deck detail Start rules.
6. After implementation, update live SoT that contradicts this entry point. Code is SoT.
   Point lesson-steps lesson-selection leftovers at lesson-flow.md if they still say
   deck sessions stop at lessonSize. Do not rewrite docs/tasks/done/*.
7. Mark TASK-30.07 and DISC-004 DONE in this epic file.
```

## Security Requirements

```txt
- Play is UX only. Backend still requires ownership for startLesson.
- Do not commit secrets.
```

## Architecture Constraints

```txt
- Frontend must not calculate the queue or learning-steps.
- Do not start public/group originals from this control.
```

## Implementation Notes

```txt
- Keep Play a sibling of the card Pressable (absolute), not a nested child, so taps do not
  bubble to detail.
- Ionicons play; match due-count blue if possible.
```

## Acceptance Criteria

```txt
- Own + due > 0 shows Play; due = 0 does not.
- Play starts the deck review without opening detail first.
- Card tap still opens detail.
- Live docs describe both Play and deck-detail Start.
- Mobile typecheck, format:check, and docs:lint pass.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm format:check
pnpm docs:lint
```

## Manual Checks

```txt
None (human: Own G1 with Due → Play; tap card vs tap Play).
```

## Do Not Do

```txt
- Do not add Play to Group, Public, or No language cards.
- Do not change Home START.
- Do not change the backend.
- Do not push.
```

## Expected Commit Message

```txt
TASK-30.07 Add Play start on own deck cards when due
```

---

# TASK-30.08 Restructure owner deck detail actions

## Status

DONE

## Context

DISC-005: owner deck detail is a stack of equally weighted buttons. Product wants one primary Start review, labeled quick actions, rare actions in More, and Delete in a danger zone. Not icon-only for Publish / CSV / Regenerate.

## Goal

Owner deck detail: Header + More, stats, Start review, Edit / Add card, Danger zone Delete. More holds CSV, regenerate, publish/unpublish. Non-owner copy flow unchanged.

## Related Documents

```txt
docs/tasks/30-sot-discrepancies.md
docs/domain/lesson-flow.md
docs/domain/permissions.md
docs/security/security-checklist.md
```

## Files to Create

```txt
apps/mobile/src/features/decks/components/deck-more-menu.tsx
```

## Files to Modify

```txt
apps/mobile/src/features/decks/components/deck-header.tsx
apps/mobile/src/features/decks/components/deck-actions.tsx
apps/mobile/src/features/decks/screens/deck-detail-screen.tsx
apps/mobile/src/features/lessons/components/deck-learning-stats-card.tsx
apps/mobile/src/i18n/resources/en/decks.ts
apps/mobile/src/i18n/resources/uk/decks.ts
docs/domain/lesson-flow.md
docs/tasks/30-sot-discrepancies.md
```

## Requirements

```txt
1. Header: title, language pair, Private/Public badge, ⋯ More (owner only).
2. Drop duplicate cardCount from header (total stays on stats).
3. Stats card is stats only. Start review is the primary below it, owner + dueCount > 0.
4. Quick actions: Edit and Add card, labeled (icon+label ok). Not icon-only.
5. More menu (labeled items): Import CSV, Regenerate translations (when languages exist),
   Publish / Make private. Same confirms and language gate as today.
6. Assign languages remains a visible CTA when the deck has no languages. Not in More.
7. Delete deck in a Danger zone at the bottom of owner actions, still confirm-destructive.
8. Non-owner: GroupDeckCopyActions only. No More / Delete / Start.
9. Keep pending-moderation copy visible when relevant.
10. Update live SoT Deck UI to this hierarchy. Code is SoT. Do not rewrite docs/tasks/done/*.
11. Mark TASK-30.08 and DISC-005 DONE.
```

## Security Requirements

```txt
- Hidden More items are UX only. Backend still enforces owner/publish/delete.
- Do not commit secrets.
```

## Architecture Constraints

```txt
- Do not change GraphQL or use cases.
- Frontend must not calculate the lesson queue.
```

## Implementation Notes

```txt
- Use a Modal or equivalent so More is not clipped by the card list.
- Reuse existing publish / unpublish / regenerate / CSV handlers.
```

## Acceptance Criteria

```txt
- Owner detail is not a flat button stack.
- Start is the only primary; hidden when dueCount = 0.
- CSV / regenerate / publish are in More with labels.
- Delete is separate from More and quick actions.
- Mobile typecheck, format:check, and docs:lint pass.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm format:check
pnpm docs:lint
```

## Manual Checks

```txt
None (human: owner G1 detail — Start, Edit, Add card, More, Delete).
```

## Do Not Do

```txt
- Do not replace rare actions with unlabeled icons.
- Do not change public deck detail or Home START.
- Do not change the backend.
- Do not push.
```

## Expected Commit Message

```txt
TASK-30.08 Restructure owner deck detail actions
```

---

# TASK-30.09 Compact card rows with 1-based index

## Status

DONE

## Context

DISC-006: card rows show #0, Edit/Delete as large buttons under the text, and content sits against the scrollbar. Product: 1-based display, icon actions on the right, extra list inset. UI only.

## Goal

Owner (and public) card rows display #{position + 1}. Owner actions are edit/delete icons on the right. Card lists have padding away from the scrollbar.

## Related Documents

```txt
docs/tasks/30-sot-discrepancies.md
docs/domain/lesson-flow.md
docs/security/security-checklist.md
```

## Files to Create

```txt
None
```

## Files to Modify

```txt
apps/mobile/src/features/decks/components/card-list.tsx
apps/mobile/src/features/decks/components/card-list-item.tsx
apps/mobile/src/features/public-decks/screens/public-deck-detail-screen.tsx
docs/domain/lesson-flow.md
docs/tasks/30-sot-discrepancies.md
```

## Requirements

```txt
1. Show #{card.position + 1}. Do not change stored position or GraphQL.
2. Owner Edit / Delete: icons on the right (create-outline, trash-outline), a11y labels.
   Delete still uses the existing confirm flow. Not unlabeled mystery for rare deck actions.
3. Add paddingRight on the card list so badges/icons are not flush with the scrollbar.
4. Public deck detail uses the same 1-based display (no owner icons there).
5. Update live SoT card-row note if needed. Do not rewrite docs/tasks/done/*.
6. Mark TASK-30.09 and DISC-006 DONE.
```

## Security Requirements

```txt
- Hidden icon labels are UX only; delete still confirms. Backend enforces owner.
- Do not commit secrets.
```

## Architecture Constraints

```txt
- UI only. Do not change Prisma, GraphQL, or use cases.
```

## Implementation Notes

```txt
- Keep example text under front/back on the left.
- Badge stays top-right; icons under or beside it on the right column.
```

## Acceptance Criteria

```txt
- First card shows #1.
- Owner rows use icon Edit/Delete on the right.
- List is not flush against the scrollbar.
- API unchanged.
- Mobile typecheck, format:check, and docs:lint pass.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm format:check
pnpm docs:lint
```

## Manual Checks

```txt
None (human: G1 card list #1… and icons).
```

## Do Not Do

```txt
- Do not reindex cards in the database.
- Do not change Home START or deck More menu.
- Do not push.
```

## Expected Commit Message

```txt
TASK-30.09 Compact card rows with 1-based index
```

---

# TASK-30.10 Compact deck detail stats and secondary actions

## Status

DONE

## Context

DISC-007: after 30.08 the owner deck detail still shows stacked stat lines, labeled Edit/Add, header More, and a large red Delete. Product wants a compact stats layout and icon secondary actions, with Delete as a compact Danger zone row.

## Goal

Owner deck detail: compact stats (Total | Due now; three learning groups in one row), Start review as the only large primary, Edit / Add / More as icon buttons, Delete as a compact labeled Danger zone row.

## Related Documents

```txt
docs/tasks/30-sot-discrepancies.md
docs/domain/lesson-flow.md
docs/security/security-checklist.md
```

## Files to Create

```txt
None
```

## Files to Modify

```txt
apps/mobile/src/features/lessons/components/deck-learning-stats-card.tsx
apps/mobile/src/features/decks/components/deck-actions.tsx
apps/mobile/src/features/decks/screens/deck-detail-screen.tsx
apps/mobile/src/i18n/resources/en/lessons.ts
apps/mobile/src/i18n/resources/uk/lessons.ts
docs/domain/lesson-flow.md
docs/tasks/30-sot-discrepancies.md
```

## Requirements

```txt
1. Stats card layout:
   - Top: Total left, Due now right (space-between), emoji + count + short label
   - Bottom: To learn, Practiced, Learned in one row; emoji + count on top, short
     label below (reuse learning-group names)
   - Keep next-review / none-due as a footer under the grid
2. Start review stays a full-width primary below stats, owner + dueCount > 0 only.
3. Owner secondary row: icon Edit, icon Add card, icon More (move More off the header).
   Accessibility labels required. More menu items stay labeled (CSV, regenerate, publish).
4. Delete deck: compact Danger zone row (trash icon + label), not a large red button.
   Keep confirmDestructiveAction. Do not put Delete in More.
5. Assign languages stays a visible labeled CTA when the deck has no languages.
6. Non-owner copy flow unchanged. Public deck detail unchanged. GraphQL unchanged.
7. Update live SoT Deck UI. Code is SoT. Do not rewrite docs/tasks/done/*.
8. Mark TASK-30.10 and DISC-007 DONE.
```

## Security Requirements

```txt
- Hidden icon labels are UX only. Backend still enforces owner/publish/delete.
- Delete still confirms. Do not commit secrets.
```

## Architecture Constraints

```txt
- UI only. Do not change Prisma, GraphQL, or use cases.
- Frontend must not calculate the lesson queue.
```

## Implementation Notes

```txt
- Short labels: Total / Due now (en) and Усього / Зараз (uk). Full sentences stay
  on accessibilityLabel.
- Group emojis: Total 📚, Due now ⏰, To learn 🌱, Practiced 🔁, Learned ✅.
```

## Acceptance Criteria

```txt
- Stats are not a stacked five-line list.
- Start review is the only large primary.
- Edit / Add / More are icons; More items stay labeled.
- Delete is a compact Danger zone row with confirm.
- Mobile typecheck, format:check, and docs:lint pass.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm format:check
pnpm docs:lint
```

## Manual Checks

```txt
None (human: owner G1 detail — stats, Start, icons, compact Delete).
```

## Do Not Do

```txt
- Do not put Delete in More.
- Do not change public deck detail or Home START.
- Do not change the backend.
- Do not push.
```

## Expected Commit Message

```txt
TASK-30.10 Compact deck detail stats and secondary actions
```

---

# TASK-30.11 Separate deck detail sections and tighten the card list

## Status

DONE

## Context

DISC-008: Next review contradicts Due now; Danger zone reads as the word-list header; flags sit under the deck title; card rows look identical with large gaps.

## Goal

Owner deck detail: no Next review line; flags beside “Deck Detail”; Danger zone in its own tinted card; Cards heading; even/odd zebra rows with tighter spacing.

## Related Documents

```txt
docs/tasks/30-sot-discrepancies.md
docs/domain/lesson-flow.md
docs/security/security-checklist.md
```

## Files to Create

```txt
None
```

## Files to Modify

```txt
apps/mobile/src/features/lessons/components/deck-learning-stats-card.tsx
apps/mobile/src/features/decks/components/deck-actions.tsx
apps/mobile/src/features/decks/components/deck-header.tsx
apps/mobile/src/features/decks/components/card-list.tsx
apps/mobile/src/features/decks/components/card-list-item.tsx
apps/mobile/src/features/decks/screens/deck-detail-screen.tsx
apps/mobile/src/ui/components/page-title.tsx
apps/mobile/src/i18n/resources/en/decks.ts
apps/mobile/src/i18n/resources/uk/decks.ts
docs/domain/lesson-flow.md
docs/tasks/30-sot-discrepancies.md
```

## Requirements

```txt
1. Remove Next review (and “No cards scheduled yet”) from the stats card. Keep
   none-due copy when dueCount = 0. Do not change GraphQL nextDueAt.
2. Language flags on the same row as the page title “Deck Detail”, not under the
   deck name. Remove flags from DeckHeader.
3. Wrap Danger zone + Delete in a distinct tinted card. Keep confirm. Do not
   put Delete in More.
4. Show a Cards / Картки heading above the word list.
5. Alternate even/odd row backgrounds. Reduce vertical gap between rows.
6. Update live SoT Deck UI. Do not rewrite docs/tasks/done/*.
7. Mark TASK-30.11 and DISC-008 DONE.
```

## Security Requirements

```txt
- Hidden labels are UX only. Delete still confirms. Backend still enforces owner.
- Do not commit secrets.
```

## Architecture Constraints

```txt
- UI only. Do not change Prisma, GraphQL, or use cases.
```

## Implementation Notes

```txt
- Odd/even from list index (0 = first word).
- PageTitle may take an optional trailing slot for flags.
```

## Acceptance Criteria

```txt
- Next review is gone from owner deck detail.
- Flags sit after “Deck Detail”.
- Danger zone is visually a boxed unit, not a list header.
- Word list has a heading, zebra rows, and tighter spacing.
- Mobile typecheck, format:check, and docs:lint pass.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm format:check
pnpm docs:lint
```

## Manual Checks

```txt
None (human: G1 detail — flags, stats, danger card, zebra list).
```

## Do Not Do

```txt
- Do not remove nextDueAt from the API.
- Do not change public deck detail unless required to share CardListItem.
- Do not push.
```

## Expected Commit Message

```txt
TASK-30.11 Separate deck detail sections and tighten the card list
```

---

# TASK-30.12 Play start, Delete button, and Cards frame

## Status

DONE

## Context

DISC-009: Start review is still a labeled button; Delete Deck does not look clickable; the Cards list has no frame.

## Goal

Owner deck detail: large Play icon to start (when due); Delete as a real button on the right of Danger zone; Cards heading + rows inside a bordered padded box.

## Related Documents

```txt
docs/tasks/30-sot-discrepancies.md
docs/domain/lesson-flow.md
docs/security/security-checklist.md
```

## Files to Create

```txt
None
```

## Files to Modify

```txt
apps/mobile/src/features/lessons/components/deck-learning-stats-card.tsx
apps/mobile/src/features/decks/components/deck-actions.tsx
apps/mobile/src/features/decks/components/card-list.tsx
docs/domain/lesson-flow.md
docs/tasks/30-sot-discrepancies.md
```

## Requirements

```txt
1. Replace the Start review AppButton with a large Play icon. Same start path.
   Accessibility label stays Start review. Owner + dueCount > 0 only.
2. Danger zone: one row — label left, Delete Deck as a button on the right
   (visible chrome: background/border). Keep confirmDestructiveAction.
3. Wrap Cards heading + word rows in a border with inner padding so rows are
   not flush against the frame.
4. Update live SoT Deck UI. Do not rewrite docs/tasks/done/*.
5. Mark TASK-30.12 and DISC-009 DONE.
```

## Security Requirements

```txt
- Hidden Play label is UX only. Delete still confirms. Backend still enforces owner.
- Do not commit secrets.
```

## Architecture Constraints

```txt
- UI only. Do not change Prisma, GraphQL, or use cases.
```

## Implementation Notes

```txt
- Play color matches Own-card Play (#1a56db). Size clearly larger than Edit/Add icons.
- Delete button is compact, not full-width.
```

## Acceptance Criteria

```txt
- Start is a large Play icon, not a labeled primary button.
- Delete Deck looks like a button and sits on the right of Danger zone.
- Cards section is framed with padding.
- Mobile typecheck, format:check, and docs:lint pass.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm format:check
pnpm docs:lint
```

## Manual Checks

```txt
None (human: G1 detail — Play, Delete button, Cards frame).
```

## Do Not Do

```txt
- Do not put Delete in More.
- Do not change Home START or Own-card Play size.
- Do not push.
```

## Expected Commit Message

```txt
TASK-30.12 Play start, Delete button, and Cards frame
```

---

# TASK-30.13 Restyle stats tiles, circled Play, and word borders

## Status

DONE

## Context

DISC-010: product wants two stats cards (icon tile + number + label, dividers), Play in a labeled circle, and a border on each word row.

## Goal

Owner deck detail stats match the two-card tile layout. Play is a circled icon with caption. Each word row has a border and inner padding.

## Related Documents

```txt
docs/tasks/30-sot-discrepancies.md
docs/domain/lesson-flow.md
docs/security/security-checklist.md
```

## Files to Create

```txt
None
```

## Files to Modify

```txt
apps/mobile/src/features/lessons/components/deck-learning-stats-card.tsx
apps/mobile/src/features/decks/components/card-list-item.tsx
apps/mobile/src/i18n/resources/en/lessons.ts
apps/mobile/src/i18n/resources/uk/lessons.ts
docs/domain/lesson-flow.md
docs/tasks/30-sot-discrepancies.md
```

## Requirements

```txt
1. Stats: two bordered cards with inner padding.
   Top: Total cards | Due now. Bottom: To learn | Practiced | Learned.
   Each cell: emoji in a rounded-square chip, large count, short label below.
   Vertical dividers between cells. Keep none-due copy when dueCount = 0.
2. Play: circle border around the icon, caption Start review / Почати повторення
   under it. Owner + dueCount > 0 only. Same start path.
3. Each word row: visible border + inner padding. Keep zebra and 1-based index.
4. Update live SoT Deck UI. Do not rewrite docs/tasks/done/*.
5. Mark TASK-30.13 and DISC-010 DONE.
```

## Security Requirements

```txt
- Play caption is UX. Backend still enforces owner start/delete.
- Do not commit secrets.
```

## Architecture Constraints

```txt
- UI only. Do not change Prisma, GraphQL, or use cases.
```

## Implementation Notes

```txt
- Top-card labels: Total cards / Усього карток. Due now / Зараз (or Due now).
- Group labels reuse decks.learningGroup.
```

## Acceptance Criteria

```txt
- Stats are two framed cards with icon chips, numbers, labels, dividers.
- Play is circled with a caption.
- Word rows have their own border and padding.
- Mobile typecheck, format:check, and docs:lint pass.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm format:check
pnpm docs:lint
```

## Manual Checks

```txt
None (human: G1 detail — stats tiles, Play circle, word borders).
```

## Do Not Do

```txt
- Do not change GraphQL nextDueAt.
- Do not change public deck detail.
- Do not push.
```

## Expected Commit Message

```txt
TASK-30.13 Restyle stats tiles, circled Play, and word borders
```

---

# TASK-30.14 Center stats, isolate Play, inset words, pill badges

## Status

DONE

## Context

DISC-011: Play caption should not be tappable; stats need a white card and centered cells; word content must sit off the border; visibility/moderation should be icon pills.

## Goal

Owner deck detail: white centered stats tiles; Play circle only is the control; word rows have real inner padding; Private/Public/moderation are pill badges with icons.

## Related Documents

```txt
docs/tasks/30-sot-discrepancies.md
docs/domain/lesson-flow.md
docs/security/security-checklist.md
```

## Files to Create

```txt
None
```

## Files to Modify

```txt
apps/mobile/src/features/lessons/components/deck-learning-stats-card.tsx
apps/mobile/src/features/decks/components/card-list-item.tsx
apps/mobile/src/features/decks/components/deck-status-badge.tsx
docs/domain/lesson-flow.md
docs/tasks/30-sot-discrepancies.md
```

## Requirements

```txt
1. Stats cards: white background. Each cell’s icon+count+label group is centered
   in its column (screenshot layout). Keep two cards and dividers.
2. Play: Pressable is the circle only. Caption under it is a different (muted)
   color and not in the hit target. Same start rules.
3. Word rows: inner padding that actually insets content from the border
   (inner View; do not rely on Tamagui Card padding).
4. Status pills (not clickable): Private lock-closed-outline gray; Public
   globe-outline blue; Pending time-outline amber; Published
   checkmark-circle-outline green; Rejected close-circle-outline red;
   Hidden eye-off-outline brown. Keep existing labels.
5. Update live SoT. Do not rewrite docs/tasks/done/*.
6. Mark TASK-30.14 and DISC-011 DONE.
```

## Security Requirements

```txt
- Pills and Play caption are UX. Backend still enforces owner start/delete.
- Do not commit secrets.
```

## Architecture Constraints

```txt
- UI only. Do not change Prisma, GraphQL, or use cases.
```

## Implementation Notes

```txt
- DeckStatusBadge is also used on list/admin/group rows — same pill look is OK.
```

## Acceptance Criteria

```txt
- Stats are white and centered in columns.
- Tapping the Start review label does not start a review; tapping the circle does.
- Word text is inset from the row border.
- Private (and other statuses) render as icon pills.
- Mobile typecheck, format:check, and docs:lint pass.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm format:check
pnpm docs:lint
```

## Manual Checks

```txt
None (human: G1 — stats, Play hit, word inset, Private pill).
```

## Do Not Do

```txt
- Do not make status pills buttons.
- Do not change Own/Group list origin chips.
- Do not push.
```

## Expected Commit Message

```txt
TASK-30.14 Center stats, isolate Play, inset words, pill badges
```

---

# TASK-30.15 Align group chrome, tighten word inset, border status pills

## Status

DONE

## Context

DISC-012: word inset is too large; learning-group badges need the same emojis as stats; stats group cells must share badge colors; status pills need borders and a distinct Private background.

## Goal

Word rows use 8px inset. To learn / Practiced / Learned share emoji + colors between stats and word badges. Status pills are bordered; Private does not blend into the page.

## Related Documents

```txt
docs/tasks/30-sot-discrepancies.md
docs/domain/lesson-flow.md
docs/security/security-checklist.md
```

## Files to Create

```txt
apps/mobile/src/features/decks/utils/learning-group-style.ts
```

## Files to Modify

```txt
apps/mobile/src/features/decks/components/learning-group-badge.tsx
apps/mobile/src/features/lessons/components/deck-learning-stats-card.tsx
apps/mobile/src/features/decks/components/deck-status-badge.tsx
apps/mobile/src/features/decks/components/card-list-item.tsx
docs/domain/lesson-flow.md
docs/tasks/30-sot-discrepancies.md
```

## Requirements

```txt
1. Word row inner padding 8px.
2. Shared learning-group style: emoji 🌱 / 🔁 / ✅ and badge colors
   To learn #e8f0fe/#1a56db, Practiced #fef3c7/#92400e, Learned #dcfce7/#166534.
   Word badges show emoji + label. Stats group chips use the same background;
   group labels use the same text color.
3. Status pills: 1px border. Private #e8edf2 / #98a2b3 / #344054 lock.
   Public #eff4ff / #b2ccff / #1565c0 globe.
   Pending #fff4e5 / #f7c48a / #b54708 time.
   Published #ecfdf3 / #abefc6 / #067647 check.
   Rejected #fef3f2 / #fecdca / #b42318 close.
   Hidden #f5f0eb / #d6c4b4 / #6d4c41 eye-off.
4. Update live SoT. Do not rewrite docs/tasks/done/*.
5. Mark TASK-30.15 and DISC-012 DONE.
```

## Security Requirements

```txt
- Badges are UX only. Do not commit secrets.
```

## Architecture Constraints

```txt
- UI only. Do not change Prisma, GraphQL, or use cases.
```

## Implementation Notes

```txt
- Keep Total / Due now chips on the generic gray tile.
```

## Acceptance Criteria

```txt
- Word content is closer to the border (8px) but not flush.
- Group badges and stats group cells match in emoji and color.
- Private (and other status pills) have a visible border.
- Mobile typecheck, format:check, and docs:lint pass.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm format:check
pnpm docs:lint
```

## Manual Checks

```txt
None (human: G1 — word inset, group icons/colors, Private border).
```

## Do Not Do

```txt
- Do not change Play hit target or stats layout.
- Do not push.
```

## Expected Commit Message

```txt
TASK-30.15 Align group chrome, tighten word inset, border status pills
```

---

# TASK-30.16 Move status pills, pill stats labels, disable More

## Status

DONE

## Context

DISC-013: Private should sit after the page title; stats group words need the same pill fill as word badges; More actions should be blocked for now.

## Goal

Deck detail title row is “Deck Detail” + status pills + flags. Stats group labels are pills. More items are disabled (menu still opens).

## Related Documents

```txt
docs/tasks/30-sot-discrepancies.md
docs/domain/lesson-flow.md
docs/security/security-checklist.md
```

## Files to Create

```txt
None
```

## Files to Modify

```txt
apps/mobile/src/ui/components/page-title.tsx
apps/mobile/src/features/decks/screens/deck-detail-screen.tsx
apps/mobile/src/features/decks/components/deck-header.tsx
apps/mobile/src/features/decks/components/learning-group-badge.tsx
apps/mobile/src/features/lessons/components/deck-learning-stats-card.tsx
apps/mobile/src/features/decks/components/deck-more-menu.tsx
docs/domain/lesson-flow.md
docs/tasks/30-sot-discrepancies.md
```

## Requirements

```txt
1. Status pills immediately after “Deck Detail”. Flags remain on the right.
   Remove pills from DeckHeader. Keep pending-moderation copy under the header
   if relevant. List/admin badges unchanged.
2. Stats To learn / Practiced / Learned labels use the same pill background as
   word badges (reuse LearningGroupBadge without a second emoji if needed).
   Total / Due now stay as today.
3. More items disabled: Import CSV, Regenerate, Publish / Unpublish. ⋯ still
   opens; Cancel still works. Do not delete the handlers.
4. Update live SoT. Do not rewrite docs/tasks/done/*.
5. Mark TASK-30.16 and DISC-013 DONE.
```

## Security Requirements

```txt
- Disabled More is UX only. Backend still enforces owner/publish.
- Do not commit secrets.
```

## Architecture Constraints

```txt
- UI only. Do not change Prisma, GraphQL, or use cases.
```

## Implementation Notes

```txt
- Gate More with a local MORE_ACTIONS_ENABLED = false so it is easy to restore.
```

## Acceptance Criteria

```txt
- Private sits after Deck Detail, not under G1.
- Stats group words have pill fills matching word badges.
- More actions cannot be triggered; Cancel still closes the sheet.
- Mobile typecheck, format:check, and docs:lint pass.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm format:check
pnpm docs:lint
```

## Manual Checks

```txt
None (human: G1 title row, stats pills, More disabled).
```

## Do Not Do

```txt
- Do not remove More or its handlers.
- Do not disable Edit / Add / Delete / Play.
- Do not push.
```

## Expected Commit Message

```txt
TASK-30.16 Move status pills, pill stats labels, disable More
```

---

# TASK-30.17 Restyle stats tiles, header Start, status pill radius

## Status

DONE

## Context

DISC-014: group stats should put emoji and count in one colored tile; Start review belongs beside the deck title as a filled button; status pills should use the 8px radius used elsewhere.

## Goal

Owner deck detail shows group emoji+count tiles, a filled Start review on the header, and 8px status pills. Word rows and More stay as after 30.16.

## Related Documents

```txt
docs/tasks/30-sot-discrepancies.md
docs/domain/lesson-flow.md
docs/security/security-checklist.md
```

## Files to Create

```txt
apps/mobile/src/features/decks/components/deck-start-review-button.tsx
```

## Files to Modify

```txt
apps/mobile/src/features/lessons/components/deck-learning-stats-card.tsx
apps/mobile/src/features/decks/screens/deck-detail-screen.tsx
apps/mobile/src/features/decks/components/deck-header.tsx
apps/mobile/src/features/decks/components/deck-status-badge.tsx
docs/domain/lesson-flow.md
docs/tasks/30-sot-discrepancies.md
```

## Requirements

```txt
1. Stats To learn / Practiced / Learned: emoji and count share one rounded
   tile using LEARNING_GROUP_STYLE background and count color. Label pill
   stays below (LearningGroupBadge, showEmoji false). Total / Due now unchanged.
2. Start review: filled #1a56db, white play + white label, trailing on
   DeckHeader (beside deck title). Owner + dueCount > 0 only. Keep language
   gate on press. Remove circled Play from stats. noneDue copy may stay.
3. Status pills: borderRadius 8. Keep colors, icons, 1px border.
4. Do not change word rows, More disabled, or pills-after-title.
5. Update live SoT. Do not rewrite docs/tasks/done/*.
6. Mark TASK-30.17 and DISC-014 DONE.
```

## Security Requirements

```txt
- Start remains owner + dueCount > 0; backend still enforces deck ownership.
- Do not commit secrets.
```

## Architecture Constraints

```txt
- UI only. Do not change Prisma, GraphQL, or use cases.
```

## Implementation Notes

```txt
- Reuse existing group/status colors. Do not copy the mock palette.
```

## Acceptance Criteria

```txt
- Group stats show emoji+count in one colored tile with a pill below.
- Start review is a filled header button when due; hidden when due is 0.
- Status pills are 8px rounded, not capsules.
- Word rows unchanged.
- Mobile typecheck, format:check, and docs:lint pass.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm format:check
pnpm docs:lint
```

## Manual Checks

```txt
None (human: G1 header Start, group tiles, Private radius).
```

## Do Not Do

```txt
- Do not restyle word rows.
- Do not re-enable More.
- Do not move status pills off the page title.
- Do not push.
```

## Expected Commit Message

```txt
TASK-30.17 Restyle stats tiles, header Start, status pill radius
```

---

# TASK-30.18 Compact My Decks cards and center stats labels

## Status

DONE

## Context

DISC-015: deck-detail group labels sit left; Own list counters are unstyled; No language cards clip dual pills; Create Deck is a full-width row; card caps are mostly empty.

## Goal

Stats group pills are centered. My Decks Own counters use group chrome. Rail cards fit two status pills. Create Deck is on the title row. Accent caps are shorter.

## Related Documents

```txt
docs/tasks/30-sot-discrepancies.md
docs/domain/lesson-flow.md
docs/security/security-checklist.md
```

## Files to Create

```txt
None
```

## Files to Modify

```txt
apps/mobile/src/features/decks/components/learning-group-badge.tsx
apps/mobile/src/features/lessons/components/deck-learning-stats-card.tsx
apps/mobile/src/features/decks/components/deck-learning-stats-compact.tsx
apps/mobile/src/features/decks/components/deck-list-item.tsx
apps/mobile/src/features/decks/screens/my-decks-screen.tsx
docs/domain/lesson-flow.md
docs/tasks/30-sot-discrepancies.md
```

## Requirements

```txt
1. Stats To learn / Practiced / Learned label pills: alignSelf center.
   Word-row badges stay flex-start.
2. Own compact counters: emoji + LEARNING_GROUP_STYLE background/color pills.
   Due line stays blue text.
3. Raise rail STATUS_SLOT_HEIGHT so Public + Published are not clipped;
   bump card heights as needed. overflow hidden may stay.
4. Create Deck: PageTitle trailing, compact + label, right edge. Empty Own
   “Create your first deck” unchanged.
5. Accent cap ~56px. Flags remain. Origin badge on No language stays in the cap.
6. Update live SoT. Do not rewrite docs/tasks/done/*.
7. Mark TASK-30.18 and DISC-015 DONE.
```

## Security Requirements

```txt
- Do not change who sees Create Deck / Play / counters.
- Do not commit secrets.
```

## Architecture Constraints

```txt
- UI only. Do not change Prisma, GraphQL, or use cases.
```

## Implementation Notes

```txt
- Reuse LEARNING_GROUP_STYLE. Do not invent new group colors.
```

## Acceptance Criteria

```txt
- Stats group labels are centered under the tiles.
- Own cards show group-colored counter pills with emoji.
- Two status pills on a rail card are fully visible.
- Create Deck is on the My Decks title row, right-aligned.
- Accent cap is shorter than 96px and still shows flags.
- Mobile typecheck, format:check, and docs:lint pass.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm format:check
pnpm docs:lint
```

## Manual Checks

```txt
None (human: My Decks Own + No language, G1 stats labels, Create Deck row).
```

## Do Not Do

```txt
- Do not restyle word rows.
- Do not re-enable More.
- Do not push.
```

## Expected Commit Message

```txt
TASK-30.18 Compact My Decks cards and center stats labels
```

---

# TASK-30.19 Differentiate My Decks cards by section

## Status

DONE

## Context

DISC-016: Own cards should match the My Decks mock (white shell, flags+Private, 3-col stats, Due + Start review). Group/Public/No language need different mid-content. Demo seed has no other-owner Group/Public decks for es.

## Goal

My Decks list cards follow variant A. Demo seed shows a Group card and a Public card for `demo@example.com`.

## Related Documents

```txt
docs/tasks/30-sot-discrepancies.md
docs/domain/lesson-flow.md
docs/smoke/lesson-queue.md
docs/security/security-checklist.md
```

## Files to Create

```txt
None
```

## Files to Modify

```txt
apps/mobile/src/features/decks/components/deck-list-item.tsx
apps/mobile/src/features/decks/components/decks-page-sections.tsx
apps/mobile/src/features/decks/components/deck-learning-stats-compact.tsx
apps/mobile/src/features/decks/components/deck-status-badge.tsx
apps/mobile/src/features/decks/components/deck-start-play-button.tsx
apps/mobile/src/features/decks/screens/my-decks-screen.tsx
apps/mobile/src/i18n/resources/en/decks.ts
apps/mobile/src/i18n/resources/uk/decks.ts
apps/api/prisma/seed.ts
docs/domain/lesson-flow.md
docs/smoke/lesson-queue.md
docs/tasks/30-sot-discrepancies.md
```

## Requirements

```txt
1. Shared shell: ~260px rail width, white card, 12 radius, border, light
   shadow. No pastel accent cap. Flags top-left, badge top-right, title,
   then section body, then footer.
2. Own: Private/Public; hide Approved; show Pending/Rejected/Hidden.
   3-col 🌱🔁✅ stats (our colors). Footer Due + filled Start review when
   dueCount > 0. Tap card → detail; Start → /lessons/start?deckId=.
   Remove Play overlay.
3. Group: Shared badge (not Private). Hint “Shared with your group”.
   Footer View. No stats/Start.
4. Public: Official if isOfficial else Public. No Approved. Footer View.
   Copy stays on public detail. No stats/Start.
5. No language: origin + visibility; “Language not selected”. Keep section
   title. No stats/Start.
6. Create Deck: outline #1a56db with +.
7. Seed: second local catalog user; PRIVATE es “Business Spanish” shared
   to a group where demo is MEMBER; PUBLIC APPROVED isOfficial es
   “Spanish Basics”. Keep G1–S and language-less decks. Production seed
   guard stays. Demo user does not own the new Group/Public decks.
8. Update live SoT. Do not rewrite docs/tasks/done/*.
9. Mark TASK-30.19 and DISC-016 DONE.
```

## Security Requirements

```txt
- Catalog user is local seed only. Do not commit real secrets.
- Demo password may stay as the existing local-only credential.
- Frontend visibility is UX only; backend still enforces.
```

## Architecture Constraints

```txt
- Do not change Prisma schema, GraphQL, or decksPage use case.
- Seed may use Prisma directly.
```

## Implementation Notes

```txt
- Hide Approved only on list cards. Detail and admin badges unchanged.
- Do not copy mock mortarboard/pencil icons.
```

## Acceptance Criteria

```txt
- Own cards match the mock layout with our group chrome.
- Group shows Shared; Public shows Official or Public; Approved is absent
  on those list cards.
- After seed, demo My Decks (es) shows Group and Public sections.
- Mobile typecheck, format:check, and docs:lint pass.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm format:check
pnpm docs:lint
```

## Manual Checks

```txt
None (human: re-seed, My Decks Own/Group/Public/No language).
```

## Do Not Do

```txt
- Do not rename the No language section.
- Do not add cardCount/author (not in DecksPage).
- Do not copy on the Public list card.
- Do not push.
```

## Expected Commit Message

```txt
TASK-30.19 Differentiate My Decks cards by section
```

---

# TASK-30.20 Narrow My Decks rail cards to fit three

## Status

DONE

## Context

DISC-017: 260px rail cards plus gaps only show ~2.2 cards in the 720px My Decks column.

## Goal

Three rail cards fit fully in the default content column. Inner fonts and control sizes stay as after 30.19.

## Related Documents

```txt
docs/tasks/30-sot-discrepancies.md
docs/domain/lesson-flow.md
docs/security/security-checklist.md
```

## Files to Create

```txt
None
```

## Files to Modify

```txt
apps/mobile/src/features/decks/components/deck-list-item.tsx
docs/domain/lesson-flow.md
docs/tasks/30-sot-discrepancies.md
```

## Requirements

```txt
1. Set RAIL_WIDTH to 228 (3 × 228 + 2 × 12 = 708, within 720).
2. Do not change inner font sizes, padding, or Start review.
3. Update live SoT. Do not rewrite docs/tasks/done/*.
4. Mark TASK-30.20 and DISC-017 DONE.
```

## Security Requirements

```txt
- Do not commit secrets.
```

## Architecture Constraints

```txt
- UI only. Do not change Prisma, GraphQL, or use cases.
```

## Implementation Notes

```txt
- Only the rail width constant changes.
```

## Acceptance Criteria

```txt
- Three Own cards are fully visible in the default web column.
- Inner typography and Start review size unchanged.
- Mobile typecheck, format:check, and docs:lint pass.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm format:check
pnpm docs:lint
```

## Manual Checks

```txt
None (human: My Decks Own — three full cards).
```

## Do Not Do

```txt
- Do not change fonts, padding, or Start review.
- Do not wrap the rail into a grid.
- Do not push.
```

## Expected Commit Message

```txt
TASK-30.20 Narrow My Decks rail cards to fit three
```

---

# TASK-30.21 Wrap My Decks section cards into a grid

## Status

DONE

## Context

DISC-018: after narrowing cards to 228px, extra Own decks still sit in a nested horizontal ScrollView and clip instead of wrapping.

## Goal

My Decks section cards wrap to the next row. Card width and inner sizes stay as after 30.20.

## Related Documents

```txt
docs/tasks/30-sot-discrepancies.md
docs/domain/lesson-flow.md
docs/security/security-checklist.md
```

## Files to Create

```txt
None
```

## Files to Modify

```txt
apps/mobile/src/features/decks/components/decks-page-sections.tsx
apps/mobile/src/features/decks/components/deck-list-item.tsx
docs/domain/lesson-flow.md
docs/tasks/30-sot-discrepancies.md
```

## Requirements

```txt
1. Replace the per-section horizontal ScrollView with a wrapping row grid
   (reuse responsiveGridStyle: row, wrap, 12 gap).
2. Keep RAIL_WIDTH 228. Drop rail marginRight; gap comes from the grid.
3. Do not change inner fonts, padding, or Start review.
4. Update live SoT. Do not rewrite docs/tasks/done/*.
5. Mark TASK-30.21 and DISC-018 DONE.
```

## Security Requirements

```txt
- Do not commit secrets.
```

## Architecture Constraints

```txt
- UI only. Do not change Prisma, GraphQL, or use cases.
```

## Implementation Notes

```txt
- Fourth Own card wraps under the first row. Page Screen still scrolls vertically.
```

## Acceptance Criteria

```txt
- Extra section cards appear on the next row instead of clipping.
- Card chrome and inner sizes unchanged from 30.20.
- Mobile typecheck, format:check, and docs:lint pass.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm format:check
pnpm docs:lint
```

## Manual Checks

```txt
None (human: My Decks Own — 4th card on the next row).
```

## Do Not Do

```txt
- Do not change fonts, padding, or Start review.
- Do not change RAIL_WIDTH.
- Do not push.
```

## Expected Commit Message

```txt
TASK-30.21 Wrap My Decks section cards into a grid
```

---

# TASK-30.22 Stretch My Decks cards to fill the row

## Status

DONE

## Context

DISC-019: after wrapping, cards stay 228px so a 3-card row does not fill the 720px column.

## Goal

Each My Decks section row uses the full content width. Cards in a row share that width equally.

## Related Documents

```txt
docs/tasks/30-sot-discrepancies.md
docs/domain/lesson-flow.md
docs/security/security-checklist.md
```

## Files to Create

```txt
None
```

## Files to Modify

```txt
apps/mobile/src/ui/utils/responsive.ts
apps/mobile/src/features/decks/components/decks-page-sections.tsx
apps/mobile/src/features/decks/components/deck-list-item.tsx
docs/domain/lesson-flow.md
docs/tasks/30-sot-discrepancies.md
```

## Requirements

```txt
1. Section grid is 100% wide. Default web: 3 equal columns, then wrap.
2. Drop fixed RAIL_WIDTH. Cards fill their grid cell.
3. Do not change inner fonts, padding, or Start review.
4. Update live SoT. Do not rewrite docs/tasks/done/*.
5. Mark TASK-30.22 and DISC-019 DONE.
```

## Security Requirements

```txt
- Do not commit secrets.
```

## Architecture Constraints

```txt
- UI only. Do not change Prisma, GraphQL, or use cases.
```

## Implementation Notes

```txt
- Full-width wrap row. Item width is 1/N of the row (3 on default web).
- Drop to 2 then 1 column when the content width cannot fit ~228px cards.
```

## Acceptance Criteria

```txt
- A 3-card Own row fills the default web column with no leftover gap.
- Extra cards wrap to the next row.
- Inner typography and Start review size unchanged.
- Mobile typecheck, format:check, and docs:lint pass.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm format:check
pnpm docs:lint
```

## Manual Checks

```txt
None (human: My Decks Own — row fills the column).
```

## Do Not Do

```txt
- Do not change fonts, padding, or Start review.
- Do not push.
```

## Expected Commit Message

```txt
TASK-30.22 Stretch My Decks cards to fill the row
```

---

# TASK-30.23 Restyle Own compact stats tiles

## Status

DONE

## Context

DISC-020: Own card stats stack 🌱 above the count. Product wants emoji + count on one centered row, group-colored tiles, 📖/✏️/🎓, and Learn.

## Goal

Own My Decks compact stats match the approved tile chrome. Deck detail and word badges stay as after 30.19.

## Related Documents

```txt
docs/tasks/30-sot-discrepancies.md
docs/domain/lesson-flow.md
docs/security/security-checklist.md
```

## Files to Create

```txt
None
```

## Files to Modify

```txt
apps/mobile/src/features/decks/components/deck-learning-stats-compact.tsx
apps/mobile/src/i18n/resources/en/decks.ts
apps/mobile/src/i18n/resources/uk/decks.ts
docs/domain/lesson-flow.md
docs/tasks/30-sot-discrepancies.md
```

## Requirements

```txt
1. Each group is a rounded tile with LEARNING_GROUP_STYLE background.
   Centered row: card emoji + count. Short label below, centered.
2. Card emojis 📖 / ✏️ / 🎓. Do not change LEARNING_GROUP_STYLE.emoji.
3. Card label Learn / Practiced / Learned. Detail still says To learn.
4. Update live SoT. Do not rewrite docs/tasks/done/*.
5. Mark TASK-30.23 and DISC-020 DONE.
```

## Security Requirements

```txt
- Do not commit secrets.
```

## Architecture Constraints

```txt
- UI only. Do not change Prisma, GraphQL, or use cases.
```

## Implementation Notes

```txt
- Do not restyle deck-detail StatCell or word badges.
```

## Acceptance Criteria

```txt
- Own cards show centered emoji+count on one row, label below, group fills.
- Cards say Learn, not To learn. Detail still says To learn.
- Mobile typecheck, format:check, and docs:lint pass.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm format:check
pnpm docs:lint
```

## Manual Checks

```txt
None (human: My Decks Own compact stats).
```

## Do Not Do

```txt
- Do not change deck-detail group tiles or word-badge emojis.
- Do not push.
```

## Expected Commit Message

```txt
TASK-30.23 Restyle Own compact stats tiles
```

---

# TASK-30.24 Restyle Own card stats into one bordered row

## Status

DONE

## Context

DISC-021: Own cards still use per-group color tiles. The approved mock is one shared bordered stats box with three stacked columns and a Due / Start review footer.

## Goal

Own My Decks cards match the mock: flags + title + badge, one 3-column stats container, Due + Start review. Presentation only.

## Related Documents

```txt
docs/tasks/30-sot-discrepancies.md
docs/domain/lesson-flow.md
docs/security/security-checklist.md
```

## Files to Create

```txt
None
```

## Files to Modify

```txt
apps/mobile/src/features/decks/components/deck-learning-stats-compact.tsx
apps/mobile/src/features/decks/components/deck-list-item.tsx
docs/domain/lesson-flow.md
docs/tasks/30-sot-discrepancies.md
```

## Requirements

```txt
1. Keep flags, title, Private/Public (hide Approved).
2. One bordered stats container, 3 equal columns, thin vertical dividers.
   Each column: emoji, large group-colored count, gray Learn/Practiced/Learned.
3. No per-status background fills. Card emojis 📖 / ✏️ / ✅.
4. Footer: Due left, Start review right only when dueCount > 0.
   Card press still goes to deck detail.
5. Do not change backend, GraphQL, or learning logic.
6. Update live SoT. Do not rewrite docs/tasks/done/*.
7. Mark TASK-30.24 and DISC-021 DONE.
```

## Security Requirements

```txt
- Do not commit secrets.
```

## Architecture Constraints

```txt
- UI only. Do not change Prisma, GraphQL, or use cases.
```

## Implementation Notes

```txt
- Drop the extra title divider on Own cards; the stats box is the separator.
- Group / Public / No language chrome stays as after 30.19.
```

## Acceptance Criteria

```txt
- Own cards show one bordered 3-column stats row with vertical dividers.
- Start review only when dueCount > 0. Card tap opens deck detail.
- Mobile typecheck, format:check, and docs:lint pass.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm format:check
pnpm docs:lint
```

## Manual Checks

```txt
None (human: My Decks Own cards vs mock).
```

## Do Not Do

```txt
- Do not change deck-detail stats or word badges.
- Do not change Prisma, GraphQL, or queue logic.
- Do not push.
```

## Expected Commit Message

```txt
TASK-30.24 Restyle Own card stats into one bordered row
```

---

# TASK-30.25 Compact Own cards and lock the title slot

## Status

DONE

## Context

DISC-022: Own cards are still tall, the visibility pill is loud, Start review is long, and a one-line title shortens the card so stats/footer jump.

## Goal

Own My Decks cards are compact, equal height in a row, with a 2-line title slot, Due chip, and Review →. Presentation only.

## Related Documents

```txt
docs/tasks/30-sot-discrepancies.md
docs/domain/lesson-flow.md
docs/security/security-checklist.md
```

## Files to Create

```txt
None
```

## Files to Modify

```txt
apps/mobile/src/features/decks/components/deck-list-item.tsx
apps/mobile/src/features/decks/components/deck-learning-stats-compact.tsx
apps/mobile/src/features/decks/components/deck-status-badge.tsx
apps/mobile/src/features/decks/components/deck-start-play-button.tsx
apps/mobile/src/ui/primitives/app-text.tsx
apps/mobile/src/ui/utils/responsive.ts
apps/mobile/src/i18n/resources/en/decks.ts
apps/mobile/src/i18n/resources/uk/decks.ts
docs/domain/lesson-flow.md
docs/tasks/30-sot-discrepancies.md
```

## Requirements

```txt
1. Tighten Own vertical padding/gaps. Compact muted Private/Public on list cards.
2. Keep one bordered 3-col stats box. Larger counts, smaller emoji, gray labels.
3. Due as a compact chip left; Review → right only when dueCount > 0.
   A11y label stays Start review. Deck detail CTA unchanged.
4. Title: max 2 lines, ellipsis, fixed 2-line slot height. Web tooltip with full
   title. No dynamic font shrink, no horizontal scroll. Full title on detail.
5. Stretch grid items so cards in a row share height.
6. Update live SoT. Do not rewrite docs/tasks/done/*.
7. Mark TASK-30.25 and DISC-022 DONE.
```

## Security Requirements

```txt
- Do not commit secrets.
```

## Architecture Constraints

```txt
- UI only. Do not change Prisma, GraphQL, or use cases.
```

## Implementation Notes

```txt
- Reserve footer min-height so missing Review does not shrink the card.
```

## Acceptance Criteria

```txt
- Own cards in a row are the same size; long titles ellipsize at 2 lines.
- Web hover shows the full title. Review → only when dueCount > 0.
- Mobile typecheck, format:check, and docs:lint pass.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm format:check
pnpm docs:lint
```

## Manual Checks

```txt
None (human: My Decks Own compact cards + long title).
```

## Do Not Do

```txt
- Do not change deck-detail Start review label or stats.
- Do not change Prisma, GraphQL, or queue logic.
- Do not push.
```

## Expected Commit Message

```txt
TASK-30.25 Compact Own cards and lock the title slot
```

---

# TASK-30.26 Align Own card footer into one row

## Status

DONE

## Context

DISC-023: Own Due and Review should sit on one clear row with more space under the stats box.

## Goal

Own card footer is one nowrap row: Due left, Review → right. Gap above the footer is a bit larger.

## Related Documents

```txt
docs/tasks/30-sot-discrepancies.md
docs/domain/lesson-flow.md
docs/security/security-checklist.md
```

## Files to Create

```txt
None
```

## Files to Modify

```txt
apps/mobile/src/features/decks/components/deck-list-item.tsx
docs/domain/lesson-flow.md
docs/tasks/30-sot-discrepancies.md
```

## Requirements

```txt
1. Footer is one nowrap row, space-between: Due chip left, Review → right.
2. Increase the gap between the stats box and the footer (8 → 12).
3. Match Due chip height to Review so they read as one line.
4. Update live SoT. Do not rewrite docs/tasks/done/*.
5. Mark TASK-30.26 and DISC-023 DONE.
```

## Security Requirements

```txt
- Do not commit secrets.
```

## Architecture Constraints

```txt
- UI only. Do not change Prisma, GraphQL, or use cases.
```

## Implementation Notes

```txt
- Keep Review hidden when dueCount = 0.
```

## Acceptance Criteria

```txt
- Own footer reads as Due … Review → on one row.
- There is a visible gap between stats and footer.
- Mobile typecheck, format:check, and docs:lint pass.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm format:check
pnpm docs:lint
```

## Manual Checks

```txt
None (human: My Decks Own footer row).
```

## Do Not Do

```txt
- Do not change deck-detail Start review.
- Do not push.
```

## Expected Commit Message

```txt
TASK-30.26 Align Own card footer into one row
```

---

# TASK-30.27 Restyle Home around Due now and Start review

## Status

DONE

## Context

DISC-024: Home is stretched, Due now is a small line, and START is a gray button. Product wants Own-card chrome with Due now as the hero.

## Goal

Home shows a compact review block: hero dueCount, 3-col stats, primary Start review →. Language flag + add sit on the Home title row.

## Related Documents

```txt
docs/tasks/30-sot-discrepancies.md
docs/domain/lesson-flow.md
docs/architecture.md
docs/smoke/lesson-queue.md
docs/security/security-checklist.md
```

## Files to Create

```txt
apps/mobile/src/features/decks/components/learning-group-stats-row.tsx
```

## Files to Modify

```txt
apps/mobile/src/features/decks/components/deck-learning-stats-compact.tsx
apps/mobile/src/features/home/components/home-learning-counters.tsx
apps/mobile/src/features/home/screens/home-screen.tsx
apps/mobile/app/(tabs)/_layout.tsx
apps/mobile/src/i18n/resources/en/home.ts
apps/mobile/src/i18n/resources/uk/home.ts
docs/domain/lesson-flow.md
docs/architecture.md
docs/smoke/lesson-queue.md
docs/smoke/learning-steps.md
docs/tasks/30-sot-discrepancies.md
```

## Requirements

```txt
1. Home title: Home left, StudyLanguageSelector right. Hide the Home native tab header.
2. Hero dueCount + Due now label. Today’s review heading.
3. Shared bordered 3-col stats (📖 Learn / ✏️ Practiced / ✅ Learned), same as Own cards.
4. Full-width primary #1a56db Start review → when dueCount > 0; hide when 0.
   Still calls startHomeLesson. Empty CTAs unchanged.
5. Tighten vertical gaps. Same Screen content width as other pages.
6. Update live SoT and smoke labels. Do not rewrite docs/tasks/done/*.
7. Mark TASK-30.27 and DISC-024 DONE.
```

## Security Requirements

```txt
- Do not commit secrets.
```

## Architecture Constraints

```txt
- UI only. Do not change Prisma, GraphQL, startHomeLesson, or queue logic.
```

## Implementation Notes

```txt
- Extract LearningGroupStatsRow for Home and Own cards.
- Other tabs keep the native header language selector.
```

## Acceptance Criteria

```txt
- Home Due now is the dominant number. Start review is a blue full-width button.
- Start review is hidden when dueCount = 0. Home still starts a HOME_ACTIVE_TARGET session.
- Mobile typecheck, format:check, and docs:lint pass.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm format:check
pnpm docs:lint
```

## Manual Checks

```txt
None (human: Home Due now + Start review).
```

## Do Not Do

```txt
- Do not add a deck list on Home.
- Do not change startHomeLesson or lessonSize.
- Do not push.
```

## Expected Commit Message

```txt
TASK-30.27 Restyle Home around Due now and Start review
```

---

# TASK-30.28 Group Profile into compact autosave settings

## Status

DONE

## Context

DISC-025: Profile is a long equal-weight form. Product wants four compact blocks, autosave, and no technical copy.

## Goal

Profile is grouped settings: identity card, nav rows, preferences, reminders, secondary log out. Changes save immediately.

## Related Documents

```txt
docs/tasks/30-sot-discrepancies.md
docs/domain/lesson-flow.md
docs/security/security-checklist.md
```

## Files to Create

```txt
apps/mobile/src/features/settings/components/settings-section-card.tsx
apps/mobile/src/features/settings/components/settings-nav-row.tsx
apps/mobile/src/features/settings/components/settings-labeled-row.tsx
```

## Files to Modify

```txt
apps/mobile/src/features/profile/screens/profile-screen.tsx
apps/mobile/src/features/profile/components/profile-card.tsx
apps/mobile/src/features/settings/components/user-settings-form.tsx
apps/mobile/src/features/settings/components/interface-locale-field.tsx
apps/mobile/src/features/settings/components/native-language-field.tsx
apps/mobile/src/features/settings/components/lesson-size-field.tsx
apps/mobile/src/features/settings/components/reminder-time-field.tsx
apps/mobile/src/features/settings/components/timezone-field.tsx
apps/mobile/src/features/notifications/components/notification-settings-card.tsx
apps/mobile/src/i18n/resources/en/profile.ts
apps/mobile/src/i18n/resources/uk/profile.ts
apps/mobile/src/i18n/resources/en/settings.ts
apps/mobile/src/i18n/resources/uk/settings.ts
docs/domain/lesson-flow.md
docs/release/mvp-smoke-tests.md
docs/tasks/30-sot-discrepancies.md
```

## Requirements

```txt
1. Profile card: email, verified, member since. Hide Role for USER.
2. Groups / Invitations compact nav rows. Keep staff links compact.
3. Preferences card: locale, native language, review-size stepper 5–100. Autosave.
4. Reminders card: time, timezone, device switch, push. No technical help copy.
5. Web push: available in the mobile app. Log out is secondary text under Account.
6. No Save settings. Update live SoT. Do not rewrite docs/tasks/done/*.
7. Mark TASK-30.28 and DISC-025 DONE.
```

## Security Requirements

```txt
- Do not commit secrets.
```

## Architecture Constraints

```txt
- UI only. Keep updateSettings GraphQL. Do not change Prisma or use cases.
```

## Implementation Notes

```txt
- AccountStatusCard stays in the repo but is unused on Profile; identity lives in ProfileCard.
```

## Acceptance Criteria

```txt
- Regular users do not see Role: User. Settings persist without Save settings.
- Web has no disabled Enable notifications button.
- Mobile typecheck, format:check, and docs:lint pass.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm format:check
pnpm docs:lint
```

## Manual Checks

```txt
None (human: Profile four blocks + autosave).
```

## Do Not Do

```txt
- Do not change updateSettings contract.
- Do not push.
```

## Expected Commit Message

```txt
TASK-30.28 Group Profile into compact autosave settings
```

---

# TASK-30.29 Restyle My Groups into compact rows and seed demo groups

## Status

DONE

## Context

DISC-026: My Groups is two full-width buttons and untitled cards. Product wants compact action cards, equal-height group rows, and seeded demo groups.

## Goal

My Groups matches the compact list mock. Local seed has several groups with mixed roles and member counts. Group permission rules stay the same.

## Related Documents

```txt
docs/tasks/30-sot-discrepancies.md
docs/domain/lesson-flow.md
docs/security/security-checklist.md
docs/domain/permissions.md
```

## Files to Create

```txt
apps/api/src/modules/groups/domain/utils/member-initials.ts
apps/api/src/modules/groups/domain/utils/member-initials.spec.ts
apps/api/src/modules/groups/presentation/graphql/types/group-member-preview.type.ts
apps/mobile/src/features/groups/components/group-action-card.tsx
apps/mobile/src/features/groups/components/group-member-avatars.tsx
apps/mobile/src/features/groups/components/group-owner-menu.tsx
apps/mobile/src/features/groups/components/group-role-badge.tsx
apps/mobile/src/features/groups/components/group-row-icon.tsx
```

## Files to Modify

```txt
apps/api/src/modules/groups/domain/types/group.type.ts
apps/api/src/modules/groups/infrastructure/persistence/prisma-group.repository.ts
apps/api/src/modules/groups/presentation/graphql/types/group.type.ts
apps/api/src/modules/groups/presentation/graphql/resolvers/groups.resolver.ts
apps/api/src/modules/groups/application/use-cases/my-groups.use-case.spec.ts
apps/api/prisma/seed.ts
apps/mobile/src/features/groups/graphql/groups.graphql
apps/mobile/src/graphql/generated/index.ts
apps/mobile/src/features/groups/screens/my-groups-screen.tsx
apps/mobile/src/features/groups/components/group-list.tsx
apps/mobile/src/features/groups/components/group-list-item.tsx
apps/mobile/src/features/groups/components/index.ts
apps/mobile/src/i18n/resources/en/groups.ts
apps/mobile/src/i18n/resources/uk/groups.ts
docs/domain/lesson-flow.md
docs/release/mvp-smoke-tests.md
docs/tasks/30-sot-discrepancies.md
```

## Requirements

```txt
1. Replace full-width Create/Invitations buttons with compact action cards.
2. Your Groups: equal-height bordered rows with name, description, member count,
   Owner/Member badge, avatar initials, chevron.
3. Owner rows may show ⋯ for invite/share. Do not change permission rules.
4. Seed several demo groups with mixed Owner/Member roles and sizes.
5. myGroups may expose existing membership data for the list. No Prisma schema change.
6. Update live SoT. Do not rewrite docs/tasks/done/*.
7. Mark TASK-30.29 and DISC-026 DONE.
```

## Security Requirements

```txt
- Do not commit secrets.
- membersPreview exposes initials only, not emails.
```

## Architecture Constraints

```txt
- Do not change GroupPermissionService or invite/share rules.
- Do not change learning-steps or queue behavior.
```

## Implementation Notes

```txt
- Keep the existing Demo Study Group share fixture. Add extra layout groups.
```

## Acceptance Criteria

```txt
- My Groups has no stacked full-width gray Create/Invitations buttons.
- Demo user sees Owner and Member rows with different member counts.
- Mobile typecheck, format:check, and docs:lint pass.
```

## Commands to Run

```bash
pnpm --filter @flashcards/api test -- src/modules/groups/application/use-cases/my-groups.use-case.spec.ts src/modules/groups/domain/utils/member-initials.spec.ts
pnpm --filter @flashcards/mobile typecheck
pnpm format:check
pnpm docs:lint
```

## Manual Checks

```txt
None (human: My Groups layout + re-seed).
```

## Do Not Do

```txt
- Do not change who can invite, share, or copy group decks.
- Do not push.
```

## Expected Commit Message

```txt
TASK-30.29 Restyle My Groups into compact rows and seed demo groups
```

---

# TASK-30.30 Restyle group invitations into pending cards and a clear empty state

## Status

DONE

## Context

DISC-027: Invitations show status/expiry chrome and a one-line empty state. Product wants pending decision cards and a proper empty screen.

## Goal

Group Invitations is a utilitarian pending list. Accept/Decline remove the card. Empty state points back to My Groups.

## Related Documents

```txt
docs/tasks/30-sot-discrepancies.md
docs/domain/lesson-flow.md
docs/security/security-checklist.md
docs/domain/permissions.md
```

## Files to Create

```txt
None
```

## Files to Modify

```txt
apps/api/src/modules/groups/domain/types/group-invitation.type.ts
apps/api/src/modules/groups/application/ports/group-invitation-repository.port.ts
apps/api/src/modules/groups/infrastructure/persistence/prisma-group-invitation.repository.ts
apps/api/src/modules/groups/application/use-cases/my-group-invitations.use-case.ts
apps/api/src/modules/groups/application/use-cases/my-group-invitations.use-case.spec.ts
apps/api/src/modules/groups/presentation/graphql/types/group-invitation.type.ts
apps/api/src/modules/groups/presentation/graphql/resolvers/groups.resolver.ts
apps/api/prisma/seed.ts
apps/mobile/src/features/groups/graphql/groups.graphql
apps/mobile/src/graphql/generated/index.ts
apps/mobile/src/features/groups/screens/group-invitations-screen.tsx
apps/mobile/src/features/groups/components/group-invitation-list.tsx
apps/mobile/src/features/groups/components/group-invitation-list-item.tsx
apps/mobile/src/i18n/resources/en/groups.ts
apps/mobile/src/i18n/resources/uk/groups.ts
docs/domain/lesson-flow.md
docs/release/mvp-smoke-tests.md
docs/tasks/30-sot-discrepancies.md
```

## Requirements

```txt
1. Pending cards: group name, invited by, member count, shared-deck count if known.
2. Accept is primary. Decline is secondary. No confirm dialogs. No status/expiry chrome.
3. Accept/Decline remove the card. Accept also refreshes My Groups. Do not navigate away.
4. Empty: envelope, No invitations, short copy, Back to My Groups.
5. Seed pending invitation(s) for the demo user. Do not change permission rules.
6. Update live SoT. Do not rewrite docs/tasks/done/*.
7. Mark TASK-30.30 and DISC-027 DONE.
```

## Security Requirements

```txt
- Do not commit secrets.
- Invited-by shows email already stored on the user record.
```

## Architecture Constraints

```txt
- Do not change GroupPermissionService or accept/decline rules.
```

## Implementation Notes

```txt
- myGroupInvitations already returns pending only; keep that filter.
```

## Acceptance Criteria

```txt
- Empty invitations is not a single gray sentence.
- Accept does not open group detail. The card leaves the list.
- Mobile typecheck, format:check, and docs:lint pass.
```

## Commands to Run

```bash
pnpm --filter @flashcards/api exec jest --watchman=false src/modules/groups/application/use-cases/my-group-invitations.use-case.spec.ts
pnpm --filter @flashcards/mobile typecheck
pnpm format:check
pnpm docs:lint
```

## Manual Checks

```txt
None (human: invitations empty + accept/decline).
```

## Do Not Do

```txt
- Do not change who can invite or accept.
- Do not push.
```

## Expected Commit Message

```txt
TASK-30.30 Restyle group invitations into pending cards and a clear empty state
```

---

# TASK-30.31 Restyle Create Group into a compact form card

## Status

DONE

## Context

DISC-028: Create Group is two loose inputs and two large gray buttons. Product wants a compact form card.

## Goal

Create Group is a narrow bordered form: primary Create, text Cancel, limits, loading, then Group Detail.

## Related Documents

```txt
docs/tasks/30-sot-discrepancies.md
docs/domain/lesson-flow.md
docs/security/security-checklist.md
```

## Files to Create

```txt
None
```

## Files to Modify

```txt
apps/mobile/src/features/groups/screens/create-group-screen.tsx
apps/mobile/src/features/groups/components/group-form.tsx
apps/mobile/src/features/groups/validation/group-form.schema.ts
apps/mobile/src/i18n/resources/en/groups.ts
apps/mobile/src/i18n/resources/uk/groups.ts
apps/api/src/modules/groups/application/use-cases/create-group.use-case.ts
apps/api/src/modules/groups/application/use-cases/create-group.use-case.spec.ts
docs/domain/lesson-flow.md
docs/release/mvp-smoke-tests.md
docs/tasks/30-sot-discrepancies.md
```

## Requirements

```txt
1. Wrap fields in a bordered rounded card. Desktop form width about 500–600px.
2. Create group is a primary blue button. Cancel is a text action outside the card.
3. Description is a multiline textarea. Name 1–60. Description up to 300.
4. Create is disabled while name is empty. Show loading while submitting.
5. Success navigates to Group Detail. Short view-only copy stays under the title.
6. Align create-group backend max lengths with the form. Do not change permissions.
7. Update live SoT. Do not rewrite docs/tasks/done/*. Mark TASK-30.31 and DISC-028 DONE.
```

## Security Requirements

```txt
- Do not commit secrets.
```

## Architecture Constraints

```txt
- Do not change who can create groups or become owner.
```

## Implementation Notes

```txt
- GroupForm is only used by Create Group.
```

## Acceptance Criteria

```txt
- Create Group has one primary button and a text Cancel.
- Empty name cannot submit. Success opens Group Detail.
- Mobile typecheck, format:check, and docs:lint pass.
```

## Commands to Run

```bash
pnpm --filter @flashcards/api exec jest --watchman=false src/modules/groups/application/use-cases/create-group.use-case.spec.ts
pnpm --filter @flashcards/mobile typecheck
pnpm format:check
pnpm docs:lint
```

## Manual Checks

```txt
None (human: Create Group card + cancel).
```

## Do Not Do

```txt
- Do not add extra settings fields.
- Do not push.
```

## Expected Commit Message

```txt
TASK-30.31 Restyle Create Group into a compact form card
```

---

# TASK-30.32 Keep bottom tabs visible on group screens

## Status

DONE

## Context

DISC-029: `/groups` and `/groups/invitations` live on the root stack, so the bottom tab bar disappears. Same bug class as TASK-25.05 for decks.

## Goal

Group list, invitations, create, detail, and share-deck stay inside `(tabs)` so Home / Decks / Profile remain visible. URLs stay `/groups/...`.

## Related Documents

```txt
docs/tasks/30-sot-discrepancies.md
docs/domain/lesson-flow.md
docs/tasks/done/25-bugfixes.md
```

## Files to Create

```txt
apps/mobile/app/(tabs)/groups/_layout.tsx
apps/mobile/app/(tabs)/groups/index.tsx
apps/mobile/app/(tabs)/groups/new.tsx
apps/mobile/app/(tabs)/groups/invitations.tsx
apps/mobile/app/(tabs)/groups/[groupId]/index.tsx
apps/mobile/app/(tabs)/groups/[groupId]/share-deck.tsx
```

## Files to Modify

```txt
apps/mobile/app/_layout.tsx
apps/mobile/app/(tabs)/_layout.tsx
docs/domain/lesson-flow.md
docs/release/mvp-smoke-tests.md
docs/tasks/30-sot-discrepancies.md
```

## Requirements

```txt
1. Move app/groups/* under app/(tabs)/groups/.
2. Remove root Stack.Screen name="groups".
3. Register groups in Tabs with href: null (not a fourth tab).
4. Keep /groups, /groups/new, /groups/invitations, /groups/[groupId] working.
5. Update live SoT. Do not rewrite docs/tasks/done/*.
6. Mark TASK-30.32 and DISC-029 DONE.
```

## Security Requirements

```txt
- Do not commit secrets.
```

## Architecture Constraints

```txt
- UI routing only. Do not change group permissions.
```

## Implementation Notes

```txt
- Follow public/preview: hidden tab, StudyLanguageProtectedStack layout.
```

## Acceptance Criteria

```txt
- My Groups and Invitations show Home / Decks / Profile tabs.
- Create Group and Group Detail also keep the tab bar.
- Mobile typecheck, format:check, and docs:lint pass.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm format:check
pnpm docs:lint
```

## Manual Checks

```txt
None (human: tab bar on /groups and /groups/invitations).
```

## Do Not Do

```txt
- Do not add a Groups tab button.
- Do not push.
```

## Expected Commit Message

```txt
TASK-30.32 Keep bottom tabs visible on group screens
```

---

# TASK-30.33 Restyle Edit Card into a compact form with AI helper

## Status

DONE

## Context

DISC-030: Edit Card is a tall stack of equal fields plus full-width gray Save/Cancel and a large Generate examples block.

## Goal

Compact Edit Card: main fields in a card, Generate next to Example, AI suggestions with Use selected, primary Save, text Cancel, small Danger zone Delete. Confirm unsaved leave. Save disabled when clean or Front/Back invalid.

## Related Documents

```txt
docs/tasks/30-sot-discrepancies.md
docs/domain/lesson-flow.md
docs/architecture.md
docs/domain/permissions.md
```

## Files to Modify

```txt
apps/mobile/src/features/decks/hooks/use-unsaved-changes-guard.ts
apps/mobile/src/features/decks/hooks/index.ts
apps/mobile/src/features/decks/components/card-form.tsx
apps/mobile/src/features/decks/screens/edit-card-screen.tsx
apps/mobile/src/features/decks/screens/create-card-screen.tsx
apps/mobile/src/features/ai-examples/components/ai-example-generator.tsx
apps/mobile/src/features/ai-examples/components/generated-example-list.tsx
apps/mobile/src/features/ai-examples/components/generated-example-list-item.tsx
apps/mobile/src/i18n/resources/en/ai-examples.ts
apps/mobile/src/i18n/resources/uk/ai-examples.ts
apps/mobile/src/i18n/resources/en/decks.ts
apps/mobile/src/i18n/resources/uk/decks.ts
docs/domain/lesson-flow.md
docs/architecture.md
docs/release/mvp-smoke-tests.md
docs/tasks/30-sot-discrepancies.md
```

## Requirements

```txt
1. Compact form card, maxWidth 640. Front/Back single-line; Example/Notes textarea.
2. Generate is compact icon+text next to Example. After generate: radio list + Use selected.
3. Use selected fills Example only; persist on Save changes. Do not auto-save; drop Save to card from this UI.
4. Save changes primary blue, disabled when not dirty or Front/Back empty/invalid.
5. Cancel is text. Delete is a small Danger zone (still confirms).
6. Confirm before leaving with unsaved changes (navigation + web beforeunload).
7. CardForm stays shared; Add Card gets compact fields/actions without Generate/Delete.
8. Update live SoT. Do not rewrite docs/tasks/done/*.
9. Mark TASK-30.33 and DISC-030 DONE.
```

## Security Requirements

```txt
- Do not commit secrets.
- AI generate still requires card ownership (existing mutation).
```

## Architecture Constraints

```txt
- UI only. Do not change generateCardExamples / saveGeneratedCardExample backend.
- Generated examples must not auto-save onto the card.
```

## Implementation Notes

```txt
- Follow Create Group: bordered card, #1a56db primary, text Cancel.
- Keep delete confirm. Skip leave-guard after successful save/delete.
```

## Acceptance Criteria

```txt
- Edit Card matches the compact layout; Generate is not a large section.
- Save disabled until a valid change exists.
- Leave with dirty form shows confirm.
- Mobile typecheck, format:check, and docs:lint pass.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm format:check
pnpm docs:lint
```

## Manual Checks

```txt
None (human: Edit Card layout, Generate, unsaved confirm).
```

## Do Not Do

```txt
- Do not restyle Edit Deck or deck detail.
- Do not change AI rate limits or provider.
- Do not push.
```

## Expected Commit Message

```txt
TASK-30.33 Restyle Edit Card into a compact form with AI helper
```

---

# TASK-30.34 Disable Groups and Invitations on Profile

## Status

DONE

## Context

DISC-031: Groups and Invitations on Profile should be disabled for now. Keep groups screens and APIs as they are.

## Goal

Profile Groups and Invitations rows stay visible but do not navigate.

## Related Documents

```txt
docs/tasks/30-sot-discrepancies.md
docs/domain/lesson-flow.md
```

## Files to Modify

```txt
apps/mobile/src/features/settings/components/settings-nav-row.tsx
apps/mobile/src/features/profile/screens/profile-screen.tsx
docs/domain/lesson-flow.md
docs/release/mvp-smoke-tests.md
docs/tasks/30-sot-discrepancies.md
```

## Requirements

```txt
1. Disable Groups and Invitations on Profile (visible, not tappable).
2. Do not remove group screens, routes, or API.
3. Update live SoT. Do not rewrite docs/tasks/done/*.
4. Mark TASK-30.34 and DISC-031 DONE.
```

## Security Requirements

```txt
- Do not commit secrets.
```

## Architecture Constraints

```txt
- UI only. Do not change group permissions or backend.
```

## Implementation Notes

```txt
- Add disabled to SettingsNavRow. Keep onPress wired for later re-enable.
```

## Acceptance Criteria

```txt
- Profile Groups and Invitations do not navigate.
- Direct /groups URLs still work.
- Mobile typecheck, format:check, and docs:lint pass.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm format:check
pnpm docs:lint
```

## Manual Checks

```txt
None (human: disabled Groups/Invitations on Profile).
```

## Do Not Do

```txt
- Do not delete groups feature code.
- Do not push.
```

## Expected Commit Message

```txt
TASK-30.34 Disable Groups and Invitations on Profile
```

---

# TASK-30.35 Restyle Edit Deck into a compact form with a language pair

## Status

DONE

## Context

DISC-032: Edit Deck is a long form. Two language fields dominate the page; Save/Cancel are full-width gray buttons.

## Goal

Compact Edit Deck card like Edit Card: textarea description, Languages as a Target → Source pair, primary Save (disabled when clean), text Cancel. Warn about language change only when changing, not as a persistent banner.

## Related Documents

```txt
docs/tasks/30-sot-discrepancies.md
docs/domain/lesson-flow.md
```

## Files to Modify

```txt
apps/mobile/src/features/decks/components/deck-form.tsx
apps/mobile/src/features/decks/screens/edit-deck-screen.tsx
apps/mobile/src/features/decks/screens/create-deck-screen.tsx
apps/mobile/src/features/decks/screens/assign-deck-languages-screen.tsx
apps/mobile/src/i18n/resources/en/decks.ts
apps/mobile/src/i18n/resources/uk/decks.ts
docs/domain/lesson-flow.md
docs/release/mvp-smoke-tests.md
docs/tasks/30-sot-discrepancies.md
```

## Requirements

```txt
1. Compact form card, maxWidth 640. Description is a textarea.
2. Languages is one pair block: flag + name → flag + name, Target/Source captions, chevrons.
3. Drop (front)/(back) from labels. Modal titles stay Target language / Source language.
4. Remove the always-on same-language banner; warn on pick/save only.
5. Keep existing save-time confirm when editing languages of a deck with cards.
6. Save changes primary blue, disabled when nothing changed or title/languages invalid.
7. Cancel is text. DeckForm stays shared (Create/Assign inherit compact layout).
8. Update live SoT. Do not rewrite docs/tasks/done/*.
9. Mark TASK-30.35 and DISC-032 DONE.
```

## Security Requirements

```txt
- Do not commit secrets.
```

## Architecture Constraints

```txt
- UI only. Do not change language validation or GraphQL.
```

## Implementation Notes

```txt
- Follow CardForm: bordered card, #1a56db primary, text Cancel.
- Compact language label is flag + nativeName, not native + (english).
```

## Acceptance Criteria

```txt
- Edit Deck matches the compact layout; language pair is one block.
- Save disabled until a valid change exists.
- Mobile typecheck, format:check, and docs:lint pass.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm format:check
pnpm docs:lint
```

## Manual Checks

```txt
None (human: Edit Deck layout and language pickers).
```

## Do Not Do

```txt
- Do not restyle deck detail.
- Do not change which languages can be assigned.
- Do not push.
```

## Expected Commit Message

```txt
TASK-30.35 Restyle Edit Deck into a compact form with a language pair
```

---

# TASK-30.36 Remove the language pair arrow from deck forms

## Status

DONE

## Context

DISC-033: The → between Target and Source on Create/Edit Deck is decorative noise next to chevrons.

## Goal

Languages block shows Target and Source side by side with no arrow.

## Related Documents

```txt
docs/tasks/30-sot-discrepancies.md
docs/domain/lesson-flow.md
```

## Files to Modify

```txt
apps/mobile/src/features/decks/components/deck-form.tsx
docs/domain/lesson-flow.md
docs/release/mvp-smoke-tests.md
docs/tasks/30-sot-discrepancies.md
```

## Requirements

```txt
1. Remove the → between Target and Source.
2. Keep the compact pair block and chevron selectors.
3. Update live SoT. Do not rewrite docs/tasks/done/*.
4. Mark TASK-30.36 and DISC-033 DONE.
```

## Security Requirements

```txt
- Do not commit secrets.
```

## Architecture Constraints

```txt
- UI only.
```

## Implementation Notes

```txt
- Keep a gap between the two selectors.
```

## Acceptance Criteria

```txt
- Create/Edit Deck language block has no →.
- Mobile typecheck, format:check, and docs:lint pass.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm format:check
pnpm docs:lint
```

## Manual Checks

```txt
None (human: language block on Create/Edit Deck).
```

## Do Not Do

```txt
- Do not restyle the rest of DeckForm.
- Do not push.
```

## Expected Commit Message

```txt
TASK-30.36 Remove the language pair arrow from deck forms
```

---

# TASK-30.37 Restyle deck Cards into a header, count, and empty state

## Status

DONE

## Context

DISC-034: Cards on deck detail is a large bordered box with a full-width gray Add card, while + already sits next to Edit.

## Goal

Cards is a section header with a count and + Add card on the right. Empty state is icon + No cards yet. No outer box, no gray empty button, no + next to Edit.

## Related Documents

```txt
docs/tasks/30-sot-discrepancies.md
docs/domain/lesson-flow.md
```

## Files to Modify

```txt
apps/mobile/src/features/decks/components/card-list.tsx
apps/mobile/src/features/decks/components/deck-actions.tsx
apps/mobile/src/features/decks/screens/deck-detail-screen.tsx
apps/mobile/src/i18n/resources/en/decks.ts
apps/mobile/src/i18n/resources/uk/decks.ts
docs/domain/lesson-flow.md
docs/release/mvp-smoke-tests.md
docs/tasks/30-sot-discrepancies.md
```

## Requirements

```txt
1. Remove the outer border around the Cards list.
2. Header: Cards + count, owner + Add card on the right.
3. Empty: 📇, No cards yet, owner hint. No full-width Add card button.
4. Remove the + icon next to Edit. Keep language-gate on Add card.
5. Update live SoT. Do not rewrite docs/tasks/done/*.
6. Mark TASK-30.37 and DISC-034 DONE.
```

## Security Requirements

```txt
- Do not commit secrets.
```

## Architecture Constraints

```txt
- UI only. Do not change card delete or permissions.
```

## Implementation Notes

```txt
- Word rows keep their own border and inset. Do not restyle deck stats or Danger zone.
```

## Acceptance Criteria

```txt
- Empty deck: section header with 0 cards and + Add card; no gray button; no + by Edit.
- Mobile typecheck, format:check, and docs:lint pass.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm format:check
pnpm docs:lint
```

## Manual Checks

```txt
None (human: empty and non-empty Cards on deck detail).
```

## Do Not Do

```txt
- Do not restyle card rows or Danger zone.
- Do not push.
```

## Expected Commit Message

```txt
TASK-30.37 Restyle deck Cards into a header, count, and empty state
```

---

# TASK-30.38 Align Deck Detail stats icons with My Decks

## Status

DONE

## Context

DISC-035: Deck Detail group stats use 🌱 / 🔁, while My Decks cards use 📖 / ✏️ / ✅.

## Goal

To learn / Practiced / Learned on Deck Detail use the same icons as My Decks. Word-row badges stay 🌱 / 🔁 / ✅.

## Related Documents

```txt
docs/tasks/30-sot-discrepancies.md
docs/domain/lesson-flow.md
```

## Files to Modify

```txt
apps/mobile/src/features/decks/utils/learning-group-style.ts
apps/mobile/src/features/decks/components/learning-group-stats-row.tsx
apps/mobile/src/features/lessons/components/deck-learning-stats-card.tsx
docs/domain/lesson-flow.md
docs/tasks/30-sot-discrepancies.md
```

## Requirements

```txt
1. Share 📖 / ✏️ / ✅ for stats (My Decks and Deck Detail).
2. Do not change word-row badge emojis.
3. Update live SoT. Do not rewrite docs/tasks/done/*.
4. Mark TASK-30.38 and DISC-035 DONE.
```

## Security Requirements

```txt
- Do not commit secrets.
```

## Architecture Constraints

```txt
- UI only.
```

## Implementation Notes

```txt
- Keep LEARNING_GROUP_STYLE.emoji for badges; add a shared stats-emoji map.
```

## Acceptance Criteria

```txt
- Deck Detail group stats show 📖 / ✏️ / ✅.
- Mobile typecheck, format:check, and docs:lint pass.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm format:check
pnpm docs:lint
```

## Manual Checks

```txt
None (human: Deck Detail stats vs My Decks cards).
```

## Do Not Do

```txt
- Do not restyle stats layout.
- Do not push.
```

## Expected Commit Message

```txt
TASK-30.38 Align Deck Detail stats icons with My Decks
```

---

# TASK-30.39 Make review a tap-to-flip card with swipe answers

## Status

DONE

## Context

DISC-036: Review is a text block with Reveal answer and two large buttons. Product wants a physical flashcard: tap to flip, swipe to answer, compact fallback buttons.

## Goal

Centered flashcard; tap/click flips (~200ms). After reveal, swipe right = Know, swipe left = Don't know, with a short swipe-out. Keep compact fallback buttons. Leave review is secondary text. Do not change SRS, submitReview, or the queue.

## Related Documents

```txt
docs/tasks/30-sot-discrepancies.md
docs/domain/lesson-flow.md
docs/architecture.md
```

## Files to Modify

```txt
apps/mobile/src/features/lessons/components/review-flashcard.tsx
apps/mobile/src/features/lessons/components/review-answer-actions.tsx
apps/mobile/src/features/lessons/screens/lesson-review-screen.tsx
apps/mobile/src/i18n/resources/en/lessons.ts
apps/mobile/src/i18n/resources/uk/lessons.ts
docs/domain/lesson-flow.md
docs/architecture.md
docs/release/mvp-smoke-tests.md
docs/tasks/30-sot-discrepancies.md
```

## Requirements

```txt
1. Center a visual flashcard. No Reveal answer button. Tap/click flips (~200ms, 2D scaleX).
2. Swipes disabled until revealed. Then right = Know, left = Don't know; swipe-out ~200ms; next card immediately after submit.
3. Compact fallback Don't know / Know. Leave review is a text action, not a large button.
4. Short swipe hints after reveal. No heavy 3D.
5. Do not change submitReview, learning-steps, or queue picker.
6. Update live SoT. Do not rewrite docs/tasks/done/*.
7. Mark TASK-30.39 and DISC-036 DONE.
```

## Security Requirements

```txt
- Do not commit secrets.
```

## Architecture Constraints

```txt
- Presentation/interaction only. Backend remains SoT for scheduling.
```

## Implementation Notes

```txt
- RN Animated + PanResponder for flip/swipe (web mouse + touch). No gesture-handler.
- Reset flip/position when the current card changes.
```

## Acceptance Criteria

```txt
- Reveal is tap/click on the card, not a Reveal answer button.
- Know / Don't know work via swipe after reveal and via fallback buttons.
- Mobile typecheck, format:check, and docs:lint pass.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm format:check
pnpm docs:lint
```

## Manual Checks

```txt
None (human: flip, swipe, fallback buttons, Leave review).
```

## Do Not Do

```txt
- Do not add react-native-gesture-handler unless required.
- Do not change SRS intervals or queue rules.
- Do not push.
```

## Expected Commit Message

```txt
TASK-30.39 Make review a tap-to-flip card with swipe answers
```

---

# TASK-30.40 Show question/answer only and tighten the review layout

## Status

DONE

## Context

DISC-037: Review labels Front/Back, keeps both sides after flip, and vertically centers a short card so the top of the screen is empty.

## Goal

Show only the prompt side, then only the answer side, using promptDirection as question/answer. No Front/Back labels. Taller card packed under the header with actions close below. Hide the swipe hint after a few answers.

## Related Documents

```txt
docs/tasks/30-sot-discrepancies.md
docs/domain/lesson-flow.md
docs/architecture.md
```

## Files to Modify

```txt
apps/mobile/src/features/lessons/components/review-flashcard.tsx
apps/mobile/src/features/lessons/components/review-answer-actions.tsx
apps/mobile/src/features/lessons/screens/lesson-review-screen.tsx
apps/mobile/src/features/lessons/utils/get-review-sides.ts
apps/mobile/src/features/lessons/storage/review-swipe-hint-storage.ts
apps/mobile/src/features/lessons/hooks/use-review-swipe-hint.ts
apps/mobile/src/i18n/resources/en/lessons.ts
apps/mobile/src/i18n/resources/uk/lessons.ts
apps/mobile/src/ui/utils/responsive.ts
docs/domain/lesson-flow.md
docs/architecture.md
docs/release/mvp-smoke-tests.md
docs/tasks/30-sot-discrepancies.md
```

## Requirements

```txt
1. Map promptDirection to question/answer. Do not show Front/Back labels.
2. Before tap: question only + Tap to reveal. After flip: answer only (example/notes if present).
3. Pack header → card → hint → buttons. Do not vertically center the card in the viewport.
4. Card height ~1.5–1.7 width:height, min ~360px. Word centered in the card.
5. Swipe hint under the card after reveal; hide after 3 answers. Fallback buttons stay.
6. Do not change submitReview, learning-steps, or queue picker.
7. Update live SoT. Do not rewrite docs/tasks/done/*.
8. Mark TASK-30.40 and DISC-037 DONE.
```

## Security Requirements

```txt
- Do not commit secrets.
```

## Architecture Constraints

```txt
- Presentation only. promptDirection still comes from the backend.
```

## Implementation Notes

```txt
- Derive question/answer from promptDirection in the UI layer.
- Persist swipe-hint answer count in AsyncStorage.
```

## Acceptance Criteria

```txt
- No Front/Back labels. Flip replaces the question with the answer.
- Card sits under the header; actions sit close under the card.
- Mobile typecheck, format:check, and docs:lint pass.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm format:check
pnpm docs:lint
```

## Manual Checks

```txt
None (human: both directions, layout on web and mobile, hint hides after a few answers).
```

## Do Not Do

```txt
- Do not change promptDirection rules or SRS.
- Do not push.
```

## Expected Commit Message

```txt
TASK-30.40 Show question/answer only and tighten the review layout
```

---

# TASK-30.41 Use Learn / Practiced / Learned icons on deck card badges

## Status

DONE

## Context

DISC-038: Deck card rows show 🌱 To learn / 🔁 Practiced. Product wants the same 📖 Learn / ✏️ Practiced / ✅ Learned as group stats.

## Goal

Card-row badges use 📖 / ✏️ / ✅ and Learn / Practiced / Learned. Do not change stats layout or SRS groups.

## Related Documents

```txt
docs/tasks/30-sot-discrepancies.md
docs/domain/lesson-flow.md
```

## Files to Modify

```txt
apps/mobile/src/features/decks/utils/learning-group-style.ts
apps/mobile/src/i18n/resources/en/decks.ts
apps/mobile/src/i18n/resources/uk/decks.ts
docs/domain/lesson-flow.md
docs/tasks/30-sot-discrepancies.md
```

## Requirements

```txt
1. Word-row badges: 📖 Learn, ✏️ Practiced, ✅ Learned.
2. Keep badge colors. Do not change stats row layout.
3. Update live SoT. Do not rewrite docs/tasks/done/*.
4. Mark TASK-30.41 and DISC-038 DONE.
```

## Security Requirements

```txt
- Do not commit secrets.
```

## Architecture Constraints

```txt
- Labels and icons only. learningGroup enum and step mapping stay the same.
```

## Implementation Notes

```txt
- LEARNING_GROUP_STYLE.emoji is what the card-row badge renders.
```

## Acceptance Criteria

```txt
- Deck card badges show Learn (not To learn) with 📖 / ✏️ / ✅.
- Mobile typecheck, format:check, and docs:lint pass.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm format:check
pnpm docs:lint
```

## Manual Checks

```txt
None (human: deck detail Cards list).
```

## Do Not Do

```txt
- Do not change Home copy or GraphQL learningGroup values.
- Do not push.
```

## Expected Commit Message

```txt
TASK-30.41 Use Learn / Practiced / Learned icons on deck card badges
```

---

# TASK-30.42 Refetch learning stats after card create and delete

## Status

DONE

## Context

DISC-039: After adding a card, DeckCards updates but Total cards / Due now / Learn counts on deck detail and My Decks stay stale until reload. Those counts come from DeckLearningStats, which was not refetched.

## Goal

Create, delete, and CSV import refetch DeckCards, DeckLearningStats, and HomeLearningProgress so counts update without a full reload.

## Related Documents

```txt
docs/tasks/30-sot-discrepancies.md
docs/domain/lesson-flow.md
docs/architecture.md
```

## Files to Modify

```txt
apps/mobile/src/features/decks/utils/card-mutation-cache.ts
apps/mobile/src/features/decks/screens/create-card-screen.tsx
apps/mobile/src/features/decks/screens/edit-card-screen.tsx
apps/mobile/src/features/decks/screens/deck-detail-screen.tsx
apps/mobile/src/features/csv-import/screens/csv-import-screen.tsx
docs/domain/lesson-flow.md
docs/architecture.md
docs/tasks/30-sot-discrepancies.md
```

## Requirements

```txt
1. After create/delete card and CSV import: refetch DeckCards, DeckLearningStats, HomeLearningProgress.
2. Evict cached stats so inactive My Decks / Home queries do not stay stale.
3. Do not change GraphQL schema or how stats are calculated.
4. Update live SoT. Do not rewrite docs/tasks/done/*.
5. Mark TASK-30.42 and DISC-039 DONE.
```

## Security Requirements

```txt
- Do not commit secrets.
```

## Architecture Constraints

```txt
- Follow architecture: refetchQueries after create/update/delete in MVP.
```

## Implementation Notes

```txt
- Shared CARD_MUTATION_REFETCH_QUERIES + evictCardCountCache.
- Update-card text does not change counts; leave its refetch as DeckCards only.
```

## Acceptance Criteria

```txt
- Add a card, return to deck detail: Total cards and Learn counts match the list.
- My Decks compact counts update without a full reload.
- Mobile typecheck, format:check, and docs:lint pass.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm format:check
pnpm docs:lint
```

## Manual Checks

```txt
None (human: add card, check deck detail + My Decks counts).
```

## Do Not Do

```txt
- Do not add optimistic UI.
- Do not push.
```

## Expected Commit Message

```txt
TASK-30.42 Refetch learning stats after card create and delete
```

---

# TASK-30.43 Simplify the review complete screen

## Status

DONE

## Context

DISC-040: Review complete uses three equal full-width buttons and still shows Cards in this review. Product wants a clear hierarchy, no card-count stats, and Home vs Back to deck from session scope.

## Goal

Narrow centered completion with an icon, muted date, primary Start another review, text Back to deck or Home, and All decks. Do not show Cards in this review.

## Related Documents

```txt
docs/tasks/30-sot-discrepancies.md
docs/domain/lesson-flow.md
docs/architecture.md
```

## Files to Modify

```txt
apps/mobile/src/features/lessons/screens/lesson-summary-screen.tsx
apps/mobile/src/features/lessons/screens/lesson-review-screen.tsx
apps/mobile/src/features/lessons/types/active-lesson.ts
apps/mobile/src/i18n/formatters.ts
apps/mobile/src/i18n/resources/en/lessons.ts
apps/mobile/src/i18n/resources/uk/lessons.ts
docs/domain/lesson-flow.md
docs/architecture.md
docs/release/mvp-smoke-tests.md
docs/smoke/lesson-queue.md
docs/tasks/30-sot-discrepancies.md
```

## Requirements

```txt
1. Primary: Start another review. Deck session starts that deck; Home session starts Home review.
2. Secondary text: Back to deck (deck) or Home (Home). All decks is a text link.
3. No Cards in this review. Muted date. Completion icon. Column ~480px.
4. Persist session scope on completion so Home vs deck is not guessed from URL alone.
5. Update live SoT. Do not rewrite docs/tasks/done/*.
6. Mark TASK-30.43 and DISC-040 DONE.
```

## Security Requirements

```txt
- Do not commit secrets.
```

## Architecture Constraints

```txt
- Presentation only. completeLesson payload unchanged.
```

## Implementation Notes

```txt
- Home Start another calls startHomeLesson; if empty, go Home.
```

## Acceptance Criteria

```txt
- Deck complete: Start another, Back to deck, All decks. No card count.
- Home complete: Start another, Home, All decks.
- Mobile typecheck, format:check, and docs:lint pass.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm format:check
pnpm docs:lint
```

## Manual Checks

```txt
None (human: complete a deck review and a Home review).
```

## Do Not Do

```txt
- Do not change completeLesson GraphQL stats.
- Do not push.
```

## Expected Commit Message

```txt
TASK-30.43 Simplify the review complete screen
```

---

# TASK-30.44 Keep bottom tabs visible on review complete

## Status

DONE

## Context

DISC-041: Review complete lives under `app/lessons`, outside the tab navigator, so Home / Decks / Profile disappear. Product wants the completion screen to keep the bottom tabs, like Groups.

## Goal

Move lesson routes under `(tabs)/lessons` as a hidden tab. Completion shows the tab bar. Active review hides it. URLs stay `/lessons/...`.

## Related Documents

```txt
docs/tasks/30-sot-discrepancies.md
docs/domain/lesson-flow.md
```

## Files to Modify

```txt
apps/mobile/app/_layout.tsx
apps/mobile/app/(tabs)/_layout.tsx
apps/mobile/app/(tabs)/lessons/_layout.tsx
apps/mobile/app/(tabs)/lessons/start.tsx
apps/mobile/app/(tabs)/lessons/[sessionId].tsx
apps/mobile/app/(tabs)/lessons/[sessionId]/summary.tsx
apps/mobile/src/features/lessons/hooks/use-lessons-tab-bar.ts
docs/domain/lesson-flow.md
docs/tasks/30-sot-discrepancies.md
```

## Requirements

```txt
1. Move app/lessons into app/(tabs)/lessons. Register a hidden tab (href: null).
2. Completion shows Home / Decks / Profile. Review and start hide the tab bar.
3. Keep /lessons/start, /lessons/:id, /lessons/:id/summary.
4. Update live SoT. Do not rewrite docs/tasks/done/*.
5. Mark TASK-30.44 and DISC-041 DONE.
```

## Security Requirements

```txt
- Do not commit secrets.
```

## Architecture Constraints

```txt
- Same pattern as groups/public/preview hidden tabs.
```

## Implementation Notes

```txt
- useLessonsTabBar: show tab bar only when the path ends in /summary.
```

## Acceptance Criteria

```txt
- Review complete shows the bottom tabs. Review itself does not.
- Mobile typecheck, format:check, and docs:lint pass.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm format:check
pnpm docs:lint
```

## Manual Checks

```txt
None (human: finish a review, confirm tabs on summary, hidden during review).
```

## Do Not Do

```txt
- Do not add a Lessons tab icon.
- Do not push.
```

## Expected Commit Message

```txt
TASK-30.44 Keep bottom tabs visible on review complete
```

---

# TASK-30.45 Refetch Home stats after deleting a deck

## Status

DONE

## Context

DISC-042: Delete deck refetches My Decks but not HomeLearningProgress, so Home counters stay stale until reload.

## Goal

After delete deck, refetch HomeLearningProgress (and related deck stats) and evict cached counts so Home updates without a full reload.

## Related Documents

```txt
docs/tasks/30-sot-discrepancies.md
docs/domain/lesson-flow.md
docs/architecture.md
```

## Files to Modify

```txt
apps/mobile/src/features/decks/components/deck-actions.tsx
docs/domain/lesson-flow.md
docs/architecture.md
docs/tasks/30-sot-discrepancies.md
```

## Requirements

```txt
1. deleteDeck refetchQueries include HomeLearningProgress and DeckLearningStats.
2. Evict cached homeLearningProgress / deckLearningStats (reuse evictCardCountCache).
3. Update live SoT. Do not rewrite docs/tasks/done/*.
4. Mark TASK-30.45 and DISC-042 DONE.
```

## Security Requirements

```txt
- Do not commit secrets.
```

## Architecture Constraints

```txt
- Follow architecture: refetchQueries after create/update/delete in MVP.
```

## Implementation Notes

```txt
- Keep MyDecks and DecksPage in the refetch list.
```

## Acceptance Criteria

```txt
- Delete a deck, open Home: Due now / group counts match without reload.
- Mobile typecheck, format:check, and docs:lint pass.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm format:check
pnpm docs:lint
```

## Manual Checks

```txt
None (human: delete a deck, check Home).
```

## Do Not Do

```txt
- Do not change deleteDeck permissions or API.
- Do not push.
```

## Expected Commit Message

```txt
TASK-30.45 Refetch Home stats after deleting a deck
```

---

# TASK-30.46 Refetch Home and My Decks stats after a review session

## Status

DONE

## Context

DISC-043: completeLesson and abandonLesson do not refetch HomeLearningProgress or DeckLearningStats, so Home and My Decks counters stay stale until reload.

## Goal

After complete or abandon review, refetch Home and deck learning stats and evict cached counts so those screens update without a full reload.

## Related Documents

```txt
docs/tasks/30-sot-discrepancies.md
docs/domain/lesson-flow.md
docs/architecture.md
```

## Files to Modify

```txt
apps/mobile/src/features/lessons/screens/lesson-review-screen.tsx
apps/mobile/src/features/decks/utils/card-mutation-cache.ts
docs/domain/lesson-flow.md
docs/architecture.md
docs/tasks/30-sot-discrepancies.md
```

## Requirements

```txt
1. completeLesson and abandonLesson refetchQueries include HomeLearningProgress
   and DeckLearningStats.
2. Evict cached homeLearningProgress / deckLearningStats (reuse evictCardCountCache).
3. Update live SoT. Do not rewrite docs/tasks/done/*.
4. Mark TASK-30.46 and DISC-043 DONE.
```

## Security Requirements

```txt
- Do not commit secrets.
```

## Architecture Constraints

```txt
- Follow architecture: refetchQueries after create/update/delete in MVP.
- Do not change SRS, submitReview payload, or the queue.
```

## Implementation Notes

```txt
- Reuse LEARNING_STATS_REFETCH_QUERIES from card-mutation-cache.
```

## Acceptance Criteria

```txt
- Finish or leave a review, open Home and My Decks: counts match without reload.
- Mobile typecheck, format:check, and docs:lint pass.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm format:check
pnpm docs:lint
```

## Manual Checks

```txt
None (human: finish a review, check Home and My Decks).
```

## Do Not Do

```txt
- Do not change submitReview, learning-steps, or queue picker.
- Do not push.
```

## Expected Commit Message

```txt
TASK-30.46 Refetch Home and My Decks stats after a review session
```

---

# Cursor Execution Rules

When working on a task in this epic, Cursor must follow these rules:

```txt
1. Read this epic and all Related Documents listed in the task first.
2. Implement only the current task. Do not start 30.02 or 30.03 from 30.01.
3. Do not add product features that are not in the task.
4. After 30.01, treat docs/domain/lesson-flow.md as live SoT for queue timing.
5. Do not weaken auth, permissions, or the security checklist.
6. Run all Commands to Run. Fix issues they find. Then commit with the Expected Commit Message.
7. If blocked or the discrepancy is still OPEN, stop and ask.
```
