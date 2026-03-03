// Performance monitoring and optimization utilities

/**
 * Measure function execution time
 * @param name - Name of the operation
 * @param fn - Function to measure
 * @returns Result of the function
 */
export const measurePerformance = async <T>(
  name: string,
  fn: () => Promise<T>,
): Promise<T> => {
  const start = performance.now();

  try {
    const result = await fn();
    const duration = performance.now() - start;

    if (__DEV__) {
      console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`);
    }

    return result;
  } catch (error) {
    const duration = performance.now() - start;

    if (__DEV__) {
      console.log(`[Performance] ${name} (failed): ${duration.toFixed(2)}ms`);
    }

    throw error;
  }
};

/**
 * Debounce function calls
 * @param fn - Function to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced function
 */
export const debounce = <T extends (...args: any[]) => any>(
  fn: T,
  delay: number,
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};

/**
 * Throttle function calls
 * @param fn - Function to throttle
 * @param limit - Time limit in milliseconds
 * @returns Throttled function
 */
export const throttle = <T extends (...args: any[]) => any>(
  fn: T,
  limit: number,
): ((...args: Parameters<T>) => void) => {
  let inThrottle = false;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Request animation frame helper
 * @param callback - Function to call on next frame
 */
export const raf = (callback: () => void): void => {
  if (typeof requestAnimationFrame !== 'undefined') {
    requestAnimationFrame(callback);
  } else {
    setTimeout(callback, 16);
  }
};

/**
 * Schedule work in chunks to avoid blocking UI
 * @param items - Items to process
 * @param processor - Function to process each item
 * @param chunkSize - Number of items per chunk
 * @param onProgress - Progress callback
 */
export const scheduleInChunks = async <T>(
  items: T[],
  processor: (item: T) => void,
  chunkSize: number = 10,
  onProgress?: (completed: number, total: number) => void,
): Promise<void> => {
  return new Promise(resolve => {
    let index = 0;

    const processChunk = () => {
      const end = Math.min(index + chunkSize, items.length);

      for (let i = index; i < end; i++) {
        processor(items[i]);
      }

      index = end;

      if (onProgress) {
        onProgress(index, items.length);
      }

      if (index < items.length) {
        raf(processChunk);
      } else {
        resolve();
      }
    };

    processChunk();
  });
};

/**
 * Memoize function results
 * @param fn - Function to memoize
 * @returns Memoized function
 */
export const memoize = <T extends (...args: any[]) => any>(fn: T): T => {
  const cache = new Map<string, ReturnType<T>>();

  return ((...args: Parameters<T>): ReturnType<T> => {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key)!;
    }

    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
};

/**
 * Performance metrics tracker
 */
class PerformanceTracker {
  private metrics: Map<string, number[]> = new Map();

  /**
   * Record a metric
   * @param name - Metric name
   * @param value - Metric value
   */
  record(name: string, value: number): void {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    this.metrics.get(name)!.push(value);
  }

  /**
   * Get average value for a metric
   * @param name - Metric name
   * @returns Average value
   */
  getAverage(name: string): number | null {
    const values = this.metrics.get(name);
    if (!values || values.length === 0) return null;
    return values.reduce((a, b) => a + b, 0) / values.length;
  }

  /**
   * Get all metrics summary
   */
  getSummary(): Record<string, {count: number; average: number; min: number; max: number}> {
    const summary: Record<string, {count: number; average: number; min: number; max: number}> = {};

    this.metrics.forEach((values, name) => {
      summary[name] = {
        count: values.length,
        average: values.reduce((a, b) => a + b, 0) / values.length,
        min: Math.min(...values),
        max: Math.max(...values),
      };
    });

    return summary;
  }

  /**
   * Clear all metrics
   */
  clear(): void {
    this.metrics.clear();
  }
}

export const performanceTracker = new PerformanceTracker();

/**
 * List optimization props for FlatList
 */
export const getFlatListOptimizationProps = () => ({
  removeClippedSubviews: true,
  maxToRenderPerBatch: 9,
  initialNumToRender: 9,
  windowSize: 5,
  scrollEventThrottle: 16,
  decelerationRate: 'fast' as const,
});

/**
 * Check if device is low-end
 * This is a simple heuristic based on memory
 */
export const isLowEndDevice = (): boolean => {
  // In production, this would check device capabilities
  // For now, return false as default
  return false;
};

/**
 * Get optimal image quality based on device
 */
export const getOptimalImageQuality = (): number => {
  return isLowEndDevice() ? 0.6 : 0.8;
};
