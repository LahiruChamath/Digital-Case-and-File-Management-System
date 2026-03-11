const Document = require('../models/Document');
const fs = require('fs');
const path = require('path');

// @desc    Upload new document
// @route   POST /api/documents/upload
// @access  Private
exports.uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a file' });
    }

    const { title, caseId, clientId, tags } = req.body;

    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    const document = await Document.create({
      title,
      fileName: req.file.originalname,
      fileUrl: fileUrl,
      format: req.file.mimetype.split('/')[1] || 'unknown',
      case: caseId,
      client: clientId,
      uploader: req.user._id,
      tags: tags ? tags.split(',') : []
    });

    res.status(201).json(document);
  } catch (error) {
    if (req.file) {
      try { fs.unlinkSync(req.file.path); } catch (e) {}
    }
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

    const newFileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    document.fileUrl = newFileUrl;
    document.fileName = req.file.originalname;
    document.version += 1;
    document.updatedAt = Date.now();

    await document.save();

    res.json(document);
  } catch (error) {
    if (req.file) {
      try { fs.unlinkSync(req.file.path); } catch (e) {}
    }
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
