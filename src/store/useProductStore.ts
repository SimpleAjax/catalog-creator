// Product Store - Zustand
import {create} from 'zustand';
import {immer} from 'zustand/middleware/immer';
import {shallow} from 'zustand/shallow';

// Re-export shallow for use in components
export {shallow};
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  archiveProduct,
  getCategories,
  getProductCount,
  searchProducts,
  bulkUpdateProducts as apiBulkUpdate,
} from '@/api';
import {Product, ProductInput} from '@/types';

interface ProductState {
  // Data
  products: Product[];
  filteredProducts: Product[];
  categories: string[];
  totalCount: number;
  archivedCount: number;
  isLoading: boolean;
  error: string | null;

  // Actions
  loadProducts: (options?: {archived?: boolean}) => Promise<void>;
  loadProduct: (id: string) => Promise<Product | null>;
  addProduct: (input: ProductInput) => Promise<string>;
  updateProduct: (id: string, updates: Partial<ProductInput>) => Promise<void>;
  archiveProduct: (id: string) => Promise<void>;
  bulkUpdateProducts: (ids: string[], updates: Partial<ProductInput>) => Promise<void>;
  loadCategories: () => Promise<void>;
  search: (query: string) => Promise<void>;
  filterByCategory: (category: string | null) => Promise<void>;
  clearFilters: () => void;
}

export const useProductStore = create<ProductState>()(
  immer((set, get) => ({
    products: [],
    filteredProducts: [],
    categories: [],
    totalCount: 0,
    archivedCount: 0,
    isLoading: false,
    error: null,

    loadProducts: async ({archived = false} = {}) => {
      set(state => {
        state.isLoading = true;
        state.error = null;
      });

      try {
        const [products, total, categories] = await Promise.all([
          getProducts({archived}),
          getProductCount(archived),
          getCategories(),
        ]);

        set(state => {
          state.products = products;
          state.filteredProducts = products;
          state.totalCount = total;
          state.categories = categories;
          state.isLoading = false;
        });
      } catch (error) {
        set(state => {
          state.error = error instanceof Error ? error.message : 'Unknown error';
          state.isLoading = false;
        });
      }
    },

    loadProduct: async (id: string) => {
      try {
        return await getProductById(id);
      } catch (error) {
        set(state => {
          state.error = error instanceof Error ? error.message : 'Unknown error';
        });
        return null;
      }
    },

    addProduct: async (input: ProductInput) => {
      set(state => {
        state.isLoading = true;
        state.error = null;
      });

      try {
        const id = await createProduct(input);
        await get().loadProducts();
        return id;
      } catch (error) {
        set(state => {
          state.error = error instanceof Error ? error.message : 'Unknown error';
          state.isLoading = false;
        });
        throw error;
      }
    },

    updateProduct: async (id: string, updates: Partial<ProductInput>) => {
      set(state => {
        state.isLoading = true;
        state.error = null;
      });

      try {
        await updateProduct(id, updates);
        await get().loadProducts();
      } catch (error) {
        set(state => {
          state.error = error instanceof Error ? error.message : 'Unknown error';
          state.isLoading = false;
        });
        throw error;
      }
    },

    archiveProduct: async (id: string) => {
      set(state => {
        state.isLoading = true;
        state.error = null;
      });

      try {
        await archiveProduct(id);
        await get().loadProducts();
      } catch (error) {
        set(state => {
          state.error = error instanceof Error ? error.message : 'Unknown error';
          state.isLoading = false;
        });
        throw error;
      }
    },

    loadCategories: async () => {
      try {
        const categories = await getCategories();
        set(state => {
          state.categories = categories;
        });
      } catch (error) {
        set(state => {
          state.error = error instanceof Error ? error.message : 'Unknown error';
        });
      }
    },

    search: async (query: string) => {
      if (!query.trim()) {
        set(state => {
          state.filteredProducts = state.products;
        });
        return;
      }

      set(state => {
        state.isLoading = true;
      });

      try {
        const results = await searchProducts(query);
        set(state => {
          state.filteredProducts = results;
          state.isLoading = false;
        });
      } catch (error) {
        set(state => {
          state.error = error instanceof Error ? error.message : 'Unknown error';
          state.isLoading = false;
        });
      }
    },

    filterByCategory: async (category: string | null) => {
      set(state => {
        state.isLoading = true;
      });

      try {
        const products = await getProducts({category: category || undefined});
        set(state => {
          state.filteredProducts = products;
          state.isLoading = false;
        });
      } catch (error) {
        set(state => {
          state.error = error instanceof Error ? error.message : 'Unknown error';
          state.isLoading = false;
        });
      }
    },

    clearFilters: () => {
      set(state => {
        state.filteredProducts = state.products;
      });
    },

    bulkUpdateProducts: async (ids: string[], updates: Partial<ProductInput>) => {
      set(state => {
        state.isLoading = true;
        state.error = null;
      });

      try {
        await apiBulkUpdate(ids, updates);
        await get().loadProducts();
      } catch (error) {
        set(state => {
          state.error = error instanceof Error ? error.message : 'Unknown error';
          state.isLoading = false;
        });
        throw error;
      }
    },
  })),
);
