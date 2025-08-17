import { 
  Survey, 
  Question, 
  Response, 
  SurveySubmission,
  createSurvey,
  getSurveys,
  getSurveyById,
  createQuestion,
  getQuestionsBySurveyId,
  createResponse,
  getResponsesBySession,
  createSurveySubmission,
  getSurveySubmissionBySession
} from '../models/surveyModel';
import { v4 as uuidv4 } from 'uuid';

export class SurveyService {
  // Survey operations
  async createSurvey(title: string, description?: string): Promise<Survey> {
    return await createSurvey({ title, description });
  }

  async getAllSurveys(): Promise<Survey[]> {
    return await getSurveys();
  }

  async getSurvey(id: number): Promise<Survey | null> {
    return await getSurveyById(id);
  }

  async getSurveyWithQuestions(id: number): Promise<(Survey & { questions: Question[] }) | null> {
    const survey = await getSurveyById(id);
    if (!survey) return null;

    const questions = await getQuestionsBySurveyId(id);
    return { ...survey, questions };
  }

  // Question operations
  async addQuestionToSurvey(
    surveyId: number,
    title: string,
    questionType: Question['question_type'],
    description?: string,
    options?: string[],
    required: boolean = false
  ): Promise<Question> {
    // Get the next order index
    const existingQuestions = await getQuestionsBySurveyId(surveyId);
    const orderIndex = existingQuestions.length;

    return await createQuestion({
      survey_id: surveyId,
      title,
      description,
      question_type: questionType,
      options,
      required,
      order_index: orderIndex
    });
  }

  async getQuestions(surveyId: number): Promise<Question[]> {
    return await getQuestionsBySurveyId(surveyId);
  }

  // Response operations
  async submitSurveyResponse(
    surveyId: number,
    responses: { questionId: number; answer: string }[],
    userId?: number
  ): Promise<{ sessionId: string; submissionId: number }> {
    const sessionId = uuidv4();
    
    // Create survey submission record
    const submission = await createSurveySubmission({
      survey_id: surveyId,
      user_id: userId,
      session_id: sessionId
    });

    // Create individual responses
    for (const response of responses) {
      await createResponse({
        survey_id: surveyId,
        question_id: response.questionId,
        user_id: userId,
        session_id: sessionId,
        answer: response.answer
      });
    }

    return { sessionId, submissionId: submission.id };
  }

  async getSurveySubmission(sessionId: string): Promise<SurveySubmission | null> {
    return await getSurveySubmissionBySession(sessionId);
  }

  async getResponsesForSession(sessionId: string): Promise<Response[]> {
    return await getResponsesBySession(sessionId);
  }

  // Helper method to create a sample survey
  async createSampleSurvey(): Promise<Survey> {
    const survey = await this.createSurvey(
      "User Demographics Survey",
      "Help us understand our users better by providing some demographic information"
    );

    // Add sample questions
    await this.addQuestionToSurvey(
      survey.id,
      "What is your full name?",
      "text",
      "Please enter your first and last name",
      undefined,
      true
    );

    await this.addQuestionToSurvey(
      survey.id,
      "What is your email address?",
      "email",
      "We'll use this to contact you if needed",
      undefined,
      true
    );

    await this.addQuestionToSurvey(
      survey.id,
      "What is your age?",
      "number",
      "Please enter your age in years",
      undefined,
      true
    );

    await this.addQuestionToSurvey(
      survey.id,
      "What is your current employment status?",
      "radio",
      "Select the option that best describes your current situation",
      ["Employed full-time", "Employed part-time", "Self-employed", "Unemployed", "Student", "Retired"],
      true
    );

    await this.addQuestionToSurvey(
      survey.id,
      "Which of these best describes your household income?",
      "select",
      "Select your annual household income range",
      ["Under 25,000", "25,000 - 49,999", "50,000 - 74,999", "75,000 - 99,999", "100,000 - 149,999", "150,000+", "Prefer not to say"]
    );

    await this.addQuestionToSurvey(
      survey.id,
      "Do you have any chronic health conditions?",
      "checkbox",
      "Check all that apply",
      ["Diabetes", "Heart disease", "High blood pressure", "Arthritis", "Depression/Anxiety", "Asthma", "None of the above"]
    );

    await this.addQuestionToSurvey(
      survey.id,
      "Tell us about your long-term care concerns",
      "textarea",
      "What concerns you most about potential future care needs? (Optional)"
    );

    return survey;
  }
}

export const surveyService = new SurveyService();
