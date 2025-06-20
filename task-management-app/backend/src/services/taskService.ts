import { pool } from '../utils/db';

export const taskService = {
  getTasks: async (userId: string) => {
    console.log(`Fetching tasks for userId: ${userId}`);
    const result = await pool.query('SELECT * FROM tasks WHERE userId = $1', [userId]);
    console.log('Tasks fetched:', result.rows);
    return result.rows;
  },
  createTask: async (userId: string, title: string, description: string) => {
    console.log(`Creating task for userId: ${userId}, title: ${title}, description: ${description}`);
    const result = await pool.query(
      'INSERT INTO tasks (userId, title, description) VALUES ($1, $2, $3) RETURNING *',
      [userId, title, description]
    );
    console.log('Task created:', result.rows[0]);
    return result.rows[0];
  },
  updateTask: async (taskId: string, userId: string, title: string, description: string, isComplete: boolean) => {
    const result = await pool.query(
      'UPDATE tasks SET title = $1, description = $2, isComplete = $3 WHERE id = $4 AND userId = $5 RETURNING *',
      [title, description, isComplete, taskId, userId]
    );
    return result.rows[0];
  },
  deleteTask: async (taskId: string, userId: string) => {
    console.log(`Deleting task with id: ${taskId} for userId: ${userId}`);
    const result = await pool.query('DELETE FROM tasks WHERE id = $1 AND userId = $2 RETURNING *', [taskId, userId]);
    console.log('Delete result:', result.rows);
    if (result.rowCount === 0) {
      throw new Error('Task not found or not authorized to delete');
    }
    return result.rows[0];
  }
};