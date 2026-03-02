---
description: Orchestrator — manages agent workflow state and enforces step-by-step execution with user approval gates
---

# Orchestrator Workflow — Catalog Creator

> This workflow is used to **start**, **resume**, **approve**, or **block** workflow execution.
> Use this when you want me to act as the orchestrator rather than as a worker agent.

---

## Orchestrator Responsibilities

1. **Read state** — Always read `private/context/current-step.md` first
2. **Dispatch one step** — Call the worker agent for ONE step only
3. **Gate after step** — Stop and wait for user approval before dispatching next step
4. **Maintain state** — Write state to `private/context/current-step.md` after each step
5. **Never skip** — Cannot jump steps even if asked

---

## User Commands

| You say | Orchestrator does |
|---------|------------------|
| `/tdd start [feature-name]` | Initializes state, begins Step 1 |
| `/tdd next` or `APPROVED` or `LGTM` | Advances to next step |
| `/tdd status` | Shows current state from `current-step.md` |
| `/tdd retry` | Retries current step (if something went wrong) |
| `/tdd skip [reason]` | Skips current step with logged reason (use sparingly) |
| `/tdd pause` | Saves state and pauses — can resume later |
| `/tdd resume` | Reads state file and resumes from saved position |
| `/tdd rollback` | Goes back one step |

---

## State Machine

```
 IDLE
  │
  │  /tdd start [feature]
  ▼
 STEP_1: Write E2E Tests ──► GATE ──► [APPROVED] ──► STEP_2
                                           │
                                      [CHANGES]
                                           │
                                       ◄──┘ (rework same step)

 STEP_2: Confirm Red (E2E) ──► GATE ──► [APPROVED] ──► STEP_3
 STEP_3: Write Unit Tests ──► GATE ──► [APPROVED] ──► STEP_4
 STEP_4: Confirm Unit Red ──► GATE ──► [APPROVED] ──► STEP_5
 STEP_5: Implement Code ──► GATE ──► [APPROVED] ──► STEP_6
 STEP_6: Confirm Green ──► GATE ──► [APPROVED] ──► STEP_7
 STEP_7: Refactor ──► GATE ──► [APPROVED] ──► STEP_8
 STEP_8: Final Verify ──► [FEATURE COMPLETE] ──► IDLE
```

---

## Orchestrator Boot Sequence

When invoked, always do this in order:

```
1. READ   → private/context/current-step.md
2. REPORT → Tell user exactly where we are (feature, step, status)
3. ASK    → "Continue with Step [N]: [step name]?" if resuming mid-task
4. WAIT   → Do not execute anything until user confirms
```

Example boot output:
```
📋 Orchestrator Status:
   Feature: export-share
   Current Step: 3 / 8 — Write Unit Tests
   Status: PENDING (waiting for your approval)
   Last action: E2E tests written at e2e/export-share-flow.test.ts

   Type APPROVED to start Step 3, or /tdd status for full state.
```

---

## State File Contract

The orchestrator OWNS `private/context/current-step.md`.
It must write to this file:
- At the START of each step (status → IN_PROGRESS)
- At the END of each step (status → PENDING_APPROVAL)
- When user approves (status → advancing, next step IN_PROGRESS)
- When feature completes (status → COMPLETE)

**Never let the state file go stale.** If you crash mid-step, the state file tells the next session where to resume.

---

## Worker Agent Isolation Rule

When dispatching a step to the worker:
- Give it ONLY the instructions for that one step
- Do NOT give it the full workflow or future steps
- The worker operates with tunnel vision — it only knows its current task

---

## Parallel Subagent Coordination

When running independent tasks in parallel git worktrees:

```
Main Orchestrator
├── Subagent A (worktree: feature/search)
│   └── Running: tdd.md Step 3
├── Subagent B (worktree: feature/export)
│   └── Running: tdd.md Step 1
└── Reports to: current-step.md (separate sections per agent)
```

Each subagent has its own section in `current-step.md`:
```markdown
## Agent: main
...

## Agent: subagent-search
...

## Agent: subagent-export
...
```

Orchestrator merges results before main branch merge.

---

## Reference

- TDD steps: `.agents/workflows/tdd.md`
- State file: `private/context/current-step.md`
- Full guide: `private/context/orchestration.md`
