---
description: TDD workflow — write tests first, then implement code, one step at a time with user approval gates
---

# TDD Workflow Protocol — Catalog Creator

> **CRITICAL RULES — READ BEFORE EVERY STEP:**
> 1. Execute **ONE step at a time only**
> 2. After completing each step, output the GATE SIGNAL and **STOP COMPLETELY**
> 3. Do NOT proceed to the next step until you receive `APPROVED` or `LGTM` from the user
> 4. Update `private/context/current-step.md` at the start and end of every step
> 5. Never write implementation code before the tests for that code exist and have been verified to fail

---

## Step Lock Protocol

At the start of every response, read `private/context/current-step.md` to know your exact position.

### Gate Signal Format

After completing any step, output this exact block and nothing else after it:

```
╔══════════════════════════════════════╗
║  ✅ STEP [N] COMPLETE                ║
║  Deliverable: [what was created]     ║
║  Next step: [N+1] — [step name]      ║
║  ⏸ AWAITING YOUR APPROVAL           ║
╚══════════════════════════════════════╝
```

Then stop. Do not write any more. Do not start Step N+1.

---

## The TDD Cycle

Each feature in `private/execution-plan/` follows this exact sequence:

| Step | Name | Action | Deliverable |
|------|------|---------|-------------|
| 1 | Write E2E Tests | Write failing E2E/integration test file | `e2e/*.test.ts` |
| 2 | Confirm Red | Run tests, confirm they fail for the RIGHT reason | Test output showing failures |
| 3 | Write Unit Tests | Write all unit tests for utilities/components | `src/**/*.test.ts` |
| 4 | Confirm Unit Red | Run unit tests, confirm they fail | Test output showing failures |
| 5 | Implement Code | Write minimal code to pass all tests | Implementation files |
| 6 | Confirm Green | Run all tests, confirm they all pass | Test output showing passing |
| 7 | Refactor | Clean up code (do NOT change tests) | Refactored implementation |
| 8 | Final Verify | Run full test suite, update feature doc progress table | Clean test output |

---

## Step Details

### Step 1 — Write E2E Tests

**Do:**
- Read the feature file in `private/execution-plan/` for the scenarios
- Write the complete E2E test file as spec'd in the feature doc
- Do NOT write any implementation code

**Do NOT do:**
- Create any `src/` files
- Install libraries (ask user first)
- Run the tests yet (that's Step 2)

**State update in `private/context/current-step.md`:**
```
STATUS: IN_PROGRESS | STEP: 1 | Action: Writing E2E tests
```

**Gate:** Output gate signal. Stop.

---

### Step 2 — Confirm Red (E2E)

**Do:**
- Run the E2E test file written in Step 1
- Confirm tests fail because the code doesn't exist yet (not because of syntax errors)
- If tests have syntax errors → fix them, re-run, stay on Step 2 until clean failures

**Command:**
```bash
npx jest e2e/[feature-name].test.ts --no-coverage
```

**Gate:** Output gate signal with actual test output pasted. Stop.

---

### Step 3 — Write Unit Tests

**Do:**
- Write all unit test files as spec'd in the feature doc (`src/**/*.test.ts`)
- Mirror the exact test cases from the feature file
- Do NOT write any implementation yet

**Gate:** Output gate signal listing all unit test files created. Stop.

---

### Step 4 — Confirm Unit Red

**Do:**
- Run all unit tests for this feature
- Confirm they all fail correctly

**Command:**
```bash
npx jest src/[path]/ --no-coverage
```

**Gate:** Output gate signal with test output. Stop.

---

### Step 5 — Implement Code

**Do:**
- Write implementation files to make ALL failing tests pass
- Follow the feature doc's implementation spec
- Follow design system in `private/context/DESIGN_SYSTEM.md`
- Document any deviation from the spec in the feature doc's "Insights & Decisions" section

**Rule:** Write the minimal code needed to pass tests. No gold-plating.

**Gate:** Output gate signal listing all files created/modified. Stop.

---

### Step 6 — Confirm Green

**Do:**
- Run all tests (E2E + unit) for this feature
- All must pass before proceeding

**Command:**
```bash
npx jest --testPathPattern="(e2e/[feature]|src/[path])" --no-coverage
```

**If any test fails:** Fix the implementation (not the tests), re-run. Stay on Step 6 until all green.

**Gate:** Output gate signal with full passing test output. Stop.

---

### Step 7 — Refactor

**Do:**
- Clean up implementation code: naming, structure, comments
- Extract repeated logic into utilities
- Run tests after every change to ensure nothing breaks

**Do NOT do:**
- Change test files
- Add new functionality
- Change interfaces/contracts

**Gate:** Output gate signal with summary of what was refactored. Stop.

---

### Step 8 — Final Verify & Update Docs

**Do:**
- Run the full project test suite: `npx jest --no-coverage`
- Update the feature doc's Progress Tracking table with today's date and ✅ status
- Update `private/context/current-step.md` to mark feature COMPLETE

**Gate:** Output gate signal. Feature is done.

---

## Emergency Stops

If at any point you encounter:
- A library that needs to be installed → **STOP**, ask user: "I need to install [X]. Approve?"
- An ambiguous requirement → **STOP**, ask user for clarification
- A test that's impossible to write as spec'd → **STOP**, explain why, propose alternative

Do not make assumptions on any of the above. Always ask.

---

## Reference Files

- PRD: `private/context/PRD.md`
- Design System: `private/context/DESIGN_SYSTEM.md`
- Orchestration State: `private/context/current-step.md`
- Orchestration Guide: `private/context/orchestration.md`
- Feature Plans: `private/execution-plan/*/`
