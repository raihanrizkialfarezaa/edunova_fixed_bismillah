const express = require('express');
const router = express.Router();
const userController = require('../controllers/userInstructor');
const { authenticate } = require('../middlewares/auth');
const { isAdmin } = require('../middlewares/authorization');

// Student/User requests to become instructor
router.post('/request-instructor', authenticate, userController.requestInstructor);

// Update instructor profile (user can update their own, admin can update any)
router.put('/:id/instructor-profile', authenticate, userController.updateInstructorProfile);

// Get instructor profile (public access)
router.get('/:id/instructor-profile', userController.getInstructorProfile);

// GET all approved instructors (Public access - untuk directory)
router.get('/instructors', userController.getAllInstructors);

// GET courses by specific instructor (Public access)
router.get('/instructors/:id/courses', userController.getInstructorCourses);

// GET instructor statistics (Admin only)
router.get('/instructors/:id/stats', authenticate, isAdmin, userController.getInstructorStats);

module.exports = router;