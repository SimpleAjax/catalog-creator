// Image generation utilities for catalog export
// Generates actual PNG images using WebView rendering + capture

import {Catalog, Product} from '@/types';
import {getTemplate} from '@/theme/templates';
import {convertProductImagesToBase64} from './image-to-base64';
import {File, Paths} from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';

export interface ImageExportOptions {
  catalog: Catalog;
  products: Product[];
  columns: 2 | 3;
  includeHeader: boolean;
  includePrices: boolean;
  includeStoreName?: boolean;
  storeName?: string;
}

export interface GeneratedImage {
  uri: string;
  width: number;
  height: number;
  pageNumber: number;
  totalPages: number;
}

// Products per image for different column layouts
const PRODUCTS_PER_IMAGE = {
  2: 4,  // 2x2 grid for 2 columns
  3: 6,  // 2x3 grid for 3 columns
};

// Image dimensions (Instagram story format by default)
const IMAGE_DIMENSIONS = {
  width: 1080,
  height: 1920,
};

/**
 * Generate HTML content for catalog image
 * This HTML will be rendered in a WebView and captured
 * @param options - Image generation options
 * @param pageNumber - Current page number
 * @param totalPages - Total number of pages
 * @returns HTML string
 */
export const generateCatalogImageHTML = (
  options: ImageExportOptions,
  pageNumber: number = 1,
  totalPages: number = 1,
): string => {
  const {catalog, products, columns, includePrices, includeStoreName, storeName} = options;
  
  // Get template configuration
  const template = getTemplate(catalog.template || 'minimal');
  const colors = template.colors;
  
  const productsPerRow = columns;
  const rows = Math.ceil(products.length / productsPerRow);
  const cardWidth = Math.floor((1080 - 80) / productsPerRow);
  const cardGap = 20;

  // Build product grid HTML
  let productGridHTML = '';
  for (let i = 0; i < rows; i++) {
    const rowProducts = products.slice(i * productsPerRow, (i + 1) * productsPerRow);
    
    const cellsHTML = rowProducts
      .map(product => {
        const hasDiscount = product.mrp && product.mrp > (product.price || 0);
        const discountPercent = hasDiscount && product.price 
          ? Math.round(((product.mrp! - product.price) / product.mrp!) * 100)
          : 0;
        
        return `
          <div style="
            width: ${cardWidth}px;
            background: ${colors.cardBg};
            border-radius: ${template.style.borderRadius}px;
            overflow: hidden;
            box-shadow: 0 8px 32px ${colors.primary}20;
            margin: 0 ${cardGap/2}px;
            border: ${template.layout.cardStyle === 'outlined' ? `2px solid ${colors.border}` : 'none'};
          ">
            <div style="
              width: 100%;
              height: ${cardWidth}px;
              background-color: ${colors.secondary};
              overflow: hidden;
            ">
              <img 
                src="${product.imageUri}" 
                style="width: 100%; height: 100%; object-fit: cover;"
                onerror="this.style.display='none'"
              />
            </div>
            <div style="padding: 20px;">
              <p style="
                font-size: 16px;
                font-weight: 600;
                color: ${colors.text};
                margin: 0 0 10px 0;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              ">${escapeHtml(product.name)}</p>
              ${includePrices && product.price ? `
                <p style="
                  font-size: 24px;
                  font-weight: 700;
                  color: ${colors.price};
                  margin: 0 0 6px 0;
                ">₹${product.price.toLocaleString('en-IN')}</p>
              ` : ''}
              ${hasDiscount && includePrices ? `
                <div style="display: flex; align-items: center; gap: 10px;">
                  <p style="
                    font-size: 14px;
                    color: ${colors.textMuted};
                    text-decoration: line-through;
                    margin: 0;
                  ">₹${product.mrp!.toLocaleString('en-IN')}</p>
                  <span style="
                    font-size: 12px;
                    font-weight: 600;
                    padding: 4px 10px;
                    border-radius: 12px;
                    background: ${colors.accent}30;
                    color: ${colors.primary};
                  ">-${discountPercent}%</span>
                </div>
              ` : ''}
            </div>
          </div>
        `;
      })
      .join('');

    productGridHTML += `
      <div style="display: flex; justify-content: center; margin-bottom: ${cardGap}px;">
        ${cellsHTML}
      </div>
    `;
  }

  // Generate header based on template style
  let headerHTML = '';
  
  if (template.layout.headerStyle === 'gradient' && colors.gradient) {
    headerHTML = `
      <div style="
        background: linear-gradient(135deg, ${colors.gradient[0]} 0%, ${colors.gradient[1]} 100%);
        padding: 50px 40px;
        text-align: center;
      ">
        ${includeStoreName && storeName ? `
          <p style="
            font-size: 16px;
            font-weight: 500;
            color: rgba(255, 255, 255, 0.85);
            text-transform: uppercase;
            letter-spacing: 3px;
            margin-bottom: 12px;
          ">${escapeHtml(storeName)}</p>
        ` : ''}
        <h1 style="
          font-size: 42px;
          font-weight: 700;
          color: #ffffff;
          margin: 0;
        ">${escapeHtml(catalog.name)}</h1>
        <p style="
          font-size: 16px;
          color: rgba(255, 255, 255, 0.75);
          margin-top: 12px;
        ">${products.length} Products${totalPages > 1 ? ` • Page ${pageNumber} of ${totalPages}` : ''}</p>
      </div>
    `;
  } else if (template.layout.headerStyle === 'minimal') {
    headerHTML = `
      <div style="
        background: ${colors.background};
        padding: 50px 40px;
        text-align: center;
        border-bottom: 3px solid ${colors.border};
      ">
        ${includeStoreName && storeName ? `
          <p style="
            font-size: 14px;
            font-weight: 500;
            color: ${colors.textMuted};
            text-transform: uppercase;
            letter-spacing: 3px;
            margin-bottom: 12px;
          ">${escapeHtml(storeName)}</p>
        ` : ''}
        <h1 style="
          font-size: 40px;
          font-weight: 700;
          color: ${colors.text};
          margin: 0;
        ">${escapeHtml(catalog.name)}</h1>
        <p style="
          font-size: 16px;
          color: ${colors.textMuted};
          margin-top: 12px;
        ">${products.length} Products${totalPages > 1 ? ` • Page ${pageNumber} of ${totalPages}` : ''}</p>
      </div>
    `;
  } else {
    headerHTML = `
      <div style="
        background: ${colors.primary};
        padding: 50px 40px;
        text-align: center;
        border-radius: 0 0 24px 24px;
        margin-bottom: 30px;
      ">
        ${includeStoreName && storeName ? `
          <p style="
            font-size: 16px;
            font-weight: 500;
            color: rgba(255, 255, 255, 0.85);
            text-transform: uppercase;
            letter-spacing: 3px;
            margin-bottom: 12px;
          ">${escapeHtml(storeName)}</p>
        ` : ''}
        <h1 style="
          font-size: 42px;
          font-weight: 700;
          color: #ffffff;
          margin: 0;
        ">${escapeHtml(catalog.name)}</h1>
        <p style="
          font-size: 16px;
          color: rgba(255, 255, 255, 0.75);
          margin-top: 12px;
        ">${products.length} Products${totalPages > 1 ? ` • Page ${pageNumber} of ${totalPages}` : ''}</p>
      </div>
    `;
  }

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=1080, initial-scale=1.0">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: ${colors.background};
      width: 1080px;
      min-height: 1920px;
    }
  </style>
</head>
<body>
  ${headerHTML}
  
  <div style="padding: 40px;">
    ${productGridHTML}
  </div>
  
  <div style="
    text-align: center;
    padding: 40px;
    margin-top: auto;
    border-top: 2px solid ${colors.border};
  ">
    <p style="font-size: 14px; color: ${colors.textMuted};">Created with Catalog Creator</p>
  </div>
</body>
</html>
  `;
};

/**
 * Generate catalog images and save as PNG files
 * This function prepares the data - actual capture happens in CatalogImageCapture component
 * @param options - Image generation options
 * @returns Array of GeneratedImage objects with metadata
 */
export const generateCatalogImages = async (
  options: ImageExportOptions,
): Promise<GeneratedImage[]> => {
  const {products, columns} = options;
  const productsPerImage = PRODUCTS_PER_IMAGE[columns];
  
  console.log(`[ImageExport] Preparing ${products.length} products for image generation`);
  
  // Convert product images to base64 for reliable rendering
  const productsWithBase64 = await convertProductImagesToBase64(
    products.map(p => ({id: p.id, imageUri: p.imageUri, name: p.name}))
  );
  
  // Update products with base64 images
  const updatedProducts = products.map(product => {
    const converted = productsWithBase64.find(p => p.id === product.id);
    return {...product, imageUri: converted?.imageUri || product.imageUri};
  });
  
  // Split products into pages
  const pages: Product[][] = [];
  for (let i = 0; i < updatedProducts.length; i += productsPerImage) {
    pages.push(updatedProducts.slice(i, i + productsPerImage));
  }
  
  console.log(`[ImageExport] Prepared ${pages.length} page(s) for capture`);
  
  // Generate metadata for each page (actual capture happens in component)
  const images: GeneratedImage[] = pages.map((_, index) => ({
    uri: '', // Will be filled after capture
    width: IMAGE_DIMENSIONS.width,
    height: IMAGE_DIMENSIONS.height,
    pageNumber: index + 1,
    totalPages: pages.length,
  }));
  
  return images;
};

/**
 * Save captured image to file
 * @param base64Data - Base64 image data (without data URI prefix)
 * @param fileName - File name
 * @returns File URI
 */
export const saveCapturedImage = async (
  base64Data: string,
  fileName: string,
): Promise<string> => {
  // Use modern File API
  const file = new File(Paths.cache, fileName);
  await file.parentDirectory.create({idempotent: true});
  
  // Convert base64 to Uint8Array and write
  const binaryString = atob(base64Data);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  await file.write(bytes);
  
  return file.uri;
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
    const {status} = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
      throw new Error('Permission denied');
    }
    
    for (const uri of imageUris) {
      const asset = await MediaLibrary.createAssetAsync(uri);
      savedUris.push(asset.uri);
    }
  } catch (error) {
    console.error('Error saving images to gallery:', error);
    throw error;
  }
  
  return savedUris;
};

/**
 * Share multiple images
 * On Android: Shares all images using ACTION_SEND_MULTIPLE
 * On iOS: Shares one by one or uses a workaround
 * @param imageUris - Array of image URIs to share
 * @param message - Optional message
 */
export const shareMultipleImages = async (
  imageUris: string[],
  message?: string,
): Promise<void> => {
  if (imageUris.length === 0) {
    throw new Error('No images to share');
  }
  
  console.log(`[ImageExport] Sharing ${imageUris.length} image(s)`);
  
  // For multiple images, we need to use the native sharing
  // expo-sharing supports single file only, so we'll:
  // 1. Save all images to gallery first
  // 2. Then share the first one with a message about others
  
  if (imageUris.length === 1) {
    // Single image - share directly
    await Sharing.shareAsync(imageUris[0], {
      mimeType: 'image/png',
      dialogTitle: message || 'Share Catalog Image',
    });
  } else {
    // Multiple images - save to gallery and share first one
    await saveImagesToGallery(imageUris);
    
    // Share the first image
    await Sharing.shareAsync(imageUris[0], {
      mimeType: 'image/png',
      dialogTitle: `${message || 'Share Catalog'} (${imageUris.length} images saved to gallery)`,
    });
  }
};

/**
 * Get export summary for UI display
 * @param productCount - Number of products
 * @param columns - Number of columns
 * @returns Summary object with image count and products per image
 */
export const getExportSummary = (
  productCount: number,
  columns: 2 | 3,
): {
  totalImages: number;
  productsPerImage: number;
  layout: string;
} => {
  const productsPerImage = PRODUCTS_PER_IMAGE[columns];
  const totalImages = Math.ceil(productCount / productsPerImage);
  
  return {
    totalImages,
    productsPerImage,
    layout: columns === 2 ? '2x2 Grid' : '2x3 Grid',
  };
};

/**
 * Escape HTML special characters
 * @param text - Text to escape
 * @returns Escaped text
 */
const escapeHtml = (text: string): string => {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

// Legacy exports for backward compatibility
export {PRODUCTS_PER_IMAGE, IMAGE_DIMENSIONS};
