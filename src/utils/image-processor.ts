// Image processing utilities for performance optimization

// Note: expo-image-manipulator would be added for actual image processing
// For now, we'll create the structure and mock functions

export interface ProcessedImage {
  originalUri: string;
  thumbnailUri: string;
  width: number;
  height: number;
  sizeInBytes: number;
}

/**
 * Generate thumbnail from image URI
 * In production, this would use expo-image-manipulator
 * @param uri - Original image URI
 * @param size - Thumbnail size (width/height)
 * @returns Thumbnail URI
 */
export const generateThumbnail = async (
  uri: string,
  size: number = 300,
): Promise<string> => {
  // In production with expo-image-manipulator:
  // const manipulated = await ImageManipulator.manipulateAsync(
  //   uri,
  //   [{resize: {width: size, height: size}}],
  //   {compress: 0.8, format: ImageManipulator.SaveFormat.JPEG}
  // );
  // return manipulated.uri;

  // For now, return the original URI as thumbnail placeholder
  // This would be replaced with actual thumbnail generation
  return `${uri}?thumb=${size}`;
};

/**
 * Process product image - generate thumbnail and get metadata
 * @param uri - Original image URI
 * @returns Processed image with original and thumbnail URIs
 */
export const processProductImage = async (uri: string): Promise<ProcessedImage> => {
  const thumbnailUri = await generateThumbnail(uri, 300);

  return {
    originalUri: uri,
    thumbnailUri,
    width: 0,
    height: 0,
    sizeInBytes: 0,
  };
};

/**
 * Preload images for smoother scrolling
 * @param uris - Array of image URIs to preload
 */
export const preloadImages = async (uris: string[]): Promise<void> => {
  // In production with expo-image-manipulator or Image.prefetch:
  // await Promise.all(uris.map(uri => Image.prefetch(uri)));

  // Simulate preloading
  await new Promise(resolve => setTimeout(resolve, 10));
};

/**
 * Calculate optimal image dimensions for display
 * @param originalWidth - Original image width
 * @param originalHeight - Original image height
 * @param maxWidth - Maximum display width
 * @param maxHeight - Maximum display height
 * @returns Optimal dimensions
 */
export const calculateOptimalDimensions = (
  originalWidth: number,
  originalHeight: number,
  maxWidth: number,
  maxHeight: number,
): {width: number; height: number} => {
  const aspectRatio = originalWidth / originalHeight;

  let width = maxWidth;
  let height = maxWidth / aspectRatio;

  if (height > maxHeight) {
    height = maxHeight;
    width = maxHeight * aspectRatio;
  }

  return {
    width: Math.round(width),
    height: Math.round(height),
  };
};

/**
 * Chunk array for batch processing
 * @param array - Array to chunk
 * @param size - Chunk size
 * @returns Chunked array
 */
export const chunkArray = <T>(array: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

/**
 * Process images in batches to avoid blocking UI
 * @param uris - Array of image URIs
 * @param batchSize - Number of images to process at once
 * @param onProgress - Callback for progress updates
 * @returns Array of processed images
 */
export const processImagesInBatches = async (
  uris: string[],
  batchSize: number = 5,
  onProgress?: (progress: number) => void,
): Promise<ProcessedImage[]> => {
  const results: ProcessedImage[] = [];
  const chunks = chunkArray(uris, batchSize);

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    const processed = await Promise.all(chunk.map(uri => processProductImage(uri)));
    results.push(...processed);

    if (onProgress) {
      onProgress((i + 1) / chunks.length);
    }

    // Yield to main thread
    await new Promise(resolve => setTimeout(resolve, 0));
  }

  return results;
};

/**
 * Clear image cache
 * In production, this would clear react-native's image cache
 */
export const clearImageCache = async (): Promise<void> => {
  // In production:
  // await Image.clearMemoryCache();
  // await Image.clearDiskCache();
};

/**
 * Estimate image file size from dimensions
 * @param width - Image width
 * @param height - Image height
 * @param quality - Image quality (0-1)
 * @returns Estimated size in bytes
 */
export const estimateImageSize = (
  width: number,
  height: number,
  quality: number = 0.8,
): number => {
  // Rough estimate: width * height * 4 bytes per pixel * compression factor
  const uncompressedSize = width * height * 4;
  return Math.round(uncompressedSize * quality * 0.3); // JPEG compression factor
};
