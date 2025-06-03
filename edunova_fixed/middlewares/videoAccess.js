const { User, Course, Section, Lesson, Enrollment, Payment } = require('../models');

/**
 * Middleware to check if user has access to video content
 */
exports.checkVideoAccess = async (req, res, next) => {
  try {
    const { lessonId } = req.params;
    const userId = req.user.id;

    // Get lesson with course information
    const lesson = await Lesson.findByPk(lessonId, {
      include: [{
        model: Section,
        as: 'section',
        include: [{
          model: Course,
          as: 'course',
          attributes: ['id', 'instructorId', 'status', 'price']
        }]
      }]
    });

    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    const course = lesson.section.course;

    // Check if user is the instructor or admin
    if (course.instructorId === userId || req.user.role === 'ADMIN') {
      req.hasAccess = true;
      req.lesson = lesson;
      return next();
    }

    // Check enrollment status
    const enrollment = await Enrollment.findOne({
      where: {
        userId,
        courseId: course.id,
        status: ['ENROLLED', 'COMPLETED'] // Allow both enrolled and completed
      },
      include: [{
        model: Payment,
        as: 'payment',
      }]
    });
    console.log('Enrollment:', enrollment);

    if (!enrollment) {
      return res.status(403).json({ 
        message: 'You need to enroll in this course to access video content' 
      });
    }

    // Check payment status for paid courses
    if (course.price > 0) {
      if (enrollment.payment.status !== 'COMPLETED') {
        return res.status(403).json({ 
          message: 'Payment required to access video content',
          status: enrollment.status,
          enrollment: enrollment
        });
      }
    } else {
      // For free courses, just being enrolled is enough
      if (enrollment.paymentStatus === 'FAILED' || enrollment.status === 'REFUNDED') {
        return res.status(403).json({ 
          message: 'Access denied due to payment issues' 
        });
      }
    }

    req.hasAccess = true;
    req.lesson = lesson;
    req.enrollment = enrollment;
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Middleware to check course enrollment for free preview
 */
exports.checkPreviewAccess = async (req, res, next) => {
  try {
    const { lessonId } = req.params;
    
    const lesson = await Lesson.findByPk(lessonId, {
      include: [{
        model: Section,
        as: 'section',
        include: [{
          model: Course,
          as: 'course',
          attributes: ['id', 'price']
        }]
      }]
    });

    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    // Allow preview for first lesson of first section (demo)
    const firstSection = await Section.findOne({
      where: { courseId: lesson.section.course.id },
      order: [['order', 'ASC']]
    });

    const firstLesson = await Lesson.findOne({
      where: { sectionId: firstSection.id },
      order: [['order', 'ASC']]
    });

    if (lesson.id === firstLesson.id) {
      req.isPreview = true;
      req.lesson = lesson;
      return next();
    }

    // For other lessons, require authentication and payment
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    return exports.checkVideoAccess(req, res, next);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Middleware to check if user can access course content (enrolled or instructor)
 */
exports.checkCourseAccess = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const userId = req.user?.id;

    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if user is instructor or admin
    if (userId && (course.instructorId === userId || req.user.role === 'ADMIN')) {
      req.hasAccess = true;
      req.course = course;
      return next();
    }

    // Check if user is enrolled
    if (userId) {
      const enrollment = await Enrollment.findOne({
        where: {
          userId,
          courseId,
          status: ['ENROLLED', 'COMPLETED']
        }
      });

      if (enrollment) {
        // For paid courses, check payment status
        if (course.price > 0 && enrollment.paymentStatus !== 'COMPLETED') {
          req.hasAccess = false;
          req.needsPayment = true;
        } else {
          req.hasAccess = true;
        }
        req.enrollment = enrollment;
      }
    }

    req.course = course;
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};