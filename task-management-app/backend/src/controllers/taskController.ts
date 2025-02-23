import { Request, Response } from 'express';
import { taskService } from '../services/taskService';

interface AuthenticatedRequest extends Request {
  user?: { userId: string };
}

export const getTasks = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
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
      return res.status(401).json({ error: 'Unauthorized' });
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
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const task = await taskService.updateTask(req.params.id, title, description, isComplete);
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const deleteTask = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    await taskService.deleteTask(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};