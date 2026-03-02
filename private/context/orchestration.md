# Orchestration System — Catalog Creator

> **Purpose:** This document explains the full agent orchestration system for this project.
> Read this before starting any feature development with an AI agent.

---

## Why This Exists

AI agents are probabilistic — they skip steps, batch work, and hallucinate progress.
This system imposes **deterministic, step-locked execution** so you always know:
- Exactly what was done
- Exactly what was NOT done
- Exactly where to resume

The system has three components:
1. **Workflow files** (`.agents/workflows/`) — the "rails" the agent runs on
2. **State file** (`private/context/current-step.md`) — the live position tracker
3. **Orchestration guide** (this file) — the design rationale and conventions

---

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    YOU (Decision Maker)                  │
│                                                          │
│    APPROVED ──► Agent  │  CHANGES ──► Agent reworks      │
└────────────────────────┼────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│               ORCHESTRATOR AGENT                         │
│  • Reads: current-step.md                               │
│  • Dispatches ONE step to worker                        │
│  • Gates after each step                                │
│  • Updates: current-step.md                             │
└────────────────────────┬────────────────────────────────┘
                         │
          ┌──────────────┼──────────────┐
          ▼              ▼              ▼
   ┌─────────────┐ ┌──────────┐ ┌──────────────┐
   │  Worker A   │ │ Worker B │ │   Worker C   │
   │ (tdd step)  │ │(parallel)│ │  (parallel)  │
   │ main branch │ │worktree-a│ │  worktree-b  │
   └─────────────┘ └──────────┘ └──────────────┘
```

---

## Workflows Available

| File | Purpose | Use When |
|------|---------|----------|
| `.agents/workflows/tdd.md` | TDD step-by-step protocol | Starting any feature |
| `.agents/workflows/orchestrator.md` | Orchestrator commands | Managing overall state |

---

## The State File (`private/context/current-step.md`)

This is the **single source of truth** for where any agent should be at any time.

**Always read this file before starting any coding session.**

Rules:
- Only the orchestrator writes to this file
- Worker agents read it but don't write directly (report back to orchestrator)
- Never delete or reset it without intent — it preserves your position

---

## Feature Development Flow

### Starting a Feature

```
1. Pick the next feature from private/execution-plan/
2. Read the feature.md file thoroughly
3. Start the orchestrator: /tdd start [feature-name]
4. The orchestrator initializes current-step.md
5. Work through the 8 TDD steps one by one
```

### Between Coding Sessions

```
1. Open current-step.md → see exactly where you left off
2. Tell the agent: /tdd resume
3. Orchestrator reads state, asks to confirm next step
4. You say APPROVED → work continues
```

### If Agent Goes Rogue (Skips Steps / Batches Work)

```
1. STOP the agent immediately
2. Check current-step.md for actual state
3. Use /tdd rollback to go back to last good state
4. Re-run the step with stricter prompt:
   "You are on STEP [N] ONLY. Do NOT proceed to Step [N+1].
    After completing Step [N], output the gate signal and STOP."
```

---

## Parallel Subagent Pattern (Git Worktrees)

Use this when two features can be developed independently at the same time.

### Setup

```powershell
# Create worktrees for parallel feature branches
git worktree add ..\catalog-creator-search feature/search
git worktree add ..\catalog-creator-export feature/export-share
```

### Running Parallel Agents

- **Subagent A** works in `..\catalog-creator-search\`
- **Subagent B** works in `..\catalog-creator-export\`
- Each has its own `current-step.md` section
- Main orchestrator collects results and merges

### Merging

```powershell
# When both agents complete their features:
git checkout main
git merge feature/search
git merge feature/export-share
git worktree remove ..\catalog-creator-search
git worktree remove ..\catalog-creator-export
```

### When to Use Parallel Agents

✅ Use when: Two features have no shared files
✅ Use when: Features are at different TDD stages
❌ Do NOT use when: Features touch the same database schema
❌ Do NOT use when: Features share the same component files

---

## Step Approval Protocol

**Approval signals (agent advances to next step):**
- `APPROVED`
- `LGTM`
- `✅`
- `yes, continue`
- `/tdd next`

**Rejection signals (agent reworks current step):**
- `CHANGES: [describe what to fix]`
- `REDO: [describe issue]`
- Any other feedback → agent stays on current step and reworks

**Hard stop signals:**
- `/tdd pause` — saves state, stops all work
- `STOP` — immediate halt, no further action

---

## Code Quality Gates (Non-Negotiable)

No feature is marked complete until ALL of these pass:

- [ ] All E2E tests pass (green)
- [ ] All unit tests pass (green)
- [ ] TypeScript strict mode: zero errors (`npx tsc --noEmit`)
- [ ] No console errors in Expo
- [ ] Follows Design System (`private/context/DESIGN_SYSTEM.md`)
- [ ] Feature doc Progress Tracking table updated
- [ ] `current-step.md` updated to COMPLETE

---

## Naming Conventions

| Item | Convention | Example |
|------|-----------|---------|
| Feature branch | `feature/[feature-name]` | `feature/export-share` |
| Worktree dir | `../catalog-creator-[name]` | `../catalog-creator-search` |
| E2E test file | `e2e/[feature]-flow.test.ts` | `e2e/export-share-flow.test.ts` |
| Unit test file | co-located with source | `src/utils/pdfGenerator.test.ts` |
| Insight file | `private/insights/[topic].md` | `private/insights/pdf-library-choice.md` |

---

## Reference Map

```
catalog-creator/
├── .agents/
│   └── workflows/
│       ├── tdd.md                    ← TDD step protocol
│       └── orchestrator.md           ← Orchestrator commands
├── private/
│   ├── context/
│   │   ├── PRD.md                    ← Product requirements
│   │   ├── DESIGN_SYSTEM.md          ← UI spec
│   │   ├── orchestration.md          ← THIS FILE
│   │   └── current-step.md           ← Live state tracker
│   ├── insights/                     ← Lessons learned
│   └── execution-plan/
│       ├── README.md                 ← Phase overview
│       └── [NN-feature]/
│           └── [feature].md          ← Feature spec + TDD steps
├── e2e/                              ← E2E tests go here
├── src/                              ← Implementation goes here
└── __tests__/                        ← Additional unit tests
```
