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

// Template 1: Clean Minimal - Timeless white space
export const minimalTemplate: TemplateConfig = {
  id: 'minimal',
  name: 'Clean Minimal',
  description: 'Timeless elegance with generous white space',
  category: 'minimal',
  colors: {
    primary: '#1A1A1A',
    secondary: '#F5F5F5',
    accent: '#666666',
    background: '#FFFFFF',
    cardBg: '#FFFFFF',
    text: '#1A1A1A',
    textMuted: '#888888',
    price: '#1A1A1A',
    border: '#E8E8E8',
  },
  fonts: {
    heading: 'system',
    body: 'system',
  },
  style: {
    borderRadius: 8,
    shadowOpacity: 0.06,
    spacing: 'spacious',
    imageStyle: 'rounded',
  },
  layout: {
    headerStyle: 'minimal',
    showDividers: true,
    cardStyle: 'flat',
  },
};

// Template 2: Botanical Bliss - Nature inspired
export const botanicalTemplate: TemplateConfig = {
  id: 'botanical',
  name: 'Botanical Bliss',
  description: 'Fresh greens with organic warmth',
  category: 'warm',
  colors: {
    primary: '#2D5A3D',
    secondary: '#E8F5E9',
    accent: '#81C784',
    background: '#FAFCF8',
    cardBg: '#FFFFFF',
    text: '#1B3D2F',
    textMuted: '#6B8E6B',
    price: '#2D5A3D',
    border: '#D4E8D4',
    gradient: ['#2D5A3D', '#3D7A4D'],
  },
  fonts: {
    heading: 'system',
    body: 'system',
  },
  style: {
    borderRadius: 16,
    shadowOpacity: 0.08,
    spacing: 'comfortable',
    imageStyle: 'rounded',
  },
  layout: {
    headerStyle: 'gradient',
    showDividers: false,
    cardStyle: 'elevated',
  },
};

// Template 3: Midnight Luxe - Dark luxury
export const midnightTemplate: TemplateConfig = {
  id: 'midnight',
  name: 'Midnight Luxe',
  description: 'Sophisticated dark with gold accents',
  category: 'elegant',
  colors: {
    primary: '#0F1419',
    secondary: '#1A2332',
    accent: '#D4AF37',
    background: '#0F1419',
    cardBg: '#1A2332',
    text: '#FFFFFF',
    textMuted: '#8A9199',
    price: '#D4AF37',
    border: '#2A3441',
    gradient: ['#0F1419', '#1A2332'],
  },
  fonts: {
    heading: 'system',
    body: 'system',
  },
  style: {
    borderRadius: 12,
    shadowOpacity: 0.2,
    spacing: 'comfortable',
    imageStyle: 'rounded',
  },
  layout: {
    headerStyle: 'gradient',
    showDividers: false,
    cardStyle: 'elevated',
  },
};

// Template 4: Soft Pastel - Dreamy and gentle
export const pastelTemplate: TemplateConfig = {
  id: 'pastel',
  name: 'Soft Pastel',
  description: 'Dreamy pinks and lavenders',
  category: 'playful',
  colors: {
    primary: '#B8A1C9',
    secondary: '#F8F0F8',
    accent: '#F4C2C2',
    background: '#FDF8FA',
    cardBg: '#FFFFFF',
    text: '#5A4A5A',
    textMuted: '#9A8A9A',
    price: '#B8A1C9',
    border: '#F0E0F0',
    gradient: ['#B8A1C9', '#D4C4D9'],
  },
  fonts: {
    heading: 'system',
    body: 'system',
  },
  style: {
    borderRadius: 20,
    shadowOpacity: 0.05,
    spacing: 'comfortable',
    imageStyle: 'rounded',
  },
  layout: {
    headerStyle: 'gradient',
    showDividers: false,
    cardStyle: 'elevated',
  },
};

// Template 5: Terracotta Warmth - Earthy boho
export const terracottaTemplate: TemplateConfig = {
  id: 'terracotta',
  name: 'Terracotta Warmth',
  description: 'Earthy tones with boho vibes',
  category: 'warm',
  colors: {
    primary: '#C65D3B',
    secondary: '#FDF1E8',
    accent: '#E8A87C',
    background: '#FFFAF7',
    cardBg: '#FFFFFF',
    text: '#4A3728',
    textMuted: '#A08070',
    price: '#C65D3B',
    border: '#F0DCD0',
    gradient: ['#C65D3B', '#D97B5D'],
  },
  fonts: {
    heading: 'system',
    body: 'system',
  },
  style: {
    borderRadius: 12,
    shadowOpacity: 0.07,
    spacing: 'comfortable',
    imageStyle: 'rounded',
  },
  layout: {
    headerStyle: 'gradient',
    showDividers: false,
    cardStyle: 'elevated',
  },
};

// Template 6: Royal Indigo - Deep and rich
export const indigoTemplate: TemplateConfig = {
  id: 'indigo',
  name: 'Royal Indigo',
  description: 'Deep indigo with coral highlights',
  category: 'vibrant',
  colors: {
    primary: '#3F51B5',
    secondary: '#E8EAF6',
    accent: '#FF6B6B',
    background: '#FAFBFF',
    cardBg: '#FFFFFF',
    text: '#1A237E',
    textMuted: '#666699',
    price: '#3F51B5',
    border: '#E0E0F0',
    gradient: ['#3F51B5', '#5C6BC0'],
  },
  fonts: {
    heading: 'system',
    body: 'system',
  },
  style: {
    borderRadius: 14,
    shadowOpacity: 0.1,
    spacing: 'comfortable',
    imageStyle: 'rounded',
  },
  layout: {
    headerStyle: 'gradient',
    showDividers: false,
    cardStyle: 'elevated',
  },
};

// Template 7: Golden Hour - Sunset vibes
export const goldenHourTemplate: TemplateConfig = {
  id: 'golden',
  name: 'Golden Hour',
  description: 'Warm sunset gradients',
  category: 'warm',
  colors: {
    primary: '#E07B39',
    secondary: '#FFF3E0',
    accent: '#FFB74D',
    background: '#FFFAF5',
    cardBg: '#FFFFFF',
    text: '#5D4037',
    textMuted: '#A08060',
    price: '#E07B39',
    border: '#FFE0B2',
    gradient: ['#E07B39', '#F5A623'],
  },
  fonts: {
    heading: 'system',
    body: 'system',
  },
  style: {
    borderRadius: 16,
    shadowOpacity: 0.08,
    spacing: 'comfortable',
    imageStyle: 'rounded',
  },
  layout: {
    headerStyle: 'gradient',
    showDividers: false,
    cardStyle: 'elevated',
  },
};

// Template 8: Nordic Winter - Cool and crisp
export const nordicTemplate: TemplateConfig = {
  id: 'nordic',
  name: 'Nordic Winter',
  description: 'Cool blues with crisp whites',
  category: 'minimal',
  colors: {
    primary: '#4A6FA5',
    secondary: '#E3F2FD',
    accent: '#64B5F6',
    background: '#FAFCFF',
    cardBg: '#FFFFFF',
    text: '#1A3A5C',
    textMuted: '#6B8CAC',
    price: '#4A6FA5',
    border: '#BBDEFB',
    gradient: ['#4A6FA5', '#6B9BD1'],
  },
  fonts: {
    heading: 'system',
    body: 'system',
  },
  style: {
    borderRadius: 10,
    shadowOpacity: 0.06,
    spacing: 'comfortable',
    imageStyle: 'rounded',
  },
  layout: {
    headerStyle: 'gradient',
    showDividers: true,
    cardStyle: 'elevated',
  },
};

// All templates collection
export const catalogTemplates: TemplateConfig[] = [
  minimalTemplate,
  botanicalTemplate,
  midnightTemplate,
  pastelTemplate,
  terracottaTemplate,
  indigoTemplate,
  goldenHourTemplate,
  nordicTemplate,
];

// Get template by ID
export const getTemplate = (id: string): TemplateConfig => {
  return catalogTemplates.find(t => t.id === id) || minimalTemplate;
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
export type TemplateId = 
  | 'minimal' 
  | 'botanical' 
  | 'midnight' 
  | 'pastel' 
  | 'terracotta' 
  | 'indigo'
  | 'golden'
  | 'nordic';
