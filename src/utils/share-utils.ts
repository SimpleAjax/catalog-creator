// Sharing utilities for catalog export
import * as Sharing from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
import {Platform, Alert} from 'react-native';

/**
 * Check if sharing is available on the device
 * @returns Whether sharing is available
 */
export const isSharingAvailable = async (): Promise<boolean> => {
  return await Sharing.isAvailableAsync();
};

/**
 * Share a file using the native share dialog
 * @param fileUri - URI of the file to share
 * @param mimeType - MIME type of the file
 * @param dialogTitle - Title for the share dialog (Android only)
 * @param message - Optional message to include with the share
 */
export const shareFile = async (
  fileUri: string,
  options: {
    mimeType?: string;
    dialogTitle?: string;
    UTI?: string;
    message?: string;
  } = {},
): Promise<void> => {
  const {mimeType = 'application/pdf', dialogTitle = 'Share Catalog', UTI, message} = options;

  const isAvailable = await isSharingAvailable();
  if (!isAvailable) {
    Alert.alert('Sharing not available', 'Sharing is not available on this device.');
    return;
  }

  try {
    await Sharing.shareAsync(fileUri, {
      mimeType,
      dialogTitle,
      UTI,
    });
  } catch (error) {
    console.error('Error sharing file:', error);
    throw error;
  }
};

/**
 * Share file directly to WhatsApp
 * Note: Direct WhatsApp sharing requires specific intent on Android
 * This opens WhatsApp if installed, otherwise falls back to default share
 * @param fileUri - URI of the file to share
 * @param message - Optional message to include
 */
export const shareToWhatsApp = async (
  fileUri: string,
  message?: string,
): Promise<void> => {
  // For now, we use the general share dialog which will show WhatsApp as an option
  // Direct WhatsApp sharing would require native module integration
  await shareFile(fileUri, {
    mimeType: 'application/pdf',
    dialogTitle: message || 'Share Catalog',
  });
};

/**
 * Share multiple images (for catalog pages)
 * @param imageUris - Array of image URIs to share
 * @param message - Optional message
 */
export const shareMultipleImages = async (
  imageUris: string[],
  message?: string,
): Promise<void> => {
  if (imageUris.length === 0) {
    Alert.alert('No images', 'There are no images to share.');
    return;
  }

  // Share the first image (expo-sharing doesn't support multiple files natively)
  // For multiple images, we would need to use native modules
  await shareFile(imageUris[0], {
    mimeType: 'image/png',
    dialogTitle: message || 'Share Catalog Images',
  });
};

/**
 * Save file to device gallery
 * @param fileUri - URI of the file to save
 * @returns Whether the file was saved successfully
 */
export const saveToGallery = async (fileUri: string): Promise<boolean> => {
  try {
    const {status} = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Please grant permission to save files to your gallery.',
      );
      return false;
    }

    await MediaLibrary.createAssetAsync(fileUri);
    return true;
  } catch (error) {
    console.error('Error saving to gallery:', error);
    return false;
  }
};

/**
 * Share options for different platforms
 */
export const ShareOptions = {
  pdf: {
    mimeType: 'application/pdf',
    UTI: 'com.adobe.pdf',
  },
  image: {
    mimeType: 'image/png',
    UTI: 'public.png',
  },
  jpeg: {
    mimeType: 'image/jpeg',
    UTI: 'public.jpeg',
  },
} as const;

/**
 * Show share success feedback
 */
export const showShareSuccess = (): void => {
  Alert.alert('Success', 'Catalog shared successfully!');
};

/**
 * Show share error feedback
 * @param error - Error message
 */
export const showShareError = (error?: string): void => {
  Alert.alert('Share Failed', error || 'There was a problem sharing the catalog. Please try again.');
};
