// Catalog Creator - Color System
// Based on Design System v1.0

export const colors = {
  // Primary (Brand Red)
  primary: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    200: '#FECACA',
    300: '#FCA5A5',
    400: '#F87171',
    500: '#EF4444', // Primary Action Color
    600: '#DC2626',
    700: '#B91C1C',
    800: '#991B1B',
    900: '#7F1D1D',
  },

  // Blue (Information & Trust)
  blue: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    500: '#3B82F6',
    600: '#2563EB',
  },

  // Green (Success & WhatsApp)
  green: {
    50: '#F0FDF4',
    100: '#DCFCE7',
    500: '#22C55E',
    600: '#16A34A', // WhatsApp Share
  },

  // Amber (Warnings & Festive)
  amber: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    500: '#F59E0B',
    600: '#D97706',
  },

  // Purple (Elegant/Premium)
  purple: {
    50: '#FAF5FF',
    100: '#F3E8FF',
    500: '#A855F7',
    600: '#9333EA',
  },

  // Gray (UI Foundation)
  gray: {
    50: '#F9FAFB', // Page backgrounds
    100: '#F3F4F6', // Card backgrounds, inputs
    200: '#E5E7EB', // Borders, dividers
    300: '#D1D5DB', // Disabled borders
    400: '#9CA3AF', // Placeholder text
    500: '#6B7280', // Secondary text
    600: '#4B5563', // Body text
    700: '#374151', // Strong text
    800: '#1F2937', // Headings
    900: '#111827', // Primary text
  },

  // True colors
  white: '#FFFFFF',
  black: '#000000',
};

// Semantic colors for easy access
export const semantic = {
  primary: colors.primary[500],
  primaryDark: colors.primary[600],
  primaryLight: colors.primary[100],
  secondary: colors.gray[100],
  success: colors.green[500],
  whatsapp: colors.green[600],
  warning: colors.amber[500],
  error: colors.primary[500],
  info: colors.blue[500],
  background: colors.gray[50],
  card: colors.white,
  text: colors.gray[900],
  textSecondary: colors.gray[500],
  textTertiary: colors.gray[400],
  border: colors.gray[200],
  divider: colors.gray[100],
};

// Template exports moved to templates.ts
// Import from '@/theme/templates' for full template configuration
