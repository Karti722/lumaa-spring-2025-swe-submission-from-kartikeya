import { Request, Response } from 'express';
import { taskService } from '../services/taskService';

interface AuthenticatedRequest extends Request {
  user?: { userId: string };
  body: any;
  params: any;
}

export const getTasks = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    console.log(`Received request to get tasks for user: ${req.user.userId}`);
    const tasks = await taskService.getTasks(req.user.userId);
    console.log('Returning tasks:', tasks);
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const createTask = async (req: AuthenticatedRequest, res: Response) => {
  const { title, description } = req.body;
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    console.log(`Received request to create task for user: ${req.user.userId}`);
    const task = await taskService.createTask(req.user.userId, title, description);
    console.log('Returning created task:', task);
    res.status(201).json(task);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const updateTask = async (req: AuthenticatedRequest, res: Response) => {
  const { title, description, isComplete } = req.body;
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    console.log(`Received request to update task ${req.params.id} for user: ${req.user.userId}`);
    console.log('Update data:', { title, description, isComplete });
    
    const task = await taskService.updateTask(req.params.id, req.user.userId, title, description, isComplete);
    console.log('Task updated successfully:', task);
    res.json(task);
  } catch (error) {
    console.error('Error updating task:', error);
    if (error instanceof Error && error.message === 'Task not found or not authorized to update') {
      res.status(404).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const deleteTask = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    console.log(`Received request to delete task ${req.params.id} for user: ${req.user.userId}`);
    const deletedTask = await taskService.deleteTask(req.params.id, req.user.userId);
    console.log('Task deleted successfully:', deletedTask);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting task:', error);
    if (error instanceof Error && error.message === 'Task not found or not authorized to delete') {
      res.status(404).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: 'Internal Server Error' });
  }
};