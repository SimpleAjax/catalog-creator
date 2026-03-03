// Convert local image URIs to base64 for PDF generation
import { File } from 'expo-file-system';

/**
 * Convert an image URI to base64 string
 * Uses the new expo-file-system File API
 * @param uri - Local image URI
 * @returns Base64 string with data URI prefix
 */
export const imageToBase64 = async (uri: string): Promise<string | null> => {
  try {
    // Check if it's already a data URI
    if (uri.startsWith('data:')) {
      return uri;
    }

    // Check if it's a remote URL
    if (uri.startsWith('http://') || uri.startsWith('https://')) {
      return uri; // Return as-is for remote URLs
    }

    // Convert local file to base64 using the new File API
    // Read as bytes first, then convert to base64
    const file = new File(uri);
    const bytes = await file.bytes();
    
    // Convert Uint8Array to base64
    const base64 = bytesToBase64(bytes);

    // Determine MIME type from extension
    const extension = uri.split('.').pop()?.toLowerCase() || 'jpg';
    const mimeType = extension === 'png' ? 'image/png' : 'image/jpeg';

    return `data:${mimeType};base64,${base64}`;
  } catch (error) {
    console.error('Error converting image to base64:', error);
    return null;
  }
};

/**
 * Convert Uint8Array to base64 string
 * @param bytes - Uint8Array of bytes
 * @returns Base64 encoded string
 */
const bytesToBase64 = (bytes: Uint8Array): string => {
  const binaryString = Array.from(bytes, byte => String.fromCharCode(byte)).join('');
  return btoa(binaryString);
};

/**
 * Convert multiple product images to base64
 * @param products - Array of products with image URIs
 * @returns Products with converted image URIs
 */
export const convertProductImagesToBase64 = async (
  products: {id: string; imageUri: string; name: string}[]
): Promise<{id: string; imageUri: string; name: string}[]> => {
  const convertedProducts = await Promise.all(
    products.map(async product => {
      const base64Uri = await imageToBase64(product.imageUri);
      return {
        ...product,
        imageUri: base64Uri || product.imageUri, // Fallback to original if conversion fails
      };
    })
  );
  return convertedProducts;
};
