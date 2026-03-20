const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'image/jpeg',
    'image/png',
    'image/jpg',
    'text/plain',
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${file.mimetype} is not allowed.`), false);
  }
};

const uploadSingle = multer({ storage, fileFilter, limits: { fileSize: 10 * 1024 * 1024 } }).single('document');
const uploadMultiple = multer({ storage, fileFilter, limits: { fileSize: 10 * 1024 * 1024, files: 10 } }).array('documents', 10);

const handleUpload = (uploadFn) => {
  return (req, res, next) => {
    uploadFn(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') return res.status(400).json({ message: 'File size exceeds 10MB limit' });
        if (err.code === 'LIMIT_FILE_COUNT') return res.status(400).json({ message: 'Maximum 10 files allowed' });
        return res.status(400).json({ message: `Upload error: ${err.message}` });
      }
      if (err) return res.status(400).json({ message: err.message });
      next();
    });
  };
};

module.exports = { uploadSingle: handleUpload(uploadSingle), uploadMultiple: handleUpload(uploadMultiple) };
