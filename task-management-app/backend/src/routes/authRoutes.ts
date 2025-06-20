import { Router } from 'express';
import { register, login, deleteUser } from '../controllers/authController';

const router = Router();

// Route for user registration
router.post('/register', register);

// Route for user login
router.post('/login', login);

// Route for deleting a user
router.delete('/delete', deleteUser);

export default router;