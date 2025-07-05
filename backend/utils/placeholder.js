// Placeholder image creation utility
import fs from "fs";
import path from "path";

const createPlaceholderImage = () => {
  const placeholderSVG = `
    <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f0f0f0"/>
      <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#999" font-family="Arial, sans-serif" font-size="24">
        Image Not Found
      </text>
    </svg>
  `;

  const __dirname = path.resolve();
  // Go up one directory from backend to root
  const rootDir = path.dirname(__dirname);
  const uploadsDir = path.join(rootDir, "uploads");
  const placeholderPath = path.join(uploadsDir, "placeholder.svg");

  // Ensure uploads directory exists
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log("Created uploads directory");
  }

  if (!fs.existsSync(placeholderPath)) {
    fs.writeFileSync(placeholderPath, placeholderSVG);
    console.log("Placeholder image created at:", placeholderPath);
  }

  return placeholderPath;
};

export default createPlaceholderImage;
