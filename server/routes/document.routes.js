const express = require('express');
const router = express.Router();
const multer = require('multer');
const { protect } = require('../middleware/auth.middleware');
const { uploadDocument, updateVersion, searchDocuments } = require('../controllers/document.controller');

// Multer setup for local temp storage before Cloudinary upload
const upload = multer({ dest: 'uploads/' });

router.use(protect); // Protect all document routes

router.post('/upload', upload.single('file'), uploadDocument);
router.put('/:id/version', upload.single('file'), updateVersion);
router.get('/search', searchDocuments);

module.exports = router;
