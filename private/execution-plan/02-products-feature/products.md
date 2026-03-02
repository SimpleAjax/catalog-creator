# Feature: Products (Add, Library, Tag)

## Overview
The core product management feature. Includes: adding products, viewing product library, and bulk tagging system.

## Acceptance Criteria
- [ ] User can add products from camera/gallery
- [ ] Products appear in 3-column grid
- [ ] User can search products by name/tag
- [ ] User can filter by category/price/tags
- [ ] User can select multiple products for bulk operations
- [ ] User can apply tags to products (individual and bulk)
- [ ] User can save tag presets for quick application

---

## Phase 1: E2E Integration Tests

**Test File:** `e2e/products-flow.test.ts`

### Test 1: Add Products Flow
```
Scenario: Add multiple products and tag them
Given I'm on Home screen
When I tap "Add Products" button
Then I see photo selection screen
When I select 5 photos
And I tap "Continue"
Then I see review screen with "5 products"
When I tap "Add Products"
Then I land on Bulk Tag screen
When I select "Festive" tag
And I tap "Apply to 5 Products"
Then I see success toast
When I go to Products screen
Then I see 5 new products with "Festive" tag
```

### Test 2: Search and Filter Flow
```
Scenario: Find specific products
Given 20 products exist (10 sarees, 10 kurtis)
And 5 sarees are tagged "festive"
When I go to Products screen
And I search for "saree"
Then I see only sarees (10 products)
When I tap "Festive" filter chip
Then I see only festive sarees (5 products)
```

### Test 3: Bulk Tagging Flow
```
Scenario: Tag multiple products at once
Given I'm on Products screen
When I long-press a product
Then selection mode activates
When I select 3 more products
And I tap "Tag" button
Then I see Bulk Tag screen with 4 products
When I select "Cotton Basics" preset
And I apply
Then all 4 products have cotton tag
```

### Test 4: Product Lifecycle
```
Scenario: Full product management
Given I add a product
When I set price to ₹500
Then product shows ₹500 in grid
When I archive the product
Then product disappears from grid
When I filter by "Archived"
Then I see the archived product
```

**Acceptance Criteria:**
- [ ] All 4 E2E tests pass
- [ ] Each test completes in < 30 seconds
- [ ] No flaky tests (run 3x consistently)

---

## Phase 2: Unit Tests

### Component Tests

**File:** `src/components/ProductCard.test.tsx`
- `renders product image`
- `displays price when available`
- `shows selected state when selected`
- `calls onPress when tapped`
- `calls onLongPress when long-pressed`

**File:** `src/components/ProductGrid.test.tsx`
- `renders correct number of products`
- `renders empty state when no products`
- `handles scroll correctly`
- `maintains performance with 100+ items`

**File:** `src/components/TagChip.test.tsx`
- `renders tag name`
- `shows remove button when removable`
- `calls onRemove when remove tapped`
- `applies correct color for active/inactive`

### Screen Tests

**File:** `src/screens/AddProductScreen.test.tsx`
- `renders photo grid`
- `selects/deselects photos on tap`
- `shows correct count when selecting`
- `proceeds to review when continue tapped`
- `calls add products on confirm`

**File:** `src/screens/ProductsScreen.test.tsx`
- `loads products on mount`
- `filters products on search`
- `toggles selection mode on long press`
- `selects/deselects products`
- `navigates to bulk tag when tag tapped`

**File:** `src/screens/BulkTagScreen.test.tsx`
- `renders selected products strip`
- `adds tags on input`
- `applies presets on tap`
- `applies tags to all selected products`
- `creates new preset when save tapped`

### Hook/Utility Tests

**File:** `src/hooks/useImagePicker.test.ts`
- `opens image picker`
- `returns selected images`
- `handles permission denied`
- `handles cancel`

**File:** `src/utils/tagHelpers.test.ts`
- `extracts unique tags from products`
- `formats tag display names`
- `validates tag input`

---

## Phase 3: Implementation

### Step 1: Image Picker Utility

**File:** `src/hooks/useImagePicker.ts`

**Requirements:**
- Use `expo-image-picker`
- Support multiple selection
- Compress images for storage
- Handle permissions gracefully

**Function signature:**
```typescript
export const useImagePicker = () => {
  const pickImages: (options?: PickerOptions) => Promise<ImageInfo[]>;
  const hasPermission: boolean;
  const requestPermission: () => Promise<boolean>;
  
  return { pickImages, hasPermission, requestPermission };
};
```

---

### Step 2: Product Card Component

**File:** `src/components/ProductCard.tsx`

**Props:**
```typescript
interface ProductCardProps {
  product: Product;
  isSelected?: boolean;
  onPress?: () => void;
  onLongPress?: () => void;
  showPrice?: boolean;
  showTags?: boolean;
}
```

**Design (from Design System):**
- Aspect ratio: 1:1
- Border radius: 12px
- Selection: Red 500 ring (2px)
- Price badge: Bottom gradient overlay
- Tag badges: Top-right corner (if showTags)

---

### Step 3: Product Grid Component

**File:** `src/components/ProductGrid.tsx`

**Features:**
- 3-column grid (from Design System)
- 8px gap between items
- Virtualized rendering (FlashList or FlatList)
- Pull-to-refresh
- Infinite scroll (if needed)

**Props:**
```typescript
interface ProductGridProps {
  products: Product[];
  selectedIds?: string[];
  onProductPress: (product: Product) => void;
  onProductLongPress?: (product: Product) => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}
```

---

### Step 4: Add Product Screen

**File:** `src/screens/AddProductScreen.tsx`

**Flow:**
1. Show photo picker (simulated with dummy grid for prototype)
2. User selects photos
3. Show review screen with count
4. Confirm → Add to database → Go to Bulk Tag

**State:**
- `selectedImages: string[]`
- `step: 'select' | 'review'`

---

### Step 5: Products Screen

**File:** `src/screens/ProductsScreen.tsx`

**Features:**
- Search bar at top
- Filter chips row (scrollable)
- Product grid
- Floating action button (bulk actions when selected)
- Selection mode toggle

**Filters:**
- All
- Categories (dynamic from data)
- Tags (dynamic from data)
- Price ranges
- Archived

---

### Step 6: Bulk Tag Screen

**File:** `src/screens/BulkTagScreen.tsx`

**Layout:**
```
┌─────────────────────────────┐
│ [←] Tag & Organize   12 sel │
│ ┌──┐┌──┐┌──┐...+8          │
│                             │
│ Quick Apply:                │
│ [Festive] [Cotton] [New]    │
│                             │
│ Category                    │
│ [Select ▼]                  │
│                             │
│ Tags                        │
│ [festive] [red] [+]         │
│                             │
│ cotton silk premium...      │
│                             │
│ [  Apply to 12 Products  ]  │
└─────────────────────────────┘
```

**Features:**
- Selected products strip at top
- Tag preset buttons
- Category dropdown
- Tag input with autocomplete
- Common tags list
- Save as preset button
- Apply button with count

---

### Step 7: Tag Preset System

**File:** `src/store/useTagPresetStore.ts` (if not already done)

**Operations:**
- Load presets from database
- Create new preset
- Delete preset
- Apply preset to products

---

## Verification

### Manual Testing Checklist

**Add Products:**
- [ ] Can select multiple photos
- [ ] Can see preview of selected
- [ ] Can deselect photos
- [ ] Review shows correct count
- [ ] Adding redirects to Bulk Tag

**Product Grid:**
- [ ] All products display
- [ ] Images load
- [ ] Prices show correctly
- [ ] Long-press enters selection mode
- [ ] Can select multiple
- [ ] Scroll is smooth

**Search/Filter:**
- [ ] Search filters in real-time
- [ ] Filter chips apply correctly
- [ ] Clear filters works
- [ ] Combined search + filter works

**Bulk Tag:**
- [ ] Selected products show in strip
- [ ] Can add custom tags
- [ ] Presets apply correctly
- [ ] Category saves
- [ ] Apply updates all selected

---

## Progress Tracking

| Date | Phase | Status | Blockers | Notes |
|------|-------|--------|----------|-------|
| | E2E Tests | ⬜ Not Started | | |
| | Unit Tests | ⬜ Not Started | | |
| | Image Picker | ⬜ Not Started | | |
| | ProductCard | ⬜ Not Started | | |
| | ProductGrid | ⬜ Not Started | | |
| | AddProductScreen | ⬜ Not Started | | |
| | ProductsScreen | ⬜ Not Started | | |
| | BulkTagScreen | ⬜ Not Started | | |

---

## Insights & Decisions

*Document implementation decisions:*

- Image compression strategy: ___
- Grid library chosen (FlashList vs FlatList): ___
- Search debounce time: ___ms
- Max bulk selection limit: ___

---

## Problems & Resolutions

| Problem | Cause | Solution | Time Lost |
|---------|-------|----------|-----------|
| | | | |

---

*After completion, move to 03-catalogs-feature/catalogs.md*
