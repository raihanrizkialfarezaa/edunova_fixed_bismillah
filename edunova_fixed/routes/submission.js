const express = require('express');
const router = express.Router();
const submissionController = require('../controllers/submission');
const { authenticate } = require('../middlewares/auth');
const { isInstructorOrAdmin } = require('../middlewares/authorization');

// Get Quiz for Taking (student can see questions and options)
router.get('/quizzes/:id/take', 
  authenticate, 
  submissionController.getQuizForTaking
);

// Submit Quiz
router.post('/quizzes/:id/submit', 
  authenticate, 
  submissionController.submitQuiz
);

// Get Quiz Results (after submission - with correct answers)
router.get('/quizzes/:id/results', 
  authenticate, 
  submissionController.getQuizResults
);

// Submit Assignment (with file upload)
router.post('/assignments/:id/submit', 
  authenticate, 
  submissionController.submitAssignment
);

// Get Submission by ID
router.get('/submissions/:id', 
  authenticate, 
  submissionController.getSubmissionById
);

// Get Student's Own Submissions
router.get('/student/submissions', 
  authenticate, 
  submissionController.getStudentSubmissions
);

// Grade Submission
router.put('/submissions/:id/grade', 
  authenticate, 
  isInstructorOrAdmin, 
  submissionController.gradeSubmission
);

// Get Instructor's Submissions for grading
router.get('/instructor/submissions', 
  authenticate, 
  isInstructorOrAdmin, 
  submissionController.getInstructorSubmissions
);

module.exports = router;