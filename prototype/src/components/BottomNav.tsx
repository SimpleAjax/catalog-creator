import { Home, Package, BookOpen, Palette } from 'lucide-react';
import { useStore } from '../store/useStore';

const navItems = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'products', label: 'Products', icon: Package },
  { id: 'catalogs', label: 'Catalogs', icon: BookOpen },
  { id: 'templates', label: 'Templates', icon: Palette },
];

export default function BottomNav() {
  const { currentScreen, navigateTo } = useStore();
  
  return (
    <div className="bottom-nav">
      {navItems.map(item => {
        const isActive = currentScreen === item.id;
        const Icon = item.icon;
        
        return (
          <button
            key={item.id}
            onClick={() => navigateTo(item.id as typeof currentScreen)}
            className={`nav-item ${isActive ? 'active' : ''}`}
          >
            <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
            <span className="mt-1">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
