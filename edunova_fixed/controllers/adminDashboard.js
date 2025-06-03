const { User, Course, Enrollment, Payment, Review, Category, Tag, Section, Lesson } = require('../models');
const { Op } = require('sequelize');
const sequelize = require('sequelize');

// Get admin dashboard statistics
exports.getDashboardStats = async (req, res) => {
  try {
    // Get date ranges for statistics
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    // User Statistics
    const totalUsers = await User.count();
    const totalStudents = await User.count({ where: { role: 'STUDENT' } });
    const totalInstructors = await User.count({ where: { role: 'INSTRUCTOR' } });
    const newUsersToday = await User.count({
      where: {
        createdAt: { [Op.gte]: startOfToday },
      },
    });
    const newUsersThisWeek = await User.count({
      where: {
        createdAt: { [Op.gte]: startOfWeek },
      },
    });

    // Course Statistics
    const totalCourses = await Course.count();
    const publishedCourses = await Course.count({ where: { status: 'PUBLISHED' } });
    const draftCourses = await Course.count({ where: { status: 'DRAFT' } });
    const archivedCourses = await Course.count({ where: { status: 'ARCHIVED' } });
    const newCoursesToday = await Course.count({
      where: {
        createdAt: { [Op.gte]: startOfToday },
      },
    });

    // Enrollment Statistics
    const totalEnrollments = await Enrollment.count();
    const activeEnrollments = await Enrollment.count({ where: { status: 'ENROLLED' } });
    const completedEnrollments = await Enrollment.count({ where: { status: 'COMPLETED' } });
    const droppedEnrollments = await Enrollment.count({ where: { status: 'DROPPED' } });
    const newEnrollmentsToday = await Enrollment.count({
      where: {
        createdAt: { [Op.gte]: startOfToday },
      },
    });

    // Payment Statistics
    const totalRevenue =
      (await Payment.sum('totalAmount', {
        where: { status: 'COMPLETED' },
      })) || 0;
    const platformRevenue =
      (await Payment.sum('platformShare', {
        where: { status: 'COMPLETED' },
      })) || 0;
    const instructorRevenue =
      (await Payment.sum('instructorShare', {
        where: { status: 'COMPLETED' },
      })) || 0;
    const revenueThisMonth =
      (await Payment.sum('totalAmount', {
        where: {
          status: 'COMPLETED',
          createdAt: { [Op.gte]: startOfMonth },
        },
      })) || 0;

    // Review Statistics
    const totalReviews = await Review.count();
    const pendingReviews = await Review.count({ where: { status: 'PENDING' } });
    const approvedReviews = await Review.count({ where: { status: 'APPROVED' } });
    const averageRating = await Review.findOne({
      attributes: [[sequelize.fn('AVG', sequelize.col('rating')), 'avgRating']],
      where: { status: 'APPROVED' },
    });

    // Recent Activities - Last 10 users, courses, enrollments
    const recentUsers = await User.findAll({
      limit: 10,
      order: [['createdAt', 'DESC']],
      attributes: ['id', 'name', 'email', 'role', 'createdAt'],
    });

    const recentCourses = await Course.findAll({
      limit: 10,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: User,
          as: 'instructor',
          attributes: ['id', 'name', 'email'],
        },
      ],
      attributes: ['id', 'title', 'status', 'price', 'createdAt'],
    });

    const recentEnrollments = await Enrollment.findAll({
      limit: 10,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: Course,
          as: 'course',
          attributes: ['id', 'title'],
        },
      ],
      attributes: ['id', 'status', 'progress', 'createdAt'],
    });

    // Monthly revenue chart data (last 12 months)
    const monthlyRevenueData = await Payment.findAll({
      attributes: [
        [sequelize.fn('DATE_FORMAT', sequelize.col('createdAt'), '%Y-%m'), 'month'],
        [sequelize.fn('SUM', sequelize.col('totalAmount')), 'revenue'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'transactions'],
      ],
      where: {
        status: 'COMPLETED',
        createdAt: { [Op.gte]: new Date(now.getFullYear() - 1, now.getMonth(), 1) },
      },
      group: [sequelize.fn('DATE_FORMAT', sequelize.col('createdAt'), '%Y-%m')],
      order: [[sequelize.fn('DATE_FORMAT', sequelize.col('createdAt'), '%Y-%m'), 'ASC']],
    });

    // Top performing courses
    const topCourses = await Course.findAll({
      attributes: ['id', 'title', 'price'],
      include: [
        {
          model: Enrollment,
          as: 'Enrollments',
          attributes: [],
          include: [
            {
              model: Payment,
              as: 'payment',
              attributes: [],
              where: { status: 'COMPLETED' },
              required: false,
            },
          ],
          required: false,
        },
      ],
      group: ['Course.id'],
      order: [[sequelize.fn('COUNT', sequelize.col('Enrollments.id')), 'DESC']],
      limit: 5,
      subQuery: false, // This is important to avoid the subquery issue
    });

    //manually calculate the statistics for each course
    const topCoursesWithStats = await Promise.all(
      topCourses.map(async (course) => {
        const enrollmentCount = await Enrollment.count({
          where: { courseId: course.id },
        });

        const totalRevenue =
          (await Payment.sum('totalAmount', {
            include: [
              {
                model: Enrollment,
                as: 'enrollment',
                where: { courseId: course.id },
                attributes: [],
              },
            ],
            where: { status: 'COMPLETED' },
          })) || 0;

        return {
          id: course.id,
          title: course.title,
          price: course.price,
          enrollmentCount,
          totalRevenue: parseFloat(totalRevenue.toFixed(2)),
        };
      })
    );

    // Sort by enrollment count descending
    topCoursesWithStats.sort((a, b) => b.enrollmentCount - a.enrollmentCount);

    const dashboardData = {
      statistics: {
        users: {
          total: totalUsers,
          students: totalStudents,
          instructors: totalInstructors,
          newToday: newUsersToday,
          newThisWeek: newUsersThisWeek,
        },
        courses: {
          total: totalCourses,
          published: publishedCourses,
          draft: draftCourses,
          archived: archivedCourses,
          newToday: newCoursesToday,
        },
        enrollments: {
          total: totalEnrollments,
          active: activeEnrollments,
          completed: completedEnrollments,
          dropped: droppedEnrollments,
          newToday: newEnrollmentsToday,
        },
        revenue: {
          total: parseFloat(totalRevenue.toFixed(2)),
          platform: parseFloat(platformRevenue.toFixed(2)),
          instructor: parseFloat(instructorRevenue.toFixed(2)),
          thisMonth: parseFloat(revenueThisMonth.toFixed(2)),
        },
        reviews: {
          total: totalReviews,
          pending: pendingReviews,
          approved: approvedReviews,
          averageRating: averageRating ? parseFloat(averageRating.dataValues.avgRating).toFixed(1) : 0,
        },
      },
      recentActivities: {
        users: recentUsers,
        courses: recentCourses,
        enrollments: recentEnrollments,
      },
      charts: {
        monthlyRevenue: monthlyRevenueData,
        topCourses: topCoursesWithStats,
      },
    };

    res.json({
      message: 'Dashboard statistics retrieved successfully',
      data: dashboardData,
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      message: 'Failed to retrieve dashboard statistics',
      error: error.message,
    });
  }
};

// Get all users with filtering, pagination, and search
exports.getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, role, instructorStatus, search, sortBy = 'createdAt', sortOrder = 'DESC' } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Build where conditions
    const whereConditions = {};

    if (role && ['STUDENT', 'INSTRUCTOR', 'ADMIN'].includes(role)) {
      whereConditions.role = role;
    }

    if (instructorStatus && ['PENDING', 'APPROVED', 'REJECTED'].includes(instructorStatus)) {
      whereConditions.instructorStatus = instructorStatus;
    }

    if (search) {
      whereConditions[Op.or] = [{ name: { [Op.like]: `%${search}%` } }, { email: { [Op.like]: `%${search}%` } }];
    }

    const { count, rows } = await User.findAndCountAll({
      where: whereConditions,
      attributes: [
        'id',
        'name',
        'email',
        'role',
        'bio',
        'expertise',
        'experience',
        'education',
        'phoneNumber',
        'profileImage',
        'instructorStatus',
        'instructorRequestedAt',
        'instructorApprovedAt',
        'rejectionReason',
        'createdAt',
        'updatedAt',
      ],
      limit: parseInt(limit),
      offset: offset,
      order: [[sortBy, sortOrder.toUpperCase()]],
    });

    // Get additional statistics for each instructor
    const usersWithStats = await Promise.all(
      rows.map(async (user) => {
        const userData = user.toJSON();

        if (user.role === 'INSTRUCTOR') {
          // Get instructor's course count
          userData.courseCount = await Course.count({
            where: { instructorId: user.id },
          });

          // Get instructor's total students (enrollments)
          userData.studentCount = await Enrollment.count({
            include: [
              {
                model: Course,
                as: 'course',
                where: { instructorId: user.id },
                attributes: [],
              },
            ],
          });

          // Get instructor's total revenue
          userData.totalRevenue =
            (await Payment.sum('instructorShare', {
              where: {
                instructorId: user.id,
                status: 'COMPLETED',
              },
            })) || 0;
        }

        return userData;
      })
    );

    const totalPages = Math.ceil(count / parseInt(limit));

    res.json({
      message: 'Users retrieved successfully',
      users: usersWithStats,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalUsers: count,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1,
      },
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      message: 'Failed to retrieve users',
      error: error.message,
    });
  }
};

// Get all courses with comprehensive filtering and statistics
exports.getAllCoursesAdmin = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, categoryId, tagId, instructorId, search, sortBy = 'createdAt', sortOrder = 'DESC', priceMin, priceMax } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Build where conditions
    const whereConditions = {};

    if (status && ['DRAFT', 'PUBLISHED', 'ARCHIVED'].includes(status)) {
      whereConditions.status = status;
    }

    if (instructorId) {
      whereConditions.instructorId = instructorId;
    }

    if (search) {
      whereConditions[Op.or] = [{ title: { [Op.like]: `%${search}%` } }, { description: { [Op.like]: `%${search}%` } }];
    }

    if (priceMin !== undefined || priceMax !== undefined) {
      whereConditions.price = {};
      if (priceMin !== undefined) {
        whereConditions.price[Op.gte] = parseFloat(priceMin);
      }
      if (priceMax !== undefined) {
        whereConditions.price[Op.lte] = parseFloat(priceMax);
      }
    }

    // Build include conditions
    const includeConditions = [
      {
        model: User,
        as: 'instructor',
        attributes: ['id', 'name', 'email', 'profileImage'],
      },
      {
        model: Category,
        through: { attributes: [] },
        attributes: ['id', 'name'],
        ...(categoryId && { where: { id: categoryId } }),
      },
      {
        model: Tag,
        through: { attributes: [] },
        attributes: ['id', 'name'],
        ...(tagId && { where: { id: tagId } }),
      },
      {
        model: Section,
        as: 'Sections',
        attributes: ['id', 'title'],
        include: [
          {
            model: Lesson,
            as: 'Lessons',
            attributes: ['id', 'title', 'duration'],
          },
        ],
      },
    ];

    const { count, rows } = await Course.findAndCountAll({
      where: whereConditions,
      include: includeConditions,
      limit: parseInt(limit),
      offset: offset,
      order: [[sortBy, sortOrder.toUpperCase()]],
      distinct: true,
    });

    // Get additional statistics for each course
    const coursesWithStats = await Promise.all(
      rows.map(async (course) => {
        const courseData = course.toJSON();

        // Get enrollment statistics
        const enrollmentStats = await Enrollment.findAll({
          where: { courseId: course.id },
          attributes: ['status', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
          group: ['status'],
        });

        courseData.enrollmentStats = {
          total: 0,
          enrolled: 0,
          completed: 0,
          dropped: 0,
        };

        enrollmentStats.forEach((stat) => {
          const status = stat.dataValues.status.toLowerCase();
          const count = parseInt(stat.dataValues.count);
          courseData.enrollmentStats.total += count;
          courseData.enrollmentStats[status] = count;
        });

        // Get revenue statistics
        courseData.totalRevenue =
          (await Payment.sum('totalAmount', {
            include: [
              {
                model: Enrollment,
                as: 'enrollment',
                where: { courseId: course.id },
                attributes: [],
              },
            ],
            where: { status: 'COMPLETED' },
          })) || 0;

        // Get average rating
        const avgRating = await Review.findOne({
          attributes: [[sequelize.fn('AVG', sequelize.col('rating')), 'avgRating']],
          where: {
            courseId: course.id,
            status: 'APPROVED',
          },
        });

        courseData.averageRating = avgRating ? parseFloat(avgRating.dataValues.avgRating).toFixed(1) : 0;

        // Get review count
        courseData.reviewCount = await Review.count({
          where: {
            courseId: course.id,
            status: 'APPROVED',
          },
        });

        // Calculate total lessons and duration
        let totalLessons = 0;
        let totalDuration = 0;

        courseData.Sections.forEach((section) => {
          totalLessons += section.Lessons.length;
          section.Lessons.forEach((lesson) => {
            totalDuration += lesson.duration || 0;
          });
        });

        courseData.totalLessons = totalLessons;
        courseData.totalDuration = totalDuration;

        return courseData;
      })
    );

    const totalPages = Math.ceil(count / parseInt(limit));

    res.json({
      message: 'Courses retrieved successfully',
      courses: coursesWithStats,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalCourses: count,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1,
      },
    });
  } catch (error) {
    console.error('Get all courses admin error:', error);
    res.status(500).json({
      message: 'Failed to retrieve courses',
      error: error.message,
    });
  }
};
