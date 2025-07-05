import fs from 'fs';
import path from 'path';

// Create a .gitkeep file to ensure uploads directory is tracked in git
const uploadsDir = path.join(process.cwd(), 'uploads');
const gitkeepPath = path.join(uploadsDir, '.gitkeep');

// Ensure uploads directory exists
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('Created uploads directory');
}

// Create .gitkeep file
if (!fs.existsSync(gitkeepPath)) {
  fs.writeFileSync(gitkeepPath, '# Keep this directory in git\n');
  console.log('Created .gitkeep file in uploads directory');
}

export default uploadsDir;
