const express = require('express');
const router = express.Router();
const sectionController = require('../controllers/section');
const lessonController = require('../controllers/lesson');
const { authenticate } = require('../middlewares/auth');
const { isInstructorOrAdmin } = require('../middlewares/authorization');
const { checkVideoAccess, checkPreviewAccess } = require('../middlewares/videoAccess');

// Section routes
// POST create new section for a course
router.post('/courses/:id/sections/create', 
  authenticate, 
  isInstructorOrAdmin, 
  sectionController.createSection
);

// GET all sections for a course
router.get('/courses/:id/sections', sectionController.getCourseSections);

// PUT update section
router.put('/sections/:id', 
  authenticate, 
  isInstructorOrAdmin, 
  sectionController.updateSection
);

// DELETE section
router.delete('/sections/:id', 
  authenticate, 
  isInstructorOrAdmin, 
  sectionController.deleteSection
);

// PUT reorder sections for a course
router.put('/courses/:id/sections/reorder', 
  authenticate, 
  isInstructorOrAdmin, 
  sectionController.reorderSections
);

// Lesson routes

// Create new lesson for a section (with video upload)
router.post('/sections/:id/lessons', 
  authenticate,
  isInstructorOrAdmin,
  lessonController.uploadVideoMiddleware,
  lessonController.handleUploadError,
  lessonController.createLesson
);

// Get all lessons for a section
router.get('/sections/:id/lessons', 
  lessonController.getSectionLessons
);

// Get lesson by ID
router.get('/lessons/:id', 
  lessonController.getLessonById
);

// Update lesson (with optional video upload)
router.put('/lessons/:id', 
  authenticate,
  isInstructorOrAdmin,
  lessonController.uploadVideoMiddleware,
  lessonController.handleUploadError,
  lessonController.updateLesson
);

// Delete lesson
router.delete('/lessons/:id', 
  authenticate,
  isInstructorOrAdmin,
  lessonController.deleteLesson
);

// Reorder lessons for a section
router.put('/sections/:id/lessons/reorder', 
  authenticate,
  isInstructorOrAdmin,
  lessonController.reorderLessons
);

// Video streaming routes
// Stream video with full access control
router.get('/lessons/:lessonId/stream', 
  authenticate,
  checkVideoAccess,
  lessonController.streamVideo
);

// Get video info (metadata) with access control
router.get('/lessons/:lessonId/video-info', 
  authenticate,
  checkVideoAccess,
  lessonController.getVideoInfo
);

// Preview video stream (for demo/free preview)
router.get('/lessons/:lessonId/preview', 
  checkPreviewAccess,
  lessonController.streamVideo
);

module.exports = router;