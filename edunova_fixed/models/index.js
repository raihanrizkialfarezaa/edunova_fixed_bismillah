const fs = require('fs');
const path = require('path');
const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    dialectOptions: {
      ssl: {
        ca: fs.readFileSync(path.resolve(__dirname, '../', process.env.SSL_CA_PATH)), // Baca ca.pem
        rejectUnauthorized: true
      }
    },
    logging: false
  }
);

const db = {};

fs.readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== 'index.js' &&
      file.slice(-3) === '.js'
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Course associations
db.Course.belongsTo(db.User, { 
  as: 'instructor', 
  foreignKey: 'instructorId' 
});

db.User.hasMany(db.Course, { 
  as: 'Courses', 
  foreignKey: 'instructorId' 
});

// Many-to-many: Course <-> Category
db.Course.belongsToMany(db.Category, {
  through: db.CourseCategory,
  foreignKey: 'courseId',
  otherKey: 'categoryId'
});

db.Category.belongsToMany(db.Course, {
  through: db.CourseCategory,
  foreignKey: 'categoryId',
  otherKey: 'courseId'
});

// Many-to-many: Course <-> Tag
db.Course.belongsToMany(db.Tag, {
  through: db.CourseTag,
  foreignKey: 'courseId',
  otherKey: 'tagId'
});

db.Tag.belongsToMany(db.Course, {
  through: db.CourseTag,
  foreignKey: 'tagId',
  otherKey: 'courseId'
});

// Course -> Section (One-to-many)
db.Course.hasMany(db.Section, {
  as: 'Sections',
  foreignKey: 'courseId'
});

db.Section.belongsTo(db.Course, {
  as: 'course',
  foreignKey: 'courseId'
});

// Section -> Lesson (One-to-many)
db.Section.hasMany(db.Lesson, {
  as: 'Lessons',
  foreignKey: 'sectionId'
});

db.Lesson.belongsTo(db.Section, {
  as: 'section',
  foreignKey: 'sectionId'
});

// Lesson -> Quiz (One-to-one)
db.Lesson.hasOne(db.Quiz, {
  as: 'quiz',
  foreignKey: 'lessonId'
});

db.Quiz.belongsTo(db.Lesson, {
  as: 'lesson',
  foreignKey: 'lessonId'
});

// Quiz -> Question (One-to-many)
db.Quiz.hasMany(db.Question, {
  as: 'Questions',
  foreignKey: 'quizId'
});

db.Question.belongsTo(db.Quiz, {
  as: 'quiz',
  foreignKey: 'quizId'
});

// Question -> Option (One-to-many)
db.Question.hasMany(db.Option, {
  as: 'Options',
  foreignKey: 'questionId'
});

db.Option.belongsTo(db.Question, {
  as: 'question',
  foreignKey: 'questionId'
});

// Lesson -> Assignment (One-to-one)
db.Lesson.hasOne(db.Assignment, {
  as: 'assignment',
  foreignKey: 'lessonId'
});

db.Assignment.belongsTo(db.Lesson, {
  as: 'lesson',
  foreignKey: 'lessonId'
});

// Course -> Review (One-to-many)
db.Course.hasMany(db.Review, {
  as: 'Reviews',
  foreignKey: 'courseId'
});

db.Review.belongsTo(db.Course, {
  as: 'course',
  foreignKey: 'courseId'
});

// User -> Review (One-to-many)
db.User.hasMany(db.Review, {
  as: 'Reviews',
  foreignKey: 'userId'
});

db.Review.belongsTo(db.User, {
  as: 'user',
  foreignKey: 'userId'
});

// Course -> Enrollment (One-to-many)
db.Course.hasMany(db.Enrollment, {
  as: 'Enrollments',
  foreignKey: 'courseId'
});

db.Enrollment.belongsTo(db.Course, {
  as: 'course',
  foreignKey: 'courseId'
});

// User -> Enrollment (One-to-many)
db.User.hasMany(db.Enrollment, {
  as: 'Enrollments',
  foreignKey: 'userId'
});

db.Enrollment.belongsTo(db.User, {
  as: 'user',
  foreignKey: 'userId'
});

// Payment relations
db.Payment.belongsTo(db.Enrollment, {
  as: 'enrollment',
  foreignKey: 'enrollmentId'
});

db.Enrollment.hasOne(db.Payment, {
  as: 'payment',
  foreignKey: 'enrollmentId'
});

db.Payment.belongsTo(db.User, {
  as: 'instructor',
  foreignKey: 'instructorId'
});

db.User.hasMany(db.Payment, {
  as: 'instructorPayments',
  foreignKey: 'instructorId'
});

// Lesson -> UserProgress (One-to-one)
db.Lesson.hasOne(db.UserProgress, {
  foreignKey: 'lessonId',
  as: 'userProgress'
});

// Payout relations
db.Payout.belongsTo(db.User, {
  as: 'instructor',
  foreignKey: 'instructorId'
});

db.User.hasMany(db.Payout, {
  as: 'payouts',
  foreignKey: 'instructorId'
});

db.Payout.belongsTo(db.Course, {
  as: 'course',
  foreignKey: 'courseId'
});

db.Course.hasMany(db.Payout, {
  as: 'payouts',
  foreignKey: 'courseId'
});

// TransactionLog relations
db.TransactionLog.belongsTo(db.Payment, {
  as: 'payment',
  foreignKey: 'paymentId'
});

db.Payment.hasMany(db.TransactionLog, {
  as: 'transactionLogs',
  foreignKey: 'paymentId'
});

db.TransactionLog.belongsTo(db.Payout, {
  as: 'payout',
  foreignKey: 'payoutId'
});

db.Payout.hasMany(db.TransactionLog, {
  as: 'transactionLogs',
  foreignKey: 'payoutId'
});

// User -> QuizSubmission
db.User.hasMany(db.QuizSubmission, {
  foreignKey: 'userId',
  as: 'quizSubmissions'
});
db.QuizSubmission.belongsTo(db.User, {
  foreignKey: 'userId',
  as: 'student'
});

// QuizSubmission - gradedBy
db.QuizSubmission.belongsTo(db.User, {
  foreignKey: 'gradedBy',
  as: 'grader'
});

// Quiz -> QuizSubmission
db.Quiz.hasMany(db.QuizSubmission, {
  foreignKey: 'quizId',
  as: 'submissions'
});
db.QuizSubmission.belongsTo(db.Quiz, {
  foreignKey: 'quizId',
  as: 'quiz'
});

// User -> AssignmentSubmission
db.User.hasMany(db.AssignmentSubmission, {
  foreignKey: 'userId',
  as: 'assignmentSubmissions'
});
db.AssignmentSubmission.belongsTo(db.User, {
  foreignKey: 'userId',
  as: 'student'
});

// AssignmentSubmission - gradedBy
db.AssignmentSubmission.belongsTo(db.User, {
  foreignKey: 'gradedBy',
  as: 'grader'
});

// Assignment -> AssignmentSubmission
db.Assignment.hasMany(db.AssignmentSubmission, {
  foreignKey: 'assignmentId',
  as: 'submissions'
});
db.AssignmentSubmission.belongsTo(db.Assignment, {
  foreignKey: 'assignmentId',
  as: 'assignment'
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;