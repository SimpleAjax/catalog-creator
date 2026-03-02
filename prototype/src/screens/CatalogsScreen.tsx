import { ArrowLeft, BookOpen, Plus, MoreVertical, Copy, Trash2, Share, Eye } from 'lucide-react';
import { useState } from 'react';
import { useStore } from '../store/useStore';

export default function CatalogsScreen() {
  const { catalogs, navigateTo, setCurrentCatalog } = useStore();
  const [showMenu, setShowMenu] = useState<string | null>(null);
  
  const activeCatalogs = catalogs.filter(c => c.status !== 'archived');
  
  const handleView = (catalog: typeof catalogs[0]) => {
    setCurrentCatalog(catalog);
    navigateTo('catalog-preview');
    setShowMenu(null);
  };
  
  const handleDuplicate = (catalog: typeof catalogs[0]) => {
    setCurrentCatalog({
      ...catalog,
      id: `cat-new-${Date.now()}`,
      name: `${catalog.name} (Copy)`,
      status: 'draft',
      dateCreated: new Date().toISOString().split('T')[0]
    });
    navigateTo('catalog-builder');
    setShowMenu(null);
  };
  
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
          <h1 className="text-lg font-semibold flex-1">My Catalogs</h1>
          <button 
            onClick={() => navigateTo('catalog-builder')}
            className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center"
          >
            <Plus size={20} className="text-primary-600" />
          </button>
        </div>
      </div>
      
      {/* Catalogs List */}
      <div className="p-4 space-y-3">
        {activeCatalogs.length === 0 ? (
          <div className="empty-state">
            <BookOpen size={48} className="mb-2 text-gray-300" />
            <p className="text-gray-400 mb-4">No catalogs yet</p>
            <button 
              onClick={() => navigateTo('catalog-builder')}
              className="btn-primary"
            >
              Create Your First Catalog
            </button>
          </div>
        ) : (
          activeCatalogs.map(catalog => (
            <div 
              key={catalog.id}
              className="card"
            >
              <div className="flex items-start gap-4">
                {/* Thumbnail */}
                <button
                  onClick={() => handleView(catalog)}
                  className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0"
                  style={{ backgroundColor: catalog.primaryColor }}
                >
                  <div className="w-full h-full flex items-center justify-center">
                    <BookOpen size={32} style={{ color: catalog.secondaryColor }} />
                  </div>
                </button>
                
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <button
                    onClick={() => handleView(catalog)}
                    className="text-left w-full"
                  >
                    <p className="font-semibold text-gray-900 truncate">{catalog.name}</p>
                    <p className="text-sm text-gray-500">{catalog.productIds.length} products</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        catalog.status === 'published' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        {catalog.status === 'published' ? 'Published' : 'Draft'}
                      </span>
                      <span className="text-xs text-gray-400">{catalog.template}</span>
                    </div>
                  </button>
                </div>
                
                {/* Menu */}
                <div className="relative">
                  <button 
                    onClick={() => setShowMenu(showMenu === catalog.id ? null : catalog.id)}
                    className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center"
                  >
                    <MoreVertical size={20} />
                  </button>
                  
                  {showMenu === catalog.id && (
                    <div className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-lg border border-gray-100 py-1 min-w-[160px] z-10">
                      <button 
                        onClick={() => handleView(catalog)}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                      >
                        <Eye size={16} />
                        View Catalog
                      </button>
                      <button 
                        onClick={() => handleDuplicate(catalog)}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                      >
                        <Copy size={16} />
                        Duplicate
                      </button>
                      <button 
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-red-600"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
        
        {/* Create New Card */}
        {activeCatalogs.length > 0 && (
          <button 
            onClick={() => navigateTo('catalog-builder')}
            className="w-full py-6 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 flex flex-col items-center justify-center gap-2"
          >
            <Plus size={28} />
            <span className="font-medium">Create New Catalog</span>
          </button>
        )}
      </div>
      
      {/* Close menu overlay */}
      {showMenu && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setShowMenu(null)}
        />
      )}
    </div>
  );
}
