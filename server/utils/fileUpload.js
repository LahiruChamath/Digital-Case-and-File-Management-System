const fs = require('fs');
const path = require('path');
const { uploadToCloudinary, deleteFromCloudinary } = require('../config/cloudinary');

const useCloudinary = process.env.USE_CLOUDINARY === 'true';

const uploadFile = async (file) => {
  if (useCloudinary) {
    const result = await uploadToCloudinary(file.path, file.originalname);
    fs.unlink(file.path, (err) => { if (err) console.error('Failed to delete temp file:', err); });
    return { filename: file.originalname, url: result.url, publicId: result.publicId, size: result.size, format: result.format, storage: 'cloudinary' };
  } else {
    return { filename: file.originalname, url: `/uploads/${file.filename}`, publicId: null, size: file.size, format: path.extname(file.originalname).substring(1), storage: 'local' };
  }
};

const deleteFile = async (fileRecord) => {
  try {
    if (fileRecord.storage === 'cloudinary' && fileRecord.publicId) {
      await deleteFromCloudinary(fileRecord.publicId);
    } else if (fileRecord.storage === 'local') {
      const filePath = path.join(__dirname, '..', fileRecord.url);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
  } catch (error) { console.error('File deletion error:', error.message); }
};

const ensureUploadDir = () => {
  const uploadDir = path.join(__dirname, '../uploads');
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
};

module.exports = { uploadFile, deleteFile, ensureUploadDir };
