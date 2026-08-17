const pool = require('../config/db');

const getAllTasks = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM tasks ORDER BY created_at DESC'
    );

    res.json(result.rows);
  } catch (err) {
    console.error('Get tasks error:', err);
    res.status(500).json({ error: err.message });
  }
};

const createTask = async (req, res) => {
  const { title, description, completed } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO tasks (title, description, completed)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [title, description, completed ?? false]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Create task error:', err);
    res.status(500).json({ error: err.message });
  }
};

const updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, description, completed } = req.body;

  try {
    const updates = [];
    const values = [];

    if (title !== undefined) {
      updates.push(`title = $${values.length + 1}`);
      values.push(title);
    }

    if (description !== undefined) {
      updates.push(`description = $${values.length + 1}`);
      values.push(description);
    }

    if (completed !== undefined) {
      updates.push(`completed = $${values.length + 1}`);
      values.push(completed);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        error: 'No fields provided for update'
      });
    }

    values.push(id);

    const query = `
      UPDATE tasks
      SET ${updates.join(', ')}
      WHERE id = $${values.length}
      RETURNING *
    `;

    console.log('Executing query:', query);
    console.log('Values:', values);

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Task not found'
      });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Update task error:', err);
    res.status(500).json({ error: err.message });
  }
};

const deleteTask = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM tasks WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Task not found'
      });
    }

    res.status(204).send();
  } catch (err) {
    console.error('Delete task error:', err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
};