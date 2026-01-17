const { body } = require('express-validator');

exports.updateProfileValidation = [
  body('full_name')
    .optional()
    .isLength({ min: 3 })
    .withMessage('Full name must be at least 3 characters'),

  body('email')
    .optional()
    .isEmail()
    .withMessage('Valid email required')
];
exports.changePasswordValidation = [
  body('oldPassword')
    .notEmpty().withMessage('Old password required'),

  body('newPassword')
    .isStrongPassword({
      minLength: 8,
      minUppercase: 1,
      minLowercase: 1,
      minNumbers: 1,
      minSymbols: 1
    })
    .withMessage('Weak password')
];