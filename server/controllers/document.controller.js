const Document = require('../models/Document');
const fs = require('fs');
const path = require('path');
const { uploadFile, deleteFile } = require('../utils/fileUpload');

// @desc    Upload new document
// @route   POST /api/documents/upload
// @access  Private
exports.uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a file' });
    }

    const { title, caseId, clientId, tags } = req.body;

    const fileData = await uploadFile(req.file);

    const document = await Document.create({
      title,
      fileName: fileData.filename,
      fileUrl: fileData.url,
      format: fileData.format || 'unknown',
      fileSize: fileData.size,
      publicId: fileData.publicId, // Store Cloudinary public ID if applicable
      storageType: fileData.storage, 
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

    const fileData = await uploadFile(req.file);

    document.fileUrl = fileData.url;
    document.fileName = fileData.filename;
    document.format = fileData.format || document.format;
    document.fileSize = fileData.size;
    document.publicId = fileData.publicId;
    document.storageType = fileData.storage;
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

// @desc    Delete document
// @route   DELETE /api/documents/:id
// @access  Private (Senior Lawyer)
exports.deleteDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Use deleteFile util which checks storage type
    await deleteFile({
      storage: document.storageType,
      publicId: document.publicId,
      url: document.fileUrl
    });

    // Delete history files if possible - skipped for brevity but document is deleted from DB
    await Document.findByIdAndDelete(req.params.id);

    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete document', error: error.message });
  }
};
