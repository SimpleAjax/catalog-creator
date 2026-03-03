// Lazy loading image component with placeholder
import React, {useState, useCallback} from 'react';
import {Image, View, ActivityIndicator, StyleSheet, Animated} from 'react-native';
import {semantic} from '@/theme';

interface LazyImageProps {
  uri: string;
  thumbnailUri?: string;
  style?: any;
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'center';
  onLoad?: () => void;
  onError?: () => void;
}

export const LazyImage: React.FC<LazyImageProps> = ({
  uri,
  thumbnailUri,
  style,
  resizeMode = 'cover',
  onLoad,
  onError,
}) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];

  const handleLoad = useCallback(() => {
    setLoaded(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
    onLoad?.();
  }, [fadeAnim, onLoad]);

  const handleError = useCallback(() => {
    setError(true);
    onError?.();
  }, [onError]);

  return (
    <View style={[styles.container, style]}>
      {/* Thumbnail placeholder */}
      {thumbnailUri && !loaded && !error && (
        <Image
          source={{uri: thumbnailUri}}
          style={[styles.image, styles.thumbnail]}
          resizeMode={resizeMode}
          blurRadius={2}
        />
      )}

      {/* Main image with fade-in */}
      <Animated.Image
        source={{uri}}
        style={[
          styles.image,
          {opacity: fadeAnim},
        ]}
        resizeMode={resizeMode}
        onLoad={handleLoad}
        onError={handleError}
      />

      {/* Loading indicator */}
      {!loaded && !error && (
        <View style={styles.overlay}>
          <ActivityIndicator size="small" color={semantic.primary} />
        </View>
      )}

      {/* Error state */}
      {error && (
        <View style={[styles.overlay, styles.errorOverlay]}>
          <View style={styles.errorBox} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    backgroundColor: semantic.border,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  thumbnail: {
    opacity: 0.5,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: semantic.border,
  },
  errorOverlay: {
    backgroundColor: semantic.primaryLight,
  },
  errorBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: semantic.primary,
    opacity: 0.3,
  },
});

export default LazyImage;
