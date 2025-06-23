import { pool } from '../utils/db';

export interface User {
  id: number;
  username: string;
  password: string;
}

export const createUser = async (username: string, password: string): Promise<User> => {
  const result = await pool.query(
    'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *',
    [username, password]
  );
  return result.rows[0];
};

export const findUserById = async (id: number): Promise<User | null> => {
  const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
  return result.rows.length ? result.rows[0] : null;
};

export const findUserByUsername = async (username: string): Promise<User | null> => {
  const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
  return result.rows.length ? result.rows[0] : null;
};