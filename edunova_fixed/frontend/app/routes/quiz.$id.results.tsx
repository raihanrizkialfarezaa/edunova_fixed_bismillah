import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Menggunakan react-router-dom untuk useParams
import axios from 'axios'; // Import tetap dipertahankan
import axiosInstance from '~/lib/axios'; // Pastikan path-nya sesuai

import {
  FaTrophy, FaSpinner, FaChartPie, FaCheckCircle, FaTimesCircle, FaHourglassHalf, FaCalendarAlt,
  FaQuestionCircle, FaCircle, FaRegCircle, FaDotCircle
} from 'react-icons/fa'; // Import ikon yang relevan

interface QuizResults {
  submission: {
    id: number;
    score: number;
    earnedPoints: number;
    totalPoints: number;
    status: string;
    submittedAt: string;
    feedback?: string;
  };
  quiz: {
    id: number;
    title: string;
  };
  questions: Array<{
    id: number;
    text: string;
    points: number;
    correctAnswer: string;
    userAnswer: {
      selectedOptionText: string;
      isCorrect: boolean;
      pointsEarned: number;
    };
    options: Array<{
      id: number;
      text: string;
      isCorrect: boolean;
      isSelected: boolean;
    }>;
  }>;
}

export default function QuizResults() {
  const { id } = useParams();
  const [results, setResults] = useState<QuizResults | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // State untuk pesan error

  useEffect(() => {
    fetchResults();
  }, [id]);

  const fetchResults = async () => {
    setLoading(true);
    setError(null); // Reset error
    try {
      const token = localStorage.getItem('token');
      const response = await axiosInstance.get(`/quizzes/${id}/results`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setResults(response.data);
    } catch (err: any) {
      console.error('Failed to fetch results:', err);
      setError(err.response?.data?.message || 'Failed to load quiz results.');
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
        <p className="ml-4 text-blue-300 text-lg">Loading quiz results...</p>
      </div>
    );
  }

  // No results or error state
  if (!results) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center">
        <div className="text-center p-8 bg-gray-800 rounded-lg shadow-xl border border-gray-700">
          <FaTimesCircle className="text-red-500 text-5xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-400 mb-2">Results Not Found</h2>
          <p className="text-gray-400 mb-6">{error || 'Unable to load quiz results for this ID.'}</p>
          {/* Opsi untuk kembali atau refresh */}
          <button
            onClick={() => window.location.reload()} // Reload halaman
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  // Main content display
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-gray-800 rounded-lg shadow-xl p-8 border border-gray-700">
        <h1 className="text-3xl font-bold text-white mb-8 text-center flex items-center justify-center">
          <FaTrophy className="mr-3 text-yellow-400" /> Quiz Results: {results.quiz.title}
        </h1>

        {/* Summary Section */}
        <div className="bg-gray-700 p-6 rounded-lg mb-8 border border-gray-600">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            {/* Score */}
            <div>
              <div className="text-sm text-gray-400 mb-1">Score</div>
              <div className={`text-4xl font-extrabold ${results.submission.score >= 70 ? 'text-green-400' : 'text-red-400'}`}>
                {results.submission.score.toFixed(1)}%
              </div>
            </div>
            {/* Points */}
            <div>
              <div className="text-sm text-gray-400 mb-1">Points Earned</div>
              <div className="text-2xl font-bold text-blue-400">
                {results.submission.earnedPoints} <span className="text-gray-300">/</span> {results.submission.totalPoints}
              </div>
            </div>
            {/* Status */}
            <div>
              <div className="text-sm text-gray-400 mb-1">Status</div>
              <div className={`text-2xl font-bold ${results.submission.status === 'COMPLETED' ? 'text-green-500' : 'text-orange-400'}`}>
                {results.submission.status === 'COMPLETED' ? (
                  <FaCheckCircle className="inline mr-2" />
                ) : (
                  <FaHourglassHalf className="inline mr-2" />
                )}
                {results.submission.status}
              </div>
            </div>
            {/* Submitted At */}
            <div>
              <div className="text-sm text-gray-400 mb-1">Submitted On</div>
              <div className="text-lg text-gray-300 flex items-center justify-center">
                <FaCalendarAlt className="inline mr-2 text-gray-400" />
                {new Date(results.submission.submittedAt).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>
          </div>

          {/* Feedback */}
          {results.submission.feedback && (
            <div className="mt-6 pt-4 border-t border-gray-600">
              <div className="text-sm text-gray-400 mb-2">Instructor Feedback</div>
              <div className="text-base text-gray-300 bg-gray-700 p-4 rounded-md border border-gray-600 italic">
                {results.submission.feedback}
              </div>
            </div>
          )}
        </div>

        {/* Questions Section */}
        <div className="space-y-8">
          <h2 className="text-2xl font-bold text-white mb-4 border-b border-gray-700 pb-4 flex items-center">
            <FaQuestionCircle className="mr-3 text-indigo-400" /> Your Answers
          </h2>
          {results.questions.map((question, index) => (
            <div key={question.id} className="bg-gray-700 p-6 rounded-lg border border-gray-600 shadow-md">
              <h3 className="font-semibold text-lg text-white mb-4 flex items-start">
                <span className="mr-2 text-indigo-300">{index + 1}.</span> {question.text}
                <span className="ml-auto text-sm text-gray-400">({question.points} points)</span>
              </h3>

              <div className="space-y-3">
                {question.options.map(option => (
                  <div
                    key={option.id}
                    className={`p-3 rounded-md border text-gray-200 flex items-center transition duration-200
                      ${option.isCorrect
                        ? 'bg-green-900/30 border-green-700 text-green-300 font-semibold'
                        : option.isSelected
                          ? 'bg-red-900/30 border-red-700 text-red-300'
                          : 'bg-gray-600 border-gray-500 hover:bg-gray-500'
                      }`}
                  >
                    {/* Icon for selection/correctness */}
                    <span className="mr-3">
                      {option.isCorrect ? <FaCheckCircle className="text-green-400" /> : null}
                      {option.isSelected && !option.isCorrect ? <FaTimesCircle className="text-red-400" /> : null}
                      {!option.isCorrect && !option.isSelected ? <FaRegCircle className="text-gray-400" /> : null}
                      {option.isSelected && option.isCorrect && <FaDotCircle className="text-green-400" />} {/* User selected and it's correct */}
                    </span>
                    {option.text}
                  </div>
                ))}
              </div>

              <div className="mt-4 text-sm text-right font-medium">
                <span className={question.userAnswer.isCorrect ? 'text-green-400' : 'text-red-400'}>
                  {question.userAnswer.isCorrect ? 'Correct' : 'Incorrect'}
                </span>
                <span className="ml-2 text-gray-400">
                  ({question.userAnswer.pointsEarned} / {question.points} points)
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}