// Catalog Creator - Spacing System
// Based on 4px base unit

export const spacing = {
  xs: 4,   // Tight spacing, icon gaps
  sm: 8,   // Small gaps, compact layouts
  md: 12,  // Default element spacing
  lg: 16,  // Card padding, section gaps
  xl: 20,  // Large gaps, relaxed layouts
  xxl: 24, // Screen padding, major sections
  xxxl: 32,// Section breaks
  xxxxl: 40, // Large section margins
  xxxxxl: 48, // Major dividers
};

// Layout constants
export const layout = {
  // Screen padding
  screenPaddingHorizontal: 16,
  screenPaddingTop: 16,
  screenPaddingBottom: 80, // Clears bottom nav

  // Card padding
  cardPadding: 16,
  cardPaddingCompact: 12,
  cardPaddingLoose: 20,

  // Grid gaps
  productGridGap: 8,
  cardListGap: 12,
  buttonGroupGap: 12,

  // Section spacing
  sectionSpacing: 24,
  sectionInnerSpacing: 16,
  relatedItemSpacing: 12,

  // Touch targets
  minTouchTarget: 44,
  preferredTouchTarget: 48,
  touchTargetSpacing: 8,

  // Button heights
  buttonLarge: 56,
  buttonDefault: 48,
  buttonSmall: 40,
  buttonIcon: 44,

  // Input heights
  inputDefault: 52,
  inputCompact: 44,
  inputTextAreaMin: 100,

  // Navigation
  bottomNavHeight: 64,
  topNavHeight: 56,
};
