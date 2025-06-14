import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
  index('routes/home.tsx'),
  route('/login', 'routes/login.tsx'),
  route('/register', 'routes/register.tsx'),
  route('/courses/:id/sections', 'routes/courses.$id.sections.tsx'),
  route('/courses/:id/lessons/:sectionId?', 'routes/courses.$id.lessons.tsx'),
  route('/quiz/:id/take', 'routes/quiz.$id.take.tsx'),
  route('/quiz/:id/results', 'routes/quiz.$id.results.tsx'),
  route('/enrollments/:id/payment', 'routes/enrollPayment.tsx'),
  route('/my-enrollments', 'routes/userEnrollments.tsx'),
  route('/submissions', 'routes/submissions.tsx'),

  // Quiz Management Routes
  route('/quiz/list', 'routes/quiz-list.tsx'),
  route('/quiz/create', 'routes/quiz.create.tsx'),
  route('/quiz/:id/edit', 'routes/quiz.$id.edit.tsx'),
  route('/quiz/:id/view', 'routes/quiz.$id.view.tsx'),

  // Category Management Routes
  route('/category', 'routes/category-list.tsx'),
  route('/category/create', 'routes/category-create.tsx'),
  route('/category/update/:id', 'routes/category-update.tsx'),

  // Tag Management Routes
  route('/tag', 'routes/tag-list.tsx'),
  route('/tag/create', 'routes/tag-create.tsx'),

  // Course Management Routes
  route('/course', 'routes/filter/course.tsx'),
  route('/course/create', 'routes/courses-create.tsx'),
  route('/courses/:id', 'routes/filter/course-detail.tsx'),
  route('/courses/:id/edit', 'routes/filter/course-update.tsx'),
  route('/courses/:id/delete', 'routes/filter/course-delete.tsx'),
  route('/courses/:id/status', 'routes/filter/course-status.tsx'),

  // Course Advanced Management Routes
  route('/courses/:id/categories', 'routes/filter/add-category.tsx'),
  route('/courses/:id/tags', 'routes/filter/add-tags.tsx'),

  // Enroll Management Routes
  route('/courses/:id/enroll', 'routes/enroll/enroll.tsx'),

  // Payout Management Routes
  route('/payout', 'routes/payout/payout.tsx'),
  route('/payout/request', 'routes/payout/payout-request.tsx'),
  route('/payouts/course/:id/balance', 'routes/payout/payout-course.tsx'),
  route('/payouts/instructor/my-payouts', 'routes/payout/payout-history.tsx'),
  route('/payouts/:id', 'routes/payout/payout-details.tsx'),
  route('/payouts/debug/instructor-info', 'routes/payout/payout-debug.tsx'),
  route('/payouts/pending', 'routes/payout/payout-pending.tsx'),
  route('/payouts/:id/status', 'routes/payout/payout-update.tsx'),

  // Admin Management Routes
  route('/admin/stats', 'routes/admin/admin-stats.tsx'),
  route('/admin/users', 'routes/admin/admin-users.tsx'),
  route('/admin/courses', 'routes/admin/admin-course.tsx'),
  route('/admin/instructor-requests', 'routes/admin/admin-instructor-request.tsx'),
  route('/admin/users/:id/approve-instructor', 'routes/user/admin-response.tsx'),

  // Profile
  route('/profile', 'routes/user/profile-me.tsx'),
  route('/profile/change-password', 'routes/user/change-password.tsx'),
  route('/profile/request-instructor', 'routes/user/request-instructor.tsx'),

  // Instructor Management Routes
  route('/users/:id/instructor-profile', 'routes/instructor/update-profile.tsx'),
  route('/instructors', 'routes/instructor/instructors-all.tsx'),
  route('/users/instructors/:id/courses', 'routes/instructor/instructors-courses.tsx'),
  route('/users/instructor-profile/:id', 'routes/instructor/instructors-profile.tsx'),
  route('/instructors/:id/stats', 'routes/instructor/instructors-admin.tsx'),

  // Analytics Routes
  route('/courses/:id/analytics', 'routes/analytics/analytics-stats.tsx'),
  route('/courses/:id/analytics/enrollments', 'routes/analytics/analytics-enrollment.tsx'),
  route('/courses/:id/analytics/revenue', 'routes/analytics/analytics-revenue.tsx'),
] satisfies RouteConfig;