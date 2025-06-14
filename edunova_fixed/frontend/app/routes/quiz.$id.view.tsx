import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { quizApi } from '../lib/quizApi';
import { FaEdit, FaArrowLeft, FaClock, FaQuestionCircle, FaTrophy, FaGraduationCap, FaCheckCircle, FaStar, FaBookOpen, FaChevronRight, FaListAlt, FaEye } from 'react-icons/fa';

interface Quiz {
  id: number;
  title: string;
  timeLimit?: number;
  Questions: Array<{
    id: number;
    text: string;
    correctAnswer: string;
    points: number;
    Options: Array<{ id: number; text: string }>;
  }>;
  lesson: {
    title: string;
    section: {
      title: string;
      course: { title: string };
    };
  };
}

export function meta() {
  return [{ title: 'View Quiz - EduNova' }, { name: 'description', content: 'View quiz details' }];
}

export default function QuizViewPage() {
  const { id } = useParams();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchQuiz();
    }
  }, [id]);

  const fetchQuiz = async () => {
    try {
      const response = await quizApi.getQuizById(Number(id));
      setQuiz(response.data.quiz);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch quiz');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-transparent border-t-blue-500 border-r-purple-500 mx-auto"></div>
            <div className="absolute inset-0 rounded-full h-20 w-20 border-4 border-transparent border-b-green-500 border-l-yellow-500 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          <div className="mt-6">
            <FaEye className="text-4xl text-blue-400 mx-auto mb-3 animate-pulse" />
            <p className="text-blue-300 text-xl font-medium">Loading Quiz Details...</p>
            <p className="text-gray-400 text-sm mt-2">Preparing quiz information</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100 flex items-center justify-center p-6">
        <div className="text-center p-10 bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-700/50 max-w-md w-full">
          <div className="bg-red-500/10 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
            <FaQuestionCircle className="text-red-400 text-4xl" />
          </div>
          <h2 className="text-2xl font-bold text-red-400 mb-3">Error Loading Quiz</h2>
          <p className="text-gray-300 mb-8 leading-relaxed">{error}</p>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100 flex items-center justify-center p-6">
        <div className="text-center p-10 bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-700/50 max-w-md w-full">
          <div className="bg-gray-500/10 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
            <FaQuestionCircle className="text-gray-400 text-4xl" />
          </div>
          <h2 className="text-2xl font-bold text-gray-400 mb-3">Quiz Not Found</h2>
          <p className="text-gray-300 mb-8 leading-relaxed">The requested quiz could not be found.</p>
        </div>
      </div>
    );
  }

  const totalPoints = quiz.Questions.reduce((sum, q) => sum + q.points, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header Card */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-3xl shadow-2xl border border-gray-700/50 overflow-hidden mb-8">
          {/* Header with gradient overlay */}
          <div className="relative bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-green-600/20 p-8">
            <div className="absolute inset-0 bg-gray-800/60 backdrop-blur-sm"></div>
            <div className="relative">
              {/* Breadcrumb */}
              <div className="flex items-center text-sm text-gray-300 mb-6 space-x-2">
                <FaBookOpen className="text-blue-400" />
                <span>{quiz.lesson.section.course.title}</span>
                <FaChevronRight className="text-xs" />
                <span>{quiz.lesson.section.title}</span>
                <FaChevronRight className="text-xs" />
                <span>{quiz.lesson.title}</span>
              </div>

              {/* Title and Actions */}
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-2xl">
                    <FaGraduationCap className="text-3xl text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold text-white mb-2">{quiz.title}</h1>
                    <div className="flex items-center space-x-6 text-gray-300">
                      <div className="flex items-center space-x-2">
                        <FaClock className="text-blue-400" />
                        <span>{quiz.timeLimit ? `${quiz.timeLimit} minutes` : 'No time limit'}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FaQuestionCircle className="text-green-400" />
                        <span>{quiz.Questions.length} questions</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FaTrophy className="text-yellow-400" />
                        <span>{totalPoints} total points</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-4">
                  <Link
                    to={`/quiz/${quiz.id}/edit`}
                    className="group relative px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-xl shadow-lg hover:shadow-green-500/25 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-green-500/30 transform hover:scale-105"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-700 rounded-xl blur opacity-70 group-hover:opacity-100 transition duration-300"></div>
                    <div className="relative flex items-center">
                      <FaEdit className="mr-2" />
                      Edit Quiz
                    </div>
                  </Link>
                  <Link
                    to="/quiz/list"
                    className="group relative px-6 py-3 bg-gray-700/50 backdrop-blur-sm text-gray-300 rounded-xl border border-gray-600/50 hover:bg-gray-600/50 hover:text-white transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-gray-500/30 transform hover:scale-105"
                  >
                    <div className="flex items-center">
                      <FaArrowLeft className="mr-2" />
                      Back to List
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Questions Section */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-3xl shadow-2xl border border-gray-700/50 overflow-hidden">
          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <FaListAlt className="mr-3 text-blue-400" />
                Questions Overview
              </h2>
              <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 px-4 py-2 rounded-xl border border-blue-500/30">
                <span className="text-blue-300 font-semibold">{quiz.Questions.length} Questions</span>
              </div>
            </div>

            {quiz.Questions.length > 0 ? (
              <div className="space-y-6">
                {quiz.Questions.map((question, index) => (
                  <div key={question.id} className="group">
                    <div className="bg-gray-700/30 backdrop-blur-sm p-8 rounded-2xl border border-gray-600/30 shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-gray-500/50">
                      {/* Question Header */}
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex items-start space-x-4 flex-1">
                          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl p-3 font-bold text-lg min-w-[3rem] text-center">{index + 1}</div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-xl text-white leading-relaxed mb-3">{question.text}</h3>
                          </div>
                        </div>
                        <div className="bg-yellow-500/20 border border-yellow-500/30 px-4 py-2 rounded-xl">
                          <span className="text-yellow-300 font-semibold flex items-center">
                            <FaStar className="mr-1 text-sm" />
                            {question.points} pts
                          </span>
                        </div>
                      </div>

                      {/* Correct Answer */}
                      <div className="mb-6 ml-20">
                        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                          <div className="flex items-center">
                            <FaCheckCircle className="text-green-400 mr-3" />
                            <span className="text-green-300 font-medium">Correct Answer:</span>
                            <span className="text-white font-semibold ml-2">{question.correctAnswer}</span>
                          </div>
                        </div>
                      </div>

                      {/* Options */}
                      {question.Options && question.Options.length > 0 && (
                        <div className="ml-20">
                          <p className="text-gray-300 font-medium mb-4 flex items-center">
                            <FaListAlt className="mr-2 text-blue-400" />
                            Answer Options:
                          </p>
                          <div className="grid gap-3">
                            {question.Options.map((option, oIndex) => (
                              <div
                                key={option.id}
                                className={`p-4 rounded-xl border transition-all duration-300 ${
                                  option.text === question.correctAnswer ? 'bg-green-500/10 border-green-500/30 text-green-200' : 'bg-gray-600/20 border-gray-500/30 text-gray-300'
                                }`}
                              >
                                <div className="flex items-center">
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3 ${option.text === question.correctAnswer ? 'bg-green-500 text-white' : 'bg-gray-600 text-gray-300'}`}>
                                    {String.fromCharCode(65 + oIndex)}
                                  </div>
                                  <span className="text-base">{option.text}</span>
                                  {option.text === question.correctAnswer && <FaCheckCircle className="ml-auto text-green-400" />}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="bg-gray-700/30 rounded-full p-8 w-32 h-32 mx-auto mb-6 flex items-center justify-center">
                  <FaQuestionCircle className="text-5xl text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-400 mb-2">No Questions Yet</h3>
                <p className="text-gray-500 text-lg">This quiz doesn't have any questions added yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
