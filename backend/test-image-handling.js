import fs from 'fs';
import path from 'path';
import createPlaceholderImage from './utils/placeholder.js';

const __dirname = path.resolve();

console.log('Testing image handling...');

// Create placeholder image
createPlaceholderImage();

// Test if uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
console.log('Uploads directory exists:', fs.existsSync(uploadsDir));

// List files in uploads directory
if (fs.existsSync(uploadsDir)) {
  const files = fs.readdirSync(uploadsDir);
  console.log('Files in uploads directory:', files);
}

// Test image path handling
const testImagePath = path.join(uploadsDir, 'image-1751670919298.jpg');
console.log('Test image exists:', fs.existsSync(testImagePath));

const placeholderPath = path.join(uploadsDir, 'placeholder.svg');
console.log('Placeholder image exists:', fs.existsSync(placeholderPath));

console.log('Image handling test completed!');
