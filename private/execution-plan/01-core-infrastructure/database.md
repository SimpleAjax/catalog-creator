# Core Infrastructure: Database

## Overview
Set up SQLite database with FTS5 for full-text search. Create schema for products, catalogs, tags, and templates.

## References
- PRD Section 4 (Core Features)
- PRD Section 7 (Tech Stack)

---

## Phase 1: E2E Tests

**Test File:** `e2e/database.test.ts`

### Test 1: Database Initialization
```
Scenario: App starts with database ready
Given the app launches
Then database should be initialized
And all required tables should exist
And no errors appear in console
```

### Test 2: CRUD Operations Flow
```
Scenario: Complete data lifecycle
Given the app is running
When I add a product with name "Test Saree"
Then I can retrieve it by ID
And I can update its price to 500
And I can search for it by name
And I can delete it
And it no longer appears in search
```

### Test 3: Search Index
```
Scenario: Full-text search works
Given 10 products exist in database
When I search for "silk"
Then only products with "silk" in name/tags should return
And results should appear in < 100ms
```

**Acceptance Criteria:**
- [ ] All 3 E2E tests pass
- [ ] Tests run in < 30 seconds total

---

## Phase 2: Unit Tests

**Test File:** `src/api/database.test.ts`

### Test Cases:

1. **Schema Creation**
   - `should create products table with correct columns`
   - `should create catalogs table with correct columns`
   - `should create tags table with correct columns`
   - `should create FTS5 virtual table for search`

2. **Product Operations**
   - `should insert a product and return ID`
   - `should retrieve product by ID`
   - `should update product fields`
   - `should soft delete product (archive)`
   - `should return all products with pagination`

3. **Catalog Operations**
   - `should create catalog with products`
   - `should retrieve catalog with joined products`
   - `should update catalog metadata`
   - `should delete catalog (cascade or restrict)`

4. **Tag Operations**
   - `should add tags to product`
   - `should retrieve all unique tags`
   - `should search products by tag`

5. **Search Operations**
   - `should search products by name using FTS5`
   - `should search products by tags`
   - `should return empty array for no matches`

**Acceptance Criteria:**
- [ ] All unit tests pass
- [ ] >90% code coverage for database operations
- [ ] Mock database works for unit tests (in-memory SQLite)

---

## Phase 3: Implementation

### Step 1: Database Connection

**File:** `src/api/database.ts`

**Requirements:**
- Initialize SQLite connection via expo-sqlite
- Handle database versioning/migrations
- Export connection for use in other modules

**Key Decisions (for executor):**
- Use singleton pattern or context provider?
- Handle schema migrations (version table)
- Error handling strategy

---

### Step 2: Schema Definition

**File:** `src/api/schema.ts`

**Tables Required:**

```sql
-- Products table
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

-- FTS5 virtual table for search
CREATE VIRTUAL TABLE IF NOT EXISTS products_fts USING fts5(
  name,
  category,
  source,
  content='products',
  content_rowid='id'
);

-- Tags table (many-to-many)
CREATE TABLE IF NOT EXISTS tags (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS product_tags (
  productId TEXT,
  tagId TEXT,
  PRIMARY KEY (productId, tagId),
  FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (tagId) REFERENCES tags(id) ON DELETE CASCADE
);

-- Catalogs table
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

-- Catalog products (many-to-many)
CREATE TABLE IF NOT EXISTS catalog_products (
  catalogId TEXT,
  productId TEXT,
  sortOrder INTEGER DEFAULT 0,
  PRIMARY KEY (catalogId, productId),
  FOREIGN KEY (catalogId) REFERENCES catalogs(id) ON DELETE CASCADE,
  FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE
);

-- Tag presets
CREATE TABLE IF NOT EXISTS tag_presets (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  tags TEXT NOT NULL -- JSON array of tag names
);

-- Saved filters
CREATE TABLE IF NOT EXISTS saved_filters (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  query TEXT NOT NULL
);
```

---

### Step 3: Data Access Layer

**Files:**
- `src/api/products.ts` — Product CRUD operations
- `src/api/catalogs.ts` — Catalog CRUD operations
- `src/api/tags.ts` — Tag operations
- `src/api/search.ts` — Search operations

**Each file should export:**
- Create/Insert function
- Read/Select function(s)
- Update function
- Delete/Archive function
- List/Query functions

**Example pattern:**
```typescript
// src/api/products.ts
export const createProduct = async (product: Product): Promise<string> => {
  // Implementation
};

export const getProductById = async (id: string): Promise<Product | null> => {
  // Implementation
};

export const searchProducts = async (query: string): Promise<Product[]> => {
  // Use FTS5
};

// etc.
```

---

### Step 4: Seed Data

**File:** `src/api/seed.ts`

**Requirements:**
- Insert 50 dummy products on first launch
- Insert 3 sample catalogs
- Insert 3 tag presets
- Only run if tables are empty

**Acceptance Criteria:**
- [ ] Seed data appears in app on first run
- [ ] No duplicates on subsequent launches
- [ ] Images load (use placeholder URLs if needed)

---

## Verification

### Manual Testing Checklist

- [ ] Can add product via SQL insert
- [ ] Can retrieve product by ID
- [ ] Can search and find product by name
- [ ] Can search and find product by tag
- [ ] Can update product price
- [ ] Can archive product (soft delete)
- [ ] Can create catalog with products
- [ ] Can retrieve catalog with all products
- [ ] Database persists between app restarts

### Performance Checklist

- [ ] Search returns results in < 100ms (1000 products)
- [ ] Product list loads in < 500ms (100 products)
- [ ] No UI blocking during DB operations

---

## Progress Tracking

| Date | Phase | Status | Blockers | Notes |
|------|-------|--------|----------|-------|
| | E2E Tests | ⬜ Not Started | | |
| | Unit Tests | ⬜ Not Started | | |
| | Implementation | ⬜ Not Started | | |

---

## Insights & Decisions

*Document architectural decisions:*

- Schema version chosen: ___
- Migration strategy: ___
- FTS5 triggers or manual sync: ___

---

## Problems & Resolutions

| Problem | Cause | Solution | Time Lost |
|---------|-------|----------|-----------|
| | | | |

---

*After completion, move to: state-management.md*
