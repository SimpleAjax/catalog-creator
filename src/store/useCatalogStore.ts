// Catalog Store - Zustand
import {create} from 'zustand';
import {immer} from 'zustand/middleware/immer';
import {
  getCatalogs,
  getCatalogById,
  createCatalog,
  updateCatalog,
  deleteCatalog,
  getCatalogProducts,
  addProductsToCatalog,
  removeProductFromCatalog,
} from '@/api';
import {Catalog, CatalogInput, Product, TemplateType} from '@/types';

interface CatalogState {
  // Data
  catalogs: Catalog[];
  currentCatalog: Catalog | null;
  currentCatalogProducts: Product[];
  isLoading: boolean;
  error: string | null;

  // Actions
  loadCatalogs: () => Promise<void>;
  loadCatalog: (id: string) => Promise<void>;
  createCatalog: (input: CatalogInput) => Promise<string>;
  updateCatalog: (id: string, updates: Partial<CatalogInput>) => Promise<void>;
  deleteCatalog: (id: string) => Promise<void>;
  setCurrentCatalog: (catalog: Catalog | null) => void;
  startNewCatalog: () => void;
  addProductToCatalog: (catalogId: string, productId: string) => Promise<void>;
  removeProductFromCatalog: (catalogId: string, productId: string) => Promise<void>;
}

const defaultCatalog: Catalog = {
  id: '',
  name: 'New Catalog',
  template: 'minimal',
  productIds: [],
  primaryColor: '#374151',
  secondaryColor: '#F3F4F6',
  storeName: '',
  status: 'draft',
  dateCreated: new Date().toISOString(),
};

export const useCatalogStore = create<CatalogState>()(
  immer((set, get) => ({
    catalogs: [],
    currentCatalog: null,
    currentCatalogProducts: [],
    isLoading: false,
    error: null,

    loadCatalogs: async () => {
      set(state => {
        state.isLoading = true;
        state.error = null;
      });

      try {
        const catalogs = await getCatalogs();
        set(state => {
          state.catalogs = catalogs;
          state.isLoading = false;
        });
      } catch (error) {
        set(state => {
          state.error = error instanceof Error ? error.message : 'Unknown error';
          state.isLoading = false;
        });
      }
    },

    loadCatalog: async (id: string) => {
      set(state => {
        state.isLoading = true;
        state.error = null;
      });

      try {
        const [catalog, products] = await Promise.all([
          getCatalogById(id),
          getCatalogProducts(id),
        ]);

        set(state => {
          state.currentCatalog = catalog;
          state.currentCatalogProducts = products;
          state.isLoading = false;
        });
      } catch (error) {
        set(state => {
          state.error = error instanceof Error ? error.message : 'Unknown error';
          state.isLoading = false;
        });
      }
    },

    createCatalog: async (input: CatalogInput) => {
      set(state => {
        state.isLoading = true;
        state.error = null;
      });

      try {
        const id = await createCatalog(input);
        await get().loadCatalogs();
        return id;
      } catch (error) {
        set(state => {
          state.error = error instanceof Error ? error.message : 'Unknown error';
          state.isLoading = false;
        });
        throw error;
      }
    },

    updateCatalog: async (id: string, updates: Partial<CatalogInput>) => {
      set(state => {
        state.isLoading = true;
        state.error = null;
      });

      try {
        await updateCatalog(id, updates);
        await get().loadCatalogs();
        if (get().currentCatalog?.id === id) {
          await get().loadCatalog(id);
        }
      } catch (error) {
        set(state => {
          state.error = error instanceof Error ? error.message : 'Unknown error';
          state.isLoading = false;
        });
        throw error;
      }
    },

    deleteCatalog: async (id: string) => {
      set(state => {
        state.isLoading = true;
        state.error = null;
      });

      try {
        await deleteCatalog(id);
        await get().loadCatalogs();
        if (get().currentCatalog?.id === id) {
          set(state => {
            state.currentCatalog = null;
            state.currentCatalogProducts = [];
          });
        }
      } catch (error) {
        set(state => {
          state.error = error instanceof Error ? error.message : 'Unknown error';
          state.isLoading = false;
        });
        throw error;
      }
    },

    setCurrentCatalog: (catalog: Catalog | null) => {
      set(state => {
        state.currentCatalog = catalog;
      });
    },

    startNewCatalog: () => {
      set(state => {
        state.currentCatalog = {...defaultCatalog, id: 'temp-' + Date.now()};
        state.currentCatalogProducts = [];
      });
    },

    addProductToCatalog: async (catalogId: string, productId: string) => {
      try {
        await addProductsToCatalog(catalogId, [productId]);
        await get().loadCatalog(catalogId);
      } catch (error) {
        set(state => {
          state.error = error instanceof Error ? error.message : 'Unknown error';
        });
        throw error;
      }
    },

    removeProductFromCatalog: async (catalogId: string, productId: string) => {
      try {
        await removeProductFromCatalog(catalogId, productId);
        await get().loadCatalog(catalogId);
      } catch (error) {
        set(state => {
          state.error = error instanceof Error ? error.message : 'Unknown error';
        });
        throw error;
      }
    },
  })),
);
