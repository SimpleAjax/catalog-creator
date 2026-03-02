// Tag Preset Store - Zustand
import {create} from 'zustand';
import {immer} from 'zustand/middleware/immer';
import {
  getTagPresets,
  createTagPreset,
  updateTagPreset,
  deleteTagPreset,
  applyTagPreset,
} from '@/api';
import {TagPreset} from '@/types';

interface TagPresetState {
  presets: TagPreset[];
  isLoading: boolean;
  error: string | null;

  loadPresets: () => Promise<void>;
  createPreset: (name: string, tags: string[]) => Promise<void>;
  updatePreset: (id: string, updates: {name?: string; tags?: string[]}) => Promise<void>;
  deletePreset: (id: string) => Promise<void>;
  applyPreset: (presetId: string, productIds: string[]) => Promise<void>;
}

export const useTagPresetStore = create<TagPresetState>()(
  immer((set, get) => ({
    presets: [],
    isLoading: false,
    error: null,

    loadPresets: async () => {
      set(state => {
        state.isLoading = true;
        state.error = null;
      });

      try {
        const presets = await getTagPresets();
        set(state => {
          state.presets = presets;
          state.isLoading = false;
        });
      } catch (error) {
        set(state => {
          state.error = error instanceof Error ? error.message : 'Unknown error';
          state.isLoading = false;
        });
      }
    },

    createPreset: async (name: string, tags: string[]) => {
      set(state => {
        state.isLoading = true;
        state.error = null;
      });

      try {
        await createTagPreset(name, tags);
        await get().loadPresets();
      } catch (error) {
        set(state => {
          state.error = error instanceof Error ? error.message : 'Unknown error';
          state.isLoading = false;
        });
        throw error;
      }
    },

    updatePreset: async (id: string, updates: {name?: string; tags?: string[]}) => {
      set(state => {
        state.isLoading = true;
        state.error = null;
      });

      try {
        await updateTagPreset(id, updates);
        await get().loadPresets();
      } catch (error) {
        set(state => {
          state.error = error instanceof Error ? error.message : 'Unknown error';
          state.isLoading = false;
        });
        throw error;
      }
    },

    deletePreset: async (id: string) => {
      set(state => {
        state.isLoading = true;
        state.error = null;
      });

      try {
        await deleteTagPreset(id);
        await get().loadPresets();
      } catch (error) {
        set(state => {
          state.error = error instanceof Error ? error.message : 'Unknown error';
          state.isLoading = false;
        });
        throw error;
      }
    },

    applyPreset: async (presetId: string, productIds: string[]) => {
      set(state => {
        state.isLoading = true;
        state.error = null;
      });

      try {
        await applyTagPreset(presetId, productIds);
        set(state => {
          state.isLoading = false;
        });
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
