// Tags and tag presets data access layer
import {getDatabase} from './database';
import {TagPreset} from '@/types';
import * as Crypto from 'expo-crypto';

const db = () => getDatabase();

// Get all unique tags across all products
export const getAllTags = async (): Promise<string[]> => {
  const results = db().getAllSync<{name: string}>(
    'SELECT name FROM tags ORDER BY name;',
  );
  return results.map(r => r.name);
};

// Get tags for a product
export const getProductTags = async (productId: string): Promise<string[]> => {
  const results = db().getAllSync<{name: string}>(
    `SELECT t.name 
     FROM tags t
     INNER JOIN product_tags pt ON t.id = pt.tagId
     WHERE pt.productId = ?
     ORDER BY t.name;`,
    [productId],
  );
  return results.map(r => r.name);
};

// Search tags
export const searchTags = async (query: string): Promise<string[]> => {
  const results = db().getAllSync<{name: string}>(
    'SELECT name FROM tags WHERE name LIKE ? ORDER BY name;',
    [`%${query}%`],
  );
  return results.map(r => r.name);
};

// Create tag preset
export const createTagPreset = async (
  name: string,
  tags: string[],
): Promise<string> => {
  const id = Crypto.randomUUID();

  db().runSync(
    'INSERT INTO tag_presets (id, name, tags) VALUES (?, ?, ?);',
    [id, name, JSON.stringify(tags)],
  );

  return id;
};

// Get all tag presets
export const getTagPresets = async (): Promise<TagPreset[]> => {
  const results = db().getAllSync<{id: string; name: string; tags: string}>(
    'SELECT * FROM tag_presets ORDER BY name;',
  );

  return results.map(row => ({
    id: row.id,
    name: row.name,
    tags: JSON.parse(row.tags),
  }));
};

// Get tag preset by ID
export const getTagPresetById = async (id: string): Promise<TagPreset | null> => {
  const result = db().getFirstSync<{id: string; name: string; tags: string}>(
    'SELECT * FROM tag_presets WHERE id = ?;',
    [id],
  );

  if (!result) return null;

  return {
    id: result.id,
    name: result.name,
    tags: JSON.parse(result.tags),
  };
};

// Update tag preset
export const updateTagPreset = async (
  id: string,
  updates: {name?: string; tags?: string[]},
): Promise<void> => {
  const sets: string[] = [];
  const params: any[] = [];

  if (updates.name !== undefined) {
    sets.push('name = ?');
    params.push(updates.name);
  }
  if (updates.tags !== undefined) {
    sets.push('tags = ?');
    params.push(JSON.stringify(updates.tags));
  }

  if (sets.length === 0) return;

  params.push(id);
  db().runSync(
    `UPDATE tag_presets SET ${sets.join(', ')} WHERE id = ?;`,
    params,
  );
};

// Delete tag preset
export const deleteTagPreset = async (id: string): Promise<void> => {
  db().runSync('DELETE FROM tag_presets WHERE id = ?;', [id]);
};

// Apply tag preset to products
export const applyTagPreset = async (
  presetId: string,
  productIds: string[],
): Promise<void> => {
  const preset = await getTagPresetById(presetId);
  if (!preset) return;

  for (const productId of productIds) {
    // Get existing tags
    const existingTags = await getProductTags(productId);
    
    // Merge with preset tags (avoiding duplicates)
    const newTags = [...new Set([...existingTags, ...preset.tags])];
    
    // Update product with merged tags - inline implementation
    for (const tagName of newTags) {
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

      db().runSync(
        'INSERT OR IGNORE INTO product_tags (productId, tagId) VALUES (?, ?);',
        [productId, tagId],
      );
    }
  }
};

// Helper: Add tags to product (inline to avoid circular dependency)
const addTagsToProductHelper = async (productId: string, tagNames: string[]): Promise<void> => {
  for (const tagName of tagNames) {
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

    db().runSync(
      'INSERT OR IGNORE INTO product_tags (productId, tagId) VALUES (?, ?);',
      [productId, tagId],
    );
  }
};
