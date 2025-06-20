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
      'INSERT INTO tasks (userId, title, description, iscomplete) VALUES ($1, $2, $3, $4) RETURNING *',
      [userId, title, description, false]
    );
    console.log('Task created:', result.rows[0]);
    return result.rows[0];
  },
  updateTask: async (taskId: string, userId: string, title?: string, description?: string, isComplete?: boolean) => {
    // First, get the current task to preserve existing values
    const currentTaskResult = await pool.query(
      'SELECT * FROM tasks WHERE id = $1 AND userId = $2',
      [taskId, userId]
    );
    
    if (currentTaskResult.rows.length === 0) {
      throw new Error('Task not found or not authorized to update');
    }
    
    const currentTask = currentTaskResult.rows[0];
    console.log('Current task from DB:', currentTask);
    
    // Use provided values or fall back to current values
    // Note: PostgreSQL column names are lowercase, so isComplete becomes iscomplete
    const updatedTitle = title !== undefined ? title : currentTask.title;
    const updatedDescription = description !== undefined ? description : currentTask.description;
    const updatedIsComplete = isComplete !== undefined ? isComplete : currentTask.iscomplete;
    
    console.log(`Updating task ${taskId}: title=${updatedTitle}, description=${updatedDescription}, isComplete=${updatedIsComplete}`);
    
    const result = await pool.query(
      'UPDATE tasks SET title = $1, description = $2, iscomplete = $3 WHERE id = $4 AND userId = $5 RETURNING *',
      [updatedTitle, updatedDescription, updatedIsComplete, taskId, userId]
    );
    
    console.log('Task updated:', result.rows[0]);
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