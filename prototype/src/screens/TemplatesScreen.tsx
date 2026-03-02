import { useState } from 'react';
import { ArrowLeft, BookOpen, Tag, Plus, MoreVertical, Trash2, Edit2 } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function TemplatesScreen() {
  const { tagPresets, catalogs, navigateTo, setCurrentCatalog } = useStore();
  const [activeTab, setActiveTab] = useState<'catalogs' | 'tags'>('catalogs');
  const [showMenu, setShowMenu] = useState<string | null>(null);
  
  const savedTemplates = catalogs.filter(c => c.status === 'published');
  
  const handleUseCatalogTemplate = (catalog: typeof catalogs[0]) => {
    setCurrentCatalog({
      ...catalog,
      id: `cat-new-${Date.now()}`,
      name: `${catalog.name} (Copy)`,
      status: 'draft',
      dateCreated: new Date().toISOString().split('T')[0]
    });
    navigateTo('catalog-builder');
  };
  
  const handleUseTagPreset = (_preset: typeof tagPresets[0]) => {
    navigateTo('products');
  };
  
  return (
    <div className="pb-24">
      {/* Header */}
      <div className="px-4 py-4 bg-white border-b border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          <button 
            onClick={() => navigateTo('home')}
            className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-semibold">My Templates</h1>
        </div>
        
        {/* Tabs */}
        <div className="flex gap-2 bg-gray-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('catalogs')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 ${
              activeTab === 'catalogs' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-500'
            }`}
          >
            <BookOpen size={16} />
            Catalogs
          </button>
          <button
            onClick={() => setActiveTab('tags')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 ${
              activeTab === 'tags' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-500'
            }`}
          >
            <Tag size={16} />
            Tag Presets
          </button>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4">
        {activeTab === 'catalogs' && (
          <div className="space-y-3">
            {savedTemplates.length === 0 ? (
              <div className="empty-state">
                <BookOpen size={48} className="mb-2 text-gray-300" />
                <p className="text-gray-400 mb-4">No saved catalog templates</p>
                <button 
                  onClick={() => navigateTo('catalog-builder')}
                  className="btn-primary"
                >
                  Create Your First Catalog
                </button>
              </div>
            ) : (
              <>
                <button 
                  onClick={() => navigateTo('catalog-builder')}
                  className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 flex items-center justify-center gap-2"
                >
                  <Plus size={20} />
                  Create New Catalog Template
                </button>
                
                {savedTemplates.map(template => (
                  <div 
                    key={template.id}
                    className="card relative"
                  >
                    <div className="flex items-center gap-4">
                      <div 
                        className="w-16 h-16 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: template.primaryColor }}
                      >
                        <BookOpen size={28} style={{ color: template.secondaryColor }} />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{template.name}</p>
                        <p className="text-sm text-gray-500">
                          {template.productIds.length} products • {template.template}
                        </p>
                      </div>
                      <div className="relative">
                        <button 
                          onClick={() => setShowMenu(showMenu === template.id ? null : template.id)}
                          className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center"
                        >
                          <MoreVertical size={20} />
                        </button>
                        
                        {showMenu === template.id && (
                          <div className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-lg border border-gray-100 py-1 min-w-[140px] z-10">
                            <button 
                              onClick={() => {
                                handleUseCatalogTemplate(template);
                                setShowMenu(null);
                              }}
                              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                            >
                              <Edit2 size={14} />
                              Use Template
                            </button>
                            <button 
                              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 text-red-600 flex items-center gap-2"
                            >
                              <Trash2 size={14} />
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        )}
        
        {activeTab === 'tags' && (
          <div className="space-y-3">
            <button 
              onClick={() => navigateTo('products')}
              className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 flex items-center justify-center gap-2"
            >
              <Plus size={20} />
              Create New Tag Preset
            </button>
            
            {tagPresets.map(preset => (
              <div 
                key={preset.id}
                className="card"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-gray-900">{preset.name}</p>
                  <button 
                    onClick={() => handleUseTagPreset(preset)}
                    className="text-sm text-primary-600 font-medium"
                  >
                    Apply
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {preset.tags.map(tag => (
                    <span key={tag} className="chip chip-inactive text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Close menu when clicking outside */}
      {showMenu && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setShowMenu(null)}
        />
      )}
    </div>
  );
}
