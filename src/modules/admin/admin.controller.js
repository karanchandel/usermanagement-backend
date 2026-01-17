const pool = require('../../config/db');

exports.getAllUsers = async (req, res) => {
  const users = await pool.query(
    'SELECT id, full_name, email, role, created_at FROM users'
  );

  res.json({
    success: true,
    data: users.rows
  });
};
