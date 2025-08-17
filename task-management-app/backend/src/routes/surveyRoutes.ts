import express from 'express';
import {
  getSurveys,
  getSurvey,
  createSurvey,
  addQuestionToSurvey,
  submitSurveyResponse,
  getSurveySubmission,
  createSampleSurvey,
  getUserSubmissions,
  deleteUserSubmission
} from '../controllers/surveyController';

const router = express.Router();

// Public routes - no authentication required
router.get('/surveys', getSurveys);
router.get('/surveys/:id', getSurvey);
router.post('/surveys/:id/submit', submitSurveyResponse);
router.get('/submissions/:sessionId', getSurveySubmission);

// Authenticated user: get all their submissions
router.get('/my-submissions', getUserSubmissions);
// Authenticated user: delete one of their submissions
router.delete('/my-submissions/:submissionId', deleteUserSubmission);

// Admin routes - could add authentication later
router.post('/surveys', createSurvey);
router.post('/surveys/:id/questions', addQuestionToSurvey);

// Utility route for development
router.post('/surveys/sample/create', createSampleSurvey);

export default router;
