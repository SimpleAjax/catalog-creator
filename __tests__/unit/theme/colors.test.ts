// Theme color tests
import {colors, semantic} from '@/theme/colors';
import {catalogTemplates, getTemplate, getTemplateColors} from '@/theme/templates';

describe('colors', () => {
  it('should have primary color scale', () => {
    expect(colors.primary[500]).toBe('#EF4444');
    expect(colors.primary[600]).toBe('#DC2626');
    expect(colors.primary[100]).toBe('#FEE2E2');
  });

  it('should have blue color scale', () => {
    expect(colors.blue[500]).toBe('#3B82F6');
    expect(colors.blue[600]).toBe('#2563EB');
  });

  it('should have green color scale', () => {
    expect(colors.green[500]).toBe('#22C55E');
    expect(colors.green[600]).toBe('#16A34A');
  });

  it('should have amber color scale', () => {
    expect(colors.amber[500]).toBe('#F59E0B');
    expect(colors.amber[600]).toBe('#D97706');
  });

  it('should have purple color scale', () => {
    expect(colors.purple[500]).toBe('#A855F7');
    expect(colors.purple[600]).toBe('#9333EA');
  });

  it('should have gray color scale', () => {
    expect(colors.gray[50]).toBe('#F9FAFB');
    expect(colors.gray[900]).toBe('#111827');
  });

  it('should have true colors', () => {
    expect(colors.white).toBe('#FFFFFF');
    expect(colors.black).toBe('#000000');
  });
});

describe('semantic', () => {
  it('should map primary colors correctly', () => {
    expect(semantic.primary).toBe(colors.primary[500]);
    expect(semantic.primaryDark).toBe(colors.primary[600]);
    expect(semantic.primaryLight).toBe(colors.primary[100]);
  });

  it('should map status colors correctly', () => {
    expect(semantic.success).toBe(colors.green[500]);
    expect(semantic.warning).toBe(colors.amber[500]);
    expect(semantic.error).toBe(colors.primary[500]);
    expect(semantic.info).toBe(colors.blue[500]);
  });

  it('should map UI colors correctly', () => {
    expect(semantic.background).toBe(colors.gray[50]);
    expect(semantic.card).toBe(colors.white);
    expect(semantic.text).toBe(colors.gray[900]);
    expect(semantic.textSecondary).toBe(colors.gray[500]);
    expect(semantic.textTertiary).toBe(colors.gray[400]);
    expect(semantic.border).toBe(colors.gray[200]);
    expect(semantic.divider).toBe(colors.gray[100]);
  });

  it('should have WhatsApp color', () => {
    expect(semantic.whatsapp).toBe(colors.green[600]);
  });
});

describe('catalogTemplates', () => {
  it('should have minimal template', () => {
    const template = getTemplate('minimal');
    expect(template.id).toBe('minimal');
    expect(template.name).toBe('Clean Minimal');
    expect(template.colors.primary).toBe('#1A1A1A');
  });

  it('should have botanical template', () => {
    const template = getTemplate('botanical');
    expect(template.id).toBe('botanical');
    expect(template.name).toBe('Botanical Bliss');
    expect(template.category).toBe('warm');
  });

  it('should have midnight template', () => {
    const template = getTemplate('midnight');
    expect(template.id).toBe('midnight');
    expect(template.name).toBe('Midnight Luxe');
    expect(template.category).toBe('elegant');
  });

  it('should have pastel template', () => {
    const template = getTemplate('pastel');
    expect(template.id).toBe('pastel');
    expect(template.name).toBe('Soft Pastel');
    expect(template.category).toBe('playful');
  });

  it('should have terracotta template', () => {
    const template = getTemplate('terracotta');
    expect(template.id).toBe('terracotta');
    expect(template.name).toBe('Terracotta Warmth');
    expect(template.category).toBe('warm');
  });

  it('should have indigo template', () => {
    const template = getTemplate('indigo');
    expect(template.id).toBe('indigo');
    expect(template.name).toBe('Royal Indigo');
    expect(template.category).toBe('vibrant');
  });

  it('should have golden template', () => {
    const template = getTemplate('golden');
    expect(template.id).toBe('golden');
    expect(template.name).toBe('Golden Hour');
    expect(template.category).toBe('warm');
  });

  it('should have nordic template', () => {
    const template = getTemplate('nordic');
    expect(template.id).toBe('nordic');
    expect(template.name).toBe('Nordic Winter');
    expect(template.category).toBe('minimal');
  });

  it('should have all 8 templates', () => {
    expect(catalogTemplates.length).toBe(8);
    const ids = catalogTemplates.map(t => t.id);
    expect(ids).toContain('minimal');
    expect(ids).toContain('botanical');
    expect(ids).toContain('midnight');
    expect(ids).toContain('pastel');
    expect(ids).toContain('terracotta');
    expect(ids).toContain('indigo');
    expect(ids).toContain('golden');
    expect(ids).toContain('nordic');
  });

  it('should fallback to minimal for unknown template', () => {
    const template = getTemplate('unknown');
    expect(template.id).toBe('minimal');
  });
});

// Helper function to test if a string is a valid hex color
const isValidHexColor = (color: string): boolean => {
  return /^#[0-9A-Fa-f]{6}$/.test(color);
};

describe('color values', () => {
  it('all semantic colors should be valid hex colors', () => {
    const colorValues = [
      semantic.primary,
      semantic.primaryDark,
      semantic.primaryLight,
      semantic.secondary,
      semantic.success,
      semantic.whatsapp,
      semantic.warning,
      semantic.error,
      semantic.info,
      semantic.background,
      semantic.card,
      semantic.text,
      semantic.textSecondary,
      semantic.textTertiary,
      semantic.border,
      semantic.divider,
    ];

    colorValues.forEach(color => {
      expect(isValidHexColor(color)).toBe(true);
    });
  });

  it('all template colors should be valid hex colors', () => {
    catalogTemplates.forEach(template => {
      expect(isValidHexColor(template.colors.primary)).toBe(true);
      expect(isValidHexColor(template.colors.secondary)).toBe(true);
      expect(isValidHexColor(template.colors.accent)).toBe(true);
      expect(isValidHexColor(template.colors.background)).toBe(true);
      expect(isValidHexColor(template.colors.cardBg)).toBe(true);
      expect(isValidHexColor(template.colors.text)).toBe(true);
      expect(isValidHexColor(template.colors.price)).toBe(true);
    });
  });

  it('getTemplateColors should return color object', () => {
    const colors = getTemplateColors('botanical');
    expect(colors.primary).toBe('#2D5A3D');
    expect(colors.secondary).toBe('#E8F5E9');
  });
});
