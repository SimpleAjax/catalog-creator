# Phase 11: Edge Cases & Error Handling

## Overview
Implement comprehensive error handling, empty states, loading states, and edge case handling throughout the app. Ensure the app is robust and provides good UX even when things go wrong.

## Acceptance Criteria
- [ ] All API calls have error handling
- [ ] Empty states for all lists (products, catalogs, search results)
- [ ] Loading states for async operations
- [ ] Retry mechanisms for failed operations
- [ ] Input validation with clear error messages
- [ ] Offline mode handling
- [ ] Graceful degradation for image loading failures

## Edge Cases to Handle

### Image Handling
- [ ] Broken/missing image URIs
- [ ] Corrupted image files
- [ ] Network failure when loading images
- [ ] Storage full when saving images
- [ ] Permission denied for camera/gallery

### Database Operations
- [ ] Database locked/busy
- [ ] Disk full
- [ ] Corrupted database (recovery)
- [ ] Migration failures

### User Input
- [ ] Empty product names
- [ ] Invalid price values
- [ ] Very long text inputs
- [ ] Special characters in names
- [ ] Duplicate product names

### Export/Share
- [ ] Storage full during export
- [ ] Share intent cancelled
- [ ] No WhatsApp installed
- [ ] File too large to share
- [ ] Network issues during share

## Execution Steps

### Phase 11.1: Error Boundary

```typescript
// src/components/ErrorBoundary.tsx
import React, {Component, ErrorInfo, ReactNode} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = {hasError: false};

  static getDerivedStateFromError(error: Error): State {
    return {hasError: true, error};
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
    // Log to crash reporting service in production
  }

  handleReset = () => {
    this.setState({hasError: false, error: undefined});
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Something went wrong</Text>
          <Text style={styles.message}>
            {this.state.error?.message || 'Unknown error'}
          </Text>
          <TouchableOpacity style={styles.button} onPress={this.handleReset}>
            <Text style={styles.buttonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}
```

### Phase 11.2: Image Fallback

```typescript
// src/components/SafeImage.tsx
import React, {useState} from 'react';
import {Image, View, Text, StyleSheet, ImageProps} from 'react-native';
import {ImageIcon} from 'lucide-react-native';

interface SafeImageProps extends ImageProps {
  fallbackText?: string;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  source,
  style,
  fallbackText = 'Image unavailable',
  ...props
}) => {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  if (error || !source) {
    return (
      <View style={[style, styles.fallback]}>
        <ImageIcon size={32} color="#9CA3AF" />
        <Text style={styles.fallbackText}>{fallbackText}</Text>
      </View>
    );
  }

  return (
    <Image
      source={source}
      style={[style, !loaded && styles.loading]}
      onError={() => setError(true)}
      onLoad={() => setLoaded(true)}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  fallback: {
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fallbackText: {
    marginTop: 8,
    fontSize: 12,
    color: '#9CA3AF',
  },
  loading: {
    opacity: 0,
  },
});
```

### Phase 11.3: Empty States

```typescript
// src/components/EmptyState.tsx
import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {Package, Search, Plus} from 'lucide-react-native';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  message,
  actionLabel,
  onAction,
}) => {
  return (
    <View style={styles.container}>
      {icon || <Package size={48} color="#9CA3AF" />}
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {actionLabel && onAction && (
        <TouchableOpacity style={styles.button} onPress={onAction}>
          <Plus size={20} color="#FFFFFF" />
          <Text style={styles.buttonText}>{actionLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

// Usage examples for different contexts
export const EmptyProducts: React.FC<{onAdd: () => void}> = ({onAdd}) => (
  <EmptyState
    icon={<Package size={48} color="#9CA3AF" />}
    title="No products yet"
    message="Add your first product to get started"
    actionLabel="Add Product"
    onAction={onAdd}
  />
);

export const EmptySearch: React.FC<{query: string; onClear: () => void}> = ({
  query,
  onClear,
}) => (
  <EmptyState
    icon={<Search size={48} color="#9CA3AF" />}
    title="No results found"
    message={`No products match "${query}"`}
    actionLabel="Clear Search"
    onAction={onClear}
  />
);
```

### Phase 11.4: Loading States

```typescript
// src/components/LoadingState.tsx
import React from 'react';
import {View, ActivityIndicator, Text, StyleSheet} from 'react-native';
import {semantic} from '@/theme';

interface LoadingStateProps {
  message?: string;
  fullscreen?: boolean;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading...',
  fullscreen = false,
}) => {
  return (
    <View style={[styles.container, fullscreen && styles.fullscreen]}>
      <ActivityIndicator size="large" color={semantic.primary} />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

// Skeleton loading for product cards
export const ProductCardSkeleton: React.FC = () => (
  <View style={skeletonStyles.card}>
    <View style={skeletonStyles.image} />
    <View style={skeletonStyles.text} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    padding: 24,
    alignItems: 'center',
  },
  fullscreen: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    marginTop: 12,
    fontSize: 14,
    color: semantic.textSecondary,
  },
});

const skeletonStyles = StyleSheet.create({
  card: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    overflow: 'hidden',
  },
  image: {
    flex: 1,
    backgroundColor: '#E5E7EB',
  },
  text: {
    height: 20,
    margin: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
  },
});
```

### Phase 11.5: API Error Handling

```typescript
// src/utils/error-handling.ts
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public isRetryable: boolean = false
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const handleApiError = (error: unknown): AppError => {
  if (error instanceof AppError) {
    return error;
  }
  
  if (error instanceof Error) {
    // Check for specific error types
    if (error.message.includes('network')) {
      return new AppError(
        'Network error. Please check your connection.',
        'NETWORK_ERROR',
        true
      );
    }
    
    if (error.message.includes('storage')) {
      return new AppError(
        'Storage full. Please free up space.',
        'STORAGE_FULL',
        false
      );
    }
    
    return new AppError(error.message, 'UNKNOWN_ERROR', true);
  }
  
  return new AppError('An unexpected error occurred', 'UNKNOWN_ERROR', true);
};

// Hook for async operations with error handling
export const useAsyncOperation = <T>() => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<AppError | null>(null);
  
  const execute = async (operation: () => Promise<T>): Promise<T | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await operation();
      return result;
    } catch (err) {
      const appError = handleApiError(err);
      setError(appError);
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  const retry = () => {
    setError(null);
  };
  
  return {isLoading, error, execute, retry};
};
```

### Phase 11.6: Input Validation

```typescript
// src/utils/validation.ts
export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export const validateProduct = (product: {
  name?: string;
  price?: string;
}): ValidationResult => {
  if (!product.name?.trim()) {
    return {isValid: false, error: 'Product name is required'};
  }
  
  if (product.name.length > 100) {
    return {isValid: false, error: 'Product name is too long (max 100 characters)'};
  }
  
  if (product.price) {
    const price = parseFloat(product.price);
    if (isNaN(price) || price < 0) {
      return {isValid: false, error: 'Price must be a positive number'};
    }
    if (price > 999999) {
      return {isValid: false, error: 'Price is too high'};
    }
  }
  
  return {isValid: true};
};

export const validateCatalog = (catalog: {
  name?: string;
  productIds?: string[];
}): ValidationResult => {
  if (!catalog.name?.trim()) {
    return {isValid: false, error: 'Catalog name is required'};
  }
  
  if (catalog.name.length > 50) {
    return {isValid: false, error: 'Catalog name is too long'};
  }
  
  if (!catalog.productIds || catalog.productIds.length === 0) {
    return {isValid: false, error: 'Select at least one product'};
  }
  
  return {isValid: true};
};
```

### Phase 11.7: Toast Notifications

```typescript
// src/components/Toast.tsx
import React, {createContext, useContext, useState, useCallback} from 'react';
import {Animated, Text, StyleSheet} from 'react-native';

type ToastType = 'success' | 'error' | 'info';

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export const ToastProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState<ToastType>('info');
  const fadeAnim = useState(new Animated.Value(0))[0];
  
  const showToast = useCallback((msg: string, toastType: ToastType = 'info') => {
    setMessage(msg);
    setType(toastType);
    setVisible(true);
    
    Animated.sequence([
      Animated.timing(fadeAnim, {toValue: 1, duration: 200, useNativeDriver: true}),
      Animated.delay(3000),
      Animated.timing(fadeAnim, {toValue: 0, duration: 200, useNativeDriver: true}),
    ]).start(() => setVisible(false));
  }, [fadeAnim]);
  
  return (
    <ToastContext.Provider value={{showToast}}>
      {children}
      {visible && (
        <Animated.View style={[styles.container, {opacity: fadeAnim}, styles[type]]}>
          <Text style={styles.text}>{message}</Text>
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};
```

## Progress Tracking
| Date | Feature | Status | Notes |
|------|---------|--------|-------|
| | Error Boundary | | |
| | Image Fallback | | |
| | Empty States | | |
| | Loading States | | |
| | API Error Handling | | |
| | Input Validation | | |
| | Toast Notifications | | |

## Related Files
- `src/components/ErrorBoundary.tsx`
- `src/components/SafeImage.tsx`
- `src/components/EmptyState.tsx`
- `src/components/LoadingState.tsx`
- `src/components/Toast.tsx`
- `src/utils/error-handling.ts`
- `src/utils/validation.ts`
