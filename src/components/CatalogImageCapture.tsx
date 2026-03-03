// Catalog Image Capture Component
// Renders HTML in WebView and captures as PNG image

import React, {useRef, useState, useCallback, forwardRef, useImperativeHandle} from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
  Dimensions,
} from 'react-native';
import {WebView} from 'react-native-webview';
import {captureRef} from 'react-native-view-shot';
import {File, Paths} from 'expo-file-system';

import {Catalog, Product} from '@/types';
import {generateCatalogImageHTML} from '@/utils/image-generator';
import {convertProductImagesToBase64} from '@/utils/image-to-base64';
import {semantic} from '@/theme';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

interface CatalogImageCaptureProps {
  catalog: Catalog;
  products: Product[];
  columns?: 2 | 3;
  includePrices?: boolean;
  includeStoreName?: boolean;
  storeName?: string;
  onCaptureStart?: () => void;
  onCaptureComplete?: (imageUris: string[]) => void;
  onCaptureError?: (error: Error) => void;
}

export interface CatalogImageCaptureRef {
  captureImages: () => Promise<string[]>;
}

// Products per image
const PRODUCTS_PER_IMAGE = {
  2: 4,
  3: 6,
};

// Target dimensions
const TARGET_WIDTH = 1080;
const TARGET_HEIGHT = 1920;

export const CatalogImageCapture = forwardRef<CatalogImageCaptureRef, CatalogImageCaptureProps>(
  ({
    catalog,
    products,
    columns = 2,
    includePrices = true,
    includeStoreName = false,
    storeName = '',
    onCaptureStart,
    onCaptureComplete,
    onCaptureError,
  }, ref) => {
    const webViewRef = useRef<WebView>(null);
    const containerRef = useRef<View>(null);
    const [isCapturing, setIsCapturing] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [isPreparing, setIsPreparing] = useState(false);

    // Prepare HTML pages for capture
    const preparePages = useCallback(async (): Promise<string[]> => {
      const productsPerImage = PRODUCTS_PER_IMAGE[columns];
      
      // Convert images to base64
      const productsWithBase64 = await convertProductImagesToBase64(
        products.map(p => ({id: p.id, imageUri: p.imageUri, name: p.name}))
      );
      
      const updatedProducts = products.map(product => {
        const converted = productsWithBase64.find(p => p.id === product.id);
        return {...product, imageUri: converted?.imageUri || product.imageUri};
      });
      
      // Split into pages
      const pages: Product[][] = [];
      for (let i = 0; i < updatedProducts.length; i += productsPerImage) {
        pages.push(updatedProducts.slice(i, i + productsPerImage));
      }
      
      // Generate HTML for each page
      const htmls = pages.map((pageProducts, index) => 
        generateCatalogImageHTML(
          {
            catalog,
            products: pageProducts,
            columns,
            includeHeader: true,
            includePrices,
            includeStoreName,
            storeName,
          },
          index + 1,
          pages.length
        )
      );
      
      return htmls;
    }, [catalog, products, columns, includePrices, includeStoreName, storeName]);

    // Capture single page
    const capturePage = useCallback(async (): Promise<string | null> => {
      try {
        if (!containerRef.current) return null;
        
        // Capture the WebView
        const uri = await captureRef(containerRef, {
          width: TARGET_WIDTH,
          height: TARGET_HEIGHT,
          quality: 0.95,
          format: 'png',
        });
        
        return uri;
      } catch (error) {
        console.error('Error capturing page:', error);
        return null;
      }
    }, []);

    // Capture all images
    const captureImages = useCallback(async (): Promise<string[]> => {
      if (isCapturing) return [];
      
      try {
        setIsCapturing(true);
        setIsPreparing(true);
        onCaptureStart?.();
        
        // Prepare all HTML pages
        const htmls = await preparePages();
        setTotalPages(htmls.length);
        setCurrentPage(0);
        setIsPreparing(false);
        
        if (htmls.length === 0) {
          throw new Error('No pages to capture');
        }
        
        if (!webViewRef.current) {
          throw new Error('WebView not initialized');
        }
        
        const uris: string[] = [];
        
        // Capture each page
        for (let i = 0; i < htmls.length; i++) {
          setCurrentPage(i + 1);
          
          // Use postMessage to communicate with WebView instead of injectJavaScript
          // This is more reliable
          const html = htmls[i];
          
          // Reload WebView with new HTML
          webViewRef.current.clearCache?.(true);
          
          // Small delay to ensure clear completes
          await new Promise(resolve => setTimeout(resolve, 100));
          
          // Load HTML directly through source prop change simulation
          // by using the reload method with new source
          const dataUrl = `data:text/html;base64,${btoa(unescape(encodeURIComponent(html)))}`;
          
          // Navigate to the data URL
          webViewRef.current.injectJavaScript(`
            window.location.href = "${dataUrl}";
            true;
          `);
          
          // Wait for rendering
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Capture
          const uri = await capturePage();
          if (uri) {
            // Copy to cache with proper name
            const safeName = catalog.name
              .replace(/[^a-zA-Z0-9\u0900-\u097F\s-]/g, '')
              .replace(/\s+/g, '_')
              .substring(0, 30);
            const fileName = `${safeName}_page${i + 1}_${Date.now()}.png`;
            
            try {
              const destFile = new File(Paths.cache, fileName);
              await destFile.parentDirectory.create({idempotent: true});
              
              // Read source and write to destination
              const sourceFile = new File(uri);
              const content = await sourceFile.bytes();
              await destFile.write(content);
              
              uris.push(destFile.uri);
              console.log(`[ImageCapture] Saved: ${destFile.uri}`);
            } catch (fileError) {
              console.error('[ImageCapture] File error:', fileError);
              uris.push(uri);
            }
          }
        }
        
        onCaptureComplete?.(uris);
        return uris;
      } catch (error) {
        console.error('Error capturing images:', error);
        onCaptureError?.(error as Error);
        return [];
      } finally {
        setIsCapturing(false);
        setCurrentPage(0);
      }
    }, [isCapturing, catalog.name, preparePages, capturePage, onCaptureStart, onCaptureComplete, onCaptureError]);

    // Expose capture method via ref
    useImperativeHandle(ref, () => ({
      captureImages,
    }));

    // Calculate scale
    const scale = Math.min((SCREEN_WIDTH - 40) / TARGET_WIDTH, 0.3);

    // Build HTML with embedded content
    const getWebViewSource = () => {
      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=${TARGET_WIDTH}">
            <style>
              body { 
                margin: 0; 
                padding: 0; 
                background: white;
                width: ${TARGET_WIDTH}px;
                height: ${TARGET_HEIGHT}px;
                overflow: hidden;
              }
              #content {
                width: 100%;
                height: 100%;
              }
            </style>
          </head>
          <body>
            <div id="content"></div>
            <script>
              window.updateContent = function(html) {
                document.getElementById('content').innerHTML = html;
              };
            </script>
          </body>
        </html>
      `;
      return { html };
    };

    return (
      <View style={styles.container}>
        <View 
          ref={containerRef}
          style={[
            styles.captureContainer,
            { width: TARGET_WIDTH, height: TARGET_HEIGHT, transform: [{scale}], transformOrigin: 'top left' },
          ]}
          pointerEvents="none"
        >
          <WebView
            ref={webViewRef}
            style={styles.webview}
            originWhitelist={['*']}
            source={getWebViewSource()}
            scrollEnabled={false}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            allowFileAccess={true}
            allowUniversalAccessFromFileURLs={true}
          />
        </View>

        {(isCapturing || isPreparing) && (
          <View style={styles.overlay}>
            <ActivityIndicator size="large" color={semantic.primary} />
            <Text style={styles.progressText}>
              {isPreparing ? 'Preparing...' : `Capturing ${currentPage} of ${totalPages}...`}
            </Text>
          </View>
        )}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    opacity: 0,
    pointerEvents: 'none',
  },
  captureContainer: {
    backgroundColor: 'white',
    overflow: 'hidden',
  },
  webview: {
    flex: 1,
    width: TARGET_WIDTH,
    height: TARGET_HEIGHT,
    backgroundColor: 'white',
  },
  overlay: {
    position: 'absolute',
    top: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: 20,
    borderRadius: 12,
    margin: 20,
  },
  progressText: {
    marginTop: 12,
    fontSize: 14,
    color: semantic.text,
    fontWeight: '500',
  },
});

export default CatalogImageCapture;
