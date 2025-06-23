import app from './app';
import { pool } from './utils/db';

const PORT = process.env.PORT || 5000;

pool.connect()
  .then(() => {
    console.log('Database connected successfully');
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err: Error) => {
    console.error('Database connection error', err.stack);
  });