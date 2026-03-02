# Phase 9: Performance Optimization

## Overview
Optimize app performance for smooth 60fps scrolling, fast image loading, and quick catalog generation. Target: App launch < 2s, Search < 100ms, Catalog generation < 5s for 50 products.

## Acceptance Criteria
- [ ] App cold start < 2 seconds
- [ ] Search results < 100ms
- [ ] Smooth 60fps scrolling on product grids
- [ ] Catalog generation < 5s for 50 products
- [ ] Image loading with placeholders
- [ ] Memory usage optimized (no leaks)

## Performance Targets

| Metric | Current | Target | Priority |
|--------|---------|--------|----------|
| App Launch | ? | < 2s | High |
| Search Response | ? | < 100ms | High |
| Grid Scroll FPS | ? | 60fps | High |
| Catalog Generation | ? | < 5s | Medium |
| Image Load Time | ? | < 500ms | Medium |

## Execution Steps

### Phase 9.1: Image Optimization

#### Step 1: Thumbnail Generation
```typescript
// src/utils/image-processor.ts
import * as ImageManipulator from 'expo-image-manipulator';

export const generateThumbnail = async (
  uri: string, 
  size: number = 300
): Promise<string> => {
  const manipulated = await ImageManipulator.manipulateAsync(
    uri,
    [{resize: {width: size, height: size}}],
    {compress: 0.8, format: ImageManipulator.SaveFormat.JPEG}
  );
  return manipulated.uri;
};

// Store both original and thumbnail
export const processProductImage = async (uri: string) => {
  const thumbnailUri = await generateThumbnail(uri, 300);
  return {
    originalUri: uri,
    thumbnailUri,
  };
};
```

#### Step 2: Lazy Image Loading
```typescript
// src/components/LazyImage.tsx
import React, {useState} from 'react';
import {Image, View, ActivityIndicator} from 'react-native';

interface LazyImageProps {
  uri: string;
  thumbnailUri?: string;
  style: any;
}

export const LazyImage: React.FC<LazyImageProps> = ({
  uri, 
  thumbnailUri, 
  style
}) => {
  const [loaded, setLoaded] = useState(false);
  
  return (
    <View style={style}>
      {thumbnailUri && !loaded && (
        <Image
          source={{uri: thumbnailUri}}
          style={[style, {position: 'absolute'}]}
          blurRadius={2}
        />
      )}
      <Image
        source={{uri}}
        style={[style, !loaded && {opacity: 0}]}
        onLoad={() => setLoaded(true)}
      />
      {!loaded && (
        <ActivityIndicator style={{position: 'absolute'}} />
      )}
    </View>
  );
};
```

### Phase 9.2: List Optimization

#### Optimize FlatList Configuration
```typescript
// In product lists, add these optimizations:
<FlatList
  data={products}
  keyExtractor={item => item.id}
  numColumns={3}
  
  // Performance props
  removeClippedSubviews={true}  // Unmount items outside viewport
  maxToRenderPerBatch={9}       // Items per render batch
  initialNumToRender={9}        // Initial items
  windowSize={5}                // Viewport multiplier
  getItemLayout={(data, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  })}
  
  // Memoize render item
  renderItem={renderProductItem}
  
  // Disable extra data re-renders
  extraData={selectedIds}
/>
```

#### Memoize ProductCard
```typescript
// src/components/ProductCard.tsx
import React, {memo} from 'react';

export const ProductCard = memo<ProductCardProps>(({
  product,
  onPress,
  selected,
}) => {
  // Component logic
}, (prevProps, nextProps) => {
  // Custom comparison for performance
  return (
    prevProps.product.id === nextProps.product.id &&
    prevProps.selected === nextProps.selected
  );
});
```

### Phase 9.3: Database Optimization

#### Add Indexes
```sql
-- Add performance indexes
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(createdAt DESC);
CREATE INDEX IF NOT EXISTS idx_catalog_products_catalog_id ON catalog_products(catalogId);
```

#### Optimize Search Queries
```typescript
// Use prepared statements for repeated queries
const searchProducts = async (query: string) => {
  const db = getDatabase();
  
  // Use FTS5 for fast full-text search
  const results = await db.getAllAsync(
    `SELECT p.* FROM products p
     JOIN products_fts fts ON p.id = fts.rowid
     WHERE products_fts MATCH ?
     ORDER BY rank
     LIMIT 50`,
    [query + '*']
  );
  
  return results;
};
```

### Phase 9.4: State Management Optimization

#### Optimize Store Selectors
```typescript
// src/store/product-store.ts
import {shallow} from 'zustand/shallow';

// In component, use shallow comparison for arrays
const {products, loadProducts} = useProductStore(
  state => ({
    products: state.products,
    loadProducts: state.loadProducts,
  }),
  shallow  // Prevents re-render if array reference changes but content same
);
```

#### Split Large Stores
```typescript
// Split product store into smaller slices
// Instead of one large store, use separate stores:
// - useProductListStore
// - useProductDetailStore  
// - useProductFilterStore
```

### Phase 9.5: Catalog Generation Optimization

#### Web Worker for PDF Generation
```typescript
// Use react-native-thread or similar for heavy operations
// Or chunk the generation process:

export const generateCatalogPDF = async (
  catalog: Catalog,
  products: Product[],
  onProgress: (progress: number) => void
) => {
  const chunks = chunkArray(products, 10); // Process 10 at a time
  
  for (let i = 0; i < chunks.length; i++) {
    await processChunk(chunks[i]);
    onProgress((i + 1) / chunks.length);
    
    // Yield to main thread
    await new Promise(resolve => setTimeout(resolve, 0));
  }
};
```

### Phase 9.6: Memory Management

#### Clear Image Cache
```typescript
// Clear image cache when leaving heavy screens
import {Image as RNImage} from 'react-native';

useEffect(() => {
  return () => {
    // Clear memory when unmounting
    RNImage.clearMemoryCache();
  };
}, []);
```

#### Limit Stored Data
```typescript
// Keep only recent items in memory
const MAX_CACHED_PRODUCTS = 100;

const useProductStore = create((set, get) => ({
  products: [],
  
  addProducts: (newProducts) => {
    const current = get().products;
    const combined = [...newProducts, ...current];
    
    // Keep only most recent
    if (combined.length > MAX_CACHED_PRODUCTS) {
      combined.length = MAX_CACHED_PRODUCTS;
    }
    
    set({products: combined});
  },
}));
```

## Profiling & Measurement

### Add Performance Monitoring
```typescript
// src/utils/performance.ts
export const measurePerformance = <T>(
  name: string,
  fn: () => Promise<T>
): Promise<T> => {
  const start = performance.now();
  
  return fn().finally(() => {
    const duration = performance.now() - start;
    console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`);
    
    // Send to analytics in production
    if (__DEV__) {
      // Log to console in dev
    }
  });
};
```

## Testing Performance

### Benchmark Tests
```typescript
// __tests__/performance/benchmarks.test.ts
describe('Performance Benchmarks', () => {
  it('should load products in under 100ms', async () => {
    const start = performance.now();
    await loadProducts();
    const duration = performance.now() - start;
    
    expect(duration).toBeLessThan(100);
  });
  
  it('should search in under 50ms', async () => {
    const start = performance.now();
    await searchProducts('saree');
    const duration = performance.now() - start;
    
    expect(duration).toBeLessThan(50);
  });
});
```

## Progress Tracking
| Date | Task | Status | Before | After |
|------|------|--------|--------|-------|
| | Image thumbnails | | | |
| | List optimization | | | |
| | Database indexes | | | |
| | State optimization | | | |
| | Catalog generation | | | |

## Related Files
- `src/utils/image-processor.ts`
- `src/components/ProductCard.tsx`
- `src/components/LazyImage.tsx`
- `src/store/product-store.ts`
- `src/api/database.ts`
