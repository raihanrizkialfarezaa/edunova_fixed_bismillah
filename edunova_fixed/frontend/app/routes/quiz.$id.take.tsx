import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import axiosInstance from '~/lib/axios';

import { FaPlayCircle, FaSpinner, FaClock, FaQuestionCircle, FaCheckCircle, FaExclamationCircle, FaPaperPlane, FaTimesCircle, FaGraduationCap, FaTrophy, FaStopwatch, FaChevronRight } from 'react-icons/fa';

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
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchQuiz();
  }, [id]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && quiz && !submitting) {
      handleSubmit();
    }
  }, [timeLeft, quiz, submitting]);

  const fetchQuiz = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await axiosInstance.get(`/quizzes/${id}/take`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(response.data.quiz);
      setQuiz(response.data.quiz);
      setTimeLeft(response.data.quiz.timeLimit * 60);
    } catch (error: any) {
      console.error('Failed to fetch quiz:', error);
      if (error.response?.data?.submission) {
        navigate(`/quiz/${id}/results`);
      } else {
        setError(error.response?.data?.message || 'Failed to load quiz. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId: number, optionId: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const answerArray = Object.entries(answers).map(([questionId, selectedOptionId]) => ({
        questionId: parseInt(questionId),
        selectedOptionId,
      }));

      await axiosInstance.post(`/quizzes/${id}/submit`, { answers: answerArray }, { headers: { Authorization: `Bearer ${token}` } });

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

  // Loading state with enhanced animation
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-transparent border-t-blue-500 border-r-purple-500 mx-auto"></div>
            <div className="absolute inset-0 rounded-full h-20 w-20 border-4 border-transparent border-b-green-500 border-l-yellow-500 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          <div className="mt-6">
            <FaGraduationCap className="text-4xl text-blue-400 mx-auto mb-3 animate-pulse" />
            <p className="text-blue-300 text-xl font-medium">Loading Quiz...</p>
            <p className="text-gray-400 text-sm mt-2">Preparing your assessment</p>
          </div>
        </div>
      </div>
    );
  }

  // Enhanced error state
  if (!quiz) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100 flex items-center justify-center p-6">
        <div className="text-center p-10 bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-700/50 max-w-md w-full">
          <div className="bg-red-500/10 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
            <FaExclamationCircle className="text-red-400 text-4xl" />
          </div>
          <h2 className="text-2xl font-bold text-red-400 mb-3">Quiz Unavailable</h2>
          <p className="text-gray-300 mb-8 leading-relaxed">{error || 'The quiz could not be loaded or is currently unavailable.'}</p>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl shadow-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-red-500/30 transform hover:scale-105"
          >
            <FaChevronRight className="mr-2" />
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  const answeredCount = Object.keys(answers).length;
  const totalQuestions = quiz.questions.length;
  const progressPercentage = (answeredCount / totalQuestions) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Floating Timer */}
        <div className="fixed top-6 right-6 z-50">
          <div
            className={`px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-lg border transition-all duration-500 ${
              timeLeft < 60 ? 'bg-red-900/80 border-red-500/50 shadow-red-500/20' : timeLeft < 300 ? 'bg-yellow-900/80 border-yellow-500/50 shadow-yellow-500/20' : 'bg-gray-800/80 border-gray-600/50 shadow-blue-500/20'
            }`}
          >
            <div className="flex items-center space-x-3">
              <FaStopwatch className={`text-2xl ${timeLeft < 60 ? 'text-red-400' : timeLeft < 300 ? 'text-yellow-400' : 'text-blue-400'}`} />
              <div>
                <p className="text-xs font-medium opacity-75">Time Remaining</p>
                <p className="text-2xl font-mono font-bold">{formatTime(timeLeft)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Container */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-3xl shadow-2xl border border-gray-700/50 overflow-hidden">
          {/* Header with gradient overlay */}
          <div className="relative bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-green-600/20 p-8 border-b border-gray-700/50">
            <div className="absolute inset-0 bg-gray-800/60 backdrop-blur-sm"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-2xl">
                    <FaTrophy className="text-2xl text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-white">{quiz.title}</h1>
                    <p className="text-gray-300 mt-1">Assessment Challenge</p>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-300">Progress</span>
                  <span className="text-sm font-bold text-white">
                    {answeredCount}/{totalQuestions}
                  </span>
                </div>
                <div className="w-full bg-gray-700/50 rounded-full h-3 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 transition-all duration-700 ease-out rounded-full" style={{ width: `${progressPercentage}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8">
            {/* Error Message */}
            {error && (
              <div className="bg-red-900/20 backdrop-blur-sm border border-red-500/30 text-red-300 px-6 py-4 rounded-2xl mb-8 flex items-center shadow-lg">
                <FaTimesCircle className="mr-4 text-xl flex-shrink-0" />
                <span className="font-medium">{error}</span>
              </div>
            )}

            {/* Questions Section */}
            <div className="space-y-8">
              {quiz.questions.map((question, index) => (
                <div key={question.id} className="group">
                  <div className="bg-gray-700/30 backdrop-blur-sm p-8 rounded-2xl border border-gray-600/30 shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-gray-500/50">
                    {/* Question Header */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl p-3 font-bold text-lg min-w-[3rem] text-center">{index + 1}</div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-xl text-white leading-relaxed">{question.text}</h3>
                        </div>
                      </div>
                      <div className="bg-gray-600/50 px-4 py-2 rounded-xl">
                        <span className="text-sm font-medium text-gray-300">{question.points} pts</span>
                      </div>
                    </div>

                    {/* Options */}
                    <div className="space-y-4 ml-20">
                      {question.options.map((option) => (
                        <label
                          key={option.id}
                          className={`group/option flex items-center p-5 rounded-xl border cursor-pointer transition-all duration-300 transform hover:scale-[1.02] ${
                            answers[question.id] === option.id
                              ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-400/50 shadow-lg shadow-blue-500/10'
                              : 'bg-gray-600/20 border-gray-500/30 hover:bg-gray-500/30 hover:border-gray-400/50'
                          }`}
                        >
                          <div className="relative">
                            <input type="radio" name={`question-${question.id}`} value={option.id} checked={answers[question.id] === option.id} onChange={() => handleAnswerChange(question.id, option.id)} className="sr-only" />
                            <div className={`w-6 h-6 rounded-full border-2 transition-all duration-300 ${answers[question.id] === option.id ? 'border-blue-400 bg-blue-500' : 'border-gray-400 group-hover/option:border-gray-300'}`}>
                              {answers[question.id] === option.id && <div className="w-2 h-2 bg-white rounded-full mx-auto mt-1"></div>}
                            </div>
                          </div>
                          <span className={`ml-4 text-lg transition-colors duration-300 ${answers[question.id] === option.id ? 'text-blue-200 font-medium' : 'text-gray-200'}`}>{option.text}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="mt-12 pt-8 border-t border-gray-700/50">
              <div className="flex flex-col lg:flex-row justify-between items-center space-y-6 lg:space-y-0">
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-3 bg-gray-700/30 px-6 py-3 rounded-xl">
                    <FaCheckCircle className="text-green-400 text-xl" />
                    <span className="text-gray-300 font-medium">Answered:</span>
                    <span className="font-bold text-white text-lg">{answeredCount}</span>
                    <span className="text-gray-500">/</span>
                    <span className="font-bold text-white text-lg">{totalQuestions}</span>
                  </div>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="group relative px-10 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white rounded-2xl shadow-2xl hover:shadow-indigo-500/25 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-indigo-500/30 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 disabled:hover:scale-100"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 rounded-2xl blur opacity-70 group-hover:opacity-100 transition duration-300"></div>
                  <div className="relative flex items-center justify-center">
                    {submitting ? (
                      <span className="flex items-center">
                        <FaSpinner className="animate-spin mr-3 text-xl" />
                        Submitting Quiz...
                      </span>
                    ) : (
                      <>
                        <FaPaperPlane className="mr-3 text-xl group-hover:rotate-12 transition-transform duration-300" />
                        Submit Quiz
                      </>
                    )}
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
