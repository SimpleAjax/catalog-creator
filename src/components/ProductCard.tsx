// Product card component for grid display
import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import {Check} from 'lucide-react-native';
import {Product} from '@/types';
import {colors, semantic, typography} from '@/theme';

interface ProductCardProps {
  product: Product;
  onPress?: () => void;
  onLongPress?: () => void;
  selected?: boolean;
  style?: ViewStyle;
  testID?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onPress,
  onLongPress,
  selected = false,
  style,
  testID,
}) => {
  const formatPrice = (price: number | null) => {
    if (price === null) return '';
    return `₹${price}`;
  };

  return (
    <TouchableOpacity
      style={[styles.container, selected && styles.selected, style]}
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.8}
      testID={testID}
      accessibilityLabel={product.name}>
      <View style={styles.imageContainer}>
        <Image source={{uri: product.imageUri}} style={styles.image} />
        {selected && (
          <View style={styles.checkmark}>
            <Check size={16} color={semantic.card} strokeWidth={3} />
          </View>
        )}
        {product.price !== null && (
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
};

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
    resizeMode: 'cover',
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

export default ProductCard;
