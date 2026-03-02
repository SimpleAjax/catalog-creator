# Feature: Catalogs (Builder, Preview, Management)

## Overview
Catalog creation and management system. Users build catalogs from products, customize templates, and preview before sharing.

## Acceptance Criteria
- [ ] User can create new catalog with wizard
- [ ] User can select products from library
- [ ] User can apply and customize templates
- [ ] User can preview catalog before sharing
- [ ] User can save catalogs as drafts
- [ ] User can publish catalogs
- [ ] User can duplicate existing catalogs
- [ ] User can delete catalogs

---

## Phase 1: E2E Integration Tests

**Test File:** `e2e/catalogs-flow.test.ts`

### Test 1: Create Catalog Flow
```
Scenario: Create and customize a catalog
Given I'm on Home screen
And 20 products exist in library
When I tap "Catalogs" tab
And I tap "Create New Catalog"
Then I see Catalog Builder (Step 1)
When I enter "Summer Collection" as name
And I select "Minimal" template
And I tap "Continue"
Then I see Product Selector (Step 2)
When I select 10 products
And I tap "Continue"
Then I see Customize screen (Step 3)
When I change primary color to blue
And I enter "My Store" as store name
And I tap "Continue"
Then I see Preview screen (Step 4)
And I see 10 products in catalog layout
When I tap "Save"
Then I return to Catalogs list
And I see "Summer Collection" in the list
```

### Test 2: Catalog Preview and Share
```
Scenario: Preview and export catalog
Given I have a catalog with 5 products
When I tap the catalog in list
Then I see Catalog Preview screen
And I see products arranged in template
When I swipe left
Then I see next page of catalog
When I tap "PDF" button
Then export process starts
And I see success toast
```

### Test 3: Draft Management
```
Scenario: Save and resume draft
Given I'm in Catalog Builder
And I've selected 3 products
When I tap "Save Draft"
Then I return to Catalogs list
And catalog shows "Draft" status
When I tap the draft catalog
Then I see "Continue Editing" option
When I tap it
Then I return to Catalog Builder at Step 2
With my 3 products still selected
```

### Test 4: Duplicate Catalog
```
Scenario: Duplicate existing catalog
Given I have a published catalog
When I tap menu (⋯) on catalog
And I tap "Duplicate"
Then I see new catalog in list
With name "Original Name (Copy)"
And status "Draft"
And same products and template
```

**Acceptance Criteria:**
- [ ] All 4 E2E tests pass
- [ ] Catalog creation completes in < 2 minutes
- [ ] Preview renders within 3 seconds

---

## Phase 2: Unit Tests

### Component Tests

**File:** `src/components/TemplateCard.test.tsx`
- `renders template preview`
- `shows selected state when selected`
- `displays template name and description`
- `shows color palette preview`

**File:** `src/components/CatalogPreview.test.tsx`
- `renders catalog with template styling`
- `displays correct number of products per page`
- `swipes between pages correctly`
- `shows store name and catalog name`
- `renders product prices correctly`

**File:** `src/components/ColorPicker.test.tsx`
- `renders color options`
- `selects color on tap`
- `allows custom color input`

### Screen Tests

**File:** `src/screens/CatalogBuilderScreen.test.tsx`
- `renders step 1 (template) by default`
- `navigates through all 4 steps`
- `saves catalog data between steps`
- `validates required fields`
- `saves catalog on complete`
- `saves draft on demand`

**File:** `src/screens/CatalogsScreen.test.tsx`
- `loads and displays catalog list`
- `shows correct status badges`
- `navigates to preview on tap`
- `shows menu with actions`
- `handles delete confirmation`

**File:** `src/screens/CatalogPreviewScreen.test.tsx`
- `renders catalog with products`
- `handles page navigation`
- `triggers export on button tap`
- `shows loading during export`
- `handles share actions`

---

## Phase 3: Implementation

### Step 1: Template System

**File:** `src/theme/templates.ts`

**Define 5 templates:**
```typescript
export const templates = {
  minimal: {
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean and simple',
    defaultColors: { primary: '#374151', secondary: '#F3F4F6' },
    productCardStyle: { /* ... */ },
    headerStyle: { /* ... */ },
    productsPerPage: 4,
    layout: '2x2',
  },
  bold: { /* ... */ },
  elegant: { /* ... */ },
  festive: { /* ... */ },
  modern: { /* ... */ },
};
```

**Template properties:**
- Layout (2x2 grid, 3x3, list, etc.)
- Product card styling
- Header/footer options
- Default colors
- Typography scale

---

### Step 2: Catalog Builder Wizard

**File:** `src/screens/CatalogBuilderScreen.tsx`

**4-Step Wizard:**

**Step 1: Template & Name**
- Catalog name input
- Template grid (5 templates)
- Template preview on selection

**Step 2: Product Selection**
- Search bar
- Product grid (from Products library)
- Selected count indicator
- Select/deselect products
- Filter by tags/categories

**Step 3: Customization**
- Primary color picker
- Secondary color picker
- Store name input
- Font selector
- Live preview thumbnail

**Step 4: Preview & Save**
- Full catalog preview
- Page navigation (swipe)
- Product arrangement
- Save as Draft button
- Publish button

**State Management:**
```typescript
interface BuilderState {
  step: 1 | 2 | 3 | 4;
  catalog: Partial<Catalog>;
  selectedProductIds: string[];
  isDirty: boolean;
}
```

---

### Step 3: Catalog Preview Renderer

**File:** `src/components/CatalogPreview.tsx`

**Requirements:**
- Render products using selected template
- Calculate pagination (products per page based on template)
- Apply custom colors
- Show store name, catalog name, contact info
- Swipe between pages

**Props:**
```typescript
interface CatalogPreviewProps {
  catalog: Catalog;
  products: Product[];
  currentPage: number;
  onPageChange: (page: number) => void;
}
```

**Performance:**
- Memoize rendered pages
- Lazy load off-screen pages
- Pre-render adjacent pages

---

### Step 4: Catalogs List Screen

**File:** `src/screens/CatalogsScreen.tsx`

**Layout:**
```
┌─────────────────────────────┐
│ My Catalogs           [+]   │
│                             │
│ ┌─────────────────────────┐ │
│ │ 🟥 Diwali Collection  ⋯ │ │
│ │    20 products • Pub    │ │
│ └─────────────────────────┘ │
│ ┌─────────────────────────┐ │
│ │ ⬜ Draft: New          ⋯ │ │
│ │    5 products • Draft   │ │
│ └─────────────────────────┘ │
│                             │
│ [   + Create New Catalog  ] │
└─────────────────────────────┘
```

**Features:**
- List view of all catalogs
- Status badges (Published/Draft)
- Product count
- Quick actions menu (View, Duplicate, Delete)
- Empty state if no catalogs

---

### Step 5: Catalog Preview Screen

**File:** `src/screens/CatalogPreviewScreen.tsx`

**Layout:**
```
┌─────────────────────────────┐
│ [←] Catalog Name     [Edit] │
│       Page 1 of 3           │
│ [←]                 [→]     │
│                             │
│ ┌─────────────────────────┐ │
│ │                         │ │
│ │   Catalog Preview       │ │
│ │   (Template Rendered)   │ │
│ │                         │ │
│ └─────────────────────────┘ │
│                             │
│ ┌──────┬──────┬──────────┐  │
│ │ PDF  │Image │ WhatsApp │  │
│ └──────┴──────┴──────────┘  │
└─────────────────────────────┘
```

**Actions:**
- Edit (opens Catalog Builder)
- Export PDF
- Export Image
- Share to WhatsApp

---

## Verification

### Manual Testing Checklist

**Catalog Builder:**
- [ ] Can enter catalog name
- [ ] Can select template
- [ ] Template preview shows correctly
- [ ] Can select products
- [ ] Selected count updates
- [ ] Can customize colors
- [ ] Live preview updates
- [ ] Can save draft
- [ ] Can publish catalog

**Catalog Preview:**
- [ ] Products render in template style
- [ ] Colors apply correctly
- [ ] Pagination works
- [ ] Swipe between pages
- [ ] All products visible

**Catalogs List:**
- [ ] All catalogs display
- [ ] Status badges correct
- [ ] Tap opens preview
- [ ] Menu actions work
- [ ] Delete confirms
- [ ] Duplicate creates copy

---

## Progress Tracking

| Date | Phase | Status | Blockers | Notes |
|------|-------|--------|----------|-------|
| | E2E Tests | ⬜ Not Started | | |
| | Unit Tests | ⬜ Not Started | | |
| | Templates | ⬜ Not Started | | |
| | CatalogBuilder | ⬜ Not Started | | |
| | CatalogPreview | ⬜ Not Started | | |
| | CatalogsScreen | ⬜ Not Started | | |

---

## Insights & Decisions

- Template rendering approach: ___
- Page calculation algorithm: ___
- Export image resolution: ___
- Max products per catalog: ___

---

## Problems & Resolutions

| Problem | Cause | Solution | Time Lost |
|---------|-------|----------|-----------|
| | | | |

---

*After completion, move to 04-search-feature/search.md*
