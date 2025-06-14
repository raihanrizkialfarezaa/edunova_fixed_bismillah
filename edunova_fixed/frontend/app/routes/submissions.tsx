import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../lib/axios';
import { FaClipboardList, FaFileAlt, FaQuestionCircle, FaTrophy, FaClock, FaCheckCircle, FaExclamationTriangle, FaSpinner, FaDownload, FaEdit, FaSave, FaTimes, FaFilter, FaGraduationCap, FaCrown, FaSearch } from 'react-icons/fa';

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
          setError('Gagal mengambil data pengumpulan. Endpoint mungkin tidak tersedia.');
          setSubmissions([]);
        }
      } else {
        setError(error.response?.data?.message || 'Gagal mengambil data pengumpulan');
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
      alert('pengumpulan berhasil dinilai');
    } catch (error: any) {
      console.error('Failed to grade submission:', error);
      alert(error.response?.data?.message || 'Gagal menilai pengumpulan');
    }
  };

  const getPageTitle = () => {
    switch (user?.role) {
      case 'ADMIN':
        return 'Semua pengumpulan';
      case 'INSTRUCTOR':
        return 'Penilaian pengumpulan';
      default:
        return 'Pengumpulan Saya';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mx-auto mb-6 w-20 h-20">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse"></div>
            <div className="absolute inset-2 bg-gray-800 rounded-full flex items-center justify-center">
              <FaSpinner className="text-3xl text-blue-400 animate-spin" />
            </div>
          </div>
          <p className="text-blue-300 text-xl font-medium">Memuat pengumpulan...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-teal-600/10 pointer-events-none"></div>

        <div className="relative z-10 p-6 pt-12">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-red-500 to-pink-600 rounded-full mb-6 shadow-lg">
                <FaExclamationTriangle className="text-3xl text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-red-400 via-pink-400 to-red-400 bg-clip-text text-transparent mb-4">{getPageTitle()}</h1>
            </div>

            <div className="bg-gray-800/60 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700/50 overflow-hidden">
              <div className="p-8">
                <div className="bg-gradient-to-r from-red-900/20 to-pink-900/20 text-red-300 p-6 rounded-xl border border-red-700/50 backdrop-blur-sm text-center">
                  <FaExclamationTriangle className="text-4xl text-red-400 mx-auto mb-4" />
                  <p className="text-xl font-medium mb-4">{error}</p>
                  <button
                    onClick={() => {
                      setError(null);
                      fetchSubmissions();
                    }}
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl shadow-lg hover:from-red-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-500/50 font-semibold"
                  >
                    <FaSpinner className="mr-2" />
                    Coba Lagi
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (submissions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-teal-600/10 pointer-events-none"></div>

        <div className="relative z-10 p-6 pt-12">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-gray-500 to-gray-600 rounded-full mb-6 shadow-lg">
                <FaClipboardList className="text-3xl text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-teal-400 bg-clip-text text-transparent mb-4">{getPageTitle()}</h1>
            </div>

            <div className="bg-gray-800/60 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700/50 overflow-hidden">
              <div className="p-8 text-center">
                <div className="w-24 h-24 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaClipboardList className="text-4xl text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-300 mb-4">Tidak Ada pengumpulan</h3>
                <p className="text-gray-400 text-lg mb-4">{user?.role === 'STUDENT' ? 'Anda belum memiliki pengumpulan tugas atau kuis.' : 'Belum ada pengumpulan dari siswa.'}</p>
                {user?.role === 'STUDENT' && <p className="text-sm text-gray-500">Ikuti beberapa kuis atau kirimkan tugas untuk melihatnya di sini.</p>}
                {(filter.type || filter.status) && <p className="text-sm text-gray-500 mt-4">Tidak ada hasil untuk filter saat ini. Coba ubah filter Anda.</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-teal-600/10 pointer-events-none"></div>
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-blue-900/20 to-transparent pointer-events-none"></div>

      <div className="relative z-10 p-6 pt-12">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6 shadow-lg">
              <FaClipboardList className="text-3xl text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-teal-400 bg-clip-text text-transparent mb-4">{getPageTitle()}</h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">{user?.role === 'STUDENT' ? 'Kelola dan pantau semua pengumpulan tugas dan kuis Anda' : 'Kelola dan berikan penilaian untuk pengumpulan siswa'}</p>
          </div>

          {/* Main Content Container */}
          <div className="bg-gray-800/60 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700/50 overflow-hidden">
            {/* Header dengan Stats */}
            <div className="bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-teal-600/20 px-8 py-6 border-b border-gray-700/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FaCrown className="text-2xl text-yellow-400" />
                  <h2 className="text-2xl font-bold text-white">Dashboard pengumpulan</h2>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-gray-300 bg-gray-700/50 px-4 py-2 rounded-full">{submissions.length} Total pengumpulan</div>
                  <div className="text-sm text-green-300 bg-green-900/30 px-4 py-2 rounded-full">{submissions.filter((s) => s.status === 'GRADED').length} Dinilai</div>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-gray-700/30 px-8 py-6 border-b border-gray-700/50">
              <div className="flex items-center space-x-3 mb-4">
                <FaFilter className="text-lg text-blue-400" />
                <h3 className="text-lg font-semibold text-white">Filter pengumpulan</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Tipe pengumpulan</label>
                  <select
                    value={filter.type}
                    onChange={(e) => setFilter({ ...filter, type: e.target.value })}
                    className="w-full bg-gray-700/80 border border-gray-600 rounded-xl px-4 py-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  >
                    <option value="">Semua Tipe</option>
                    <option value="quiz">Kuis</option>
                    <option value="assignment">Tugas</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Status pengumpulan</label>
                  <select
                    value={filter.status}
                    onChange={(e) => setFilter({ ...filter, status: e.target.value })}
                    className="w-full bg-gray-700/80 border border-gray-600 rounded-xl px-4 py-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  >
                    <option value="">Semua Status</option>
                    <option value="SUBMITTED">Dikirim</option>
                    <option value="GRADED">Dinilai</option>
                    <option value="LATE_SUBMITTED">Terlambat</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Submissions Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Tipe</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Judul</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Kursus</th>
                    {(user?.role === 'ADMIN' || user?.role === 'INSTRUCTOR') && <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Siswa</th>}
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Nilai</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Dikirim</th>
                    {(user?.role === 'INSTRUCTOR' || user?.role === 'ADMIN') && <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Aksi</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700/50">
                  {submissions.map((submission) => (
                    <SubmissionRow key={submission.id} submission={submission} userRole={user?.role || 'STUDENT'} onGrade={gradeSubmission} />
                  ))}
                </tbody>
              </table>
            </div>
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

  const getTypeIcon = (type: string) => {
    return type === 'quiz' ? <FaQuestionCircle className="mr-2" /> : <FaFileAlt className="mr-2" />;
  };

  const getStatusColor = (status: string, isLate?: boolean) => {
    if (status === 'GRADED') return 'from-green-600 to-emerald-600 text-green-100';
    if (isLate) return 'from-red-600 to-pink-600 text-red-100';
    return 'from-yellow-600 to-orange-600 text-yellow-100';
  };

  const getStatusIcon = (status: string, isLate?: boolean) => {
    if (status === 'GRADED') return <FaCheckCircle className="mr-1" />;
    if (isLate) return <FaExclamationTriangle className="mr-1" />;
    return <FaClock className="mr-1" />;
  };

  return (
    <tr className="hover:bg-gray-700/30 transition-all duration-200">
      <td className="px-6 py-4">
        <div
          className={`inline-flex items-center px-3 py-2 rounded-xl text-sm font-semibold shadow-lg ${
            submission.type === 'quiz' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-blue-100' : 'bg-gradient-to-r from-green-600 to-emerald-600 text-green-100'
          }`}
        >
          {getTypeIcon(submission.type)}
          {submission.type === 'quiz' ? 'KUIS' : 'TUGAS'}
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="text-white font-medium truncate max-w-xs" title={submission.title}>
          {submission.title}
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="text-gray-300 truncate max-w-xs" title={submission.course?.title}>
          {submission.course?.title}
        </div>
      </td>
      {(userRole === 'ADMIN' || userRole === 'INSTRUCTOR') && (
        <td className="px-6 py-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center">
              <FaGraduationCap className="text-white text-sm" />
            </div>
            <span className="text-gray-300 font-medium">{submission.student?.name || 'Siswa Tidak Diketahui'}</span>
          </div>
        </td>
      )}
      <td className="px-6 py-4">
        {submission.score !== null && submission.score !== undefined ? (
          <div className="flex items-center space-x-2">
            <FaTrophy className="text-yellow-400" />
            <span className="text-white font-bold">
              {submission.score}
              {submission.type === 'quiz' ? '%' : ' poin'}
            </span>
          </div>
        ) : (
          <span className="text-gray-500">-</span>
        )}
      </td>
      <td className="px-6 py-4">
        <div className={`inline-flex items-center px-3 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r shadow-lg ${getStatusColor(submission.status, submission.isLate)}`}>
          {getStatusIcon(submission.status, submission.isLate)}
          {submission.status === 'GRADED' ? 'Dinilai' : submission.isLate ? 'Terlambat' : submission.status === 'SUBMITTED' ? 'Dikirim' : submission.status}
        </div>
      </td>
      <td className="px-6 py-4 text-gray-400">
        <div className="flex items-center space-x-2">
          <FaClock className="text-blue-400" />
          <span>
            {new Date(submission.submittedAt).toLocaleDateString('id-ID', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>
      </td>
      {(userRole === 'INSTRUCTOR' || userRole === 'ADMIN') && (
        <td className="px-6 py-4">
          {submission.status !== 'GRADED' || grading ? (
            grading ? (
              <div className="bg-gray-700/50 p-4 rounded-xl border border-gray-600/50 space-y-3">
                <input
                  type="number"
                  placeholder={submission.type === 'quiz' ? 'Nilai (0-100)' : 'Nilai'}
                  value={gradeForm.score}
                  onChange={(e) => setGradeForm({ ...gradeForm, score: e.target.value })}
                  className="w-full bg-gray-600/50 border border-gray-500 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  max={submission.type === 'quiz' ? '100' : undefined}
                />
                <textarea
                  placeholder="Umpan balik untuk siswa..."
                  value={gradeForm.feedback}
                  onChange={(e) => setGradeForm({ ...gradeForm, feedback: e.target.value })}
                  className="w-full bg-gray-600/50 border border-gray-500 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={3}
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleGrade}
                    className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg shadow-lg hover:from-green-700 hover:to-emerald-700 transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500/50"
                  >
                    <FaSave className="mr-2" />
                    Simpan
                  </button>
                  <button
                    onClick={() => setGrading(false)}
                    className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg shadow-lg hover:from-gray-700 hover:to-gray-800 transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500/50"
                  >
                    <FaTimes className="mr-2" />
                    Batal
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setGrading(true)}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-medium"
              >
                <FaEdit className="mr-2" />
                {submission.status === 'GRADED' ? 'Edit Nilai' : 'Beri Nilai'}
              </button>
            )
          ) : (
            <div className="bg-green-900/20 p-4 rounded-xl border border-green-700/50">
              <div className="flex items-center space-x-2 mb-2">
                <FaTrophy className="text-yellow-400" />
                <span className="text-green-300 font-semibold">Dinilai: {submission.score !== null && submission.score !== undefined ? `${submission.score}${submission.type === 'quiz' ? '%' : ' poin'}` : ''}</span>
              </div>
              {submission.feedback && <p className="text-gray-300 text-sm bg-gray-700/30 p-2 rounded-lg italic border-l-4 border-blue-500">"{submission.feedback}"</p>}
              {submission.fileUrl && submission.type === 'assignment' && (
                <a href={submission.fileUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center mt-2 text-blue-400 hover:text-blue-300 transition-colors">
                  <FaDownload className="mr-2" />
                  <span className="underline">Unduh File</span>
                </a>
              )}
            </div>
          )}
        </td>
      )}
    </tr>
  );
}
