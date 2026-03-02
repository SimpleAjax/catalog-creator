// Simple utility tests - no native dependencies

describe('Basic Math', () => {
  it('should add numbers correctly', () => {
    expect(1 + 1).toBe(2);
  });

  it('should multiply numbers correctly', () => {
    expect(2 * 3).toBe(6);
  });
});

describe('String Operations', () => {
  it('should format price correctly', () => {
    const formatPrice = (price: number | null): string => {
      if (price === null) return 'Not set';
      return `₹${price}`;
    };

    expect(formatPrice(999)).toBe('₹999');
    expect(formatPrice(null)).toBe('Not set');
    expect(formatPrice(0)).toBe('₹0');
  });

  it('should capitalize first letter', () => {
    const capitalize = (str: string): string => {
      return str.charAt(0).toUpperCase() + str.slice(1);
    };

    expect(capitalize('hello')).toBe('Hello');
    expect(capitalize('world')).toBe('World');
  });
});

describe('Array Operations', () => {
  it('should remove duplicates from array', () => {
    const unique = [...new Set(['a', 'b', 'a', 'c', 'b'])];
    expect(unique).toEqual(['a', 'b', 'c']);
  });

  it('should filter empty strings', () => {
    const arr = ['a', '', 'b', '', 'c'];
    const filtered = arr.filter(Boolean);
    expect(filtered).toEqual(['a', 'b', 'c']);
  });
});
