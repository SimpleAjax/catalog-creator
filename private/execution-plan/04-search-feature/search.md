# Feature: Search

## Overview
Global search functionality across products, catalogs, and tags. Includes FTS5 full-text search and advanced filters.

## References
- PRD Section 4.3 (Search & Filters)
- Design System (Search UI patterns)

## Acceptance Criteria
- [ ] User can search products by name
- [ ] User can search products by tags
- [ ] User can search catalogs by name
- [ ] Search results appear as user types (< 100ms)
- [ ] User can filter by category, price, date
- [ ] User can save frequent searches
- [ ] Recent searches are remembered

---

## Phase 1: E2E Integration Tests

**Test File:** `e2e/search-flow.test.ts`

### Test 1: Product Search Flow
```
Scenario: Find products quickly
Given 50 products exist
And 10 products have "silk" in name
When I tap search icon on Home
Then I see Search screen with empty state
When I type "silk"
Then I see 10 silk products in results
And results update in real-time
When I tap a product
Then I go to Product Detail
```

### Test 2: Filtered Search Flow
```
Scenario: Search with filters
Given products exist with various prices
When I search for "saree"
Then I see saree products
When I apply "Under ₹500" filter
Then I see only sarees under ₹500
When I apply "Festive" tag filter
Then I see festive sarees under ₹500
When I clear all filters
Then I see all sarees again
```

### Test 3: Saved Searches
```
Scenario: Save frequent search
Given I searched "red saree festive"
And I see results
When I tap "Save Search"
And I name it "Festive Red"
Then search is saved
When I go to Home
And I tap "Festive Red" chip
Then I see filtered results immediately
```

### Test 4: Cross-Entity Search
```
Scenario: Search finds everything
Given products exist with "diwali" tag
And a catalog named "Diwali Collection"
When I search "diwali"
Then I see:
  - Products section with diwali products
  - Catalogs section with Diwali Collection
  - Tags section with "diwali" tag
```

**Acceptance Criteria:**
- [ ] All 4 E2E tests pass
- [ ] Search responds in < 100ms
- [ ] Results accurate (no false positives)

---

## Phase 2: Unit Tests

### Component Tests

**File:** `src/components/SearchBar.test.tsx`
- `renders search input`
- `calls onSearch when text changes`
- `debounces search calls`
- `shows clear button when text entered`
- `calls onClear when clear tapped`

**File:** `src/components/SearchResults.test.tsx`
- `renders grouped results`
- `shows "no results" when empty`
- `navigates on item tap`
- `handles scroll correctly`

**File:** `src/components/FilterPanel.test.tsx`
- `renders filter options`
- `applies filters on selection`
- `clears filters on reset`
- `shows active filter count`

### Hook Tests

**File:** `src/hooks/useSearch.test.ts`
- `returns results for query`
- `filters by category`
- `filters by price range`
- `combines multiple filters`
- `debounces query changes`
- `cancels previous search`

---

## Phase 3: Implementation

### Step 1: FTS5 Setup

**File:** `src/api/search.ts`

**Already done in database phase, verify:**
- FTS5 virtual table exists
- Triggers sync products to FTS5
- Search function uses FTS5 MATCH

**Search Functions:**
```typescript
export const searchProducts = async (
  query: string,
  filters?: SearchFilters
): Promise<Product[]> => {
  // Use FTS5 MATCH for text search
  // Apply additional filters
  // Return sorted by relevance
};

export const searchCatalogs = async (
  query: string
): Promise<Catalog[]> => {
  // Search catalog names
};

export const searchTags = async (
  query: string
): Promise<string[]> => {
  // Return matching tag names
};
```

---

### Step 2: Search Screen

**File:** `src/screens/SearchScreen.tsx`

**Layout:**
```
┌─────────────────────────────┐
│ [←] 🔍 Search...      [⚙️]  │
│                             │
│ [All] [Products] [Catalogs] │
│ [Tags]                      │
│                             │
│ Recent Searches:            │
│ • silk saree                │
│ • diwali collection         │
│                             │
│ ─────────────────────────── │
│                             │
│ PRODUCTS                    │
│ ┌──┐ ┌──┐ ┌──┐             │
│ └──┘ └──┘ └──┘             │
│                             │
│ CATALOGS                    │
│ ┌─────────────────────────┐ │
│ │ Diwali Collection       │ │
│ └─────────────────────────┘ │
│                             │
│ TAGS                        │
│ [silk] [saree] [festive]    │
└─────────────────────────────┘
```

**Features:**
- Search input with debounce
- Filter tabs (All/Products/Catalogs/Tags)
- Recent searches list
- Grouped results
- Pull-to-refresh

---

### Step 3: Filter System

**File:** `src/components/FilterPanel.tsx`

**Filters:**
- **Categories:** Multi-select dropdown
- **Price Range:** Min/Max inputs or slider
- **Tags:** Tag chips (multi-select)
- **Date Added:** Today/This Week/This Month/Custom
- **Stock Status:** In Stock/Limited/Out of Stock

**State:**
```typescript
interface SearchFilters {
  categories?: string[];
  minPrice?: number;
  maxPrice?: number;
  tags?: string[];
  dateRange?: 'today' | 'week' | 'month' | 'custom';
  stockStatus?: ('in-stock' | 'limited' | 'out-of-stock')[];
}
```

---

### Step 4: Saved Searches

**File:** `src/store/useSavedSearchStore.ts`

**Operations:**
- Save current search with name
- Load saved search
- Delete saved search
- Display as chips on Home screen

**Database:**
```sql
CREATE TABLE saved_searches (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  query TEXT,
  filters TEXT, -- JSON
  createdAt TEXT
);
```

---

### Step 5: Search Integration

**Update:** `src/screens/HomeScreen.tsx`

Add:
- Search bar or icon
- Saved search chips
- Recent searches (optional)

**Update:** `src/screens/ProductsScreen.tsx`

Add:
- Search integration
- Filter chips from search results

---

## Verification

### Performance Checklist

- [ ] Search returns results in < 100ms (1000 products)
- [ ] Debounce prevents excessive queries (300ms)
- [ ] Scroll is smooth with 100+ results
- [ ] No UI blocking during search

### Functional Checklist

- [ ] Typing "silk" finds silk products
- [ ] Typing "499" finds products priced ₹499
- [ ] Category filter works
- [ ] Price filter works
- [ ] Multiple filters combine correctly
- [ ] Saved searches load correctly
- [ ] Recent searches display

---

## Progress Tracking

| Date | Phase | Status | Blockers | Notes |
|------|-------|--------|----------|-------|
| | E2E Tests | ⬜ Not Started | | |
| | Unit Tests | ⬜ Not Started | | |
| | FTS5 Verify | ⬜ Not Started | | |
| | SearchScreen | ⬜ Not Started | | |
| | FilterPanel | ⬜ Not Started | | |
| | SavedSearches | ⬜ Not Started | | |

---

## Insights & Decisions

- Debounce delay: ___ms
- Max search results: ___
- FTS5 ranking algorithm: ___

---

## Problems & Resolutions

| Problem | Cause | Solution | Time Lost |
|---------|-------|----------|-----------|
| | | | |

---

*After completion, move to 05-templates-feature/templates.md*
