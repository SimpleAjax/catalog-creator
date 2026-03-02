// Catalog Creator - Type Definitions

// Stock status for products
export type StockStatus = 'in-stock' | 'limited' | 'out-of-stock';

// Template types for catalogs
export type TemplateType = 'minimal' | 'bold' | 'elegant' | 'festive' | 'modern';

// Catalog status
export type CatalogStatus = 'draft' | 'published' | 'archived';

// Main Product type
export interface Product {
  id: string;
  name: string;
  price: number | null;
  mrp: number | null;
  description: string;
  imageUri: string;
  tags: string[];
  category: string;
  source: string;
  stockStatus: StockStatus;
  dateAdded: string;
  archived: boolean;
}

// Product input for creating new products
export type ProductInput = Omit<Product, 'id' | 'dateAdded'>;

// Catalog type
export interface Catalog {
  id: string;
  name: string;
  template: TemplateType;
  productIds: string[];
  primaryColor: string;
  secondaryColor: string;
  storeName: string;
  status: CatalogStatus;
  dateCreated: string;
}

// Catalog input for creating new catalogs
export type CatalogInput = Omit<Catalog, 'id' | 'dateCreated'>;

// Tag type
export interface Tag {
  id: string;
  name: string;
}

// Tag Preset for reusable tag combinations
export interface TagPreset {
  id: string;
  name: string;
  tags: string[];
}

// Saved filter for quick access
export interface SavedFilter {
  id: string;
  name: string;
  query: string;
}

// Template customization options
export interface TemplateCustomization {
  primaryColor: string;
  secondaryColor: string;
  fontFamily?: string;
  layout: 'grid-2x2' | 'grid-3x3' | 'list' | 'lookbook';
  showPrices: boolean;
  showDescriptions: boolean;
  headerText?: string;
  footerText?: string;
}

// Navigation types
export type Screen =
  | 'Home'
  | 'Products'
  | 'Catalogs'
  | 'Templates'
  | 'AddProduct'
  | 'ProductDetail'
  | 'CatalogBuilder'
  | 'CatalogPreview'
  | 'BulkTag'
  | 'Search'
  | 'Settings';

// Filter options
export interface FilterOptions {
  category: string | null;
  tags: string[];
  priceMin: number | null;
  priceMax: number | null;
  stockStatus: StockStatus | null;
  dateFrom: string | null;
  dateTo: string | null;
  archived: boolean;
}

// Sort options
export type SortOption =
  | 'newest'
  | 'oldest'
  | 'price-low'
  | 'price-high'
  | 'name-asc'
  | 'name-desc';

// Import batch for grouping imports
export interface ImportBatch {
  id: string;
  date: string;
  source: string;
  productCount: number;
}

// Store profile
export interface StoreProfile {
  name: string;
  logoUri?: string;
  contactInfo?: string;
  socialLinks?: {
    whatsapp?: string;
    instagram?: string;
    facebook?: string;
  };
}

// Search result
export interface SearchResult {
  products: Product[];
  catalogs: Catalog[];
  tags: string[];
}

// Recent search item
export interface RecentSearch {
  id: string;
  query: string;
  timestamp: string;
}
