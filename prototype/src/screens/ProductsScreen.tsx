import { useState, useMemo, useRef } from 'react';
import { ArrowLeft, Search, Tag, Archive, CheckSquare, Square, X } from 'lucide-react';
import { useStore } from '../store/useStore';
import type { Product } from '../data/dummyData';

const FILTERS = ['All', 'Clothing', 'Jewelry', 'Festive', 'Under ₹500', 'Untagged'];

export default function ProductsScreen() {
  const { 
    products, 
    navigateTo, 
    selectedProductIds, 
    toggleProductSelection,
    clearSelection,
    selectAll,
    activeFilter,
    setActiveFilter,
    searchQuery,
    setSearchQuery
  } = useStore();
  
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [selectionMode, setSelectionMode] = useState(false);
  
  const filteredProducts = useMemo(() => {
    let result = products.filter(p => !p.archived);
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.tags.some(t => t.toLowerCase().includes(query)) ||
        p.category.toLowerCase().includes(query)
      );
    }
    
    if (activeFilter && activeFilter !== 'All') {
      switch (activeFilter) {
        case 'Clothing':
          result = result.filter(p => p.category.includes('Sarees') || p.category.includes('Kurtis'));
          break;
        case 'Jewelry':
          result = result.filter(p => p.category.includes('Jewelry'));
          break;
        case 'Festive':
          result = result.filter(p => p.tags.includes('festive'));
          break;
        case 'Under ₹500':
          result = result.filter(p => p.price && p.price < 500);
          break;
        case 'Untagged':
          result = result.filter(p => p.tags.length === 0);
          break;
      }
    }
    
    return result;
  }, [products, searchQuery, activeFilter]);
  
  const handleLongPress = (productId: string) => {
    if (!selectionMode) {
      setSelectionMode(true);
      toggleProductSelection(productId);
    }
  };
  
  const exitSelectionMode = () => {
    setSelectionMode(false);
    clearSelection();
  };
  
  const handleBulkTag = () => {
    if (selectedProductIds.length > 0) {
      navigateTo('bulk-tag');
    }
  };
  
  return (
    <div className="pb-24">
      {/* Header */}
      <div className="px-4 py-4 bg-white border-b border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          {selectionMode ? (
            <button 
              onClick={exitSelectionMode}
              className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center"
            >
              <X size={20} />
            </button>
          ) : (
            <button 
              onClick={() => navigateTo('home')}
              className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center"
            >
              <ArrowLeft size={20} />
            </button>
          )}
          
          <h1 className="text-lg font-semibold flex-1">
            {selectionMode ? `${selectedProductIds.length} selected` : 'Products'}
          </h1>
          
          {selectionMode && (
            <button 
              onClick={() => selectAll(filteredProducts.map(p => p.id))}
              className="text-sm text-primary-600 font-medium"
            >
              Select All
            </button>
          )}
        </div>
        
        {/* Search */}
        <div className="relative mb-4">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products, tags..."
            className="input pl-11"
          />
        </div>
        
        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
          {FILTERS.map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter === 'All' ? null : filter)}
              className={`chip whitespace-nowrap ${
                (filter === 'All' && !activeFilter) || activeFilter === filter
                  ? 'chip-active' 
                  : 'chip-inactive'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>
      
      {/* Product Grid */}
      <div className="p-4">
        {filteredProducts.length === 0 ? (
          <div className="empty-state">
            <p className="text-gray-400">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {filteredProducts.map(product => (
              <ProductCard 
                key={product.id}
                product={product}
                isSelected={selectedProductIds.includes(product.id)}
                selectionMode={selectionMode}
                onToggle={() => toggleProductSelection(product.id)}
                onLongPress={() => handleLongPress(product.id)}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* Bulk Actions */}
      {selectionMode && selectedProductIds.length > 0 && (
        <div className="fixed bottom-20 left-4 right-4 max-w-[358px] mx-auto bg-gray-900 rounded-2xl p-4 flex gap-3">
          <button 
            onClick={handleBulkTag}
            className="flex-1 bg-primary-600 text-white py-3 rounded-xl flex items-center justify-center gap-2"
          >
            <Tag size={18} />
            Tag
          </button>
          <button className="flex-1 bg-gray-700 text-white py-3 rounded-xl flex items-center justify-center gap-2">
            <Archive size={18} />
            Archive
          </button>
        </div>
      )}
    </div>
  );
}

function ProductCard({ 
  product, 
  isSelected, 
  selectionMode, 
  onToggle, 
  onLongPress 
}: { 
  product: Product;
  isSelected: boolean;
  selectionMode: boolean;
  onToggle: () => void;
  onLongPress: () => void;
}) {
  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  const handleMouseDown = () => {
    pressTimer.current = setTimeout(onLongPress, 500);
  };
  
  const handleMouseUp = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
  };
  
  const handleClick = () => {
    if (selectionMode) {
      onToggle();
    }
  };
  
  return (
    <button
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleMouseDown}
      onTouchEnd={handleMouseUp}
      onClick={handleClick}
      className={`product-thumb ${isSelected ? 'ring-2 ring-primary-500' : ''}`}
    >
      <img src={product.image} alt={product.name} />
      
      {selectionMode && (
        <div className="absolute top-2 left-2">
          {isSelected ? (
            <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
              <CheckSquare size={14} className="text-white" />
            </div>
          ) : (
            <div className="w-6 h-6 bg-white/80 rounded-full flex items-center justify-center">
              <Square size={14} className="text-gray-600" />
            </div>
          )}
        </div>
      )}
      
      {product.price && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
          <p className="text-white text-xs font-medium">₹{product.price}</p>
        </div>
      )}
      
      {product.tags.includes('festive') && (
        <div className="absolute top-2 right-2 bg-amber-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
          Festive
        </div>
      )}
    </button>
  );
}
