const pool = require('../config/db');

const getAllTasks = async (req, res) => {
  const result = await pool.query('SELECT * FROM tasks ORDER BY created_at DESC');
  res.json(result.rows);
};

const createTask = async (req, res) => {
  const { title, description, completed } = req.body;
  const result = await pool.query(
    `INSERT INTO tasks (title, description, completed)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [title, description, completed ?? false]
  );
  res.status(201).json(result.rows[0]);
};

const updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, description, completed } = req.body;
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

  values.push(id);
  const result = await pool.query(
    `UPDATE tasks SET ${updates.join(', ')} WHERE id = $${values.length} RETURNING *`,
    values
  );
  res.json(result.rows[0]);
};

const deleteTask = async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
  res.status(204).send();
};

module.exports = {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
};