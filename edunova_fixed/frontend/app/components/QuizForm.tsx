import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
  const [lessons, setLessons] = useState<Array<{ id: number; title: string; order: number }>>([]);
  const [courses, setCourses] = useState<Array<{ id: number; title: string }>>([]);
  const [courseId, setCourseId] = useState(0);
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);

  useEffect(() => {
    fetchInstructorCourses();
  }, []);

  useEffect(() => {
    if (id && courses.length > 0 && !initialDataLoaded) {
      fetchQuiz();
    }
  }, [id, courses, initialDataLoaded]);

  const fetchQuiz = async () => {
    try {
      const response = await quizApi.getQuizById(Number(id));
      const quizData = response.data.quiz;

      setQuiz({
        title: quizData.title,
        timeLimit: quizData.timeLimit || '',
        lessonId: quizData.lessonId,
      });

      // Mengambil courseId dari data quiz melalui lesson -> section -> course
      const courseIdFromQuiz = quizData.lesson?.section?.course?.id;

      if (courseIdFromQuiz) {
        setCourseId(courseIdFromQuiz);
        // Fetch lessons untuk course yang sesuai
        await fetchAllLessons(courseIdFromQuiz);
      }

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

      setInitialDataLoaded(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal mengambil kuis');
    }
  };

  // Replace fetchAllCourses with fetchInstructorCourses
  const fetchInstructorCourses = async () => {
    try {
      const response = await quizApi.getInstructorCourses();
      const instructorCourses: Array<{ id: number; title: string }> = [];

      // Extract courses - now only instructor's own courses
      response.data.courses.forEach((course: any) => {
        instructorCourses.push({
          id: course.id,
          title: course.title,
        });
      });

      setCourses(instructorCourses);
      return instructorCourses;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal mengambil daftar kursus Anda');
      return [];
    }
  };

  const fetchAllLessons = async (courseIdParam: number) => {
    try {
      const response = await axiosInstance.get(`/courses/${courseIdParam}`);
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
      setError(err.response?.data?.message || 'Gagal mengambil daftar pelajaran');
      return [];
    }
  };

  const handleQuizSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quiz.lessonId && !id) {
      setError('ID Pelajaran diperlukan untuk kuis baru');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (id) {
        // Edit mode - Update quiz & Questions
        console.log('Updating quiz with ID:', id);
        console.log('Quiz data:', quiz);
        console.log('Questions data:', questions);

        // 1. Update quiz basic info
        await quizApi.updateQuiz(Number(id), {
          title: quiz.title,
          timeLimit: quiz.timeLimit ? Number(quiz.timeLimit) : undefined,
        });

        // 2. Update atau create pertanyaan
        const validQuestions = questions.filter((q) => q.text && q.correctAnswer);

        if (validQuestions.length > 0) {
          for (const question of validQuestions) {
            if (question.id) {
              // Update pertanyaan yang sudah ada
              try {
                await quizApi.updateQuestion(question.id, {
                  text: question.text,
                  correctAnswer: question.correctAnswer,
                  points: question.points,
                });
                console.log(`Question ${question.id} updated successfully (options unchanged)`);
              } catch (updateError) {
                console.error('Error updating question:', updateError);
              }
            } else {
              // Membuat pertanyaan baru jika tidak ada ID
              try {
                const newQuestionResponse = await quizApi.createQuestion(Number(id), {
                  text: question.text,
                  correctAnswer: question.correctAnswer,
                  points: question.points,
                });

                // Membuat options untuk pertanyaan baru SAJA
                if (question.options && question.options.length > 0) {
                  const validOptions = question.options.filter((opt) => opt.text);
                  if (validOptions.length > 0) {
                    await quizApi.createBulkOptions(newQuestionResponse.data.question.id, {
                      options: validOptions,
                    });
                  }
                }
              } catch (createError) {
                console.error('Error creating new question:', createError);
              }
            }
          }
        }

        console.log('Quiz updated successfully');
      } else {
        // Create Mode - Create new quiz
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
      console.error('Error in handleQuizSubmit:', err);
      setError(err.response?.data?.message || 'Gagal menyimpan kuis');
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

  const handleCourseChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCourseId = parseInt(e.target.value);
    setCourseId(selectedCourseId);
    setQuiz({ ...quiz, lessonId: '' }); // Reset lessonId when course changes

    if (selectedCourseId) {
      await fetchAllLessons(selectedCourseId);
    } else {
      setLessons([]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-sans p-8">
      <div className="max-w-4xl mx-auto bg-gray-900 p-8 rounded-xl shadow-lg border border-gray-800">
        <h1 className="text-4xl font-extrabold text-blue-400 mb-8 text-center">{id ? 'Edit Kuis' : 'Buat Kuis Baru'}</h1>

        {error && <div className="bg-red-900 bg-opacity-30 text-red-400 p-4 rounded-lg mb-6 text-center font-medium">{error}</div>}

        <form onSubmit={handleQuizSubmit} className="space-y-6">
          {/* Quiz Title */}
          <div>
            <label htmlFor="quizTitle" className="block text-gray-300 text-sm font-semibold mb-2">
              Judul Kuis
            </label>
            <input
              type="text"
              id="quizTitle"
              value={quiz.title}
              onChange={(e) => setQuiz({ ...quiz, title: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-gray-100 placeholder-gray-500
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 shadow-inner"
              placeholder="Contoh: Kuis Dasar-dasar React"
              required
            />
          </div>

          {/* Course Selection - Always visible, with different layouts for create/edit */}
          <div>
            <label htmlFor="selectCourse" className="block text-gray-300 text-sm font-semibold mb-2">
              {id ? 'Kursus (Mode Edit: Dikunci Hanya Tampilan)' : 'Pilih Kursus Anda'}
            </label>
            <select
              id="selectCourse"
              value={courseId}
              onChange={handleCourseChange}
              disabled={!!id} // Disable dalam mode edit
              className={`w-full px-4 py-3 rounded-lg border text-gray-100
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 cursor-pointer shadow-inner
                         ${id ? 'bg-gray-700 border-gray-600 opacity-75 cursor-not-allowed' : 'bg-gray-800 border-gray-700'}`}
              required={!id}
            >
              <option value="">{id ? 'Memuat kursus...' : 'Pilih kursus Anda...'}</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
            {id && <p className="text-xs text-gray-500 mt-1">Kursus tidak dapat diubah saat mengedit kuis</p>}
            {!id && courses.length === 0 && <p className="text-xs text-yellow-400 mt-1">Anda belum memiliki kursus. Silakan buat kursus terlebih dahulu.</p>}
          </div>

          {/* Lesson Selection - Only for new quiz or show current lesson in edit mode */}
          {!id ? (
            <div>
              <label htmlFor="selectLesson" className="block text-gray-300 text-sm font-semibold mb-2">
                Pilih Pelajaran
              </label>
              <select
                id="selectLesson"
                value={quiz.lessonId}
                onChange={(e) => setQuiz({ ...quiz, lessonId: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-gray-100
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 cursor-pointer shadow-inner"
                required
                disabled={!courseId}
              >
                <option value="">{courseId ? 'Pilih pelajaran...' : 'Pilih kursus terlebih dahulu'}</option>
                {lessons.map((lesson) => (
                  <option key={lesson.id} value={lesson.id}>
                    {lesson.title}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div>
              <label htmlFor="currentLesson" className="block text-gray-300 text-sm font-semibold mb-2">
                Pelajaran Saat Ini
              </label>
              <select id="currentLesson" value={quiz.lessonId} disabled className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-gray-100 opacity-75 cursor-not-allowed shadow-inner">
                <option value="">Memuat pelajaran...</option>
                {lessons.map((lesson) => (
                  <option key={lesson.id} value={lesson.id}>
                    {lesson.title}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">Pelajaran tidak dapat diubah saat mengedit kuis</p>
            </div>
          )}

          {/* Time Limit */}
          <div>
            <label htmlFor="timeLimit" className="block text-gray-300 text-sm font-semibold mb-2">
              Batas Waktu (menit)
            </label>
            <input
              type="number"
              id="timeLimit"
              value={quiz.timeLimit}
              onChange={(e) => setQuiz({ ...quiz, timeLimit: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-gray-100 placeholder-gray-500
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 shadow-inner"
              placeholder="Contoh: 30"
              min="0"
            />
          </div>

          {/* Questions Section */}
          <div className="border-t border-gray-700 pt-6 mt-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-blue-300">Pertanyaan</h3>
              <button type="button" onClick={addQuestion} className="bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2 rounded-lg transition duration-300 shadow-md">
                Tambah Pertanyaan
              </button>
            </div>

            <div className="space-y-6">
              {questions.map((question, qIndex) => (
                <div key={qIndex} className="bg-gray-800 p-6 rounded-xl shadow-md border border-gray-700">
                  <h4 className="text-lg font-semibold text-gray-200 mb-4">Pertanyaan #{qIndex + 1}</h4>
                  <div className="grid grid-cols-1 gap-4">
                    {/* Question Text */}
                    <div>
                      <label htmlFor={`questionText-${qIndex}`} className="block text-gray-300 text-sm font-medium mb-1">
                        Teks Pertanyaan
                      </label>
                      <textarea
                        id={`questionText-${qIndex}`}
                        value={question.text}
                        onChange={(e) => updateQuestion(qIndex, 'text', e.target.value)}
                        className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-gray-100 placeholder-gray-500
                                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-y shadow-inner"
                        rows={3}
                        placeholder="Masukkan teks pertanyaan di sini..."
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Correct Answer */}
                      <div>
                        <label htmlFor={`correctAnswer-${qIndex}`} className="block text-gray-300 text-sm font-medium mb-1">
                          Jawaban Benar
                        </label>
                        <input
                          type="text"
                          id={`correctAnswer-${qIndex}`}
                          value={question.correctAnswer}
                          onChange={(e) => updateQuestion(qIndex, 'correctAnswer', e.target.value)}
                          className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-gray-100 placeholder-gray-500
                                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 shadow-inner"
                          placeholder="Contoh: Opsi A"
                        />
                      </div>
                      {/* Points */}
                      <div>
                        <label htmlFor={`points-${qIndex}`} className="block text-gray-300 text-sm font-medium mb-1">
                          Poin
                        </label>
                        <input
                          type="number"
                          id={`points-${qIndex}`}
                          value={question.points}
                          onChange={(e) => updateQuestion(qIndex, 'points', Number(e.target.value))}
                          className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-gray-100 placeholder-gray-500
                                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 shadow-inner"
                          min="1"
                        />
                      </div>
                    </div>

                    {/* Options */}
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <label className="block text-gray-300 text-sm font-medium">Opsi Jawaban</label>
                        <button type="button" onClick={() => addOption(qIndex)} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-xs font-semibold transition duration-300 shadow-sm">
                          Tambah Opsi
                        </button>
                      </div>
                      <div className="space-y-2">
                        {question.options.map((option, oIndex) => (
                          <input
                            key={oIndex}
                            type="text"
                            value={option.text}
                            onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                            placeholder={`Opsi ${oIndex + 1}`}
                            className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-gray-100 placeholder-gray-500
                                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 shadow-inner"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6 justify-end">
            <button
              type="submit"
              disabled={loading || courses.length === 0}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-xl text-lg
                         disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg"
            >
              {loading ? 'Menyimpan...' : 'Simpan Kuis'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/quiz/list')}
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold px-8 py-4 rounded-xl text-lg
                         transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
