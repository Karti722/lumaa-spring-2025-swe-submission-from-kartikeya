import React from 'react';
import { useSurvey } from '../hooks/useSurvey';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const { surveys, loading, error, refreshSurveys } = useSurvey();

  return (
    <div className="flex flex-col items-center justify-center p-4 w-full">
      <h1 className="text-4xl font-bold mb-4">Welcome to the Survey App</h1>
      <p className="mb-8 text-lg text-gray-700">Start a survey below. You can login or register at any time to save your results!</p>
      <div className="w-full max-w-md space-y-4">
        {loading && <div className="text-center">Loading surveys...</div>}
        {error && <div className="text-red-600 text-center">{error}</div>}
        {!loading && !error && surveys.length === 0 && (
          <div className="text-center">No surveys available.</div>
        )}
        {!loading && !error && surveys.map(survey => (
          <div key={survey.id} className="bg-white shadow rounded p-4 flex flex-col items-center">
            <span className="font-semibold">{survey.title}</span>
            <p className="text-gray-600 text-sm mb-2">{survey.description}</p>
            <Link to={`/survey/${survey.id}`} className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Start Survey</Link>
          </div>
        ))}
      </div>
      <button className="mt-8 text-blue-500 underline" onClick={refreshSurveys}>Refresh Surveys</button>
    </div>
  );
};

export default LandingPage;
