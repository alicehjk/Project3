const multer = require('multer');
const path = require('path');

// Simple storage configuration
const storage = multer.diskStorage({
  destination: 'server/uploads/products/',
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

// Simple upload configuration - accepts image files up to 5MB
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }
});

module.exports = upload;
