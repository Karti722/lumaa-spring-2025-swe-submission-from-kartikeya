import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSurvey } from '../hooks/useSurvey';
import { API_BASE } from '../api';
import { useAuth } from '../hooks/useAuth';
import { submitSurveyResponse } from '../api';
import type { Survey } from '../contexts/SurveyContext';

const SurveyPage: React.FC = () => {
  const { surveyId } = useParams<{ surveyId: string }>();
  // Always fetch latest survey details directly from backend
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [survey, setSurvey] = useState<Survey | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // answers: questionId -> string (for text, textarea, select, radio)
  const [answers, setAnswers] = useState<{ [questionId: string]: string }>({});
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [showEndOptions, setShowEndOptions] = useState(false);

  useEffect(() => {
    if (!surveyId) return;
    setLoading(true);
    fetch(`${API_BASE}/surveys/${surveyId}`)
      .then(res => {
        if (!res.ok) throw new Error('Survey not found');
        return res.json();
      })
      .then(s => {
        // Map backend question fields to frontend expected fields
        const mappedSurvey = {
          ...s,
          questions: Array.isArray(s.questions)
            ? s.questions.map((q: any) => ({
                ...q,
                text: q.text || q.title || '',
                type: q.type || q.question_type || 'text',
              }))
            : [],
        };
        setSurvey(mappedSurvey);
        setLoading(false);
      })
      .catch(() => {
        setError('Survey not found');
        setLoading(false);
      });
  }, [surveyId]);

  if (loading) return <div className="flex justify-center items-center min-h-screen">Loading survey...</div>;
  if (error || !survey) return <div className="flex justify-center items-center min-h-screen text-red-600">{error || 'Survey not found.'}</div>;

  const questions = survey?.questions ?? [];
  const currentQuestion = questions[step];
  const isLast = step === questions.length - 1;

  // Defensive: If no questions, show message
  if (!questions.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h2 className="text-2xl font-bold mb-4">{survey.title}</h2>
        <div className="bg-white shadow rounded p-6 w-full max-w-lg text-center">
          <p className="text-red-600">This survey has no questions.</p>
        </div>
      </div>
    );
  }
  if (!currentQuestion) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h2 className="text-2xl font-bold mb-4">{survey.title}</h2>
        <div className="bg-white shadow rounded p-6 w-full max-w-lg text-center">
          <p className="text-red-600">No more questions available.</p>
        </div>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setAnswers({ ...answers, [currentQuestion.id]: e.target.value });
  };

  const handleNext = () => {
    if (isLast) {
      setShowEndOptions(true);
    } else {
      setStep(step + 1);
    }
  };

  const handlePrev = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleAnonymousSubmit = async () => {
    setSubmitting(true);
    try {
      // Convert answers object to array of { questionId, answer }
      const responses = Object.entries(answers).map(([questionId, answer]) => ({
        questionId: Number(questionId),
        answer
      }));
      await submitSurveyResponse(survey.id, { responses });
      navigate('/thank-you');
    } catch {
      alert('Failed to submit survey.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUserSubmit = async () => {
    setSubmitting(true);
    try {
      const responses = Object.entries(answers).map(([questionId, answer]) => ({
        questionId: Number(questionId),
        answer
      }));
      console.log('Submitting survey with user:', user);
      await submitSurveyResponse(survey.id, { responses, user });
      navigate(`/${user?.username}-survey-submissions`);
    } catch {
      alert('Failed to submit survey.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="bg-white shadow rounded p-6 w-full max-w-lg">
        {!showEndOptions ? (
          <>
            <div className="mb-4">
              <p className="font-semibold mb-2">{currentQuestion.text}</p>
              {currentQuestion.type === 'text' && (
                <input
                  className="w-full border rounded px-3 py-2"
                  type="text"
                  value={answers[currentQuestion.id] ?? ''}
                  onChange={handleChange}
                />
              )}
              {currentQuestion.type === 'email' && (
                <input
                  className="w-full border rounded px-3 py-2"
                  type="email"
                  value={answers[currentQuestion.id] ?? ''}
                  onChange={handleChange}
                />
              )}
              {currentQuestion.type === 'tel' && (
                <input
                  className="w-full border rounded px-3 py-2"
                  type="tel"
                  value={answers[currentQuestion.id] ?? ''}
                  onChange={handleChange}
                />
              )}
              {currentQuestion.type === 'number' && (
                <input
                  className="w-full border rounded px-3 py-2"
                  type="number"
                  value={answers[currentQuestion.id] ?? ''}
                  onChange={handleChange}
                />
              )}
              {currentQuestion.type === 'textarea' && (
                <textarea
                  className="w-full border rounded px-3 py-2"
                  value={answers[currentQuestion.id] ?? ''}
                  onChange={handleChange}
                />
              )}
              {currentQuestion.type === 'select' && currentQuestion.options && (
                <select
                  className="w-full border rounded px-3 py-2"
                  value={answers[currentQuestion.id] ?? ''}
                  onChange={handleChange}
                >
                  <option value="">Select...</option>
                  {currentQuestion.options.map((opt: string) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              )}
              {currentQuestion.type === 'radio' && currentQuestion.options && (
                <div className="space-y-2 mt-2">
                  {currentQuestion.options.map((opt: string) => (
                    <label key={opt} className="flex items-center">
                      <input
                        type="radio"
                        name={currentQuestion.id}
                        value={opt}
                        checked={answers[currentQuestion.id] === opt}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              )}
            </div>
            <div className="flex justify-between mt-6">
              <button
                className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
                onClick={handlePrev}
                disabled={step === 0}
              >
                Previous
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
                onClick={handleNext}
                disabled={!answers[currentQuestion.id]}
              >
                {isLast ? 'Finish' : 'Next'}
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col space-y-2 mt-8">
            {!user && (
              <>
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  onClick={() => {
                    localStorage.setItem('pendingSurvey', JSON.stringify({ surveyId, answers }));
                    navigate('/login', { state: { fromSurvey: true, surveyId } });
                  }}
                  disabled={submitting}
                >
                  Login
                </button>
                <button
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  onClick={() => {
                    localStorage.setItem('pendingSurvey', JSON.stringify({ surveyId, answers }));
                    navigate('/register', { state: { fromSurvey: true, surveyId } });
                  }}
                  disabled={submitting}
                >
                  Register
                </button>
                <button
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                  onClick={handleAnonymousSubmit}
                  disabled={submitting}
                >
                  Submit Anonymously
                </button>
              </>
            )}
            {user && (
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={handleUserSubmit}
                disabled={submitting}
              >
                Submit as {user.username}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SurveyPage;
