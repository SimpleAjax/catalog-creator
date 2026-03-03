// PDF generation utilities for catalog export
import * as Print from 'expo-print';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import {Catalog, Product} from '@/types';
import {getTemplate} from '@/theme/templates';
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
// Sanitize filename for filesystem
const sanitizeFilename = (name: string): string => {
  return name
    .replace(/[^a-zA-Z0-9\u0900-\u097F\s-]/g, '') // Keep alphanumeric, Hindi chars, spaces, hyphens
    .replace(/\s+/g, '_') // Replace spaces with underscores
    .substring(0, 50); // Limit length
};

export const generateCatalogPDF = async (options: PDFOptions): Promise<string> => {
  const {products, catalog} = options;
  
  console.log(`[PDF] Starting generation with ${products.length} products`);
  
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

  // Generate HTML with ALL products using template
  const html = generateCatalogHTMLWithTemplate({
    ...options,
    products: updatedProducts,
  });

  console.log(`[PDF] HTML generated, length: ${html.length}`);

  // Generate PDF with catalog name as filename
  const safeName = sanitizeFilename(catalog.name);
  const fileName = `${safeName}.pdf`;
  
  const {uri} = await Print.printToFileAsync({
    html,
    base64: false,
    // @ts-ignore - fileName is supported but not in types
    fileName: safeName,
  });

  console.log(`[PDF] Generated at: ${uri}`);
  
  // Try to rename the file to use catalog name if the above didn't work
  try {
    const cacheDir = FileSystem.cacheDirectory || `${FileSystem.documentDirectory}cache/`;
    const newUri = `${cacheDir}${fileName}`;
    
    // Check if file already exists at newUri and delete it
    const fileInfo = await FileSystem.getInfoAsync(newUri);
    if (fileInfo.exists) {
      await FileSystem.deleteAsync(newUri);
    }
    
    // Copy file to new location with catalog name
    await FileSystem.copyAsync({
      from: uri,
      to: newUri,
    });
    
    console.log(`[PDF] Renamed to: ${newUri}`);
    return newUri;
  } catch (error) {
    console.log('[PDF] Could not rename file, using original:', error);
    return uri;
  }
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
 * Generate beautiful HTML for catalog PDF using template system
 * @param options - PDF generation options
 * @returns HTML string
 */
const generateCatalogHTMLWithTemplate = (options: PDFOptions): string => {
  const {catalog, products, storeName, includePrices, includeStoreName = true} = options;
  
  // Get template configuration
  const template = getTemplate(catalog.template || 'minimal');
  const colors = template.colors;
  
  const productsPerPage = 4; // 2x2 grid - consistent across templates
  const totalPages = Math.ceil(products.length / productsPerPage);

  // Build all pages
  let pagesHTML = '';
  
  for (let pageNum = 0; pageNum < totalPages; pageNum++) {
    const pageProducts = products.slice(pageNum * productsPerPage, (pageNum + 1) * productsPerPage);
    
    // Build product grid for this page
    let productGridHTML = '<div class="products-grid">';
    
    for (const product of pageProducts) {
      const hasDiscount = product.mrp && product.mrp > (product.price || 0);
      const discountPercent = hasDiscount && product.price 
        ? Math.round(((product.mrp! - product.price) / product.mrp!) * 100)
        : 0;
      
      productGridHTML += `
        <div class="product-card" style="
          background: ${colors.cardBg};
          border-radius: ${template.style.borderRadius}px;
          border: ${template.layout.cardStyle === 'outlined' ? `1px solid ${colors.border}` : 'none'};
        ">
          <div class="product-image-container" style="
            border-radius: ${template.style.imageStyle === 'rounded' 
              ? `${template.style.borderRadius - 4}px ${template.style.borderRadius - 4}px 0 0` 
              : '0'};
          ">
            <img src="${product.imageUri}" class="product-image" onerror="this.style.display='none'" />
          </div>
          <div class="product-info" style="
            background: ${colors.cardBg};
            border-radius: 0 0 ${template.style.borderRadius}px ${template.style.borderRadius}px;
          ">
            <p class="product-name" style="color: ${colors.text};">${escapeHtml(product.name)}</p>
            ${includePrices ? `
              <div class="price-container">
                ${product.price ? `
                  <p class="product-price" style="color: ${colors.price};">
                    ₹${product.price.toLocaleString('en-IN')}
                  </p>
                ` : ''}
                ${hasDiscount ? `
                  <div class="discount-row">
                    <p class="product-mrp" style="color: ${colors.textMuted};">₹${product.mrp!.toLocaleString('en-IN')}</p>
                    <span class="discount-badge" style="background: ${colors.accent}30; color: ${colors.primary};">
                      -${discountPercent}%
                    </span>
                  </div>
                ` : ''}
              </div>
            ` : ''}
          </div>
        </div>
      `;
    }
    
    productGridHTML += '</div>';
    
    // Page header based on template header style
    let headerHTML = '';
    
    if (pageNum === 0) {
      // First page header - COMPACT version to fit all products
      if (template.layout.headerStyle === 'gradient' && colors.gradient) {
        headerHTML = `
          <div class="header" style="
            background: linear-gradient(135deg, ${colors.gradient[0]} 0%, ${colors.gradient[1]} 100%);
            border-radius: 0 0 ${template.style.borderRadius + 4}px ${template.style.borderRadius + 4}px;
            padding: 20px !important;
          ">
            ${includeStoreName && storeName ? `<p class="store-name" style="margin-bottom: 4px !important; font-size: 11px !important;">${escapeHtml(storeName)}</p>` : ''}
            <h1 class="catalog-title" style="font-size: 24px !important;">${escapeHtml(catalog.name)}</h1>
            <p class="catalog-meta" style="margin-top: 4px !important; font-size: 12px !important;">${products.length} Products${totalPages > 1 ? ` • Page ${pageNum + 1} of ${totalPages}` : ''}</p>
          </div>
        `;
      } else if (template.layout.headerStyle === 'minimal') {
        headerHTML = `
          <div class="header-minimal" style="border-bottom: 2px solid ${colors.border}; padding: 16px 0 !important;">
            ${includeStoreName && storeName ? `<p class="store-name-minimal" style="color: ${colors.textMuted}; margin-bottom: 4px !important; font-size: 11px !important;">${escapeHtml(storeName)}</p>` : ''}
            <h1 class="catalog-title-minimal" style="color: ${colors.text}; font-size: 24px !important;">${escapeHtml(catalog.name)}</h1>
            <p class="catalog-meta-minimal" style="color: ${colors.textMuted}; margin-top: 4px !important; font-size: 12px !important;">${products.length} Products</p>
          </div>
        `;
      } else {
        headerHTML = `
          <div class="header" style="
            background: ${colors.primary};
            border-radius: 0 0 ${template.style.borderRadius + 4}px ${template.style.borderRadius + 4}px;
            padding: 20px !important;
          ">
            ${includeStoreName && storeName ? `<p class="store-name" style="margin-bottom: 4px !important; font-size: 11px !important;">${escapeHtml(storeName)}</p>` : ''}
            <h1 class="catalog-title" style="font-size: 24px !important;">${escapeHtml(catalog.name)}</h1>
            <p class="catalog-meta" style="margin-top: 4px !important; font-size: 12px !important;">${products.length} Products${totalPages > 1 ? ` • Page ${pageNum + 1} of ${totalPages}` : ''}</p>
          </div>
        `;
      }
    } else {
      // Simple header for subsequent pages
      headerHTML = `
        <div class="header-simple" style="
          background: ${colors.secondary};
          border-radius: ${template.style.borderRadius}px;
        ">
          <h1 class="catalog-title-simple" style="color: ${colors.text};">${escapeHtml(catalog.name)}</h1>
          <p class="page-number" style="color: ${colors.textMuted};">Page ${pageNum + 1} of ${totalPages}</p>
        </div>
      `;
    }
    
    pagesHTML += `
      <div class="page" style="background: ${colors.background};">
        ${headerHTML}
        ${productGridHTML}
        ${pageNum === totalPages - 1 ? `
          <div class="footer" style="border-top: 1px solid ${colors.border};">
            <p class="footer-text" style="color: ${colors.textMuted};">Created with Catalog Creator</p>
          </div>
        ` : ''}
      </div>
    `;
  }

  // Generate template-specific CSS
  const templateCSS = generateTemplateCSS(template);

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${escapeHtml(catalog.name)}</title>
      <style>
        @page {
          size: A4;
          margin: 0;
        }
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          background-color: ${colors.background};
          color: ${colors.text};
        }
        
        .page {
          page-break-after: always;
          height: 297mm; /* A4 height */
          width: 210mm; /* A4 width */
          padding: 15mm;
          position: relative;
          overflow: hidden;
          box-sizing: border-box;
        }
        
        .page:last-child {
          page-break-after: auto;
        }
        
        ${templateCSS}
        
        .products-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
          height: calc(297mm - 30mm - 80mm); /* Page height - padding - header space */
        }
        
        .product-card {
          overflow: hidden;
          box-shadow: 0 4px 16px ${colors.primary}15;
          page-break-inside: avoid;
          break-inside: avoid;
          display: flex;
          flex-direction: column;
          height: 100%;
        }
        
        .product-image-container {
          height: calc(100% - 80px); /* Card height minus info section */
          overflow: hidden;
          background-color: ${colors.secondary};
        }
        
        .product-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .product-info {
          padding: 16px;
          flex-shrink: 0;
        }
        
        .product-name {
          font-size: 15px;
          font-weight: 600;
          margin-bottom: 8px;
          line-height: 1.3;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .price-container {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        
        .product-price {
          font-size: 20px;
          font-weight: 700;
        }
        
        .discount-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .product-mrp {
          font-size: 13px;
          text-decoration: line-through;
        }
        
        .discount-badge {
          font-size: 11px;
          font-weight: 600;
          padding: 2px 8px;
          border-radius: 12px;
        }
        
        .footer {
          text-align: center;
          padding: 10px 24px;
          position: absolute;
          bottom: 15mm;
          left: 15mm;
          right: 15mm;
        }
        
        .footer-text {
          font-size: 11px;
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
 * Generate template-specific CSS based on template configuration
 */
const generateTemplateCSS = (template: ReturnType<typeof getTemplate>): string => {
  const colors = template.colors;
  
  // Header styles
  const headerStyles = `
    .header {
      padding: 16px 20px;
      text-align: center;
      margin: -15mm -15mm 15px -15mm;
      height: 70mm;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    
    .header-minimal {
      padding: 12px 0;
      text-align: left;
      margin-bottom: 15px;
      height: 50mm;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    
    .header-simple {
      padding: 12px 20px;
      text-align: center;
      margin: -15mm -15mm 15px -15mm;
      height: 50mm;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    
    .store-name {
      font-size: 13px;
      font-weight: 500;
      color: rgba(255, 255, 255, 0.85);
      margin-bottom: 8px;
      text-transform: uppercase;
      letter-spacing: 2px;
    }
    
    .store-name-minimal {
      font-size: 12px;
      font-weight: 500;
      margin-bottom: 8px;
      text-transform: uppercase;
      letter-spacing: 2px;
    }
    
    .catalog-title {
      font-size: 32px;
      font-weight: 700;
      color: #ffffff;
      margin: 0;
    }
    
    .catalog-title-minimal {
      font-size: 28px;
      font-weight: 700;
      margin: 0 0 4px 0;
    }
    
    .catalog-title-simple {
      font-size: 20px;
      font-weight: 600;
      margin: 0;
    }
    
    .catalog-meta {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.75);
      margin-top: 8px;
    }
    
    .catalog-meta-minimal {
      font-size: 13px;
      margin-top: 4px;
    }
    
    .page-number {
      font-size: 12px;
      margin-top: 4px;
    }
  `;
  
  return headerStyles;
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
  productsPerPage: number = 4,
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

    const html = generateCatalogHTMLWithTemplate({
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
