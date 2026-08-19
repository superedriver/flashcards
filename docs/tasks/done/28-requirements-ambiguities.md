# EPIC-28 Requirements Ambiguities & Sources of Truth

## Epic Goal

Resolve contradictions and ambiguities between current requirements, live documentation, and already-implemented behavior so the project has one clear source of truth per area before new feature work.

This epic covers:

```txt
- audit of known ambiguities
- decisions recorded in this epic’s Ambiguity Register section
- focused tasks to align docs and/or code after each decision is approved
```

This epic does **not** include:

```txt
- new product features
- general repository dead-code cleanup
- cosmetic refactoring
- hypothetical future-release questions
- silently making product decisions during implementation
```

## Epic Status

DONE

## Related Documents

Cursor must read these documents before working on this epic:

```txt
docs/architecture.md
docs/backend-clean-architecture.md
docs/algorithms/learning-steps.md
docs/algorithms/sm-2.md
docs/domain/lesson-flow.md
docs/domain/permissions.md
docs/domain/auth-token-strategy.md
docs/security/security-checklist.md
docs/tasks/README.md
docs/tasks/cursor-task-template.md
docs/tasks/done/26-learning-steps.md
docs/tasks/done/27-learning-steps-bugfixes.md
```

## Epic Prerequisites

EPIC-26 and EPIC-27 should be complete (feature work and learning-steps bugfixes DONE).

Expected state:

```txt
- Learning steps are the implemented review model (packages/srs learning-steps)
- CardReviewState uses learningStep / longReviewSuccessCount / dueAt (not SM-2 fields)
- Live SoT docs describe Learning Steps as the current review model
- Local stack: Postgres + API (:3000) + mobile
```

## Known Ambiguities (backlog source)

```txt
1. SM-2 vs Learning Steps
   - Live architecture / clean-arch / tasks README still describe SM-2 as current
   - Implementation and learning-steps.md already replaced SM-2 (EPIC-26)
```

## Epic Rules

```txt
1. One approved ambiguity = one focused task = one commit.
2. Do not add product features or drive-by refactors.
3. Do not implement an ambiguous decision without explicit approval
   (chat approval or Ambiguity Register Status: APPROVED).
4. During audit-only work: only safe typo / broken-link fixes that do not
   change meaning or resolve an ambiguity.
5. Do not rewrite docs/tasks/done/* to erase historical SM-2 task logs.
6. Do not invent product debates for items already decided
   (e.g. Learning Steps replaced SM-2 in EPIC-26 — use short ALREADY_DECIDED entries).
7. Do not weaken validation, permissions, or security checklist rules.
8. Do not commit secrets.
9. Run Commands to Run in each task before committing.
10. Mark epic DONE when register entries are decided and approved fixes are done.
```

## Ambiguity Register

Decision records for this epic. Implementation tasks are below.

### Register statuses

```txt
OPEN       — documented, no decision yet
APPROVED   — decision approved; implementation task may proceed
DONE       — approved fix landed
DEFERRED   — explicitly postponed with owner note
```

### Entry types

```txt
DECISION_NEEDED — full template (conflict, behavior, why ambiguous, product decision?,
                  options, recommendation, impact, AC)
ALREADY_DECIDED — short template (conflict, current truth, action, impact, AC)
```

### AMB-001 SM-2 vs Learning Steps

Type:

```txt
ALREADY_DECIDED
```

Status:

```txt
DONE
```

Decision (prior):

```txt
EPIC-26 replaced SM-2 review scheduling with Learning Steps 0–8.
Current algorithm SoT: docs/algorithms/learning-steps.md
Historical only: docs/algorithms/sm-2.md
```

Conflicting sources:

```txt
Current truth:
  - packages/srs learning-steps implementation
  - docs/algorithms/learning-steps.md
  - docs/domain/lesson-flow.md (learning-steps oriented)

Stale / conflicting as current:
  - docs/architecture.md (SM-2 described as current in several sections)
  - docs/backend-clean-architecture.md (section "SRS and SM-2 Rules")
  - docs/tasks/README.md (frontend "do not calculate SM-2"; SoT listed sm-2.md for lessons)

Historical (keep):
  - docs/algorithms/sm-2.md (disclaimer present)
  - docs/tasks/done/* (task history)
  - Prisma migrations that added/dropped SM-2 columns
```

Current implementation behavior:

```txt
Runtime uses Learning Steps only.
Post-fix audit (TASK-28.01): no SM-2 / easeFactor / calculateNextReview in apps/ or packages/
TypeScript sources (migrations excluded). Live docs aligned to learning-steps.md.
```

Why this is ambiguous:

```txt
Live architecture docs still instruct SM-2 as the spaced-repetition model.
A later agent may implement wrong logic, old Prisma/GraphQL fields, or SM-2 tests.
```

Product decision needed?

```txt
No — already decided in EPIC-26.
Action is align live docs + confirm code audit.
```

Action:

```txt
TASK-28.01 Retire SM-2 as current SoT; align live docs to Learning Steps
```

Impact:

```txt
docs: architecture.md, backend-clean-architecture.md, tasks/README.md, sm-2.md disclaimer if needed
backend / frontend / Prisma schema / GraphQL: none expected if audit stays clean
tests: none expected if no SM-2 tests remain
migrations: do not rewrite history
```

Acceptance criteria (after TASK-28.01):

```txt
- Live SoT docs describe Learning Steps as the only current model
- SM-2 appears only as historical/superseded
- Code audit clean (or leftovers removed without BC)
```

## Recommended Task Order

```txt
28.01 Retire SM-2 as current SoT; align live docs to Learning Steps
```

## Task Checklist

- [x] TASK-28.01 Retire SM-2 as current SoT; align live docs to Learning Steps

---

# TASK-28.01 Retire SM-2 as current SoT; align live docs to Learning Steps

## Status

DONE

## Context

During EPIC-28 requirements audit, live docs still present SM-2 as the current spaced-repetition model while the product already runs Learning Steps after EPIC-26.

Risk if left unresolved:

```txt
- implement wrong scheduling logic
- re-add SM-2 Prisma / GraphQL fields
- write tests against SM-2
- break lesson flow assumptions
- maintain two models in parallel
```

Pre-task audit (2026-07-29):

```txt
- No SM-2 / easeFactor / calculateNextReview matches in apps/ or packages/ TypeScript sources
- Prisma migration history still mentions SM-2 columns (historical; do not rewrite)
- docs/algorithms/sm-2.md already has a historical disclaimer
- docs/algorithms/learning-steps.md is the intended current SoT
```

Register entry: `AMB-001` (APPROVED) in this epic file.

## Goal

Make Learning Steps the only current learning model in live sources of truth. Keep SM-2 historical only.

## Related Documents

```txt
docs/algorithms/learning-steps.md
docs/algorithms/sm-2.md
docs/architecture.md
docs/backend-clean-architecture.md
docs/tasks/README.md
docs/domain/lesson-flow.md
docs/tasks/done/26-learning-steps.md
docs/tasks/done/28-requirements-ambiguities.md
```

## Files to Create

```txt
None
```

## Files to Modify

```txt
docs/architecture.md
docs/backend-clean-architecture.md
docs/tasks/README.md
docs/algorithms/sm-2.md
docs/tasks/done/28-requirements-ambiguities.md
```

(`sm-2.md`: strengthen historical disclaimer only if needed. Do not rewrite `docs/tasks/done/*`. Do not edit Prisma migration SQL history.)

## Requirements

```txt
1. Treat docs/algorithms/learning-steps.md as the only current algorithm SoT.
2. Rewrite live SM-2-as-current wording in architecture.md, backend-clean-architecture.md,
   and live Cursor rules in tasks/README.md to Learning Steps.
3. Keep docs/algorithms/sm-2.md as historical with an explicit do-not-implement disclaimer.
4. Do not rewrite docs/tasks/done/* content (historical task logs).
5. Do not modify Prisma migration history.
6. Re-run code audit (grep for sm2 / SM-2 / easeFactor / intervalDays / repetitions /
   calculateNextReview in apps/ and packages/, excluding migrations).
   - If clean: record that under AMB-001; no fake refactor.
   - If leftovers in runtime code: delete without backward compatibility
     (no production release yet).
7. Do not resolve other seed ambiguities in this task.
8. Mark AMB-001 DONE and TASK-28.01 checklist item when finished.
```

## Security Requirements

```txt
- Docs-only / audit task; do not weaken auth, permissions, or token rules.
- Do not commit secrets.
```

## Acceptance Criteria

```txt
- In documents without historical/superseded marking, SM-2 is not described as the current learning model.
- architecture.md, backend-clean-architecture.md, and tasks/README live rules point to learning-steps.md.
- sm-2.md remains clearly historical.
- Code audit: no SM-2 runtime API/fields in apps/ or packages/ (or leftovers removed).
- A reader of live SoT docs cannot reasonably conclude that SM-2 is still supported.
- pnpm format:check and docs:lint pass.
```

## Commands to Run

```bash
rg -n "SM-2|sm-2|sm2|easeFactor|intervalDays|calculateNextReview|easinessFactor" apps packages --glob '!**/migrations/**' || true
pnpm format:check
pnpm docs:lint
```

## Expected Commit Message

```txt
TASK-28.01 Retire SM-2 as current SoT; align live docs to Learning Steps
```
