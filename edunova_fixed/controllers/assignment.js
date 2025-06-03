const { Assignment, Lesson, Section, Course, User, Enrollment } = require('../models');
const { Op } = require('sequelize');

// Create assignment for lesson
exports.createAssignment = async (req, res) => {
  try {
    const { id } = req.params; // lesson ID
    const { title, description, dueDate, fileTypes } = req.body;

    // Validation
    if (!title || !dueDate) {
      return res.status(400).json({
        message: 'Assignment title and due date are required',
      });
    }

    if (!fileTypes || !Array.isArray(fileTypes) || fileTypes.length === 0) {
      return res.status(400).json({
        message: 'File types array is required and cannot be empty',
      });
    }

    // Validate file types
    const allowedFileTypes = ['pdf', 'doc', 'docx', 'txt', 'jpg', 'jpeg', 'png', 'zip', 'rar'];
    const invalidTypes = fileTypes.filter((type) => !allowedFileTypes.includes(type.toLowerCase()));

    if (invalidTypes.length > 0) {
      return res.status(400).json({
        message: `Invalid file types: ${invalidTypes.join(', ')}. Allowed types: ${allowedFileTypes.join(', ')}`,
      });
    }

    // Validate due date
    const dueDateObj = new Date(dueDate);
    if (dueDateObj <= new Date()) {
      return res.status(400).json({
        message: 'Due date must be in the future',
      });
    }

    // Check if lesson exists
    const lesson = await Lesson.findByPk(id, {
      include: [
        {
          model: Section,
          as: 'section',
          include: [
            {
              model: Course,
              as: 'course',
              attributes: ['id', 'instructorId'],
            },
          ],
        },
      ],
    });

    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    // Check if user is the course instructor or admin
    if (lesson.section.course.instructorId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'You are not authorized to create assignment for this lesson' });
    }

    // Check if assignment already exists for this lesson
    const existingAssignment = await Assignment.findOne({ where: { lessonId: id } });
    if (existingAssignment) {
      return res.status(400).json({ message: 'Assignment already exists for this lesson' });
    }

    // Create assignment
    const assignment = await Assignment.create({
      title,
      description: description || null,
      lessonId: id,
      dueDate: dueDateObj,
      fileTypes: fileTypes.map((type) => type.toLowerCase()),
    });

    res.status(201).json({
      message: 'Assignment created successfully',
      assignment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get assignment by ID
exports.getAssignmentById = async (req, res) => {
  try {
    const { id } = req.params;

    const assignment = await Assignment.findByPk(id, {
      include: [
        {
          model: Lesson,
          as: 'lesson',
          attributes: ['id', 'title'],
          include: [
            {
              model: Section,
              as: 'section',
              attributes: ['id', 'title'],
              include: [
                {
                  model: Course,
                  as: 'course',
                  attributes: ['id', 'title', 'instructorId'],
                },
              ],
            },
          ],
        },
      ],
    });

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    res.json({ assignment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update assignment
exports.updateAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, dueDate, fileTypes } = req.body;

    const assignment = await Assignment.findByPk(id, {
      include: [
        {
          model: Lesson,
          as: 'lesson',
          include: [
            {
              model: Section,
              as: 'section',
              include: [
                {
                  model: Course,
                  as: 'course',
                  attributes: ['instructorId'],
                },
              ],
            },
          ],
        },
      ],
    });

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    // Check authorization
    if (assignment.lesson.section.course.instructorId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'You are not authorized to update this assignment' });
    }

    // Build update data
    const updateData = {};

    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;

    if (dueDate !== undefined) {
      const dueDateObj = new Date(dueDate);
      if (dueDateObj <= new Date()) {
        return res.status(400).json({
          message: 'Due date must be in the future',
        });
      }
      updateData.dueDate = dueDateObj;
    }

    if (fileTypes !== undefined) {
      if (!Array.isArray(fileTypes) || fileTypes.length === 0) {
        return res.status(400).json({
          message: 'File types array is required and cannot be empty',
        });
      }

      // Validate file types
      const allowedFileTypes = ['pdf', 'doc', 'docx', 'txt', 'jpg', 'jpeg', 'png', 'zip', 'rar'];
      const invalidTypes = fileTypes.filter((type) => !allowedFileTypes.includes(type.toLowerCase()));

      if (invalidTypes.length > 0) {
        return res.status(400).json({
          message: `Invalid file types: ${invalidTypes.join(', ')}. Allowed types: ${allowedFileTypes.join(', ')}`,
        });
      }

      updateData.fileTypes = fileTypes.map((type) => type.toLowerCase());
    }

    await assignment.update(updateData);

    // Fetch updated assignment
    const updatedAssignment = await Assignment.findByPk(id, {
      include: [
        {
          model: Lesson,
          as: 'lesson',
          attributes: ['id', 'title'],
        },
      ],
    });

    res.json({
      message: 'Assignment updated successfully',
      assignment: updatedAssignment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// NEW: Get all assignments (Admin & Instructor only)
exports.getAllAssignments = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    const offset = (page - 1) * limit;

    // Build where clause
    let whereClause = {};
    let courseWhereClause = {};

    // If user is instructor, only show assignments from their courses
    if (req.user.role === 'INSTRUCTOR') {
      courseWhereClause.instructorId = req.user.id;
    }

    // Search functionality
    if (search) {
      whereClause.title = {
        [Op.like]: `%${search}%`,
      };
    }

    // Get assignments with pagination
    const { count, rows: assignments } = await Assignment.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Lesson,
          as: 'lesson',
          attributes: ['id', 'title', 'order'],
          include: [
            {
              model: Section,
              as: 'section',
              attributes: ['id', 'title', 'order'],
              include: [
                {
                  model: Course,
                  as: 'course',
                  where: courseWhereClause,
                  attributes: ['id', 'title', 'status', 'instructorId'],
                  include: [
                    {
                      model: User,
                      as: 'instructor',
                      attributes: ['id', 'name', 'email'],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['id', 'DESC']],
    });

    // Calculate pagination info
    const totalPages = Math.ceil(count / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    res.json({
      assignments,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: count,
        itemsPerPage: parseInt(limit),
        hasNextPage,
        hasPrevPage,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// NEW: Get assignments for specific course (Admin & Course Owner)
exports.getCourseAssignments = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { page = 1, limit = 10, search } = req.query;
    const offset = (page - 1) * limit;

    // Check if course exists
    const course = await Course.findByPk(courseId, {
      include: [
        {
          model: User,
          as: 'instructor',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check authorization - only course owner or admin can access
    if (course.instructorId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'You are not authorized to view assignments for this course' });
    }

    // Build where clause for search
    let assignmentWhereClause = {};
    if (search) {
      assignmentWhereClause.title = {
        [Op.like]: `%${search}%`,
      };
    }

    // Get assignments for the course
    const { count, rows: assignments } = await Assignment.findAndCountAll({
      where: assignmentWhereClause,
      include: [
        {
          model: Lesson,
          as: 'lesson',
          attributes: ['id', 'title', 'order'],
          include: [
            {
              model: Section,
              as: 'section',
              where: { courseId: courseId },
              attributes: ['id', 'title', 'order'],
            },
          ],
        },
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [
        [{ model: Lesson, as: 'lesson' }, { model: Section, as: 'section' }, 'order', 'ASC'],
        [{ model: Lesson, as: 'lesson' }, 'order', 'ASC'],
      ],
    });

    // Calculate pagination info
    const totalPages = Math.ceil(count / limit);

    res.json({
      course: {
        id: course.id,
        title: course.title,
        instructor: course.instructor,
      },
      assignments,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: count,
        itemsPerPage: parseInt(limit),
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// NEW: Get assignment for specific lesson (Public - for students who enrolled)
exports.getLessonAssignment = async (req, res) => {
  try {
    const { lessonId } = req.params;

    // Check if lesson exists
    const lesson = await Lesson.findByPk(lessonId, {
      include: [
        {
          model: Section,
          as: 'section',
          include: [
            {
              model: Course,
              as: 'course',
              attributes: ['id', 'title', 'instructorId'],
            },
          ],
        },
      ],
    });

    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    // For students, check if they are enrolled in the course
    if (req.user.role === 'STUDENT') {
      const enrollment = await Enrollment.findOne({
        where: {
          userId: req.user.id,
          courseId: lesson.section.course.id,
        },
      });

      if (!enrollment) {
        return res.status(403).json({ message: 'You must be enrolled in this course to view the assignment' });
      }
    }
    // For instructors, check if they own the course
    else if (req.user.role === 'INSTRUCTOR') {
      if (lesson.section.course.instructorId !== req.user.id) {
        return res.status(403).json({ message: 'You are not authorized to view this assignment' });
      }
    }
    // Admins have full access, no additional check needed

    // Find assignment for this lesson
    const assignment = await Assignment.findOne({
      where: { lessonId: lessonId },
      include: [
        {
          model: Lesson,
          as: 'lesson',
          attributes: ['id', 'title', 'order'],
          include: [
            {
              model: Section,
              as: 'section',
              attributes: ['id', 'title', 'order'],
              include: [
                {
                  model: Course,
                  as: 'course',
                  attributes: ['id', 'title'],
                },
              ],
            },
          ],
        },
      ],
    });

    if (!assignment) {
      return res.status(404).json({
        message: 'No assignment found for this lesson',
        lesson: {
          id: lesson.id,
          title: lesson.title,
          section: lesson.section.title,
          course: lesson.section.course.title,
        },
      });
    }

    res.json({ assignment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get available assignments for students
exports.getAvailableAssignments = async (req, res) => {
  try {
    // Only students can access this endpoint
    if (req.user.role !== 'STUDENT') {
      return res.status(403).json({ message: 'Only students can access this endpoint' });
    }

    const { Enrollment, Course, Section, Lesson } = require('../models');
    
    // Get courses where student is enrolled
    const enrollments = await Enrollment.findAll({
      where: { 
        userId: req.user.id
      },
      include: [
        {
          model: Course,
          as: 'course',
          include: [
            {
              model: Section,
              as: 'sections',
              include: [
                {
                  model: Lesson,
                  as: 'lessons',
                  include: [
                    {
                      model: Assignment,
                      as: 'assignment'
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });

    // Extract assignments from enrolled courses
    const assignments = [];
    enrollments.forEach(enrollment => {
      enrollment.course.sections.forEach(section => {
        section.lessons.forEach(lesson => {
          if (lesson.assignment) {
            // Check if assignment is not overdue
            const now = new Date();
            const dueDate = new Date(lesson.assignment.dueDate);
            const isOverdue = now > dueDate;

            assignments.push({
              id: lesson.assignment.id,
              title: lesson.assignment.title,
              description: lesson.assignment.description,
              dueDate: lesson.assignment.dueDate,
              totalPoints: 100, // Default points, adjust as needed
              course: {
                id: enrollment.course.id,
                title: enrollment.course.title
              },
              lessonId: lesson.id,
              status: isOverdue ? 'overdue' : 'available'
            });
          }
        });
      });
    });

    // Sort by due date (closest first)
    assignments.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

    res.json({ 
      assignments: assignments,
      message: `Found ${assignments.length} available assignments`
    });
  } catch (error) {
    console.error('Error in getAvailableAssignments:', error);
    res.status(500).json({ message: error.message });
  }
};
