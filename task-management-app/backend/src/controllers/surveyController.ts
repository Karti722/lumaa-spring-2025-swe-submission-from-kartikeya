import { Request, Response } from 'express';
import { surveyService } from '../services/surveyService';

interface AuthenticatedRequest extends Request {
  user?: { userId: string };
  body: any;
  params: any;
}

// Survey management endpoints
export const getSurveys = async (req: Request, res: Response) => {
  try {
    const surveys = await surveyService.getAllSurveys();
    res.json(surveys);
  } catch (error) {
    console.error('Error fetching surveys:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getSurvey = async (req: Request, res: Response) => {
  try {
    const surveyId = parseInt(req.params.id);
    const survey = await surveyService.getSurveyWithQuestions(surveyId);
    
    if (!survey) {
      return res.status(404).json({ error: 'Survey not found' });
    }
    
    res.json(survey);
  } catch (error) {
    console.error('Error fetching survey:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const createSurvey = async (req: Request, res: Response) => {
  try {
    const { title, description } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: 'Survey title is required' });
    }
    
    const survey = await surveyService.createSurvey(title, description);
    res.status(201).json(survey);
  } catch (error) {
    console.error('Error creating survey:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Question management endpoints
export const addQuestionToSurvey = async (req: Request, res: Response) => {
  try {
    const surveyId = parseInt(req.params.id);
    const { title, description, questionType, options, required } = req.body;
    
    if (!title || !questionType) {
      return res.status(400).json({ error: 'Question title and type are required' });
    }
    
    const question = await surveyService.addQuestionToSurvey(
      surveyId,
      title,
      questionType,
      description,
      options,
      required
    );
    
    res.status(201).json(question);
  } catch (error) {
    console.error('Error adding question:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Response submission endpoints
export const submitSurveyResponse = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const surveyId = parseInt(req.params.id);
    const { responses } = req.body;
    
    if (!responses || !Array.isArray(responses)) {
      return res.status(400).json({ error: 'Responses are required and must be an array' });
    }
    
    // Validate response format
    for (const response of responses) {
      if (!response.questionId || response.answer === undefined) {
        return res.status(400).json({ 
          error: 'Each response must have questionId and answer' 
        });
      }
    }
    
    const userId = req.user ? parseInt(req.user.userId) : undefined;
    const result = await surveyService.submitSurveyResponse(surveyId, responses, userId);
    
    res.status(201).json({
      message: 'Survey response submitted successfully',
      sessionId: result.sessionId,
      submissionId: result.submissionId
    });
  } catch (error) {
    console.error('Error submitting survey response:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getSurveySubmission = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const submission = await surveyService.getSurveySubmission(sessionId);
    
    if (!submission) {
      return res.status(404).json({ error: 'Survey submission not found' });
    }
    
    res.json(submission);
  } catch (error) {
    console.error('Error fetching survey submission:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Utility endpoint to create sample survey
export const createSampleSurvey = async (req: Request, res: Response) => {
  try {
    const survey = await surveyService.createSampleSurvey();
    res.status(201).json({
      message: 'Sample survey created successfully',
      survey
    });
  } catch (error) {
    console.error('Error creating sample survey:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
