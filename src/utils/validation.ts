// Validation utilities for the Catalog Creator app

import {ProductInput, CatalogInput} from '@/types';

interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

/**
 * Validate product input
 * @param input - Product input data
 * @returns Validation result
 */
export const validateProductInput = (input: Partial<ProductInput>): ValidationResult => {
  const errors: Record<string, string> = {};

  // Name validation
  if (!input.name || input.name.trim() === '') {
    errors.name = 'Product name is required';
  } else if (input.name.length > 100) {
    errors.name = 'Product name must be less than 100 characters';
  }

  // Image validation
  if (!input.imageUri || input.imageUri.trim() === '') {
    errors.imageUri = 'Product image is required';
  }

  // Price validation
  if (input.price !== null && input.price !== undefined) {
    if (input.price < 0) {
      errors.price = 'Price cannot be negative';
    } else if (input.price > 10000000) {
      errors.price = 'Price seems too high';
    }
  }

  // MRP validation
  if (input.mrp !== null && input.mrp !== undefined) {
    if (input.mrp < 0) {
      errors.mrp = 'MRP cannot be negative';
    }
    if (input.price !== null && input.price !== undefined && input.mrp < input.price) {
      errors.mrp = 'MRP should be greater than or equal to price';
    }
  }

  // Description validation
  if (input.description && input.description.length > 500) {
    errors.description = 'Description must be less than 500 characters';
  }

  // Category validation
  if (input.category && input.category.length > 50) {
    errors.category = 'Category must be less than 50 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validate catalog input
 * @param input - Catalog input data
 * @returns Validation result
 */
export const validateCatalogInput = (input: Partial<CatalogInput>): ValidationResult => {
  const errors: Record<string, string> = {};

  // Name validation
  if (!input.name || input.name.trim() === '') {
    errors.name = 'Catalog name is required';
  } else if (input.name.length > 100) {
    errors.name = 'Catalog name must be less than 100 characters';
  }

  // Template validation
  const validTemplates = ['minimal', 'botanical', 'midnight', 'pastel', 'terracotta', 'indigo', 'golden', 'nordic'];
  if (!input.template || !validTemplates.includes(input.template)) {
    errors.template = 'Please select a valid template';
  }

  // Color validation
  const hexColorRegex = /^#[0-9A-Fa-f]{6}$/;
  if (!input.primaryColor || !hexColorRegex.test(input.primaryColor)) {
    errors.primaryColor = 'Primary color must be a valid hex color (e.g., #374151)';
  }
  if (!input.secondaryColor || !hexColorRegex.test(input.secondaryColor)) {
    errors.secondaryColor = 'Secondary color must be a valid hex color';
  }

  // Store name validation
  if (input.storeName && input.storeName.length > 100) {
    errors.storeName = 'Store name must be less than 100 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validate email address
 * @param email - Email to validate
 * @returns Whether email is valid
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number (Indian format)
 * @param phone - Phone number to validate
 * @returns Whether phone is valid
 */
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

/**
 * Validate URL
 * @param url - URL to validate
 * @returns Whether URL is valid
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Check if string is empty or whitespace only
 * @param value - String to check
 * @returns Whether string is empty
 */
export const isEmpty = (value: string | null | undefined): boolean => {
  return !value || value.trim() === '';
};

/**
 * Validate tag name
 * @param tagName - Tag name to validate
 * @returns Validation result
 */
export const validateTagName = (tagName: string): ValidationResult => {
  const errors: Record<string, string> = {};

  if (!tagName || tagName.trim() === '') {
    errors.name = 'Tag name is required';
  } else if (tagName.length > 30) {
    errors.name = 'Tag name must be less than 30 characters';
  } else if (!/^[\w\s-]+$/.test(tagName)) {
    errors.name = 'Tag name can only contain letters, numbers, spaces, and hyphens';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validate search query
 * @param query - Search query to validate
 * @returns Whether query is valid
 */
export const isValidSearchQuery = (query: string): boolean => {
  if (!query) return false;
  const trimmed = query.trim();
  return trimmed.length >= 2 && trimmed.length <= 100;
};
