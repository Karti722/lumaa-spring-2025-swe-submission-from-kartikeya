import { pool } from '../utils/db';

export interface Survey {
  id: number;
  title: string;
  description?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Question {
  id: number;
  survey_id: number;
  title: string;
  description?: string;
  question_type: 'text' | 'number' | 'email' | 'tel' | 'textarea' | 'select' | 'radio' | 'checkbox';
  options?: string[]; // For select, radio, checkbox types
  required: boolean;
  order_index: number;
}

export interface Response {
  id: number;
  survey_id: number;
  question_id: number;
  user_id?: number;
  session_id: string; // For anonymous responses
  answer: string;
  submitted_at: Date;
}

export interface SurveySubmission {
  id: number;
  survey_id: number;
  user_id?: number;
  session_id: string;
  submitted_at: Date;
  responses: Response[];
}

// Survey CRUD operations
export const createSurvey = async (survey: Omit<Survey, 'id' | 'created_at' | 'updated_at'>): Promise<Survey> => {
  const result = await pool.query(
    'INSERT INTO surveys (title, description) VALUES ($1, $2) RETURNING *',
    [survey.title, survey.description]
  );
  return result.rows[0];
};

export const getSurveys = async (): Promise<Survey[]> => {
  const result = await pool.query('SELECT * FROM surveys ORDER BY created_at DESC');
  return result.rows;
};

export const getSurveyById = async (id: number): Promise<Survey | null> => {
  const result = await pool.query('SELECT * FROM surveys WHERE id = $1', [id]);
  return result.rows[0] || null;
};

// Question CRUD operations
export const createQuestion = async (question: Omit<Question, 'id'>): Promise<Question> => {
  const result = await pool.query(
    'INSERT INTO questions (survey_id, title, description, question_type, options, required, order_index) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
    [question.survey_id, question.title, question.description, question.question_type, JSON.stringify(question.options), question.required, question.order_index]
  );
  const row = result.rows[0];
  return {
    ...row,
    options: row.options ? JSON.parse(row.options) : null
  };
};

export const getQuestionsBySurveyId = async (surveyId: number): Promise<Question[]> => {
  const result = await pool.query(
    'SELECT * FROM questions WHERE survey_id = $1 ORDER BY order_index ASC',
    [surveyId]
  );
  return result.rows.map(row => ({
    ...row,
    options: row.options ? JSON.parse(row.options) : null
  }));
};

// Response operations
export const createResponse = async (response: Omit<Response, 'id' | 'submitted_at'>): Promise<Response> => {
  const result = await pool.query(
    'INSERT INTO responses (survey_id, question_id, user_id, session_id, answer) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [response.survey_id, response.question_id, response.user_id, response.session_id, response.answer]
  );
  return result.rows[0];
};

export const getResponsesBySession = async (sessionId: string): Promise<Response[]> => {
  const result = await pool.query('SELECT * FROM responses WHERE session_id = $1', [sessionId]);
  return result.rows;
};

export const createSurveySubmission = async (submission: Omit<SurveySubmission, 'id' | 'submitted_at' | 'responses'>): Promise<SurveySubmission> => {
  const result = await pool.query(
    'INSERT INTO survey_submissions (survey_id, user_id, session_id) VALUES ($1, $2, $3) RETURNING *',
    [submission.survey_id, submission.user_id, submission.session_id]
  );
  return result.rows[0];
};

export const getSurveySubmissionBySession = async (sessionId: string): Promise<SurveySubmission | null> => {
  const result = await pool.query(
    `SELECT ss.*, 
       json_agg(
         json_build_object(
           'id', r.id,
           'question_id', r.question_id,
           'answer', r.answer,
           'submitted_at', r.submitted_at
         )
       ) as responses
     FROM survey_submissions ss
     LEFT JOIN responses r ON ss.session_id = r.session_id
     WHERE ss.session_id = $1
     GROUP BY ss.id`,
    [sessionId]
  );
  return result.rows[0] || null;
};
