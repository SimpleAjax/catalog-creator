// Store unit tests - simplified version without Expo imports
import {useAppStore} from '../src/store/useAppStore';

describe('useAppStore', () => {
  beforeEach(() => {
    // Reset store state
    useAppStore.setState({
      currentScreen: 'Home',
      previousScreen: null,
      isLoading: false,
      error: null,
      searchQuery: '',
      recentSearches: [],
      selectedProductIds: [],
      isSelectionMode: false,
    });
  });

  it('should toggle selection mode', () => {
    const store = useAppStore.getState();
    
    expect(store.isSelectionMode).toBe(false);
    store.toggleSelectionMode();
    expect(useAppStore.getState().isSelectionMode).toBe(true);
  });

  it('should add to recent searches', () => {
    const store = useAppStore.getState();
    
    store.addRecentSearch('red saree');
    expect(useAppStore.getState().recentSearches).toContain('red saree');
  });

  it('should limit recent searches to 10', () => {
    const store = useAppStore.getState();
    
    for (let i = 0; i < 15; i++) {
      store.addRecentSearch(`search ${i}`);
    }
    
    expect(useAppStore.getState().recentSearches.length).toBe(10);
  });

  it('should toggle product selection', () => {
    const store = useAppStore.getState();
    
    store.toggleProductSelection('product-1');
    expect(useAppStore.getState().selectedProductIds).toContain('product-1');
    
    store.toggleProductSelection('product-1');
    expect(useAppStore.getState().selectedProductIds).not.toContain('product-1');
  });

  it('should select all products', () => {
    const store = useAppStore.getState();
    const ids = ['p1', 'p2', 'p3'];
    
    store.selectAll(ids);
    expect(useAppStore.getState().selectedProductIds).toEqual(ids);
  });

  it('should clear selection', () => {
    const store = useAppStore.getState();
    
    store.selectAll(['p1', 'p2']);
    store.clearSelection();
    
    expect(useAppStore.getState().selectedProductIds).toEqual([]);
    expect(useAppStore.getState().isSelectionMode).toBe(false);
  });

  it('should set search query', () => {
    const store = useAppStore.getState();
    
    store.setSearchQuery('silk saree');
    expect(useAppStore.getState().searchQuery).toBe('silk saree');
  });

  it('should set screen', () => {
    const store = useAppStore.getState();
    
    store.setScreen('Products');
    expect(useAppStore.getState().currentScreen).toBe('Products');
    expect(useAppStore.getState().previousScreen).toBe('Home');
  });
});
