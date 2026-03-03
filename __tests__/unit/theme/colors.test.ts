// Theme color tests
import {colors, semantic, templateColors} from '@/theme/colors';

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

describe('templateColors', () => {
  it('should have minimal template colors', () => {
    expect(templateColors.minimal.primary).toBe('#374151');
    expect(templateColors.minimal.secondary).toBe('#F3F4F6');
  });

  it('should have bold template colors', () => {
    expect(templateColors.bold.primary).toBe('#DC2626');
    expect(templateColors.bold.secondary).toBe('#FEE2E2');
  });

  it('should have elegant template colors', () => {
    expect(templateColors.elegant.primary).toBe('#7C3AED');
    expect(templateColors.elegant.secondary).toBe('#EDE9FE');
  });

  it('should have festive template colors', () => {
    expect(templateColors.festive.primary).toBe('#D97706');
    expect(templateColors.festive.secondary).toBe('#FEF3C7');
  });

  it('should have modern template colors', () => {
    expect(templateColors.modern.primary).toBe('#0891B2');
    expect(templateColors.modern.secondary).toBe('#CFFAFE');
  });

  it('should have all required templates', () => {
    expect(Object.keys(templateColors)).toContain('minimal');
    expect(Object.keys(templateColors)).toContain('bold');
    expect(Object.keys(templateColors)).toContain('elegant');
    expect(Object.keys(templateColors)).toContain('festive');
    expect(Object.keys(templateColors)).toContain('modern');
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
    Object.values(templateColors).forEach(template => {
      expect(isValidHexColor(template.primary)).toBe(true);
      expect(isValidHexColor(template.secondary)).toBe(true);
    });
  });
});
