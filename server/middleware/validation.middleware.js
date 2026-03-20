const { body, validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  return res.status(400).json({ errors: errors.array() });
};

exports.registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').isIn(['Administrator', 'Attorney', 'Legal Staff']).withMessage('Invalid role'),
  validate
];

exports.loginValidation = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
  validate
];

exports.caseValidation = [
  body('title').trim().notEmpty().withMessage('Case title is required'),
  body('client').isMongoId().withMessage('Invalid client ID'),
  body('type').isIn(['Litigation', 'Notarial', 'Oath Commissioner', 'Company Secretarial']).withMessage('Invalid case type'),
  validate
];

exports.clientValidation = [
  body('name').trim().notEmpty().withMessage('Client name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('phone').trim().notEmpty().withMessage('Phone number is required'),
  validate
];
