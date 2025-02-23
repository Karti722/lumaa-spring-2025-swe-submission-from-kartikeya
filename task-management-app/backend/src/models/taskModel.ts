import { Pool } from 'pg';

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
});

export interface Task {
  id: number;
  title: string;
  description?: string;
  isComplete: boolean;
  userId?: number;
}

export const createTask = async (task: Task): Promise<Task> => {
  const result = await pool.query(
    'INSERT INTO tasks (title, description, isComplete, userId) VALUES ($1, $2, $3, $4) RETURNING *',
    [task.title, task.description, task.isComplete, task.userId]
  );
  return result.rows[0];
};

export const getTasks = async (userId?: number): Promise<Task[]> => {
  const query = userId ? 'SELECT * FROM tasks WHERE userId = $1' : 'SELECT * FROM tasks';
  const values = userId ? [userId] : [];
  const result = await pool.query(query, values);
  return result.rows;
};

export const updateTask = async (id: number, task: Partial<Task>): Promise<Task> => {
  const fields = Object.keys(task).map((key, index) => `${key} = $${index + 1}`).join(', ');
  const values = Object.values(task);
  const result = await pool.query(
    `UPDATE tasks SET ${fields} WHERE id = $${values.length + 1} RETURNING *`,
    [...values, id]
  );
  return result.rows[0];
};

export const deleteTask = async (id: number): Promise<void> => {
  await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
};