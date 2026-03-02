// App Store - Navigation & UI State - Zustand
import {create} from 'zustand';
import {immer} from 'zustand/middleware/immer';
import {Screen} from '@/navigation/types';

interface AppState {
  // Navigation
  currentScreen: Screen;
  previousScreen: Screen | null;

  // UI State
  isLoading: boolean;
  error: string | null;

  // Search
  searchQuery: string;
  recentSearches: string[];

  // Selection (for bulk operations)
  selectedProductIds: string[];
  isSelectionMode: boolean;

  // Actions
  setScreen: (screen: Screen) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSearchQuery: (query: string) => void;
  addRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
  toggleSelectionMode: () => void;
  toggleProductSelection: (id: string) => void;
  selectAll: (ids: string[]) => void;
  clearSelection: () => void;
}

const MAX_RECENT_SEARCHES = 10;

export const useAppStore = create<AppState>()(
  immer((set, get) => ({
    currentScreen: 'Home',
    previousScreen: null,
    isLoading: false,
    error: null,
    searchQuery: '',
    recentSearches: [],
    selectedProductIds: [],
    isSelectionMode: false,

    setScreen: (screen: Screen) => {
      set(state => {
        state.previousScreen = state.currentScreen;
        state.currentScreen = screen;
      });
    },

    setLoading: (loading: boolean) => {
      set(state => {
        state.isLoading = loading;
      });
    },

    setError: (error: string | null) => {
      set(state => {
        state.error = error;
      });
    },

    setSearchQuery: (query: string) => {
      set(state => {
        state.searchQuery = query;
      });
    },

    addRecentSearch: (query: string) => {
      if (!query.trim()) return;

      set(state => {
        // Remove if exists
        state.recentSearches = state.recentSearches.filter(
          s => s.toLowerCase() !== query.toLowerCase(),
        );
        // Add to front
        state.recentSearches.unshift(query);
        // Keep max
        if (state.recentSearches.length > MAX_RECENT_SEARCHES) {
          state.recentSearches = state.recentSearches.slice(0, MAX_RECENT_SEARCHES);
        }
      });
    },

    clearRecentSearches: () => {
      set(state => {
        state.recentSearches = [];
      });
    },

    toggleSelectionMode: () => {
      set(state => {
        state.isSelectionMode = !state.isSelectionMode;
        if (!state.isSelectionMode) {
          state.selectedProductIds = [];
        }
      });
    },

    toggleProductSelection: (id: string) => {
      set(state => {
        const index = state.selectedProductIds.indexOf(id);
        if (index >= 0) {
          state.selectedProductIds.splice(index, 1);
        } else {
          state.selectedProductIds.push(id);
        }
      });
    },

    selectAll: (ids: string[]) => {
      set(state => {
        state.selectedProductIds = ids;
      });
    },

    clearSelection: () => {
      set(state => {
        state.selectedProductIds = [];
        state.isSelectionMode = false;
      });
    },
  })),
);
