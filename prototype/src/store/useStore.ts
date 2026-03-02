import { create } from 'zustand';
import type { Product, Catalog, TagPreset, ImportBatch } from '../data/dummyData';
import { dummyProducts, dummyCatalogs, dummyTagPresets, dummyImportBatches } from '../data/dummyData';

export type Screen = 
  | 'home' 
  | 'add-product' 
  | 'products' 
  | 'catalogs' 
  | 'search' 
  | 'templates'
  | 'catalog-builder'
  | 'catalog-preview'
  | 'bulk-tag';

interface Store {
  // Navigation
  currentScreen: Screen;
  navigateTo: (screen: Screen) => void;
  
  // Data
  products: Product[];
  catalogs: Catalog[];
  tagPresets: TagPreset[];
  importBatches: ImportBatch[];
  
  // Selected items (for bulk operations)
  selectedProductIds: string[];
  toggleProductSelection: (id: string) => void;
  clearSelection: () => void;
  selectAll: (ids: string[]) => void;
  
  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  recentSearches: string[];
  addRecentSearch: (query: string) => void;
  
  // Filters
  activeFilter: string | null;
  setActiveFilter: (filter: string | null) => void;
  
  // Catalog builder
  currentCatalog: Catalog | null;
  setCurrentCatalog: (catalog: Catalog | null) => void;
  startNewCatalog: () => void;
  updateCatalog: (updates: Partial<Catalog>) => void;
  addProductToCatalog: (productId: string) => void;
  removeProductFromCatalog: (productId: string) => void;
  setCatalogs: (catalogs: Catalog[]) => void;
  
  // Product editing
  updateProduct: (id: string, updates: Partial<Product>) => void;
  bulkUpdateProducts: (ids: string[], updates: Partial<Product>) => void;
  
  // Tag presets
  addTagPreset: (name: string, tags: string[]) => void;
  
  // Import simulation
  importProducts: (count: number, wholesaler: string) => void;
}

export const useStore = create<Store>((set, get) => ({
  // Navigation
  currentScreen: 'home',
  navigateTo: (screen) => set({ currentScreen: screen }),
  
  // Data
  products: dummyProducts,
  catalogs: dummyCatalogs,
  tagPresets: dummyTagPresets,
  importBatches: dummyImportBatches,
  
  // Selection
  selectedProductIds: [],
  toggleProductSelection: (id) => set((state) => ({
    selectedProductIds: state.selectedProductIds.includes(id)
      ? state.selectedProductIds.filter(pid => pid !== id)
      : [...state.selectedProductIds, id]
  })),
  clearSelection: () => set({ selectedProductIds: [] }),
  selectAll: (ids) => set({ selectedProductIds: ids }),
  
  // Search
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
  recentSearches: ['silk saree', 'diwali collection', 'cotton kurti'],
  addRecentSearch: (query) => {
    if (!query.trim()) return;
    set((state) => ({
      recentSearches: [query, ...state.recentSearches.filter(s => s !== query).slice(0, 9)]
    }));
  },
  
  // Filters
  activeFilter: null,
  setActiveFilter: (filter) => set({ activeFilter: filter }),
  
  // Catalog builder
  currentCatalog: null,
  setCurrentCatalog: (catalog) => set({ currentCatalog: catalog }),
  startNewCatalog: () => set({
    currentCatalog: {
      id: `cat-new-${Date.now()}`,
      name: '',
      template: 'minimal',
      productIds: [],
      primaryColor: '#dc2626',
      secondaryColor: '#ffffff',
      storeName: 'My Store',
      status: 'draft',
      dateCreated: new Date().toISOString().split('T')[0]
    }
  }),
  updateCatalog: (updates) => set((state) => ({
    currentCatalog: state.currentCatalog 
      ? { ...state.currentCatalog, ...updates }
      : null
  })),
  addProductToCatalog: (productId) => set((state) => ({
    currentCatalog: state.currentCatalog && !state.currentCatalog.productIds.includes(productId)
      ? { ...state.currentCatalog, productIds: [...state.currentCatalog.productIds, productId] }
      : state.currentCatalog
  })),
  removeProductFromCatalog: (productId) => set((state) => ({
    currentCatalog: state.currentCatalog
      ? { ...state.currentCatalog, productIds: state.currentCatalog.productIds.filter(id => id !== productId) }
      : null
  })),
  setCatalogs: (catalogs) => set({ catalogs }),
  
  // Product editing
  updateProduct: (id, updates) => set((state) => ({
    products: state.products.map(p => p.id === id ? { ...p, ...updates } : p)
  })),
  bulkUpdateProducts: (ids, updates) => set((state) => ({
    products: state.products.map(p => ids.includes(p.id) ? { ...p, ...updates } : p)
  })),
  
  // Tag presets
  addTagPreset: (name, tags) => set((state) => ({
    tagPresets: [...state.tagPresets, { id: `preset-${Date.now()}`, name, tags }]
  })),
  
  // Import simulation
  importProducts: (count, wholesaler) => {
    const { products } = get();
    const newProducts: Product[] = Array.from({ length: count }, (_, i) => ({
      id: `prod-import-${Date.now()}-${i}`,
      name: `New Product ${products.length + i + 1}`,
      price: null,
      mrp: null,
      description: '',
      image: `https://images.unsplash.com/photo-${[
        '1598532163257-ae3c6b2524b6',
        '1610030469983-98e550d6193c',
        '1605763240004-7e93b172d754',
        '1599643478518-a784e5dc4c8f',
        '1601121141461-9d6647bca1ed'
      ][i % 5]}?w=400`,
      tags: [],
      category: 'Uncategorized',
      source: wholesaler,
      stockStatus: 'in-stock',
      dateAdded: new Date().toISOString().split('T')[0],
      archived: false
    }));
    
    const newBatch: ImportBatch = {
      id: `batch-${Date.now()}`,
      name: `${wholesaler} - ${new Date().toLocaleDateString()}`,
      wholesaler,
      date: new Date().toISOString().split('T')[0],
      productIds: newProducts.map(p => p.id)
    };
    
    set((state) => ({
      products: [...newProducts, ...state.products],
      importBatches: [newBatch, ...state.importBatches]
    }));
  }
}));
