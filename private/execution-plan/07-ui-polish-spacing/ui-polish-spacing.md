# Phase 7: UI Polish — Safe Areas & Spacing Fixes

## Overview
Fix the "too close to border" issue reported in testing. Ensure proper safe area handling, consistent spacing, and comfortable margins across all screens.

## Acceptance Criteria
- [ ] All screens respect safe areas (notch, status bar, home indicator)
- [ ] Consistent 16px+ horizontal padding on all screens
- [ ] Header properly handles safe area insets
- [ ] Bottom spacing clears the bottom navigation bar
- [ ] No content touches screen edges on any device

## Current Issues Identified

### Issue 1: ProductsScreen Missing Safe Area
**File:** `src/screens/ProductsScreen.tsx`
**Problem:** Uses plain `View` instead of `ScreenWrapper`
```tsx
// Current (BAD)
return (
  <View style={styles.container}>
    <Header ... />
    ...
  </View>
);
```

### Issue 2: Header Fixed Padding
**File:** `src/components/Header.tsx`
**Problem:** Uses fixed `paddingHorizontal: 16` without safe area consideration

### Issue 3: ScreenWrapper Padding Inconsistency
**File:** `src/components/ScreenWrapper.tsx`
**Problem:** Uses `padding: 16` but should use `paddingHorizontal: 20` for better visual comfort

### Issue 4: Bottom Navigation Overlap
**Problem:** Some screens may have content hidden behind bottom nav bar

## Execution Steps

### Step 1: Update ScreenWrapper Component
```typescript
// Improve padding and safe area handling
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: semantic.background,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,  // Increased from 16
    paddingTop: 16,
    paddingBottom: 100,     // Increased to clear bottom nav
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,  // Increased from 16
    paddingTop: 16,
    paddingBottom: 100,     // Increased to clear bottom nav
  },
});
```

### Step 2: Fix ProductsScreen Safe Area
Wrap the ProductsScreen content properly with safe area handling:
- Use `SafeAreaView` or `ScreenWrapper`
- Ensure header respects safe area

### Step 3: Update Header Component
Add safe area inset handling to Header:
```typescript
import {useSafeAreaInsets} from 'react-native-safe-area-context';

export const Header: React.FC<HeaderProps> = ({...}) => {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={[styles.container, {paddingTop: insets.top}]}>
      ...
    </View>
  );
};
```

### Step 4: Audit All Screens
Check each screen for proper spacing:
- [ ] HomeScreen — uses ScreenWrapper ✓
- [ ] ProductsScreen — needs fix
- [ ] ProductDetailScreen — check padding
- [ ] AddProductScreen — check padding
- [ ] CatalogsScreen — check padding
- [ ] CatalogBuilderScreen — check padding
- [ ] CatalogPreviewScreen — check padding
- [ ] SearchScreen — check padding
- [ ] BulkTagScreen — check padding
- [ ] TemplatesScreen — check padding
- [ ] SettingsScreen — check padding

### Step 5: Update ProductCard Grid Spacing
Ensure product grid has proper edge margins:
```typescript
// ProductsScreen styles
productList: {
  paddingHorizontal: 20,  // Match ScreenWrapper
  paddingTop: 0,
  paddingBottom: 120,
},
productRow: {
  gap: 10,  // Slightly increased
  marginBottom: 10,
},
```

## Testing Checklist
- [ ] Test on device with notch (iPhone)
- [ ] Test on device without notch (Android)
- [ ] Test on small screen device (< 360px width)
- [ ] Test on large screen device (> 414px width)
- [ ] Verify no content is hidden behind bottom nav
- [ ] Verify header doesn't overlap status bar

## Progress Tracking
| Date | Status | Notes |
|------|--------|-------|
| | | |

## Related Files
- `src/components/ScreenWrapper.tsx`
- `src/components/Header.tsx`
- `src/screens/ProductsScreen.tsx`
- `src/theme/spacing.ts`
