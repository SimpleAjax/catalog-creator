// Catalog data access layer
import {getDatabase} from './database';
import {Catalog, CatalogInput, Product} from '@/types';
import * as Crypto from 'expo-crypto';

const db = () => getDatabase();

// Create a new catalog
export const createCatalog = async (input: CatalogInput): Promise<string> => {
  const id = Crypto.randomUUID();
  const now = new Date().toISOString();

  db().runSync(
    `INSERT INTO catalogs (id, name, template, primaryColor, secondaryColor, storeName, status, dateCreated)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
    [
      id,
      input.name,
      input.template,
      input.primaryColor,
      input.secondaryColor,
      input.storeName || '',
      input.status || 'draft',
      now,
    ],
  );

  // Add products to catalog
  if (input.productIds && input.productIds.length > 0) {
    await addProductsToCatalog(id, input.productIds);
  }

  return id;
};

// Get catalog by ID
export const getCatalogById = async (id: string): Promise<Catalog | null> => {
  const result = db().getFirstSync<any>(
    'SELECT * FROM catalogs WHERE id = ?;',
    [id],
  );

  if (!result) return null;

  const productIds = getCatalogProductIds(id);

  return {
    id: result.id,
    name: result.name,
    template: result.template,
    primaryColor: result.primaryColor,
    secondaryColor: result.secondaryColor,
    storeName: result.storeName || '',
    status: result.status,
    dateCreated: result.dateCreated,
    productIds,
  };
};

// Get all catalogs
export const getCatalogs = async (options: {
  status?: 'draft' | 'published' | 'archived';
  limit?: number;
  offset?: number;
} = {}): Promise<Catalog[]> => {
  const {status, limit = 100, offset = 0} = options;

  let query = 'SELECT * FROM catalogs';
  const params: any[] = [];

  if (status) {
    query += ' WHERE status = ?';
    params.push(status);
  }

  query += ' ORDER BY dateCreated DESC LIMIT ? OFFSET ?;';
  params.push(limit, offset);

  const results = db().getAllSync<any>(query, params);

  return Promise.all(
    results.map(async row => ({
      id: row.id,
      name: row.name,
      template: row.template,
      primaryColor: row.primaryColor,
      secondaryColor: row.secondaryColor,
      storeName: row.storeName || '',
      status: row.status,
      dateCreated: row.dateCreated,
      productIds: getCatalogProductIds(row.id),
    })),
  );
};

// Update catalog
export const updateCatalog = async (
  id: string,
  updates: Partial<CatalogInput>,
): Promise<void> => {
  const sets: string[] = [];
  const params: any[] = [];

  if (updates.name !== undefined) {
    sets.push('name = ?');
    params.push(updates.name);
  }
  if (updates.template !== undefined) {
    sets.push('template = ?');
    params.push(updates.template);
  }
  if (updates.primaryColor !== undefined) {
    sets.push('primaryColor = ?');
    params.push(updates.primaryColor);
  }
  if (updates.secondaryColor !== undefined) {
    sets.push('secondaryColor = ?');
    params.push(updates.secondaryColor);
  }
  if (updates.storeName !== undefined) {
    sets.push('storeName = ?');
    params.push(updates.storeName);
  }
  if (updates.status !== undefined) {
    sets.push('status = ?');
    params.push(updates.status);
  }

  if (sets.length === 0) return;

  params.push(id);
  db().runSync(
    `UPDATE catalogs SET ${sets.join(', ')} WHERE id = ?;`,
    params,
  );

  // Update products if provided
  if (updates.productIds !== undefined) {
    await setCatalogProducts(id, updates.productIds);
  }
};

// Delete catalog
export const deleteCatalog = async (id: string): Promise<void> => {
  db().runSync('DELETE FROM catalogs WHERE id = ?;', [id]);
};

// Add products to catalog
export const addProductsToCatalog = async (
  catalogId: string,
  productIds: string[],
): Promise<void> => {
  const existingIds = getCatalogProductIds(catalogId);
  let sortOrder = existingIds.length;

  for (const productId of productIds) {
    if (!existingIds.includes(productId)) {
      db().runSync(
        'INSERT OR IGNORE INTO catalog_products (catalogId, productId, sortOrder) VALUES (?, ?, ?);',
        [catalogId, productId, sortOrder++],
      );
    }
  }
};

// Remove product from catalog
export const removeProductFromCatalog = async (
  catalogId: string,
  productId: string,
): Promise<void> => {
  db().runSync(
    'DELETE FROM catalog_products WHERE catalogId = ? AND productId = ?;',
    [catalogId, productId],
  );
};

// Reorder products in catalog
export const reorderCatalogProducts = async (
  catalogId: string,
  productIds: string[],
): Promise<void> => {
  productIds.forEach((productId, index) => {
    db().runSync(
      'UPDATE catalog_products SET sortOrder = ? WHERE catalogId = ? AND productId = ?;',
      [index, catalogId, productId],
    );
  });
};

// Get products in catalog
export const getCatalogProducts = async (catalogId: string): Promise<Product[]> => {
  const results = db().getAllSync<any>(
    `SELECT p.*, GROUP_CONCAT(t.name) as tagNames
     FROM products p
     INNER JOIN catalog_products cp ON p.id = cp.productId
     LEFT JOIN product_tags pt ON p.id = pt.productId
     LEFT JOIN tags t ON pt.tagId = t.id
     WHERE cp.catalogId = ?
     GROUP BY p.id
     ORDER BY cp.sortOrder;`,
    [catalogId],
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

// Get catalog count
export const getCatalogCount = async (): Promise<number> => {
  const result = db().getFirstSync<{count: number}>(
    'SELECT COUNT(*) as count FROM catalogs;',
  );
  return result?.count || 0;
};

// Helper: Get product IDs in catalog
const getCatalogProductIds = (catalogId: string): string[] => {
  const results = db().getAllSync<{productId: string}>(
    'SELECT productId FROM catalog_products WHERE catalogId = ? ORDER BY sortOrder;',
    [catalogId],
  );
  return results.map(r => r.productId);
};

// Helper: Set catalog products (replace existing)
const setCatalogProducts = async (
  catalogId: string,
  productIds: string[],
): Promise<void> => {
  db().runSync('DELETE FROM catalog_products WHERE catalogId = ?;', [catalogId]);
  await addProductsToCatalog(catalogId, productIds);
};
