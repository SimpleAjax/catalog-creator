// PDF generation utilities for catalog export
import * as Print from 'expo-print';
import * as MediaLibrary from 'expo-media-library';
import {Catalog, Product} from '@/types';
import {templateColors} from '@/theme/colors';
import {convertProductImagesToBase64} from './image-to-base64';

export interface PDFOptions {
  catalog: Catalog;
  products: Product[];
  storeName?: string;
  includePrices: boolean;
  includeStoreName?: boolean;
}

/**
 * Generate catalog PDF from HTML template
 * Supports automatic pagination for large catalogs
 * @param options - PDF generation options
 * @returns URI of the generated PDF file
 */
export const generateCatalogPDF = async (options: PDFOptions): Promise<string> => {
  const {products} = options;
  
  console.log(`[PDF] Starting generation with ${products.length} products`);
  console.log(`[PDF] Product names: ${products.map(p => p.name).join(', ')}`);
  
  // Convert ALL product images to base64 for embedding in PDF
  console.log(`[PDF] Converting ${products.length} product images to base64...`);
  const productsWithBase64Images = await convertProductImagesToBase64(
    products.map(p => ({id: p.id, imageUri: p.imageUri, name: p.name}))
  );
  
  // Create updated products array with base64 images
  const updatedProducts = products.map(product => {
    const converted = productsWithBase64Images.find(p => p.id === product.id);
    return {
      ...product,
      imageUri: converted?.imageUri || product.imageUri,
    };
  });

  console.log(`[PDF] All ${updatedProducts.length} products converted, generating HTML...`);

  // Generate HTML with ALL products
  const html = generateCatalogHTMLSimple({
    ...options,
    products: updatedProducts,
  });

  console.log(`[PDF] HTML generated, length: ${html.length}`);
  console.log(`[PDF] Product card count in HTML: ${(html.match(/class="product-card"/g) || []).length}`);

  const {uri} = await Print.printToFileAsync({
    html,
    base64: false,
  });

  console.log(`[PDF] Generated at: ${uri}`);
  return uri;
};

/**
 * Generate and save PDF to device gallery
 * @param options - PDF generation options
 * @returns URI of the saved PDF file
 */
export const exportAndSavePDF = async (options: PDFOptions): Promise<string> => {
  // Generate PDF
  const pdfUri = await generateCatalogPDF(options);

  // Request permissions and save to gallery
  try {
    const {status} = await MediaLibrary.requestPermissionsAsync();
    if (status === 'granted') {
      await MediaLibrary.createAssetAsync(pdfUri);
    }
  } catch (error) {
    // Permission error - PDF is still generated but not saved to gallery
    console.log('Could not save to gallery:', error);
  }

  return pdfUri;
};

/**
 * Generate simple HTML for catalog PDF
 * Uses flexbox layout for better pagination control
 * @param options - PDF generation options
 * @returns HTML string
 */
const generateCatalogHTMLSimple = (options: PDFOptions): string => {
  const {catalog, products, storeName, includePrices, includeStoreName = true} = options;

  const productsPerRow = 2;
  const productsPerPage = 6; // 3 rows x 2 columns
  const totalPages = Math.ceil(products.length / productsPerPage);

  // Build all pages
  let pagesHTML = '';
  
  for (let pageNum = 0; pageNum < totalPages; pageNum++) {
    const pageProducts = products.slice(pageNum * productsPerPage, (pageNum + 1) * productsPerPage);
    
    // Build product grid for this page using flexbox
    let productGridHTML = '<div class="products-grid">';
    
    for (const product of pageProducts) {
      productGridHTML += `
        <div class="product-card">
          <div class="product-image-container">
            <img src="${product.imageUri}" class="product-image" onerror="this.style.display='none'" />
          </div>
          <div class="product-info">
            <p class="product-name">${escapeHtml(product.name)}</p>
            ${includePrices && product.price ? `<p class="product-price">₹${product.price.toLocaleString('en-IN')}</p>` : ''}
            ${product.mrp && product.mrp > (product.price || 0) && includePrices ? `<p class="product-mrp">MRP: ₹${product.mrp.toLocaleString('en-IN')}</p>` : ''}
          </div>
        </div>
      `;
    }
    
    productGridHTML += '</div>';
    
    // Page header
    const headerHTML = pageNum === 0
      ? `
        <div class="header">
          ${includeStoreName && storeName ? `<p class="store-name">${escapeHtml(storeName)}</p>` : ''}
          <h1 class="catalog-title">${escapeHtml(catalog.name)}</h1>
          <p class="catalog-meta">${products.length} Products${totalPages > 1 ? ` • Page ${pageNum + 1} of ${totalPages}` : ''}</p>
        </div>
      `
      : `
        <div class="header-simple">
          <h1 class="catalog-title-simple">${escapeHtml(catalog.name)}</h1>
          <p class="page-number">Page ${pageNum + 1} of ${totalPages}</p>
        </div>
      `;
    
    pagesHTML += `
      <div class="page">
        ${headerHTML}
        ${productGridHTML}
        ${pageNum === totalPages - 1 ? `
          <div class="footer">
            <p class="footer-text">Created with Catalog Creator</p>
          </div>
        ` : ''}
      </div>
    `;
  }

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${escapeHtml(catalog.name)}</title>
      <style>
        @page {
          size: A4;
          margin: 15px;
        }
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          background-color: #ffffff;
          color: #333;
        }
        
        .page {
          page-break-after: always;
          min-height: 100vh;
          padding: 20px;
          position: relative;
        }
        
        .page:last-child {
          page-break-after: auto;
        }
        
        .header {
          background: linear-gradient(135deg, ${catalog.primaryColor} 0%, ${catalog.secondaryColor} 100%);
          padding: 30px 20px;
          text-align: center;
          border-radius: 0 0 20px 20px;
          margin-bottom: 20px;
        }
        
        .header-simple {
          background: ${catalog.primaryColor};
          padding: 15px 20px;
          text-align: center;
          border-radius: 12px;
          margin-bottom: 20px;
        }
        
        .store-name {
          font-size: 14px;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.9);
          margin-bottom: 6px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        
        .catalog-title {
          font-size: 28px;
          font-weight: 700;
          color: #ffffff;
          margin: 0;
        }
        
        .catalog-title-simple {
          font-size: 20px;
          font-weight: 700;
          color: #ffffff;
          margin: 0;
        }
        
        .catalog-meta {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.8);
          margin-top: 6px;
        }
        
        .page-number {
          font-size: 11px;
          color: rgba(255, 255, 255, 0.7);
          margin-top: 4px;
        }
        
        .products-grid {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          gap: 15px;
        }
        
        .product-card {
          width: calc(50% - 8px);
          background: #ffffff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
          border: 1px solid #e5e7eb;
          page-break-inside: avoid;
          break-inside: avoid;
          margin-bottom: 15px;
        }
        
        .product-image-container {
          width: 100%;
          height: 200px;
          overflow: hidden;
          background-color: #f3f4f6;
        }
        
        .product-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .product-info {
          padding: 12px;
        }
        
        .product-name {
          font-size: 14px;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 6px;
          line-height: 1.3;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .product-price {
          font-size: 18px;
          font-weight: 700;
          color: ${catalog.primaryColor};
        }
        
        .product-mrp {
          font-size: 12px;
          color: #9ca3af;
          text-decoration: line-through;
          margin-top: 2px;
        }
        
        .footer {
          text-align: center;
          padding: 20px;
          margin-top: 20px;
          border-top: 1px solid #e5e7eb;
          position: absolute;
          bottom: 0;
          left: 20px;
          right: 20px;
        }
        
        .footer-text {
          font-size: 11px;
          color: #9ca3af;
        }
      </style>
    </head>
    <body>
      ${pagesHTML}
    </body>
    </html>
  `;
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
 * Generate multiple separate PDFs (one per page of products)
 * Useful when you want to share individual pages
 * @param options - PDF generation options
 * @param productsPerPage - Number of products per PDF
 * @returns Array of PDF URIs (one per page)
 */
export const generateMultiPagePDFs = async (
  options: PDFOptions,
  productsPerPage: number = 6,
): Promise<string[]> => {
  const {products} = options;
  const pages: string[] = [];

  for (let i = 0; i < products.length; i += productsPerPage) {
    const pageProducts = products.slice(i, i + productsPerPage);
    
    // Convert images for this page
    const productsWithBase64Images = await convertProductImagesToBase64(
      pageProducts.map(p => ({id: p.id, imageUri: p.imageUri, name: p.name}))
    );
    
    const updatedProducts = pageProducts.map(product => {
      const converted = productsWithBase64Images.find(p => p.id === product.id);
      return {
        ...product,
        imageUri: converted?.imageUri || product.imageUri,
      };
    });

    const html = generateCatalogHTMLSimple({
      ...options,
      products: updatedProducts,
    });

    const {uri} = await Print.printToFileAsync({
      html,
      base64: false,
    });

    pages.push(uri);
  }

  return pages;
};
