// Performance benchmarks for critical operations
import {measurePerformance} from '@/utils/performance';
import {getProducts, searchProducts, getCatalogs} from './index';

/**
 * Run performance benchmarks
 * This can be called during development to check performance
 */
export const runPerformanceBenchmarks = async (): Promise<Record<string, number>> => {
  const results: Record<string, number> = {};

  // Benchmark: Load products
  results.loadProducts = await measurePerformance('loadProducts', async () => {
    await getProducts({limit: 50});
  }).then(() => performance.now());

  // Benchmark: Search products
  results.searchProducts = await measurePerformance('searchProducts', async () => {
    await searchProducts('test');
  }).then(() => performance.now());

  // Benchmark: Load catalogs
  results.loadCatalogs = await measurePerformance('loadCatalogs', async () => {
    await getCatalogs();
  }).then(() => performance.now());

  if (__DEV__) {
    console.log('Performance Benchmarks:', results);
  }

  return results;
};

/**
 * Performance targets based on phase 9 requirements
 */
export const PERFORMANCE_TARGETS = {
  appLaunch: 2000,        // 2 seconds
  searchResponse: 100,    // 100ms
  catalogGeneration: 5000, // 5 seconds for 50 products
  imageLoad: 500,         // 500ms
};
