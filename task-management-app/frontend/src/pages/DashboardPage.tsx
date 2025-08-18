import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { fetchUserSubmissions } from '../api';
import { Link, useParams } from 'react-router-dom';

interface Submission {
  id: string;
  surveyTitle: string;
  createdAt: string;
}

const DashboardPage: React.FC = () => {
  const { user, token } = useAuth();
  const { username } = useParams();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    fetchUserSubmissions(token)
      .then(data => {
        setSubmissions(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch submissions');
        setLoading(false);
      });
  }, [token]);

  // Group submissions by survey title
  const grouped = submissions.reduce((acc, sub) => {
    acc[sub.surveyTitle] = acc[sub.surveyTitle] || [];
    acc[sub.surveyTitle].push(sub);
    return acc;
  }, {} as Record<string, Submission[]>);

  if (!user || user.username !== username) {
    return <div className="flex justify-center items-center min-h-screen text-red-600">Unauthorized or not logged in.</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h2 className="text-2xl font-bold mb-4">Survey Submissions</h2>
      <div className="w-full max-w-2xl space-y-4">
        {loading && <div>Loading submissions...</div>}
        {error && <div className="text-red-600">{error}</div>}
        {!loading && !error && Object.keys(grouped).length === 0 && (
          <div>No submissions found.</div>
        )}
        {!loading && !error && Object.entries(grouped).map(([title, subs]) => (
          <div key={title} className="bg-white shadow rounded p-4 mb-4">
            <span className="font-semibold">{title}</span>
            <div className="mt-2 space-y-2">
              {subs.map(sub => (
                <Link
                  key={sub.id}
                  to={`/${user.username}-survey-submissions/${sub.id}`}
                  className="block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  View Submission ({new Date(sub.createdAt).toLocaleString()})
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;
