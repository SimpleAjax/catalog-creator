// Optimized ProductCard with React.memo and performance improvements
import React, {memo, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import {Check} from 'lucide-react-native';
import {Product} from '@/types';
import {colors, semantic, typography} from '@/theme';
import {LazyImage} from './LazyImage';
import {formatPrice} from '@/utils/formatting';

interface OptimizedProductCardProps {
  product: Product;
  onPress?: (product: Product) => void;
  onLongPress?: (product: Product) => void;
  selected?: boolean;
  style?: ViewStyle;
  testID?: string;
}

export const OptimizedProductCard: React.FC<OptimizedProductCardProps> = memo(({
  product,
  onPress,
  onLongPress,
  selected = false,
  style,
  testID,
}) => {
  const handlePress = useCallback(() => {
    onPress?.(product);
  }, [onPress, product]);

  const handleLongPress = useCallback(() => {
    onLongPress?.(product);
  }, [onLongPress, product]);

  return (
    <TouchableOpacity
      style={[styles.container, selected && styles.selected, style]}
      onPress={handlePress}
      onLongPress={handleLongPress}
      activeOpacity={0.8}
      testID={testID}
      accessibilityLabel={product.name}>
      <View style={styles.imageContainer}>
        <LazyImage
          uri={product.imageUri}
          style={styles.image}
          resizeMode="cover"
        />
        {selected && (
          <View style={styles.checkmark} testID="checkmark">
            <Check size={16} color={semantic.card} strokeWidth={3} />
          </View>
        )}
        {product.price !== null && product.price !== undefined && (
          <View style={styles.priceOverlay}>
            <Text style={styles.priceText}>{formatPrice(product.price)}</Text>
          </View>
        )}
      </View>
      <Text style={styles.name} numberOfLines={1}>
        {product.name}
      </Text>
    </TouchableOpacity>
  );
}, (prevProps, nextProps) => {
  // Custom comparison for performance - only re-render if these change
  return (
    prevProps.product.id === nextProps.product.id &&
    prevProps.product.price === nextProps.product.price &&
    prevProps.selected === nextProps.selected
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: semantic.card,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: colors.black,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  selected: {
    borderWidth: 2,
    borderColor: semantic.primary,
  },
  imageContainer: {
    flex: 1,
    position: 'relative',
    backgroundColor: semantic.border,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  checkmark: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: semantic.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  priceOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  priceText: {
    color: semantic.card,
    fontSize: typography.bodySmall.fontSize,
    fontWeight: '700',
  },
  name: {
    padding: 8,
    fontSize: typography.caption.fontSize,
    fontWeight: '500',
    color: semantic.text,
  },
});

OptimizedProductCard.displayName = 'OptimizedProductCard';

export default OptimizedProductCard;
