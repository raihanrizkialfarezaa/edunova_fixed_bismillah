const express = require('express');
const router = express.Router();
const courseController = require('../controllers/course');
const { authenticate } = require('../middlewares/auth');
const { isAdmin, isInstructorOrAdmin, isCourseOwner } = require('../middlewares/authorization');

// GET all courses - public access with filtering
router.get('/', courseController.getAllCourses);

// GET course by ID - public access
router.get('/:id', courseController.getCourseById);

// POST create new course - instructors and admins only
router.post('/create', authenticate, isInstructorOrAdmin, courseController.createCourse);

// PUT update course - course owner or admin only
router.put('/:id', authenticate, isCourseOwner, courseController.updateCourse);

// DELETE course - course owner or admin only
router.delete('/:id', authenticate, isCourseOwner, courseController.deleteCourse);

// PUT update course status - course owner or admin only
router.put('/:id/status', authenticate, isCourseOwner, courseController.updateCourseStatus);

// POST add categories to course - course owner or admin only
router.post('/:id/categories', authenticate, isCourseOwner, courseController.addCategoriesToCourse);

// POST add tags to course - course owner or admin only
router.post('/:id/tags', authenticate, isCourseOwner, courseController.addTagsToCourse);

// === COURSE ANALYTICS ENDPOINTS ===

// GET course performance data - course owner or admin only
router.get('/:id/analytics', authenticate, isCourseOwner, courseController.getCourseAnalytics);

// GET course enrollment trends - course owner or admin only
router.get('/:id/analytics/enrollments', authenticate, isCourseOwner, courseController.getCourseEnrollmentTrends);

// GET course revenue analytics - course owner or admin only
router.get('/:id/analytics/revenue', authenticate, isCourseOwner, courseController.getCourseRevenue);

module.exports = router;