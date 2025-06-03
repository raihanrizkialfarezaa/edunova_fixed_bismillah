var DataTypes = require("sequelize").DataTypes;
var _Assignment = require("./Assignment");
var _BlacklistedToken = require("./BlacklistedToken");
var _Category = require("./Category");
var _Certificate = require("./Certificate");
var _Course = require("./Course");
var _CourseCategory = require("./CourseCategory");
var _CourseTag = require("./CourseTag");
var _Enrollment = require("./Enrollment");
var _Lesson = require("./Lesson");
var _Notification = require("./Notification");
var _Option = require("./Option");
var _Payment = require("./Payment");
var _Payout = require("./Payout");
var _Question = require("./Question");
var _Quiz = require("./Quiz");
var _Review = require("./Review");
var _Section = require("./Section");
var _Submission = require("./Submission");
var _Tag = require("./Tag");
var _TransactionLog = require("./TransactionLog");
var _User = require("./User");
var __prisma_migrations = require("./_prisma_migrations");

function initModels(sequelize) {
  var Assignment = _Assignment(sequelize, DataTypes);
  var BlacklistedToken = _BlacklistedToken(sequelize, DataTypes);
  var Category = _Category(sequelize, DataTypes);
  var Certificate = _Certificate(sequelize, DataTypes);
  var Course = _Course(sequelize, DataTypes);
  var CourseCategory = _CourseCategory(sequelize, DataTypes);
  var CourseTag = _CourseTag(sequelize, DataTypes);
  var Enrollment = _Enrollment(sequelize, DataTypes);
  var Lesson = _Lesson(sequelize, DataTypes);
  var Notification = _Notification(sequelize, DataTypes);
  var Option = _Option(sequelize, DataTypes);
  var Payment = _Payment(sequelize, DataTypes);
  var Payout = _Payout(sequelize, DataTypes);
  var Question = _Question(sequelize, DataTypes);
  var Quiz = _Quiz(sequelize, DataTypes);
  var Review = _Review(sequelize, DataTypes);
  var Section = _Section(sequelize, DataTypes);
  var Submission = _Submission(sequelize, DataTypes);
  var Tag = _Tag(sequelize, DataTypes);
  var TransactionLog = _TransactionLog(sequelize, DataTypes);
  var User = _User(sequelize, DataTypes);
  var _prisma_migrations = __prisma_migrations(sequelize, DataTypes);

  Submission.belongsTo(Assignment, { as: "assignment", foreignKey: "assignmentId"});
  Assignment.hasMany(Submission, { as: "Submissions", foreignKey: "assignmentId"});
  CourseCategory.belongsTo(Category, { as: "category", foreignKey: "categoryId"});
  Category.hasMany(CourseCategory, { as: "CourseCategories", foreignKey: "categoryId"});
  Certificate.belongsTo(Course, { as: "course", foreignKey: "courseId"});
  Course.hasMany(Certificate, { as: "Certificates", foreignKey: "courseId"});
  CourseCategory.belongsTo(Course, { as: "course", foreignKey: "courseId"});
  Course.hasMany(CourseCategory, { as: "CourseCategories", foreignKey: "courseId"});
  CourseTag.belongsTo(Course, { as: "course", foreignKey: "courseId"});
  Course.hasMany(CourseTag, { as: "CourseTags", foreignKey: "courseId"});
  Enrollment.belongsTo(Course, { as: "course", foreignKey: "courseId"});
  Course.hasMany(Enrollment, { as: "Enrollments", foreignKey: "courseId"});
  Payout.belongsTo(Course, { as: "course", foreignKey: "courseId"});
  Course.hasMany(Payout, { as: "Payouts", foreignKey: "courseId"});
  Review.belongsTo(Course, { as: "course", foreignKey: "courseId"});
  Course.hasMany(Review, { as: "Reviews", foreignKey: "courseId"});
  Section.belongsTo(Course, { as: "course", foreignKey: "courseId"});
  Course.hasMany(Section, { as: "Sections", foreignKey: "courseId"});
  Payment.belongsTo(Enrollment, { as: "enrollment", foreignKey: "enrollmentId"});
  Enrollment.hasOne(Payment, { as: "Payment", foreignKey: "enrollmentId"});
  Assignment.belongsTo(Lesson, { as: "lesson", foreignKey: "lessonId"});
  Lesson.hasOne(Assignment, { as: "Assignment", foreignKey: "lessonId"});
  Quiz.belongsTo(Lesson, { as: "lesson", foreignKey: "lessonId"});
  Lesson.hasOne(Quiz, { as: "Quiz", foreignKey: "lessonId"});
  TransactionLog.belongsTo(Payment, { as: "payment", foreignKey: "paymentId"});
  Payment.hasMany(TransactionLog, { as: "TransactionLogs", foreignKey: "paymentId"});
  TransactionLog.belongsTo(Payout, { as: "payout", foreignKey: "payoutId"});
  Payout.hasMany(TransactionLog, { as: "TransactionLogs", foreignKey: "payoutId"});
  Option.belongsTo(Question, { as: "question", foreignKey: "questionId"});
  Question.hasMany(Option, { as: "Options", foreignKey: "questionId"});
  Question.belongsTo(Quiz, { as: "quiz", foreignKey: "quizId"});
  Quiz.hasMany(Question, { as: "Questions", foreignKey: "quizId"});
  Submission.belongsTo(Quiz, { as: "quiz", foreignKey: "quizId"});
  Quiz.hasMany(Submission, { as: "Submissions", foreignKey: "quizId"});
  Lesson.belongsTo(Section, { as: "section", foreignKey: "sectionId"});
  Section.hasMany(Lesson, { as: "Lessons", foreignKey: "sectionId"});
  CourseTag.belongsTo(Tag, { as: "tag", foreignKey: "tagId"});
  Tag.hasMany(CourseTag, { as: "CourseTags", foreignKey: "tagId"});
  Certificate.belongsTo(User, { as: "user", foreignKey: "userId"});
  User.hasMany(Certificate, { as: "Certificates", foreignKey: "userId"});
  Course.belongsTo(User, { as: "instructor", foreignKey: "instructorId"});
  User.hasMany(Course, { as: "Courses", foreignKey: "instructorId"});
  Enrollment.belongsTo(User, { as: "user", foreignKey: "userId"});
  User.hasMany(Enrollment, { as: "Enrollments", foreignKey: "userId"});
  Notification.belongsTo(User, { as: "user", foreignKey: "userId"});
  User.hasMany(Notification, { as: "Notifications", foreignKey: "userId"});
  Payment.belongsTo(User, { as: "instructor", foreignKey: "instructorId"});
  User.hasMany(Payment, { as: "Payments", foreignKey: "instructorId"});
  Payout.belongsTo(User, { as: "instructor", foreignKey: "instructorId"});
  User.hasMany(Payout, { as: "Payouts", foreignKey: "instructorId"});
  Review.belongsTo(User, { as: "user", foreignKey: "userId"});
  User.hasMany(Review, { as: "Reviews", foreignKey: "userId"});
  Submission.belongsTo(User, { as: "user", foreignKey: "userId"});
  User.hasMany(Submission, { as: "Submissions", foreignKey: "userId"});

  return {
    Assignment,
    BlacklistedToken,
    Category,
    Certificate,
    Course,
    CourseCategory,
    CourseTag,
    Enrollment,
    Lesson,
    Notification,
    Option,
    Payment,
    Payout,
    Question,
    Quiz,
    Review,
    Section,
    Submission,
    Tag,
    TransactionLog,
    User,
    _prisma_migrations,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
