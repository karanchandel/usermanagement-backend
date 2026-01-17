const { body } = require('express-validator');

exports.registerValidation = [
  body('full_name')
    .trim()
    .notEmpty().withMessage('Full name is required')
    .isLength({ min: 3 }).withMessage('Full name must be at least 3 characters'),

  body('email')
    .trim()
    .isEmail().withMessage('Valid email is required')
    .normalizeEmail(),

  body('password')
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1
    })
    .withMessage(
      'Password must be 8+ chars with uppercase, lowercase, number & symbol'
    )
];

exports.loginValidation = [
  body('email')
    .trim()
    .isEmail().withMessage('Valid email is required'),

  body('password')
    .notEmpty().withMessage('Password is required')
];

exports.refreshTokenValidation = [
  body('refreshToken')
    .notEmpty().withMessage('Refresh token is required')
];
