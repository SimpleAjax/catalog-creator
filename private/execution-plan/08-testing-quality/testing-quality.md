# Phase 8: Testing & Quality Assurance

## Overview
Implement comprehensive testing strategy including E2E tests, integration tests, and unit tests to ensure app reliability and catch regressions.

## Acceptance Criteria
- [ ] E2E test for critical user flow: Add Product → Create Catalog → Share
- [ ] Unit tests for all store functions (>80% coverage)
- [ ] Unit tests for utility functions
- [ ] Integration tests for database operations
- [ ] All existing tests pass

## Test Structure

```
__tests__/
├── e2e/
│   ├── flows/
│   │   └── complete-flow.test.ts       # Full user journey
│   ├── screens/
│   │   ├── home-screen.test.ts
│   │   ├── products-screen.test.ts
│   │   └── catalogs-screen.test.ts
│   └── setup.ts
├── integration/
│   ├── database.test.ts
│   ├── stores/
│   │   ├── product-store.test.ts
│   │   ├── catalog-store.test.ts
│   │   └── app-store.test.ts
│   └── api/
│       └── database-api.test.ts
├── unit/
│   ├── components/
│   │   ├── ProductCard.test.tsx
│   │   ├── Header.test.tsx
│   │   └── ScreenWrapper.test.tsx
│   ├── utils/
│   │   ├── formatting.test.ts
│   │   └── validation.test.ts
│   └── theme/
│       └── colors.test.ts
└── setup.ts
```

## Execution Steps

### Phase 8.1: E2E Tests Setup

#### Step 1: Configure Detox
```javascript
// detox.config.js
module.exports = {
  testRunner: 'jest',
  runnerConfig: 'e2e/config.json',
  specs: 'e2e',
  apps: {
    ios: {
      type: 'ios.app',
      binaryPath: '...',
    },
    android: {
      type: 'android.apk',
      binaryPath: '...',
    },
  },
  devices: {
    simulator: {
      type: 'ios.simulator',
      device: {
        type: 'iPhone 14',
      },
    },
    emulator: {
      type: 'android.emulator',
      device: {
        avdName: 'Pixel_5_API_33',
      },
    },
  },
};
```

#### Step 2: Write Critical Path E2E Test
```typescript
// e2e/flows/complete-flow.test.ts
describe('Complete User Flow', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  it('should add products and create a catalog', async () => {
    // Navigate to Add Product
    await element(by.id('add-product-button')).tap();
    
    // Select images (mock)
    await element(by.id('select-images-button')).tap();
    
    // Add product details
    await element(by.id('product-name-input')).typeText('Test Product');
    await element(by.id('product-price-input')).typeText('999');
    await element(by.id('save-product-button')).tap();
    
    // Verify product added
    await expect(element(by.text('Test Product'))).toBeVisible();
    
    // Create catalog flow...
  });
});
```

### Phase 8.2: Store Unit Tests

#### Product Store Tests
```typescript
// __tests__/integration/stores/product-store.test.ts
import {useProductStore} from '@/store/product-store';

describe('Product Store', () => {
  beforeEach(() => {
    useProductStore.setState({
      products: [],
      filteredProducts: [],
      isLoading: false,
    });
  });

  it('should add a product', async () => {
    const store = useProductStore.getState();
    const product = {
      name: 'Test Product',
      price: 999,
      imageUri: 'test.jpg',
    };
    
    await store.addProduct(product);
    
    expect(useProductStore.getState().products).toHaveLength(1);
    expect(useProductStore.getState().products[0].name).toBe('Test Product');
  });

  it('should filter products by category', () => {
    const store = useProductStore.getState();
    store.products = [
      {id: '1', name: 'Saree', category: 'Clothing'},
      {id: '2', name: 'Necklace', category: 'Jewelry'},
    ];
    
    store.filterByCategory('Clothing');
    
    expect(useProductStore.getState().filteredProducts).toHaveLength(1);
    expect(useProductStore.getState().filteredProducts[0].category).toBe('Clothing');
  });

  it('should search products by name', () => {
    const store = useProductStore.getState();
    store.products = [
      {id: '1', name: 'Red Saree'},
      {id: '2', name: 'Blue Kurta'},
    ];
    
    store.searchProducts('saree');
    
    expect(useProductStore.getState().filteredProducts).toHaveLength(1);
    expect(useProductStore.getState().filteredProducts[0].name).toBe('Red Saree');
  });
});
```

### Phase 8.3: Component Tests

#### ProductCard Component Test
```typescript
// __tests__/unit/components/ProductCard.test.tsx
import {render, fireEvent} from '@testing-library/react-native';
import {ProductCard} from '@/components/ProductCard';

const mockProduct = {
  id: '1',
  name: 'Test Product',
  price: 499,
  imageUri: 'test.jpg',
};

describe('ProductCard', () => {
  it('renders product name', () => {
    const {getByText} = render(
      <ProductCard product={mockProduct} />
    );
    expect(getByText('Test Product')).toBeTruthy();
  });

  it('renders formatted price', () => {
    const {getByText} = render(
      <ProductCard product={mockProduct} />
    );
    expect(getByText('₹499')).toBeTruthy();
  });

  it('calls onPress when tapped', () => {
    const onPress = jest.fn();
    const {getByTestId} = render(
      <ProductCard 
        product={mockProduct} 
        onPress={onPress}
        testID="product-card"
      />
    );
    
    fireEvent.press(getByTestId('product-card'));
    expect(onPress).toHaveBeenCalled();
  });

  it('shows checkmark when selected', () => {
    const {getByTestId} = render(
      <ProductCard 
        product={mockProduct} 
        selected={true}
      />
    );
    expect(getByTestId('checkmark')).toBeTruthy();
  });
});
```

### Phase 8.4: Database Integration Tests

```typescript
// __tests__/integration/database.test.ts
import {getDatabase, seedDatabase} from '@/api/database';

describe('Database', () => {
  beforeEach(async () => {
    // Reset database
    const db = getDatabase();
    await db.execAsync('DELETE FROM products');
    await db.execAsync('DELETE FROM catalogs');
  });

  it('should insert and retrieve products', async () => {
    const db = getDatabase();
    
    await db.runAsync(
      'INSERT INTO products (name, price) VALUES (?, ?)',
      ['Test Product', 999]
    );
    
    const result = await db.getAllAsync('SELECT * FROM products');
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Test Product');
  });

  it('should search products with FTS5', async () => {
    // Test FTS5 search functionality
  });
});
```

## Test Coverage Goals

| Module | Target Coverage |
|--------|-----------------|
| Stores | 90% |
| API/Database | 80% |
| Components | 70% |
| Utils | 90% |
| Screens | 50% |

## Execution Order

1. **Week 1: Unit Tests**
   - Store tests (product, catalog, app)
   - Utility function tests
   - Theme/constant tests

2. **Week 2: Component & Integration Tests**
   - Component rendering tests
   - Database integration tests
   - Store integration tests

3. **Week 3: E2E Tests**
   - Setup Detox
   - Write critical path tests
   - Setup CI pipeline

## Progress Tracking
| Date | Phase | Status | Blockers | Notes |
|------|-------|--------|----------|-------|
| | Unit Tests | | | |
| | Integration Tests | | | |
| | E2E Tests | | | |

## Related Files
- `jest.config.js`
- `jest.setup.js`
- `e2e/` directory
- `__tests__/` directory
