// Search data access layer using SQLite FTS5
import {getDatabase} from './database';
import * as Crypto from 'expo-crypto';
import {Product} from '@/types';

const db = () => getDatabase();

// Search products using FTS5
export const searchProducts = async (query: string): Promise<Product[]> => {
  if (!query.trim()) {
    return [];
  }

  // Convert query to FTS5 format (add wildcards)
  const ftsQuery = query
    .trim()
    .split(/\s+/)
    .map(term => `${term}*`)
    .join(' ');

  const results = db().getAllSync<any>(
    `SELECT p.*, GROUP_CONCAT(t.name) as tagNames
     FROM products p
     INNER JOIN products_fts fts ON p.id = fts.rowid
     LEFT JOIN product_tags pt ON p.id = pt.productId
     LEFT JOIN tags t ON pt.tagId = t.id
     WHERE products_fts MATCH ?
     AND p.archived = 0
     GROUP BY p.id
     ORDER BY rank;`,
    [ftsQuery],
  );

  return results.map(row => ({
    id: row.id,
    name: row.name,
    price: row.price,
    mrp: row.mrp,
    description: row.description || '',
    imageUri: row.imageUri,
    tags: row.tagNames ? row.tagNames.split(',') : [],
    category: row.category || '',
    source: row.source || 'Gallery',
    stockStatus: row.stockStatus || 'in-stock',
    dateAdded: row.dateAdded,
    archived: row.archived === 1,
  }));
};

// Advanced search with filters
export const advancedSearch = async (
  query: string,
  filters: {
    category?: string;
    tags?: string[];
    priceMin?: number;
    priceMax?: number;
    stockStatus?: string;
    dateFrom?: string;
    dateTo?: string;
  } = {},
): Promise<Product[]> => {
  const conditions: string[] = ['p.archived = 0'];
  const params: any[] = [];

  // Text search using FTS
  if (query.trim()) {
    const ftsQuery = query
      .trim()
      .split(/\s+/)
      .map(term => `${term}*`)
      .join(' ');
    conditions.push('p.id IN (SELECT rowid FROM products_fts WHERE products_fts MATCH ?)');
    params.push(ftsQuery);
  }

  // Category filter
  if (filters.category) {
    conditions.push('p.category = ?');
    params.push(filters.category);
  }

  // Price range
  if (filters.priceMin !== undefined) {
    conditions.push('p.price >= ?');
    params.push(filters.priceMin);
  }
  if (filters.priceMax !== undefined) {
    conditions.push('p.price <= ?');
    params.push(filters.priceMax);
  }

  // Stock status
  if (filters.stockStatus) {
    conditions.push('p.stockStatus = ?');
    params.push(filters.stockStatus);
  }

  // Date range
  if (filters.dateFrom) {
    conditions.push('p.dateAdded >= ?');
    params.push(filters.dateFrom);
  }
  if (filters.dateTo) {
    conditions.push('p.dateAdded <= ?');
    params.push(filters.dateTo);
  }

  let sql = `SELECT p.*, GROUP_CONCAT(t.name) as tagNames
             FROM products p
             LEFT JOIN product_tags pt ON p.id = pt.productId
             LEFT JOIN tags t ON pt.tagId = t.id
             WHERE ${conditions.join(' AND ')}
             GROUP BY p.id`;

  // Tags filter (HAVING clause for aggregated tags)
  if (filters.tags && filters.tags.length > 0) {
    const tagPlaceholders = filters.tags.map(() => '?').join(',');
    sql += ` HAVING COUNT(CASE WHEN t.name IN (${tagPlaceholders}) THEN 1 END) >= ?`;
    params.push(...filters.tags, filters.tags.length);
  }

  sql += ' ORDER BY p.dateAdded DESC;';

  const results = db().getAllSync<any>(sql, params);

  return results.map(row => ({
    id: row.id,
    name: row.name,
    price: row.price,
    mrp: row.mrp,
    description: row.description || '',
    imageUri: row.imageUri,
    tags: row.tagNames ? row.tagNames.split(',') : [],
    category: row.category || '',
    source: row.source || 'Gallery',
    stockStatus: row.stockStatus || 'in-stock',
    dateAdded: row.dateAdded,
    archived: row.archived === 1,
  }));
};

// Quick search suggestions
export const getSearchSuggestions = async (query: string): Promise<string[]> => {
  if (!query.trim() || query.length < 2) {
    return [];
  }

  const suggestions: string[] = [];

  // Product names
  const nameResults = db().getAllSync<{name: string}>(
    'SELECT DISTINCT name FROM products WHERE name LIKE ? AND archived = 0 LIMIT 5;',
    [`%${query}%`],
  );
  suggestions.push(...nameResults.map(r => r.name));

  // Tags
  const tagResults = db().getAllSync<{name: string}>(
    'SELECT DISTINCT name FROM tags WHERE name LIKE ? LIMIT 5;',
    [`%${query}%`],
  );
  suggestions.push(...tagResults.map(r => r.name));

  // Categories
  const catResults = db().getAllSync<{category: string}>(
    'SELECT DISTINCT category FROM products WHERE category LIKE ? AND archived = 0 LIMIT 5;',
    [`%${query}%`],
  );
  suggestions.push(...catResults.map(r => r.category));

  return [...new Set(suggestions)].slice(0, 8);
};

// Saved filters
export const createSavedFilter = async (
  name: string,
  query: string,
): Promise<string> => {
  const id = Crypto.randomUUID();

  db().runSync(
    'INSERT INTO saved_filters (id, name, query) VALUES (?, ?, ?);',
    [id, name, query],
  );

  return id;
};

export const getSavedFilters = async (): Promise<
  {id: string; name: string; query: string}[]
> => {
  const results = db().getAllSync<{id: string; name: string; query: string}>(
    'SELECT * FROM saved_filters ORDER BY name;',
  );
  return results;
};

export const deleteSavedFilter = async (id: string): Promise<void> => {
  db().runSync('DELETE FROM saved_filters WHERE id = ?;', [id]);
};
