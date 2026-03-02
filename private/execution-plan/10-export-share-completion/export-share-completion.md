# Phase 10: Export & Share Feature Completion

## Overview
Complete the export and sharing functionality: PDF generation, image export, and WhatsApp sharing. These are critical features for the app's core value proposition.

## Acceptance Criteria
- [ ] Export catalog as PDF (high quality)
- [ ] Export catalog as image grid (for WhatsApp/Instagram)
- [ ] Share directly to WhatsApp via Android share intent
- [ ] Save exported files to device gallery
- [ ] Preview before export

## Current State
- Basic structure exists but export functions are likely stubs
- Catalog preview screen exists
- Share buttons present but may not be functional

## Execution Steps

### Phase 10.1: PDF Export

#### Step 1: Install Dependencies
```bash
npm install expo-print
# OR
npm install react-native-html-to-pdf
```

#### Step 2: Create PDF Generator
```typescript
// src/utils/pdf-generator.ts
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import {Catalog, Product} from '@/types';
import {TemplateType} from '@/constants/templates';

interface PDFOptions {
  catalog: Catalog;
  products: Product[];
  template: TemplateType;
  storeName?: string;
  includePrices: boolean;
}

export const generateCatalogPDF = async ({
  catalog,
  products,
  template,
  storeName,
  includePrices,
}: PDFOptions): Promise<string> => {
  const html = generateCatalogHTML({
    catalog,
    products,
    template,
    storeName,
    includePrices,
  });
  
  const {uri} = await Print.printToFileAsync({
    html,
    base64: false,
  });
  
  return uri;
};

const generateCatalogHTML = (options: PDFOptions): string => {
  const {catalog, products, template, storeName, includePrices} = options;
  
  const productGrid = products.map(product => `
    <div class="product-card">
      <img src="${product.imageUri}" />
      ${includePrices && product.price ? `<p class="price">₹${product.price}</p>` : ''}
      <p class="name">${product.name}</p>
    </div>
  `).join('');
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: system-ui; margin: 0; padding: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .header h1 { color: ${template.colors.primary}; }
        .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
        .product-card { border-radius: 12px; overflow: hidden; }
        .product-card img { width: 100%; aspect-ratio: 1; object-fit: cover; }
        .price { font-weight: bold; color: ${template.colors.primary}; }
        .name { margin: 8px 0; }
      </style>
    </head>
    <body>
      <div class="header">
        ${storeName ? `<h2>${storeName}</h2>` : ''}
        <h1>${catalog.name}</h1>
      </div>
      <div class="grid">
        ${productGrid}
      </div>
    </body>
    </html>
  `;
};
```

#### Step 3: PDF Export UI
```typescript
// src/utils/pdf-export.ts
import * as MediaLibrary from 'expo-media-library';
import {generateCatalogPDF} from './pdf-generator';

export const exportAndSavePDF = async (options: PDFOptions) => {
  // Generate PDF
  const pdfUri = await generateCatalogPDF(options);
  
  // Save to gallery
  const permission = await MediaLibrary.requestPermissionsAsync();
  if (permission.granted) {
    await MediaLibrary.createAssetAsync(pdfUri);
  }
  
  return pdfUri;
};
```

### Phase 10.2: Image Grid Export

#### Step 1: Create Canvas Renderer
```typescript
// src/utils/image-generator.ts
import {Catalog, Product} from '@/types';
import {TemplateType} from '@/constants/templates';

interface ImageOptions {
  catalog: Catalog;
  products: Product[];
  template: TemplateType;
  columns: 2 | 3;
  includeHeader: boolean;
}

export const generateCatalogImage = async ({
  catalog,
  products,
  template,
  columns = 2,
  includeHeader = true,
}: ImageOptions): Promise<string> => {
  // Use react-native-view-shot to capture a rendered view
  // OR use react-native-canvas for drawing
  
  const canvasWidth = 1080;
  const canvasHeight = 1920; // Vertical format for stories
  
  // Implementation depends on chosen library
  // This is a placeholder for the actual canvas drawing logic
  
  return 'file://path/to/generated/image.png';
};
```

#### Step 2: Multi-Page Image Export
```typescript
export const generateCatalogImages = async (
  options: ImageOptions
): Promise<string[]> => {
  const {products} = options;
  const productsPerPage = options.columns === 2 ? 4 : 6;
  const pages: string[] = [];
  
  for (let i = 0; i < products.length; i += productsPerPage) {
    const pageProducts = products.slice(i, i + productsPerPage);
    const pageImage = await generateCatalogImage({
      ...options,
      products: pageProducts,
    });
    pages.push(pageImage);
  }
  
  return pages;
};
```

### Phase 10.3: WhatsApp Sharing

#### Step 1: Share Intent Setup
```typescript
// src/utils/share-utils.ts
import * as Sharing from 'expo-sharing';
import {Platform} from 'react-native';

export const shareToWhatsApp = async (fileUri: string, message?: string) => {
  if (Platform.OS === 'android') {
    // Use native share intent
    await Sharing.shareAsync(fileUri, {
      mimeType: 'application/pdf',
      dialogTitle: 'Share Catalog',
      UTI: 'com.adobe.pdf',
    });
  } else {
    // iOS - general share sheet
    await Sharing.shareAsync(fileUri);
  }
};

export const shareMultipleImages = async (imageUris: string[]) => {
  // Share multiple images (for catalog pages)
  if (Platform.OS === 'android') {
    await Sharing.shareAsync(imageUris[0], {
      mimeType: 'image/png',
    });
  }
};
```

#### Step 2: Catalog Preview Share Actions
```typescript
// Update CatalogPreviewScreen with share actions
const handleSharePDF = async () => {
  setIsExporting(true);
  try {
    const pdfUri = await exportAndSavePDF({
      catalog,
      products: catalogProducts,
      template: selectedTemplate,
      storeName: 'My Store',
      includePrices: true,
    });
    
    await shareToWhatsApp(pdfUri, `Check out our ${catalog.name}!`);
  } finally {
    setIsExporting(false);
  }
};

const handleShareImages = async () => {
  setIsExporting(true);
  try {
    const images = await generateCatalogImages({
      catalog,
      products: catalogProducts,
      template: selectedTemplate,
      columns: 2,
    });
    
    await shareMultipleImages(images);
  } finally {
    setIsExporting(false);
  }
};
```

### Phase 10.4: Update Catalog Preview Screen

```typescript
// src/screens/CatalogPreviewScreen.tsx
// Add export buttons to the UI

<View style={styles.shareBar}>
  <TouchableOpacity 
    style={styles.shareButton}
    onPress={handleSharePDF}
    disabled={isExporting}>
    <FileText size={24} color={semantic.card} />
    <Text style={styles.shareButtonText}>PDF</Text>
  </TouchableOpacity>
  
  <TouchableOpacity 
    style={styles.shareButton}
    onPress={handleShareImages}
    disabled={isExporting}>
    <ImageIcon size={24} color={semantic.card} />
    <Text style={styles.shareButtonText}>Images</Text>
  </TouchableOpacity>
  
  <TouchableOpacity 
    style={[styles.shareButton, styles.whatsappButton]}
    onPress={handleSharePDF}
    disabled={isExporting}>
    <MessageCircle size={24} color={semantic.card} />
    <Text style={styles.shareButtonText}>WhatsApp</Text>
  </TouchableOpacity>
</View>
```

### Phase 10.5: Export Settings

```typescript
// src/store/settings-store.ts
interface ExportSettings {
  defaultFormat: 'pdf' | 'images';
  imageQuality: 'low' | 'medium' | 'high';
  includeWatermark: boolean;
  defaultColumns: 2 | 3;
  autoSaveToGallery: boolean;
}

export const useSettingsStore = create(() => ({
  exportSettings: {
    defaultFormat: 'pdf',
    imageQuality: 'high',
    includeWatermark: false,
    defaultColumns: 2,
    autoSaveToGallery: true,
  },
  
  updateExportSettings: (settings: Partial<ExportSettings>) => {
    // Update settings
  },
}));
```

## Permissions Required

```json
// app.json
{
  "expo": {
    "android": {
      "permissions": [
        "android.permission.WRITE_EXTERNAL_STORAGE",
        "android.permission.READ_EXTERNAL_STORAGE"
      ]
    },
    "plugins": [
      [
        "expo-media-library",
        {
          "photosPermission": "Allow $(PRODUCT_NAME) to save catalogs to your photos.",
          "savePhotosPermission": "Allow $(PRODUCT_NAME) to save catalogs to your photos."
        }
      ]
    ]
  }
}
```

## Testing

### Manual Test Cases
1. Export catalog with 50 products as PDF
2. Export catalog as 2-column image grid
3. Export catalog as 3-column image grid
4. Share PDF to WhatsApp
5. Share images to WhatsApp
6. Verify files saved to gallery
7. Test with no price display
8. Test with custom store name

## Progress Tracking
| Date | Feature | Status | Notes |
|------|---------|--------|-------|
| | PDF Generation | | |
| | Image Grid Export | | |
| | WhatsApp Sharing | | |
| | Gallery Save | | |
| | Settings Integration | | |

## Related Files
- `src/utils/pdf-generator.ts`
- `src/utils/image-generator.ts`
- `src/utils/share-utils.ts`
- `src/screens/CatalogPreviewScreen.tsx`
- `app.json` (permissions)
