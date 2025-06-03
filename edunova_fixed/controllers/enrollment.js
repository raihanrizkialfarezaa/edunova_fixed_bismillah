const { Course, Enrollment, Payment, User, Lesson, Section, UserProgress, Assignment, Quiz, sequelize } = require('../models');
const { Op } = require('sequelize');

// Enroll in a course
exports.enrollInCourse = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    // Check if course exists
    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({
      where: { userId, courseId },
      include: [{ model: Payment, as: 'payment' }],
    });

    if (existingEnrollment) {
      // Cek status payment jika course berbayar
      if (course.price > 0) {
        if (existingEnrollment.payment && existingEnrollment.payment.status === 'COMPLETED') {
          return res.status(400).json({
            message: 'Already enrolled and paid for this course',
            enrollment: existingEnrollment,
            canAccessCourse: true,
          });
        } else {
          return res.status(400).json({
            message: 'Already enrolled but payment is pending',
            enrollment: existingEnrollment,
            needsPayment: true,
            canAccessCourse: false,
          });
        }
      } else {
        return res.status(400).json({
          message: 'Already enrolled in this free course',
          enrollment: existingEnrollment,
          canAccessCourse: true,
        });
      }
    }

    // Create enrollment
    const newEnrollment = await Enrollment.create(
      {
        userId,
        courseId,
        status: 'ENROLLED',
        progress: 0,
      },
      { transaction }
    );

    let payment = null;
    let needsPayment = false;
    let canAccessCourse = true;

    // If course is paid, create pending payment
    if (course.price > 0) {
      needsPayment = true;
      canAccessCourse = false; // User tidak bisa akses course sampai bayar
      payment = await Payment.create(
        {
          totalAmount: course.price,
          status: 'PENDING',
          paymentMethod: null,
          enrollmentId: newEnrollment.id,
          instructorId: course.instructorId,
          instructorShare: parseFloat((course.price * 0.65).toFixed(2)),
          platformShare: parseFloat((course.price * 0.35).toFixed(2)),
        },
        { transaction }
      );
    }

    await transaction.commit();

    res.status(201).json({
      message: 'Successfully enrolled in course',
      enrollment: {
        ...newEnrollment.toJSON(),
        payment: payment ? payment : undefined,
      },
      course: {
        id: course.id,
        title: course.title,
        price: course.price,
      },
      needsPayment,
      canAccessCourse,
    });
  } catch (error) {
    await transaction.rollback();
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Process payment for enrollment - HANYA untuk proses payment manual
exports.processPayment = async (req, res) => {
  try {
    const { enrollmentId } = req.params;
    const { paymentMethod, transactionId = `TXN_${Date.now()}` } = req.body;

    // Validasi input
    if (!paymentMethod) {
      return res.status(400).json({ message: 'Payment method is required' });
    }

    const enrollment = await Enrollment.findByPk(enrollmentId, {
      include: [
        {
          model: Course,
          as: 'course',
          include: [
            {
              model: User,
              as: 'instructor',
              attributes: ['id', 'name', 'email'],
            },
          ],
        },
        { model: Payment, as: 'payment' },
      ],
    });

    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    if (enrollment.userId !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (!enrollment.course || enrollment.course.price <= 0) {
      return res.status(400).json({ message: 'This course is free' });
    }

    // Cek apakah sudah dibayar
    if (enrollment.payment && enrollment.payment.status === 'COMPLETED') {
      return res.status(400).json({ message: 'Already paid for this course' });
    }

    // Cek apakah ada payment record
    if (!enrollment.payment) {
      return res.status(400).json({ message: 'No payment record found for this enrollment' });
    }

    const totalAmount = enrollment.course.price;
    const instructorId = enrollment.course.instructorId;
    const instructorShare = parseFloat((totalAmount * 0.65).toFixed(2));
    const platformShare = parseFloat((totalAmount * 0.35).toFixed(2));

    // Update payment yang sudah ada menjadi COMPLETED
    await enrollment.payment.update({
      status: 'COMPLETED',
      paymentMethod,
      transactionId,
      paymentDate: new Date(),
      instructorId: instructorId,
      instructorShare,
      platformShare,
    });

    const updatedEnrollment = await Enrollment.findByPk(enrollmentId, {
      include: [
        {
          model: Course,
          as: 'course',
          include: [
            {
              model: User,
              as: 'instructor',
              attributes: ['id', 'name', 'email'],
            },
          ],
        },
        { model: Payment, as: 'payment' },
      ],
    });

    res.json({
      message: 'Payment processed successfully',
      enrollment: updatedEnrollment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Get user enrollments
exports.getUserEnrollments = async (req, res) => {
  try {
    // Handle both regular user and admin/instructor checking other user's enrollments
    const targetUserId = req.params.userId || req.user.id;
    const currentUserId = req.user.id;
    const userRole = req.user.role;

    // Authorization check - only allow admins/instructors to view other users' enrollments
    if (targetUserId != currentUserId && userRole !== 'ADMIN' && userRole !== 'INSTRUCTOR') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { status, paymentStatus } = req.query;

    const whereClause = { userId: targetUserId };
    if (status) whereClause.status = status;

    // Tentukan atribut course berdasarkan role
    let courseAttributes = ['id', 'title', 'description', 'price', 'thumbnail'];
    if (userRole === 'ADMIN' || userRole === 'INSTRUCTOR') {
      courseAttributes.push('status');
    }

    // Query dengan include Course dan Payment
    const enrollments = await Enrollment.findAll({
      where: whereClause,
      include: [
        {
          model: Course,
          as: 'course',
          attributes: courseAttributes,
          include: [
            {
              model: User,
              as: 'instructor',
              attributes: ['id', 'name', 'email'],
            },
          ],
        },
        {
          model: Payment,
          as: 'payment',
          attributes: {
            include: ['id', 'totalAmount', 'status', 'paymentMethod', 'transactionId'],
            exclude: userRole === 'ADMIN' || userRole === 'INSTRUCTOR' ? [] : ['platformShare', 'instructorShare'],
          },
          ...(paymentStatus && {
            where: { status: paymentStatus },
          }),
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.json({
      message: 'User enrollments retrieved successfully',
      enrollments,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Update course progress
exports.updateProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { lessonId, completed = true } = req.body;
    const userId = req.user.id;

    // Cari enrollment
    const enrollment = await Enrollment.findOne({
      where: { userId, courseId },
      include: [{ model: Payment, as: 'payment' }],
    });

    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    // Jumlah total lesson di course ini
    const totalLessons = await Lesson.count({
      include: [
        {
          model: Section,
          as: 'section',
          where: { courseId },
        },
      ],
    });

    if (totalLessons <= 0) {
      return res.status(400).json({ message: 'No lessons found in this course' });
    }

    // Jika lesson diselesaikan, tambahkan ke progress
    let currentCompletedCount = 0;

    // Cek jumlah lesson yang sudah diselesaikan user
    const completedLessons = await Lesson.findAll({
      where: {
        id: {
          [Op.ne]: lessonId, // exclude lesson yang baru saja diproses
        },
      },
      include: [
        {
          model: UserProgress,
          as: 'userProgress',
          where: {
            userId,
            courseId,
            completed: true,
          },
        },
      ],
    });

    currentCompletedCount = completedLessons.length;

    // Tambahkan lesson saat ini jika diselesaikan
    if (completed) {
      currentCompletedCount += 1;
    }

    // Hitung progres
    const newProgress = Math.round((currentCompletedCount / totalLessons) * 100);

    // Update enrollment
    await enrollment.update({
      progress: newProgress,
      status: newProgress >= 100 ? 'COMPLETED' : 'ENROLLED',
    });

    res.json({
      message: 'Progress updated successfully',
      enrollment: {
        ...enrollment.toJSON(),
        progress: newProgress,
        status: newProgress >= 100 ? 'COMPLETED' : 'ENROLLED',
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Get enrollment details
exports.getEnrollmentDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const enrollment = await Enrollment.findByPk(id, {
      include: [
        {
          model: Course,
          as: 'course',
          include: [
            {
              model: User,
              as: 'instructor',
              attributes: ['id', 'name', 'email'],
            },
            {
              model: Section,
              as: 'Sections',
              include: [
                {
                  model: Lesson,
                  as: 'Lessons',
                  attributes: ['id', 'title', 'content', 'videoUrl', 'duration', 'order'],
                  include: [
                    {
                      model: Assignment,
                      as: 'assignment',
                      attributes: ['id', 'title', 'description', 'dueDate', 'fileTypes'],
                      required: false,
                    },
                    {
                      model: Quiz,
                      as: 'quiz',
                      attributes: ['id', 'title', 'timeLimit'],
                      required: false,
                    },
                  ],
                },
              ],
              order: [['order', 'ASC']],
            },
          ],
        },
        {
          model: Payment,
          as: 'payment',
        },
      ],
    });

    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    if (enrollment.userId !== userId && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({
      message: 'Enrollment details retrieved successfully',
      enrollment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Get next lesson for enrolled student
exports.getNextLesson = async (req, res) => {
  try {
    const { id } = req.params; // enrollment ID

    // Find enrollment with course details
    const enrollment = await Enrollment.findByPk(id, {
      include: [
        {
          model: Course,
          as: 'course',
          include: [
            {
              model: User,
              as: 'instructor',
              attributes: ['id', 'name', 'email'],
            },
            {
              model: Section,
              as: 'Sections',
              include: [
                {
                  model: Lesson,
                  as: 'Lessons',
                  attributes: ['id', 'title', 'content', 'videoUrl', 'duration', 'order'],
                  include: [
                    {
                      model: Assignment,
                      as: 'assignment',
                      attributes: ['id', 'title', 'description', 'dueDate', 'fileTypes'],
                      required: false,
                    },
                    {
                      model: Quiz,
                      as: 'quiz',
                      attributes: ['id', 'title', 'timeLimit'],
                      required: false,
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          model: Payment,
          as: 'payment',
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    // Check authorization - only the enrolled student, course instructor, or admin can access
    if (req.user.role === 'STUDENT' && enrollment.userId !== req.user.id) {
      return res.status(403).json({ message: 'You are not authorized to view this enrollment' });
    }

    if (req.user.role === 'INSTRUCTOR' && enrollment.course.instructorId !== req.user.id) {
      return res.status(403).json({ message: 'You are not authorized to view this enrollment' });
    }

    // Get all lessons from all sections, ordered by section order and lesson order
    const allLessons = [];

    if (enrollment.course && enrollment.course.Sections) {
      enrollment.course.Sections.sort((a, b) => a.order - b.order).forEach((section) => {
        if (section.Lessons) {
          const sortedLessons = section.Lessons.sort((a, b) => a.order - b.order).map((lesson) => ({
            ...lesson.toJSON(),
            sectionTitle: section.title,
            sectionOrder: section.order,
          }));
          allLessons.push(...sortedLessons);
        }
      });
    }

    if (allLessons.length === 0) {
      return res.status(404).json({
        message: 'No lessons found in this course',
        enrollment: {
          id: enrollment.id,
          course: enrollment.course.title,
          progress: enrollment.progress || 0,
        },
      });
    }

    // Determine current lesson index based on progress or find first incomplete lesson
    let currentLessonIndex = 0;

    // If progress exists, calculate current lesson based on progress percentage
    if (enrollment.progress && enrollment.progress > 0) {
      const progressIndex = Math.floor((enrollment.progress / 100) * allLessons.length);
      currentLessonIndex = Math.min(progressIndex, allLessons.length - 1);
    }

    // Find next lesson (current + 1)
    const nextLessonIndex = currentLessonIndex + 1;

    if (nextLessonIndex >= allLessons.length) {
      return res.json({
        message: 'Course completed! No more lessons available.',
        enrollment: {
          id: enrollment.id,
          courseId: enrollment.course.id,
          courseTitle: enrollment.course.title,
          progress: enrollment.progress || 0,
          isCompleted: true,
        },
        currentLesson: allLessons[currentLessonIndex],
        nextLesson: null,
        totalLessons: allLessons.length,
      });
    }

    const nextLesson = allLessons[nextLessonIndex];

    // Format the response
    res.json({
      enrollment: {
        id: enrollment.id,
        courseId: enrollment.course.id,
        courseTitle: enrollment.course.title,
        studentName: enrollment.user.name,
        progress: enrollment.progress || 0,
        isCompleted: false,
      },
      currentLesson: allLessons[currentLessonIndex],
      nextLesson: {
        id: nextLesson.id,
        title: nextLesson.title,
        content: nextLesson.content,
        videoUrl: nextLesson.videoUrl,
        duration: nextLesson.duration,
        order: nextLesson.order,
        sectionTitle: nextLesson.sectionTitle,
        sectionOrder: nextLesson.sectionOrder,
        hasAssignment: !!nextLesson.assignment,
        hasQuiz: !!nextLesson.quiz,
        assignment: nextLesson.assignment || null,
        quiz: nextLesson.quiz || null,
      },
      courseProgress: {
        currentLessonNumber: nextLessonIndex + 1,
        totalLessons: allLessons.length,
        progressPercentage: enrollment.progress || 0,
        lessonsCompleted: Math.floor(((enrollment.progress || 0) / 100) * allLessons.length),
      },
    });
  } catch (error) {
    console.error('Error in getNextLesson:', error);
    res.status(500).json({ message: error.message });
  }
};
