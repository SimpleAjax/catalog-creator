// Catalog Store Integration Tests
import {useCatalogStore} from '@/store/useCatalogStore';

// Mock the API layer
jest.mock('@/api', () => ({
  getCatalogs: jest.fn(),
  getCatalogById: jest.fn(),
  createCatalog: jest.fn(),
  updateCatalog: jest.fn(),
  deleteCatalog: jest.fn(),
  getCatalogProducts: jest.fn(),
  addProductsToCatalog: jest.fn(),
  removeProductFromCatalog: jest.fn(),
}));

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

describe('Catalog Store', () => {
  beforeEach(() => {
    // Reset store state
    useCatalogStore.setState({
      catalogs: [],
      currentCatalog: null,
      currentCatalogProducts: [],
      isLoading: false,
      error: null,
    });
    jest.clearAllMocks();
  });

  describe('loadCatalogs', () => {
    it('should load catalogs successfully', async () => {
      const mockCatalogs = [
        {id: '1', name: 'Summer Collection', template: 'minimal', productIds: ['p1', 'p2']},
        {id: '2', name: 'Winter Sale', template: 'bold', productIds: ['p3']},
      ];
      (getCatalogs as jest.Mock).mockResolvedValue(mockCatalogs);

      const store = useCatalogStore.getState();
      await store.loadCatalogs();

      const state = useCatalogStore.getState();
      expect(state.catalogs).toEqual(mockCatalogs);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });

    it('should handle load catalogs error', async () => {
      (getCatalogs as jest.Mock).mockRejectedValue(new Error('Database error'));

      const store = useCatalogStore.getState();
      await store.loadCatalogs();

      const state = useCatalogStore.getState();
      expect(state.error).toBe('Database error');
      expect(state.isLoading).toBe(false);
    });
  });

  describe('loadCatalog', () => {
    it('should load a single catalog with products', async () => {
      const mockCatalog = {id: '1', name: 'Test Catalog', template: 'minimal', productIds: ['p1']};
      const mockProducts = [{id: 'p1', name: 'Product 1', price: 999}];
      
      (getCatalogById as jest.Mock).mockResolvedValue(mockCatalog);
      (getCatalogProducts as jest.Mock).mockResolvedValue(mockProducts);

      const store = useCatalogStore.getState();
      await store.loadCatalog('1');

      const state = useCatalogStore.getState();
      expect(state.currentCatalog).toEqual(mockCatalog);
      expect(state.currentCatalogProducts).toEqual(mockProducts);
      expect(state.isLoading).toBe(false);
    });
  });

  describe('createCatalog', () => {
    it('should create a catalog successfully', async () => {
      const mockCatalogId = 'new-catalog-id';
      (createCatalog as jest.Mock).mockResolvedValue(mockCatalogId);
      (getCatalogs as jest.Mock).mockResolvedValue([]);

      const store = useCatalogStore.getState();
      const input = {
        name: 'New Catalog',
        template: 'minimal' as const,
        primaryColor: '#374151',
        secondaryColor: '#F3F4F6',
        productIds: ['p1', 'p2'],
      };

      const result = await store.createCatalog(input);

      expect(result).toBe(mockCatalogId);
      expect(createCatalog).toHaveBeenCalledWith(input);
    });

    it('should handle create catalog error', async () => {
      (createCatalog as jest.Mock).mockRejectedValue(new Error('Invalid template'));

      const store = useCatalogStore.getState();
      
      await expect(store.createCatalog({
        name: 'Test',
        template: 'invalid' as any,
        primaryColor: '#000',
        secondaryColor: '#fff',
      })).rejects.toThrow('Invalid template');
      
      expect(useCatalogStore.getState().error).toBe('Invalid template');
    });
  });

  describe('updateCatalog', () => {
    it('should update a catalog successfully', async () => {
      (updateCatalog as jest.Mock).mockResolvedValue(undefined);
      (getCatalogs as jest.Mock).mockResolvedValue([]);

      const store = useCatalogStore.getState();
      await store.updateCatalog('1', {name: 'Updated Catalog'});

      expect(updateCatalog).toHaveBeenCalledWith('1', {name: 'Updated Catalog'});
    });

    it('should reload current catalog if it matches updated catalog', async () => {
      const mockCatalog = {id: '1', name: 'Test Catalog', template: 'minimal', productIds: []};
      useCatalogStore.setState({currentCatalog: mockCatalog});
      
      (updateCatalog as jest.Mock).mockResolvedValue(undefined);
      (getCatalogs as jest.Mock).mockResolvedValue([]);
      (getCatalogById as jest.Mock).mockResolvedValue({...mockCatalog, name: 'Updated Catalog'});
      (getCatalogProducts as jest.Mock).mockResolvedValue([]);

      const store = useCatalogStore.getState();
      await store.updateCatalog('1', {name: 'Updated Catalog'});

      expect(getCatalogById).toHaveBeenCalledWith('1');
    });
  });

  describe('deleteCatalog', () => {
    it('should delete a catalog successfully', async () => {
      (deleteCatalog as jest.Mock).mockResolvedValue(undefined);
      (getCatalogs as jest.Mock).mockResolvedValue([]);

      const store = useCatalogStore.getState();
      await store.deleteCatalog('1');

      expect(deleteCatalog).toHaveBeenCalledWith('1');
    });

    it('should clear current catalog if deleted catalog is current', async () => {
      const mockCatalog = {id: '1', name: 'Test Catalog', template: 'minimal', productIds: []};
      useCatalogStore.setState({currentCatalog: mockCatalog});
      
      (deleteCatalog as jest.Mock).mockResolvedValue(undefined);
      (getCatalogs as jest.Mock).mockResolvedValue([]);

      const store = useCatalogStore.getState();
      await store.deleteCatalog('1');

      expect(useCatalogStore.getState().currentCatalog).toBeNull();
      expect(useCatalogStore.getState().currentCatalogProducts).toEqual([]);
    });
  });

  describe('setCurrentCatalog', () => {
    it('should set current catalog', () => {
      const mockCatalog = {id: '1', name: 'Test Catalog', template: 'minimal', productIds: []};
      
      const store = useCatalogStore.getState();
      store.setCurrentCatalog(mockCatalog as any);

      expect(useCatalogStore.getState().currentCatalog).toEqual(mockCatalog);
    });
  });

  describe('startNewCatalog', () => {
    it('should create a new catalog template', () => {
      const store = useCatalogStore.getState();
      store.startNewCatalog();

      const currentCatalog = useCatalogStore.getState().currentCatalog;
      expect(currentCatalog).not.toBeNull();
      expect(currentCatalog?.name).toBe('New Catalog');
      expect(currentCatalog?.template).toBe('minimal');
      expect(currentCatalog?.id).toMatch(/^temp-/);
    });
  });

  describe('addProductToCatalog', () => {
    it('should add a product to catalog', async () => {
      (addProductsToCatalog as jest.Mock).mockResolvedValue(undefined);
      (getCatalogById as jest.Mock).mockResolvedValue({id: '1', name: 'Test'});
      (getCatalogProducts as jest.Mock).mockResolvedValue([]);

      const store = useCatalogStore.getState();
      await store.addProductToCatalog('1', 'p1');

      expect(addProductsToCatalog).toHaveBeenCalledWith('1', ['p1']);
    });
  });

  describe('removeProductFromCatalog', () => {
    it('should remove a product from catalog', async () => {
      (removeProductFromCatalog as jest.Mock).mockResolvedValue(undefined);
      (getCatalogById as jest.Mock).mockResolvedValue({id: '1', name: 'Test'});
      (getCatalogProducts as jest.Mock).mockResolvedValue([]);

      const store = useCatalogStore.getState();
      await store.removeProductFromCatalog('1', 'p1');

      expect(removeProductFromCatalog).toHaveBeenCalledWith('1', 'p1');
    });
  });
});
