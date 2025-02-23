import { Router } from 'express';
import { authenticate } from '../utils/jwt';
import { getTasks, createTask, updateTask, deleteTask } from '../controllers/taskController';

const router = Router();

router.get('/tasks', authenticate, getTasks);
router.post('/tasks', authenticate, createTask);
router.put('/tasks/:id', authenticate, updateTask);
router.delete('/tasks/:id', authenticate, deleteTask);

export default router;