// Product Store Integration Tests
import {useProductStore} from '@/store/useProductStore';

// Mock the API layer
jest.mock('@/api', () => ({
  getProducts: jest.fn(),
  getProductById: jest.fn(),
  createProduct: jest.fn(),
  updateProduct: jest.fn(),
  archiveProduct: jest.fn(),
  getCategories: jest.fn(),
  getProductCount: jest.fn(),
  searchProducts: jest.fn(),
  bulkUpdateProducts: jest.fn(),
}));

import {
  getProducts,
  createProduct,
  updateProduct,
  archiveProduct,
  getCategories,
  getProductCount,
  searchProducts,
} from '@/api';

describe('Product Store', () => {
  beforeEach(() => {
    // Reset store state
    useProductStore.setState({
      products: [],
      filteredProducts: [],
      categories: [],
      totalCount: 0,
      archivedCount: 0,
      isLoading: false,
      error: null,
    });
    jest.clearAllMocks();
  });

  describe('loadProducts', () => {
    it('should load products successfully', async () => {
      const mockProducts = [
        {id: '1', name: 'Test Product 1', price: 999},
        {id: '2', name: 'Test Product 2', price: 1499},
      ];
      (getProducts as jest.Mock).mockResolvedValue(mockProducts);
      (getProductCount as jest.Mock).mockResolvedValue(2);
      (getCategories as jest.Mock).mockResolvedValue(['Electronics', 'Clothing']);

      const store = useProductStore.getState();
      await store.loadProducts();

      const state = useProductStore.getState();
      expect(state.products).toEqual(mockProducts);
      expect(state.filteredProducts).toEqual(mockProducts);
      expect(state.totalCount).toBe(2);
      expect(state.categories).toEqual(['Electronics', 'Clothing']);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });

    it('should handle load products error', async () => {
      (getProducts as jest.Mock).mockRejectedValue(new Error('Database error'));

      const store = useProductStore.getState();
      await store.loadProducts();

      const state = useProductStore.getState();
      expect(state.error).toBe('Database error');
      expect(state.isLoading).toBe(false);
    });

    it('should set loading state while fetching', async () => {
      (getProducts as jest.Mock).mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve([]), 10))
      );

      const store = useProductStore.getState();
      const promise = store.loadProducts();
      
      expect(useProductStore.getState().isLoading).toBe(true);
      await promise;
    });
  });

  describe('addProduct', () => {
    it('should add a product successfully', async () => {
      const mockProductId = 'new-product-id';
      (createProduct as jest.Mock).mockResolvedValue(mockProductId);
      (getProducts as jest.Mock).mockResolvedValue([
        {id: mockProductId, name: 'New Product', price: 999},
      ]);
      (getProductCount as jest.Mock).mockResolvedValue(1);
      (getCategories as jest.Mock).mockResolvedValue([]);

      const store = useProductStore.getState();
      const input = {
        name: 'New Product',
        price: 999,
        imageUri: 'test.jpg',
      };

      const result = await store.addProduct(input);

      expect(result).toBe(mockProductId);
      expect(createProduct).toHaveBeenCalledWith(input);
    });

    it('should handle add product error', async () => {
      (createProduct as jest.Mock).mockRejectedValue(new Error('Validation failed'));

      const store = useProductStore.getState();
      
      await expect(store.addProduct({name: '', price: 999, imageUri: ''}))
        .rejects.toThrow('Validation failed');
      
      expect(useProductStore.getState().error).toBe('Validation failed');
    });
  });

  describe('updateProduct', () => {
    it('should update a product successfully', async () => {
      (updateProduct as jest.Mock).mockResolvedValue(undefined);
      (getProducts as jest.Mock).mockResolvedValue([]);
      (getProductCount as jest.Mock).mockResolvedValue(0);
      (getCategories as jest.Mock).mockResolvedValue([]);

      const store = useProductStore.getState();
      await store.updateProduct('1', {name: 'Updated Name'});

      expect(updateProduct).toHaveBeenCalledWith('1', {name: 'Updated Name'});
    });
  });

  describe('archiveProduct', () => {
    it('should archive a product successfully', async () => {
      (archiveProduct as jest.Mock).mockResolvedValue(undefined);
      (getProducts as jest.Mock).mockResolvedValue([]);
      (getProductCount as jest.Mock).mockResolvedValue(0);
      (getCategories as jest.Mock).mockResolvedValue([]);

      const store = useProductStore.getState();
      await store.archiveProduct('1');

      expect(archiveProduct).toHaveBeenCalledWith('1');
    });
  });

  describe('search', () => {
    it('should search products successfully', async () => {
      const searchResults = [
        {id: '1', name: 'Red Saree', price: 2999},
      ];
      (searchProducts as jest.Mock).mockResolvedValue(searchResults);

      const store = useProductStore.getState();
      await store.search('saree');

      expect(searchProducts).toHaveBeenCalledWith('saree');
      expect(useProductStore.getState().filteredProducts).toEqual(searchResults);
    });

    it('should clear filters when search query is empty', async () => {
      useProductStore.setState({
        products: [{id: '1', name: 'Product 1'}],
        filteredProducts: [],
      });

      const store = useProductStore.getState();
      await store.search('');

      expect(useProductStore.getState().filteredProducts).toEqual(
        useProductStore.getState().products
      );
    });
  });

  describe('clearFilters', () => {
    it('should reset filtered products to all products', () => {
      useProductStore.setState({
        products: [
          {id: '1', name: 'Product 1'},
          {id: '2', name: 'Product 2'},
        ],
        filteredProducts: [{id: '1', name: 'Product 1'}],
      });

      const store = useProductStore.getState();
      store.clearFilters();

      expect(useProductStore.getState().filteredProducts).toHaveLength(2);
    });
  });
});
