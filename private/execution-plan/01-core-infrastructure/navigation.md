# Core Infrastructure: Navigation

## Overview
Set up React Navigation with bottom tabs and stack navigators. Create navigation types and hooks.

## References
- Design System (Layout patterns)
- PRD (Screen definitions)

---

## Phase 1: E2E Tests

**Test File:** `e2e/navigation.test.ts`

### Test 1: Bottom Tab Navigation
```
Scenario: Navigate using bottom tabs
Given I'm on Home screen
When I tap "Products" tab
Then I should see Products screen
When I tap "Catalogs" tab
Then I should see Catalogs screen
When I tap back to "Home" tab
Then I should see Home screen
```

### Test 2: Stack Navigation
```
Scenario: Navigate to detail screens
Given I'm on Home screen
When I tap "Add Products" button
Then I should see Add Products screen with back button
When I tap back
Then I should return to Home
```

### Test 3: Deep Linking
```
Scenario: Navigate to specific catalog
Given the app is closed
When I open app with catalog://cat-123
Then I should see Catalog Preview for cat-123
```

### Test 4: Navigation State Persistence
```
Scenario: Return to same screen after background
Given I'm on Catalog Builder screen
When I background the app
And I foreground the app
Then I should still be on Catalog Builder screen
```

**Acceptance Criteria:**
- [ ] All 4 E2E tests pass
- [ ] Navigation is smooth (no flashes)
- [ ] Back button works correctly

---

## Phase 2: Unit Tests

**Test Files:**
- `src/navigation/AppNavigator.test.tsx`
- `src/hooks/useNavigation.test.ts`

### Test Cases:

1. **Navigator Rendering**
   - `should render bottom tab navigator`
   - `should render correct initial screen`
   - `should pass screen props correctly`

2. **Navigation Hooks**
   - `should navigate to screen`
   - `should go back`
   - `should reset navigation stack`

---

## Phase 3: Implementation

### Step 1: Navigation Types

**File:** `src/navigation/types.ts`

```typescript
export type RootTabParamList = {
  Home: undefined;
  Products: undefined;
  Catalogs: undefined;
  Templates: undefined;
};

export type RootStackParamList = {
  MainTabs: undefined;
  AddProduct: undefined;
  ProductDetail: { productId: string };
  CatalogBuilder: { catalogId?: string };
  CatalogPreview: { catalogId: string };
  BulkTag: { productIds: string[] };
  Search: { initialQuery?: string };
  Settings: undefined;
};

// Type helpers
export type ScreenName = keyof RootStackParamList;
```

---

### Step 2: Stack Navigator Setup

**File:** `src/navigation/AppNavigator.tsx`

**Structure:**
```
RootStackNavigator
├── MainTabs (Tab Navigator)
│   ├── Home
│   ├── Products
│   ├── Catalogs
│   └── Templates
├── AddProduct
├── ProductDetail
├── CatalogBuilder
├── CatalogPreview
├── BulkTag
├── Search
└── Settings
```

**Configuration:**
- Default screen transition: Slide from right (iOS) / Fade (Android)
- Header shown on stack screens, hidden on tabs
- Safe area handling

---

### Step 3: Tab Navigator Setup

**File:** `src/navigation/TabNavigator.tsx`

**Tab Configuration:**
```typescript
const tabs = [
  {
    name: 'Home',
    component: HomeScreen,
    icon: 'Home',
    label: 'Home'
  },
  {
    name: 'Products',
    component: ProductsScreen,
    icon: 'Package',
    label: 'Products'
  },
  {
    name: 'Catalogs',
    component: CatalogsScreen,
    icon: 'BookOpen',
    label: 'Catalogs'
  },
  {
    name: 'Templates',
    component: TemplatesScreen,
    icon: 'Palette',
    label: 'Templates'
  }
];
```

**Styling (from Design System):**
- Height: 64px + safe area
- Active: Red 500
- Inactive: Gray 400
- Icon size: 24px
- Label: 12px Medium

---

### Step 4: Navigation Service (Optional)

**File:** `src/navigation/NavigationService.ts`

For navigation outside components (e.g., from store):

```typescript
export const navigationRef = createNavigationContainerRef();

export function navigate(name: ScreenName, params?: any) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
}

export function goBack() {
  if (navigationRef.isReady()) {
    navigationRef.goBack();
  }
}
```

---

### Step 5: Screen Wrapper Component

**File:** `src/components/ScreenWrapper.tsx`

Reusable wrapper for consistent screen layout:
- Safe area insets
- Status bar handling
- Background color (Gray 50)
- Keyboard avoiding view

---

### Step 6: Header Component

**File:** `src/components/Header.tsx`

Reusable header with:
- Back button (optional)
- Title
- Right action (optional)
- Consistent styling

---

## Verification

### Visual Checklist

- [ ] Bottom tabs appear on all main screens
- [ ] Tab icons change color when active
- [ ] Stack screens show back button
- [ ] Screen titles are correct
- [ ] Safe areas respected (notch, home indicator)

### Functional Checklist

- [ ] Can navigate to all screens
- [ ] Back button works correctly
- [ ] Hardware back button works (Android)
- [ ] Tab switching preserves scroll position
- [ ] Deep linking works (if implemented)

---

## Progress Tracking

| Date | Phase | Status | Blockers | Notes |
|------|-------|--------|----------|-------|
| | E2E Tests | ⬜ Not Started | | |
| | Unit Tests | ⬜ Not Started | | |
| | Implementation | ⬜ Not Started | | |

---

## Insights & Decisions

- Navigation library version: ___
- Screen transition style chosen: ___
- Deep linking implementation: ___ (Y/N)

---

## Problems & Resolutions

| Problem | Cause | Solution | Time Lost |
|---------|-------|----------|-----------|
| | | | |

---

*After completion, move to 02-products-feature/products.md*
