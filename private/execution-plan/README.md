# Catalog Creator — Execution Plan

> **Reference Documents:**
> - PRD: `@private/context/PRD.md`
> - Design System: `@private/context/DESIGN_SYSTEM.md`
> - UX Prototype: `@private/prototypes/UX_PROTOTYPE.md`

---

## Execution Philosophy

### Test-Driven Development (TDD) Approach

Every feature follows this cycle:

```
┌─────────────────┐
│  1. Write E2E   │ ← Integration tests first
│  Integration    │   (user journey level)
│     Tests       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  2. Run Tests   │ ← They should fail (red)
│    (Red Phase)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  3. Write Unit  │ ← Component/feature level
│     Tests       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  4. Implement   │ ← Write code to pass tests
│    Feature      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  5. Run All     │ ← All tests pass (green)
│  Tests (Green)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  6. Refactor    │ ← Clean up, optimize
│   (Optional)    │
└─────────────────┘
```

### Test Priority Order

1. **E2E Integration Tests** — Test complete user flows
   - "User adds 5 products, tags them, creates a catalog, and shares it"
   - Tool: Detox or Maestro for React Native

2. **Integration Tests** — Test feature interactions
   - "Adding a product updates the product count in home screen"
   - "Creating a catalog deducts from available products"

3. **Unit Tests** — Test individual functions/components
   - "ProductCard renders with correct price format"
   - "Search filter returns matching products"

### What Each Feature File Contains

```markdown
# Feature Name

## Overview
Brief description of the feature and its purpose.

## Acceptance Criteria
- [ ] Criteria 1
- [ ] Criteria 2

## Execution Steps
### Phase 1: E2E Tests
...

### Phase 2: Unit Tests
...

### Phase 3: Implementation
...

## Progress Tracking
| Date | Status | Notes |
|------|--------|-------|

## Insights & Decisions
...

## Problems & Resolutions
...
```

---

## Phase Structure

### Phase 0: Project Setup
- Expo project initialization
- Folder structure
- Testing framework setup
- CI/CD pipeline

### Phase 1: Core Infrastructure
- Database schema (SQLite)
- Navigation system
- State management (Zustand)
- Design system implementation (theme, colors, typography)

### Phase 2: Products Feature
- Product data model
- Add products flow
- Product library grid
- Bulk tagging system

### Phase 3: Catalogs Feature
- Catalog data model
- Catalog builder wizard
- Catalog preview
- Catalog list management

### Phase 4: Search Feature
- Search indexing (FTS5)
- Search UI
- Filter system
- Recent searches

### Phase 5: Templates Feature
- Template data model
- Save/load templates
- Tag presets

### Phase 6: Export & Share
- PDF generation
- Image export
- WhatsApp sharing

---

## Execution Order

```
Week 1:
├── 00-setup/ (Day 1-2)
└── 01-core-infrastructure/ (Day 3-5)
    ├── database
    ├── navigation
    └── state-management

Week 2:
└── 02-products-feature/ (Full week)
    ├── E2E tests for add/tag flow
    ├── Add products UI
    ├── Product library grid
    └── Bulk tagging system

Week 3:
└── 03-catalogs-feature/ (Full week)
    ├── E2E tests for create catalog flow
    ├── Catalog builder wizard
    ├── Catalog preview
    └── Catalog management

Week 4:
├── 04-search-feature/ (Day 1-3)
├── 05-templates-feature/ (Day 4-5)
└── 06-export-share-feature/ (Weekend/overflow)
```

---

## Testing Tools

| Level | Tool | Purpose |
|-------|------|---------|
| E2E | Maestro / Detox | Full user journey testing |
| Integration | React Native Testing Library | Component interaction testing |
| Unit | Jest | Function and utility testing |

---

## Documentation During Execution

Each feature file has tracking sections. Update these as you work:

### Progress Tracking Table
```markdown
| Date | Phase | Status | Blockers | Notes |
|------|-------|--------|----------|-------|
| 2026-03-02 | E2E Tests | 🟡 In Progress | None | Setting up test framework |
```

### Insights & Decisions
- Document why you chose approach A over B
- Note any PRD/Design System deviations and why
- Capture architectural decisions

### Problems & Resolutions
```markdown
| Problem | Cause | Solution | Time Lost |
|---------|-------|----------|-----------|
| SQLite FTS5 not working | Expo SDK version | Downgrade to SDK 48 | 2 hours |
```

---

## Code Quality Gates

Before marking any feature complete:

- [ ] All E2E tests pass
- [ ] All unit tests pass (>80% coverage)
- [ ] No console errors
- [ ] Works on both iOS and Android
- [ ] Follows Design System specifications
- [ ] Accessibility labels present
- [ ] TypeScript strict mode passes

---

## Quick Navigation

| Phase | File | Focus | Status |
|-------|------|-------|--------|
| 0 | [00-setup/setup.md](./00-setup/setup.md) | Project initialization | ✅ Done |
| 1 | [01-core-infrastructure/database.md](./01-core-infrastructure/database.md) | SQLite + FTS5 | ✅ Done |
| 1 | [01-core-infrastructure/state-management.md](./01-core-infrastructure/state-management.md) | Zustand stores | ✅ Done |
| 1 | [01-core-infrastructure/navigation.md](./01-core-infrastructure/navigation.md) | React Navigation | ✅ Done |
| 2 | [02-products-feature/products.md](./02-products-feature/products.md) | Add, library, tagging | ✅ Done |
| 3 | [03-catalogs-feature/catalogs.md](./03-catalogs-feature/catalogs.md) | Builder, preview | ✅ Done |
| 4 | [04-search-feature/search.md](./04-search-feature/search.md) | Search + filters | ✅ Done |
| 5 | [05-templates-feature/templates.md](./05-templates-feature/templates.md) | Templates + presets | ✅ Done |
| 6 | [06-export-share-feature/export-share.md](./06-export-share-feature/export-share.md) | PDF, image, WhatsApp | ✅ Done |
| **7** | [**07-ui-polish-spacing/ui-polish-spacing.md**](./07-ui-polish-spacing/ui-polish-spacing.md) | **Safe areas, spacing fixes** | ✅ Done |
| **8** | [**08-testing-quality/testing-quality.md**](./08-testing-quality/testing-quality.md) | **E2E, unit, integration tests** | ✅ Done |
| **9** | [**09-performance-optimization/performance-optimization.md**](./09-performance-optimization/performance-optimization.md) | **Images, lists, memory** | ✅ Done |
| **10** | [**10-export-share-completion/export-share-completion.md**](./10-export-share-completion/export-share-completion.md) | **PDF, WhatsApp sharing** | ✅ Done |
| **11** | [**11-edge-cases-errors/edge-cases-errors.md**](./11-edge-cases-errors/edge-cases-errors.md) | **Error handling, empty states** | 🔴 Next |
| **12** | [**12-polish-final/12-polish-final.md**](./12-polish-final/12-polish-final.md) | **Release preparation** | ⚪ Pending |

*Phases 0-10 are complete. Start with Phase 11 for the next sprint.*
