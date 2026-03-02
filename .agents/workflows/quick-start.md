---
description: Quick reference — how to use the TDD + Orchestration system in daily sessions
---

# Quick Start — How to Work With the Agent

> Read this at the START of every coding session.
> This is your cheat sheet for the orchestration system.

---

## Starting a New Feature

```
1. Tell the agent:
   /tdd start export-share

2. The orchestrator will:
   - Read the feature plan from private/execution-plan/06-export-share-feature/export-share.md
   - Update current-step.md
   - Start Step 1 (write E2E tests) and STOP

3. You review what it wrote, then say:
   APPROVED
```

---

## Resuming an Existing Session

If you closed your editor and came back later:

```
1. Tell the agent:
   /tdd resume

2. The orchestrator reads current-step.md and reports:
   "Feature: export-share | Step 3/8 | Status: PENDING APPROVAL"

3. You say APPROVED to continue from where you left off
```

---

## Approving a Step

When the agent shows this gate signal:
```
╔══════════════════════════════════════╗
║  ✅ STEP [N] COMPLETE                ║
║  ...                                 ║
║  ⏸ AWAITING YOUR APPROVAL           ║
╚══════════════════════════════════════╝
```

**To continue:** say `APPROVED` or `LGTM`
**To request changes:** say `CHANGES: [what to fix]`
**To pause:** say `/tdd pause`

---

## Checking Status

```
/tdd status
```
Shows: current feature, current step, status, last action taken.

---

## All Commands

| Command | What it does |
|---------|-------------|
| `/tdd start [feature]` | Begin a new feature from Step 1 |
| `/tdd resume` | Resume from where current-step.md says |
| `/tdd status` | Show current position |
| `APPROVED` / `LGTM` | Advance to next step |
| `CHANGES: [desc]` | Agent reworks current step |
| `/tdd retry` | Redo current step from scratch |
| `/tdd rollback` | Go back one step |
| `/tdd skip [reason]` | Skip current step (use sparingly, logged) |
| `/tdd pause` | Save state and stop |

---

## The 8 TDD Steps (At a Glance)

```
1. Write E2E Tests     →  GATE  →  APPROVED
2. Confirm Red (E2E)   →  GATE  →  APPROVED
3. Write Unit Tests    →  GATE  →  APPROVED
4. Confirm Unit Red    →  GATE  →  APPROVED
5. Implement Code      →  GATE  →  APPROVED
6. Confirm Green       →  GATE  →  APPROVED
7. Refactor            →  GATE  →  APPROVED
8. Final Verify        →  DONE
```

---

## State File Location

`private/context/current-step.md`

This tells you (and the agent) exactly where you are at all times.
If something goes wrong, check this file first.

---

## Feature Order

Work through these in order (as defined in `private/execution-plan/`):

- [x] 00 — Setup
- [ ] 01 — Core Infrastructure
- [ ] 02 — Products Feature
- [ ] 03 — Catalogs Feature
- [ ] 04 — Search Feature
- [ ] 05 — Templates Feature
- [ ] 06 — Export & Share  ← *next up*
