import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { quizApi } from '../lib/quizApi';
import { useAuth } from '../contexts/AuthContext';

interface Quiz {
  id: number;
  title: string;
  timeLimit?: number;
  Questions: Array<any>;
  lesson: {
    id: number;
    title: string;
    section: {
      id: number;
      title: string;
      course: {
        id: number;
        title: string;
        instructorId: number; 
      };
    };
  };
}

export default function QuizList() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        setLoading(true);
        setError(null);

        // Make sure user is authenticated and is instructor/admin
        if (!user || (user.role !== 'INSTRUCTOR' && user.role !== 'ADMIN')) {
          setError('Anda tidak memiliki akses untuk melihat kuis');
          return;
        }

        const response = await quizApi.getAllQuizzes({ search, limit: 50 });
        const fetchedQuizzes = response.data.quizzes || [];

        // Additional client-side filtering for extra security
        const filteredQuizzes: Quiz[] = user.role === 'INSTRUCTOR' ? fetchedQuizzes.filter((quiz: Quiz) => quiz.lesson?.section?.course?.instructorId === user.id) : fetchedQuizzes;

        setQuizzes(filteredQuizzes);
      } catch (err: any) {
        console.error('Error fetching quizzes:', err);
        setError(err.response?.data?.message || 'Gagal mengambil daftar kuis');
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, [search, user]); 

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-950 text-gray-300 font-sans">
        <p className="text-lg">Memuat daftar kuis...</p>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-950 text-red-500 font-sans">
        <div className="text-center">
          <p className="text-lg mb-4">Error: {error}</p>
          <button onClick={() => window.location.reload()} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg">
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  // Show access denied for non-instructor/admin users
  if (!user || (user.role !== 'INSTRUCTOR' && user.role !== 'ADMIN')) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-950 text-gray-300 font-sans">
        <div className="text-center">
          <p className="text-lg">Anda tidak memiliki akses untuk melihat halaman ini.</p>
          <Link to="/" className="mt-4 inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg">
            Kembali ke Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-sans p-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 pb-6 border-b border-gray-800">
        <div>
          <h1 className="text-4xl font-extrabold text-blue-400 mb-2">Manajemen Kuis</h1>
          {user.role === 'INSTRUCTOR' && <p className="text-gray-400">Kuis yang Anda buat</p>}
        </div>
        <Link to="/quiz/create" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-md">
          Buat Kuis Baru
        </Link>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Cari kuis berdasarkan judul atau pelajaran..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-4 rounded-lg bg-gray-800 border border-gray-700 text-gray-100 placeholder-gray-500
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 shadow-inner"
        />
      </div>

      {/* Quiz List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes.map((quiz) => (
          <div key={quiz.id} className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 hover:border-blue-600 transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-blue-300 mb-1">{quiz.title}</h3>
                <p className="text-sm text-gray-400 mb-1">
                  Kursus: <span className="font-medium text-gray-300">{quiz.lesson.section.course.title}</span>
                </p>
                <p className="text-sm text-gray-400 mb-1">
                  Pelajaran: <span className="font-medium text-gray-300">{quiz.lesson.title}</span>
                </p>
                <p className="text-sm text-gray-500">
                  <span className="font-medium text-gray-400">Pertanyaan:</span> {quiz.Questions.length} |<span className="font-medium text-gray-400"> Batas Waktu:</span> {quiz.timeLimit ? `${quiz.timeLimit} menit` : 'Tidak ada batas'}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link to={`/quiz/${quiz.id}/edit`} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition duration-300 shadow-md">
                  Edit
                </Link>
                <Link to={`/quiz/${quiz.id}/view`} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition duration-300 shadow-md">
                  Lihat
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {quizzes.length === 0 && <div className="text-center py-12 text-gray-400 text-xl font-medium bg-gray-800 rounded-xl shadow-lg mt-8">{search ? 'Tidak ada kuis yang sesuai dengan pencarian.' : 'Anda belum membuat kuis apapun.'}</div>}
    </div>
  );
}
