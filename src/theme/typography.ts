// Catalog Creator - Typography System
// Platform: React Native (iOS & Android)

import {Platform} from 'react-native';

// Font family
export const fontFamily = Platform.select({
  ios: 'Inter',
  android: 'Roboto',
  default: 'System',
});

// Font weights
export const fontWeight = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const;

// Type scale
export const typography = {
  // Screen titles
  h1: {
    fontSize: 28,
    fontWeight: fontWeight.bold,
    lineHeight: 36,
    letterSpacing: -0.5,
  },
  // Section headers
  h2: {
    fontSize: 22,
    fontWeight: fontWeight.bold,
    lineHeight: 30,
    letterSpacing: -0.3,
  },
  // Card titles
  h3: {
    fontSize: 18,
    fontWeight: fontWeight.semibold,
    lineHeight: 26,
    letterSpacing: -0.2,
  },
  // Subsection titles
  h4: {
    fontSize: 16,
    fontWeight: fontWeight.semibold,
    lineHeight: 24,
    letterSpacing: 0,
  },
  // Body text
  body: {
    fontSize: 16,
    fontWeight: fontWeight.regular,
    lineHeight: 24,
    letterSpacing: 0,
  },
  // Descriptions
  bodySmall: {
    fontSize: 14,
    fontWeight: fontWeight.regular,
    lineHeight: 22,
    letterSpacing: 0,
  },
  // Labels, badges
  caption: {
    fontSize: 12,
    fontWeight: fontWeight.medium,
    lineHeight: 18,
    letterSpacing: 0.2,
  },
  // Tags, categories
  overline: {
    fontSize: 11,
    fontWeight: fontWeight.semibold,
    lineHeight: 16,
    letterSpacing: 0.5,
  },
  // Button text
  button: {
    fontSize: 16,
    fontWeight: fontWeight.semibold,
    lineHeight: 24,
    letterSpacing: 0.3,
  },
  // Small buttons
  buttonSmall: {
    fontSize: 14,
    fontWeight: fontWeight.medium,
    lineHeight: 20,
    letterSpacing: 0.2,
  },
};

// Typography patterns (for specific use cases)
export const textStyles = {
  // Screen Title
  screenTitle: {
    fontSize: 20,
    fontWeight: fontWeight.bold,
    color: '#111827', // Gray 900
  },
  // Section Header
  sectionHeader: {
    fontSize: 18,
    fontWeight: fontWeight.bold,
    color: '#111827',
    marginBottom: 12,
  },
  // Card Title
  cardTitle: {
    fontSize: 16,
    fontWeight: fontWeight.semibold,
    color: '#111827',
  },
  // Price Display
  price: {
    fontSize: 14,
    fontWeight: fontWeight.bold,
    color: '#111827',
  },
  // Body Text
  body: {
    fontSize: 16,
    fontWeight: fontWeight.regular,
    color: '#4B5563', // Gray 600
    lineHeight: 24,
  },
  // Caption/Helper
  caption: {
    fontSize: 13,
    fontWeight: fontWeight.regular,
    color: '#6B7280', // Gray 500
  },
};
