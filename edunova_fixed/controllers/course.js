const { Course, User, Category, Tag, Section, Lesson, CourseCategory, CourseTag, Review, Enrollment, sequelize } = require('../models');
const { Op } = require('sequelize');

// Create a new course
exports.createCourse = async (req, res) => {
  const { title, description, price, thumbnail, categoryIds, tagIds } = req.body;

  // Validation
  if (!title || !description || price === undefined) {
    return res.status(400).json({ 
      message: 'Title, description, and price are required' 
    });
  }

  if (price < 0) {
    return res.status(400).json({ 
      message: 'Price must be a positive number' 
    });
  }

  try {
    // Create course
    const newCourse = await Course.create({
      title,
      description,
      price: parseFloat(price),
      thumbnail: thumbnail || null,
      instructorId: req.user.id,
      status: 'DRAFT'
    });

    // Add categories if provided
    if (categoryIds && Array.isArray(categoryIds) && categoryIds.length > 0) {
      const categories = await Category.findAll({
        where: { id: { [Op.in]: categoryIds } }
      });

      if (categories.length !== categoryIds.length) {
        return res.status(400).json({ 
          message: 'One or more category IDs are invalid' 
        });
      }

      const courseCategoryData = categoryIds.map(categoryId => ({
        courseId: newCourse.id,
        categoryId: categoryId
      }));

      await CourseCategory.bulkCreate(courseCategoryData);
    }

    // Add tags if provided
    if (tagIds && Array.isArray(tagIds) && tagIds.length > 0) {
      const tags = await Tag.findAll({
        where: { id: { [Op.in]: tagIds } }
      });

      if (tags.length !== tagIds.length) {
        return res.status(400).json({ 
          message: 'One or more tag IDs are invalid' 
        });
      }

      const courseTagData = tagIds.map(tagId => ({
        courseId: newCourse.id,
        tagId: tagId
      }));

      await CourseTag.bulkCreate(courseTagData);
    }

    // Fetch the complete course data
    const courseWithDetails = await Course.findByPk(newCourse.id, {
      include: [
        {
          model: User,
          as: 'instructor',
          attributes: ['id', 'name', 'email']
        },
        {
          model: Category,
          through: { attributes: [] },
          attributes: ['id', 'name']
        },
        {
          model: Tag,
          through: { attributes: [] },
          attributes: ['id', 'name']
        }
      ]
    });

    res.status(201).json({
      message: 'Course created successfully',
      course: courseWithDetails
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all courses with filtering and pagination
exports.getAllCourses = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      status, 
      categoryId, 
      tagId, 
      search,
      instructorId,
      sortBy = 'createdAt',
      sortOrder = 'DESC'
    } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    
    // Build where conditions
    const whereConditions = {};
    
    if (status) {
      whereConditions.status = status;
    }
    
    if (instructorId) {
      whereConditions.instructorId = instructorId;
    }
    
    if (search) {
      whereConditions[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }

    // Build include conditions
    const includeConditions = [
      {
        model: User,
        as: 'instructor',
        attributes: ['id', 'name', 'email', 'profileImage']
      },
      {
        model: Category,
        through: { attributes: [] },
        attributes: ['id', 'name'],
        ...(categoryId && { where: { id: categoryId } })
      },
      {
        model: Section,
        include: [
          {
            model: Lesson,
            as: 'Lessons',
            attributes: ['id', 'title', 'duration', 'order']
          }
        ],
        as: 'Sections',
        attributes: ['id', 'title', 'order'],
        ...(categoryId && { where: { id: categoryId } })
      },
      {
        model: Tag,
        through: { attributes: [] },
        attributes: ['id', 'name'],
        ...(tagId && { where: { id: tagId } })
      }
    ];

    const { count, rows } = await Course.findAndCountAll({
      where: whereConditions,
      include: includeConditions,
      limit: parseInt(limit),
      offset: offset,
      order: [[sortBy, sortOrder.toUpperCase()]],
      distinct: true
    });

    const totalPages = Math.ceil(count / parseInt(limit));

    res.json({
      courses: rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalCourses: count,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get course by ID
exports.getCourseById = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findByPk(id, {
      include: [
        {
          model: User,
          as: 'instructor',
          attributes: ['id', 'name', 'email', 'profileImage', 'bio', 'expertise']
        },
        {
          model: Category,
          through: { attributes: [] },
          attributes: ['id', 'name']
        },
        {
          model: Tag,
          through: { attributes: [] },
          attributes: ['id', 'name']
        },
        {
          model: Section,
          as: 'Sections',
          attributes: ['id', 'title', 'order'],
          include: [
            {
              model: Lesson,
              as: 'Lessons',
              attributes: ['id', 'title', 'duration', 'order']
            }
          ],
          order: [['order', 'ASC']]
        },
        {
          model: Review,
          as: 'Reviews',
          where: { status: 'APPROVED' },
          required: false,
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'name', 'profileImage']
            }
          ]
        }
      ]
    });

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Calculate average rating
    const avgRating = course.Reviews && course.Reviews.length > 0 
      ? course.Reviews.reduce((sum, review) => sum + review.rating, 0) / course.Reviews.length 
      : 0;

    // Count total enrollments
    const enrollmentCount = await Enrollment.count({
      where: { courseId: id }
    });

    const courseData = {
      ...course.toJSON(),
      averageRating: Math.round(avgRating * 10) / 10,
      totalEnrollments: enrollmentCount
    };

    res.json({ course: courseData });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update course
exports.updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, price, thumbnail, status } = req.body;

    const course = await Course.findByPk(id);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Validation for price
    if (price !== undefined && price < 0) {
      return res.status(400).json({ 
        message: 'Price must be a positive number' 
      });
    }

    // Validation for status
    const validStatuses = ['DRAFT', 'PUBLISHED', 'ARCHIVED'];
    if (status !== undefined && !validStatuses.includes(status)) {
      return res.status(400).json({ 
        message: `Status must be one of: ${validStatuses.join(', ')}` 
      });
    }

    // Build update data object
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = parseFloat(price);
    if (thumbnail !== undefined) updateData.thumbnail = thumbnail;
    if (status !== undefined) updateData.status = status;

    // Update course
    await course.update(updateData);

    // Fetch updated course with details
    const updatedCourse = await Course.findByPk(id, {
      include: [
        {
          model: User,
          as: 'instructor',
          attributes: ['id', 'name', 'email']
        },
        {
          model: Category,
          through: { attributes: [] },
          attributes: ['id', 'name']
        },
        {
          model: Tag,
          through: { attributes: [] },
          attributes: ['id', 'name']
        }
      ]
    });

    res.json({
      message: 'Course updated successfully',
      course: updatedCourse
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete course (soft delete)
exports.deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findByPk(id);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    await course.destroy(); // This will soft delete due to paranoid: true

    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update course status
exports.updateCourseStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['DRAFT', 'PUBLISHED', 'ARCHIVED'];
    
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ 
        message: `Status must be one of: ${validStatuses.join(', ')}` 
      });
    }

    const course = await Course.findByPk(id);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    await course.update({ status });

    const updatedCourse = await Course.findByPk(id, {
      include: [
        {
          model: User,
          as: 'instructor',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    res.json({
      message: 'Course status updated successfully',
      course: updatedCourse
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add categories to course
exports.addCategoriesToCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { categoryIds } = req.body;

    if (!categoryIds || !Array.isArray(categoryIds) || categoryIds.length === 0) {
      return res.status(400).json({ 
        message: 'Category IDs array is required' 
      });
    }

    const course = await Course.findByPk(id);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Verify all categories exist
    const categories = await Category.findAll({
      where: { id: { [Op.in]: categoryIds } }
    });

    if (categories.length !== categoryIds.length) {
      return res.status(400).json({ 
        message: 'One or more category IDs are invalid' 
      });
    }

    // Remove existing categories
    await CourseCategory.destroy({
      where: { courseId: id }
    });

    // Add new categories
    const courseCategoryData = categoryIds.map(categoryId => ({
      courseId: id,
      categoryId: categoryId
    }));

    await CourseCategory.bulkCreate(courseCategoryData);

    // Fetch updated course with categories
    const updatedCourse = await Course.findByPk(id, {
      include: [
        {
          model: Category,
          through: { attributes: [] },
          attributes: ['id', 'name']
        }
      ]
    });

    res.json({
      message: 'Course categories updated successfully',
      course: updatedCourse
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add tags to course
exports.addTagsToCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { tagIds } = req.body;

    if (!tagIds || !Array.isArray(tagIds) || tagIds.length === 0) {
      return res.status(400).json({ 
        message: 'Tag IDs array is required' 
      });
    }

    const course = await Course.findByPk(id);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Verify all tags exist
    const tags = await Tag.findAll({
      where: { id: { [Op.in]: tagIds } }
    });

    if (tags.length !== tagIds.length) {
      return res.status(400).json({ 
        message: 'One or more tag IDs are invalid' 
      });
    }

    // Remove existing tags
    await CourseTag.destroy({
      where: { courseId: id }
    });

    // Add new tags
    const courseTagData = tagIds.map(tagId => ({
      courseId: id,
      tagId: tagId
    }));

    await CourseTag.bulkCreate(courseTagData);

    // Fetch updated course with tags
    const updatedCourse = await Course.findByPk(id, {
      include: [
        {
          model: Tag,
          through: { attributes: [] },
          attributes: ['id', 'name']
        }
      ]
    });

    res.json({
      message: 'Course tags updated successfully',
      course: updatedCourse
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// === COURSE ANALYTICS CONTROLLERS ===

// Get comprehensive course analytics
exports.getCourseAnalytics = async (req, res) => {
  try {
    const { id: courseId } = req.params;

    // Get course basic info
    const course = await Course.findByPk(courseId, {
      include: [
        {
          model: User,
          as: 'instructor',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Get enrollment statistics
    const enrollmentStats = await Enrollment.findAll({
      where: { courseId },
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('status')), 'count']
      ],
      group: ['status'],
      raw: true
    });

    // Get total enrollments
    const totalEnrollments = await Enrollment.count({
      where: { courseId }
    });

    // Get average progress
    const averageProgress = await Enrollment.findOne({
      where: { courseId },
      attributes: [
        [sequelize.fn('AVG', sequelize.col('progress')), 'avgProgress']
      ],
      raw: true
    });

    // Get completion rate
    const completedEnrollments = await Enrollment.count({
      where: { 
        courseId,
        status: 'COMPLETED'
      }
    });

    const completionRate = totalEnrollments > 0 ? (completedEnrollments / totalEnrollments) * 100 : 0;

    // Get review statistics
    const reviewStats = await Review.findAll({
      where: { courseId },
      attributes: [
        [sequelize.fn('COUNT', sequelize.col('id')), 'totalReviews'],
        [sequelize.fn('AVG', sequelize.col('rating')), 'averageRating']
      ],
      raw: true
    });

    // Get rating distribution
    const ratingDistribution = await Review.findAll({
      where: { courseId },
      attributes: [
        'rating',
        [sequelize.fn('COUNT', sequelize.col('rating')), 'count']
      ],
      group: ['rating'],
      order: [['rating', 'DESC']],
      raw: true
    });

    // Get monthly enrollment trends (last 12 months)
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const monthlyEnrollments = await Enrollment.findAll({
      where: {
        courseId,
        createdAt: {
          [Op.gte]: twelveMonthsAgo
        }
      },
      attributes: [
        [sequelize.fn('YEAR', sequelize.col('createdAt')), 'year'],
        [sequelize.fn('MONTH', sequelize.col('createdAt')), 'month'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'enrollments']
      ],
      group: [
        sequelize.fn('YEAR', sequelize.col('createdAt')),
        sequelize.fn('MONTH', sequelize.col('createdAt'))
      ],
      order: [
        [sequelize.fn('YEAR', sequelize.col('createdAt')), 'ASC'],
        [sequelize.fn('MONTH', sequelize.col('createdAt')), 'ASC']
      ],
      raw: true
    });

    // Format enrollment statistics
    const formattedEnrollmentStats = {
      ENROLLED: 0,
      COMPLETED: 0,
      DROPPED: 0
    };

    enrollmentStats.forEach(stat => {
      formattedEnrollmentStats[stat.status] = parseInt(stat.count);
    });

    const analytics = {
      courseInfo: {
        id: course.id,
        title: course.title,
        status: course.status,
        price: course.price,
        instructor: course.instructor
      },
      enrollmentStats: {
        total: totalEnrollments,
        byStatus: formattedEnrollmentStats,
        completionRate: Math.round(completionRate * 100) / 100,
        averageProgress: Math.round((averageProgress?.avgProgress || 0) * 100) / 100
      },
      reviewStats: {
        totalReviews: parseInt(reviewStats[0]?.totalReviews || 0),
        averageRating: Math.round((reviewStats[0]?.averageRating || 0) * 10) / 10,
        ratingDistribution: ratingDistribution.map(item => ({
          rating: item.rating,
          count: parseInt(item.count)
        }))
      },
      monthlyTrends: monthlyEnrollments.map(item => ({
        year: item.year,
        month: item.month,
        enrollments: parseInt(item.enrollments)
      }))
    };

    res.json({ analytics });
  } catch (error) {
    console.error('Course analytics error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get course enrollment trends
exports.getCourseEnrollmentTrends = async (req, res) => {
  try {
    const { id: courseId } = req.params;
    const { period = '12' } = req.query; // Default to 12 months

    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Calculate date range based on period
    const periodMonths = parseInt(period);
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - periodMonths);

    // Get enrollment trends by month
    const enrollmentTrends = await Enrollment.findAll({
      where: {
        courseId,
        createdAt: {
          [Op.gte]: startDate
        }
      },
      attributes: [
        [sequelize.fn('YEAR', sequelize.col('createdAt')), 'year'],
        [sequelize.fn('MONTH', sequelize.col('createdAt')), 'month'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'enrollments']
      ],
      group: [
        sequelize.fn('YEAR', sequelize.col('createdAt')),
        sequelize.fn('MONTH', sequelize.col('createdAt'))
      ],
      order: [
        [sequelize.fn('YEAR', sequelize.col('createdAt')), 'ASC'],
        [sequelize.fn('MONTH', sequelize.col('createdAt')), 'ASC']
      ],
      raw: true
    });

    // Get completion trends
    const completionTrends = await Enrollment.findAll({
      where: {
        courseId,
        status: 'COMPLETED',
        updatedAt: {
          [Op.gte]: startDate
        }
      },
      attributes: [
        [sequelize.fn('YEAR', sequelize.col('updatedAt')), 'year'],
        [sequelize.fn('MONTH', sequelize.col('updatedAt')), 'month'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'completions']
      ],
      group: [
        sequelize.fn('YEAR', sequelize.col('updatedAt')),
        sequelize.fn('MONTH', sequelize.col('updatedAt'))
      ],
      order: [
        [sequelize.fn('YEAR', sequelize.col('updatedAt')), 'ASC'],
        [sequelize.fn('MONTH', sequelize.col('updatedAt')), 'ASC']
      ],
      raw: true
    });

    // Get dropout trends
    const dropoutTrends = await Enrollment.findAll({
      where: {
        courseId,
        status: 'DROPPED',
        updatedAt: {
          [Op.gte]: startDate
        }
      },
      attributes: [
        [sequelize.fn('YEAR', sequelize.col('updatedAt')), 'year'],
        [sequelize.fn('MONTH', sequelize.col('updatedAt')), 'month'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'dropouts']
      ],
      group: [
        sequelize.fn('YEAR', sequelize.col('updatedAt')),
        sequelize.fn('MONTH', sequelize.col('updatedAt'))
      ],
      order: [
        [sequelize.fn('YEAR', sequelize.col('updatedAt')), 'ASC'],
        [sequelize.fn('MONTH', sequelize.col('updatedAt')), 'ASC']
      ],
      raw: true
    });

    const trends = {
      period: `${periodMonths} months`,
      enrollments: enrollmentTrends.map(item => ({
        year: item.year,
        month: item.month,
        count: parseInt(item.enrollments),
        monthName: new Date(item.year, item.month - 1).toLocaleString('default', { month: 'long' })
      })),
      completions: completionTrends.map(item => ({
        year: item.year,
        month: item.month,
        count: parseInt(item.completions),
        monthName: new Date(item.year, item.month - 1).toLocaleString('default', { month: 'long' })
      })),
      dropouts: dropoutTrends.map(item => ({
        year: item.year,
        month: item.month,
        count: parseInt(item.dropouts),
        monthName: new Date(item.year, item.month - 1).toLocaleString('default', { month: 'long' })
      }))
    };

    res.json({ trends });
  } catch (error) {
    console.error('Enrollment trends error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get course revenue analytics
exports.getCourseRevenue = async (req, res) => {
  try {
    const { id: courseId } = req.params;
    const { period = '12' } = req.query; // Default to 12 months

    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Calculate date range based on period
    const periodMonths = parseInt(period);
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - periodMonths);

    // Get total revenue from enrollments
    const totalEnrollments = await Enrollment.count({
      where: { courseId }
    });

    const totalRevenue = totalEnrollments * course.price;

    // Get revenue by month (based on enrollment date)
    const monthlyRevenue = await Enrollment.findAll({
      where: {
        courseId,
        createdAt: {
          [Op.gte]: startDate
        }
      },
      attributes: [
        [sequelize.fn('YEAR', sequelize.col('createdAt')), 'year'],
        [sequelize.fn('MONTH', sequelize.col('createdAt')), 'month'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'enrollments']
      ],
      group: [
        sequelize.fn('YEAR', sequelize.col('createdAt')),
        sequelize.fn('MONTH', sequelize.col('createdAt'))
      ],
      order: [
        [sequelize.fn('YEAR', sequelize.col('createdAt')), 'ASC'],
        [sequelize.fn('MONTH', sequelize.col('createdAt')), 'ASC']
      ],
      raw: true
    });

    // Calculate cumulative revenue
    let cumulativeRevenue = 0;
    const revenueData = monthlyRevenue.map(item => {
      const monthlyAmount = parseInt(item.enrollments) * course.price;
      cumulativeRevenue += monthlyAmount;
      
      return {
        year: item.year,
        month: item.month,
        monthName: new Date(item.year, item.month - 1).toLocaleString('default', { month: 'long' }),
        enrollments: parseInt(item.enrollments),
        revenue: monthlyAmount,
        cumulativeRevenue: cumulativeRevenue
      };
    });

    // Get revenue comparison with previous period
    const previousPeriodStart = new Date(startDate);
    previousPeriodStart.setMonth(previousPeriodStart.getMonth() - periodMonths);

    const previousPeriodEnrollments = await Enrollment.count({
      where: {
        courseId,
        createdAt: {
          [Op.gte]: previousPeriodStart,
          [Op.lt]: startDate
        }
      }
    });

    const previousPeriodRevenue = previousPeriodEnrollments * course.price;
    const currentPeriodEnrollments = await Enrollment.count({
      where: {
        courseId,
        createdAt: {
          [Op.gte]: startDate
        }
      }
    });

    const currentPeriodRevenue = currentPeriodEnrollments * course.price;
    const revenueGrowth = previousPeriodRevenue > 0 
      ? ((currentPeriodRevenue - previousPeriodRevenue) / previousPeriodRevenue) * 100 
      : 0;

    // Calculate average revenue per month
    const averageMonthlyRevenue = revenueData.length > 0 
      ? revenueData.reduce((sum, item) => sum + item.revenue, 0) / revenueData.length 
      : 0;

    const revenue = {
      courseInfo: {
        id: course.id,
        title: course.title,
        price: course.price
      },
      summary: {
        totalRevenue: totalRevenue,
        totalEnrollments: totalEnrollments,
        currentPeriodRevenue: currentPeriodRevenue,
        previousPeriodRevenue: previousPeriodRevenue,
        revenueGrowth: Math.round(revenueGrowth * 100) / 100,
        averageMonthlyRevenue: Math.round(averageMonthlyRevenue * 100) / 100
      },
      monthlyData: revenueData,
      period: `${periodMonths} months`
    };

    res.json({ revenue });
  } catch (error) {
    console.error('Course revenue error:', error);
    res.status(500).json({ message: error.message });
  }
};