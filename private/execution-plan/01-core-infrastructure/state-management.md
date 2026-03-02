# Core Infrastructure: State Management

## Overview
Set up Zustand for global state management. Define stores for app state, products, catalogs, and UI state.

## References
- Design System (for understanding data flow needs)
- PRD Section 4 (features that need state)

---

## Phase 1: E2E Tests

**Test File:** `e2e/state-management.test.ts`

### Test 1: Product State Persistence
```
Scenario: State reflects database changes
Given I add a product via UI
Then the product should appear in product list
And the home screen product count should update
And I can search for the product immediately
```

### Test 2: Navigation State
```
Scenario: Screen navigation works
Given I'm on Home screen
When I tap "Add Products"
Then I should see Add Products screen
And when I complete the flow
Then I should return to Home
And product count should increase
```

### Test 3: Selection State
```
Scenario: Bulk selection works
Given I'm on Products screen
When I long-press a product
Then selection mode activates
And I can select multiple products
And the selection count updates correctly
```

**Acceptance Criteria:**
- [ ] All E2E tests pass
- [ ] State changes reflect in UI immediately

---

## Phase 2: Unit Tests

**Test Files:** 
- `src/store/useStore.test.ts`
- `src/store/useProductStore.test.ts`
- `src/store/useCatalogStore.test.ts`

### Test Cases:

1. **App Store**
   - `should set current screen`
   - `should update search query`
   - `should track recent searches`
   - `should manage selected product IDs`

2. **Product Store**
   - `should load products from database`
   - `should add new product`
   - `should update product`
   - `should archive product`
   - `should filter products by tags`
   - `should search products`

3. **Catalog Store**
   - `should create new catalog`
   - `should add product to catalog`
   - `should remove product from catalog`
   - `should update catalog template`
   - `should save catalog as template`

4. **UI State**
   - `should toggle selection mode`
   - `should select/deselect products`
   - `should select all products`
   - `should clear selection`

**Acceptance Criteria:**
- [ ] All stores have >80% test coverage
- [ ] Actions update state correctly
- [ ] Selectors compute derived state correctly

---

## Phase 3: Implementation

### Step 1: Types Definition

**File:** `src/types/index.ts`

**Define types for:**
- Product
- Catalog
- Tag
- TagPreset
- Template
- Screen/Navigation
- Filter/Sort options

**Example:**
```typescript
export interface Product {
  id: string;
  name: string;
  price: number | null;
  mrp: number | null;
  description: string;
  imageUri: string;
  tags: string[];
  category: string;
  source: string;
  stockStatus: 'in-stock' | 'limited' | 'out-of-stock';
  dateAdded: string;
  archived: boolean;
}

export interface Catalog {
  id: string;
  name: string;
  template: 'minimal' | 'bold' | 'elegant' | 'festive' | 'modern';
  productIds: string[];
  primaryColor: string;
  secondaryColor: string;
  storeName: string;
  status: 'draft' | 'published' | 'archived';
  dateCreated: string;
}

// etc.
```

---

### Step 2: App Store (Navigation & UI)

**File:** `src/store/useAppStore.ts`

**State:**
```typescript
interface AppState {
  // Navigation
  currentScreen: Screen;
  previousScreen: Screen | null;
  navigateTo: (screen: Screen) => void;
  goBack: () => void;
  
  // UI State
  isLoading: boolean;
  error: string | null;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  recentSearches: string[];
  addRecentSearch: (query: string) => void;
  
  // Selection
  selectedProductIds: string[];
  isSelectionMode: boolean;
  toggleSelectionMode: () => void;
  toggleProductSelection: (id: string) => void;
  selectAll: (ids: string[]) => void;
  clearSelection: () => void;
}
```

---

### Step 3: Product Store

**File:** `src/store/useProductStore.ts`

**State:**
```typescript
interface ProductState {
  // Data
  products: Product[];
  filteredProducts: Product[];
  
  // Actions
  loadProducts: () => Promise<void>;
  addProduct: (product: Omit<Product, 'id'>) => Promise<string>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  archiveProduct: (id: string) => Promise<void>;
  bulkUpdateProducts: (ids: string[], updates: Partial<Product>) => Promise<void>;
  
  // Search & Filter
  searchProducts: (query: string) => void;
  filterByCategory: (category: string | null) => void;
  filterByTags: (tags: string[]) => void;
  filterByPriceRange: (min: number, max: number) => void;
  clearFilters: () => void;
  
  // Derived
  productCount: number;
  archivedCount: number;
  categories: string[];
  allTags: string[];
}
```

---

### Step 4: Catalog Store

**File:** `src/store/useCatalogStore.ts`

**State:**
```typescript
interface CatalogState {
  // Data
  catalogs: Catalog[];
  currentCatalog: Catalog | null;
  
  // Actions
  loadCatalogs: () => Promise<void>;
  createCatalog: (catalog: Omit<Catalog, 'id'>) => Promise<string>;
  updateCatalog: (id: string, updates: Partial<Catalog>) => Promise<void>;
  deleteCatalog: (id: string) => Promise<void>;
  setCurrentCatalog: (catalog: Catalog | null) => void;
  
  // Builder operations
  startNewCatalog: () => void;
  addProductToCatalog: (productId: string) => void;
  removeProductFromCatalog: (productId: string) => void;
  reorderProducts: (productIds: string[]) => void;
  
  // Templates
  saveAsTemplate: (name: string) => Promise<void>;
  loadTemplate: (templateId: string) => void;
}
```

---

### Step 5: Tag Preset Store

**File:** `src/store/useTagPresetStore.ts`

**State:**
```typescript
interface TagPresetState {
  presets: TagPreset[];
  loadPresets: () => Promise<void>;
  createPreset: (name: string, tags: string[]) => Promise<void>;
  deletePreset: (id: string) => Promise<void>;
  applyPreset: (presetId: string, productIds: string[]) => Promise<void>;
}
```

---

### Step 6: Store Composition

**File:** `src/store/index.ts`

Export a combined hook or separate hooks. Executor decides pattern:

**Option A: Single Store**
```typescript
export const useStore = create<FullState>(...)
```

**Option B: Separate Stores**
```typescript
export { useAppStore } from './useAppStore';
export { useProductStore } from './useProductStore';
// etc.
```

**Decision Factors:**
- Performance (re-renders)
- Code organization
- Testing ease

---

## Verification

### Integration Test

Create a test component that:
1. Adds a product
2. Verifies it appears in list
3. Updates the product
4. Verifies update reflects
5. Deletes the product
6. Verifies it disappears

---

## Progress Tracking

| Date | Phase | Status | Blockers | Notes |
|------|-------|--------|----------|-------|
| | E2E Tests | ⬜ Not Started | | |
| | Unit Tests | ⬜ Not Started | | |
| | Implementation | ⬜ Not Started | | |

---

## Insights & Decisions

- Store pattern chosen (single vs separate): ___
- State persistence strategy (async storage for some state?): ___
- Selector memoization approach: ___

---

## Problems & Resolutions

| Problem | Cause | Solution | Time Lost |
|---------|-------|----------|-----------|
| | | | |

---

*After completion, move to: navigation.md*
