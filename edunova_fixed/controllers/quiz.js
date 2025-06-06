const { Quiz, Question, Option, Lesson, Section, Course, User } = require('../models');
const { Op } = require('sequelize');

// Create quiz for lesson
exports.createQuiz = async (req, res) => {
  try {
    const { id } = req.params; // lesson ID
    const { title, timeLimit } = req.body;

    // Validation
    if (!title) {
      return res.status(400).json({
        message: 'Quiz title is required',
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
      return res.status(403).json({ message: 'You are not authorized to create quiz for this lesson' });
    }

    // Check if quiz already exists for this lesson
    const existingQuiz = await Quiz.findOne({ where: { lessonId: id } });
    if (existingQuiz) {
      return res.status(400).json({ message: 'Quiz already exists for this lesson' });
    }

    // Create quiz
    const quiz = await Quiz.create({
      title,
      lessonId: id,
      timeLimit: timeLimit || null,
    });

    res.status(201).json({
      message: 'Quiz created successfully',
      quiz,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get quiz by ID
exports.getQuizById = async (req, res) => {
  try {
    const { id } = req.params;

    const quiz = await Quiz.findByPk(id, {
      include: [
        {
          model: Question,
          as: 'Questions',
          include: [
            {
              model: Option,
              as: 'Options',
              attributes: ['id', 'text'],
            },
          ],
        },
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

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    res.json({ quiz });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update quiz
exports.updateQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, timeLimit } = req.body;

    const quiz = await Quiz.findByPk(id, {
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

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Check authorization
    if (quiz.lesson.section.course.instructorId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'You are not authorized to update this quiz' });
    }

    // Build update data
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (timeLimit !== undefined) updateData.timeLimit = timeLimit;

    await quiz.update(updateData);

    // Fetch updated quiz with relations
    const updatedQuiz = await Quiz.findByPk(id, {
      include: [
        {
          model: Question,
          as: 'Questions',
          include: [
            {
              model: Option,
              as: 'Options',
              attributes: ['id', 'text'],
            },
          ],
        },
      ],
    });

    res.json({
      message: 'Quiz updated successfully',
      quiz: updatedQuiz,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create question for quiz (single)
exports.createQuestion = async (req, res) => {
  try {
    const { id } = req.params; // quiz ID
    const { text, correctAnswer, points = 1 } = req.body;

    // Validation
    if (!text || !correctAnswer) {
      return res.status(400).json({
        message: 'Question text and correct answer are required',
      });
    }

    // Check if quiz exists and user has permission
    const quiz = await Quiz.findByPk(id, {
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

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Check authorization
    if (quiz.lesson.section.course.instructorId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'You are not authorized to add questions to this quiz' });
    }

    // Create question
    const question = await Question.create({
      text,
      quizId: id,
      correctAnswer,
      points: parseInt(points),
    });

    res.status(201).json({
      message: 'Question created successfully',
      question,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create multiple questions for quiz (bulk)
exports.createBulkQuestions = async (req, res) => {
  try {
    const { id } = req.params; // quiz ID
    const { questions } = req.body;

    // Validation
    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({
        message: 'Questions array is required and must not be empty',
      });
    }

    // Validate each question
    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      if (!question.text || !question.correctAnswer) {
        return res.status(400).json({
          message: `Question at index ${i}: text and correctAnswer are required`,
        });
      }

      // Set default points if not provided
      if (!question.points) {
        question.points = 1;
      }

      // Ensure points is a number
      question.points = parseInt(question.points);
      if (isNaN(question.points)) {
        return res.status(400).json({
          message: `Question at index ${i}: points must be a valid number`,
        });
      }
    }

    // Check if quiz exists and user has permission
    const quiz = await Quiz.findByPk(id, {
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

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Check authorization
    if (quiz.lesson.section.course.instructorId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'You are not authorized to add questions to this quiz' });
    }

    // Prepare questions data for bulk insert
    const questionsData = questions.map((question) => ({
      text: question.text,
      quizId: parseInt(id),
      correctAnswer: question.correctAnswer,
      points: question.points,
    }));

    // Create questions in bulk
    const createdQuestions = await Question.bulkCreate(questionsData, {
      returning: true, // This will return the created records
    });

    res.status(201).json({
      message: `${createdQuestions.length} questions created successfully`,
      questions: createdQuestions,
      count: createdQuestions.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update question
exports.updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { text, correctAnswer, points } = req.body;

    const question = await Question.findByPk(id, {
      include: [
        {
          model: Quiz,
          as: 'quiz',
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
        },
      ],
    });

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Check authorization
    if (question.quiz.lesson.section.course.instructorId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'You are not authorized to update this question' });
    }

    // Build update data
    const updateData = {};
    if (text !== undefined) updateData.text = text;
    if (correctAnswer !== undefined) updateData.correctAnswer = correctAnswer;
    if (points !== undefined) updateData.points = parseInt(points);

    await question.update(updateData);

    // Fetch updated question with options
    const updatedQuestion = await Question.findByPk(id, {
      include: [
        {
          model: Option,
          as: 'Options',
          attributes: ['id', 'text'],
        },
      ],
    });

    res.json({
      message: 'Question updated successfully',
      question: updatedQuestion,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create multiple options for question (bulk)
exports.createBulkOptions = async (req, res) => {
  try {
    const { id } = req.params; // question ID
    const { options } = req.body;

    // Validation
    if (!options || !Array.isArray(options) || options.length === 0) {
      return res.status(400).json({
        message: 'Options array is required and must not be empty',
      });
    }

    // Validate each option
    for (let i = 0; i < options.length; i++) {
      const option = options[i];
      if (!option.text || typeof option.text !== 'string' || option.text.trim() === '') {
        return res.status(400).json({
          message: `Option at index ${i}: text is required and must be a non-empty string`,
        });
      }
    }

    // Check if question exists and user has permission
    const question = await Question.findByPk(id, {
      include: [
        {
          model: Quiz,
          as: 'quiz',
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
        },
      ],
    });

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Check authorization
    if (question.quiz.lesson.section.course.instructorId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'You are not authorized to add options to this question' });
    }

    // Prepare options data for bulk insert
    const optionsData = options.map((option) => ({
      text: option.text.trim(),
      questionId: parseInt(id),
    }));

    // Create options in bulk
    const createdOptions = await Option.bulkCreate(optionsData, {
      returning: true, // This will return the created records
    });

    res.status(201).json({
      message: `${createdOptions.length} options created successfully`,
      options: createdOptions,
      count: createdOptions.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create options for multiple questions (bulk)
exports.createOptionsForMultipleQuestions = async (req, res) => {
  try {
    const { id } = req.params; // quiz ID
    const { questionsWithOptions } = req.body;

    // Validation
    if (!questionsWithOptions || !Array.isArray(questionsWithOptions) || questionsWithOptions.length === 0) {
      return res.status(400).json({
        message: 'questionsWithOptions array is required and must not be empty',
      });
    }

    // Validate structure
    for (let i = 0; i < questionsWithOptions.length; i++) {
      const item = questionsWithOptions[i];
      if (!item.questionId || !item.options || !Array.isArray(item.options) || item.options.length === 0) {
        return res.status(400).json({
          message: `Item at index ${i}: questionId and options array are required`,
        });
      }

      // Validate each option
      for (let j = 0; j < item.options.length; j++) {
        const option = item.options[j];
        if (!option.text || typeof option.text !== 'string' || option.text.trim() === '') {
          return res.status(400).json({
            message: `Item at index ${i}, option at index ${j}: text is required and must be a non-empty string`,
          });
        }
      }
    }

    // Check if quiz exists and user has permission
    const quiz = await Quiz.findByPk(id, {
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
        {
          model: Question,
          as: 'Questions',
          attributes: ['id'],
        },
      ],
    });

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Check authorization
    if (quiz.lesson.section.course.instructorId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'You are not authorized to add options to questions in this quiz' });
    }

    // Validate that all questionIds belong to this quiz
    const quizQuestionIds = quiz.Questions.map((q) => q.id);
    const requestedQuestionIds = questionsWithOptions.map((item) => parseInt(item.questionId));
    const invalidQuestionIds = requestedQuestionIds.filter((qId) => !quizQuestionIds.includes(qId));

    if (invalidQuestionIds.length > 0) {
      return res.status(400).json({
        message: `Invalid question IDs: ${invalidQuestionIds.join(', ')}. These questions don't belong to this quiz.`,
      });
    }

    // Prepare all options data for bulk insert
    let allOptionsData = [];
    let createdOptionsCount = 0;

    for (const item of questionsWithOptions) {
      const optionsData = item.options.map((option) => ({
        text: option.text.trim(),
        questionId: parseInt(item.questionId),
      }));

      allOptionsData = allOptionsData.concat(optionsData);
      createdOptionsCount += optionsData.length;
    }

    // Create all options in bulk
    const createdOptions = await Option.bulkCreate(allOptionsData, {
      returning: true,
    });

    // Group options by questionId for response
    const optionsByQuestion = {};
    createdOptions.forEach((option) => {
      if (!optionsByQuestion[option.questionId]) {
        optionsByQuestion[option.questionId] = [];
      }
      optionsByQuestion[option.questionId].push(option);
    });

    res.status(201).json({
      message: `${createdOptions.length} options created successfully for ${questionsWithOptions.length} questions`,
      optionsByQuestion,
      totalOptionsCreated: createdOptions.length,
      questionsCount: questionsWithOptions.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all quizzes (Admin & Instructor only)
exports.getAllQuizzes = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const offset = (page - 1) * limit;

    // Build where condition based on user role
    let whereCondition = {};
    let includeCondition = [
      {
        model: Question,
        as: 'Questions',
        include: [
          {
            model: Option,
            as: 'Options',
            attributes: ['id', 'text'],
          },
        ],
      },
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
    ];

    // If user is instructor (not admin), filter by their courses only
    if (req.user.role === 'INSTRUCTOR') {
      includeCondition[1].include[0].include[0].where = {
        instructorId: req.user.id,
      };

      includeCondition[1].include[0].include[0].required = true;
      includeCondition[1].include[0].required = true;
      includeCondition[1].required = true;
    }

    // Add search functionality
    if (search) {
      whereCondition = {
        [Op.or]: [{ title: { [Op.like]: `%${search}%` } }, { '$lesson.title$': { [Op.like]: `%${search}%` } }, { '$lesson.section.course.title$': { [Op.like]: `%${search}%` } }],
      };
    }

    const { count, rows: quizzes } = await Quiz.findAndCountAll({
      where: whereCondition,
      include: includeCondition,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['id', 'DESC']],
      distinct: true,
      subQuery: false,
    });

    // Double check: filter results on the application level for extra security
    const filteredQuizzes = req.user.role === 'INSTRUCTOR' ? quizzes.filter((quiz) => quiz.lesson?.section?.course?.instructorId === req.user.id) : quizzes;

    res.json({
      quizzes: filteredQuizzes,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
        totalItems: count,
        itemsPerPage: parseInt(limit),
      },
    });
  } catch (error) {
    console.error('Error in getAllQuizzes:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get quizzes for specific course (Admin & Course Owner)
exports.getCourseQuizzes = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { page = 1, limit = 10 } = req.query;
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

    // Check authorization - instructor can only access their own courses
    if (req.user.role === 'INSTRUCTOR' && course.instructorId !== req.user.id) {
      return res.status(403).json({
        message: 'You are not authorized to access quizzes for this course',
      });
    }

    // First, get all sections for this course
    const sections = await Section.findAll({
      where: { courseId: parseInt(courseId) },
      attributes: ['id'],
    });

    if (sections.length === 0) {
      return res.json({
        course: {
          id: course.id,
          title: course.title,
          instructor: course.instructor,
        },
        quizzes: [],
        pagination: {
          currentPage: parseInt(page),
          totalPages: 0,
          totalItems: 0,
          itemsPerPage: parseInt(limit),
        },
      });
    }

    const sectionIds = sections.map((section) => section.id);

    // Then get all lessons in those sections
    const lessons = await Lesson.findAll({
      where: { sectionId: { [Op.in]: sectionIds } },
      attributes: ['id'],
    });

    if (lessons.length === 0) {
      return res.json({
        course: {
          id: course.id,
          title: course.title,
          instructor: course.instructor,
        },
        quizzes: [],
        pagination: {
          currentPage: parseInt(page),
          totalPages: 0,
          totalItems: 0,
          itemsPerPage: parseInt(limit),
        },
      });
    }

    const lessonIds = lessons.map((lesson) => lesson.id);

    // Finally, get quizzes for those lessons
    const { count, rows: quizzes } = await Quiz.findAndCountAll({
      where: { lessonId: { [Op.in]: lessonIds } },
      include: [
        {
          model: Question,
          as: 'Questions',
          include: [
            {
              model: Option,
              as: 'Options',
              attributes: ['id', 'text'],
            },
          ],
        },
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
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [
        [{ model: Lesson, as: 'lesson' }, { model: Section, as: 'section' }, 'order', 'ASC'],
        [{ model: Lesson, as: 'lesson' }, 'order', 'ASC'],
      ],
      distinct: true,
    });

    res.json({
      course: {
        id: course.id,
        title: course.title,
        instructor: course.instructor,
      },
      quizzes,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
        totalItems: count,
        itemsPerPage: parseInt(limit),
      },
    });
  } catch (error) {
    console.error('Error fetching course quizzes:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get quiz for specific lesson (Public - untuk students yang sudah enroll)
exports.getLessonQuiz = async (req, res) => {
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

    // Check enrollment for students (skip for admin and course instructor)
    if (req.user.role === 'STUDENT') {
      // Note: Assuming Enrollment model exists based on the models/index.js associations
      // If not implemented yet, this will be empty but structure is ready
      const enrollment = await lesson.section.course
        .getEnrollments({
          where: { userId: req.user.id },
          limit: 1,
        })
        .catch(() => null); // Catch error if Enrollment not fully implemented

      if (!enrollment || enrollment.length === 0) {
        return res.status(403).json({
          message: 'You must be enrolled in this course to access the quiz',
        });
      }
    } else if (req.user.role === 'INSTRUCTOR' && lesson.section.course.instructorId !== req.user.id) {
      // Instructor can only access their own course quizzes
      return res.status(403).json({
        message: 'You are not authorized to access this quiz',
      });
    }

    // Get quiz for the lesson
    const quiz = await Quiz.findOne({
      where: { lessonId: lessonId },
      include: [
        {
          model: Question,
          as: 'Questions',
          include: [
            {
              model: Option,
              as: 'Options',
              attributes: req.user.role === 'STUDENT' ? ['id', 'text'] : ['id', 'text'],
              // Note: For students, we might want to hide correct answers in options
              // This can be enhanced later when taking quiz vs reviewing quiz
            },
          ],
        },
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
                  attributes: ['id', 'title'],
                },
              ],
            },
          ],
        },
      ],
    });

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found for this lesson' });
    }

    // For students, we might want to hide correct answers
    // This is a basic implementation - can be enhanced based on quiz submission status
    if (req.user.role === 'STUDENT') {
      // Remove correctAnswer from questions for students
      quiz.Questions = quiz.Questions.map((question) => {
        const { correctAnswer, ...questionWithoutAnswer } = question.toJSON();
        return questionWithoutAnswer;
      });
    }

    res.json({
      quiz,
      lesson: {
        id: lesson.id,
        title: lesson.title,
        section: {
          id: lesson.section.id,
          title: lesson.section.title,
          course: {
            id: lesson.section.course.id,
            title: lesson.section.course.title,
          },
        },
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get available quizzes for students
exports.getAvailableQuizzes = async (req, res) => {
  try {
    // Only students can access this endpoint
    if (req.user.role !== 'STUDENT') {
      return res.status(403).json({ message: 'Only students can access this endpoint' });
    }

    const { Enrollment, Course, Section, Lesson } = require('../models');

    // Get courses where student is enrolled
    const enrollments = await Enrollment.findAll({
      where: {
        userId: req.user.id,
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
                      model: Quiz,
                      as: 'quiz',
                      include: [
                        {
                          model: Question,
                          as: 'Questions',
                          attributes: ['id'],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    });

    // Extract quizzes from enrolled courses
    const quizzes = [];
    enrollments.forEach((enrollment) => {
      enrollment.course.sections.forEach((section) => {
        section.lessons.forEach((lesson) => {
          if (lesson.quiz) {
            quizzes.push({
              id: lesson.quiz.id,
              title: lesson.quiz.title,
              description: `Quiz for ${lesson.title}`,
              timeLimit: lesson.quiz.timeLimit,
              totalPoints: lesson.quiz.Questions ? lesson.quiz.Questions.length : 0,
              course: {
                id: enrollment.course.id,
                title: enrollment.course.title,
              },
              lessonId: lesson.id,
            });
          }
        });
      });
    });

    res.json({
      quizzes: quizzes,
      message: `Found ${quizzes.length} available quizzes`,
    });
  } catch (error) {
    console.error('Error in getAvailableQuizzes:', error);
    res.status(500).json({ message: error.message });
  }
};

// For instructor course only
exports.getInstructorCourses = async (req, res) => {
  try {
    const { Course, Section, Lesson, User } = require('../models');

    // Only instructors can access this endpoint
    if (req.user.role !== 'INSTRUCTOR' && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Access denied. Only instructors can access this endpoint.' });
    }

    let courses;

    if (req.user.role === 'ADMIN') {
      // Admin can see all courses
      courses = await Course.findAll({
        attributes: ['id', 'title', 'instructorId'],
        include: [
          {
            model: User,
            as: 'instructor', 
            attributes: ['id', 'name', 'email'],
          },
          {
            model: Section,
            as: 'Sections', 
            attributes: ['id', 'title', 'order'],
            include: [
              {
                model: Lesson,
                as: 'Lessons', 
                attributes: ['id', 'title', 'order'],
              },
            ],
          },
        ],
        order: [['id', 'DESC']],
      });
    } else {
      // Instructor can only see their own courses
      courses = await Course.findAll({
        where: {
          instructorId: req.user.id,
        },
        attributes: ['id', 'title', 'instructorId'],
        include: [
          {
            model: User,
            as: 'instructor', 
            attributes: ['id', 'name', 'email'],
          },
          {
            model: Section,
            as: 'Sections', 
            attributes: ['id', 'title', 'order'],
            include: [
              {
                model: Lesson,
                as: 'Lessons', 
                attributes: ['id', 'title', 'order'],
              },
            ],
          },
        ],
        order: [['id', 'DESC']],
      });
    }

    res.json({
      courses: courses,
      message: `Found ${courses.length} courses`,
    });
  } catch (error) {
    console.error('Error in getInstructorCourses:', error);
    res.status(500).json({ message: error.message });
  }
};
