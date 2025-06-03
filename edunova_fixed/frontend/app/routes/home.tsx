import { Welcome } from '../welcome/welcome';
import { useAuth } from '../contexts/AuthContext';
import { Navigate, Link, useNavigate } from 'react-router'; // Corrected import for Link and Navigate
import { useState, useEffect } from 'react';
import axiosInstance from '../lib/axios';
import { quizApi } from '../lib/quizApi';
import { ClockIcon, StarIcon, CalendarIcon, ArrowRightIcon, BookOpenIcon, AcademicCapIcon } from '@heroicons/react/24/outline'; // atau '/24/solid' untuk versi solid

export function meta() {
  return [{ title: 'EduNova - Learning Platform' }, { name: 'description', content: 'Welcome to EduNova Learning Platform!' }];
}

interface Course {
  id: number;
  title: string;
  description: string;
  instructorId: number;
}

interface Quiz {
  id: number;
  title: string;
  description: string;
  timeLimit: number;
  totalPoints: number;
  course: {
    id: number;
    title: string;
  };
  status?: 'available' | 'completed' | 'in_progress';
  userSubmission?: {
    id: number;
    score: number;
    status: string;
    submittedAt: string;
  };
}

interface Assignment {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  totalPoints: number;
  course: {
    id: number;
    title: string;
  };
  status?: 'available' | 'submitted' | 'graded' | 'overdue';
  userSubmission?: {
    id: number;
    score: number;
    status: string;
    submittedAt: string;
  };
}

interface Enrollment {
  id: number;
  course: {
    id: number;
    title: string;
    price: number;
    description?: string;
  };
  enrolledAt: string;
}

export default function Home() {
  const { user, logout, loading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [loadingQuizzes, setLoadingQuizzes] = useState(false);
  const [loadingAssignments, setLoadingAssignments] = useState(false);
  const [loadingEnrollments, setLoadingEnrollments] = useState(false);

  // Define a consistent color palette for buttons for dark mode
  const buttonColors = {
    primary: 'bg-indigo-600 hover:bg-indigo-700', // For main actions like "Take Quiz", "Manage Courses"
    secondary: 'bg-teal-600 hover:bg-teal-700', // For secondary actions like "View Results", "Manage Sections"
    danger: 'bg-red-600 hover:bg-red-700', // For destructive actions like "Logout"
    neutral: 'bg-gray-600 hover:bg-gray-700', // For disabled/submitted states
  };

  // Fetch courses for instructor/admin
  useEffect(() => {
    if (isAuthenticated && (user?.role === 'INSTRUCTOR' || user?.role === 'ADMIN')) {
      fetchCourses();
    }
  }, [isAuthenticated, user]);

  // Fetch enrollments for students
  useEffect(() => {
    if (isAuthenticated && user?.role === 'STUDENT') {
      fetchEnrollments();
    }
  }, [isAuthenticated, user]);

  const fetchCourses = async () => {
    try {
      setLoadingCourses(true);
      const response = await axiosInstance.get('/courses');
      setCourses(response.data.courses || []);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    } finally {
      setLoadingCourses(false);
    }
  };

  const fetchEnrollments = async () => {
    try {
      setLoadingEnrollments(true);
      const response = await axiosInstance.get('/my-enrollments');
      const allEnrollments = response.data.enrollments || [];

      // Shuffle and take 2 random enrollments
      const shuffled = allEnrollments.sort(() => 0.5 - Math.random());
      setEnrollments(shuffled.slice(0, 2));
    } catch (error) {
      console.error('Failed to fetch enrollments:', error);
      setEnrollments([]);
    } finally {
      setLoadingEnrollments(false);
    }
  };

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center p-8 bg-gray-800 rounded-xl shadow-2xl">
          <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-indigo-500 mx-auto mb-6"></div>
          <p className="mt-4 text-xl font-semibold text-gray-300">Loading your EduNova experience...</p>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      navigate('/login');
    }
  };

  // If user is authenticated, show dashboard
  if (isAuthenticated && user) {
    return (
      <div className="min-h-screen bg-gray-950 text-gray-100 font-sans antialiased">
        <nav className="bg-gray-900 shadow-xl border-b border-gray-800 py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              <div className="flex items-center">
                <h1 className="text-4xl font-extrabold text-white tracking-tight drop-shadow-lg">EduNova</h1>
              </div>
              <div className="flex items-center space-x-6">
                {/* Simplified User Info */}
                <div className="flex items-center space-x-3">
                  <span className="text-lg text-gray-300 font-medium">
                    Hello, <span className="text-indigo-400 font-semibold">{user.name}</span> !
                  </span>
                  <span className="text-xs px-3 py-1 bg-blue-700 text-blue-100 rounded-full font-semibold">{user.role}</span>
                </div>

                {/* Navigation Links */}
                {(user.role === 'INSTRUCTOR' || user.role === 'ADMIN') && (
                  <Link to="/quiz/list" className="text-gray-300 hover:text-white transition-colors duration-300 text-lg font-medium">
                    Manage Quizzes
                  </Link>
                )}
                <Link to="/profile" className="text-gray-300 hover:text-white transition-colors duration-300 text-lg font-medium">
                  Profile
                </Link>
                <Link to="/submissions" className="text-gray-300 hover:text-white transition-colors duration-300 text-lg font-medium">
                  Submissions
                </Link>

                {/* Logout Button - more subtle, but still clear */}
                <button onClick={handleLogout} className="text-red-400 hover:text-red-300 transition-colors duration-300 text-lg font-medium">
                  Logout
                </button>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
          <div className="py-12">
            {' '}
            {/* Changed from pb-8 to py-12 */}
            <h2 className="text-5xl font-extrabold text-white mb-3 tracking-tight drop-shadow-lg">Dashboard</h2>
            <p className="text-2xl text-gray-300">
              Welcome to your personalized learning dashboard, <span className="text-indigo-400 font-semibold">{user.name}</span>!
            </p>
          </div>

          {/* Student Dashboard */}
          {user.role === 'STUDENT' && (
            <>
              {/* My Enrolled Courses */}
              <section className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-8 mb-10 transition-all duration-300">
                <h3 className="text-2xl font-bold mb-6 text-white flex items-center">
                  <BookOpenIcon className="h-8 w-8 mr-3 text-indigo-400" />
                  My Enrolled Courses
                </h3>

                {loadingEnrollments ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-pulse text-gray-400">Loading your courses...</div>
                  </div>
                ) : enrollments.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {enrollments.map((enrollment) => (
                      <div key={enrollment.id} className="bg-gray-700/50 hover:bg-gray-700/70 rounded-lg p-6 transition-all duration-300 border border-gray-600">
                        <div className="flex flex-col h-full">
                          <div className="flex-1 mb-4">
                            <div className="flex items-center gap-3 mb-3">
                              <AcademicCapIcon className="h-6 w-6 text-indigo-400" />
                              <h4 className="text-xl font-semibold text-white">{enrollment.course.title}</h4>
                            </div>

                            {enrollment.course.description && <p className="text-gray-300 mb-3 line-clamp-2">{enrollment.course.description}</p>}

                            <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-4">
                              <div className="flex items-center gap-1">
                                <CalendarIcon className="h-4 w-4" />
                                <span>Enrolled: {new Date(enrollment.enrolledAt).toLocaleDateString()}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <StarIcon className="h-4 w-4" />
                                <span>Price: ${(enrollment.course.price / 100).toFixed(2)}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row gap-3">
                            <Link
                              to={`/courses/${enrollment.course.id}/lessons`}
                              className="flex-1 text-center bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center"
                            >
                              Continue Learning
                              <ArrowRightIcon className="h-4 w-4 ml-2" />
                            </Link>
                            <Link to={`/courses/${enrollment.course.id}/sections`} className="flex-1 text-center bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                              View Sections
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <AcademicCapIcon className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400 text-lg mb-4">You haven't enrolled in any courses yet.</p>
                    <Link to="/course" className="inline-flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-md text-sm font-medium transition-colors">
                      Browse Courses
                      <ArrowRightIcon className="h-4 w-4 ml-2" />
                    </Link>
                  </div>
                )}

                {enrollments.length > 0 && (
                  <div className="mt-6 text-center">
                    <Link to="/my-enrollments" className="inline-flex items-center text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                      View All My Enrollments
                      <ArrowRightIcon className="h-4 w-4 ml-2" />
                    </Link>
                  </div>
                )}
              </section>
            </>
          )}

          {(user.role === 'INSTRUCTOR' || user.role === 'ADMIN') && (
            <section className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-8 mb-10 transition-all duration-300">
              <h3 className="text-2xl font-bold mb-6 text-white">Your Courses</h3>

              {loadingCourses ? (
                <div className="flex justify-center py-8">
                  <div className="animate-pulse text-gray-400">Loading courses...</div>
                </div>
              ) : courses.length > 0 ? (
                <div className="space-y-4">
                  {courses
                    .filter((course) => user.role === 'ADMIN' || course.instructorId === user.id)
                    .map((course) => (
                      <div key={course.id} className="bg-gray-700/50 hover:bg-gray-700/70 rounded-lg p-6 transition-all duration-300">
                        <div className="flex flex-col md:flex-row md:items-center gap-6">
                          <div className="flex-1">
                            <h4 className="text-xl font-semibold text-white mb-2">{course.title}</h4>
                            <p className="text-gray-300">{course.description}</p>
                          </div>

                          <div className="flex flex-col sm:flex-row gap-3 md:w-auto">
                            <Link to={`/courses/${course.id}/sections`} className="text-center bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                              Manage Sections
                            </Link>
                            <Link to={`/courses/${course.id}/lessons`} className="text-center bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                              Manage Lessons
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">No courses found. Time to create some!</div>
              )}
            </section>
          )}

          {/* Quick access section */}
          <section className="bg-gray-800/40 backdrop-blur-sm rounded-xl p-6 mb-10 transition-all duration-300">
            <h3 className="text-2xl font-semibold mb-6 text-white">Quick Access</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {user.role === 'STUDENT' && (
                <>
                  <div className="bg-gray-700/30 hover:bg-gray-700/40 rounded-lg p-5 transition-all duration-300">
                    <h4 className="font-medium text-lg mb-1.5 text-white">All Courses</h4>
                    <p className="text-sm text-gray-300/80 mb-4">Explore all available courses</p>
                    <Link to="/course" className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                      View Courses
                    </Link>
                  </div>
                  <div className="bg-gray-700/30 hover:bg-gray-700/40 rounded-lg p-5 transition-all duration-300">
                    <h4 className="font-medium text-lg mb-1.5 text-white">My Enrollments</h4>
                    <p className="text-sm text-gray-300/80 mb-4">Access your enrolled courses</p>
                    <Link to="/my-enrollments" className="inline-block bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                      My Courses
                    </Link>
                  </div>
                  <div className="bg-gray-700/30 hover:bg-gray-700/40 rounded-lg p-5 transition-all duration-300">
                    <h4 className="font-medium text-lg mb-1.5 text-white">Quiz History</h4>
                    <p className="text-sm text-gray-300/80 mb-4">Review your completed quizzes</p>
                    <Link to="/submissions" className="inline-block bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                      View History
                    </Link>
                  </div>
                  <div className="bg-gray-700/30 hover:bg-gray-700/40 rounded-lg p-5 transition-all duration-300">
                    <h4 className="font-medium text-lg mb-1.5 text-white">Assignments</h4>
                    <p className="text-sm text-gray-300/80 mb-4">Track your assignment submissions</p>
                    <Link to="/submissions" className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                      View Submissions
                    </Link>
                  </div>
                  <div className="bg-gray-700/30 hover:bg-gray-700/40 rounded-lg p-5 transition-all duration-300">
                    <h4 className="font-medium text-lg mb-1.5 text-white">Instructors</h4>
                    <p className="text-sm text-gray-300/80 mb-4">Discover instructors and their courses</p>
                    <Link to="/instructors" className="inline-block bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                      View Instructors
                    </Link>
                  </div>
                  <div className="bg-gray-700/30 hover:bg-gray-700/40 rounded-lg p-5 transition-all duration-300">
                    <h4 className="font-medium text-lg mb-1.5 text-white">Categories & Tags</h4>
                    <p className="text-sm text-gray-300/80 mb-4">Browse by course categories and tags</p>
                    <Link to="/category" className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                      Explore Categories
                    </Link>
                  </div>
                </>
              )}

              {(user.role === 'INSTRUCTOR' || user.role === 'ADMIN') && (
                <>
                  <div className="bg-gray-700/30 hover:bg-gray-700/40 rounded-lg p-5 transition-all duration-300">
                    <h4 className="font-medium text-lg mb-1.5 text-white">Course Management</h4>
                    <p className="text-sm text-gray-300/80 mb-4">Create and manage your courses</p>
                    <Link to="/course" className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                      Manage Courses
                    </Link>
                  </div>
                  <div className="bg-gray-700/30 hover:bg-gray-700/40 rounded-lg p-5 transition-all duration-300">
                    <h4 className="font-medium text-lg mb-1.5 text-white">Quiz Management</h4>
                    <p className="text-sm text-gray-300/80 mb-4">Create, edit, and oversee quizzes</p>
                    <Link to="/quiz/list" className="inline-block bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                      Manage Quizzes
                    </Link>
                  </div>
                  <div className="bg-gray-700/30 hover:bg-gray-700/40 rounded-lg p-5 transition-all duration-300">
                    <h4 className="font-medium text-lg mb-1.5 text-white">Create New Quiz</h4>
                    <p className="text-sm text-gray-300/80 mb-4">Design and add a new quiz</p>
                    <Link to="/quiz/create" className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                      Create Quiz
                    </Link>
                  </div>
                  <div className="bg-gray-700/30 hover:bg-gray-700/40 rounded-lg p-5 transition-all duration-300">
                    <h4 className="font-medium text-lg mb-1.5 text-white">Grade Submissions</h4>
                    <p className="text-sm text-gray-300/80 mb-4">Review student assignments and quizzes</p>
                    <Link to="/submissions" className="inline-block bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                      Grade Work
                    </Link>
                  </div>
                  <div className="bg-gray-700/30 hover:bg-gray-700/40 rounded-lg p-5 transition-all duration-300">
                    <h4 className="font-medium text-lg mb-1.5 text-white">Course Analytics</h4>
                    <p className="text-sm text-gray-300/80 mb-4">View insights and statistics</p>
                    <Link to="/course" className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                      View Analytics
                    </Link>
                  </div>
                </>
              )}

              {user.role === 'ADMIN' && (
                <>
                  <div className="bg-gray-700/30 hover:bg-gray-700/40 rounded-lg p-5 transition-all duration-300">
                    <h4 className="font-medium text-lg mb-1.5 text-white">Admin Panel</h4>
                    <p className="text-sm text-gray-300/80 mb-4">Full control over system settings</p>
                    <Link to="/admin/stats" className="inline-block bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                      Admin Dashboard
                    </Link>
                  </div>
                  <div className="bg-gray-700/30 hover:bg-gray-700/40 rounded-lg p-5 transition-all duration-300">
                    <h4 className="font-medium text-lg mb-1.5 text-white">Categories Admin</h4>
                    <p className="text-sm text-gray-300/80 mb-4">Manage course categories</p>
                    <Link to="/category" className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                      Manage Categories
                    </Link>
                  </div>
                  <div className="bg-gray-700/30 hover:bg-gray-700/40 rounded-lg p-5 transition-all duration-300">
                    <h4 className="font-medium text-lg mb-1.5 text-white">Instructor Payouts</h4>
                    <p className="text-sm text-gray-300/80 mb-4">Process instructor payments</p>
                    <Link to="/payouts/pending" className="inline-block bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                      Manage Payouts
                    </Link>
                  </div>
                  <div className="bg-gray-700/30 hover:bg-gray-700/40 rounded-lg p-5 transition-all duration-300">
                    <h4 className="font-medium text-lg mb-1.5 text-white">All Instructors</h4>
                    <p className="text-sm text-gray-300/80 mb-4">View and manage instructors</p>
                    <Link to="/instructors" className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                      View Instructors
                    </Link>
                  </div>
                </>
              )}

              {user.role === 'INSTRUCTOR' && (
                <div className="bg-gray-700/30 hover:bg-gray-700/40 rounded-lg p-5 transition-all duration-300">
                  <h4 className="font-medium text-lg mb-1.5 text-white">My Payouts</h4>
                  <p className="text-sm text-gray-300/80 mb-4">View and manage earnings</p>
                  <Link to="/payout" className="inline-block bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                    View Payouts
                  </Link>
                </div>
              )}
            </div>
          </section>
        </main>
      </div>
    );
  }

  // If not authenticated, show welcome page
  return <Welcome />;
}
