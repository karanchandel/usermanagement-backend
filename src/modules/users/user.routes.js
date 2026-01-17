const express = require('express');
const router = express.Router();
const auth = require('../../middlewares/auth.middleware');
const validate = require('../../middlewares/validate');
const { getMe, updateProfile, changePassword } = require('./user.controller');
const { updateProfileValidation, changePasswordValidation } = require('./user.validation');

// ✅ Profile
router.get('/me', auth, getMe);
router.put('/me', auth, updateProfileValidation, validate, updateProfile);

// ✅ Change Password
router.post('/change-password', auth, changePasswordValidation, validate, changePassword);

module.exports = router;
