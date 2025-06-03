const { Payout, Payment, User, Course, TransactionLog, Enrollment, sequelize } = require('../models');
const { Op } = require('sequelize');

// Create payout request
exports.createPayout = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { courseId, amount, method, description } = req.body;
    const instructorId = req.user.id;

    // Validate required fields
    if (!courseId || !amount || !method) {
      return res.status(400).json({ 
        message: 'Course ID, amount, and method are required' 
      });
    }

    // Validate method
    const validMethods = ['BANK_TRANSFER', 'PAYPAL'];
    if (!validMethods.includes(method)) {
      return res.status(400).json({ 
        message: 'Invalid payment method. Must be BANK_TRANSFER or PAYPAL' 
      });
    }

    // Check if course exists and belongs to instructor
    const course = await Course.findOne({
      where: { 
        id: courseId, 
        instructorId: instructorId 
      }
    });

    if (!course) {
      return res.status(404).json({ 
        message: 'Course not found or you are not the instructor' 
      });
    }

    // Calculate available amount from payments - ONLY SUBTRACT COMPLETED PAYOUTS
    // First get all enrollments for this course
    const enrollments = await Enrollment.findAll({
      where: { courseId: courseId },
      attributes: ['id']
    });

    const enrollmentIds = enrollments.map(enrollment => enrollment.id);

    // Then get payments for these enrollments where instructor matches
    const totalEarnings = await Payment.sum('instructorShare', {
      where: {
        enrollmentId: { [Op.in]: enrollmentIds },
        instructorId: instructorId,
        status: 'COMPLETED'
      }
    }) || 0;

    // Calculate already COMPLETED payouts for this course (excluding PENDING/PROCESSING)
    const totalCompletedPayouts = await Payout.sum('amount', {
      where: {
        instructorId: instructorId,
        courseId: courseId,
        status: 'COMPLETED' // Only count completed payouts
      }
    }) || 0;

    const availableAmount = totalEarnings - totalCompletedPayouts;

    // Get pending payouts for information (not subtracted from available amount)
    const totalPendingPayouts = await Payout.sum('amount', {
      where: {
        instructorId: instructorId,
        courseId: courseId,
        status: { [Op.in]: ['PENDING', 'PROCESSING'] }
      }
    }) || 0;

    // Debug logging (remove in production)
    console.log('Debug info:', {
      courseId,
      instructorId,
      enrollmentIds,
      totalEarnings,
      totalCompletedPayouts,
      totalPendingPayouts,
      availableAmount
    });

    // Validate requested amount
    if (amount > availableAmount) {
      return res.status(400).json({ 
        message: `Insufficient funds. Available amount: ${availableAmount}`,
        debug: {
          totalEarnings,
          totalCompletedPayouts,
          totalPendingPayouts,
          availableAmount
        }
      });
    }

    if (amount <= 0) {
      return res.status(400).json({ 
        message: 'Amount must be greater than 0' 
      });
    }

    // Create payout request
    const payout = await Payout.create({
      amount,
      method,
      status: 'PENDING',
      requestedAt: new Date(),
      createdAt: new Date(),
      updateAt: new Date(),
      instructorId,
      courseId
    }, { transaction });

    // Create transaction log
    await TransactionLog.create({
      type: 'PAYOUT',
      amount: amount,
      description: description || `Payout request for course: ${course.title}`,
      payoutId: payout.id,
      createdAt: new Date(),
      updateAt: new Date()
    }, { transaction });

    await transaction.commit();

    // Fetch the created payout with associations
    const createdPayout = await Payout.findByPk(payout.id, {
      include: [
        {
          model: User,
          as: 'instructor',
          attributes: ['id', 'name', 'email']
        },
        {
          model: Course,
          as: 'course',
          attributes: ['id', 'title']
        }
      ]
    });

    res.status(201).json({
      message: 'Payout request created successfully',
      payout: createdPayout,
      availableAmount: availableAmount, // Available amount remains the same
      pendingAmount: totalPendingPayouts + amount, // Show total pending including this request
      note: 'Available amount will be reduced only when admin approves the payout'
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Payout creation error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get payout details
exports.getPayoutDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    const payout = await Payout.findByPk(id, {
      include: [
        {
          model: User,
          as: 'instructor',
          attributes: ['id', 'name', 'email']
        },
        {
          model: Course,
          as: 'course',
          attributes: ['id', 'title', 'price']
        }
      ]
    });

    if (!payout) {
      return res.status(404).json({ message: 'Payout not found' });
    }

    // Check authorization - instructor can only see their own payouts, admin can see all
    if (userRole !== 'ADMIN' && payout.instructorId !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({
      message: 'Payout details retrieved successfully',
      payout
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Update payout status (Admin only)
exports.updatePayoutStatus = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;
    const { status, rejectionReason } = req.body;

    // Validate status
    const validStatuses = ['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        message: 'Invalid status. Must be PENDING, PROCESSING, COMPLETED, or FAILED' 
      });
    }

    const payout = await Payout.findByPk(id, {
      include: [
        {
          model: User,
          as: 'instructor',
          attributes: ['id', 'name', 'email']
        },
        {
          model: Course,
          as: 'course',
          attributes: ['id', 'title']
        }
      ]
    });

    if (!payout) {
      return res.status(404).json({ message: 'Payout not found' });
    }

    // Additional validation for status change
    const currentStatus = payout.status;
    
    // Prevent updating already completed or failed payouts
    if (currentStatus === 'COMPLETED' && status !== 'COMPLETED') {
      return res.status(400).json({ 
        message: 'Cannot change status of a completed payout' 
      });
    }

    // If changing from non-COMPLETED to COMPLETED, verify available balance
    if (currentStatus !== 'COMPLETED' && status === 'COMPLETED') {
      // Get enrollments for the course
      const enrollments = await Enrollment.findAll({
        where: { courseId: payout.courseId },
        attributes: ['id']
      });

      const enrollmentIds = enrollments.map(enrollment => enrollment.id);

      // Calculate total earnings
      const totalEarnings = await Payment.sum('instructorShare', {
        where: {
          enrollmentId: { [Op.in]: enrollmentIds },
          instructorId: payout.instructorId,
          status: 'COMPLETED'
        }
      }) || 0;

      // Calculate already completed payouts (excluding current payout)
      const totalCompletedPayouts = await Payout.sum('amount', {
        where: {
          instructorId: payout.instructorId,
          courseId: payout.courseId,
          status: 'COMPLETED',
          id: { [Op.ne]: payout.id } // Exclude current payout
        }
      }) || 0;

      const availableAmount = totalEarnings - totalCompletedPayouts;

      // Check if sufficient funds available
      if (payout.amount > availableAmount) {
        return res.status(400).json({ 
          message: `Insufficient funds to complete payout. Available: ${availableAmount}, Requested: ${payout.amount}`,
          debug: {
            totalEarnings,
            totalCompletedPayouts,
            availableAmount,
            payoutAmount: payout.amount
          }
        });
      }
    }

    // Update payout status
    const updateData = { status };
    
    if (status === 'COMPLETED' || status === 'PROCESSING') {
      updateData.processedAt = new Date();
    }

    await payout.update(updateData, { transaction });

    // Create transaction log for status change
    let logDescription = `Payout status changed to ${status.toLowerCase()}`;
    
    if (status === 'COMPLETED') {
      logDescription = `Payout completed - Amount deducted from available balance`;
    } else if (status === 'FAILED' && rejectionReason) {
      logDescription = `Payout failed - ${rejectionReason}`;
    } else if (status === 'PROCESSING') {
      logDescription = `Payout is being processed`;
    }

    await TransactionLog.create({
      type: 'PAYOUT',
      amount: payout.amount,
      description: logDescription,
      payoutId: payout.id,
      createdAt: new Date(),
      updateAt: new Date()
    }, { transaction });

    await transaction.commit();

    // Fetch updated payout
    const updatedPayout = await Payout.findByPk(id, {
      include: [
        {
          model: User,
          as: 'instructor',
          attributes: ['id', 'name', 'email']
        },
        {
          model: Course,
          as: 'course',
          attributes: ['id', 'title']
        }
      ]
    });

    // Calculate new available balance if status changed to COMPLETED
    let newAvailableBalance = null;
    if (status === 'COMPLETED') {
      const enrollments = await Enrollment.findAll({
        where: { courseId: payout.courseId },
        attributes: ['id']
      });

      const enrollmentIds = enrollments.map(enrollment => enrollment.id);

      const totalEarnings = await Payment.sum('instructorShare', {
        where: {
          enrollmentId: { [Op.in]: enrollmentIds },
          instructorId: payout.instructorId,
          status: 'COMPLETED'
        }
      }) || 0;

      const totalCompletedPayouts = await Payout.sum('amount', {
        where: {
          instructorId: payout.instructorId,
          courseId: payout.courseId,
          status: 'COMPLETED'
        }
      }) || 0;

      newAvailableBalance = totalEarnings - totalCompletedPayouts;
    }

    const response = {
      message: 'Payout status updated successfully',
      payout: updatedPayout
    };

    if (newAvailableBalance !== null) {
      response.newAvailableBalance = newAvailableBalance;
      response.note = 'Available balance has been updated after payout completion';
    }

    res.json(response);
  } catch (error) {
    await transaction.rollback();
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Get pending payouts (Admin only)
exports.getPendingPayouts = async (req, res) => {
  try {
    const { page = 1, limit = 10, instructorId, courseId } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = { status: 'PENDING' };
    if (instructorId) whereClause.instructorId = instructorId;
    if (courseId) whereClause.courseId = courseId;

    const { count, rows: payouts } = await Payout.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'instructor',
          attributes: ['id', 'name', 'email']
        },
        {
          model: Course,
          as: 'course',
          attributes: ['id', 'title', 'price']
        }
      ],
      order: [['requestedAt', 'ASC']], // Oldest requests first
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    // Calculate total pending amount
    const totalPendingAmount = await Payout.sum('amount', {
      where: { status: 'PENDING' }
    }) || 0;

    res.json({
      message: 'Pending payouts retrieved successfully',
      payouts,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
        totalItems: count,
        itemsPerPage: parseInt(limit)
      },
      summary: {
        totalPendingAmount,
        totalPendingRequests: count
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Get instructor payouts (for instructor dashboard)
exports.getInstructorPayouts = async (req, res) => {
  try {
    const instructorId = req.user.id;
    const { status, courseId, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = { instructorId };
    if (status) whereClause.status = status;
    if (courseId) whereClause.courseId = courseId;

    const { count, rows: payouts } = await Payout.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Course,
          as: 'course',
          attributes: ['id', 'title', 'price']
        }
      ],
      order: [['requestedAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    // Calculate total earnings and available balance - ONLY COUNT COMPLETED PAYOUTS
    // Get all courses for this instructor
    const instructorCourses = await Course.findAll({
      where: { instructorId: instructorId },
      attributes: ['id']
    });

    const courseIds = instructorCourses.map(course => course.id);

    // Get all enrollments for instructor's courses
    const enrollments = await Enrollment.findAll({
      where: { courseId: { [Op.in]: courseIds } },
      attributes: ['id']
    });

    const enrollmentIds = enrollments.map(enrollment => enrollment.id);

    // Calculate total earnings from all instructor's courses
    const totalEarnings = await Payment.sum('instructorShare', {
      where: {
        enrollmentId: { [Op.in]: enrollmentIds },
        instructorId: instructorId,
        status: 'COMPLETED'
      }
    }) || 0;

    // Only count COMPLETED payouts in the calculation
    const totalCompletedPayouts = await Payout.sum('amount', {
      where: {
        instructorId: instructorId,
        status: 'COMPLETED'
      }
    }) || 0;

    // Calculate pending payouts separately
    const totalPendingPayouts = await Payout.sum('amount', {
      where: {
        instructorId: instructorId,
        status: { [Op.in]: ['PENDING', 'PROCESSING'] }
      }
    }) || 0;

    const availableBalance = totalEarnings - totalCompletedPayouts;

    res.json({
      message: 'Instructor payouts retrieved successfully',
      payouts,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
        totalItems: count,
        itemsPerPage: parseInt(limit)
      },
      summary: {
        totalEarnings,
        totalCompletedPayouts,
        totalPendingPayouts,
        availableBalance,
        note: 'Available balance only reflects completed payouts, not pending ones'
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Additional helper function to get available balance for a specific course
exports.getCourseAvailableBalance = async (req, res) => {
  try {
    const { courseId } = req.params;
    const instructorId = req.user.id;

    // Check if course belongs to instructor
    const course = await Course.findOne({
      where: { 
        id: courseId, 
        instructorId: instructorId 
      }
    });

    if (!course) {
      return res.status(404).json({ 
        message: 'Course not found or you are not the instructor' 
      });
    }

    // Get enrollments for this course
    const enrollments = await Enrollment.findAll({
      where: { courseId: courseId },
      attributes: ['id'],
      include: [{
        model: Payment,
        as: 'payment',
        required: false,
        attributes: ['id', 'totalAmount', 'instructorShare', 'status', 'instructorId']
      }]
    });

    const enrollmentIds = enrollments.map(enrollment => enrollment.id);

    // Get detailed payment information for debugging
    const payments = await Payment.findAll({
      where: {
        enrollmentId: { [Op.in]: enrollmentIds },
        instructorId: instructorId
      },
      attributes: ['id', 'totalAmount', 'instructorShare', 'status', 'enrollmentId', 'instructorId']
    });

    // Calculate earnings for this specific course
    const totalEarnings = await Payment.sum('instructorShare', {
      where: {
        enrollmentId: { [Op.in]: enrollmentIds },
        instructorId: instructorId,
        status: 'COMPLETED'
      }
    }) || 0;

    // Calculate COMPLETED payouts for this course
    const totalCompletedPayouts = await Payout.sum('amount', {
      where: {
        instructorId: instructorId,
        courseId: courseId,
        status: 'COMPLETED'
      }
    }) || 0;

    // Calculate PENDING payouts for this course
    const totalPendingPayouts = await Payout.sum('amount', {
      where: {
        instructorId: instructorId,
        courseId: courseId,
        status: { [Op.in]: ['PENDING', 'PROCESSING'] }
      }
    }) || 0;

    const availableAmount = totalEarnings - totalCompletedPayouts;

    res.json({
      message: 'Course balance retrieved successfully',
      courseId: parseInt(courseId),
      courseTitle: course.title,
      instructorId: instructorId,
      enrollments: enrollments.map(e => e.id),
      payments: payments,
      totalEarnings,
      totalCompletedPayouts,
      totalPendingPayouts,
      availableAmount,
      note: 'Available amount only reflects completed payouts, not pending ones',
      debug: {
        enrollmentCount: enrollments.length,
        paymentCount: payments.length,
        completedPayments: payments.filter(p => p.status === 'COMPLETED').length
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Debug function to check all instructor data
exports.getInstructorDebugInfo = async (req, res) => {
  try {
    const instructorId = req.user.id;

    // Get instructor info
    const instructor = await User.findByPk(instructorId, {
      attributes: ['id', 'name', 'email', 'role']
    });

    // Get all courses by this instructor
    const courses = await Course.findAll({
      where: { instructorId: instructorId },
      attributes: ['id', 'title', 'price', 'status']
    });

    // Get all enrollments for instructor's courses
    const courseIds = courses.map(course => course.id);
    const enrollments = await Enrollment.findAll({
      where: { courseId: { [Op.in]: courseIds } },
      attributes: ['id', 'courseId', 'userId', 'status']
    });

    // Get all payments for instructor
    const payments = await Payment.findAll({
      where: { instructorId: instructorId },
      attributes: ['id', 'totalAmount', 'instructorShare', 'status', 'enrollmentId', 'instructorId'],
      include: [{
        model: Enrollment,
        as: 'enrollment',
        attributes: ['id', 'courseId'],
        include: [{
          model: Course,
          as: 'course',
          attributes: ['id', 'title']
        }]
      }]
    });

    // Get all payouts for instructor
    const payouts = await Payout.findAll({
      where: { instructorId: instructorId },
      attributes: ['id', 'amount', 'status', 'courseId', 'requestedAt']
    });

    res.json({
      message: 'Instructor debug info',
      instructor,
      courses,
      enrollments,
      payments,
      payouts,
      summary: {
        totalCourses: courses.length,
        totalEnrollments: enrollments.length,
        totalPayments: payments.length,
        completedPayments: payments.filter(p => p.status === 'COMPLETED').length,
        totalPayouts: payouts.length,
        completedPayouts: payouts.filter(p => p.status === 'COMPLETED').length,
        pendingPayouts: payouts.filter(p => ['PENDING', 'PROCESSING'].includes(p.status)).length
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Get instructor's total balance across all courses
exports.getInstructorTotalBalance = async (req, res) => {
  try {
    const instructorId = req.user.id;

    // Get all courses by this instructor
    const instructorCourses = await Course.findAll({
      where: { instructorId: instructorId },
      attributes: ['id', 'title', 'price', 'status']
    });

    const courseIds = instructorCourses.map(course => course.id);

    if (courseIds.length === 0) {
      return res.json({
        message: 'Instructor total balance retrieved successfully',
        balance: {
          totalEarnings: 0,
          totalCompletedPayouts: 0,
          totalPendingPayouts: 0,
          availableBalance: 0
        },
        courses: [],
        summary: {
          totalCourses: 0,
          totalEnrollments: 0,
          totalCompletedPayments: 0
        }
      });
    }

    // Get all enrollments for instructor's courses
    const enrollments = await Enrollment.findAll({
      where: { courseId: { [Op.in]: courseIds } },
      attributes: ['id', 'courseId', 'userId', 'status'],
      include: [{
        model: Course,
        as: 'course',
        attributes: ['id', 'title', 'price']
      }, {
        model: User,
        as: 'user',
        attributes: ['id', 'name', 'email']
      }]
    });

    const enrollmentIds = enrollments.map(enrollment => enrollment.id);

    // Calculate total earnings from all instructor's courses
    const totalEarnings = await Payment.sum('instructorShare', {
      where: {
        enrollmentId: { [Op.in]: enrollmentIds },
        instructorId: instructorId,
        status: 'COMPLETED'
      }
    }) || 0;

    // Calculate completed payouts only
    const totalCompletedPayouts = await Payout.sum('amount', {
      where: {
        instructorId: instructorId,
        status: 'COMPLETED'
      }
    }) || 0;

    // Calculate pending payouts separately
    const totalPendingPayouts = await Payout.sum('amount', {
      where: {
        instructorId: instructorId,
        status: { [Op.in]: ['PENDING', 'PROCESSING'] }
      }
    }) || 0;

    const availableBalance = totalEarnings - totalCompletedPayouts;

    // Get detailed breakdown by course
    const courseBreakdown = await Promise.all(
      instructorCourses.map(async (course) => {
        // Get enrollments for this specific course
        const courseEnrollments = enrollments.filter(e => e.courseId === course.id);
        const courseEnrollmentIds = courseEnrollments.map(e => e.id);

        // Calculate earnings for this course
        const courseEarnings = await Payment.sum('instructorShare', {
          where: {
            enrollmentId: { [Op.in]: courseEnrollmentIds },
            instructorId: instructorId,
            status: 'COMPLETED'
          }
        }) || 0;

        // Calculate COMPLETED payouts for this course
        const courseCompletedPayouts = await Payout.sum('amount', {
          where: {
            instructorId: instructorId,
            courseId: course.id,
            status: 'COMPLETED'
          }
        }) || 0;

        // Calculate PENDING payouts for this course
        const coursePendingPayouts = await Payout.sum('amount', {
          where: {
            instructorId: instructorId,
            courseId: course.id,
            status: { [Op.in]: ['PENDING', 'PROCESSING'] }
          }
        }) || 0;

        const courseAvailable = courseEarnings - courseCompletedPayouts;

        return {
          courseId: course.id,
          courseTitle: course.title,
          coursePrice: course.price,
          courseStatus: course.status,
          enrollmentCount: courseEnrollments.length,
          totalEarnings: courseEarnings,
          totalCompletedPayouts: courseCompletedPayouts,
          totalPendingPayouts: coursePendingPayouts,
          availableBalance: courseAvailable,
          enrollments: courseEnrollments.map(e => ({
            id: e.id,
            studentName: e.user.name,
            studentEmail: e.user.email,
            enrollmentStatus: e.status
          }))
        };
      })
    );

    // Get payment details for additional insights
    const completedPayments = await Payment.findAll({
      where: {
        enrollmentId: { [Op.in]: enrollmentIds },
        instructorId: instructorId,
        status: 'COMPLETED'
      },
      attributes: ['id', 'totalAmount', 'instructorShare', 'platformShare', 'createdAt'],
      include: [{
        model: Enrollment,
        as: 'enrollment',
        attributes: ['id', 'courseId'],
        include: [{
          model: Course,
          as: 'course',
          attributes: ['id', 'title']
        }, {
          model: User,
          as: 'user',
          attributes: ['id', 'name']
        }]
      }],
      order: [['createdAt', 'DESC']],
      limit: 10 // Get recent 10 payments for reference
    });

    // Get recent payouts
    const recentPayouts = await Payout.findAll({
      where: { instructorId: instructorId },
      include: [{
        model: Course,
        as: 'course',
        attributes: ['id', 'title']
      }],
      order: [['requestedAt', 'DESC']],
      limit: 5 // Get recent 5 payouts
    });

    res.json({
      message: 'Instructor total balance retrieved successfully',
      balance: {
        totalEarnings: Number(totalEarnings.toFixed(2)),
        totalCompletedPayouts: Number(totalCompletedPayouts.toFixed(2)),
        totalPendingPayouts: Number(totalPendingPayouts.toFixed(2)),
        availableBalance: Number(availableBalance.toFixed(2)),
        note: 'Available balance only reflects completed payouts, pending payouts do not reduce available balance'
      },
      courses: courseBreakdown,
      recentPayments: completedPayments.map(payment => ({
        id: payment.id,
        amount: payment.instructorShare,
        totalAmount: payment.totalAmount,
        platformShare: payment.platformShare,
        courseName: payment.enrollment.course.title,
        studentName: payment.enrollment.user.name,
        date: payment.createdAt
      })),
      recentPayouts: recentPayouts.map(payout => ({
        id: payout.id,
        amount: payout.amount,
        status: payout.status,
        method: payout.method,
        courseName: payout.course.title,
        requestedAt: payout.requestedAt,
        processedAt: payout.processedAt
      })),
      summary: {
        totalCourses: instructorCourses.length,
        publishedCourses: instructorCourses.filter(c => c.status === 'PUBLISHED').length,
        totalEnrollments: enrollments.length,
        totalCompletedPayments: completedPayments.length,
        averageEarningsPerCourse: instructorCourses.length > 0 ? 
          Number((totalEarnings / instructorCourses.length).toFixed(2)) : 0,
        averageEarningsPerEnrollment: enrollments.length > 0 ? 
          Number((totalEarnings / enrollments.length).toFixed(2)) : 0
      }
    });
  } catch (error) {
    console.error('Get instructor total balance error:', error);
    res.status(500).json({ message: error.message });
  }
};