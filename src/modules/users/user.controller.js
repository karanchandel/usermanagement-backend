const pool = require('../../config/db');
const bcrypt = require('bcrypt');
exports.getMe = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      'SELECT id, full_name, email, role, created_at FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ message: 'User not found' });

    res.json({
      success: true,
      user: result.rows[0]
    });

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const userRes = await pool.query(
    'SELECT password FROM users WHERE id = $1',
    [req.user.id]
  );

  const isMatch = await bcrypt.compare(oldPassword, userRes.rows[0].password);
  if (!isMatch) {
    return res.status(400).json({ message: 'Old password incorrect' });
  }

  const hashed = await bcrypt.hash(newPassword, 10);

  await pool.query(
    'UPDATE users SET password = $1 WHERE id = $2',
    [hashed, req.user.id]
  );

  res.json({ message: 'Password changed successfully' });
};

// src/modules/users/user.controller.js - YE FUNCTION ADD KARO
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { full_name } = req.body;

    const result = await pool.query(
      'UPDATE users SET full_name=$1 WHERE id=$2 RETURNING id, full_name, email, role',
      [full_name, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      success: true,
      user: result.rows[0]
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

