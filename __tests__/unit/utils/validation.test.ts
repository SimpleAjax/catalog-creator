// Validation utility tests
import {
  validateProductInput,
  validateCatalogInput,
  isValidEmail,
  isValidPhone,
  isValidUrl,
  isEmpty,
  validateTagName,
  isValidSearchQuery,
} from '@/utils/validation';

describe('validateProductInput', () => {
  it('should validate valid product', () => {
    const input = {
      name: 'Test Product',
      price: 999,
      imageUri: 'test.jpg',
    };
    const result = validateProductInput(input);
    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual({});
  });

  it('should require name', () => {
    const input = {imageUri: 'test.jpg'};
    const result = validateProductInput(input);
    expect(result.isValid).toBe(false);
    expect(result.errors.name).toBe('Product name is required');
  });

  it('should reject empty name', () => {
    const input = {name: '   ', imageUri: 'test.jpg'};
    const result = validateProductInput(input);
    expect(result.isValid).toBe(false);
    expect(result.errors.name).toBe('Product name is required');
  });

  it('should require image', () => {
    const input = {name: 'Test Product'};
    const result = validateProductInput(input);
    expect(result.isValid).toBe(false);
    expect(result.errors.imageUri).toBe('Product image is required');
  });

  it('should validate name length', () => {
    const input = {
      name: 'a'.repeat(101),
      imageUri: 'test.jpg',
    };
    const result = validateProductInput(input);
    expect(result.isValid).toBe(false);
    expect(result.errors.name).toBe('Product name must be less than 100 characters');
  });

  it('should validate negative price', () => {
    const input = {
      name: 'Test',
      price: -100,
      imageUri: 'test.jpg',
    };
    const result = validateProductInput(input);
    expect(result.isValid).toBe(false);
    expect(result.errors.price).toBe('Price cannot be negative');
  });

  it('should validate price too high', () => {
    const input = {
      name: 'Test',
      price: 10000001,
      imageUri: 'test.jpg',
    };
    const result = validateProductInput(input);
    expect(result.isValid).toBe(false);
    expect(result.errors.price).toBe('Price seems too high');
  });

  it('should validate MRP greater than price', () => {
    const input = {
      name: 'Test',
      price: 1000,
      mrp: 500,
      imageUri: 'test.jpg',
    };
    const result = validateProductInput(input);
    expect(result.isValid).toBe(false);
    expect(result.errors.mrp).toBe('MRP should be greater than or equal to price');
  });

  it('should validate description length', () => {
    const input = {
      name: 'Test',
      imageUri: 'test.jpg',
      description: 'a'.repeat(501),
    };
    const result = validateProductInput(input);
    expect(result.isValid).toBe(false);
    expect(result.errors.description).toBe('Description must be less than 500 characters');
  });

  it('should accept valid product without optional fields', () => {
    const input = {
      name: 'Test',
      imageUri: 'test.jpg',
    };
    const result = validateProductInput(input);
    expect(result.isValid).toBe(true);
  });
});

describe('validateCatalogInput', () => {
  it('should validate valid catalog', () => {
    const input = {
      name: 'Summer Collection',
      template: 'minimal' as const,
      primaryColor: '#374151',
      secondaryColor: '#F3F4F6',
    };
    const result = validateCatalogInput(input);
    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual({});
  });

  it('should require name', () => {
    const input = {
      template: 'minimal',
      primaryColor: '#374151',
      secondaryColor: '#F3F4F6',
    };
    const result = validateCatalogInput(input);
    expect(result.isValid).toBe(false);
    expect(result.errors.name).toBe('Catalog name is required');
  });

  it('should validate template', () => {
    const input = {
      name: 'Test',
      template: 'invalid',
      primaryColor: '#374151',
      secondaryColor: '#F3F4F6',
    };
    const result = validateCatalogInput(input);
    expect(result.isValid).toBe(false);
    expect(result.errors.template).toBe('Please select a valid template');
  });

  it('should accept all valid templates', () => {
    const validTemplates = ['minimal', 'bold', 'elegant', 'festive', 'modern'];
    validTemplates.forEach(template => {
      const input = {
        name: 'Test',
        template: template as any,
        primaryColor: '#374151',
        secondaryColor: '#F3F4F6',
      };
      const result = validateCatalogInput(input);
      expect(result.isValid).toBe(true);
    });
  });

  it('should validate primary color format', () => {
    const input = {
      name: 'Test',
      template: 'minimal',
      primaryColor: 'invalid',
      secondaryColor: '#F3F4F6',
    };
    const result = validateCatalogInput(input);
    expect(result.isValid).toBe(false);
    expect(result.errors.primaryColor).toBe('Primary color must be a valid hex color (e.g., #374151)');
  });

  it('should validate secondary color format', () => {
    const input = {
      name: 'Test',
      template: 'minimal',
      primaryColor: '#374151',
      secondaryColor: '#GGGGGG',
    };
    const result = validateCatalogInput(input);
    expect(result.isValid).toBe(false);
    expect(result.errors.secondaryColor).toBe('Secondary color must be a valid hex color');
  });
});

describe('isValidEmail', () => {
  it('should validate correct emails', () => {
    expect(isValidEmail('test@example.com')).toBe(true);
    expect(isValidEmail('user.name@domain.co.in')).toBe(true);
  });

  it('should reject invalid emails', () => {
    expect(isValidEmail('invalid')).toBe(false);
    expect(isValidEmail('@example.com')).toBe(false);
    expect(isValidEmail('test@')).toBe(false);
    expect(isValidEmail('test@.com')).toBe(false);
  });
});

describe('isValidPhone', () => {
  it('should validate Indian phone numbers', () => {
    expect(isValidPhone('9876543210')).toBe(true);
    expect(isValidPhone('98765 43210')).toBe(true);
    expect(isValidPhone('9876543210')).toBe(true);
  });

  it('should reject invalid phone numbers', () => {
    expect(isValidPhone('1234567890')).toBe(false);
    expect(isValidPhone('987654321')).toBe(false);
    expect(isValidPhone('98765432101')).toBe(false);
    expect(isValidPhone('abc')).toBe(false);
  });
});

describe('isValidUrl', () => {
  it('should validate URLs', () => {
    expect(isValidUrl('https://example.com')).toBe(true);
    expect(isValidUrl('http://localhost:3000')).toBe(true);
  });

  it('should reject invalid URLs', () => {
    expect(isValidUrl('not-a-url')).toBe(false);
    expect(isValidUrl('')).toBe(false);
  });
});

describe('isEmpty', () => {
  it('should detect empty strings', () => {
    expect(isEmpty('')).toBe(true);
    expect(isEmpty('   ')).toBe(true);
    expect(isEmpty(null)).toBe(true);
    expect(isEmpty(undefined)).toBe(true);
  });

  it('should detect non-empty strings', () => {
    expect(isEmpty('hello')).toBe(false);
    expect(isEmpty('  hello  ')).toBe(false);
  });
});

describe('validateTagName', () => {
  it('should validate valid tag names', () => {
    expect(validateTagName('New Arrival').isValid).toBe(true);
    expect(validateTagName('summer-collection').isValid).toBe(true);
    expect(validateTagName('Sale 2024').isValid).toBe(true);
  });

  it('should reject empty tags', () => {
    const result = validateTagName('');
    expect(result.isValid).toBe(false);
    expect(result.errors.name).toBe('Tag name is required');
  });

  it('should reject long tags', () => {
    const result = validateTagName('a'.repeat(31));
    expect(result.isValid).toBe(false);
    expect(result.errors.name).toBe('Tag name must be less than 30 characters');
  });

  it('should reject invalid characters', () => {
    const result = validateTagName('Sale@2024');
    expect(result.isValid).toBe(false);
    expect(result.errors.name).toBe('Tag name can only contain letters, numbers, spaces, and hyphens');
  });
});

describe('isValidSearchQuery', () => {
  it('should validate search queries', () => {
    expect(isValidSearchQuery('red saree')).toBe(true);
    expect(isValidSearchQuery('ab')).toBe(true);
  });

  it('should reject short queries', () => {
    expect(isValidSearchQuery('a')).toBe(false);
  });

  it('should reject empty queries', () => {
    expect(isValidSearchQuery('')).toBe(false);
    expect(isValidSearchQuery('   ')).toBe(false);
  });

  it('should reject very long queries', () => {
    expect(isValidSearchQuery('a'.repeat(101))).toBe(false);
  });
});
