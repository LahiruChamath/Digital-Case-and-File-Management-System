const express = require('express');
const router = express.Router();
const multer = require('multer');
const { protect, authorize } = require('../middleware/auth.middleware');
const { uploadDocument, updateVersion, searchDocuments, deleteDocument } = require('../controllers/document.controller');

// Multer setup for local temp storage before Cloudinary upload
const upload = multer({ dest: 'uploads/' });

router.use(protect); // Protect all document routes

router.post('/upload', authorize('Senior Lawyer'), (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      console.error('Multer Upload Error:', err);
      return res.status(400).json({ message: 'Upload error', error: err.message });
    }
    next();
  });
}, uploadDocument);
router.put('/:id/version', authorize('Senior Lawyer', 'Junior Lawyer'), upload.single('file'), updateVersion);
router.get('/search', searchDocuments);
router.delete('/:id', authorize('Senior Lawyer'), deleteDocument);

module.exports = router;
