# Feature: Export & Share

## Overview
Export catalogs as PDF or images, and share directly to WhatsApp. The final step in the catalog workflow.

## Acceptance Criteria
- [ ] User can export catalog as PDF
- [ ] User can export catalog as image (PNG/JPEG)
- [ ] User can share directly to WhatsApp
- [ ] Exports maintain template styling
- [ ] Exports are high quality (print-ready)
- [ ] Share opens WhatsApp with pre-populated message

---

## Phase 1: E2E Integration Tests

**Test File:** `e2e/export-share-flow.test.ts`

### Test 1: Export PDF Flow
```
Scenario: Export catalog as PDF
Given I have a catalog with 8 products
And I'm on Catalog Preview screen
When I tap "Export PDF" button
Then I see "Preparing PDF..." loading
And after 2-3 seconds
Then I see share sheet
And PDF is attached
When I select destination
Then PDF is saved/shared
```

### Test 2: Export Image Flow
```
Scenario: Export catalog pages as images
Given I have a 3-page catalog
And I'm on Catalog Preview
When I tap "Export Image" button
Then I see options: "Current Page" / "All Pages"
When I select "All Pages"
Then 3 images are generated
And I can share them
```

### Test 3: WhatsApp Share Flow
```
Scenario: Share directly to WhatsApp
Given I have a catalog
And I'm on Catalog Preview
When I tap "WhatsApp" button
Then WhatsApp opens
And message field has catalog link/text
And catalog image/PDF is attached
When I select contact
Then message is ready to send
```

### Test 4: Export Quality
```
Scenario: Export is high quality
Given I export a catalog
When I open the exported file
Then text is crisp and readable
Then images are not pixelated
Then colors match the template
Then layout matches preview exactly
```

**Acceptance Criteria:**
- [ ] All 4 E2E tests pass
- [ ] Export completes in < 5 seconds
- [ ] File size is reasonable (< 5MB for 20 products)

---

## Phase 2: Unit Tests

### Utility Tests

**File:** `src/utils/pdfGenerator.test.ts`
- `generates PDF from catalog data`
- `applies template styling correctly`
- `paginates products correctly`
- `includes store name and contact info`
- `handles empty catalog gracefully`

**File:** `src/utils/imageGenerator.test.ts`
- `generates image from catalog page`
- `maintains aspect ratio`
- `applies correct resolution`
- `handles multiple pages`

**File:** `src/utils/shareHelpers.test.ts`
- `opens WhatsApp with message`
- `attaches file correctly`
- `handles share cancellation`
- `handles WhatsApp not installed`

---

## Phase 3: Implementation

### Step 1: PDF Generation

**File:** `src/utils/pdfGenerator.ts`

**Technology Options (executor chooses):**

**Option A: react-native-html-to-pdf**
```typescript
import RNHTMLtoPDF from 'react-native-html-to-pdf';

export const generateCatalogPDF = async (
  catalog: Catalog,
  products: Product[]
): Promise<string> => {
  // 1. Generate HTML from catalog + template
  const html = generateCatalogHTML(catalog, products);
  
  // 2. Convert to PDF
  const options = {
    html,
    fileName: catalog.name,
    width: 612, // 8.5 inches (letter)
    height: 792, // 11 inches
  };
  
  const pdf = await RNHTMLtoPDF.convert(options);
  return pdf.filePath;
};
```

**Option B: react-native-pdf-lib (if available)**

**HTML Generation:**
- Convert template CSS to inline styles
- Generate product grid HTML
- Apply colors from catalog customization

**Considerations:**
- Font embedding
- Image base64 encoding
- Page breaks
- Header/footer

---

### Step 2: Image Generation

**File:** `src/utils/imageGenerator.ts`

**Technology Options:**

**Option A: react-native-view-shot**
```typescript
import { captureRef } from 'react-native-view-shot';

export const captureCatalogPage = async (
  viewRef: any
): Promise<string> => {
  const uri = await captureRef(viewRef, {
    format: 'png',
    quality: 1,
    width: 1080, // High res for sharing
    height: 1920,
  });
  return uri;
};
```

**Option B: react-native-canvas (if complex rendering needed)**

**Multi-page export:**
- Capture each page separately
- Return array of URIs
- Let user share multiple images

---

### Step 3: WhatsApp Share

**File:** `src/utils/shareHelpers.ts`

**Using react-native-share:**
```typescript
import Share from 'react-native-share';

export const shareToWhatsApp = async (
  message: string,
  filePath?: string
): Promise<void> => {
  const shareOptions = {
    title: 'Share Catalog',
    message,
    url: filePath ? `file://${filePath}` : undefined,
    social: Share.Social.WHATSAPP,
  };
  
  await Share.shareSingle(shareOptions);
};
```

**Using Android Intent (fallback):**
```typescript
import { Linking, Platform } from 'react-native';

export const openWhatsApp = (message: string) => {
  const url = `whatsapp://send?text=${encodeURIComponent(message)}`;
  Linking.openURL(url);
};
```

---

### Step 4: Export UI

**Update:** `src/screens/CatalogPreviewScreen.tsx`

**Bottom Action Bar:**
```
┌───────────────────────────────────┐
│ ┌────────┬────────┬────────────┐  │
│ │  PDF   │ Image  │  WhatsApp  │  │
│ │  ⬇️    │  🖼️    │   💬       │  │
│ └────────┴────────┴────────────┘  │
└───────────────────────────────────┘
```

**Loading States:**
- PDF: "Preparing PDF..." with progress
- Image: "Generating image..."
- WhatsApp: "Opening WhatsApp..."

**Error Handling:**
- "Failed to generate PDF. Try again."
- "WhatsApp not installed"
- "Storage permission required"

---

### Step 5: Export Settings (Optional)

**File:** `src/components/ExportSettings.tsx`

**Options:**
- Quality: Standard / High / Print
- Format: PDF / Image
- Pages: All / Current / Range
- Include prices: Yes / No
- Include contact info: Yes / No

---

### Step 6: File Storage

**File:** `src/utils/fileStorage.ts`

**Requirements:**
- Save exports to app documents directory
- Generate unique filenames
- Clean up old exports (optional)
- Request storage permissions (Android)

---

## Verification

### Quality Checklist

- [ ] PDF text is crisp (not blurry)
- [ ] Images are high resolution
- [ ] Colors match template exactly
- [ ] Layout matches preview
- [ ] Multi-page PDF has correct pagination

### Functional Checklist

- [ ] PDF export works
- [ ] Image export works
- [ ] WhatsApp share works
- [ ] File can be saved to device
- [ ] File can be shared to other apps
- [ ] Export works offline

### Performance Checklist

- [ ] 10-product catalog exports in < 3s
- [ ] 50-product catalog exports in < 10s
- [ ] No UI blocking during export
- [ ] Memory usage stays reasonable

---

## Progress Tracking

| Date | Phase | Status | Blockers | Notes |
|------|-------|--------|----------|-------|
| | E2E Tests | ⬜ Not Started | | |
| | Unit Tests | ⬜ Not Started | | |
| | PDF Generator | ⬜ Not Started | | |
| | Image Generator | ⬜ Not Started | | |
| | WhatsApp Share | ⬜ Not Started | | |
| | Export UI | ⬜ Not Started | | |

---

## Insights & Decisions

- PDF library chosen: ___
- Image capture method: ___
- Default export quality: ___
- Max catalog size for export: ___ products

---

## Problems & Resolutions

| Problem | Cause | Solution | Time Lost |
|---------|-------|----------|-----------|
| | | | |

---

*This is the final feature. After completion, run full E2E test suite.*
