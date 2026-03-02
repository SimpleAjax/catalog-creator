import { useState, useMemo } from 'react';
import { ArrowLeft, Search, X, Clock, Tag, Package, BookOpen, SlidersHorizontal } from 'lucide-react';
import { useStore } from '../store/useStore';

const FILTERS = [
  { id: 'all', label: 'All', icon: Package },
  { id: 'products', label: 'Products', icon: Package },
  { id: 'catalogs', label: 'Catalogs', icon: BookOpen },
  { id: 'tags', label: 'Tags', icon: Tag },
];

export default function SearchScreen() {
  const { 
    products, 
    catalogs, 
    recentSearches, 
    addRecentSearch,
    navigateTo,
    setCurrentCatalog
  } = useStore();
  
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  
  const results = useMemo(() => {
    if (!query.trim()) return { products: [], catalogs: [], tags: [] };
    
    const searchTerm = query.toLowerCase();
    
    const matchedProducts = activeFilter === 'all' || activeFilter === 'products'
      ? products.filter(p => 
          !p.archived && (
            p.name.toLowerCase().includes(searchTerm) ||
            p.tags.some(t => t.toLowerCase().includes(searchTerm)) ||
            p.category.toLowerCase().includes(searchTerm) ||
            p.source.toLowerCase().includes(searchTerm)
          )
        ).slice(0, 10)
      : [];
    
    const matchedCatalogs = activeFilter === 'all' || activeFilter === 'catalogs'
      ? catalogs.filter(c => 
          c.name.toLowerCase().includes(searchTerm)
        )
      : [];
    
    const allTags = [...new Set(products.flatMap(p => p.tags))];
    const matchedTags = activeFilter === 'all' || activeFilter === 'tags'
      ? allTags.filter(t => t.toLowerCase().includes(searchTerm))
      : [];
    
    return { products: matchedProducts, catalogs: matchedCatalogs, tags: matchedTags };
  }, [query, products, catalogs, activeFilter]);
  
  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    if (searchQuery.trim()) {
      addRecentSearch(searchQuery);
    }
  };
  
  const handleCatalogClick = (catalog: typeof catalogs[0]) => {
    setCurrentCatalog(catalog);
    navigateTo('catalog-preview');
  };
  
  const hasResults = results.products.length > 0 || results.catalogs.length > 0 || results.tags.length > 0;
  
  return (
    <div className="pb-24">
      {/* Header */}
      <div className="px-4 py-4 bg-white border-b border-gray-100">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigateTo('home')}
            className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center"
          >
            <ArrowLeft size={20} />
          </button>
          
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search products, catalogs, tags..."
              className="w-full pl-11 pr-10 py-3 rounded-xl bg-gray-100 focus:bg-white focus:ring-2 focus:ring-primary-500 focus:outline-none"
              autoFocus
            />
            {query && (
              <button 
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center"
              >
                <X size={14} />
              </button>
            )}
          </div>
          
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              showFilters ? 'bg-primary-100 text-primary-600' : 'bg-gray-100'
            }`}
          >
            <SlidersHorizontal size={20} />
          </button>
        </div>
        
        {/* Filter Tabs */}
        <div className="flex gap-2 mt-4 overflow-x-auto">
          {FILTERS.map(filter => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`chip whitespace-nowrap flex items-center gap-1 ${
                activeFilter === filter.id ? 'chip-active' : 'chip-inactive'
              }`}
            >
              <filter.icon size={14} />
              {filter.label}
            </button>
          ))}
        </div>
      </div>
      
      {/* Results or Recent Searches */}
      <div className="p-4">
        {!query.trim() ? (
          /* Recent Searches */
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-medium text-gray-700">Recent Searches</h3>
            </div>
            
            {recentSearches.length === 0 ? (
              <div className="empty-state">
                <Clock size={48} className="mb-2 text-gray-300" />
                <p className="text-gray-400">No recent searches</p>
              </div>
            ) : (
              <div className="space-y-2">
                {recentSearches.map((search, idx) => (
                  <button
                    key={idx}
                    onClick={() => setQuery(search)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50"
                  >
                    <Clock size={18} className="text-gray-400" />
                    <span className="flex-1 text-left">{search}</span>
                    <Search size={16} className="text-gray-400" />
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : !hasResults ? (
          /* No Results */
          <div className="empty-state">
            <Search size={48} className="mb-2 text-gray-300" />
            <p className="text-gray-400">No results found for "{query}"</p>
          </div>
        ) : (
          /* Search Results */
          <div className="space-y-6">
            {/* Products */}
            {results.products.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  Products ({results.products.length})
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {results.products.map(product => (
                    <div key={product.id} className="product-thumb">
                      <img src={product.image} alt={product.name} />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                        <p className="text-white text-xs truncate">{product.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Catalogs */}
            {results.catalogs.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  Catalogs ({results.catalogs.length})
                </h3>
                <div className="space-y-2">
                  {results.catalogs.map(catalog => (
                    <button
                      key={catalog.id}
                      onClick={() => handleCatalogClick(catalog)}
                      className="w-full card flex items-center gap-3"
                    >
                      <div 
                        className="w-14 h-14 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: catalog.primaryColor }}
                      >
                        <BookOpen size={24} style={{ color: catalog.secondaryColor }} />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-medium text-gray-900">{catalog.name}</p>
                        <p className="text-sm text-gray-500">{catalog.productIds.length} products</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Tags */}
            {results.tags.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  Tags ({results.tags.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {results.tags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => setQuery(tag)}
                      className="chip chip-active"
                    >
                      <Tag size={12} className="mr-1" />
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Filter Panel */}
      {showFilters && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
          <div className="bg-white rounded-t-3xl w-full max-w-[390px] p-6 max-h-[70vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">Filters</h3>
              <button onClick={() => setShowFilters(false)}>
                <X size={24} />
              </button>
            </div>
            
            {/* Price Range */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">Price Range</label>
              <div className="flex gap-3">
                <input type="number" placeholder="Min" className="flex-1 input" />
                <input type="number" placeholder="Max" className="flex-1 input" />
              </div>
            </div>
            
            {/* Stock Status */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">Stock Status</label>
              <div className="flex gap-2 flex-wrap">
                {['In Stock', 'Limited', 'Out of Stock'].map(status => (
                  <button key={status} className="chip chip-inactive">
                    {status}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Date Added */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">Date Added</label>
              <div className="flex gap-2 flex-wrap">
                {['Today', 'This Week', 'This Month', 'Older'].map(date => (
                  <button key={date} className="chip chip-inactive">
                    {date}
                  </button>
                ))}
              </div>
            </div>
            
            <button 
              onClick={() => setShowFilters(false)}
              className="w-full btn-primary"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
