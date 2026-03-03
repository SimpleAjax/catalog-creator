// Formatting utility tests
import {
  formatPrice,
  formatDate,
  formatRelativeTime,
  truncateText,
  capitalizeWords,
  formatFileSize,
  formatCount,
} from '@/utils/formatting';

describe('formatPrice', () => {
  it('should format price with rupee symbol', () => {
    expect(formatPrice(999)).toBe('₹999');
    expect(formatPrice(1000)).toBe('₹1,000');
    expect(formatPrice(100000)).toBe('₹1,00,000');
  });

  it('should handle null price', () => {
    expect(formatPrice(null)).toBe('Not set');
  });

  it('should handle undefined price', () => {
    expect(formatPrice(undefined as any)).toBe('Not set');
  });

  it('should handle zero price', () => {
    expect(formatPrice(0)).toBe('₹0');
  });

  it('should format large numbers correctly', () => {
    expect(formatPrice(9999999)).toBe('₹99,99,999');
  });
});

describe('formatDate', () => {
  it('should format date correctly', () => {
    const dateString = '2024-03-15T10:30:00Z';
    const result = formatDate(dateString);
    expect(result).toContain('15');
    expect(result).toContain('2024');
  });

  it('should handle empty string', () => {
    expect(formatDate('')).toBe('');
  });

  it('should handle invalid date', () => {
    expect(formatDate('invalid')).toBe('Invalid Date');
  });
});

describe('formatRelativeTime', () => {
  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-03-15T12:00:00Z'));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('should show "Just now" for recent times', () => {
    const justNow = new Date('2024-03-15T11:59:30Z').toISOString();
    expect(formatRelativeTime(justNow)).toBe('Just now');
  });

  it('should show minutes ago', () => {
    const minutesAgo = new Date('2024-03-15T11:55:00Z').toISOString();
    expect(formatRelativeTime(minutesAgo)).toBe('5 minutes ago');
  });

  it('should show hours ago', () => {
    const hoursAgo = new Date('2024-03-15T10:00:00Z').toISOString();
    expect(formatRelativeTime(hoursAgo)).toBe('2 hours ago');
  });

  it('should show "Yesterday"', () => {
    const yesterday = new Date('2024-03-14T12:00:00Z').toISOString();
    expect(formatRelativeTime(yesterday)).toBe('Yesterday');
  });

  it('should show days ago', () => {
    const daysAgo = new Date('2024-03-12T12:00:00Z').toISOString();
    expect(formatRelativeTime(daysAgo)).toBe('3 days ago');
  });

  it('should show weeks ago', () => {
    const weeksAgo = new Date('2024-03-01T12:00:00Z').toISOString();
    expect(formatRelativeTime(weeksAgo)).toBe('2 weeks ago');
  });
});

describe('truncateText', () => {
  it('should truncate long text', () => {
    const longText = 'This is a very long text that needs to be truncated';
    expect(truncateText(longText, 20)).toBe('This is a very long...');
  });

  it('should not truncate short text', () => {
    const shortText = 'Short text';
    expect(truncateText(shortText, 20)).toBe('Short text');
  });

  it('should handle exact length', () => {
    const text = 'Exactly twenty chars';
    expect(truncateText(text, 20)).toBe('Exactly twenty chars');
  });

  it('should handle empty string', () => {
    expect(truncateText('', 10)).toBe('');
  });
});

describe('capitalizeWords', () => {
  it('should capitalize each word', () => {
    expect(capitalizeWords('hello world')).toBe('Hello World');
    expect(capitalizeWords('RED SAREE')).toBe('Red Saree');
  });

  it('should handle single word', () => {
    expect(capitalizeWords('hello')).toBe('Hello');
  });

  it('should handle empty string', () => {
    expect(capitalizeWords('')).toBe('');
  });

  it('should handle multiple spaces', () => {
    expect(capitalizeWords('hello   world')).toBe('Hello   World');
  });
});

describe('formatFileSize', () => {
  it('should format bytes', () => {
    expect(formatFileSize(500)).toBe('500 B');
  });

  it('should format kilobytes', () => {
    expect(formatFileSize(1024)).toBe('1 KB');
    expect(formatFileSize(1536)).toBe('1.5 KB');
  });

  it('should format megabytes', () => {
    expect(formatFileSize(1024 * 1024)).toBe('1 MB');
    expect(formatFileSize(2.5 * 1024 * 1024)).toBe('2.5 MB');
  });

  it('should format gigabytes', () => {
    expect(formatFileSize(1024 * 1024 * 1024)).toBe('1 GB');
  });

  it('should handle zero', () => {
    expect(formatFileSize(0)).toBe('0 B');
  });
});

describe('formatCount', () => {
  it('should show exact count for small numbers', () => {
    expect(formatCount(999)).toBe('999');
  });

  it('should format thousands with k suffix', () => {
    expect(formatCount(1200)).toBe('1.2k');
    expect(formatCount(999999)).toBe('1000.0k');
  });

  it('should format millions with M suffix', () => {
    expect(formatCount(1500000)).toBe('1.5M');
    expect(formatCount(25000000)).toBe('25.0M');
  });
});
