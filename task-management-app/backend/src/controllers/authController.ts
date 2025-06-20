import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../utils/db';

export const register = async (req: Request, res: Response) => {
    const { username, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(
            'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *',
            [username, hashedPassword]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const login = async (req: Request, res: Response) => {
    const { username, password } = req.body;
    try {
        const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        const user = result.rows[0];
        if (!user) {
            return res.status(401).json({ error: 'User not found. Please register.' });
        }
        if (user && (await bcrypt.compare(password, user.password))) {
            const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '1h' });
            res.json({ token });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


export const deleteUser = async (req: Request, res: Response) => {
    const { username } = req.body;
    try {
        // Get user id by username
        const userResult = await pool.query('SELECT id FROM users WHERE username = $1', [username]);
        const user = userResult.rows[0];
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Delete all tasks for this user using userId
        await pool.query('DELETE FROM tasks WHERE userId = $1', [user.id]);

        // Delete the user
        const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [user.id]);
        res.json({ message: 'User and their tasks deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};