const { body } = require('express-validator');

const applyLeadValidation = [
  body('firstName')
    .trim()
    .notEmpty().withMessage('First name is required')
    .isLength({ max: 50 }).withMessage('First name must be under 50 characters')
    .escape(),
    
  body('lastName')
    .trim()
    .notEmpty().withMessage('Last name is required')
    .isLength({ max: 50 }).withMessage('Last name must be under 50 characters')
    .escape(),
    
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Must be a valid email format')
    .normalizeEmail(),
    
  body('phone')
    .trim()
    .notEmpty().withMessage('Phone number is required')
    .matches(/^[0-9+\-\s()]+$/).withMessage('Invalid phone number format')
    .escape(),
    
  body('courseId')
    .optional()
    .trim()
    .escape()
];

const updatePaymentValidation = [
  body('status')
    .trim()
    .notEmpty().withMessage('Status is required')
    .isIn(['PENDING', 'COMPLETED', 'FAILED']).withMessage('Invalid status')
    .escape()
];

module.exports = {
  applyLeadValidation,
  updatePaymentValidation
};
