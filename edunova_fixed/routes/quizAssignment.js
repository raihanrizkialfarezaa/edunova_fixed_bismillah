const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quiz');
const assignmentController = require('../controllers/assignment');
const { authenticate } = require('../middlewares/auth');
const { isInstructorOrAdmin } = require('../middlewares/authorization');

// Quiz Routes

// Create quiz for lesson
router.post('/lessons/:id/quiz', 
  authenticate, 
  isInstructorOrAdmin, 
  quizController.createQuiz
);

// Get quiz by ID
router.get('/quizzes/:id', 
  authenticate, 
  quizController.getQuizById
);

router.get('/quizzes/lesson/:id', 
  authenticate, 
  quizController.getLessonQuiz
);

// Update quiz
router.put('/quizzes/:id', 
  authenticate, 
  isInstructorOrAdmin, 
  quizController.updateQuiz
);

// Create single question for quiz
router.post('/quizzes/:id/questions', 
  authenticate, 
  isInstructorOrAdmin, 
  quizController.createQuestion
);

// Create multiple questions for quiz (bulk)
router.post('/quizzes/:id/questions/bulk', 
  authenticate, 
  isInstructorOrAdmin, 
  quizController.createBulkQuestions
);

// Update question
router.put('/questions/:id', 
  authenticate, 
  isInstructorOrAdmin, 
  quizController.updateQuestion
);

// Create multiple options for question (bulk)
router.post('/questions/:id/options/bulk', 
  authenticate, 
  isInstructorOrAdmin, 
  quizController.createBulkOptions
);

// Create options for multiple questions in a quiz (bulk)
router.post('/quizzes/:id/options/bulk', 
  authenticate, 
  isInstructorOrAdmin, 
  quizController.createOptionsForMultipleQuestions
);

// Assignment Routes

// Create assignment for lesson
router.post('/lessons/:id/assignment', 
  authenticate, 
  isInstructorOrAdmin, 
  assignmentController.createAssignment
);

// Get assignment by ID
router.get('/assignments/:id', 
  authenticate, 
  assignmentController.getAssignmentById
);

// Update assignment
router.put('/assignments/:id', 
  authenticate, 
  isInstructorOrAdmin, 
  assignmentController.updateAssignment
);

// NEW QUIZ ENDPOINTS

// Get all quizzes (Admin & Instructor only)
router.get('/quizzes', 
  authenticate, 
  isInstructorOrAdmin, 
  quizController.getAllQuizzes
);

// Get quizzes for specific course (Admin & Course Owner)
router.get('/courses/:courseId/quizzes', 
  authenticate, 
  isInstructorOrAdmin, 
  quizController.getCourseQuizzes
);

// Get quiz for specific lesson (Public - untuk students yang sudah enroll)
router.get('/lessons/:lessonId/quiz', 
  authenticate, 
  quizController.getLessonQuiz
);

// NEW ASSIGNMENT ENDPOINTS

// Get all assignments (Admin & Instructor only)
router.get('/assignments', 
  authenticate, 
  isInstructorOrAdmin, 
  assignmentController.getAllAssignments
);

// Get assignments for specific course (Admin & Course Owner)
router.get('/courses/:courseId/assignments', 
  authenticate, 
  isInstructorOrAdmin, 
  assignmentController.getCourseAssignments
);

// Get assignment for specific lesson (Public - for students who enrolled)
router.get('/lessons/:lessonId/assignment', 
  authenticate, 
  assignmentController.getLessonAssignment
);

router.get('/quizzes/available', 
  authenticate, 
  quizController.getAvailableQuizzes 
);

router.get('/assignments/available', 
  authenticate, 
  assignmentController.getAvailableAssignments 
);

module.exports = router;