const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

const uploadToCloudinary = async (filePath, originalName = '') => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'legal-documents',
      resource_type: 'auto',
      type: 'upload',
      access_mode: 'public',
      use_filename: true,
      unique_filename: true
    });
    return {
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format || (originalName ? originalName.split('.').pop() : ''),
      size: result.bytes,
      originalFilename: result.original_filename,
    };
  } catch (error) {
    throw new Error(`Cloudinary Upload Failed: ${error.message}`);
  }
};

const deleteFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    throw new Error(`Cloudinary Delete Failed: ${error.message}`);
  }
};

module.exports = { cloudinary, uploadToCloudinary, deleteFromCloudinary };
