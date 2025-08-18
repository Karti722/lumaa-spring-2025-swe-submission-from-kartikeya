import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { API_BASE } from '../api';

interface SubmissionDetail {
  id: string;
  surveyTitle: string;
  createdAt: string;
  answers: Array<{ question: string; response: string }>;

}

const SubmissionDetailPage: React.FC = () => {
  const { submissionId, username } = useParams();
  const { token, user } = useAuth();
  const [detail, setDetail] = useState<SubmissionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token || !submissionId) return;
    setLoading(true);
    fetch(`${API_BASE}/surveys/submissions/${submissionId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch submission');
        return res.json();
      })
      .then(data => {
        setDetail(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch submission');
        setLoading(false);
      });
  }, [token, submissionId]);

  if (!user || user.username !== username) {
    return <div className="flex justify-center items-center min-h-screen text-red-600">Unauthorized or not logged in.</div>;
  }

  if (loading) return <div className="flex justify-center items-center min-h-screen">Loading submission...</div>;
  if (error || !detail) return <div className="flex justify-center items-center min-h-screen text-red-600">{error || 'Submission not found.'}</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h2 className="text-2xl font-bold mb-4">{detail.surveyTitle} - Submission Details</h2>
      <div className="bg-white shadow rounded p-6 w-full max-w-lg">
        <div className="mb-2 text-gray-600">Submitted: {new Date(detail.createdAt).toLocaleString()}</div>
        {detail.answers.map((a, idx) => (
          <div key={idx} className="mb-4">
            <div className="font-semibold">{a.question}</div>
            <div className="text-gray-800">{a.response}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubmissionDetailPage;
