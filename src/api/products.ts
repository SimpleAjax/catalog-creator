// Product data access layer
import {getDatabase} from './database';
import {Product, ProductInput} from '@/types';
import * as Crypto from 'expo-crypto';

const db = () => getDatabase();

// Create a new product
export const createProduct = async (input: ProductInput): Promise<string> => {
  const id = Crypto.randomUUID();
  const now = new Date().toISOString();

  db().runSync(
    `INSERT INTO products (id, name, price, mrp, description, imageUri, category, source, stockStatus, dateAdded, archived)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
    [
      id,
      input.name,
      input.price ?? null,
      input.mrp ?? null,
      input.description,
      input.imageUri,
      input.category || '',
      input.source || 'Gallery',
      input.stockStatus || 'in-stock',
      now,
      input.archived ? 1 : 0,
    ],
  );

  // Add to FTS index
  db().runSync(
    `INSERT INTO products_fts (name, category, source) VALUES (?, ?, ?);`,
    [input.name, input.category || '', input.source || 'Gallery'],
  );

  // Handle tags
  if (input.tags && input.tags.length > 0) {
    await addTagsToProduct(id, input.tags);
  }

  return id;
};

// Get product by ID
export const getProductById = async (id: string): Promise<Product | null> => {
  const result = db().getFirstSync<any>(
    `SELECT p.*, GROUP_CONCAT(t.name) as tagNames
     FROM products p
     LEFT JOIN product_tags pt ON p.id = pt.productId
     LEFT JOIN tags t ON pt.tagId = t.id
     WHERE p.id = ?
     GROUP BY p.id;`,
    [id],
  );

  if (!result) return null;

  return mapProductFromDb(result);
};

// Get all products (with optional filters)
export const getProducts = async (options: {
  archived?: boolean;
  limit?: number;
  offset?: number;
  category?: string;
  tags?: string[];
} = {}): Promise<Product[]> => {
  const {archived = false, limit = 100, offset = 0, category, tags} = options;

  let query = `
    SELECT p.*, GROUP_CONCAT(t.name) as tagNames
    FROM products p
    LEFT JOIN product_tags pt ON p.id = pt.productId
    LEFT JOIN tags t ON pt.tagId = t.id
    WHERE p.archived = ?
  `;
  const params: any[] = [archived ? 1 : 0];

  if (category) {
    query += ` AND p.category = ?`;
    params.push(category);
  }

  if (tags && tags.length > 0) {
    query += ` AND p.id IN (
      SELECT pt.productId 
      FROM product_tags pt 
      JOIN tags t ON pt.tagId = t.id 
      WHERE t.name IN (${tags.map(() => '?').join(',')})
      GROUP BY pt.productId
      HAVING COUNT(DISTINCT t.name) = ?
    )`;
    params.push(...tags, tags.length);
  }

  query += ` GROUP BY p.id ORDER BY p.dateAdded DESC LIMIT ? OFFSET ?;`;
  params.push(limit, offset);

  const results = db().getAllSync<any>(query, params);
  return results.map(mapProductFromDb);
};

// Update product
export const updateProduct = async (
  id: string,
  updates: Partial<ProductInput>,
): Promise<void> => {
  const sets: string[] = [];
  const params: any[] = [];

  if (updates.name !== undefined) {
    sets.push('name = ?');
    params.push(updates.name);
  }
  if (updates.price !== undefined) {
    sets.push('price = ?');
    params.push(updates.price);
  }
  if (updates.mrp !== undefined) {
    sets.push('mrp = ?');
    params.push(updates.mrp);
  }
  if (updates.description !== undefined) {
    sets.push('description = ?');
    params.push(updates.description);
  }
  if (updates.imageUri !== undefined) {
    sets.push('imageUri = ?');
    params.push(updates.imageUri);
  }
  if (updates.category !== undefined) {
    sets.push('category = ?');
    params.push(updates.category);
  }
  if (updates.source !== undefined) {
    sets.push('source = ?');
    params.push(updates.source);
  }
  if (updates.stockStatus !== undefined) {
    sets.push('stockStatus = ?');
    params.push(updates.stockStatus);
  }
  if (updates.archived !== undefined) {
    sets.push('archived = ?');
    params.push(updates.archived ? 1 : 0);
  }

  if (sets.length === 0) return;

  params.push(id);
  db().runSync(
    `UPDATE products SET ${sets.join(', ')} WHERE id = ?;`,
    params,
  );

  // Update FTS index
  if (updates.name !== undefined || updates.category !== undefined) {
    const product = await getProductById(id);
    if (product) {
      db().runSync(
        `UPDATE products_fts SET name = ?, category = ? WHERE rowid = ?;`,
        [product.name, product.category, id],
      );
    }
  }

  // Update tags
  if (updates.tags !== undefined) {
    await setProductTags(id, updates.tags);
  }
};

// Archive product (soft delete)
export const archiveProduct = async (id: string): Promise<void> => {
  await updateProduct(id, {archived: true});
};

// Restore archived product
export const restoreProduct = async (id: string): Promise<void> => {
  await updateProduct(id, {archived: false});
};

// Delete product permanently
export const deleteProduct = async (id: string): Promise<void> => {
  db().runSync('DELETE FROM products WHERE id = ?;', [id]);
  db().runSync('DELETE FROM products_fts WHERE rowid = ?;', [id]);
};

// Get product count
export const getProductCount = async (archived = false): Promise<number> => {
  const result = db().getFirstSync<{count: number}>(
    'SELECT COUNT(*) as count FROM products WHERE archived = ?;',
    [archived ? 1 : 0],
  );
  return result?.count || 0;
};

// Get all unique categories
export const getCategories = async (): Promise<string[]> => {
  const results = db().getAllSync<{category: string}>(
    'SELECT DISTINCT category FROM products WHERE category IS NOT NULL AND category != "" ORDER BY category;',
  );
  return results.map(r => r.category).filter(Boolean);
};

// Helper: Add tags to product
const addTagsToProduct = async (productId: string, tagNames: string[]): Promise<void> => {
  for (const tagName of tagNames) {
    // Get or create tag
    let tag = db().getFirstSync<{id: string}>(
      'SELECT id FROM tags WHERE name = ?;',
      [tagName],
    );

    let tagId: string;
    if (!tag) {
      tagId = Crypto.randomUUID();
      db().runSync('INSERT INTO tags (id, name) VALUES (?, ?);', [tagId, tagName]);
    } else {
      tagId = tag.id;
    }

    // Link tag to product
    db().runSync(
      'INSERT OR IGNORE INTO product_tags (productId, tagId) VALUES (?, ?);',
      [productId, tagId],
    );
  }
};

// Helper: Set product tags (replace existing)
const setProductTags = async (productId: string, tagNames: string[]): Promise<void> => {
  // Remove existing tags
  db().runSync('DELETE FROM product_tags WHERE productId = ?;', [productId]);
  // Add new tags
  await addTagsToProduct(productId, tagNames);
};

// Helper: Map database result to Product type
const mapProductFromDb = (row: any): Product => ({
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
});

// Bulk operations
export const bulkUpdateProducts = async (
  ids: string[],
  updates: Partial<ProductInput>,
): Promise<void> => {
  for (const id of ids) {
    await updateProduct(id, updates);
  }
};

export const bulkArchiveProducts = async (ids: string[]): Promise<void> => {
  await bulkUpdateProducts(ids, {archived: true});
};
