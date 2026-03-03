// Image generation utilities for catalog export
// Uses HTML + WebView rendering approach for consistent output

import {Catalog, Product} from '@/types';
import {templateColors} from '@/theme/colors';
import {convertProductImagesToBase64} from './image-to-base64';
import {captureRef} from 'react-native-view-shot';
import {View} from 'react-native';
import React from 'react';
import {File, Directory, EncodingType} from 'expo-file-system';

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
 * Generate catalog as image grid
 * For many products, this generates multiple images (one per page)
 * 
 * Note: This creates HTML files that can be rendered in a WebView and captured.
 * To get actual PNG images, use react-native-view-shot to capture the rendered HTML.
 * 
 * @param options - Image generation options
 * @returns Array of generated HTML file URIs
 */
export const generateCatalogImages = async (
  options: ImageExportOptions,
): Promise<string[]> => {
  const {products, columns} = options;
  const productsPerImage = PRODUCTS_PER_IMAGE[columns];
  
  console.log(`[ImageExport] Starting with ${products.length} products, ${columns} columns`);
  console.log(`[ImageExport] Products per image: ${productsPerImage}`);
  
  // Split products into pages
  const pages: Product[][] = [];
  for (let i = 0; i < products.length; i += productsPerImage) {
    pages.push(products.slice(i, i + productsPerImage));
  }
  
  console.log(`[ImageExport] Will create ${pages.length} image(s)`);
  
  // Generate image for each page
  const fileUris: string[] = [];
  
  for (let i = 0; i < pages.length; i++) {
    const fileUri = await generateSingleCatalogImage({
      ...options,
      products: pages[i],
    }, i + 1, pages.length);
    
    if (fileUri) {
      fileUris.push(fileUri);
    }
  }
  
  console.log(`[ImageExport] Generated ${fileUris.length} file(s)`);
  return fileUris;
};

/**
 * Generate a single catalog HTML file
 * 
 * This creates an HTML file that can be:
 * 1. Rendered in a WebView
 * 2. Captured using react-native-view-shot
 * 3. Shared or saved
 * 
 * @param options - Image generation options
 * @param pageNumber - Current page number
 * @param totalPages - Total number of pages
 * @returns HTML file URI or null if generation failed
 */
const generateSingleCatalogImage = async (
  options: ImageExportOptions,
  pageNumber: number,
  totalPages: number,
): Promise<string | null> => {
  const {catalog, products, columns, includeHeader, includePrices, includeStoreName, storeName} = options;

  try {
    // Convert product images to base64 for reliable rendering
    console.log(`[ImageExport] Page ${pageNumber}: Converting ${products.length} images...`);
    const productsWithBase64Images = await convertProductImagesToBase64(
      products.map(p => ({id: p.id, imageUri: p.imageUri, name: p.name}))
    );
    
    const updatedProducts = products.map(product => {
      const converted = productsWithBase64Images.find(p => p.id === product.id);
      return {
        ...product,
        imageUri: converted?.imageUri || product.imageUri,
      };
    });

    // Generate HTML for this image page
    const html = generateImageHTML({
      catalog,
      products: updatedProducts,
      columns,
      includeHeader,
      includePrices,
      includeStoreName,
      storeName,
      pageNumber,
      totalPages,
    });

    // Save HTML to a file in the cache directory
    const fileName = `catalog_${catalog.id}_page${pageNumber}_${Date.now()}.html`;
    const cacheDir = new Directory('cache');
    
    // Ensure cache directory exists
    if (!(await cacheDir.exists())) {
      await cacheDir.create();
    }
    
    const file = new File(cacheDir.uri + '/' + fileName);
    await file.write(html, { encoding: 'utf8' });
    
    console.log(`[ImageExport] Page ${pageNumber}: Saved HTML to ${file.uri}`);
    
    return file.uri;
    
  } catch (error) {
    console.error(`[ImageExport] Error generating page ${pageNumber}:`, error);
    return null;
  }
};

/**
 * Generate a single catalog image (legacy function for backward compatibility)
 * @deprecated Use generateCatalogImages for proper pagination support
 */
export const generateCatalogImage = async (
  options: ImageExportOptions,
): Promise<string> => {
  const fileUris = await generateCatalogImages(options);
  return fileUris[0] || '';
};

/**
 * Capture a view as an image
 * Use this in your React component to capture the rendered catalog
 * 
 * @param viewRef - Reference to the view to capture
 * @param options - Capture options
 * @returns URI of the captured image
 */
export const captureCatalogImage = async (
  viewRef: React.RefObject<View>,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'png' | 'jpg' | 'webm';
  } = {}
): Promise<string | null> => {
  try {
    const uri = await captureRef(viewRef, {
      width: options.width || IMAGE_DIMENSIONS.width,
      height: options.height || IMAGE_DIMENSIONS.height,
      quality: options.quality || 0.9,
      format: options.format || 'png',
    });
    return uri;
  } catch (error) {
    console.error('Error capturing image:', error);
    return null;
  }
};

/**
 * Generate HTML for image rendering
 * This HTML can be rendered in a WebView and captured as an image
 */
const generateImageHTML = (options: {
  catalog: Catalog;
  products: Product[];
  columns: 2 | 3;
  includeHeader: boolean;
  includePrices: boolean;
  includeStoreName?: boolean;
  storeName?: string;
  pageNumber: number;
  totalPages: number;
}): string => {
  const {catalog, products, columns, includePrices, includeStoreName, storeName, pageNumber, totalPages} = options;
  
  const productsPerRow = columns;
  const rows = Math.ceil(products.length / productsPerRow);
  const cardWidth = Math.floor((1080 - 60) / productsPerRow);
  
  // Build product grid HTML
  let productGridHTML = '';
  for (let i = 0; i < rows; i++) {
    const rowProducts = products.slice(i * productsPerRow, (i + 1) * productsPerRow);
    const cellsHTML = rowProducts
      .map(product => `
        <div style="
          width: ${cardWidth}px;
          background: #ffffff;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          margin: 8px;
        ">
          <div style="
            width: 100%;
            height: ${cardWidth}px;
            background-color: #f3f4f6;
            overflow: hidden;
          ">
            <img 
              src="${product.imageUri}" 
              style="width: 100%; height: 100%; object-fit: cover;"
              onerror="this.style.display='none'"
            />
          </div>
          <div style="padding: 12px;">
            <p style="
              font-size: 14px;
              font-weight: 600;
              color: #1f2937;
              margin: 0 0 4px 0;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            ">${escapeHtml(product.name)}</p>
            ${includePrices && product.price ? `
              <p style="
                font-size: 18px;
                font-weight: 700;
                color: ${catalog.primaryColor};
                margin: 0;
              ">₹${product.price.toLocaleString('en-IN')}</p>
            ` : ''}
            ${product.mrp && product.mrp > (product.price || 0) && includePrices ? `
              <p style="
                font-size: 12px;
                color: #9ca3af;
                text-decoration: line-through;
                margin: 2px 0 0 0;
              ">MRP: ₹${product.mrp.toLocaleString('en-IN')}</p>
            ` : ''}
          </div>
        </div>
      `)
      .join('');

    productGridHTML += `
      <div style="display: flex; justify-content: center; margin-bottom: 16px;">
        ${cellsHTML}
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
      background: #ffffff;
      width: 1080px;
      min-height: 1920px;
    }
  </style>
</head>
<body>
  ${includeStoreName && storeName ? `
    <div style="
      background: ${catalog.primaryColor};
      padding: 30px;
      text-align: center;
    ">
      <p style="
        font-size: 14px;
        font-weight: 500;
        color: rgba(255, 255, 255, 0.9);
        text-transform: uppercase;
        letter-spacing: 1px;
        margin-bottom: 8px;
      ">${escapeHtml(storeName)}</p>
      <h1 style="
        font-size: 32px;
        font-weight: 700;
        color: #ffffff;
        margin: 0;
      ">${escapeHtml(catalog.name)}</h1>
      <p style="
        font-size: 14px;
        color: rgba(255, 255, 255, 0.8);
        margin-top: 8px;
      ">${products.length} Products${totalPages > 1 ? ` • Page ${pageNumber} of ${totalPages}` : ''}</p>
    </div>
  ` : `
    <div style="
      background: ${catalog.primaryColor};
      padding: 30px;
      text-align: center;
      border-radius: 0 0 24px 24px;
      margin-bottom: 30px;
    ">
      <h1 style="
        font-size: 32px;
        font-weight: 700;
        color: #ffffff;
        margin: 0;
      ">${escapeHtml(catalog.name)}</h1>
      <p style="
        font-size: 14px;
        color: rgba(255, 255, 255, 0.8);
        margin-top: 8px;
      ">${products.length} Products${totalPages > 1 ? ` • Page ${pageNumber} of ${totalPages}` : ''}</p>
    </div>
  `}
  
  <div style="padding: 20px;">
    ${productGridHTML}
  </div>
  
  <div style="
    text-align: center;
    padding: 30px;
    margin-top: auto;
    border-top: 1px solid #e5e7eb;
  ">
    <p style="font-size: 12px; color: #9ca3af;">Created with Catalog Creator</p>
  </div>
</body>
</html>
  `;
};

/**
 * Get optimal dimensions for catalog image based on column count and product count
 * @param columns - Number of columns (2 or 3)
 * @param productCount - Number of products on this page
 * @returns Width and height for the image
 */
export const getCatalogImageDimensions = (
  columns: 2 | 3,
  productCount: number = PRODUCTS_PER_IMAGE[columns]
): {width: number; height: number} => {
  const baseWidth = IMAGE_DIMENSIONS.width;
  const baseHeight = IMAGE_DIMENSIONS.height;
  
  const productsPerImage = PRODUCTS_PER_IMAGE[columns];
  const ratio = Math.min(productCount / productsPerImage, 1);
  const minHeight = baseHeight * 0.6;
  
  return {
    width: baseWidth,
    height: Math.max(minHeight, baseHeight * ratio),
  };
};

/**
 * Calculate grid layout for products
 * @param productCount - Number of products
 * @param columns - Number of columns
 * @returns Grid dimensions
 */
export const calculateGridLayout = (
  productCount: number,
  columns: 2 | 3,
): {rows: number; totalCells: number; emptyCells: number} => {
  const rows = Math.ceil(productCount / columns);
  const totalCells = rows * columns;
  const emptyCells = totalCells - productCount;
  
  return {rows, totalCells, emptyCells};
};

/**
 * Get template styles for image export
 * @param template - Template type
 * @returns Style configuration
 */
export const getTemplateStyles = (template: string) => {
  const colors = templateColors[template as keyof typeof templateColors] || templateColors.minimal;
  
  return {
    headerBackground: colors.primary,
    headerText: '#ffffff',
    cardBackground: '#ffffff',
    priceColor: colors.primary,
    textColor: '#1f2937',
    borderColor: '#e5e7eb',
  };
};

/**
 * Prepare products for image export
 * Groups products into pages and formats data
 * @param products - Array of products
 * @param columns - Number of columns
 * @param maxProductsPerPage - Maximum products per page (defaults based on columns)
 * @returns Array of product pages
 */
export const prepareProductsForExport = (
  products: Product[],
  columns: 2 | 3,
  maxProductsPerPage?: number,
): Product[][] => {
  const maxPerPage = maxProductsPerPage || PRODUCTS_PER_IMAGE[columns];
  const pages: Product[][] = [];
  
  for (let i = 0; i < products.length; i += maxPerPage) {
    pages.push(products.slice(i, i + maxPerPage));
  }
  
  return pages;
};

/**
 * Export progress callback type
 */
export type ExportProgressCallback = (progress: number, total: number, currentImage?: GeneratedImage) => void;

/**
 * Generate catalog images with progress tracking
 * @param options - Image generation options
 * @param onProgress - Progress callback
 * @returns Array of generated image URIs
 */
export const generateCatalogImagesWithProgress = async (
  options: ImageExportOptions,
  onProgress?: ExportProgressCallback,
): Promise<GeneratedImage[]> => {
  const {products, columns} = options;
  const pages = prepareProductsForExport(products, columns);
  const images: GeneratedImage[] = [];
  
  for (let i = 0; i < pages.length; i++) {
    const fileUri = await generateSingleCatalogImage({
      ...options,
      products: pages[i],
    }, i + 1, pages.length);
    
    if (fileUri) {
      const image: GeneratedImage = {
        uri: fileUri,
        width: IMAGE_DIMENSIONS.width,
        height: IMAGE_DIMENSIONS.height,
        pageNumber: i + 1,
        totalPages: pages.length,
      };
      images.push(image);
      
      if (onProgress) {
        onProgress(i + 1, pages.length, image);
      }
    }
  }
  
  return images;
};

/**
 * Calculate how many images will be generated for a given product count
 * @param productCount - Number of products
 * @param columns - Number of columns
 * @returns Number of images that will be generated
 */
export const calculateImageCount = (
  productCount: number,
  columns: 2 | 3,
): number => {
  const productsPerImage = PRODUCTS_PER_IMAGE[columns];
  return Math.ceil(productCount / productsPerImage);
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

/**
 * Share multiple images
 * Note: This shares HTML files that can be opened in a browser
 * @param fileUris - Array of file URIs to share
 * @param message - Optional message
 */
export const shareMultipleImages = async (
  fileUris: string[],
  message?: string,
): Promise<void> => {
  if (fileUris.length === 0) {
    throw new Error('No files to share');
  }
  
  console.log(`[ImageExport] Sharing ${fileUris.length} HTML file(s)`);
  
  const {shareFile} = await import('./share-utils');
  
  // Share the first file with text/html mime type
  await shareFile(fileUris[0], {
    mimeType: 'text/html',
    dialogTitle: message || 'Share Catalog',
  });
};
