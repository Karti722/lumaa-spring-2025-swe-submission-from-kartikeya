import React, { useEffect, useState } from 'react';
import { API_BASE } from '../api';

const SeeAllSubmissionsPage: React.FC = () => {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      console.log('[ADMIN PAGE] Using token:', token);
    } else {
      console.warn('[ADMIN PAGE] No token found in localStorage.');
    }
    fetch(`${API_BASE}/admin/all-submissions`, {
      credentials: 'include',
      headers
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch all submissions');
        return res.json();
      })
      .then(data => {
        setSubmissions(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch all submissions');
        setLoading(false);
      });
  }, []);

  const handleDownload = async (fileType: string) => {
  const res = await fetch(`${API_BASE}/admin/download-survey-data`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ downloadFileType: fileType })
    });
    if (!res.ok) return alert('Download failed');
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `survey_data.${fileType}`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-4">
      <h2 className="text-2xl font-bold mb-4">All Survey Submissions</h2>
      <div className="mb-4 space-x-2">
        <button onClick={() => handleDownload('json')} className="bg-blue-600 text-white px-4 py-2 rounded">Download JSON</button>
        <button onClick={() => handleDownload('csv')} className="bg-blue-600 text-white px-4 py-2 rounded">Download CSV</button>
        <button onClick={() => handleDownload('txt')} className="bg-blue-600 text-white px-4 py-2 rounded">Download TXT</button>
      </div>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600">{error}</div>}
      {!loading && !error && (
        <div className="overflow-x-auto w-full max-w-4xl">
          <table className="min-w-full border">
            <thead>
              <tr>
                <th className="border px-2">Submission ID</th>
                <th className="border px-2">Survey Title</th>
                <th className="border px-2">User ID</th>
                <th className="border px-2">Submitted At</th>
                <th className="border px-2">Responses</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((sub: any) => (
                <tr key={sub.id}>
                  <td className="border px-2">{sub.id}</td>
                  <td className="border px-2">{sub.survey_title}</td>
                  <td className="border px-2">{sub.user_id}</td>
                  <td className="border px-2">{new Date(sub.submitted_at).toLocaleString()}</td>
                  <td className="border px-2">
                    {Array.isArray(sub.responses) && sub.responses.map((r: any, idx: number) => (
                      <div key={idx}>Q{r.question_id}: {r.answer}</div>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SeeAllSubmissionsPage;
