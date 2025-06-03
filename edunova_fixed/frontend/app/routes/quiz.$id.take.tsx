import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Menggunakan react-router-dom untuk useParams dan useNavigate
import axios from 'axios'; // Import tetap dipertahankan
import axiosInstance from '~/lib/axios'; // Pastikan path-nya sesuai

import {
  FaPlayCircle, FaSpinner, FaClock, FaQuestionCircle, FaCheckCircle, FaExclamationCircle, FaPaperPlane, FaTimesCircle
} from 'react-icons/fa'; // Import ikon yang relevan

interface Option {
  id: number;
  text: string;
}

interface Question {
  id: number;
  text: string;
  points: number;
  options: Option[];
}

interface Quiz {
  id: number;
  title: string;
  timeLimit: number;
  questions: Question[];
}

export default function QuizTake() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [answers, setAnswers] = useState<{[key: number]: number}>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [error, setError] = useState<string | null>(null); // State untuk pesan error

  useEffect(() => {
    fetchQuiz();
  }, [id]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && quiz && !submitting) { // Pastikan quiz ada dan belum disubmit
      handleSubmit(); // Otomatis submit ketika waktu habis
    }
  }, [timeLeft, quiz, submitting]); // Tambahkan quiz dan submitting sebagai dependencies

  const fetchQuiz = async () => {
    setLoading(true);
    setError(null); // Reset error
    try {
      const token = localStorage.getItem('token');
      const response = await axiosInstance.get(`/quizzes/${id}/take`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log(response.data.quiz);
      setQuiz(response.data.quiz);
      setTimeLeft(response.data.quiz.timeLimit * 60);
    } catch (error: any) {
      console.error('Failed to fetch quiz:', error);
      if (error.response?.data?.submission) {
        // Jika sudah ada submission, langsung redirect ke halaman hasil
        navigate(`/quiz/${id}/results`);
      } else {
        // Tampilkan pesan error lain
        setError(error.response?.data?.message || 'Failed to load quiz. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId: number, optionId: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionId }));
  };

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);
    setError(null); // Reset error

    try {
      const token = localStorage.getItem('token');
      const answerArray = Object.entries(answers).map(([questionId, selectedOptionId]) => ({
        questionId: parseInt(questionId),
        selectedOptionId
      }));

      await axiosInstance.post(`/quizzes/${id}/submit`,
        { answers: answerArray },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      navigate(`/quiz/${id}/results`);
    } catch (error: any) {
      console.error('Failed to submit quiz:', error);
      setError(error.response?.data?.message || 'Failed to submit quiz. Please try again.');
      setSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    const formattedMins = mins.toString().padStart(2, '0');
    const formattedSecs = secs.toString().padStart(2, '0');
    return `${formattedMins}:${formattedSecs}`;
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
        <p className="ml-4 text-blue-300 text-lg">Loading quiz...</p>
      </div>
    );
  }

  // Quiz not found or error state
  if (!quiz) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center">
        <div className="text-center p-8 bg-gray-800 rounded-lg shadow-xl border border-gray-700">
          <FaExclamationCircle className="text-red-500 text-5xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-400 mb-2">Quiz Not Available</h2>
          <p className="text-gray-400 mb-6">{error || 'The quiz could not be loaded or is unavailable.'}</p>
          {/* Opsi untuk kembali atau refresh */}
          <button
            onClick={() => navigate('/')} // Atau ke halaman daftar kuis
            className="inline-flex items-center px-6 py-3 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-gray-800 rounded-lg shadow-xl p-8 border border-gray-700">
        {/* Header Quiz */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 pb-4 border-b border-gray-700">
          <h1 className="text-3xl font-bold text-white flex items-center mb-4 md:mb-0">
            <FaPlayCircle className="mr-3 text-green-400" /> {quiz.title}
          </h1>
          <div className={`text-2xl font-mono px-4 py-2 rounded-lg flex items-center shadow-lg transition duration-300
            ${timeLeft < 60 ? 'bg-red-700 text-red-100 border border-red-500' : 'bg-gray-700 text-blue-300 border border-gray-600'}`}>
            <FaClock className="mr-3" /> {formatTime(timeLeft)}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-900/20 border border-red-700 text-red-400 px-5 py-4 rounded-md mb-6 flex items-center">
            <FaTimesCircle className="mr-3 text-xl" />
            <span>{error}</span>
          </div>
        )}

        {/* Questions Section */}
        <div className="space-y-8">
          {quiz.questions.map((question, index) => (
            <div key={question.id} className="bg-gray-700 p-6 rounded-lg border border-gray-600 shadow-md">
              <h3 className="font-semibold text-lg text-white mb-4 flex items-start">
                <span className="mr-2 text-indigo-300">{index + 1}.</span> {question.text}
                <span className="ml-auto text-sm text-gray-400">({question.points} points)</span>
              </h3>
              <div className="space-y-3">
                {question.options.map(option => (
                  <label
                    key={option.id}
                    className={`flex items-center p-3 rounded-md border cursor-pointer transition duration-200
                      ${answers[question.id] === option.id
                        ? 'bg-blue-900/30 border-blue-700 text-blue-300 font-medium shadow-inner'
                        : 'bg-gray-600 border-gray-500 text-gray-200 hover:bg-gray-500'
                      }`}
                  >
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      value={option.id}
                      checked={answers[question.id] === option.id}
                      onChange={() => handleAnswerChange(question.id, option.id)}
                      className="form-radio h-5 w-5 text-blue-600 bg-gray-500 border-gray-400 focus:ring-blue-500 transition duration-150 ease-in-out cursor-pointer"
                    />
                    <span className="ml-3 text-base">{option.text}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer with Summary and Submit Button */}
        <div className="mt-8 pt-6 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-base text-gray-400 flex items-center">
            <FaCheckCircle className="mr-2 text-green-400" /> Answered:
            <span className="font-bold text-white ml-1">
              {Object.keys(answers).length}
            </span>
            <span className="mx-1 text-gray-500">/</span>
            <span className="font-bold text-white">
              {quiz.questions.length}
            </span>
          </div>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex items-center justify-center px-8 py-3 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <span className="flex items-center">
                <FaSpinner className="animate-spin mr-3" /> Submitting...
              </span>
            ) : (
              <>
                <FaPaperPlane className="mr-3" /> Submit Quiz
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}