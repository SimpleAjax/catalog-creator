import { useState } from 'react';
import { ArrowLeft, Check, Palette, Type, Image as ImageIcon, Package, Search } from 'lucide-react';
import { useStore } from '../store/useStore';

const TEMPLATES = [
  { id: 'minimal', name: 'Minimal', color: '#374151', accent: '#f3f4f6', desc: 'Clean and simple' },
  { id: 'bold', name: 'Bold', color: '#dc2626', accent: '#fee2e2', desc: 'Vibrant & eye-catching' },
  { id: 'elegant', name: 'Elegant', color: '#7c3aed', accent: '#ede9fe', desc: 'Sophisticated look' },
  { id: 'festive', name: 'Festive', color: '#d97706', accent: '#fef3c7', desc: 'Perfect for celebrations' },
  { id: 'modern', name: 'Modern', color: '#0891b2', accent: '#cffafe', desc: 'Contemporary style' },
];

const FONTS = ['Inter', 'Playfair Display', 'Roboto', 'Poppins', 'Montserrat'];

export default function CatalogBuilderScreen() {
  const { 
    products, 
    currentCatalog, 
    startNewCatalog, 
    updateCatalog,
    addProductToCatalog,
    removeProductFromCatalog,
    catalogs,
    setCatalogs,
    navigateTo
  } = useStore();
  
  const [step, setStep] = useState<'template' | 'products' | 'customize' | 'preview'>('template');
  const [productSearch, setProductSearch] = useState('');
  
  // Initialize new catalog if none exists
  if (!currentCatalog) {
    startNewCatalog();
  }
  
  const availableProducts = products.filter(p => 
    !p.archived && 
    (productSearch === '' || 
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.tags.some(t => t.toLowerCase().includes(productSearch.toLowerCase())))
  );
  
  const selectedProducts = products.filter(p => currentCatalog?.productIds.includes(p.id));
  
  const handleTemplateSelect = (templateId: string) => {
    const template = TEMPLATES.find(t => t.id === templateId);
    if (template && currentCatalog) {
      updateCatalog({ 
        template: templateId as typeof currentCatalog.template,
        primaryColor: template.color,
        secondaryColor: template.accent
      });
    }
  };
  
  const handleSaveCatalog = () => {
    if (currentCatalog && currentCatalog.name && currentCatalog.productIds.length > 0) {
      const existing = catalogs.find(c => c.id === currentCatalog.id);
      if (!existing) {
        setCatalogs?.([...catalogs, currentCatalog]);
      } else {
        setCatalogs?.(catalogs.map(c => c.id === currentCatalog.id ? currentCatalog : c));
      }
      navigateTo('catalog-preview');
    }
  };
  
  const steps = [
    { id: 'template', label: 'Template', icon: Palette },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'customize', label: 'Customize', icon: Type },
    { id: 'preview', label: 'Preview', icon: ImageIcon },
  ];
  
  return (
    <div className="pb-24">
      {/* Header */}
      <div className="px-4 py-4 bg-white border-b border-gray-100">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => step === 'template' ? navigateTo('home') : setStep(steps[steps.findIndex(s => s.id === step) - 1].id as typeof step)}
            className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-semibold">New Catalog</h1>
            <p className="text-sm text-gray-500">
              Step {steps.findIndex(s => s.id === step) + 1} of {steps.length}
            </p>
          </div>
        </div>
        
        {/* Progress */}
        <div className="flex gap-1 mt-4">
          {steps.map((s, idx) => (
            <div 
              key={s.id}
              className={`h-1 flex-1 rounded-full ${
                idx <= steps.findIndex(st => st.id === step) ? 'bg-primary-500' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>
      
      {/* Step Content */}
      <div className="p-4">
        {step === 'template' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Catalog Name
              </label>
              <input
                type="text"
                value={currentCatalog?.name || ''}
                onChange={(e) => updateCatalog({ name: e.target.value })}
                placeholder="e.g., Summer Collection 2024"
                className="input"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Choose Template
              </label>
              <div className="space-y-3">
                {TEMPLATES.map(template => (
                  <button
                    key={template.id}
                    onClick={() => handleTemplateSelect(template.id)}
                    className={`w-full p-4 rounded-xl border-2 flex items-center gap-4 ${
                      currentCatalog?.template === template.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200'
                    }`}
                  >
                    <div 
                      className="w-16 h-16 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: template.color }}
                    >
                      <Palette size={28} style={{ color: template.accent }} />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-semibold text-gray-900">{template.name}</p>
                      <p className="text-sm text-gray-500">{template.desc}</p>
                    </div>
                    {currentCatalog?.template === template.id && (
                      <Check size={24} className="text-primary-500" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {step === 'products' && (
          <div className="space-y-4">
            <div className="relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                placeholder="Search products to add..."
                className="input pl-11"
              />
            </div>
            
            {selectedProducts.length > 0 && (
              <div className="bg-primary-50 rounded-xl p-3">
                <p className="text-sm text-primary-700">
                  {selectedProducts.length} products selected
                </p>
              </div>
            )}
            
            <div className="grid grid-cols-3 gap-2">
              {availableProducts.map(product => {
                const isSelected = currentCatalog?.productIds.includes(product.id);
                return (
                  <button
                    key={product.id}
                    onClick={() => isSelected 
                      ? removeProductFromCatalog(product.id)
                      : addProductToCatalog(product.id)
                    }
                    className={`product-thumb ${isSelected ? 'ring-2 ring-primary-500' : ''}`}
                  >
                    <img src={product.image} alt={product.name} />
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                        <Check size={14} className="text-white" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
        
        {step === 'customize' && (
          <div className="space-y-6">
            {/* Colors */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Brand Colors
              </label>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-xs text-gray-500 mb-1 block">Primary</label>
                  <input
                    type="color"
                    value={currentCatalog?.primaryColor || '#dc2626'}
                    onChange={(e) => updateCatalog({ primaryColor: e.target.value })}
                    className="w-full h-12 rounded-xl cursor-pointer"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-xs text-gray-500 mb-1 block">Secondary</label>
                  <input
                    type="color"
                    value={currentCatalog?.secondaryColor || '#ffffff'}
                    onChange={(e) => updateCatalog({ secondaryColor: e.target.value })}
                    className="w-full h-12 rounded-xl cursor-pointer"
                  />
                </div>
              </div>
            </div>
            
            {/* Store Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Store Name
              </label>
              <input
                type="text"
                value={currentCatalog?.storeName || ''}
                onChange={(e) => updateCatalog({ storeName: e.target.value })}
                className="input"
              />
            </div>
            
            {/* Font */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Font Style
              </label>
              <div className="space-y-2">
                {FONTS.map(font => (
                  <button
                    key={font}
                    className="w-full p-3 rounded-xl border border-gray-200 text-left"
                    style={{ fontFamily: font }}
                  >
                    {font}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {step === 'preview' && currentCatalog && (
          <div className="space-y-4">
            <div className="card">
              <h3 className="font-semibold mb-2">{currentCatalog.name}</h3>
              <p className="text-sm text-gray-500 mb-4">
                {currentCatalog.productIds.length} products • {currentCatalog.template} template
              </p>
              
              {/* Mini Preview */}
              <div 
                className="rounded-xl p-4 mb-4"
                style={{ backgroundColor: currentCatalog.primaryColor }}
              >
                <p 
                  className="text-xl font-bold mb-2"
                  style={{ color: currentCatalog.secondaryColor }}
                >
                  {currentCatalog.storeName}
                </p>
                <p 
                  className="text-sm"
                  style={{ color: currentCatalog.secondaryColor, opacity: 0.8 }}
                >
                  {currentCatalog.name}
                </p>
              </div>
              
              <div className="grid grid-cols-4 gap-2">
                {selectedProducts.slice(0, 4).map(product => (
                  <img 
                    key={product.id}
                    src={product.image}
                    alt={product.name}
                    className="aspect-square rounded-lg object-cover"
                  />
                ))}
                {selectedProducts.length > 4 && (
                  <div className="aspect-square rounded-lg bg-gray-100 flex items-center justify-center">
                    <span className="text-sm text-gray-600">+{selectedProducts.length - 4}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Navigation Buttons */}
      <div className="fixed bottom-20 left-4 right-4 max-w-[358px] mx-auto flex gap-3">
        {step !== 'template' && (
          <button 
            onClick={() => setStep(steps[steps.findIndex(s => s.id === step) - 1].id as typeof step)}
            className="flex-1 btn-secondary"
          >
            Back
          </button>
        )}
        <button 
          onClick={() => {
            if (step === 'preview') {
              handleSaveCatalog();
            } else {
              setStep(steps[steps.findIndex(s => s.id === step) + 1].id as typeof step);
            }
          }}
          disabled={step === 'template' && (!currentCatalog?.name || !currentCatalog?.template)}
          className="flex-1 btn-primary disabled:opacity-50 shadow-lg"
        >
          {step === 'preview' ? 'Create Catalog' : 'Continue'}
        </button>
      </div>
    </div>
  );
}
