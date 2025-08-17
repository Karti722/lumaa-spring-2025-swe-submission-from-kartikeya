import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import taskRoutes from './routes/taskRoutes';
import surveyRoutes from './routes/surveyRoutes';

const app = express();

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'Survey App Backend',
    version: '1.0.0'
  });
});

app.use('/auth', authRoutes);
app.use('/api', surveyRoutes);
app.use('/', taskRoutes);

export default app;