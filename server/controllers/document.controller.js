const Document = require('../models/Document');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

// @desc    Upload new document
// @route   POST /api/documents/upload
// @access  Private
exports.uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a file' });
    }

    const { title, caseId, clientId, tags } = req.body;

    // Upload to Cloudinary (assuming it's configured)
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'lawfirm_documents',
      resource_type: 'auto'
    });

    const document = await Document.create({
      title,
      fileName: req.file.originalname,
      fileUrl: result.secure_url,
      format: req.file.mimetype.split('/')[1],
      case: caseId,
      client: clientId,
      uploader: req.user._id,
      tags: tags ? tags.split(',') : []
    });

    // Delete local temp file
    fs.unlinkSync(req.file.path);

    res.status(201).json(document);
  } catch (error) {
    if (req.file) fs.unlinkSync(req.file.path);
    res.status(500).json({ message: 'Upload failed', error: error.message });
  }
};

// @desc    Update document version
// @route   PUT /api/documents/:id/version
// @access  Private
exports.updateVersion = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a file' });
    }

    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Move current file to history
    document.versionHistory.push({
      version: document.version,
      fileUrl: document.fileUrl,
      fileName: document.fileName,
      updatedBy: req.user._id
    });

    // Upload new version
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'lawfirm_documents',
      resource_type: 'auto'
    });

    document.fileUrl = result.secure_url;
    document.fileName = req.file.originalname;
    document.version += 1;
    document.updatedAt = Date.now();

    await document.save();
    fs.unlinkSync(req.file.path);

    res.json(document);
  } catch (error) {
    if (req.file) fs.unlinkSync(req.file.path);
    res.status(500).json({ message: 'Version update failed', error: error.message });
  }
};

// @desc    Search documents
// @route   GET /api/documents/search
// @access  Private
exports.searchDocuments = async (req, res) => {
  const { query } = req.query;
  try {
    const documents = await Document.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { fileName: { $regex: query, $options: 'i' } },
        { tags: { $in: [new RegExp(query, 'i')] } }
      ]
    }).populate('case', 'title id').populate('client', 'name');

    res.json(documents);
  } catch (error) {
    res.status(500).json({ message: 'Search failed', error: error.message });
  }
};
