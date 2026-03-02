import { useState } from 'react';
import { ArrowLeft, Check, Tag, Folder, X, Plus, Save } from 'lucide-react';
import { useStore } from '../store/useStore';

const CATEGORIES = [
  'Sarees > Silk',
  'Sarees > Cotton',
  'Sarees > Banarasi',
  'Kurtis > Long',
  'Kurtis > Short',
  'Jewelry > Earrings',
  'Jewelry > Necklace',
  'Dupattas > Silk',
  'Dupattas > Cotton',
  'Fabrics > Cotton',
  'Fabrics > Silk',
  'Accessories'
];

const COMMON_TAGS = ['festive', 'red', 'blue', 'green', 'cotton', 'silk', 'under-500', 'new-arrival', 'premium', 'daily-wear', 'wedding'];

export default function BulkTagScreen() {
  const { 
    products, 
    selectedProductIds, 
    tagPresets, 
    bulkUpdateProducts, 
    addTagPreset,
    navigateTo,
    clearSelection
  } = useStore();
  
  const selectedProducts = products.filter(p => selectedProductIds.includes(p.id));
  
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [category, setCategory] = useState('');
  const [newTagInput, setNewTagInput] = useState('');
  const [showSavePreset, setShowSavePreset] = useState(false);
  const [presetName, setPresetName] = useState('');
  
  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };
  
  const addNewTag = () => {
    if (newTagInput && !selectedTags.includes(newTagInput)) {
      setSelectedTags([...selectedTags, newTagInput]);
      setNewTagInput('');
    }
  };
  
  const applyPreset = (tags: string[]) => {
    setSelectedTags([...new Set([...selectedTags, ...tags])]);
  };
  
  const handleApply = () => {
    const updates: { tags?: string[]; category?: string } = {};
    if (selectedTags.length > 0) updates.tags = selectedTags;
    if (category) updates.category = category;
    
    bulkUpdateProducts(selectedProductIds, updates);
    clearSelection();
    navigateTo('products');
  };
  
  const handleSavePreset = () => {
    if (presetName && selectedTags.length > 0) {
      addTagPreset(presetName, selectedTags);
      setShowSavePreset(false);
      setPresetName('');
    }
  };
  
  return (
    <div className="pb-24">
      {/* Header */}
      <div className="px-4 py-4 bg-white border-b border-gray-100">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigateTo('products')}
            className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-semibold">Tag & Organize</h1>
            <p className="text-sm text-gray-500">{selectedProducts.length} products selected</p>
          </div>
        </div>
      </div>
      
      {/* Selected Products Preview */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="flex gap-2 overflow-x-auto p-4">
          {selectedProducts.slice(0, 10).map(product => (
            <img 
              key={product.id}
              src={product.image} 
              alt={product.name}
              className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
            />
          ))}
          {selectedProducts.length > 10 && (
            <div className="w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center flex-shrink-0">
              <span className="text-sm text-gray-600">+{selectedProducts.length - 10}</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="p-4 space-y-6">
        {/* Tag Presets */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="text-sm font-medium text-gray-700">Quick Apply Presets</label>
          </div>
          <div className="flex flex-wrap gap-2">
            {tagPresets.map(preset => (
              <button
                key={preset.id}
                onClick={() => applyPreset(preset.tags)}
                className="chip chip-inactive flex items-center gap-1"
              >
                <Tag size={12} />
                {preset.name}
              </button>
            ))}
          </div>
        </div>
        
        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Category
          </label>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`w-full p-3 rounded-xl border flex items-center gap-3 ${
                  category === cat 
                    ? 'border-primary-500 bg-primary-50' 
                    : 'border-gray-200'
                }`}
              >
                <Folder size={18} className={category === cat ? 'text-primary-500' : 'text-gray-400'} />
                <span className="flex-1 text-left text-sm">{cat}</span>
                {category === cat && <Check size={18} className="text-primary-500" />}
              </button>
            ))}
          </div>
        </div>
        
        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Tags
          </label>
          
          {/* Selected Tags */}
          {selectedTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {selectedTags.map(tag => (
                <span 
                  key={tag}
                  className="chip bg-primary-100 text-primary-700 flex items-center gap-1"
                >
                  {tag}
                  <button onClick={() => toggleTag(tag)}>
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          )}
          
          {/* Add New Tag */}
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={newTagInput}
              onChange={(e) => setNewTagInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addNewTag()}
              placeholder="Add custom tag..."
              className="flex-1 input"
            />
            <button 
              onClick={addNewTag}
              className="w-12 bg-gray-100 rounded-xl flex items-center justify-center"
            >
              <Plus size={20} />
            </button>
          </div>
          
          {/* Common Tags */}
          <div className="flex flex-wrap gap-2">
            {COMMON_TAGS.filter(t => !selectedTags.includes(t)).map(tag => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className="chip chip-inactive"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
        
        {/* Save as Preset */}
        {selectedTags.length > 0 && (
          <button
            onClick={() => setShowSavePreset(true)}
            className="w-full py-3 border border-dashed border-gray-300 rounded-xl text-gray-600 flex items-center justify-center gap-2"
          >
            <Save size={18} />
            Save as Tag Preset
          </button>
        )}
      </div>
      
      {/* Apply Button */}
      <div className="fixed bottom-20 left-4 right-4 max-w-[358px] mx-auto">
        <button 
          onClick={handleApply}
          className="w-full btn-primary shadow-lg"
        >
          Apply to {selectedProducts.length} Products
        </button>
      </div>
      
      {/* Save Preset Modal */}
      {showSavePreset && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
          <div className="bg-white rounded-t-3xl w-full max-w-[390px] p-6">
            <h3 className="text-lg font-semibold mb-4">Save Tag Preset</h3>
            <input
              type="text"
              value={presetName}
              onChange={(e) => setPresetName(e.target.value)}
              placeholder="Preset name (e.g., Festive Collection)"
              className="input mb-4"
            />
            <div className="flex gap-3">
              <button 
                onClick={() => setShowSavePreset(false)}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
              <button 
                onClick={handleSavePreset}
                disabled={!presetName}
                className="flex-1 btn-primary disabled:opacity-50"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
