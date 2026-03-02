// Database connection and initialization
import {openDatabaseSync, SQLiteDatabase} from 'expo-sqlite';

const DB_NAME = 'catalog-creator.db';
const DB_VERSION = 1;

let db: SQLiteDatabase | null = null;

// Get database instance (singleton)
export const getDatabase = (): SQLiteDatabase => {
  if (!db) {
    db = openDatabaseSync(DB_NAME);
    initDatabase();
  }
  return db;
};

// Initialize database with schema
const initDatabase = () => {
  if (!db) return;

  // Enable foreign keys
  db.execSync('PRAGMA foreign_keys = ON;');

  // Create version table
  db.execSync(`
    CREATE TABLE IF NOT EXISTS db_version (
      version INTEGER PRIMARY KEY
    );
  `);

  // Check current version
  const versionResult = db.getFirstSync<{version: number}>(
    'SELECT version FROM db_version LIMIT 1;',
  );
  const currentVersion = versionResult?.version || 0;

  if (currentVersion < DB_VERSION) {
    createSchema();
    db.runSync('INSERT OR REPLACE INTO db_version (version) VALUES (?);', [
      DB_VERSION,
    ]);
  }
};

// Create all tables
const createSchema = () => {
  if (!db) return;

  // Products table
  db.execSync(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      price INTEGER,
      mrp INTEGER,
      description TEXT,
      imageUri TEXT NOT NULL,
      category TEXT,
      source TEXT DEFAULT 'Gallery',
      stockStatus TEXT DEFAULT 'in-stock',
      dateAdded TEXT NOT NULL,
      archived INTEGER DEFAULT 0
    );
  `);

  // FTS5 virtual table for search
  db.execSync(`
    CREATE VIRTUAL TABLE IF NOT EXISTS products_fts USING fts5(
      name,
      category,
      source,
      content='products',
      content_rowid='id'
    );
  `);

  // Tags table
  db.execSync(`
    CREATE TABLE IF NOT EXISTS tags (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL UNIQUE
    );
  `);

  // Product tags (many-to-many)
  db.execSync(`
    CREATE TABLE IF NOT EXISTS product_tags (
      productId TEXT,
      tagId TEXT,
      PRIMARY KEY (productId, tagId),
      FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE,
      FOREIGN KEY (tagId) REFERENCES tags(id) ON DELETE CASCADE
    );
  `);

  // Catalogs table
  db.execSync(`
    CREATE TABLE IF NOT EXISTS catalogs (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      template TEXT NOT NULL,
      primaryColor TEXT NOT NULL,
      secondaryColor TEXT NOT NULL,
      storeName TEXT,
      status TEXT DEFAULT 'draft',
      dateCreated TEXT NOT NULL
    );
  `);

  // Catalog products (many-to-many)
  db.execSync(`
    CREATE TABLE IF NOT EXISTS catalog_products (
      catalogId TEXT,
      productId TEXT,
      sortOrder INTEGER DEFAULT 0,
      PRIMARY KEY (catalogId, productId),
      FOREIGN KEY (catalogId) REFERENCES catalogs(id) ON DELETE CASCADE,
      FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE
    );
  `);

  // Tag presets
  db.execSync(`
    CREATE TABLE IF NOT EXISTS tag_presets (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      tags TEXT NOT NULL
    );
  `);

  // Saved filters
  db.execSync(`
    CREATE TABLE IF NOT EXISTS saved_filters (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      query TEXT NOT NULL
    );
  `);

  // Create indexes for better performance
  db.execSync('CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);');
  db.execSync('CREATE INDEX IF NOT EXISTS idx_products_date ON products(dateAdded);');
  db.execSync('CREATE INDEX IF NOT EXISTS idx_products_archived ON products(archived);');
  db.execSync('CREATE INDEX IF NOT EXISTS idx_product_tags_product ON product_tags(productId);');
  db.execSync('CREATE INDEX IF NOT EXISTS idx_product_tags_tag ON product_tags(tagId);');
  db.execSync('CREATE INDEX IF NOT EXISTS idx_catalog_products_catalog ON catalog_products(catalogId);');
  db.execSync('CREATE INDEX IF NOT EXISTS idx_catalog_products_product ON catalog_products(productId);');

  console.log('Database schema created successfully');
};

// Reset database (for testing)
export const resetDatabase = () => {
  if (!db) return;
  
  db.execSync('DROP TABLE IF EXISTS catalog_products;');
  db.execSync('DROP TABLE IF EXISTS catalogs;');
  db.execSync('DROP TABLE IF EXISTS product_tags;');
  db.execSync('DROP TABLE IF EXISTS tags;');
  db.execSync('DROP TABLE IF EXISTS products_fts;');
  db.execSync('DROP TABLE IF EXISTS products;');
  db.execSync('DROP TABLE IF EXISTS tag_presets;');
  db.execSync('DROP TABLE IF EXISTS saved_filters;');
  db.execSync('DROP TABLE IF EXISTS db_version;');
  
  createSchema();
};

// Close database connection
export const closeDatabase = () => {
  db = null;
};
