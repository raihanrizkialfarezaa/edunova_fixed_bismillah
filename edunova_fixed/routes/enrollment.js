const express = require('express');
const router = express.Router();
const enrollmentController = require('../controllers/enrollment');
const { authenticate } = require('../middlewares/auth');
const { isInstructorOrAdmin } = require('../middlewares/authorization');

// POST enroll in course
router.post('/courses/:courseId/enroll', 
  authenticate, 
  enrollmentController.enrollInCourse
);

// PUT process payment for enrollment
router.put('/enrollments/:enrollmentId/payment', 
  authenticate, 
  enrollmentController.processPayment
);

// GET user enrollments
router.get('/my-enrollments', 
  authenticate, 
  enrollmentController.getUserEnrollments
);

// PUT update course progress
router.put('/courses/:courseId/progress', 
  authenticate, 
  enrollmentController.updateProgress
);

// GET enrollment details
router.get('/enrollments/:id', 
  authenticate, 
  enrollmentController.getEnrollmentDetails
);

// Get next lesson for enrolled student
router.get('/enrollments/:id/next-lesson', 
  authenticate, 
  enrollmentController.getNextLesson
);

// Get specific user's enrollments (Admin only)
router.get('/users/:userId/enrollments', 
  authenticate, 
  isInstructorOrAdmin, 
  enrollmentController.getUserEnrollments
);

module.exports = router;