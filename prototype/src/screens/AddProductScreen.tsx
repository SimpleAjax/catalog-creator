import { useState } from 'react';
import { ArrowLeft, Image, Plus, Check, X, Camera, FolderOpen } from 'lucide-react';
import { useStore } from '../store/useStore';
import { UNSPLASH_PRODUCTS } from '../data/dummyData';

const DUMMY_NEW_IMAGES = UNSPLASH_PRODUCTS.slice(0, 12);

export default function AddProductScreen() {
  const { navigateTo, importProducts } = useStore();
  const [step, setStep] = useState<'select' | 'review'>('select');
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  
  const toggleImage = (img: string) => {
    setSelectedImages(prev => 
      prev.includes(img) 
        ? prev.filter(i => i !== img)
        : [...prev, img]
    );
  };
  
  const handleContinue = () => {
    if (selectedImages.length > 0) {
      setStep('review');
    }
  };
  
  const handleAdd = () => {
    importProducts(selectedImages.length, 'Gallery Import');
    navigateTo('bulk-tag');
  };
  
  const selectAll = () => {
    setSelectedImages(DUMMY_NEW_IMAGES);
  };
  
  return (
    <div className="pb-24">
      {/* Header */}
      <div className="px-4 py-4 bg-white border-b border-gray-100 flex items-center gap-3">
        <button 
          onClick={() => step === 'select' ? navigateTo('home') : setStep('select')}
          className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-semibold">
          {step === 'select' ? 'Add Products' : 'Review'}
        </h1>
        {step === 'select' && selectedImages.length > 0 && (
          <button 
            onClick={() => setSelectedImages([])}
            className="ml-auto text-sm text-gray-500"
          >
            Clear
          </button>
        )}
      </div>
      
      {step === 'select' && (
        <>
          {/* Source Options */}
          <div className="px-4 py-4 flex gap-3">
            <button className="flex-1 py-3 bg-primary-50 rounded-xl flex items-center justify-center gap-2 text-primary-700">
              <Camera size={20} />
              <span className="text-sm font-medium">Camera</span>
            </button>
            <button className="flex-1 py-3 bg-gray-100 rounded-xl flex items-center justify-center gap-2 text-gray-700">
              <FolderOpen size={20} />
              <span className="text-sm font-medium">Files</span>
            </button>
          </div>
          
          {/* Selection Count */}
          {selectedImages.length > 0 && (
            <div className="px-4 py-2 bg-primary-50 flex justify-between items-center">
              <span className="text-sm text-primary-700">
                {selectedImages.length} selected
              </span>
              <button 
                onClick={selectAll}
                className="text-sm text-primary-600 font-medium"
              >
                Select All
              </button>
            </div>
          )}
          
          {/* Image Grid */}
          <div className="p-4">
            <p className="text-sm text-gray-500 mb-3">Recent Photos</p>
            <div className="grid grid-cols-3 gap-2">
              {DUMMY_NEW_IMAGES.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => toggleImage(img)}
                  className={`aspect-square rounded-xl overflow-hidden bg-gray-200 relative ${selectedImages.includes(img) ? 'ring-2 ring-primary-500' : ''}`}
                >
                  <img 
                    src={img} 
                    alt={`Photo ${idx + 1}`}
                    className={`w-full h-full object-cover ${selectedImages.includes(img) ? 'opacity-80' : ''}`}
                  />
                  {selectedImages.includes(img) && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                      <Check size={14} className="text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
          
          {/* Floating Action */}
          {selectedImages.length > 0 && (
            <div className="fixed bottom-8 left-4 right-4 max-w-[358px] mx-auto">
              <button 
                onClick={handleContinue}
                className="w-full btn-primary shadow-lg py-4"
              >
                Continue ({selectedImages.length})
              </button>
            </div>
          )}
        </>
      )}
      
      {step === 'review' && (
        <div className="p-4">
          <div className="card mb-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center">
                <Image size={28} className="text-primary-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">{selectedImages.length} Products</p>
                <p className="text-sm text-gray-500">Ready to add to your library</p>
              </div>
            </div>
            
            <div className="border-t border-gray-100 pt-4">
              <p className="text-sm text-gray-600 mb-2">Preview:</p>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {selectedImages.slice(0, 6).map((img, idx) => (
                  <img 
                    key={idx}
                    src={img} 
                    alt=""
                    className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                  />
                ))}
                {selectedImages.length > 6 && (
                  <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm text-gray-600">+{selectedImages.length - 6}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="bg-amber-50 rounded-xl p-4 mb-4">
            <p className="text-sm text-amber-800">
              <strong>Next:</strong> You'll be able to organize these products with categories and tags.
            </p>
          </div>
          
          <div className="flex gap-3">
            <button 
              onClick={() => setStep('select')}
              className="flex-1 btn-secondary"
            >
              Back
            </button>
            <button 
              onClick={handleAdd}
              className="flex-1 btn-primary"
            >
              Add Products
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
