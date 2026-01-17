
const bcrypt = require('bcrypt');
const pool = require('../../config/db');
const { 
  generateAccessToken, 
  generateRefreshToken, 
  hashToken 
} = require('../../utils/jwt');
exports.register = async (req, res) => {
  const { email, password, full_name } = req.body;

  const hash = await bcrypt.hash(password, 12);

  const user = await pool.query(
    'INSERT INTO users(email, password_hash, full_name) VALUES($1,$2,$3) RETURNING id,email,role',
    [email, hash, full_name]
  );

  res.status(201).json(user.rows[0]);
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required'
      });
    }

    const userRes = await pool.query(
      'SELECT id, email, password_hash, role FROM users WHERE email = $1',
      [email]
    );

    if (userRes.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = userRes.rows[0];

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken();

    await pool.query(
      `INSERT INTO refresh_tokens 
       (user_id, token_hash, expires_at)
       VALUES ($1, $2, NOW() + INTERVAL '7 days')`,
      [user.id, hashToken(refreshToken)]
    );

    res.json({
      accessToken,
      refreshToken
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Server error',
      error: err.message
    });
  }
};



exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  const tokenHash = hashToken(refreshToken);

  const tokenRes = await pool.query(
    `SELECT * FROM refresh_tokens
     WHERE token_hash = $1 AND is_revoked = false`,
    [tokenHash]
  );

  if (tokenRes.rows.length === 0) {
    return res.status(401).json({ message: 'Invalid refresh token' });
  }

  const oldToken = tokenRes.rows[0];

  if (new Date(oldToken.expires_at) < new Date()) {
    return res.status(401).json({ message: 'Refresh token expired' });
  }

  // rotate token
  const newRefreshToken = generateRefreshToken();
  const newHash = hashToken(newRefreshToken);

  const newTokenRes = await pool.query(
    `INSERT INTO refresh_tokens 
     (user_id, token_hash, expires_at)
     VALUES ($1,$2, NOW() + INTERVAL '7 days')
     RETURNING id`,
    [oldToken.user_id, newHash]
  );

  await pool.query(
    `UPDATE refresh_tokens
     SET is_revoked = true,
         replaced_by_token = $1
     WHERE id = $2`,
    [newTokenRes.rows[0].id, oldToken.id]
  );

  const userRes = await pool.query(
    'SELECT id, role FROM users WHERE id = $1',
    [oldToken.user_id]
  );

  const accessToken = generateAccessToken(userRes.rows[0]);

  res.json({
    accessToken,
    refreshToken: newRefreshToken
  });
};
exports.logout = async (req, res) => {
  const { refreshToken } = req.body;

  await pool.query(
    `UPDATE refresh_tokens
     SET is_revoked = true
     WHERE token_hash = $1`,
    [hashToken(refreshToken)]
  );

  res.json({ message: 'Logged out successfully' });
};
