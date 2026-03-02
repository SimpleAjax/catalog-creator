import { useState } from 'react';
import { ArrowLeft, Edit2, FileText, Image, MessageCircle, X, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function CatalogPreviewScreen() {
  const { currentCatalog, products, navigateTo, catalogs } = useStore();
  const [currentPage, setCurrentPage] = useState(0);
  const [showShareSheet, setShowShareSheet] = useState(false);
  const [showExportSuccess, setShowExportSuccess] = useState(false);
  
  const catalog = currentCatalog || catalogs[0];
  const catalogProducts = products.filter(p => catalog?.productIds.includes(p.id));
  
  // Split products into pages (4 products per page)
  const productsPerPage = 4;
  const totalPages = Math.ceil(catalogProducts.length / productsPerPage);
  const currentPageProducts = catalogProducts.slice(
    currentPage * productsPerPage, 
    (currentPage + 1) * productsPerPage
  );
  
  const handleShare = (_type: 'pdf' | 'image' | 'whatsapp') => {
    setShowShareSheet(false);
    setShowExportSuccess(true);
    setTimeout(() => setShowExportSuccess(false), 2000);
  };
  
  if (!catalog) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4">
        <p className="text-gray-500 mb-4">No catalog selected</p>
        <button onClick={() => navigateTo('home')} className="btn-primary">
          Go Home
        </button>
      </div>
    );
  }
  
  return (
    <div className="pb-24">
      {/* Header */}
      <div className="px-4 py-4 bg-white border-b border-gray-100 flex items-center gap-3">
        <button 
          onClick={() => navigateTo('home')}
          className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <h1 className="text-lg font-semibold truncate">{catalog.name}</h1>
          <p className="text-sm text-gray-500">{catalogProducts.length} products</p>
        </div>
        <button 
          onClick={() => navigateTo('catalog-builder')}
          className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center"
        >
          <Edit2 size={18} />
        </button>
      </div>
      
      {/* Page Navigation */}
      <div className="px-4 py-2 bg-gray-50 flex justify-between items-center">
        <button 
          onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
          disabled={currentPage === 0}
          className="p-2 disabled:opacity-30"
        >
          <ChevronLeft size={20} />
        </button>
        <span className="text-sm text-gray-600">
          Page {currentPage + 1} of {totalPages || 1}
        </span>
        <button 
          onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
          disabled={currentPage >= totalPages - 1}
          className="p-2 disabled:opacity-30"
        >
          <ChevronRight size={20} />
        </button>
      </div>
      
      {/* Catalog Page Preview */}
      <div className="p-4">
        <div 
          className="rounded-2xl overflow-hidden shadow-lg"
          style={{ backgroundColor: catalog.primaryColor }}
        >
          {/* Header */}
          <div className="p-6 text-center">
            <h2 
              className="text-2xl font-bold mb-1"
              style={{ color: catalog.secondaryColor }}
            >
              {catalog.storeName}
            </h2>
            <p 
              className="text-lg"
              style={{ color: catalog.secondaryColor, opacity: 0.9 }}
            >
              {catalog.name}
            </p>
          </div>
          
          {/* Products Grid */}
          <div className="px-4 pb-4">
            <div className="grid grid-cols-2 gap-3">
              {currentPageProducts.map(product => (
                <div 
                  key={product.id}
                  className="bg-white rounded-xl overflow-hidden"
                >
                  <img 
                    src={product.image}
                    alt={product.name}
                    className="w-full aspect-square object-cover"
                  />
                  <div className="p-2">
                    <p className="text-xs text-gray-900 truncate">{product.name}</p>
                    {product.price && (
                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-sm font-semibold text-gray-900">
                          ₹{product.price}
                        </span>
                        {product.mrp && (
                          <span className="text-xs text-gray-400 line-through">
                            ₹{product.mrp}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Footer */}
          <div 
            className="p-4 text-center text-sm"
            style={{ color: catalog.secondaryColor, opacity: 0.7 }}
          >
            <p>Contact us for orders</p>
            <p>WhatsApp: +91 98765 43210</p>
          </div>
        </div>
      </div>
      
      {/* Bottom Actions */}
      <div className="fixed bottom-20 left-4 right-4 max-w-[358px] mx-auto bg-gray-900 rounded-2xl p-4">
        <div className="flex gap-3">
          <button 
            onClick={() => handleShare('pdf')}
            className="flex-1 bg-white text-gray-900 py-3 rounded-xl flex items-center justify-center gap-2"
          >
            <FileText size={18} />
            PDF
          </button>
          <button 
            onClick={() => handleShare('image')}
            className="flex-1 bg-white text-gray-900 py-3 rounded-xl flex items-center justify-center gap-2"
          >
            <Image size={18} />
            Image
          </button>
          <button 
            onClick={() => handleShare('whatsapp')}
            className="flex-1 bg-green-500 text-white py-3 rounded-xl flex items-center justify-center gap-2"
          >
            <MessageCircle size={18} />
            WhatsApp
          </button>
        </div>
      </div>
      
      {/* Share Sheet */}
      {showShareSheet && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
          <div className="bg-white rounded-t-3xl w-full max-w-[390px] p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">Share Catalog</h3>
              <button onClick={() => setShowShareSheet(false)}>
                <X size={24} />
              </button>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <button 
                onClick={() => handleShare('pdf')}
                className="flex flex-col items-center gap-2"
              >
                <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center">
                  <FileText size={28} className="text-red-600" />
                </div>
                <span className="text-sm">PDF</span>
              </button>
              
              <button 
                onClick={() => handleShare('image')}
                className="flex flex-col items-center gap-2"
              >
                <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center">
                  <Image size={28} className="text-blue-600" />
                </div>
                <span className="text-sm">Image</span>
              </button>
              
              <button 
                onClick={() => handleShare('whatsapp')}
                className="flex flex-col items-center gap-2"
              >
                <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center">
                  <MessageCircle size={28} className="text-green-600" />
                </div>
                <span className="text-sm">WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Export Success Toast */}
      {showExportSuccess && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-full flex items-center gap-2 shadow-lg z-50">
          <Check size={18} className="text-green-400" />
          <span>Export successful!</span>
        </div>
      )}
    </div>
  );
}
