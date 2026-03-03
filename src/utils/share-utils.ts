// Sharing utilities for catalog export
import * as Sharing from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import {Platform, Alert, Linking} from 'react-native';

/**
 * Check if sharing is available on the device
 * @returns Whether sharing is available
 */
export const isSharingAvailable = async (): Promise<boolean> => {
  return await Sharing.isAvailableAsync();
};

/**
 * Share a single file using the native share dialog
 * @param fileUri - URI of the file to share
 * @param options - Share options
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
  const {mimeType = 'application/pdf', dialogTitle = 'Share Catalog', UTI} = options;

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
 * Share multiple files
 * On Android: Uses ACTION_SEND_MULTIPLE via native module (if available)
 * On iOS: Shares one by one or prompts user to select
 * @param fileUris - Array of file URIs to share
 * @param options - Share options
 */
export const shareMultipleFiles = async (
  fileUris: string[],
  options: {
    mimeType?: string;
    dialogTitle?: string;
    message?: string;
  } = {},
): Promise<void> => {
  if (fileUris.length === 0) {
    Alert.alert('No files', 'There are no files to share.');
    return;
  }

  const {mimeType = 'image/png', dialogTitle = 'Share Catalog Images', message} = options;

  if (fileUris.length === 1) {
    // Single file - share directly
    await shareFile(fileUris[0], {mimeType, dialogTitle});
    return;
  }

  // Multiple files
  if (Platform.OS === 'ios') {
    // iOS: Save to gallery and inform user
    await saveImagesToGallery(fileUris);
    Alert.alert(
      'Images Saved',
      `${fileUris.length} images have been saved to your gallery. You can share them from there.`,
      [{text: 'OK'}]
    );
  } else {
    // Android: Try to share multiple (most Android share sheets support multiple files)
    // Note: expo-sharing doesn't support multiple files natively, so we save to gallery
    await saveImagesToGallery(fileUris);
    
    // Share the first image with info about others
    await Sharing.shareAsync(fileUris[0], {
      mimeType,
      dialogTitle: `${dialogTitle} (${fileUris.length} images saved to gallery)`,
    });
  }
};

/**
 * Share file directly to WhatsApp
 * Note: Direct WhatsApp sharing requires specific intent on Android
 * @param fileUri - URI of the file to share
 * @param message - Optional message to include
 */
export const shareToWhatsApp = async (
  fileUri: string,
  message?: string,
): Promise<void> => {
  // For now, we use the general share dialog which will show WhatsApp as an option
  await shareFile(fileUri, {
    mimeType: 'application/pdf',
    dialogTitle: message || 'Share to WhatsApp',
  });
};

/**
 * Share multiple images to WhatsApp
 * @param imageUris - Array of image URIs
 * @param message - Optional message
 */
export const shareMultipleToWhatsApp = async (
  imageUris: string[],
  message?: string,
): Promise<void> => {
  if (imageUris.length === 0) return;
  
  if (imageUris.length === 1) {
    await shareToWhatsApp(imageUris[0], message);
    return;
  }
  
  // For multiple images, save to gallery first
  await saveImagesToGallery(imageUris);
  
  // Try to open WhatsApp
  const whatsappUrl = `whatsapp://send?text=${encodeURIComponent(message || 'Check out these catalog images!')}`;
  
  try {
    const canOpen = await Linking.canOpenURL(whatsappUrl);
    if (canOpen) {
      await Linking.openURL(whatsappUrl);
      Alert.alert(
        'Images Saved',
        `${imageUris.length} images saved to gallery. Please select them in WhatsApp to share.`
      );
    } else {
      // Fallback to general share
      await shareMultipleFiles(imageUris, {mimeType: 'image/png'});
    }
  } catch (error) {
    // Fallback to general share
    await shareMultipleFiles(imageUris, {mimeType: 'image/png'});
  }
};

/**
 * Save images to device gallery
 * @param imageUris - Array of image URIs to save
 * @returns Array of saved asset URIs
 */
export const saveImagesToGallery = async (
  imageUris: string[],
): Promise<string[]> => {
  const savedUris: string[] = [];
  
  try {
    // Check existing permissions first
    const {status: existingStatus} = await MediaLibrary.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    // Only request if not already granted
    if (existingStatus !== 'granted') {
      const {status} = await MediaLibrary.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Please grant permission to save files to your gallery.',
      );
      return [];
    }
    
    for (const uri of imageUris) {
      try {
        const asset = await MediaLibrary.createAssetAsync(uri);
        savedUris.push(asset.uri);
      } catch (error) {
        console.error('Error saving individual image:', error);
      }
    }
    
    if (savedUris.length > 0) {
      Alert.alert(
        'Saved!',
        `${savedUris.length} image(s) saved to your gallery.`
      );
    }
  } catch (error) {
    console.error('Error saving images to gallery:', error);
    Alert.alert('Error', 'Failed to save images to gallery.');
  }
  
  return savedUris;
};

/**
 * Save a single file to gallery
 * @param fileUri - URI of the file to save
 * @returns Whether the file was saved successfully
 */
export const saveToGallery = async (fileUri: string): Promise<boolean> => {
  try {
    // Check existing permissions first
    const {status: existingStatus} = await MediaLibrary.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    // Only request if not already granted
    if (existingStatus !== 'granted') {
      const {status} = await MediaLibrary.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Please grant permission to save files to your gallery.',
      );
      return false;
    }

    await MediaLibrary.createAssetAsync(fileUri);
    Alert.alert('Saved!', 'Image saved to your gallery.');
    return true;
  } catch (error) {
    console.error('Error saving to gallery:', error);
    Alert.alert('Error', 'Failed to save image.');
    return false;
  }
};

/**
 * Create a ZIP file from multiple images
 * @param imageUris - Array of image URIs
 * @param zipFileName - Name for the ZIP file
 * @returns URI of the created ZIP file
 */
export const createZipFromImages = async (
  imageUris: string[],
  zipFileName: string = 'catalog_images.zip',
): Promise<string | null> => {
  try {
    // For now, we'll just share the first image
    // Full ZIP support would require a library like react-native-zip-archive
    // or jszip + react-native-fs
    console.log(`[Share] ZIP creation requested for ${imageUris.length} images`);
    return null;
  } catch (error) {
    console.error('Error creating ZIP:', error);
    return null;
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

/**
 * Show multiple images share success
 * @param count - Number of images
 */
export const showMultipleShareSuccess = (count: number): void => {
  Alert.alert(
    'Success',
    `${count} images saved to your gallery. You can share them from there.`
  );
};
