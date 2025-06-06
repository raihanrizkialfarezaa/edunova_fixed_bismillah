import axiosInstance from './axios';

export const quizApi = {
  // Quiz management
  getAllQuizzes: (params?: { page?: number; limit?: number; search?: string }) => axiosInstance.get('/quizzes', { params }),

  getCourseQuizzes: (courseId: number, params?: { page?: number; limit?: number }) => axiosInstance.get(`/courses/${courseId}/quizzes`, { params }),

  getLessonQuiz: (lessonId: number) => axiosInstance.get(`/lessons/${lessonId}/quiz`),

  getQuizById: (id: number) => axiosInstance.get(`/quizzes/${id}`),

  createQuiz: (lessonId: number, data: { title: string; timeLimit?: number }) => axiosInstance.post(`/lessons/${lessonId}/quiz`, data),

  updateQuiz: (id: number, data: { title?: string; timeLimit?: number }) => axiosInstance.put(`/quizzes/${id}`, data),

  // Question management
  createQuestion: (quizId: number, data: { text: string; correctAnswer: string; points?: number }) => axiosInstance.post(`/quizzes/${quizId}/questions`, data),

  createBulkQuestions: (quizId: number, data: { questions: Array<{ text: string; correctAnswer: string; points?: number }> }) => axiosInstance.post(`/quizzes/${quizId}/questions/bulk`, data),

  updateQuestion: (id: number, data: { text?: string; correctAnswer?: string; points?: number }) => axiosInstance.put(`/questions/${id}`, data),

  // Options management
  createBulkOptions: (questionId: number, data: { options: Array<{ text: string }> }) => axiosInstance.post(`/questions/${questionId}/options/bulk`, data),

  createOptionsForMultipleQuestions: (quizId: number, data: { questionsWithOptions: Array<{ questionId: number; options: Array<{ text: string }> }> }) => axiosInstance.post(`/quizzes/${quizId}/options/bulk`, data),

  // NEW: Student endpoints
  getAvailableQuizzes: () => axiosInstance.get('/quizzes/available'),

  getAvailableAssignments: () => axiosInstance.get('/assignments/available'),

  // NEW: Instructor course unique endpoints
  getInstructorCourses: () => axiosInstance.get('/instructor/courses'),
};
