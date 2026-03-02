import { useStore } from './store/useStore';
import HomeScreen from './screens/HomeScreen';
import AddProductScreen from './screens/AddProductScreen';
import ProductsScreen from './screens/ProductsScreen';
import CatalogsScreen from './screens/CatalogsScreen';
import BulkTagScreen from './screens/BulkTagScreen';
import SearchScreen from './screens/SearchScreen';
import CatalogBuilderScreen from './screens/CatalogBuilderScreen';
import CatalogPreviewScreen from './screens/CatalogPreviewScreen';
import TemplatesScreen from './screens/TemplatesScreen';
import BottomNav from './components/BottomNav';

function App() {
  const { currentScreen } = useStore();
  
  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <HomeScreen />;
      case 'add-product':
        return <AddProductScreen />;
      case 'products':
        return <ProductsScreen />;
      case 'catalogs':
        return <CatalogsScreen />;
      case 'bulk-tag':
        return <BulkTagScreen />;
      case 'search':
        return <SearchScreen />;
      case 'catalog-builder':
        return <CatalogBuilderScreen />;
      case 'catalog-preview':
        return <CatalogPreviewScreen />;
      case 'templates':
        return <TemplatesScreen />;
      default:
        return <HomeScreen />;
    }
  };
  
  // Show bottom nav only on main screens
  const showBottomNav = ['home', 'products', 'catalogs', 'templates'].includes(currentScreen);
  
  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center p-4">
      {/* Phone Frame */}
      <div className="phone-frame">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-gray-900 rounded-b-3xl z-50"></div>
        
        {/* Status Bar */}
        <div className="absolute top-2 left-0 right-0 flex justify-between px-6 text-xs font-medium text-gray-900 z-40">
          <span>9:41</span>
          <div className="flex gap-1">
            <span>5G</span>
            <span>100%</span>
          </div>
        </div>
        
        {/* Screen Content */}
        <div className="screen pt-10">
          {renderScreen()}
        </div>
        
        {/* Bottom Navigation */}
        {showBottomNav && <BottomNav />}
        
        {/* Home Indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-gray-900 rounded-full z-50"></div>
      </div>
    </div>
  );
}

export default App;
