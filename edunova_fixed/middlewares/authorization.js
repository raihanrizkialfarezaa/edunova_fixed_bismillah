const { User, Course } = require('../models');

/**
 * Middleware to check if the user is an admin
 */
exports.isAdmin = async (req, res, next) => {
  try {
    // User should already be attached to request by authenticate middleware
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Middleware to check if the user is an instructor
 */
exports.isInstructor = async (req, res, next) => {
  try {
    // User should already be attached to request by authenticate middleware
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (req.user.role !== 'INSTRUCTOR') {
      return res.status(403).json({ message: 'Instructor access required' });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Middleware to check if the user is either an instructor or admin
 */
exports.isInstructorOrAdmin = async (req, res, next) => {
  try {
    // User should already be attached to request by authenticate middleware
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (req.user.role !== 'INSTRUCTOR' && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Instructor or admin access required' });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Middleware to check if the user is the owner of the course
 * Requires courseId in the request parameters
 */
exports.isCourseOwner = async (req, res, next) => {
  try {
    // User should already be attached to request by authenticate middleware
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Try to get course ID from various sources
    const courseId = req.params.courseId || req.params.id || req.body.courseId;
    
    if (!courseId) {
      return res.status(400).json({ message: 'Course ID is required' });
    }

    const course = await Course.findByPk(courseId);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if the current user is the instructor of this course or an admin
    if (course.instructorId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'You are not authorized to access this course' });
    }

    // Add course to request for potential later use
    req.course = course;
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};