const express = require('express');
const router = express.Router();
const { pool } = require('../db/connection');
const { authMiddleware } = require('../middleware/auth');

// Get all users
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, uuid, email, first_name, last_name, created_at FROM users WHERE deleted_at IS NULL');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, uuid, email, first_name, last_name, phone, avatar_url, created_at FROM users WHERE uuid = $1 AND deleted_at IS NULL',
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Update user profile (requires auth)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { firstName, lastName, phone, avatarUrl } = req.body;
    const { id } = req.params;

    const result = await pool.query(
      'UPDATE users SET first_name = $1, last_name = $2, phone = $3, avatar_url = $4, updated_at = CURRENT_TIMESTAMP WHERE uuid = $5 RETURNING uuid, email, first_name, last_name, phone, avatar_url, updated_at',
      [firstName, lastName, phone, avatarUrl, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// Delete user (soft delete)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      'UPDATE users SET deleted_at = CURRENT_TIMESTAMP WHERE uuid = $1 RETURNING uuid',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

module.exports = router;
