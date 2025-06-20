import { Pool } from 'pg';

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
});

export interface Shape {
  id: number;
  type: string; // e.g., 'Box', 'Sphere', etc.
  color: string;
  position: { x: number; y: number; z: number };
  size: { width: number; height: number; depth: number }; // adjust as needed for your shapes
  metadata?: any; // for any extra three.js-specific data
}

export const createShape = async (
  user_id: number, // <-- Add this parameter
  type: string,
  color: string,
  position: { x: number; y: number; z: number },
  size: { width: number; height: number; depth: number },
  metadata?: any
): Promise<Shape> => {
  const result = await pool.query(
    `INSERT INTO shapes (user_id, type, color, position, size, metadata)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [user_id, type, color, position, size, metadata]
  );
  return result.rows[0];
};

export const findShapeById = async (id: number): Promise<Shape | null> => {
  const result = await pool.query('SELECT * FROM shapes WHERE id = $1', [id]);
  return result.rows.length ? result.rows[0] : null;
};

export const getAllShapes = async (): Promise<Shape[]> => {
  const result = await pool.query('SELECT * FROM shapes');
  return result.rows;
};

export const getShapesByUser = async (user_id: number): Promise<Shape[]> => {
  const result = await pool.query('SELECT * FROM shapes WHERE user_id = $1', [user_id]);
  return result.rows;
};