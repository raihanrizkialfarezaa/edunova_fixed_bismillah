const { 
  Quiz, 
  Assignment, 
  QuizSubmission, 
  AssignmentSubmission, 
  Question, 
  Option, 
  Lesson, 
  Section, 
  Course, 
  User,
  Enrollment 
} = require('../models');
const { 
  uploadAssignmentDocument, 
  uploadAssignmentImage, 
  generatePdfViewUrl, 
  generateDownloadUrl 
} = require('../config/cloudinary');
const multer = require('multer');
const { Op } = require('sequelize');

// Configure multer for file upload
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow specific file types for assignments
    const allowedTypes = ['pdf', 'doc', 'docx', 'txt', 'jpg', 'jpeg', 'png', 'zip', 'rar'];
    const fileExtension = file.originalname.split('.').pop().toLowerCase();
    
    if (allowedTypes.includes(fileExtension)) {
      cb(null, true);
    } else {
      cb(new Error(`File type .${fileExtension} is not allowed. Allowed types: ${allowedTypes.join(', ')}`), false);
    }
  }
});

// Get Quiz for Taking (with questions and options, but without correct answers)
exports.getQuizForTaking = async (req, res) => {
  try {
    const { id } = req.params; // quiz ID

    // Check if quiz exists
    const quiz = await Quiz.findByPk(id, {
      include: [
        {
          model: Question,
          as: 'Questions',
          attributes: ['id', 'text', 'points'], // Exclude correctAnswer
          include: [
            {
              model: Option,
              as: 'Options',
              attributes: ['id', 'text']
            }
          ]
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
                  attributes: ['id', 'title']
                }
              ]
            }
          ]
        }
      ]
    });

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Check if user is enrolled in the course
    const enrollment = await Enrollment.findOne({
      where: {
        userId: req.user.id,
        courseId: quiz.lesson.section.course.id,
        status: 'ENROLLED'
      }
    });

    if (!enrollment) {
      return res.status(403).json({ message: 'You must be enrolled in this course to take this quiz' });
    }

    // Check if user has already submitted this quiz
    const existingSubmission = await QuizSubmission.findOne({
      where: {
        userId: req.user.id,
        quizId: id
      }
    });

    if (existingSubmission) {
      return res.status(400).json({ 
        message: 'You have already submitted this quiz',
        submission: {
          id: existingSubmission.id,
          score: existingSubmission.score,
          status: existingSubmission.status,
          submittedAt: existingSubmission.submittedAt
        }
      });
    }

    // Return quiz data for taking
    res.json({
      quiz: {
        id: quiz.id,
        title: quiz.title,
        timeLimit: quiz.timeLimit,
        lesson: quiz.lesson,
        questions: quiz.Questions.map(question => ({
          id: question.id,
          text: question.text,
          points: question.points,
          options: question.Options.map(option => ({
            id: option.id,
            text: option.text
          }))
        }))
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Submit Quiz
exports.submitQuiz = async (req, res) => {
  try {
    const { id } = req.params; // quiz ID
    const { answers } = req.body; // Array of {questionId, selectedOptionId}

    // Validation
    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ 
        message: 'Answers array is required and must not be empty' 
      });
    }

    // Validate answer format
    for (const answer of answers) {
      if (!answer.questionId || !answer.selectedOptionId) {
        return res.status(400).json({ 
          message: 'Each answer must have questionId and selectedOptionId' 
        });
      }
    }

    // Check if quiz exists
    const quiz = await Quiz.findByPk(id, {
      include: [
        {
          model: Question,
          as: 'Questions',
          include: [
            {
              model: Option,
              as: 'Options',
              attributes: ['id', 'text']
            }
          ]
        },
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
                  attributes: ['id', 'title']
                }
              ]
            }
          ]
        }
      ]
    });

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Check if user is enrolled in the course
    const enrollment = await Enrollment.findOne({
      where: {
        userId: req.user.id,
        courseId: quiz.lesson.section.course.id,
        status: 'ENROLLED'
      }
    });

    if (!enrollment) {
      return res.status(403).json({ message: 'You must be enrolled in this course to submit quiz' });
    }

    // Check if user has already submitted this quiz
    const existingSubmission = await QuizSubmission.findOne({
      where: {
        userId: req.user.id,
        quizId: id
      }
    });

    if (existingSubmission) {
      return res.status(400).json({ message: 'You have already submitted this quiz' });
    }

    // Validate answers against quiz questions
    const questionIds = quiz.Questions.map(q => q.id);
    const submittedQuestionIds = answers.map(a => parseInt(a.questionId));
    
    // Check if all questions are answered
    const missingQuestions = questionIds.filter(qId => !submittedQuestionIds.includes(qId));
    if (missingQuestions.length > 0) {
      return res.status(400).json({ 
        message: `Missing answers for question IDs: ${missingQuestions.join(', ')}` 
      });
    }

    // Check for invalid question IDs
    const invalidQuestions = submittedQuestionIds.filter(qId => !questionIds.includes(qId));
    if (invalidQuestions.length > 0) {
      return res.status(400).json({ 
        message: `Invalid question IDs: ${invalidQuestions.join(', ')}` 
      });
    }

    // Validate selected option IDs
    for (const answer of answers) {
      const question = quiz.Questions.find(q => q.id === parseInt(answer.questionId));
      const selectedOption = question.Options.find(opt => opt.id === parseInt(answer.selectedOptionId));
      
      if (!selectedOption) {
        return res.status(400).json({ 
          message: `Invalid option ID ${answer.selectedOptionId} for question ${answer.questionId}` 
        });
      }
    }

    // Auto-grade the quiz
    let earnedPoints = 0;
    let totalPoints = 0;
    
    for (const question of quiz.Questions) {
      totalPoints += question.points;
      const userAnswer = answers.find(a => parseInt(a.questionId) === question.id);
      
      if (userAnswer) {
        // Find the selected option text to compare with correct answer
        const selectedOption = question.Options.find(opt => opt.id === parseInt(userAnswer.selectedOptionId));
        
        if (selectedOption && selectedOption.text === question.correctAnswer) {
          earnedPoints += question.points;
        }
      }
    }

    const score = totalPoints > 0 ? (earnedPoints / totalPoints) * 100 : 0;

    // Create submission
    const submission = await QuizSubmission.create({
      userId: req.user.id,
      quizId: id,
      answers: answers, // Store as [{questionId, selectedOptionId}]
      score: score,
      totalPoints: totalPoints,
      earnedPoints: earnedPoints,
      status: 'GRADED', // Auto-graded
      gradedAt: new Date(),
      gradedBy: null // Auto-graded, no specific grader
    });

    res.status(201).json({
      message: 'Quiz submitted and graded successfully',
      submission: {
        id: submission.id,
        score: submission.score,
        earnedPoints: submission.earnedPoints,
        totalPoints: submission.totalPoints,
        status: submission.status,
        submittedAt: submission.submittedAt
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Quiz Results (after submission - with correct answers)
exports.getQuizResults = async (req, res) => {
  try {
    const { id } = req.params; // quiz ID

    // Find user's submission
    const submission = await QuizSubmission.findOne({
      where: {
        userId: req.user.id,
        quizId: id
      },
      include: [
        {
          model: Quiz,
          as: 'quiz',
          attributes: ['id', 'title', 'timeLimit'],
          include: [
            {
              model: Question,
              as: 'Questions',
              attributes: ['id', 'text', 'correctAnswer', 'points'],
              include: [
                {
                  model: Option,
                  as: 'Options',
                  attributes: ['id', 'text']
                }
              ]
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
                      attributes: ['id', 'title']
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });

    if (!submission) {
      return res.status(404).json({ message: 'Quiz submission not found' });
    }

    // Build detailed results
    const results = {
      submission: {
        id: submission.id,
        score: submission.score,
        earnedPoints: submission.earnedPoints,
        totalPoints: submission.totalPoints,
        status: submission.status,
        submittedAt: submission.submittedAt,
        gradedAt: submission.gradedAt,
        feedback: submission.feedback
      },
      quiz: {
        id: submission.quiz.id,
        title: submission.quiz.title,
        timeLimit: submission.quiz.timeLimit,
        lesson: submission.quiz.lesson
      },
      questions: submission.quiz.Questions.map(question => {
        // Find user's answer for this question
        const userAnswer = submission.answers.find(
          answer => parseInt(answer.questionId) === question.id
        );
        
        // Find selected option
        const selectedOption = userAnswer 
          ? question.Options.find(opt => opt.id === parseInt(userAnswer.selectedOptionId))
          : null;
        
        // Find correct option
        const correctOption = question.Options.find(opt => opt.text === question.correctAnswer);
        
        // Check if answer is correct
        const isCorrect = selectedOption && selectedOption.text === question.correctAnswer;

        return {
          id: question.id,
          text: question.text,
          points: question.points,
          correctAnswer: question.correctAnswer,
          userAnswer: {
            selectedOptionId: userAnswer ? parseInt(userAnswer.selectedOptionId) : null,
            selectedOptionText: selectedOption ? selectedOption.text : null,
            isCorrect: isCorrect,
            pointsEarned: isCorrect ? question.points : 0
          },
          options: question.Options.map(option => ({
            id: option.id,
            text: option.text,
            isCorrect: option.id === correctOption?.id,
            isSelected: selectedOption ? option.id === selectedOption.id : false
          }))
        };
      })
    };

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Submit Assignment (with file upload) - FIXED VERSION with proper PDF handling
exports.submitAssignment = [
  upload.single('file'),
  async (req, res) => {
    try {
      const { id } = req.params; // assignment ID
      const { description } = req.body;

      if (!req.file) {
        return res.status(400).json({ message: 'File is required for assignment submission' });
      }

      // Check if assignment exists
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
                    attributes: ['id', 'title']
                  }
                ]
              }
            ]
          }
        ]
      });

      if (!assignment) {
        return res.status(404).json({ message: 'Assignment not found' });
      }

      // Check if user is enrolled in the course
      const enrollment = await Enrollment.findOne({
        where: {
          userId: req.user.id,
          courseId: assignment.lesson.section.course.id,
          status: 'ENROLLED'
        }
      });

      if (!enrollment) {
        return res.status(403).json({ message: 'You must be enrolled in this course to submit assignment' });
      }

      // Check if user has already submitted this assignment
      const existingSubmission = await AssignmentSubmission.findOne({
        where: {
          userId: req.user.id,
          assignmentId: id
        }
      });

      if (existingSubmission) {
        return res.status(400).json({ message: 'You have already submitted this assignment' });
      }

      // Validate file type against assignment requirements
      const fileExtension = req.file.originalname.split('.').pop().toLowerCase();
      if (!assignment.fileTypes.includes(fileExtension)) {
        return res.status(400).json({ 
          message: `File type .${fileExtension} is not allowed. Allowed types: ${assignment.fileTypes.join(', ')}` 
        });
      }

      // Check if submission is late
      const now = new Date();
      const isLate = now > new Date(assignment.dueDate);

      try {
        let uploadResult;
        let viewUrl;
        let downloadUrl;

        // Choose appropriate upload function based on file type
        const imageTypes = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
        const uploadOptions = {
          folder: 'edunova/assignments',
          public_id: `assignment_${id}_user_${req.user.id}_${Date.now()}`,
          originalName: req.file.originalname,
          description: `Assignment submission by user ${req.user.id}`
        };

        if (imageTypes.includes(fileExtension)) {
          // Upload as public image
          uploadResult = await uploadAssignmentImage(req.file.buffer, uploadOptions);
          viewUrl = uploadResult.secure_url;
          downloadUrl = generateDownloadUrl(uploadResult.public_id, 'image');
        } else {
          // Upload as document (including PDFs)
          uploadResult = await uploadAssignmentDocument(req.file.buffer, uploadOptions);
          
          if (fileExtension === 'pdf') {
            // Generate proper PDF view URL
            viewUrl = generatePdfViewUrl(uploadResult.public_id);
            downloadUrl = generateDownloadUrl(uploadResult.public_id, 'image');
          } else {
            // For other document types
            viewUrl = uploadResult.secure_url;
            downloadUrl = generateDownloadUrl(uploadResult.public_id, 'raw');
          }
        }

        // Create submission
        const submission = await AssignmentSubmission.create({
          userId: req.user.id,
          assignmentId: id,
          fileUrl: viewUrl, // Use the viewable URL
          fileName: req.file.originalname,
          fileType: fileExtension,
          fileSize: req.file.size,
          cloudinaryPublicId: uploadResult.public_id,
          description: description || null,
          isLate: isLate,
          status: isLate ? 'LATE_SUBMITTED' : 'SUBMITTED',
          // Store additional URLs for different purposes
          downloadUrl: downloadUrl
        });

        res.status(201).json({
          message: 'Assignment submitted successfully',
          submission: {
            id: submission.id,
            fileName: submission.fileName,
            fileType: submission.fileType,
            fileSize: submission.fileSize,
            fileUrl: submission.fileUrl, // Viewable URL
            downloadUrl: submission.downloadUrl, // Download URL
            description: submission.description,
            isLate: submission.isLate,
            status: submission.status,
            submittedAt: submission.submittedAt
          }
        });
      } catch (uploadError) {
        console.error('File upload error:', uploadError);
        return res.status(500).json({ 
          message: 'Failed to upload file. Please try again.',
          error: process.env.NODE_ENV === 'development' ? uploadError.message : 'Upload failed'
        });
      }
    } catch (error) {
      console.error('Assignment submission error:', error);
      res.status(500).json({ message: error.message });
    }
  }
];

// Get Submission by ID
exports.getSubmissionById = async (req, res) => {
  try {
    const { id } = req.params;
    const { type } = req.query; // 'quiz' or 'assignment'

    if (!type || !['quiz', 'assignment'].includes(type)) {
      return res.status(400).json({ message: 'Type parameter is required (quiz or assignment)' });
    }

    let submission;

    if (type === 'quiz') {
      submission = await QuizSubmission.findByPk(id, {
        include: [
          {
            model: User,
            as: 'student', // Use the correct alias
            attributes: ['id', 'name', 'email']
          },
          {
            model: User,
            as: 'grader', // Use the correct alias
            attributes: ['id', 'name', 'email']
          },
          {
            model: Quiz,
            as: 'quiz',
            attributes: ['id', 'title'],
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
                        attributes: ['id', 'title', 'instructorId']
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      });

      if (submission) {
        // Check authorization for quiz
        const isOwner = submission.userId === req.user.id;
        const isInstructor = submission.quiz.lesson.section.course.instructorId === req.user.id;
        const isAdmin = req.user.role === 'ADMIN';

        if (!isOwner && !isInstructor && !isAdmin) {
          return res.status(403).json({ message: 'You are not authorized to view this submission' });
        }
      }
    } else {
      submission = await AssignmentSubmission.findByPk(id, {
        include: [
          {
            model: User,
            as: 'student', // Use the correct alias for the student
            attributes: ['id', 'name', 'email']
          },
          {
            model: User,
            as: 'grader', // Use the correct alias for the grader
            attributes: ['id', 'name', 'email']
          },
          {
            model: Assignment,
            as: 'assignment',
            attributes: ['id', 'title', 'dueDate'],
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
                        attributes: ['id', 'title', 'instructorId']
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      });

      if (submission) {
        // Check authorization for assignment
        const isOwner = submission.userId === req.user.id;
        const isInstructor = submission.assignment.lesson.section.course.instructorId === req.user.id;
        const isAdmin = req.user.role === 'ADMIN';

        if (!isOwner && !isInstructor && !isAdmin) {
          return res.status(403).json({ message: 'You are not authorized to view this submission' });
        }
      }
    }

    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    res.json({ submission });
  } catch (error) {
    console.error('Error in getSubmissionById:', error);
    res.status(500).json({ message: error.message });
  }
};

// Grade Submission
exports.gradeSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    const { type } = req.query; // 'quiz' or 'assignment'
    const { score, feedback } = req.body;

    if (!type || !['quiz', 'assignment'].includes(type)) {
      return res.status(400).json({ message: 'Type parameter is required (quiz or assignment)' });
    }

    if (score === undefined || score === null) {
      return res.status(400).json({ message: 'Score is required' });
    }

    let submission;

    if (type === 'quiz') {
      submission = await QuizSubmission.findByPk(id, {
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
                        attributes: ['instructorId']
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      });

      // Validate score for quiz (0-100)
      if (score < 0 || score > 100) {
        return res.status(400).json({ message: 'Quiz score must be between 0 and 100' });
      }
    } else {
      submission = await AssignmentSubmission.findByPk(id, {
        include: [
          {
            model: Assignment,
            as: 'assignment',
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
                        attributes: ['instructorId']
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      });

      // Validate score for assignment (0 to maxScore)
      if (score < 0 || score > submission.maxScore) {
        return res.status(400).json({ 
          message: `Assignment score must be between 0 and ${submission.maxScore}` 
        });
      }
    }

    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    // Check authorization
    const courseInstructorId = type === 'quiz' 
      ? submission.quiz.lesson.section.course.instructorId
      : submission.assignment.lesson.section.course.instructorId;

    if (courseInstructorId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'You are not authorized to grade this submission' });
    }

    // Update submission
    await submission.update({
      score: parseFloat(score),
      feedback: feedback || null,
      status: 'GRADED',
      gradedAt: new Date(),
      gradedBy: req.user.id
    });

    // Fetch updated submission with relations
    const updatedSubmission = type === 'quiz' 
      ? await QuizSubmission.findByPk(id, {
          include: [
            {
              model: User,
              as: 'student', // Use correct alias
              attributes: ['id', 'name', 'email']
            },
            {
              model: User,
              as: 'grader', // Use correct alias
              attributes: ['id', 'name', 'email']
            }
          ]
        })
      : await AssignmentSubmission.findByPk(id, {
          include: [
            {
              model: User,
              as: 'student', // Use correct alias
              attributes: ['id', 'name', 'email']
            },
            {
              model: User,
              as: 'grader', // Use correct alias
              attributes: ['id', 'name', 'email']
            }
          ]
        });

    res.json({
      message: 'Submission graded successfully',
      submission: updatedSubmission
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Student's Own Submissions (Quiz and Assignment)
exports.getStudentSubmissions = async (req, res) => {
  try {
    const { type, status, courseId } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Base where condition for the student
    const baseWhere = {
      userId: req.user.id
    };

    // Status filter
    let statusWhere = { ...baseWhere };
    if (status) {
      if (type === 'quiz' && ['SUBMITTED', 'GRADED'].includes(status)) {
        statusWhere.status = status;
      } else if (type === 'assignment' && ['SUBMITTED', 'GRADED', 'LATE_SUBMITTED'].includes(status)) {
        statusWhere.status = status;
      }
    }

    // Course filter condition
    let courseWhere = {};
    if (courseId) {
      courseWhere.id = courseId;
    }

    // Get quiz submissions
    let quizSubmissions = [];
    if (!type || type === 'quiz') {
      quizSubmissions = await QuizSubmission.findAll({
        where: statusWhere,
        include: [
          {
            model: Quiz,
            as: 'quiz',
            attributes: ['id', 'title', 'timeLimit'],
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
                        attributes: ['id', 'title'],
                        where: courseWhere
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            model: User,
            as: 'grader',
            attributes: ['id', 'name'],
            required: false
          }
        ],
        order: [['createdAt', 'DESC']]
      });
    }

    // Get assignment submissions
    let assignmentSubmissions = [];
    if (!type || type === 'assignment') {
      assignmentSubmissions = await AssignmentSubmission.findAll({
        where: statusWhere,
        include: [
          {
            model: Assignment,
            as: 'assignment',
            attributes: ['id', 'title', 'dueDate', 'fileTypes'],
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
                        attributes: ['id', 'title'],
                        where: courseWhere
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            model: User,
            as: 'grader',
            attributes: ['id', 'name'],
            required: false
          }
        ],
        order: [['createdAt', 'DESC']]
      });
    }

    // Combine and format results
    let submissions = [];
    
    if (!type) {
      // Add type property to distinguish submissions
      const quizSubs = quizSubmissions.map(sub => ({
        id: sub.id,
        type: 'quiz',
        title: sub.quiz.title,
        course: {
          id: sub.quiz.lesson.section.course.id,
          title: sub.quiz.lesson.section.course.title
        },
        lesson: {
          id: sub.quiz.lesson.id,
          title: sub.quiz.lesson.title
        },
        section: {
          id: sub.quiz.lesson.section.id,
          title: sub.quiz.lesson.section.title
        },
        score: sub.score,
        totalPoints: sub.totalPoints,
        earnedPoints: sub.earnedPoints,
        status: sub.status,
        submittedAt: sub.submittedAt,
        gradedAt: sub.gradedAt,
        feedback: sub.feedback,
        grader: sub.grader,
        // Quiz specific fields
        timeLimit: sub.quiz.timeLimit
      }));
      
      const assignmentSubs = assignmentSubmissions.map(sub => ({
        id: sub.id,
        type: 'assignment',
        title: sub.assignment.title,
        course: {
          id: sub.assignment.lesson.section.course.id,
          title: sub.assignment.lesson.section.course.title
        },
        lesson: {
          id: sub.assignment.lesson.id,
          title: sub.assignment.lesson.title
        },
        section: {
          id: sub.assignment.lesson.section.id,
          title: sub.assignment.lesson.section.title
        },
        score: sub.score,
        maxScore: sub.maxScore,
        status: sub.status,
        submittedAt: sub.submittedAt,
        gradedAt: sub.gradedAt,
        feedback: sub.feedback,
        grader: sub.grader,
        isLate: sub.isLate,
        // Assignment specific fields
        dueDate: sub.assignment.dueDate,
        fileName: sub.fileName,
        fileType: sub.fileType,
        fileSize: sub.fileSize,
        fileUrl: sub.fileUrl,
        downloadUrl: sub.downloadUrl,
        description: sub.description,
        allowedFileTypes: sub.assignment.fileTypes
      }));

      submissions = [...quizSubs, ...assignmentSubs]
        .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
        .slice(offset, offset + limit);
        
    } else if (type === 'quiz') {
      submissions = quizSubmissions.slice(offset, offset + limit).map(sub => ({
        id: sub.id,
        type: 'quiz',
        title: sub.quiz.title,
        course: {
          id: sub.quiz.lesson.section.course.id,
          title: sub.quiz.lesson.section.course.title
        },
        lesson: {
          id: sub.quiz.lesson.id,
          title: sub.quiz.lesson.title
        },
        section: {
          id: sub.quiz.lesson.section.id,
          title: sub.quiz.lesson.section.title
        },
        score: sub.score,
        totalPoints: sub.totalPoints,
        earnedPoints: sub.earnedPoints,
        status: sub.status,
        submittedAt: sub.submittedAt,
        gradedAt: sub.gradedAt,
        feedback: sub.feedback,
        grader: sub.grader,
        timeLimit: sub.quiz.timeLimit
      }));
      
    } else {
      submissions = assignmentSubmissions.slice(offset, offset + limit).map(sub => ({
        id: sub.id,
        type: 'assignment',
        title: sub.assignment.title,
        course: {
          id: sub.assignment.lesson.section.course.id,
          title: sub.assignment.lesson.section.course.title
        },
        lesson: {
          id: sub.assignment.lesson.id,
          title: sub.assignment.lesson.title
        },
        section: {
          id: sub.assignment.lesson.section.id,
          title: sub.assignment.lesson.section.title
        },
        score: sub.score,
        maxScore: sub.maxScore,
        status: sub.status,
        submittedAt: sub.submittedAt,
        gradedAt: sub.gradedAt,
        feedback: sub.feedback,
        grader: sub.grader,
        isLate: sub.isLate,
        dueDate: sub.assignment.dueDate,
        fileName: sub.fileName,
        fileType: sub.fileType,
        fileSize: sub.fileSize,
        fileUrl: sub.fileUrl,
        downloadUrl: sub.downloadUrl,
        description: sub.description,
        allowedFileTypes: sub.assignment.fileTypes
      }));
    }

    // Calculate statistics
    const stats = {
      quiz: {
        total: quizSubmissions.length,
        graded: quizSubmissions.filter(sub => sub.status === 'GRADED').length,
        pending: quizSubmissions.filter(sub => sub.status === 'SUBMITTED').length,
        averageScore: quizSubmissions.length > 0 
          ? quizSubmissions
              .filter(sub => sub.score !== null)
              .reduce((sum, sub) => sum + sub.score, 0) / 
            quizSubmissions.filter(sub => sub.score !== null).length
          : 0
      },
      assignment: {
        total: assignmentSubmissions.length,
        graded: assignmentSubmissions.filter(sub => sub.status === 'GRADED').length,
        pending: assignmentSubmissions.filter(sub => sub.status === 'SUBMITTED').length,
        late: assignmentSubmissions.filter(sub => sub.isLate).length,
        averageScore: assignmentSubmissions.length > 0
          ? assignmentSubmissions
              .filter(sub => sub.score !== null)
              .reduce((sum, sub) => sum + (sub.score / sub.maxScore) * 100, 0) / 
            assignmentSubmissions.filter(sub => sub.score !== null).length
          : 0
      }
    };

    // Get total counts for pagination
    const totalQuizCount = quizSubmissions.length;
    const totalAssignmentCount = assignmentSubmissions.length;
    const totalCount = type 
      ? (type === 'quiz' ? totalQuizCount : totalAssignmentCount) 
      : totalQuizCount + totalAssignmentCount;

    res.json({
      submissions,
      statistics: stats,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalItems: totalCount,
        itemsPerPage: limit
      },
      filters: {
        type: type || 'all',
        status: status || 'all',
        courseId: courseId || 'all'
      }
    });
    
  } catch (error) {
    console.error('Error in getStudentSubmissions:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get Instructor's Submissions (for grading)
exports.getInstructorSubmissions = async (req, res) => {
  try {
    const { courseId, status, type } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Base where condition
    let courseWhere = {};
    if (courseId) {
      courseWhere.id = courseId;
    }

    // Status filter
    let statusWhere = {};
    if (status && ['SUBMITTED', 'GRADED', 'LATE_SUBMITTED'].includes(status)) {
      statusWhere.status = status;
    }

    // Get quiz submissions
    let quizSubmissions = [];
    if (!type || type === 'quiz') {
      quizSubmissions = await QuizSubmission.findAll({
        where: statusWhere,
        include: [
          {
            model: User,
            as: 'student', // Use correct alias
            attributes: ['id', 'name', 'email']
          },
          {
            model: Quiz,
            as: 'quiz',
            attributes: ['id', 'title'],
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
                        where: {
                          instructorId: req.user.id,
                          ...courseWhere
                        }
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ],
        order: [['createdAt', 'DESC']],
        limit: type === 'quiz' ? limit : undefined,
        offset: type === 'quiz' ? offset : 0
      });
    }

    // Get assignment submissions
    let assignmentSubmissions = [];
    if (!type || type === 'assignment') {
      assignmentSubmissions = await AssignmentSubmission.findAll({
        where: statusWhere,
        include: [
          {
            model: User,
            as: 'student', // Use correct alias
            attributes: ['id', 'name', 'email']
          },
          {
            model: Assignment,
            as: 'assignment',
            attributes: ['id', 'title', 'dueDate'],
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
                        where: {
                          instructorId: req.user.id,
                          ...courseWhere
                        }
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ],
        order: [['createdAt', 'DESC']],
        limit: type === 'assignment' ? limit : undefined,
        offset: type === 'assignment' ? offset : 0
      });
    }

    // Combine results if no specific type requested
    let submissions = [];
    if (!type) {
      // Add type property to distinguish submissions
      const quizSubs = quizSubmissions.map(sub => ({
        ...sub.toJSON(),
        submissionType: 'quiz'
      }));
      
      const assignmentSubs = assignmentSubmissions.map(sub => ({
        ...sub.toJSON(),
        submissionType: 'assignment'
      }));

      submissions = [...quizSubs, ...assignmentSubs]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(offset, offset + limit);
    } else if (type === 'quiz') {
      submissions = quizSubmissions.map(sub => ({
        ...sub.toJSON(),
        submissionType: 'quiz'
      }));
    } else {
      submissions = assignmentSubmissions.map(sub => ({
        ...sub.toJSON(),
        submissionType: 'assignment'
      }));
    }

    // Get counts for pagination
    const totalQuizCount = !type || type === 'quiz' ? quizSubmissions.length : 0;
    const totalAssignmentCount = !type || type === 'assignment' ? assignmentSubmissions.length : 0;
    const totalCount = type ? (type === 'quiz' ? totalQuizCount : totalAssignmentCount) : totalQuizCount + totalAssignmentCount;

    res.json({
      submissions,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalItems: totalCount,
        itemsPerPage: limit
      },
      counts: {
        quiz: totalQuizCount,
        assignment: totalAssignmentCount,
        total: totalCount
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};