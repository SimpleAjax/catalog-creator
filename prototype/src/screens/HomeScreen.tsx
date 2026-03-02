import { Package, BookOpen, Plus, Search, FolderHeart, TrendingUp } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function HomeScreen() {
  const { products, catalogs, navigateTo } = useStore();
  
  const activeCatalogs = catalogs.filter(c => c.status !== 'archived');
  const activeProducts = products.filter(p => !p.archived);
  
  return (
    <div className="pb-24">
      {/* Header */}
      <div className="px-4 pt-6 pb-4 bg-white">
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-sm text-gray-500">Welcome back</p>
            <h1 className="text-xl font-bold text-gray-900">My Store</h1>
          </div>
          <button 
            onClick={() => navigateTo('search')}
            className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center"
          >
            <Search size={20} className="text-gray-600" />
          </button>
        </div>
      </div>
      
      {/* Primary Actions - Products & Catalogs */}
      <div className="px-4 py-4">
        <div className="grid grid-cols-2 gap-4">
          {/* Products Card */}
          <button 
            onClick={() => navigateTo('products')}
            className="card bg-gradient-to-br from-primary-500 to-primary-600 text-white p-5 text-left"
          >
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-3">
              <Package size={24} />
            </div>
            <p className="text-3xl font-bold">{activeProducts.length}</p>
            <p className="text-primary-100 text-sm">Products</p>
            <div className="mt-3 flex items-center text-sm text-white/80">
              <Plus size={16} className="mr-1" />
              Add New
            </div>
          </button>
          
          {/* Catalogs Card */}
          <button 
            onClick={() => navigateTo('catalogs')}
            className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white p-5 text-left"
          >
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-3">
              <BookOpen size={24} />
            </div>
            <p className="text-3xl font-bold">{activeCatalogs.length}</p>
            <p className="text-blue-100 text-sm">Catalogs</p>
            <div className="mt-3 flex items-center text-sm text-white/80">
              <Plus size={16} className="mr-1" />
              Create New
            </div>
          </button>
        </div>
      </div>
      
      {/* Quick Add Button */}
      <div className="px-4">
        <button 
          onClick={() => navigateTo('add-product')}
          className="w-full btn-primary py-4 flex items-center justify-center gap-2 text-lg"
        >
          <Plus size={24} />
          Add Products
        </button>
      </div>
      
      {/* Recent Catalogs - Horizontal Scroll */}
      <div className="px-4 py-6">
        <div className="flex justify-between items-center mb-3">
          <p className="section-title">Your Catalogs</p>
          <button 
            onClick={() => navigateTo('catalogs')}
            className="text-sm text-primary-600 font-medium"
          >
            See All
          </button>
        </div>
        
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
          {activeCatalogs.length === 0 ? (
            <button 
              onClick={() => navigateTo('catalog-builder')}
              className="flex-shrink-0 w-48 h-32 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-400"
            >
              <BookOpen size={32} className="mb-2" />
              <span className="text-sm">Create your first catalog</span>
            </button>
          ) : (
            activeCatalogs.map(catalog => (
              <button
                key={catalog.id}
                onClick={() => navigateTo('catalog-preview')}
                className="flex-shrink-0 w-44 bg-white rounded-xl overflow-hidden shadow-sm"
              >
                <div 
                  className="h-24 flex items-center justify-center"
                  style={{ backgroundColor: catalog.primaryColor }}
                >
                  <BookOpen size={32} style={{ color: catalog.secondaryColor }} />
                </div>
                <div className="p-3">
                  <p className="font-medium text-gray-900 text-sm truncate">{catalog.name}</p>
                  <p className="text-xs text-gray-500">{catalog.productIds.length} products</p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
      
      {/* Recent Products */}
      <div className="px-4">
        <div className="flex justify-between items-center mb-3">
          <p className="section-title">Recent Products</p>
          <button 
            onClick={() => navigateTo('products')}
            className="text-sm text-primary-600 font-medium"
          >
            See All
          </button>
        </div>
        
        <div className="grid grid-cols-4 gap-2">
          {activeProducts.slice(0, 8).map(product => (
            <button
              key={product.id}
              onClick={() => navigateTo('products')}
              className="aspect-square rounded-xl overflow-hidden bg-gray-200"
            >
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>
      
      {/* Tips / Quick Stats */}
      <div className="px-4 py-6">
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <TrendingUp size={20} className="text-amber-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">Quick Tip</p>
              <p className="text-sm text-gray-500">Organize products with tags</p>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            Tag your products with categories like "Festive", "Daily Wear" or prices like "Under ₹500" to find them faster later.
          </p>
        </div>
      </div>
    </div>
  );
}
