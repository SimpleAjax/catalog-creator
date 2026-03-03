// Beautiful Catalog Templates
// Each template defines a complete visual identity for catalogs

export interface TemplateConfig {
  id: string;
  name: string;
  description: string;
  category: 'minimal' | 'vibrant' | 'elegant' | 'warm' | 'dark' | 'playful';
  colors: {
    primary: string;        // Main brand color
    secondary: string;      // Supporting color
    accent: string;         // Highlights/CTAs
    background: string;     // Page background
    cardBg: string;         // Product card background
    text: string;           // Primary text
    textMuted: string;      // Secondary text
    price: string;          // Price color
    border: string;         // Border color
    gradient?: string[];    // Optional gradient for header
  };
  fonts: {
    heading: string;        // Header font family hint
    body: string;           // Body text font hint
  };
  style: {
    borderRadius: number;   // Card corner radius
    shadowOpacity: number;  // Card shadow intensity
    spacing: 'compact' | 'comfortable' | 'spacious';
    imageStyle: 'rounded' | 'square' | 'circle';
  };
  layout: {
    headerStyle: 'gradient' | 'solid' | 'minimal' | 'pattern';
    showDividers: boolean;
    cardStyle: 'elevated' | 'flat' | 'outlined';
  };
}

// Line Sheet Template - Elegant jewelry/accessory catalog style
export const lineSheetTemplate: TemplateConfig = {
  id: 'linesheet',
  name: 'Line Sheet',
  description: 'Elegant 3-column grid with dual images, perfect for jewelry and accessories',
  category: 'elegant',
  colors: {
    primary: '#1A1A1A',           // Dark text
    secondary: '#F5F0EB',         // Warm cream background
    accent: '#C4A77D',            // Warm gold accent
    background: '#FAF8F5',        // Very light cream page background
    cardBg: '#FFFFFF',            // White card background
    text: '#1A1A1A',              // Dark text
    textMuted: '#8B8680',         // Warm gray for secondary text
    price: '#1A1A1A',             // Dark price text
    border: '#E8E2DB',            // Warm light border
  },
  fonts: {
    heading: 'system',
    body: 'system',
  },
  style: {
    borderRadius: 8,
    shadowOpacity: 0.04,
    spacing: 'comfortable',
    imageStyle: 'square',
  },
  layout: {
    headerStyle: 'minimal',
    showDividers: false,
    cardStyle: 'flat',
  },
};

// All templates collection - currently only Line Sheet
export const catalogTemplates: TemplateConfig[] = [
  lineSheetTemplate,
];

// Get template by ID
export const getTemplate = (id: string): TemplateConfig => {
  return catalogTemplates.find(t => t.id === id) || lineSheetTemplate;
};

// Get template colors in legacy format (for backward compatibility)
export const getTemplateColors = (id: string) => {
  const template = getTemplate(id);
  return {
    primary: template.colors.primary,
    secondary: template.colors.secondary,
    accent: template.colors.accent,
    background: template.colors.background,
    cardBg: template.colors.cardBg,
    text: template.colors.text,
    textMuted: template.colors.textMuted,
    price: template.colors.price,
    border: template.colors.border,
    gradient: template.colors.gradient,
  };
};

// Template IDs for type safety
export type TemplateId = 'linesheet';
