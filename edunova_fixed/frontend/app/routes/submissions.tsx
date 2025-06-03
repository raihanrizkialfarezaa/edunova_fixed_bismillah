import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../lib/axios';

interface Submission {
  id: number;
  type: 'quiz' | 'assignment';
  title: string;
  course: { id: number; title: string };
  score: number;
  status: string;
  submittedAt: string;
  gradedAt?: string;
  feedback?: string;
  isLate?: boolean;
  fileName?: string;
  fileUrl?: string;
  student?: {
    id: number;
    name: string;
    email: string;
  };
}

export default function Submissions() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ type: '', status: '' });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchSubmissions();
  }, [user, filter.type, filter.status]);

  const fetchSubmissions = async () => {
    setLoading(true);
    setError(null);
    try {
      let endpoint = '';

      if (user?.role === 'INSTRUCTOR') {
        endpoint = '/instructor/submissions';
      } else if (user?.role === 'ADMIN') {
        endpoint = '/admin/submissions';
      } else {
        // Student
        endpoint = '/student/submissions';
      }

      const params = new URLSearchParams();
      if (filter.type) params.append('type', filter.type);
      if (filter.status) params.append('status', filter.status);

      console.log('Fetching from:', `${endpoint}?${params}`);

      const response = await axiosInstance.get(`${endpoint}?${params}`);

      console.log('API Response:', response.data);

      const submissionsData = response.data.submissions || response.data.data || [];

      // Normalisasi data submissions
      const normalizedSubmissions = submissionsData.map((submission: any) => {
        return {
          id: submission.id,
          type: submission.type || submission.submissionType || 'quiz',
          title: submission.title || submission.quiz?.title || submission.assignment?.title || submission.QuizSubmission?.quiz?.title || submission.AssignmentSubmission?.assignment?.title || 'Judul Tidak Tersedia',
          course: {
            id:
              submission.course?.id ||
              submission.quiz?.lesson?.section?.course?.id ||
              submission.assignment?.course?.id ||
              submission.QuizSubmission?.quiz?.lesson?.section?.course?.id ||
              submission.AssignmentSubmission?.assignment?.course?.id ||
              0,
            title:
              submission.course?.title ||
              submission.quiz?.lesson?.section?.course?.title ||
              submission.assignment?.course?.title ||
              submission.QuizSubmission?.quiz?.lesson?.section?.course?.title ||
              submission.AssignmentSubmission?.assignment?.course?.title ||
              'Kursus Tidak Tersedia',
          },
          score: submission.score ?? null,
          status: submission.status || 'SUBMITTED',
          submittedAt: submission.submittedAt || submission.createdAt,
          gradedAt: submission.gradedAt,
          feedback: submission.feedback,
          isLate: submission.isLate || false,
          fileName: submission.fileName,
          fileUrl: submission.fileUrl,
          student: submission.student || submission.user || null,
        };
      });

      console.log('Normalized submissions:', normalizedSubmissions);
      setSubmissions(normalizedSubmissions);
    } catch (error: any) {
      console.error('Failed to fetch submissions:', error);
      console.error('Error response:', error.response?.data);

      // Jika endpoint admin tidak ada, menggunakan instructor endpoint
      if (user?.role === 'ADMIN' && error.response?.status === 404) {
        try {
          console.log('Trying fallback endpoint for admin...');
          const fallbackResponse = await axiosInstance.get('/instructor/submissions');
          const submissionsData = fallbackResponse.data.submissions || [];

          const normalizedSubmissions = submissionsData.map((submission: any) => ({
            id: submission.id,
            type: submission.type || 'quiz',
            title: submission.title || submission.quiz?.title || submission.assignment?.title || 'Judul Tidak Tersedia',
            course: {
              id: submission.course?.id || 0,
              title: submission.course?.title || 'Kursus Tidak Tersedia',
            },
            score: submission.score ?? null,
            status: submission.status || 'SUBMITTED',
            submittedAt: submission.submittedAt || submission.createdAt,
            gradedAt: submission.gradedAt,
            feedback: submission.feedback,
            isLate: submission.isLate || false,
            fileName: submission.fileName,
            fileUrl: submission.fileUrl,
            student: submission.student || submission.user || null,
          }));

          setSubmissions(normalizedSubmissions);
        } catch (fallbackError) {
          console.error('Fallback request also failed:', fallbackError);
          setError('Gagal mengambil data submissions. Endpoint mungkin tidak tersedia.');
          setSubmissions([]);
        }
      } else {
        setError(error.response?.data?.message || 'Gagal mengambil data submissions');
        setSubmissions([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const gradeSubmission = async (id: number, type: string, score: number, feedback: string) => {
    try {
      await axiosInstance.put(`/submissions/${id}/grade?type=${type}`, {
        score,
        feedback,
      });
      fetchSubmissions();
      alert('Penyerahan berhasil dinilai');
    } catch (error: any) {
      console.error('Failed to grade submission:', error);
      alert(error.response?.data?.message || 'Gagal menilai penyerahan');
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-950 text-white font-sans">
        <p className="text-lg animate-pulse">Memuat...</p>
      </div>
    );

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 text-gray-100 font-sans p-8">
        <div className="max-w-6xl mx-auto bg-gray-900 p-8 rounded-xl shadow-lg border border-gray-800">
          <h1 className="text-3xl font-extrabold text-blue-400 mb-6">{user?.role === 'ADMIN' ? 'Semua Penyerahan' : user?.role === 'INSTRUCTOR' ? 'Nilai Penyerahan' : 'Penyerahan Saya'}</h1>
          <div className="bg-red-900 bg-opacity-30 text-red-400 p-6 rounded-lg text-center border border-red-700">
            <p className="text-lg mb-4">{error}</p>
            <button
              onClick={() => {
                setError(null);
                fetchSubmissions();
              }}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Coba Lagi
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (submissions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-950 text-gray-100 font-sans p-8">
        <div className="max-w-6xl mx-auto bg-gray-900 p-8 rounded-xl shadow-lg border border-gray-800">
          <h1 className="text-3xl font-extrabold text-blue-400 mb-6">{user?.role === 'ADMIN' ? 'Semua Penyerahan' : user?.role === 'INSTRUCTOR' ? 'Nilai Penyerahan' : 'Penyerahan Saya'}</h1>
          <div className="bg-gray-800 rounded-lg shadow p-8 text-center border border-gray-700">
            <p className="text-gray-400 text-lg mb-2">Tidak ada penyerahan ditemukan.</p>
            {user?.role === 'STUDENT' && <p className="text-sm text-gray-500 mt-2">Ikuti beberapa kuis atau kirimkan tugas untuk melihatnya di sini.</p>}
            {(filter.type || filter.status) && <p className="text-sm text-gray-500 mt-4">(Tidak ada hasil untuk filter saat ini. Coba ubah filter Anda.)</p>}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-sans p-8">
      <div className="max-w-6xl mx-auto bg-gray-900 p-8 rounded-xl shadow-lg border border-gray-800">
        <h1 className="text-3xl font-extrabold text-blue-400 mb-6">{user?.role === 'ADMIN' ? 'Semua Penyerahan' : user?.role === 'INSTRUCTOR' ? 'Nilai Penyerahan' : 'Penyerahan Saya'}</h1>

        <div className="bg-gray-800 rounded-lg shadow border border-gray-700 mb-6">
          <div className="p-4 border-b border-gray-700 flex flex-col sm:flex-row gap-4">
            <label htmlFor="type-filter" className="sr-only">
              Filter Berdasarkan Tipe
            </label>
            <select
              id="type-filter"
              value={filter.type}
              onChange={(e) => setFilter({ ...filter, type: e.target.value })}
              className="border border-gray-600 rounded px-4 py-2 bg-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Semua Tipe</option>
              <option value="quiz">Kuis</option>
              <option value="assignment">Tugas</option>
            </select>

            <label htmlFor="status-filter" className="sr-only">
              Filter Berdasarkan Status
            </label>
            <select
              id="status-filter"
              value={filter.status}
              onChange={(e) => setFilter({ ...filter, status: e.target.value })}
              className="border border-gray-600 rounded px-4 py-2 bg-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Semua Status</option>
              <option value="SUBMITTED">Diserahkan</option>
              <option value="GRADED">Dinilai</option>
              <option value="LATE_SUBMITTED">Terlambat</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-700">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Tipe
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Judul
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Kursus
                  </th>
                  {(user?.role === 'ADMIN' || user?.role === 'INSTRUCTOR') && (
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Siswa
                    </th>
                  )}
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Nilai
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Diserahkan
                  </th>
                  {(user?.role === 'INSTRUCTOR' || user?.role === 'ADMIN') && (
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Aksi
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {submissions.map((submission) => (
                  <SubmissionRow key={submission.id} submission={submission} userRole={user?.role || 'STUDENT'} onGrade={gradeSubmission} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function SubmissionRow({ submission, userRole, onGrade }: { submission: Submission; userRole: string; onGrade: (id: number, type: string, score: number, feedback: string) => void }) {
  const [grading, setGrading] = useState(false);
  const [gradeForm, setGradeForm] = useState({ score: '', feedback: '' });

  useEffect(() => {
    if (grading && submission.status === 'GRADED') {
      setGradeForm({
        score: submission.score !== null && submission.score !== undefined ? String(submission.score) : '',
        feedback: submission.feedback || '',
      });
    } else if (!grading) {
      setGradeForm({ score: '', feedback: '' });
    }
  }, [grading, submission.score, submission.feedback, submission.status]);

  const handleGrade = () => {
    const score = parseFloat(gradeForm.score);
    if (isNaN(score) || score < 0) {
      alert('Silakan masukkan nilai yang valid');
      return;
    }

    if (submission.type === 'quiz' && score > 100) {
      alert('Nilai kuis tidak boleh melebihi 100%');
      return;
    }

    onGrade(submission.id, submission.type, score, gradeForm.feedback);
    setGrading(false);
    setGradeForm({ score: '', feedback: '' });
  };

  return (
    <tr className="hover:bg-gray-700 transition-colors duration-150">
      <td className="px-4 py-3 whitespace-nowrap">
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${submission.type === 'quiz' ? 'bg-blue-900 text-blue-300' : 'bg-green-900 text-green-300'}`}>
          {submission.type ? submission.type.toUpperCase() : 'TIDAK DIKETAHUI'}
        </span>
      </td>
      <td className="px-4 py-3 text-gray-200" title={submission.title}>
        {submission.title}
      </td>
      <td className="px-4 py-3 text-gray-300" title={submission.course?.title}>
        {submission.course?.title}
      </td>
      {(userRole === 'ADMIN' || userRole === 'INSTRUCTOR') && <td className="px-4 py-3 text-gray-300">{submission.student?.name || 'Siswa Tidak Diketahui'}</td>}
      <td className="px-4 py-3 text-gray-200">{submission.score !== null && submission.score !== undefined ? `${submission.score}${submission.type === 'quiz' ? '%' : ' poin'}` : '-'}</td>
      <td className="px-4 py-3 whitespace-nowrap">
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${submission.status === 'GRADED' ? 'bg-green-700 text-green-200' : submission.isLate ? 'bg-red-700 text-red-200' : 'bg-yellow-700 text-yellow-200'}`}>
          {submission.status.replace(/_/g, ' ')}
        </span>
      </td>
      <td className="px-4 py-3 text-gray-400">
        {new Date(submission.submittedAt).toLocaleDateString('id-ID', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })}
      </td>
      {(userRole === 'INSTRUCTOR' || userRole === 'ADMIN') && (
        <td className="px-4 py-3">
          {submission.status !== 'GRADED' || grading ? (
            grading ? (
              <div className="flex flex-col space-y-2">
                <input
                  type="number"
                  placeholder={submission.type === 'quiz' ? 'Nilai (0-100)' : 'Nilai'}
                  value={gradeForm.score}
                  onChange={(e) => setGradeForm({ ...gradeForm, score: e.target.value })}
                  className="border border-gray-600 rounded px-2 py-1 text-gray-100 bg-gray-700 w-28 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  min="0"
                  max={submission.type === 'quiz' ? '100' : undefined}
                />
                <textarea
                  placeholder="Umpan balik"
                  value={gradeForm.feedback}
                  onChange={(e) => setGradeForm({ ...gradeForm, feedback: e.target.value })}
                  className="border border-gray-600 rounded px-2 py-1 text-gray-100 bg-gray-700 w-full text-sm resize-y"
                  rows={2}
                />
                <div className="flex gap-1">
                  <button onClick={handleGrade} className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs focus:outline-none transition-colors">
                    Simpan
                  </button>
                  <button onClick={() => setGrading(false)} className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-xs focus:outline-none transition-colors">
                    Batal
                  </button>
                </div>
              </div>
            ) : (
              <button onClick={() => setGrading(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs focus:outline-none transition-colors">
                {submission.status === 'GRADED' ? 'Edit Nilai' : 'Nilai'}
              </button>
            )
          ) : (
            <div className="text-green-500 text-sm">
              <div>Dinilai: {submission.score !== null && submission.score !== undefined ? `${submission.score}${submission.type === 'quiz' ? '%' : ' poin'}` : ''}</div>
              {submission.feedback && <div className="text-gray-400 text-xs mt-1 italic">{submission.feedback}</div>}
              {submission.fileUrl && submission.type === 'assignment' && (
                <a href={submission.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline text-xs mt-1 inline-flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.414L14.586 5A2 2 0 0115 6.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 10a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1-4a1 1 0 100 2h6a1 1 0 100-2H7z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Lihat File
                </a>
              )}
            </div>
          )}
        </td>
      )}
    </tr>
  );
}
