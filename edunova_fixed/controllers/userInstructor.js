const { User, Course, Section, Lesson, Enrollment, Payment } = require('../models');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');

// Request to become instructor
exports.requestInstructor = async (req, res) => {
  try {
    const userId = req.user.id;
    const { 
      bio, 
      expertise, 
      experience, 
      education, 
      socialLinks,
      phoneNumber,
      profileImage 
    } = req.body;

    // Check if user already has instructor status or pending request
    const user = await User.findByPk(userId);
    
    if (user.role === 'INSTRUCTOR') {
      return res.status(400).json({ 
        message: 'You are already an instructor' 
      });
    }

    if (user.instructorStatus === 'PENDING') {
      return res.status(400).json({ 
        message: 'Your instructor request is already pending approval' 
      });
    }

    // Update user with instructor profile data and set status to pending
    await user.update({
      bio: bio || null,
      expertise: expertise || null,
      experience: experience || null,
      education: education || null,
      socialLinks: socialLinks || null,
      phoneNumber: phoneNumber || null,
      profileImage: profileImage || null,
      instructorStatus: 'PENDING',
      instructorRequestedAt: new Date()
    });

    res.status(200).json({
      message: 'Instructor request submitted successfully. Please wait for admin approval.',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        instructorStatus: user.instructorStatus
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update instructor profile
exports.updateInstructorProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Check if user is updating their own profile or admin is updating
    if (parseInt(id) !== userId && userRole !== 'ADMIN') {
      return res.status(403).json({ 
        message: 'You can only update your own profile' 
      });
    }

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user is instructor or has instructor request
    if (user.role !== 'INSTRUCTOR' && user.instructorStatus !== 'PENDING' && user.instructorStatus !== 'APPROVED') {
      return res.status(400).json({ 
        message: 'User is not an instructor or has no instructor request' 
      });
    }

    const { 
      bio, 
      expertise, 
      experience, 
      education, 
      socialLinks,
      phoneNumber,
      profileImage 
    } = req.body;

    // Update instructor profile
    await user.update({
      bio: bio !== undefined ? bio : user.bio,
      expertise: expertise !== undefined ? expertise : user.expertise,
      experience: experience !== undefined ? experience : user.experience,
      education: education !== undefined ? education : user.education,
      socialLinks: socialLinks !== undefined ? socialLinks : user.socialLinks,
      phoneNumber: phoneNumber !== undefined ? phoneNumber : user.phoneNumber,
      profileImage: profileImage !== undefined ? profileImage : user.profileImage
    });

    res.status(200).json({
      message: 'Instructor profile updated successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        bio: user.bio,
        expertise: user.expertise,
        experience: user.experience,
        education: user.education,
        socialLinks: user.socialLinks,
        phoneNumber: user.phoneNumber,
        profileImage: user.profileImage,
        instructorStatus: user.instructorStatus
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get instructor profile
exports.getInstructorProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      attributes: [
        'id', 'name', 'email', 'role', 'bio', 'expertise', 
        'experience', 'education', 'socialLinks', 'phoneNumber', 
        'profileImage', 'instructorStatus', 'instructorRequestedAt',
        'instructorApprovedAt', 'createdAt', 'updatedAt'
      ]
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user is instructor or has instructor profile data
    if (user.role !== 'INSTRUCTOR' && !user.instructorStatus) {
      return res.status(404).json({ 
        message: 'Instructor profile not found' 
      });
    }

    res.status(200).json({
      message: 'Instructor profile retrieved successfully',
      user: user
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all instructor requests (Admin only)
exports.getInstructorRequests = async (req, res) => {
  try {
    const { status = 'PENDING', page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = {
      instructorStatus: status
    };

    const { count, rows: users } = await User.findAndCountAll({
      where: whereClause,
      attributes: [
        'id', 'name', 'email', 'role', 'bio', 'expertise', 
        'experience', 'education', 'socialLinks', 'phoneNumber', 
        'profileImage', 'instructorStatus', 'instructorRequestedAt',
        'createdAt', 'updatedAt'
      ],
      order: [['instructorRequestedAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.status(200).json({
      message: 'Instructor requests retrieved successfully',
      data: {
        users,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / limit),
          totalItems: count,
          itemsPerPage: parseInt(limit)
        }
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Approve instructor request (Admin only)
exports.approveInstructor = async (req, res) => {
  try {
    const { id } = req.params;
    const { action, rejectionReason } = req.body; // action: 'approve' or 'reject'

    if (!action || !['approve', 'reject'].includes(action)) {
      return res.status(400).json({ 
        message: 'Action must be either "approve" or "reject"' 
      });
    }

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.instructorStatus !== 'PENDING') {
      return res.status(400).json({ 
        message: 'No pending instructor request found for this user' 
      });
    }

    if (action === 'approve') {
      await user.update({
        role: 'INSTRUCTOR',
        instructorStatus: 'APPROVED',
        instructorApprovedAt: new Date(),
        rejectionReason: null
      });

      res.status(200).json({
        message: 'Instructor request approved successfully',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          instructorStatus: user.instructorStatus,
          instructorApprovedAt: user.instructorApprovedAt
        }
      });
    } else {
      await user.update({
        instructorStatus: 'REJECTED',
        rejectionReason: rejectionReason || 'No reason provided'
      });

      res.status(200).json({
        message: 'Instructor request rejected successfully',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          instructorStatus: user.instructorStatus,
          rejectionReason: user.rejectionReason
        }
      });
    }

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all approved instructors (Public access - untuk directory)
exports.getAllInstructors = async (req, res) => {
  try {
    const { page = 1, limit = 12, search, expertise } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = {
      role: 'INSTRUCTOR',
      instructorStatus: 'APPROVED'
    };

    // Add search functionality
    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { bio: { [Op.like]: `%${search}%` } }
      ];
    }

    // Filter by expertise (assuming expertise is stored as JSON array)
    if (expertise) {
      whereClause.expertise = {
        [Op.like]: `%${expertise}%`
      };
    }

    const { count, rows: instructors } = await User.findAndCountAll({
      where: whereClause,
      attributes: [
        'id', 'name', 'email', 'bio', 'expertise', 
        'experience', 'education', 'socialLinks', 
        'profileImage', 'instructorApprovedAt', 'createdAt'
      ],
      include: [
        {
          model: Course,
          as: 'Courses',
          attributes: ['id', 'title', 'status', 'price', 'thumbnail'],
          where: { status: 'PUBLISHED' },
          required: false // This is important - LEFT JOIN instead of INNER JOIN
        }
      ],
      order: [['instructorApprovedAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    // Add course count for each instructor
    const instructorsWithStats = instructors.map(instructor => {
      const instructorData = instructor.toJSON();
      instructorData.totalCourses = instructorData.Courses ? instructorData.Courses.length : 0;
      return instructorData;
    });

    res.status(200).json({
      message: 'Instructors retrieved successfully',
      data: {
        instructors: instructorsWithStats,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / limit),
          totalItems: count,
          itemsPerPage: parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('Error in getAllInstructors:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get courses by specific instructor (Public access)
exports.getInstructorCourses = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10, status = 'PUBLISHED' } = req.query;
    const offset = (page - 1) * limit;

    // Check if instructor exists and is approved
    const instructor = await User.findOne({
      where: {
        id: id,
        role: 'INSTRUCTOR',
        instructorStatus: 'APPROVED'
      },
      attributes: ['id', 'name', 'email', 'bio', 'profileImage']
    });

    if (!instructor) {
      return res.status(404).json({ 
        message: 'Instructor not found or not approved' 
      });
    }

    let whereClause = {
      instructorId: id
    };

    // Add status filter (default to PUBLISHED for public access)
    if (status) {
      whereClause.status = status;
    }

    const { count, rows: courses } = await Course.findAndCountAll({
      where: whereClause,
      attributes: [
        'id', 'title', 'description', 'price', 'thumbnail', 
        'status', 'createdAt', 'updatedAt'
      ],
      include: [
        {
          model: Section,
          as: 'Sections',
          attributes: ['id', 'title', 'order'],
          include: [
            {
              model: Lesson,
              as: 'Lessons',
              attributes: ['id', 'title', 'duration']
            }
          ]
        },
        {
          model: Enrollment,
          as: 'Enrollments',
          attributes: ['id', 'status'],
          required: false
        }
      ],
      order: [
        ['createdAt', 'DESC'],
        [{ model: Section, as: 'Sections' }, 'order', 'ASC'],
        [{ model: Section, as: 'Sections' }, { model: Lesson, as: 'Lessons' }, 'order', 'ASC']
      ],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    // Add course statistics
    const coursesWithStats = courses.map(course => {
      const courseData = course.toJSON();
      
      // Calculate total lessons and duration
      let totalLessons = 0;
      let totalDuration = 0;
      
      if (courseData.Sections) {
        courseData.Sections.forEach(section => {
          if (section.Lessons) {
            totalLessons += section.Lessons.length;
            section.Lessons.forEach(lesson => {
              totalDuration += lesson.duration || 0;
            });
          }
        });
      }

      // Calculate enrollments
      const totalEnrollments = courseData.Enrollments ? courseData.Enrollments.length : 0;

      return {
        ...courseData,
        totalLessons,
        totalDuration,
        totalEnrollments
      };
    });

    res.status(200).json({
      message: 'Instructor courses retrieved successfully',
      data: {
        instructor,
        courses: coursesWithStats,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / limit),
          totalItems: count,
          itemsPerPage: parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('Error in getInstructorCourses:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get instructor statistics (Admin only)
exports.getInstructorStats = async (req, res) => {
  try {
    const { id } = req.params;
    const { startDate, endDate } = req.query;

    // Check if instructor exists
    const instructor = await User.findOne({
      where: {
        id: id,
        role: 'INSTRUCTOR'
      },
      attributes: [
        'id', 'name', 'email', 'bio', 'profileImage',
        'instructorStatus', 'instructorApprovedAt', 'createdAt'
      ]
    });

    if (!instructor) {
      return res.status(404).json({ 
        message: 'Instructor not found' 
      });
    }

    // Build date filter if provided
    let dateFilter = {};
    if (startDate || endDate) {
      dateFilter.createdAt = {};
      if (startDate) dateFilter.createdAt[Op.gte] = new Date(startDate);
      if (endDate) dateFilter.createdAt[Op.lte] = new Date(endDate);
    }

    // Get courses statistics
    const courses = await Course.findAll({
      where: {
        instructorId: id,
        ...dateFilter
      },
      attributes: ['id', 'title', 'price', 'status', 'createdAt'],
      include: [
        {
          model: Enrollment,
          as: 'Enrollments',
          attributes: ['id', 'status', 'createdAt'],
          required: false,
          include: [
            {
              model: Payment,
              as: 'payment',
              attributes: ['id', 'instructorShare', 'status', 'createdAt'],
              required: false
            }
          ]
        }
      ]
    });

    // Calculate statistics
    let totalCourses = courses.length;
    let publishedCourses = courses.filter(c => c.status === 'PUBLISHED').length;
    let draftCourses = courses.filter(c => c.status === 'DRAFT').length;
    let archivedCourses = courses.filter(c => c.status === 'ARCHIVED').length;

    let totalEnrollments = 0;
    let totalRevenue = 0;

    courses.forEach(course => {
      // Count enrollments
      if (course.Enrollments) {
        totalEnrollments += course.Enrollments.length;
        
        // Calculate revenue from payments
        course.Enrollments.forEach(enrollment => {
          if (enrollment.payment && enrollment.payment.status === 'COMPLETED') {
            totalRevenue += enrollment.payment.instructorShare || 0;
          }
        });
      }
    });

    // Get monthly enrollment trends (last 12 months)
    const monthlyEnrollments = [];
    for (let i = 11; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
      const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      const monthEnrollments = await Enrollment.count({
        include: [
          {
            model: Course,
            as: 'course',
            where: { instructorId: id },
            attributes: []
          }
        ],
        where: {
          createdAt: {
            [Op.gte]: startOfMonth,
            [Op.lte]: endOfMonth
          }
        }
      });

      monthlyEnrollments.push({
        month: date.toISOString().slice(0, 7), // YYYY-MM format
        enrollments: monthEnrollments
      });
    }

    res.status(200).json({
      message: 'Instructor statistics retrieved successfully',
      data: {
        instructor,
        statistics: {
          courses: {
            total: totalCourses,
            published: publishedCourses,
            draft: draftCourses,
            archived: archivedCourses
          },
          enrollments: {
            total: totalEnrollments
          },
          revenue: {
            total: totalRevenue
          },
          trends: {
            monthlyEnrollments
          }
        }
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};