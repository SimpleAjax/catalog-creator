# Troubleshooting: Image to Base64 Conversion

## Problem Statement
When exporting PDF/image catalogs, the app encountered errors converting local image URIs to base64 format for embedding in PDFs.

## Error Timeline

### Error 1: `TypeError: Cannot read property 'Base64' of undefined`
**Cause:** Named import of `EncodingType` from `expo-file-system` was failing.

**Attempted Fix 1:**
```typescript
// Changed from:
import {readAsStringAsync, EncodingType} from 'expo-file-system';

// To:
import * as FileSystem from 'expo-file-system';
const base64 = await FileSystem.readAsStringAsync(uri, {
  encoding: FileSystem.EncodingType?.Base64 || 'base64',
});
```
**Result:** Still failed because `EncodingType` was undefined.

---

### Error 2: `Method readAsStringAsync is deprecated`
**Cause:** Expo SDK 54+ deprecated the old FileSystem API methods.

**Attempted Fix 2:**
```typescript
import { File } from 'expo-file-system';

const file = new File(uri);
const base64 = await file.text({ encoding: 'base64' });
```
**Result:** Failed with `Received 2 arguments, but 1 was expected`

**Lesson Learned:** The new `File.text()` method does NOT accept an options object with encoding parameter. The API documentation was misleading.

---

### Error 3: `Received 2 arguments, but 1 was expected`
**Cause:** Trying to pass `{ encoding: 'base64' }` to `file.text()` which expects 0 arguments.

---

## Final Working Solution

```typescript
import { File } from 'expo-file-system';

export const imageToBase64 = async (uri: string): Promise<string | null> => {
  try {
    // Handle edge cases first
    if (uri.startsWith('data:')) {
      return uri; // Already base64
    }
    if (uri.startsWith('http://') || uri.startsWith('https://')) {
      return uri; // Remote URLs - return as-is
    }

    // New File API approach: Read bytes, then convert to base64
    const file = new File(uri);
    const bytes = await file.bytes(); // Returns Uint8Array, no arguments needed
    
    // Manual conversion: Uint8Array -> binary string -> base64
    const base64 = bytesToBase64(bytes);

    // Add data URI prefix with proper MIME type
    const extension = uri.split('.').pop()?.toLowerCase() || 'jpg';
    const mimeType = extension === 'png' ? 'image/png' : 'image/jpeg';

    return `data:${mimeType};base64,${base64}`;
  } catch (error) {
    console.error('Error converting image to base64:', error);
    return null;
  }
};

// Helper: Convert Uint8Array to base64 string
const bytesToBase64 = (bytes: Uint8Array): string => {
  const binaryString = Array.from(bytes, byte => String.fromCharCode(byte)).join('');
  return btoa(binaryString);
};
```

## Key Learnings

### Expo FileSystem API (SDK 54+)

#### Old API (Deprecated)
```typescript
import * as FileSystem from 'expo-file-system';

// Read file as base64
const base64 = await FileSystem.readAsStringAsync(uri, {
  encoding: FileSystem.EncodingType.Base64,
});
```

#### New API
```typescript
import { File } from 'expo-file-system';

const file = new File(uri);

// Available methods (all take NO arguments):
const text = await file.text();        // Returns string (UTF-8)
const bytes = await file.bytes();      // Returns Uint8Array
const stream = await file.stream();    // Returns ReadableStream

// File metadata
const exists = await file.exists();    // Returns boolean
const info = await file.getInfo();     // Returns file info

// For base64, you must:
// 1. Read as bytes: await file.bytes()
// 2. Convert Uint8Array to base64 manually
```

### Methods Comparison

| Operation | Old API | New API |
|-----------|---------|---------|
| Read as text | `readAsStringAsync(uri)` | `file.text()` |
| Read as base64 | `readAsStringAsync(uri, {encoding: 'base64'})` | `file.bytes()` + manual conversion |
| Read as bytes | Not available | `file.bytes()` |
| Check exists | `getInfoAsync(uri)` | `file.exists()` |
| File info | `getInfoAsync(uri)` | `file.getInfo()` |
| Write file | `writeAsStringAsync(uri, content)` | `file.write(content)` |
| Delete file | `deleteAsync(uri)` | `file.delete()` |

### Other Available Classes (New API)

```typescript
import { File, Directory } from 'expo-file-system';

// File operations
const file = new File('file:///path/to/file.txt');
await file.write('Hello World');
const content = await file.text();
await file.delete();

// Directory operations
const dir = new Directory('file:///path/to/directory');
await dir.create();
const files = await dir.list(); // Returns (File | Directory)[]
await dir.delete();
```

## Fallback Strategy

For reliability, always include fallback mechanisms:

1. **Check if already base64** - Skip conversion
2. **Check if remote URL** - Return as-is (PDFs can embed remote images)
3. **Try-catch wrapper** - Return original URI if conversion fails
4. **MIME type detection** - Handle different image formats (jpg, png, webp)

## Testing Checklist

- [ ] Local file URIs (e.g., `file:///data/...`)
- [ ] Remote URLs (e.g., `https://...`)
- [ ] Already base64 encoded (e.g., `data:image/png;base64,...`)
- [ ] Different image formats (JPG, PNG, WEBP)
- [ ] Large files (memory handling)
- [ ] Missing/corrupted files (error handling)

## References

- Expo FileSystem docs: https://docs.expo.dev/versions/v54.0.0/sdk/filesystem/
- Migration guide: Use `File` and `Directory` classes instead of global functions
- Note: The `file.text({encoding: 'base64'})` pattern shown in some docs appears to be incorrect - use `file.bytes()` instead
