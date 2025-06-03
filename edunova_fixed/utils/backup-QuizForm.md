import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { quizApi } from '../lib/quizApi';
import axiosInstance from '~/lib/axios';

interface Question {
  id?: number;
  text: string;
  correctAnswer: string;
  points: number;
  options: Array<{ text: string }>;
}

export default function QuizForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [quiz, setQuiz] = useState({
    title: '',
    timeLimit: '',
    lessonId: '',
  });
  const [questions, setQuestions] = useState<Question[]>([
    {
      text: '',
      correctAnswer: '',
      points: 1,
      options: [{ text: '' }, { text: '' }],
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchQuiz();
    }
  }, [id]);

  useEffect(() => {
    fetchAllCourses();
  }, []);

  const fetchQuiz = async () => {
    try {
      const response = await quizApi.getQuizById(Number(id));
      const quizData = response.data.quiz;
      setQuiz({
        title: quizData.title,
        timeLimit: quizData.timeLimit || '',
        lessonId: quizData.lessonId,
      });

      if (quizData.Questions) {
        setQuestions(
          quizData.Questions.map((q: any) => ({
            id: q.id,
            text: q.text,
            correctAnswer: q.correctAnswer,
            points: q.points,
            options: q.Options || [],
          }))
        );
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch quiz');
    }
  };
  // interface Sections {
  //   name: string;
  //   age: number;
  //   city?: string; // Optional property
  // }

  const [lessons, setLessons] = useState<Array<{ id: number; title: string; order: number }>>([]);
  const [courses, setCourses] = useState<Array<{ id: number; title: string; }>>([]);
  const [courseId, setCourseId] = useState(0);
  const fetchAllCourses = async () => {
    try {
      const response = await axiosInstance.get('/courses');
      const allCourses: Array<{ id: number; title: string; }> = [];

      // Extract courses
      response.data.courses.forEach((course: any) => {
        allCourses.push({
          id: course.id,
          title: course.title,
        });
      });

      // console.log('All courses:', allCourses);
      setCourses(allCourses);
      return allCourses;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch courses');
      return [];
    }
  }
  const fetchAllLessons = async (id: number) => {
    try {
      const response = await axiosInstance.get(`/courses/${id}`);
      const allLessons: Array<{ id: number; title: string; order: number }> = [];
      console.log(response.data);
    // Extract lessons from all courses and sections
      response.data.course.Sections.forEach((section: any) => {
          if (section.Lessons) {
            section.Lessons.forEach((lesson: any) => {
              allLessons.push({
                id: lesson.id,
                title: lesson.title,
                order: lesson.order,
              });
            });
          }
          });

      console.log('All lessons:', allLessons);
      setLessons(allLessons);
      return allLessons;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch lessons');
      return [];
    }
  };

  const handleQuizSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quiz.lessonId && !id) {
      setError('Lesson ID is required for new quiz');
      return;
    }

    try {
      setLoading(true);

      if (id) {
        await quizApi.updateQuiz(Number(id), {
          title: quiz.title,
          timeLimit: quiz.timeLimit ? Number(quiz.timeLimit) : undefined,
        });
      } else {
        const response = await quizApi.createQuiz(Number(quiz.lessonId), {
          title: quiz.title,
          timeLimit: quiz.timeLimit ? Number(quiz.timeLimit) : undefined,
        });
        const newQuizId = response.data.quiz.id;

        // Create questions if any
        if (questions.some((q) => q.text)) {
          const validQuestions = questions.filter((q) => q.text && q.correctAnswer);
          if (validQuestions.length > 0) {
            await quizApi.createBulkQuestions(newQuizId, { questions: validQuestions });

            // Create options for questions
            const questionsResponse = await quizApi.getQuizById(newQuizId);
            const createdQuestions = questionsResponse.data.quiz.Questions;

            const questionsWithOptions = createdQuestions
              .map((q: any, index: number) => ({
                questionId: q.id,
                options: validQuestions[index].options.filter((opt) => opt.text),
              }))
              .filter((item: any) => item.options.length > 0);

            if (questionsWithOptions.length > 0) {
              await quizApi.createOptionsForMultipleQuestions(newQuizId, { questionsWithOptions });
            }
          }
        }
      }

      navigate('/quiz/list');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save quiz');
    } finally {
      setLoading(false);
    }
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        text: '',
        correctAnswer: '',
        points: 1,
        options: [{ text: '' }, { text: '' }],
      },
    ]);
  };

  const updateQuestion = (index: number, field: string, value: any) => {
    const updated = [...questions];
    (updated[index] as any)[field] = value;
    setQuestions(updated);
  };

  const addOption = (questionIndex: number) => {
    const updated = [...questions];
    updated[questionIndex].options.push({ text: '' });
    setQuestions(updated);
  };

  const updateOption = (questionIndex: number, optionIndex: number, text: string) => {
    const updated = [...questions];
    updated[questionIndex].options[optionIndex].text = text;
    setQuestions(updated);
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{id ? 'Edit Quiz' : 'Create Quiz'}</h1>

      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

      <form onSubmit={handleQuizSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Quiz Title</label>
          <input type="text" value={quiz.title} onChange={(e) => setQuiz({ ...quiz, title: e.target.value })} className="w-full p-2 border rounded" required />
        </div>

        <div>
          <div>
            <label className="block font-medium">Select Course</label>
            <select 
              value={courseId} 
              onChange={(e) => {fetchAllLessons(parseInt(e.target.value)); setCourseId(parseInt(e.target.value)); setQuiz({ ...quiz, lessonId: '' });}}
              className="w-full p-2 border rounded" 
              required
            >
              <option value="">Select a course...</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {!id && (
          <div>
            <label className="block font-medium">Select Lesson</label>
            <select value={quiz.lessonId} onChange={(e) => setQuiz({ ...quiz, lessonId: e.target.value })} className="w-full p-2 border rounded" required>
              <option value="">Select a lesson...</option>
              {lessons.map((lesson) => (
                <option key={lesson.id} value={lesson.id}>
                  {lesson.title}
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="block font-medium">Time Limit (minutes)</label>
          <input type="number" value={quiz.timeLimit} onChange={(e) => setQuiz({ ...quiz, timeLimit: e.target.value })} className="w-full p-2 border rounded" />
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Questions</h3>
            <button type="button" onClick={addQuestion} className="bg-green-500 text-white px-3 py-1 rounded">
              Add Question
            </button>
          </div>

          {questions.map((question, qIndex) => (
            <div key={qIndex} className="border p-4 mb-4 rounded">
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="block text-sm font-medium">Question Text</label>
                  <textarea value={question.text} onChange={(e) => updateQuestion(qIndex, 'text', e.target.value)} className="w-full p-2 border rounded" rows={2} />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium">Correct Answer</label>
                    <input type="text" value={question.correctAnswer} onChange={(e) => updateQuestion(qIndex, 'correctAnswer', e.target.value)} className="w-full p-2 border rounded" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Points</label>
                    <input type="number" value={question.points} onChange={(e) => updateQuestion(qIndex, 'points', Number(e.target.value))} className="w-full p-2 border rounded" min="1" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium">Options</label>
                    <button type="button" onClick={() => addOption(qIndex)} className="bg-blue-500 text-white px-2 py-1 rounded text-xs">
                      Add Option
                    </button>
                  </div>
                  {question.options.map((option, oIndex) => (
                    <input key={oIndex} type="text" value={option.text} onChange={(e) => updateOption(qIndex, oIndex, e.target.value)} placeholder={`Option ${oIndex + 1}`} className="w-full p-2 border rounded mb-2" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <button type="submit" disabled={loading} className="bg-blue-500 text-white px-4 py-2 rounded">
            {loading ? 'Saving...' : 'Save Quiz'}
          </button>
          <button type="button" onClick={() => navigate('/quiz/list')} className="bg-gray-500 text-white px-4 py-2 rounded">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

# Backup Section 1

import { useParams, Link, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import axiosInstance from "../lib/axios";

interface Section {
  id: number;
  title: string;
  order: number;
  courseId: number;
  Lessons?: any[];
}

interface Course {
  id: number;
  title: string;
}

export default function CourseSections() {
  const { id: courseId } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [sections, setSections] = useState<Section[]>([]);
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [editTitle, setEditTitle] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    fetchSections();
  }, [courseId, isAuthenticated]);

  const fetchSections = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/courses/${courseId}/sections?includeLessons=true`);
      setSections(response.data.sections);
      setCourse(response.data.course);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch sections");
    } finally {
      setLoading(false);
    }
  };

  const createSection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSectionTitle.trim()) return;

    try {
      await axiosInstance.post(`/courses/${courseId}/sections/create`, {
        title: newSectionTitle
      });
      setNewSectionTitle("");
      setShowCreateForm(false);
      fetchSections();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create section");
    }
  };

  const updateSection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSection || !editTitle.trim()) return;

    try {
      await axiosInstance.put(`/sections/${editingSection.id}`, {
        title: editTitle
      });
      setEditingSection(null);
      setEditTitle("");
      fetchSections();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update section");
    }
  };

  const deleteSection = async (sectionId: number) => {
    if (!confirm("Are you sure you want to delete this section?")) return;

    try {
      await axiosInstance.delete(`/sections/${sectionId}`);
      fetchSections();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete section");
    }
  };

  const moveSection = async (sectionId: number, direction: "up" | "down") => {
    const sectionIndex = sections.findIndex(s => s.id === sectionId);
    if (sectionIndex === -1) return;

    const newSections = [...sections];
    const targetIndex = direction === "up" ? sectionIndex - 1 : sectionIndex + 1;
    
    if (targetIndex < 0 || targetIndex >= newSections.length) return;

    [newSections[sectionIndex], newSections[targetIndex]] = [newSections[targetIndex], newSections[sectionIndex]];
    
    const sectionOrders = newSections.map((section, index) => ({
      id: section.id,
      order: index + 1
    }));

    try {
      await axiosInstance.put(`/courses/${courseId}/sections/reorder`, {
        sectionOrders
      });
      fetchSections();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to reorder sections");
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-6">
        <Link to="/" className="text-blue-600 hover:underline">← Back to Dashboard</Link>
        <h1 className="text-2xl font-bold mt-2">Manage Sections</h1>
        {course && <p className="text-gray-600">Course: {course.title}</p>}
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
          <button onClick={() => setError(null)} className="float-right">×</button>
        </div>
      )}

      {(user?.role === "INSTRUCTOR" || user?.role === "ADMIN") && (
        <div className="mb-6">
          {!showCreateForm ? (
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Add Section
            </button>
          ) : (
            <form onSubmit={createSection} className="flex gap-2">
              <input
                type="text"
                value={newSectionTitle}
                onChange={(e) => setNewSectionTitle(e.target.value)}
                placeholder="Section title"
                className="flex-1 p-2 border rounded"
                autoFocus
              />
              <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
                Create
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCreateForm(false);
                  setNewSectionTitle("");
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </form>
          )}
        </div>
      )}

      <div className="space-y-4">
        {sections.map((section, index) => (
          <div key={section.id} className="border rounded p-4">
            <div className="flex items-center justify-between mb-2">
              {editingSection?.id === section.id ? (
                <form onSubmit={updateSection} className="flex-1 flex gap-2">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="flex-1 p-2 border rounded"
                    autoFocus
                  />
                  <button type="submit" className="bg-green-500 text-white px-3 py-1 rounded text-sm">
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingSection(null);
                      setEditTitle("");
                    }}
                    className="bg-gray-500 text-white px-3 py-1 rounded text-sm"
                  >
                    Cancel
                  </button>
                </form>
              ) : (
                <>
                  <h3 className="text-lg font-semibold">
                    {section.order}. {section.title}
                  </h3>
                  {(user?.role === "INSTRUCTOR" || user?.role === "ADMIN") && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => moveSection(section.id, "up")}
                        disabled={index === 0}
                        className="bg-gray-300 px-2 py-1 rounded text-sm disabled:opacity-50"
                      >
                        ↑
                      </button>
                      <button
                        onClick={() => moveSection(section.id, "down")}
                        disabled={index === sections.length - 1}
                        className="bg-gray-300 px-2 py-1 rounded text-sm disabled:opacity-50"
                      >
                        ↓
                      </button>
                      <button
                        onClick={() => {
                          setEditingSection(section);
                          setEditTitle(section.title);
                        }}
                        className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteSection(section.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
            
            {section.Lessons && section.Lessons.length > 0 && (
              <div className="mt-3 pl-4 border-l-2 border-gray-200">
                <p className="text-sm text-gray-600 mb-2">Lessons:</p>
                {section.Lessons.map((lesson: any) => (
                  <div key={lesson.id} className="text-sm text-gray-700 mb-1">
                    {lesson.order}. {lesson.title} 
                    {lesson.duration && <span className="text-gray-500"> ({lesson.duration})</span>}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {sections.length === 0 && (
        <div className="text-center text-gray-500 mt-8">
          No sections found. Create your first section to get started.
        </div>
      )}
    </div>
  );
}

# Backup Section 2 (lesson)

# Backup Submission
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router';
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
}

export default function Submissions() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ type: '', status: '' });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchSubmissions();
  }, [user, filter]);

  const fetchSubmissions = async () => {
    try {
      const endpoint = user?.role === 'INSTRUCTOR' 
        ? '/instructor/submissions'
        : '/student/submissions'; 
    
      const params = new URLSearchParams();
      if (filter.type) params.append('type', filter.type);
      if (filter.status) params.append('status', filter.status);

      console.log('Fetching from:', `${endpoint}?${params}`); // Debug log

      const response = await axiosInstance.get(`${endpoint}?${params}`);
      
      console.log('API Response:', response.data); // Debug log
      setSubmissions(response.data.submissions || []);
    } catch (error: any) {
      console.error('Failed to fetch submissions:', error);
      console.error('Error response:', error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const gradeSubmission = async (id: number, type: string, score: number, feedback: string) => {
    try {
      await axiosInstance.put(`/submissions/${id}/grade?type=${type}`, {
        score,
        feedback
      });
      fetchSubmissions();
      alert('Submission graded successfully');
    } catch (error: any) {
      console.error('Failed to grade submission:', error);
      alert(error.response?.data?.message || 'Failed to grade submission');
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;

  if (submissions.length === 0) {
    return (
      <div className="max-w-6xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">
          {user?.role === 'INSTRUCTOR' ? 'Grade Submissions' : 'My Submissions'}
        </h1>
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500">No submissions found.</p>
          {user?.role === 'STUDENT' && (
            <p className="text-sm text-gray-400 mt-2">
              Take some quizzes or submit assignments to see them here.
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">
        {user?.role === 'INSTRUCTOR' ? 'Grade Submissions' : 'My Submissions'}
      </h1>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <div className="flex gap-4">
            <select 
              value={filter.type} 
              onChange={(e) => setFilter({...filter, type: e.target.value})}
              className="border rounded px-3 py-1"
            >
              <option value="">All Types</option>
              <option value="quiz">Quiz</option>
              <option value="assignment">Assignment</option>
            </select>
            <select 
              value={filter.status} 
              onChange={(e) => setFilter({...filter, status: e.target.value})}
              className="border rounded px-3 py-1"
            >
              <option value="">All Status</option>
              <option value="SUBMITTED">Submitted</option>
              <option value="GRADED">Graded</option>
              <option value="LATE_SUBMITTED">Late</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left">Type</th>
                <th className="px-4 py-2 text-left">Title</th>
                <th className="px-4 py-2 text-left">Course</th>
                <th className="px-4 py-2 text-left">Score</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Submitted</th>
                {user?.role === 'INSTRUCTOR' && <th className="px-4 py-2 text-left">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {submissions.map((submission) => (
                <SubmissionRow 
                  key={submission.id} 
                  submission={submission} 
                  userRole={user?.role || 'STUDENT'}
                  onGrade={gradeSubmission}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function SubmissionRow({ 
  submission, 
  userRole, 
  onGrade 
}: { 
  submission: Submission; 
  userRole: string;
  onGrade: (id: number, type: string, score: number, feedback: string) => void;
}) {
  const [grading, setGrading] = useState(false);
  const [gradeForm, setGradeForm] = useState({ score: '', feedback: '' });

  const handleGrade = () => {
    const score = parseFloat(gradeForm.score);
    if (isNaN(score) || score < 0) {
      alert('Please enter a valid score');
      return;
    }
    
    // Validasi score berdasarkan tipe
    if (submission.type === 'quiz' && score > 100) {
      alert('Quiz score cannot exceed 100%');
      return;
    }
    
    onGrade(submission.id, submission.type, score, gradeForm.feedback);
    setGrading(false);
    setGradeForm({ score: '', feedback: '' });
  };

  return (
    <tr className="border-b">
      <td className="px-4 py-2">
        <span className={`px-2 py-1 rounded text-xs ${
          submission.type === 'quiz' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
        }`}>
          {submission.type ? submission.type.toUpperCase() : 'UNKNOWN'}
        </span>
      </td>
      <td className="px-4 py-2">{submission?.title ?? 'Perlu di Fix Za'}</td>
      <td className="px-4 py-2">{submission.course?.title ?? 'Perlu di Fix Za'}</td>
      <td className="px-4 py-2">
        {submission.score !== null && submission.score !== undefined 
          ? `${submission.score}${submission.type === 'quiz' ? '%' : ' pts'}` 
          : '-'
        }
      </td>
      <td className="px-4 py-2">
        <span className={`px-2 py-1 rounded text-xs ${
          submission.status === 'GRADED' ? 'bg-green-100 text-green-800' : 
          submission.isLate ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
        }`}>
          {submission.status}
        </span>
      </td>
      <td className="px-4 py-2">
        {new Date(submission.submittedAt).toLocaleDateString()}
      </td>
      {userRole === 'INSTRUCTOR' && (
        <td className="px-4 py-2">
          {submission.status !== 'GRADED' ? (
            grading ? (
              <div className="space-y-2">
                <input
                  type="number"
                  placeholder={submission.type === 'quiz' ? 'Score (0-100)' : 'Score'}
                  value={gradeForm.score}
                  onChange={(e) => setGradeForm({...gradeForm, score: e.target.value})}
                  className="border rounded px-2 py-1 w-24"
                  min="0"
                  max={submission.type === 'quiz' ? "100" : undefined}
                />
                <input
                  type="text"
                  placeholder="Feedback"
                  value={gradeForm.feedback}
                  onChange={(e) => setGradeForm({...gradeForm, feedback: e.target.value})}
                  className="border rounded px-2 py-1 w-32"
                />
                <div>
                  <button onClick={handleGrade} className="bg-green-500 text-white px-2 py-1 rounded text-xs mr-1">
                    Save
                  </button>
                  <button onClick={() => setGrading(false)} className="bg-gray-500 text-white px-2 py-1 rounded text-xs">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button 
                onClick={() => setGrading(true)}
                className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600"
              >
                Grade
              </button>
            )
          ) : (
            <div className="text-green-600 text-xs">
              <div>Graded</div>
              {submission.feedback && (
                <div className="text-gray-500 text-xs mt-1">{submission.feedback}</div>
              )}
            </div>
          )}
        </td>
      )}
    </tr>
  );
}

# Dashboard

import { Welcome } from '../welcome/welcome';
import { useAuth } from '../contexts/AuthContext';
import { Navigate, Link } from 'react-router';
import { useState, useEffect } from 'react';
import axiosInstance from '../lib/axios';

export function meta() {
  return [{ title: 'EduNova - Learning Platform' }, { name: 'description', content: 'Welcome to EduNova Learning Platform!' }];
}

interface Course {
  id: number;
  title: string;
  description: string;
  instructorId: number;
}

interface Quiz {
  id: number;
  title: string;
  description: string;
  timeLimit: number;
  totalPoints: number;
  course: {
    id: number;
    title: string;
  };
  status?: 'available' | 'completed' | 'in_progress';
  userSubmission?: {
    id: number;
    score: number;
    status: string;
    submittedAt: string;
  };
}

interface Assignment {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  totalPoints: number;
  course: {
    id: number;
    title: string;
  };
  status?: 'available' | 'submitted' | 'graded' | 'overdue';
  userSubmission?: {
    id: number;
    score: number;
    status: string;
    submittedAt: string;
  };
}

export default function Home() {
  const { user, logout, loading, isAuthenticated } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [loadingQuizzes, setLoadingQuizzes] = useState(false);
  const [loadingAssignments, setLoadingAssignments] = useState(false);

  // Fetch courses for instructor/admin
  useEffect(() => {
    if (isAuthenticated && (user?.role === 'INSTRUCTOR' || user?.role === 'ADMIN')) {
      fetchCourses();
    }
  }, [isAuthenticated, user]);

  // Fetch quizzes and assignments for students
  useEffect(() => {
    if (isAuthenticated && user?.role === 'STUDENT') {
      fetchQuizzes();
      fetchAssignments();
    }
  }, [isAuthenticated, user]);

  const fetchCourses = async () => {
    try {
      setLoadingCourses(true);
      const response = await axiosInstance.get('/courses');
      setCourses(response.data.courses || []);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    } finally {
      setLoadingCourses(false);
    }
  };

  const fetchQuizzes = async () => {
    try {
      setLoadingQuizzes(true);
      const response = await axiosInstance.get('/quizzes/available');
      setQuizzes(response.data.quizzes || []);
    } catch (error) {
      console.error('Failed to fetch quizzes:', error);
    } finally {
      setLoadingQuizzes(false);
    }
  };

  const fetchAssignments = async () => {
    try {
      setLoadingAssignments(true);
      const response = await axiosInstance.get('/assignments/available');
      setAssignments(response.data.assignments || []);
    } catch (error) {
      console.error('Failed to fetch assignments:', error);
    } finally {
      setLoadingAssignments(false);
    }
  };

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is authenticated, show dashboard
  if (isAuthenticated && user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-semibold text-black">EduNova</h1>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">Welcome, {user.name}!</span>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">{user.role}</span>
                
                {/* Quiz Management Link for Instructors/Admins */}
                {(user.role === 'INSTRUCTOR' || user.role === 'ADMIN') && (
                  <Link 
                    to="/quiz/list" 
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
                  >
                    Manage Quizzes
                  </Link>
                )}
                
                <Link to="/Profile" className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition-colors">
                  Profile
                </Link>
                <Link to="/submissions" className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition-colors">
                  View Submissions
                </Link>

                <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors">
                  Logout
                </button>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Dashboard</h2>
              <p className="text-gray-600 mb-6">Welcome to your learning dashboard, {user.name}!</p>
            </div>

            {/* Student Dashboard */}
            {user.role === 'STUDENT' && (
              <>
                {/* Available Quizzes */}
                <div className="bg-white shadow rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-semibold mb-4 text-black">Available Quizzes</h3>
                  {loadingQuizzes ? (
                    <p className="text-gray-500">Loading quizzes...</p>
                  ) : quizzes.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {quizzes.map((quiz) => (
                        <div key={quiz.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                          <h4 className="font-medium text-gray-900 mb-2">{quiz.title}</h4>
                          <p className="text-sm text-gray-600 mb-2">{quiz.description}</p>
                          <div className="text-xs text-gray-500 mb-3">
                            <div>Course: {quiz.course.title}</div>
                            <div>Time Limit: {quiz.timeLimit} minutes</div>
                            <div>Total Points: {quiz.totalPoints}</div>
                          </div>
                          {quiz.userSubmission ? (
                            <div className="space-y-2">
                              <div className="text-sm">
                                <span className="text-green-600">Completed</span> - Score: {quiz.userSubmission.score}%
                              </div>
                              <Link 
                                to={`/quiz/${quiz.id}/results`}
                                className="block w-full text-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm"
                              >
                                View Results
                              </Link>
                            </div>
                          ) : (
                            <Link 
                              to={`/quiz/${quiz.id}/take`}
                              className="block w-full text-center bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 text-sm"
                            >
                              Take Quiz
                            </Link>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No quizzes available.</p>
                  )}
                </div>

                {/* Available Assignments */}
                <div className="bg-white shadow rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-semibold mb-4 text-black">Available Assignments</h3>
                  {loadingAssignments ? (
                    <p className="text-gray-500">Loading assignments...</p>
                  ) : assignments.length > 0 ? (
                    <div className="space-y-4">
                      {assignments.map((assignment) => (
                        <div key={assignment.id} className="border rounded-lg p-4 flex justify-between items-center">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{assignment.title}</h4>
                            <p className="text-sm text-gray-600">{assignment.description}</p>
                            <div className="text-xs text-gray-500 mt-1">
                              <div>Course: {assignment.course.title}</div>
                              <div>Due: {new Date(assignment.dueDate).toLocaleDateString()}</div>
                              <div>Points: {assignment.totalPoints}</div>
                            </div>
                          </div>
                          <div className="ml-4">
                            {assignment.userSubmission ? (
                              <div className="text-center">
                                <div className="text-sm text-green-600 mb-1">
                                  {assignment.userSubmission.status === 'GRADED' 
                                    ? `Score: ${assignment.userSubmission.score}%` 
                                    : 'Submitted'}
                                </div>
                                <button className="bg-gray-400 text-white px-4 py-2 rounded text-sm cursor-not-allowed">
                                  Submitted
                                </button>
                              </div>
                            ) : (
                              <button className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 text-sm">
                                Submit Assignment
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No assignments available.</p>
                  )}
                </div>
              </>
            )}

            {(user.role === 'INSTRUCTOR' || user.role === 'ADMIN') && (
              <div className="bg-white shadow rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold mb-4 text-black">Your Courses</h3>

                {loadingCourses ? (
                  <p className="text-gray-500">Loading courses...</p>
                ) : courses.length > 0 ? (
                  <div className="space-y-3">
                    {courses
                      .filter(course => user.role === 'ADMIN' || course.instructorId === user.id)
                      .map((course) => (
                        <div key={course.id} className="border rounded p-4 flex justify-between items-center">
                          <div>
                            <h4 className="font-medium text-gray-900">{course.title}</h4>
                            <p className="text-sm text-gray-600">{course.description}</p>
                          </div>
                          <div className="flex space-x-2">
                            <Link to={`/courses/${course.id}/sections`} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm">
                              Manage Sections
                            </Link>
                            <Link to={`/courses/${course.id}/lessons`} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 text-sm">
                              Manage Lessons
                            </Link>
                          </div>
                        </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No courses found.</p>
                )}
              </div>
            )}

            {/* Quick access section */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-black">Quick Access</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {user.role === 'STUDENT' && (
                  <>
                    <div className="border rounded p-4 text-center">
                      <h4 className="font-medium mb-2 text-black ">All Courses</h4>
                      <p className="text-sm text-gray-600 mb-3">View your enrolled courses</p>
                      <Link to="/course" className="bg-yellow-500 text-white px-4 py-2 rounded text-sm">View Courses</Link>
                    </div>
                    <div className="border rounded p-4 text-center">
                      <h4 className="font-medium mb-2 text-black ">My Enrollments</h4>
                      <p className="text-sm text-gray-600 mb-3">View your enrolled courses</p>
                      <Link to="/my-enrollments" className="bg-green-500 text-white px-4 py-2 rounded text-sm">View Courses</Link>
                    </div>
                    <div className="border rounded p-4 text-center">
                      <h4 className="font-medium mb-2 text-black">Quiz History</h4>
                      <p className="text-sm text-gray-600 mb-3">View completed quizzes</p>
                      <Link to="/submissions" className="bg-blue-500 text-white px-4 py-2 rounded text-sm inline-block">
                        View History
                      </Link>
                    </div>
                    <div className="border rounded p-4 text-center">
                      <h4 className="font-medium mb-2 text-black">Assignments</h4>
                      <p className="text-sm text-gray-600 mb-3">View assignment submissions</p>
                      <Link to="/submissions" className="bg-purple-500 text-white px-4 py-2 rounded text-sm inline-block">
                        View Submissions
                      </Link>
                    </div>
                    <div className="border rounded p-4 text-center">
                      <h4 className="font-medium mb-2 text-black">Instructors</h4>
                      <p className="text-sm text-gray-600 mb-3">See The Instructors and Courses</p>
                      <Link to="/instructors" className="bg-purple-500 text-white px-4 py-2 rounded text-sm inline-block">
                        View Instructors
                      </Link>
                    </div>
                    <div className="border rounded p-4 text-center">
                      <h4 className="font-medium mb-2 text-black">Category n Tags</h4>
                      <p className="text-sm text-gray-600 mb-3">See Tags n Category available</p>
                      <Link to="/category" className="bg-orange-500 text-white px-4 py-2 rounded text-sm inline-block">
                        Category
                      </Link>
                    </div>
                  </>
                )}

                {(user.role === 'INSTRUCTOR' || user.role === 'ADMIN') && (
                  <>
                    <div className="border rounded p-4 text-center">
                      <h4 className="font-medium mb-2 text-black">Courses List</h4>
                      <p className="text-sm text-gray-600 mb-3">Create and update Courses</p>
                      <Link to="/course" className="bg-orange-500 text-white px-4 py-2 rounded text-sm inline-block">
                        Create
                      </Link>
                    </div>

                    <div className="border rounded p-4 text-center">
                      <h4 className="font-medium mb-2 text-black">Quiz Management</h4>
                      <p className="text-sm text-gray-600 mb-3 text-black">Create and manage quizzes</p>
                      <Link to="/quiz/list" className="bg-green-500 text-white px-4 py-2 rounded text-sm inline-block">
                        Manage Quizzes
                      </Link>
                    </div>

                    <div className="border rounded p-4 text-center">
                      <h4 className="font-medium mb-2 text-black">Create Quiz</h4>
                      <p className="text-sm text-gray-600 mb-3">Add a new quiz</p>
                      <Link to="/quiz/create" className="bg-emerald-500 text-white px-4 py-2 rounded text-sm inline-block">
                        Create Quiz
                      </Link>
                    </div>

                    <div className="border rounded p-4 text-center">
                      <h4 className="font-medium mb-2 text-black">Grade Submissions</h4>
                      <p className="text-sm text-gray-600 mb-3">Review student work</p>
                      <Link to="/submissions" className="bg-orange-500 text-white px-4 py-2 rounded text-sm inline-block">
                        Grade Work
                      </Link>
                    </div>

                    <div className="border rounded p-4 text-center">
                      <h4 className="font-medium mb-2 text-black">Analytics</h4>
                      <p className="text-sm text-gray-600 mb-3">View course statistics</p>
                      <Link to="/course" className="bg-purple-500 text-white px-4 py-2 rounded text-sm inline-block">
                        Create
                      </Link>
                    </div>
                  </>
                )}

                {user.role === 'ADMIN' && (
                  <>
                    <div className="border rounded p-4 text-center">
                      <h4 className="font-medium mb-2 text-black">Admin Panel</h4>
                      <p className="text-sm text-gray-600 mb-3">Manage users and system</p>
                      <Link to="/admin/stats" className="bg-orange-500 text-white px-4 py-2 rounded text-sm inline-block">
                        Admin Dashboard
                      </Link>
                    </div>
                    <div className="border rounded p-4 text-center">
                      <h4 className="font-medium mb-2 text-black">Category n Tags</h4>
                      <p className="text-sm text-gray-600 mb-3">Create and update Category</p>
                      <Link to="/category" className="bg-orange-500 text-white px-4 py-2 rounded text-sm inline-block">
                        Category
                      </Link>
                    </div>
                    <div className="border rounded p-4 text-center">
                      <h4 className="font-medium mb-2 text-black">Payout</h4>
                      <p className="text-sm text-gray-600 mb-3">Find the Instructor Payout</p>
                      <Link to="/payouts/pending" className="bg-orange-500 text-white px-4 py-2 rounded text-sm inline-block">
                        Payout
                      </Link>
                    </div>
                    <div className="border rounded p-4 text-center">
                      <h4 className="font-medium mb-2 text-black">Instructors</h4>
                      <p className="text-sm text-gray-600 mb-3">See The Instructors and Courses</p>
                      <Link to="/instructors" className="bg-purple-500 text-white px-4 py-2 rounded text-sm inline-block">
                        View Instructors
                      </Link>
                    </div>
                  </>
                )}

                {user.role === 'INSTRUCTOR' && (
                  <>
                    <div className="border rounded p-4 text-center">
                      <h4 className="font-medium mb-2 text-black">Payout</h4>
                      <p className="text-sm text-gray-600 mb-3">Create and See your Payout</p>
                      <Link to="/payout" className="bg-orange-500 text-white px-4 py-2 rounded text-sm inline-block">
                        Payout
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Direct access for testing */}
            {/* <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded p-4">
              <h4 className="font-medium text-yellow-800 mb-2">Quick Test Access</h4>
              <div className="space-x-2 space-y-2">
                <Link to="/courses/1/sections" className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600 inline-block">
                  Course 1 Sections
                </Link>
                <Link to="/courses/2/sections" className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600 inline-block">
                  Course 2 Sections
                </Link>
                <Link to="/courses/1/lessons" className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 inline-block">
                  Course 1 Lessons
                </Link>
                <Link to="/courses/2/lessons" className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 inline-block">
                  Course 2 Lessons
                </Link>
                <Link to="/quiz/list" className="bg-emerald-500 text-white px-3 py-1 rounded text-sm hover:bg-emerald-600 inline-block">
                  Quiz Management
                </Link>
                <Link to="/quiz/create" className="bg-teal-500 text-white px-3 py-1 rounded text-sm hover:bg-teal-600 inline-block">
                  Create Quiz
                </Link>
                <Link to="/submissions" className="bg-purple-500 text-white px-3 py-1 rounded text-sm hover:bg-purple-600 inline-block">
                  View Submissions
                </Link>
              </div>
            </div> */}

          </div>
        </main>
      </div>
    );
  }

  // If not authenticated, show welcome page
  return <Welcome />;
}

# Enroll Payment

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, redirect } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import axiosInstance from '../lib/axios';

export default function EnrollPayment() {
  const { id: enrollmentId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState<{ title: string; price: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!enrollmentId) return;
    fetchCourse();
  }, [enrollmentId]);

  const fetchCourse = async () => {
    try {
      const res = await axiosInstance.get(`/enrollments/${enrollmentId}`);
      console.log('Course data:', res.data.enrollment.course);
      // assume API returns course.price in cents or dollars
      setCourse({ title: res.data.enrollment.course.title, price: res.data.enrollment.course.price });
    } catch (err) {
      console.error('Failed to load course:', err);
      alert('Unable to load course info.');
      // navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const [paymentMethods, setPaymentMethod] = useState('CREDIT_CARD');

  const handlePayment = async () => {
    if (!enrollmentId) return;
    setProcessing(true);
    console.log('payment method selected:', paymentMethods);
    try {
      // create a Stripe Checkout session (backend must implement this endpoint)
      const { data } = await axiosInstance.put(`/enrollments/${enrollmentId}/payment`, { 
        paymentMethod: paymentMethods,
       });
       navigate('/');
    } catch (err: any) {
      console.error('Payment initiation failed:', err);
      alert(err.response.data.message || 'Payment failed. Please try again.');
      setProcessing(false);
    }
  };

  if (!user) {
    return (
      <div className="p-4">
        <p>Please <Link to="/login" className="text-blue-600">login</Link> to enroll.</p>
      </div>
    );
  }

  if (loading) {
    return <div className="p-4">Loading course information…</div>;
  }

  return (
    <div className="max-w-lg mx-auto p-4">
      <Link to={`/courses/${enrollmentId}/lessons`} className="text-blue-600 hover:underline mb-4 inline-block">
        ← Back to Course
      </Link>
      <h1 className="text-2xl font-bold mb-2">{course?.title}</h1>
      <p className="mb-6">Price: <span className="font-semibold">${(course?.price ?? 0).toFixed(2)}</span></p>

      <select className='block w-full mb-4 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500' name="paymentMethod" value={paymentMethods} onChange={e => setPaymentMethod(e.target.value)} id="">
        <option value="CREDIT_CARD">Credit Card</option>
        <option value="E_WALLET">E-Wallet</option>
        <option value="BANK_TRANSFER">Bank Transfer</option>
      </select>

      <button
        onClick={handlePayment}
        disabled={processing}
        className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-lg disabled:opacity-50"
      >
        {processing ? 'Processing…' : 'Proceed to Payment'}
      </button>
    </div>
  );
}

# User Enrollment

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import axiosInstance from '../lib/axios';

type Enrollment = {
  id: number;
  course: {
    id: number;
    title: string;
    price: number;
  };
  enrolledAt: string;
};

export default function UserEnrollments() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchEnrollments();
  }, [user]);

  const fetchEnrollments = async () => {
    try {
      // Assuming your backend has an endpoint to fetch current user's enrollments
      const res = await axiosInstance.get<{
        enrollments: Enrollment[];
      }>(`/my-enrollments`);
      setEnrollments(res.data.enrollments);
    } catch (err) {
      console.error('Failed to fetch enrollments:', err);
      alert('Unable to load your enrollments.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-4">Loading your enrollments…</div>;
  }

  if (enrollments.length === 0) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-2">My Enrollments</h2>
        <p>You have not enrolled in any courses yet.</p>
        <Link to="/" className="text-blue-600 hover:underline mt-4 inline-block">
          Browse Courses →
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">My Enrollments</h2>
      <ul className="space-y-4">
        {enrollments.map(en => (
          <li
            key={en.id}
            className="border rounded-lg p-4 flex justify-between items-center"
          >
            <div>
              <h3 className="text-lg font-medium">{en.course.title}</h3>
              <p className="text-sm text-gray-600">
                Enrolled on {new Date(en.enrolledAt).toLocaleDateString()}
              </p>
              <p className="text-sm">
                Price paid: ${ (en.course.price / 100).toFixed(2) }
              </p>
            </div>
            <Link
              to={`/courses/${en.course.id}/lessons`}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Go to Course
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

# Login

import React, { useState } from 'react';
import { Link, Navigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const { login, loading, error, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(formData.email, formData.password);
    } catch (error) {
      // Error is handled by AuthContext
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>

          <div className="text-center">
            <Link to="/register" className="text-indigo-600 hover:text-indigo-500">
              Don't have an account? Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

# Register

import React, { useState } from 'react';
import { Link, Navigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';

export default function Register() {
  const { register, loading, error, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'STUDENT'
  });

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(formData.name, formData.email, formData.password, formData.role);
    } catch (error) {
      // Error is handled by AuthContext
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                Role
              </label>
              <select
                id="role"
                name="role"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={formData.role}
                onChange={handleChange}
                disabled={loading}
              >
                <option value="STUDENT">Student</option>
                <option value="INSTRUCTOR">Instructor</option>
              </select>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </div>

          <div className="text-center">
            <Link
              to="/login"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Already have an account? Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

# backup UserEnrollment.tsx

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Mengubah dari 'react-router' ke 'react-router-dom'
import { useAuth } from '../contexts/AuthContext';
import axiosInstance from '../lib/axios'; // pastikan path-nya sesuai
import {
  FaBookOpen, FaCalendarAlt, FaDollarSign, FaArrowRight,
  FaSpinner, FaInfoCircle
} from 'react-icons/fa'; // Import ikon

type Enrollment = {
  id: number;
  course: {
    id: number;
    title: string;
    price: number;
  };
  enrolledAt: string;
};

export default function UserEnrollments() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // State untuk error

  useEffect(() => {
    if (!user) {
      // Jika user tidak ada, navigasi ke halaman login
      navigate('/login');
      return;
    }
    fetchEnrollments();
  }, [user, navigate]); // Tambahkan `Maps` ke dependency array

  const fetchEnrollments = async () => {
    setLoading(true);
    setError(null); // Reset error
    try {
      // Assuming your backend has an endpoint to fetch current user's enrollments
      const res = await axiosInstance.get<{
        enrollments: Enrollment[];
      }>(`/my-enrollments`);
      setEnrollments(res.data.enrollments);
    } catch (err: any) {
      console.error('Failed to fetch enrollments:', err);
      const errorMessage = err.response?.data?.message || 'Unable to load your enrollments. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Global container for the component
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-gray-800 rounded-lg shadow-xl p-8 border border-gray-700">

        <h1 className="text-3xl font-bold text-white mb-8 text-center flex items-center justify-center">
          <FaBookOpen className="mr-3 text-blue-400" /> My Enrollments
        </h1>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-blue-300 text-lg">Loading your enrollments...</p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="bg-red-900/20 text-red-400 p-4 rounded-md mb-6 border border-red-700 flex items-center justify-center">
            <FaInfoCircle className="mr-3 text-2xl" /> {error}
          </div>
        )}

        {/* No Enrollments State */}
        {!loading && !error && enrollments.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-400 text-lg mb-4">You have not enrolled in any courses yet.</p>
            <Link
              to="/course"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-md"
            >
              Browse Courses <FaArrowRight className="ml-2" />
            </Link>
          </div>
        )}

        {/* Enrollments List */}
        {!loading && !error && enrollments.length > 0 && (
          <ul className="space-y-4">
            {enrollments.map(en => (
              <li
                key={en.id}
                className="bg-gray-700 p-5 rounded-lg shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center transition-transform transform hover:scale-[1.01] border border-gray-600"
              >
                <div className="mb-4 sm:mb-0">
                  <h3 className="text-xl font-semibold text-white mb-1">{en.course.title}</h3>
                  <p className="text-sm text-gray-400 flex items-center mb-1">
                    <FaCalendarAlt className="mr-2 text-gray-500" /> Enrolled on {new Date(en.enrolledAt).toLocaleDateString()}
                  </p>
                  <p className="text-md text-green-400 font-medium flex items-center">
                    <FaDollarSign className="mr-2 text-green-500" /> Price paid: ${(en.course.price / 100).toFixed(2)}
                  </p>
                </div>
                <Link
                  to={`/courses/${en.course.id}/lessons`}
                  className="inline-flex items-center px-5 py-2 bg-purple-600 text-white rounded-lg shadow-md hover:bg-purple-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 text-md"
                >
                  Go to Course <FaArrowRight className="ml-2" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

# backup EnrollCourse.tsx (payment gateway)

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { enrollAPI } from '../lib/enroll';

export default function EnrollCourse() {
  const { id } = useParams();
  const courseId = Number(id); // Pastikan ID dikonversi ke number
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [needsPayment, setNeedsPayment] = useState<boolean | null>(null);

  const handleEnroll = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await enrollAPI.enrollCourse(courseId);

      const enrollmentId = res.data.enrollment?.id;
      const needPayment = res.data.needsPayment;

      setMessage(res.data.message);
      setNeedsPayment(needPayment);

      // Redirect to payment page if needed
      if (enrollmentId && needPayment) {
        navigate(`/enrollments/${enrollmentId}/payment`);
      }
    } catch (error) {
      console.error('Enroll failed:', error);
      setMessage('Gagal enroll course');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleEnroll}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {loading ? 'Memproses...' : 'Enroll Course'}
      </button>

      {message && (
        <p className="mt-4 text-white">
          {message}
          {needsPayment && ' (Pembayaran diperlukan)'}
        </p>
      )}
    </div>
  );
}

# Quiz Result

import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import axios from 'axios';
import axiosInstance from '~/lib/axios';

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

  useEffect(() => {
    fetchResults();
  }, [id]);

  const fetchResults = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axiosInstance.get(`/quizzes/${id}/results`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setResults(response.data);
    } catch (error) {
      console.error('Failed to fetch results');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-4">Loading results...</div>;
  if (!results) return <div className="p-4">Results not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-4">{results.quiz.title} - Results</h1>
        
        <div className="bg-gray-50 p-4 rounded mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-sm text-gray-600">Score</div>
              <div className="text-2xl font-bold">{results.submission.score.toFixed(1)}%</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Points</div>
              <div className="text-lg">{results.submission.earnedPoints} / {results.submission.totalPoints}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Status</div>
              <div className="text-lg">{results.submission.status}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Submitted</div>
              <div className="text-lg">{new Date(results.submission.submittedAt).toLocaleDateString()}</div>
            </div>
          </div>
          {results.submission.feedback && (
            <div className="mt-4">
              <div className="text-sm text-gray-600">Feedback</div>
              <div className="text-sm">{results.submission.feedback}</div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          {results.questions.map((question, index) => (
            <div key={question.id} className="border-b pb-4">
              <h3 className="font-semibold mb-2">
                {index + 1}. {question.text} ({question.points} points)
              </h3>
              
              <div className="space-y-2">
                {question.options.map(option => (
                  <div
                    key={option.id}
                    className={`p-2 rounded ${
                      option.isCorrect 
                        ? 'bg-green-100 border-green-300' 
                        : option.isSelected 
                        ? 'bg-red-100 border-red-300' 
                        : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center">
                      {option.isSelected && <span className="mr-2">→</span>}
                      {option.isCorrect && <span className="mr-2">✓</span>}
                      {option.text}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-2 text-sm">
                <span className={question.userAnswer.isCorrect ? 'text-green-600' : 'text-red-600'}>
                  {question.userAnswer.isCorrect ? 'Correct' : 'Incorrect'} 
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

# Quiz Take

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import axios from 'axios';
import axiosInstance from '~/lib/axios';

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

  useEffect(() => {
    fetchQuiz();
  }, [id]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && quiz) {
      handleSubmit();
    }
  }, [timeLeft]);

  const fetchQuiz = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axiosInstance.get(`/quizzes/${id}/take`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log(response.data.quiz);
      setQuiz(response.data.quiz);
      setTimeLeft(response.data.quiz.timeLimit * 60);
    } catch (error: any) {
      if (error.response?.data?.submission) {
        navigate(`/quiz/${id}/results`);
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
    } catch (error) {
      alert('Failed to submit quiz');
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (!quiz) return <div className="p-4">Quiz not found</div>;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">{quiz.title}</h1>
          <div className="text-lg font-mono bg-red-100 px-3 py-1 rounded">
            {formatTime(timeLeft)}
          </div>
        </div>

        <div className="space-y-6">
          {quiz.questions.map((question, index) => (
            <div key={question.id} className="border-b pb-4">
              <h3 className="font-semibold mb-2">
                {index + 1}. {question.text} ({question.points} points)
              </h3>
              <div className="space-y-2">
                {question.options.map(option => (
                  <label key={option.id} className="flex items-center">
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      value={option.id}
                      checked={answers[question.id] === option.id}
                      onChange={() => handleAnswerChange(question.id, option.id)}
                      className="mr-2"
                    />
                    {option.text}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-between">
          <div className="text-sm text-gray-600">
            Answered: {Object.keys(answers).length} / {quiz.questions.length}
          </div>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {submitting ? 'Submitting...' : 'Submit Quiz'}
          </button>
        </div>
      </div>
    </div>
  );
}