const jwt = require('jsonwebtoken');
const crypto = require('crypto');

exports.generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: '15m' }
  );
};

exports.generateRefreshToken = () => {
  return crypto.randomBytes(64).toString('hex');
};

exports.hashToken = (token) => {
  return crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');
};
