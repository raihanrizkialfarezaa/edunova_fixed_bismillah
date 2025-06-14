import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import axiosInstance from '~/lib/axios';

import {
  FaTrophy,
  FaSpinner,
  FaChartPie,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
  FaCalendarAlt,
  FaQuestionCircle,
  FaCircle,
  FaRegCircle,
  FaDotCircle,
  FaGraduationCap,
  FaStar,
  FaAward,
  FaArrowLeft,
  FaHome,
  FaRedo,
  FaEye,
  FaChevronRight,
  FaBookOpen,
} from 'react-icons/fa';

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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchResults();
    }
  }, [id]);

  const fetchResults = async () => {
    if (!id) {
      setError('Quiz ID is required');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      console.log('Fetching results for quiz ID:', id); // Debug log

      const response = await axiosInstance.get(`/quizzes/${id}/results`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log('API Response:', response.data); // Debug log

      // Multiple validations to ensure data integrity
      if (!response.data) {
        setError('No data received from server');
        return;
      }

      if (!response.data.quiz) {
        setError('Quiz data is missing from response');
        return;
      }

      if (!response.data.questions) {
        setError('Questions data is missing from response');
        return;
      }

      // Validate that the response contains data for the correct quiz
      if (response.data.quiz.id !== parseInt(id)) {
        setError(`Data mismatch: Expected quiz ${id}, received quiz ${response.data.quiz.id}`);
        return;
      }

      // Additional validation: check if all questions belong to this quiz
      const hasInvalidQuestions = response.data.questions.some((question: any) => !question.id || typeof question.text !== 'string');

      if (hasInvalidQuestions) {
        setError('Invalid question data received');
        return;
      }

      console.log(`Successfully loaded quiz ${response.data.quiz.id} with ${response.data.questions.length} questions`);
      setResults(response.data);
    } catch (err: any) {
      console.error('Failed to fetch results:', err);
      if (err.response?.status === 404) {
        setError('Quiz results not found. You may not have submitted this quiz yet.');
      } else {
        setError(err.response?.data?.message || 'Failed to load quiz results.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Enhanced loading state with elegant design
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-transparent border-t-blue-500 border-r-purple-500 mx-auto"></div>
            <div className="absolute inset-0 rounded-full h-20 w-20 border-4 border-transparent border-b-green-500 border-l-yellow-500 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          <div className="mt-6">
            <FaTrophy className="text-4xl text-yellow-400 mx-auto mb-3 animate-pulse" />
            <p className="text-blue-300 text-xl font-medium">Loading Quiz Results...</p>
            <p className="text-gray-400 text-sm mt-2">Preparing your assessment outcome</p>
          </div>
        </div>
      </div>
    );
  }

  // Enhanced error state
  if (!results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100 flex items-center justify-center p-6">
        <div className="text-center p-10 bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-700/50 max-w-md w-full">
          <div className="bg-red-500/10 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
            <FaTimesCircle className="text-red-400 text-4xl" />
          </div>
          <h2 className="text-2xl font-bold text-red-400 mb-3">Results Not Found</h2>
          <p className="text-gray-300 mb-8 leading-relaxed">{error || 'Unable to load quiz results for this ID.'}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/30 transform hover:scale-105"
            >
              <FaRedo className="mr-2" />
              Refresh
            </button>
            <Link
              to="/"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl shadow-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-gray-500/30 transform hover:scale-105"
            >
              <FaHome className="mr-2" />
              Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const correctAnswers = results.questions.filter((q) => q.userAnswer.isCorrect).length;
  const totalQuestions = results.questions.length;
  const passedQuiz = results.submission.score >= 70;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, white 2px, transparent 2px),
                           radial-gradient(circle at 80% 50%, white 2px, transparent 2px)`,
            backgroundSize: '100px 100px',
          }}
        ></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        {/* Debug Info (remove in production) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 mb-6">
            <p className="text-blue-300 text-sm">
              System Info: Quiz ID {results.quiz.id}, Questions: {results.questions.length}
            </p>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-full mb-6">
            {passedQuiz ? <FaTrophy className="text-6xl text-yellow-400" /> : <FaGraduationCap className="text-6xl text-blue-400" />}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{passedQuiz ? 'Congratulations!' : 'Quiz Completed'}</h1>
          <p className="text-xl text-gray-300 mb-6">{results.quiz.title}</p>

          {/* Navigation Breadcrumb */}
          <div className="flex items-center justify-center text-sm text-gray-400 space-x-2 mb-8">
            <Link to="/" className="hover:text-blue-400 transition-colors">
              <FaHome />
            </Link>
            <FaChevronRight className="text-xs" />
            <span>Quiz Results</span>
          </div>
        </div>

        {/* Main Results Card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl mb-8 overflow-hidden">
          {/* Score Header */}
          <div className={`relative p-8 ${passedQuiz ? 'bg-gradient-to-r from-green-600/20 to-emerald-600/20' : 'bg-gradient-to-r from-orange-600/20 to-red-600/20'}`}>
            <div className="absolute inset-0 bg-gray-800/60 backdrop-blur-sm"></div>
            <div className="relative text-center">
              <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-4 ${passedQuiz ? 'bg-green-500/20 border-2 border-green-400' : 'bg-orange-500/20 border-2 border-orange-400'}`}>
                <span className={`text-3xl font-bold ${passedQuiz ? 'text-green-400' : 'text-orange-400'}`}>{results.submission.score.toFixed(0)}%</span>
              </div>
              <h2 className={`text-2xl font-bold mb-2 ${passedQuiz ? 'text-green-400' : 'text-orange-400'}`}>{passedQuiz ? 'Excellent Work!' : 'Good Effort!'}</h2>
              <p className="text-gray-300">{passedQuiz ? 'You have successfully passed this quiz' : 'Keep practicing to improve your score'}</p>
            </div>
          </div>

          {/* Detailed Stats */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {/* Score */}
              <div className="bg-gray-700/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-600/50 text-center">
                <div className="flex items-center justify-center mb-3">
                  <div className={`p-3 rounded-xl ${passedQuiz ? 'bg-green-500/20' : 'bg-orange-500/20'}`}>
                    <FaStar className={`text-xl ${passedQuiz ? 'text-green-400' : 'text-orange-400'}`} />
                  </div>
                </div>
                <div className="text-sm text-gray-400 mb-1">Final Score</div>
                <div className={`text-3xl font-bold ${passedQuiz ? 'text-green-400' : 'text-orange-400'}`}>{results.submission.score.toFixed(1)}%</div>
              </div>

              {/* Points */}
              <div className="bg-gray-700/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-600/50 text-center">
                <div className="flex items-center justify-center mb-3">
                  <div className="p-3 rounded-xl bg-blue-500/20">
                    <FaAward className="text-xl text-blue-400" />
                  </div>
                </div>
                <div className="text-sm text-gray-400 mb-1">Points Earned</div>
                <div className="text-3xl font-bold text-blue-400">{results.submission.earnedPoints}</div>
                <div className="text-sm text-gray-500">out of {results.submission.totalPoints}</div>
              </div>

              {/* Correct Answers */}
              <div className="bg-gray-700/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-600/50 text-center">
                <div className="flex items-center justify-center mb-3">
                  <div className="p-3 rounded-xl bg-purple-500/20">
                    <FaCheckCircle className="text-xl text-purple-400" />
                  </div>
                </div>
                <div className="text-sm text-gray-400 mb-1">Correct Answers</div>
                <div className="text-3xl font-bold text-purple-400">{correctAnswers}</div>
                <div className="text-sm text-gray-500">out of {totalQuestions}</div>
              </div>

              {/* Status */}
              <div className="bg-gray-700/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-600/50 text-center">
                <div className="flex items-center justify-center mb-3">
                  <div className={`p-3 rounded-xl ${results.submission.status === 'COMPLETED' ? 'bg-green-500/20' : 'bg-yellow-500/20'}`}>
                    {results.submission.status === 'COMPLETED' ? <FaCheckCircle className="text-xl text-green-400" /> : <FaHourglassHalf className="text-xl text-yellow-400" />}
                  </div>
                </div>
                <div className="text-sm text-gray-400 mb-1">Status</div>
                <div className={`text-lg font-bold ${results.submission.status === 'COMPLETED' ? 'text-green-400' : 'text-yellow-400'}`}>{results.submission.status}</div>
              </div>
            </div>

            {/* Submission Date */}
            <div className="bg-gray-700/30 backdrop-blur-sm p-4 rounded-xl border border-gray-600/30 text-center mb-6">
              <div className="flex items-center justify-center text-gray-300">
                <FaCalendarAlt className="mr-2 text-blue-400" />
                <span className="text-sm">Submitted on </span>
                <span className="font-semibold ml-1">
                  {new Date(results.submission.submittedAt).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>

            {/* Feedback */}
            {results.submission.feedback && (
              <div className="bg-yellow-500/10 backdrop-blur-sm border border-yellow-500/30 rounded-xl p-6 mb-6">
                <div className="flex items-center mb-3">
                  <FaBookOpen className="text-yellow-400 mr-2" />
                  <h3 className="text-lg font-semibold text-yellow-300">Instructor Feedback</h3>
                </div>
                <p className="text-gray-300 italic leading-relaxed">"{results.submission.feedback}"</p>
              </div>
            )}
          </div>
        </div>

        {/* Questions Review */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl mb-8">
          <div className="p-8 border-b border-white/10">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <FaQuestionCircle className="mr-3 text-indigo-400" />
              Detailed Review
            </h2>
            <p className="text-gray-300 mt-2">Review your answers and see the correct solutions</p>
          </div>

          <div className="p-8 space-y-8">
            {results.questions.map((question, index) => (
              <div key={question.id} className="group">
                <div className="bg-gray-700/30 backdrop-blur-sm p-8 rounded-2xl border border-gray-600/30 shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-gray-500/50">
                  {/* Question Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className={`rounded-xl p-3 font-bold text-lg min-w-[3rem] text-center ${question.userAnswer.isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>{index + 1}</div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-xl text-white leading-relaxed mb-3">{question.text}</h3>
                        <div className="flex items-center space-x-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${question.userAnswer.isCorrect ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                            {question.userAnswer.isCorrect ? (
                              <>
                                <FaCheckCircle className="mr-1" /> Correct
                              </>
                            ) : (
                              <>
                                <FaTimesCircle className="mr-1" /> Incorrect
                              </>
                            )}
                          </span>
                          <span className="text-sm text-gray-400">
                            {question.userAnswer.pointsEarned} / {question.points} points
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Options */}
                  <div className="ml-20 space-y-3">
                    {question.options.map((option, oIndex) => (
                      <div
                        key={option.id}
                        className={`p-4 rounded-xl border transition-all duration-300 ${
                          option.isCorrect ? 'bg-green-500/10 border-green-500/30 text-green-200' : option.isSelected ? 'bg-red-500/10 border-red-500/30 text-red-200' : 'bg-gray-600/20 border-gray-500/30 text-gray-300'
                        }`}
                      >
                        <div className="flex items-center">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-4 ${
                              option.isCorrect ? 'bg-green-500 text-white' : option.isSelected ? 'bg-red-500 text-white' : 'bg-gray-600 text-gray-300'
                            }`}
                          >
                            {String.fromCharCode(65 + oIndex)}
                          </div>
                          <span className="text-base flex-1">{option.text}</span>
                          <div className="flex items-center space-x-2">
                            {option.isSelected && <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full">Your Answer</span>}
                            {option.isCorrect && <FaCheckCircle className="text-green-400" />}
                            {option.isSelected && !option.isCorrect && <FaTimesCircle className="text-red-400" />}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/30 transform hover:scale-105"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl blur opacity-70 group-hover:opacity-100 transition duration-300"></div>
            <div className="relative flex items-center justify-center">
              <FaHome className="mr-2" />
              Back to Dashboard
            </div>
          </Link>
          <button
            onClick={() => window.location.reload()}
            className="group relative px-8 py-4 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl shadow-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-gray-500/30 transform hover:scale-105"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-gray-600 to-gray-700 rounded-xl blur opacity-70 group-hover:opacity-100 transition duration-300"></div>
            <div className="relative flex items-center justify-center">
              <FaRedo className="mr-2" />
              Refresh Results
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
