const express = require('express');
const router = express.Router();

const validate = require('../../middlewares/validate');
const {
  registerValidation,
  loginValidation,
  refreshTokenValidation
} = require('./auth.validation');

const {
  register,
  login,
  refreshToken,
  logout
} = require('./auth.controller');

router.post('/register', registerValidation, validate, register);
router.post('/login', loginValidation, validate, login);
router.post('/refresh-token', refreshTokenValidation, validate, refreshToken);
router.post('/logout', refreshTokenValidation, validate, logout);

module.exports = router;
