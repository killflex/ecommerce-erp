# Image Upload and Error Handling

## Issue Fixed
The error `ENOENT: no such file or directory, open 'D:\Programming\MERN-E-Commerce-Store\uploads\image-1751670919298.jpg'` has been resolved.

## Solution Implemented

### 1. Created Missing Uploads Directory
- Created the `uploads/` directory in the project root
- Added `.gitkeep` file to track the directory in version control

### 2. Image Error Handling Middleware
- Added middleware to handle missing image files gracefully
- When an image is not found, a placeholder SVG is served instead of throwing an error
- Logs missing image requests for debugging

### 3. Placeholder Image System
- Created a utility to generate placeholder images automatically
- Placeholder is a clean SVG with "Image Not Found" text
- Generated automatically when the server starts

### 4. Upload Route Configuration
- Upload route properly configured to save files to `uploads/` directory
- Supports JPG, PNG, and WebP formats
- Files are named with timestamp to avoid conflicts

## Files Modified/Created

1. **`backend/index.js`** - Added image handling middleware
2. **`backend/utils/placeholder.js`** - Placeholder image creation utility
3. **`backend/utils/ensureUploadsDir.js`** - Directory creation utility
4. **`uploads/.gitkeep`** - Keeps uploads directory in git
5. **`uploads/placeholder.svg`** - Default placeholder image

## How It Works

1. When a request comes for `/uploads/image-name.jpg`
2. The middleware checks if the file exists
3. If it exists, the file is served normally
4. If it doesn't exist, the placeholder image is served instead
5. No more ENOENT errors!

## Usage

Your image upload and serving system now handles missing files gracefully:

```javascript
// Upload endpoint
POST /api/upload
Content-Type: multipart/form-data

// Access uploaded images
GET /uploads/image-123456789.jpg  // Real image
GET /uploads/missing-image.jpg    // Returns placeholder
```

## Benefits

- ✅ No more crashes from missing images
- ✅ Graceful fallback for broken image links
- ✅ Better user experience
- ✅ Easier debugging with console logs
- ✅ Automatic placeholder generation
