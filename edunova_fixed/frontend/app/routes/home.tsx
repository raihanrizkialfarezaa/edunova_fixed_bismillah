import { Welcome } from '../welcome/welcome';
import { useAuth } from '../contexts/AuthContext';
import { Navigate, Link, useNavigate } from 'react-router'; // Corrected import for Link and Navigate
import { useState, useEffect } from 'react';
import axiosInstance from '../lib/axios';
import { quizApi } from '../lib/quizApi';
import {
  ClockIcon,
  StarIcon,
  CalendarIcon,
  ArrowRightIcon,
  BookOpenIcon,
  AcademicCapIcon,
  ChartBarIcon,
  TrophyIcon,
  FireIcon,
  SparklesIcon,
  BeakerIcon,
  LightBulbIcon,
  RocketLaunchIcon,
  GlobeAltIcon,
  HeartIcon,
  BoltIcon,
} from '@heroicons/react/24/outline';

export function meta() {
  return [{ title: 'EduNova - Platform Pembelajaran' }, { name: 'description', content: 'Selamat datang di Platform Pembelajaran EduNova!' }];
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

// Add this utility function at the top of the component
const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return 'Tanggal tidak tersedia';

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Tanggal tidak valid';

  return date.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

interface Enrollment {
  id: number;
  course: {
    id: number;
    title: string;
    price: number;
    description?: string;
  };
  createdAt: string; // Use createdAt instead of enrolledAt
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

  // Tambahkan state untuk expand/collapse courses di luar render
  const [showAllCourses, setShowAllCourses] = useState(false);

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-indigo-950 to-purple-950">
        <div className="text-center p-12 bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-700/50">
          <div className="relative mx-auto mb-8 w-24 h-24">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full animate-spin opacity-75"></div>
            <div className="absolute inset-2 bg-gray-900 rounded-full"></div>
            <div className="absolute inset-4 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full animate-pulse"></div>
          </div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-4">EduNova</h3>
          <p className="text-lg font-medium text-gray-300">Menyiapkan pengalaman belajar Anda...</p>
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
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-indigo-950/30 to-purple-950/20 text-gray-100 font-sans antialiased">
        {/* Enhanced Navigation */}
        <nav className="bg-gray-900/95 backdrop-blur-xl shadow-2xl border-b border-gray-700/50 py-4 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              <div className="flex items-center">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <SparklesIcon className="h-7 w-7 text-white" />
                  </div>
                  <h1 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent tracking-tight">EduNova</h1>
                </div>
              </div>
              <div className="flex items-center space-x-8">
                {/* Enhanced User Info */}
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-lg text-gray-200 font-medium">
                      Selamat datang kembali, <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent font-bold">{user.name}</span>
                    </div>
                    <div className="text-xs text-gray-400">Siap untuk belajar sesuatu yang baru?</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-xs px-4 py-2 rounded-full font-bold tracking-wide ${
                        user.role === 'STUDENT'
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white'
                          : user.role === 'INSTRUCTOR'
                          ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white'
                          : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                      }`}
                    >
                      {user.role === 'STUDENT' ? 'SISWA' : user.role === 'INSTRUCTOR' ? 'PENGAJAR' : 'ADMIN'}
                    </span>
                  </div>
                </div>

                {/* Enhanced Navigation Links */}
                <div className="flex items-center space-x-6">
                  {(user.role === 'INSTRUCTOR' || user.role === 'ADMIN') && (
                    <Link to="/quiz/list" className="text-gray-300 hover:text-white transition-all duration-300 text-lg font-medium hover:scale-105 relative group">
                      <span className="relative z-10">Kelola Kuis</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity duration-300 -m-2"></div>
                    </Link>
                  )}
                  <Link to="/profile" className="text-gray-300 hover:text-white transition-all duration-300 text-lg font-medium hover:scale-105 relative group">
                    <span className="relative z-10">Profil</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity duration-300 -m-2"></div>
                  </Link>
                  <Link to="/submissions" className="text-gray-300 hover:text-white transition-all duration-300 text-lg font-medium hover:scale-105 relative group">
                    <span className="relative z-10">Pengumpulan</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity duration-300 -m-2"></div>
                  </Link>

                  {/* Enhanced Logout Button */}
                  <button onClick={handleLogout} className="text-red-400 hover:text-red-300 transition-all duration-300 text-lg font-medium hover:scale-105 relative group">
                    <span className="relative z-10">Logout</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity duration-300 -m-2"></div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
          {/* Enhanced Hero Section */}
          <div className="py-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-center mb-6">
                <div className="flex items-center space-x-4">
                  {user.role === 'STUDENT' && <TrophyIcon className="h-12 w-12 text-yellow-400 animate-pulse" />}
                  {user.role === 'INSTRUCTOR' && <AcademicCapIcon className="h-12 w-12 text-blue-400" />}
                  {user.role === 'ADMIN' && <SparklesIcon className="h-12 w-12 text-purple-400" />}
                  <h2 className="text-6xl font-extrabold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent tracking-tight">Dashboard</h2>
                </div>
              </div>
              {user.role === 'STUDENT' ? (
                <p className="text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
                  Perjalanan menuju keunggulan dimulai dari sini, <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent font-bold">{user.name}</span>!
                  <br />
                  <span className="text-lg text-gray-400">Temukan, pelajari, dan raih impian Anda dengan EduNova</span>
                </p>
              ) : (
                <p className="text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
                  Selamat datang di ruang kerja personal Anda, <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent font-bold">{user.name}</span>!
                </p>
              )}
            </div>
          </div>

          {/* Enhanced Student Dashboard */}
          {user.role === 'STUDENT' && (
            <>
              {/* Premium My Enrolled Courses Section */}
              <section className="relative mb-16">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5 rounded-3xl"></div>
                <div className="relative bg-gray-900/60 backdrop-blur-xl rounded-3xl p-10 border border-gray-700/30 shadow-2xl">
                  <div className="flex items-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mr-6 shadow-lg">
                      <BookOpenIcon className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">Perjalanan Belajar Saya</h3>
                      <p className="text-gray-400 text-lg">Lanjutkan jalan menuju kemahiran</p>
                    </div>
                  </div>

                  {loadingEnrollments ? (
                    <div className="flex justify-center py-16">
                      <div className="text-center">
                        <div className="relative mx-auto mb-6 w-16 h-16">
                          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full animate-spin opacity-75"></div>
                          <div className="absolute inset-2 bg-gray-900 rounded-full"></div>
                        </div>
                        <p className="text-gray-400 text-lg">Memuat kursus Anda...</p>
                      </div>
                    </div>
                  ) : enrollments.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {enrollments.map((enrollment, index) => (
                        <div
                          key={enrollment.id}
                          className="group relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 hover:from-gray-700/60 hover:to-gray-800/60 rounded-2xl p-8 transition-all duration-500 border border-gray-600/30 hover:border-emerald-500/30 shadow-xl hover:shadow-2xl hover:scale-[1.02]"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                          <div className="relative z-10 flex flex-col h-full">
                            <div className="flex-1 mb-6">
                              <div className="flex items-start gap-4 mb-4">
                                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                                  <AcademicCapIcon className="h-6 w-6 text-white" />
                                </div>
                                <div className="flex-1">
                                  <h4 className="text-2xl font-bold text-white group-hover:text-emerald-400 transition-colors duration-300 mb-2">{enrollment.course.title}</h4>
                                  <div className="flex items-center gap-2 mb-3">
                                    <span className="text-xs px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full font-medium">Kursus #{index + 1}</span>
                                    <span className="text-xs px-3 py-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-400 rounded-full font-medium">Aktif</span>
                                  </div>
                                </div>
                              </div>

                              {enrollment.course.description && <p className="text-gray-300 mb-6 line-clamp-3 leading-relaxed">{enrollment.course.description}</p>}

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                                <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-xl">
                                  <CalendarIcon className="h-5 w-5 text-emerald-400" />
                                  <div>
                                    <p className="text-xs text-gray-400 uppercase tracking-wide">Terdaftar</p>
                                    <p className="text-sm font-medium text-white">{formatDate(enrollment.createdAt)}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-xl">
                                  <StarIcon className="h-5 w-5 text-yellow-400" />
                                  <div>
                                    <p className="text-xs text-gray-400 uppercase tracking-wide">Investasi</p>
                                    <p className="text-sm font-medium text-white">Rp{(enrollment.course.price / 100).toLocaleString('id-ID')}</p>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <Link
                                to={`/courses/${enrollment.course.id}/lessons`}
                                className="group/btn relative overflow-hidden bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-6 py-4 rounded-xl text-sm font-bold transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105"
                              >
                                <span className="relative z-10 flex items-center">
                                  Lanjutkan Belajar
                                  <RocketLaunchIcon className="h-4 w-4 ml-2 group-hover/btn:translate-x-1 transition-transform duration-300" />
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                              </Link>
                              <Link
                                to={`/courses/${enrollment.course.id}/sections`}
                                className="group/btn relative overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-6 py-4 rounded-xl text-sm font-bold transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105"
                              >
                                <span className="relative z-10 flex items-center">
                                  Lihat Bagian
                                  <ArrowRightIcon className="h-4 w-4 ml-2 group-hover/btn:translate-x-1 transition-transform duration-300" />
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <div className="w-32 h-32 bg-gradient-to-r from-gray-700 to-gray-800 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
                        <AcademicCapIcon className="h-16 w-16 text-gray-400" />
                      </div>
                      <h4 className="text-2xl font-bold text-white mb-4">Petualangan Belajar Anda Menunggu!</h4>
                      <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">Temukan ribuan kursus yang dirancang untuk membantu Anda mencapai tujuan dan membuka potensi Anda.</p>
                      <Link
                        to="/course"
                        className="group inline-flex items-center bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-8 py-4 rounded-xl text-lg font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                      >
                        <span className="flex items-center">
                          Jelajahi Kursus
                          <RocketLaunchIcon className="h-5 w-5 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
                        </span>
                      </Link>
                    </div>
                  )}

                  {enrollments.length > 0 && (
                    <div className="mt-10 text-center">
                      <Link to="/my-enrollments" className="group inline-flex items-center text-emerald-400 hover:text-emerald-300 font-bold text-lg transition-all duration-300 hover:scale-105">
                        Lihat Semua Pendaftaran Saya
                        <ArrowRightIcon className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                      </Link>
                    </div>
                  )}
                </div>
              </section>
            </>
          )}

          {/* Enhanced Instructor/Admin Dashboard */}
          {(user.role === 'INSTRUCTOR' || user.role === 'ADMIN') && (
            <section className="bg-gray-900/60 backdrop-blur-xl rounded-3xl p-10 mb-16 border border-gray-700/30 shadow-2xl">
              <div className="flex items-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mr-6">
                  <AcademicCapIcon className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-white">Kursus Anda</h3>
                  <p className="text-gray-400 text-lg">Kelola dan pantau konten pendidikan Anda</p>
                </div>
              </div>

              {loadingCourses ? (
                <div className="flex justify-center py-12">
                  <div className="animate-pulse text-gray-400 text-lg">Memuat kursus...</div>
                </div>
              ) : (
                (() => {
                  const filteredCourses = courses.filter((course) => user.role === 'ADMIN' || course.instructorId === user.id);
                  const displayedCourses = showAllCourses ? filteredCourses : filteredCourses.slice(0, 3);
                  const hasMoreCourses = filteredCourses.length > 3;

                  return filteredCourses.length > 0 ? (
                    <div className="space-y-6">
                      <div className="space-y-6">
                        {displayedCourses.map((course) => (
                          <div key={course.id} className="bg-gray-800/50 hover:bg-gray-700/60 rounded-2xl p-8 transition-all duration-300 border border-gray-600/30 hover:border-blue-500/30 shadow-lg hover:shadow-xl">
                            <div className="flex flex-col lg:flex-row lg:items-center gap-8">
                              <div className="flex-1">
                                <h4 className="text-2xl font-bold text-white mb-3">{course.title}</h4>
                                <p className="text-gray-300 text-lg leading-relaxed">{course.description}</p>
                              </div>

                              <div className="flex flex-col sm:flex-row gap-4 lg:w-auto">
                                <Link
                                  to={`/courses/${course.id}/sections`}
                                  className="text-center bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                                >
                                  Kelola Bagian
                                </Link>
                                <Link
                                  to={`/courses/${course.id}/lessons`}
                                  className="text-center bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                                >
                                  Kelola Pelajaran
                                </Link>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {hasMoreCourses && (
                        <div className="text-center pt-6">
                          <button
                            onClick={() => setShowAllCourses(!showAllCourses)}
                            className="group inline-flex items-center bg-gradient-to-r from-blue-600/20 to-indigo-600/20 hover:from-blue-600/30 hover:to-indigo-600/30 border border-blue-500/30 hover:border-blue-400/50 text-blue-400 hover:text-blue-300 px-8 py-4 rounded-xl text-lg font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 backdrop-blur-sm"
                          >
                            <span className="flex items-center">
                              {showAllCourses ? (
                                <>
                                  Tampilkan Lebih Sedikit
                                  <ArrowRightIcon className="h-5 w-5 ml-2 rotate-90 group-hover:-translate-y-1 transition-transform duration-300" />
                                </>
                              ) : (
                                <>
                                  Tampilkan {filteredCourses.length - 3} Kursus Lainnya
                                  <ArrowRightIcon className="h-5 w-5 ml-2 -rotate-90 group-hover:translate-y-1 transition-transform duration-300" />
                                </>
                              )}
                            </span>
                          </button>
                          <p className="text-gray-500 text-sm mt-3">
                            Menampilkan {displayedCourses.length} dari {filteredCourses.length} kursus
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-400 text-lg">Tidak ada kursus ditemukan. Saatnya membuat konten yang menakjubkan!</div>
                  );
                })()
              )}
            </section>
          )}

          {/* Enhanced Quick Access Section */}
          <section className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5 rounded-2xl"></div>
            <div className="relative bg-gray-900/40 backdrop-blur-xl rounded-2xl p-10 border border-gray-700/20 shadow-2xl">
              <div className="flex items-center mb-10">
                <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center mr-6">
                  <BoltIcon className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">Akses Cepat</h3>
                  <p className="text-gray-400 text-lg">Semua yang Anda butuhkan di ujung jari</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {user.role === 'STUDENT' && (
                  <>
                    {[
                      {
                        title: 'Semua Kursus',
                        description: 'Jelajahi ribuan kursus dari instruktur kelas dunia',
                        icon: GlobeAltIcon,
                        link: '/course',
                        gradient: 'from-emerald-500 to-teal-500',
                        hoverGradient: 'from-emerald-400 to-teal-400',
                      },
                      {
                        title: 'Pendaftaran Saya',
                        description: 'Akses kursus yang telah didaftar dan pantau progres',
                        icon: HeartIcon,
                        link: '/my-enrollments',
                        gradient: 'from-pink-500 to-rose-500',
                        hoverGradient: 'from-pink-400 to-rose-400',
                      },
                      {
                        title: 'Riwayat Kuis',
                        description: 'Tinjau kuis yang telah diselesaikan dan pencapaian',
                        icon: TrophyIcon,
                        link: '/submissions',
                        gradient: 'from-yellow-500 to-orange-500',
                        hoverGradient: 'from-yellow-400 to-orange-400',
                      },
                      {
                        title: 'Tugas',
                        description: 'Pantau pengumpulan tugas dan nilai Anda',
                        icon: BeakerIcon,
                        link: '/submissions',
                        gradient: 'from-purple-500 to-indigo-500',
                        hoverGradient: 'from-purple-400 to-indigo-400',
                      },
                      {
                        title: 'Instruktur Ahli',
                        description: 'Bertemu dengan pendidik kelas dunia dan kursus mereka',
                        icon: AcademicCapIcon,
                        link: '/instructors',
                        gradient: 'from-blue-500 to-cyan-500',
                        hoverGradient: 'from-blue-400 to-cyan-400',
                      },
                      {
                        title: 'Kategori & Tag',
                        description: 'Temukan kursus berdasarkan kategori dan tag khusus',
                        icon: LightBulbIcon,
                        link: '/category',
                        gradient: 'from-indigo-500 to-purple-500',
                        hoverGradient: 'from-indigo-400 to-purple-400',
                      },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="group relative bg-gradient-to-br from-gray-800/30 to-gray-900/30 hover:from-gray-700/40 hover:to-gray-800/40 rounded-2xl p-8 transition-all duration-500 border border-gray-600/20 hover:border-gray-500/40 shadow-lg hover:shadow-2xl hover:scale-105"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>

                        <div className="relative z-10">
                          <div className={`w-16 h-16 bg-gradient-to-r ${item.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                            <item.icon className="h-8 w-8 text-white" />
                          </div>

                          <h4 className={`font-bold text-xl mb-3 bg-gradient-to-r ${item.hoverGradient} bg-clip-text text-transparent group-hover:from-white group-hover:to-gray-200 transition-all duration-300`}>{item.title}</h4>

                          <p className="text-gray-400 group-hover:text-gray-300 mb-6 leading-relaxed transition-colors duration-300">{item.description}</p>

                          <Link
                            to={item.link}
                            className={`group/btn inline-flex items-center justify-center w-full bg-gradient-to-r ${item.gradient} hover:${item.hoverGradient} text-white px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105`}
                          >
                            <span className="flex items-center">
                              Jelajahi Sekarang
                              <ArrowRightIcon className="h-4 w-4 ml-2 group-hover/btn:translate-x-1 transition-transform duration-300" />
                            </span>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </>
                )}

                {(user.role === 'INSTRUCTOR' || user.role === 'ADMIN') && (
                  <>
                    {/* Instructor/Admin Quick Access Items */}
                    <div className="group bg-gray-800/30 hover:bg-gray-700/40 rounded-2xl p-8 transition-all duration-300 border border-gray-600/20 hover:border-blue-500/30 shadow-lg hover:shadow-xl hover:scale-105">
                      <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                        <BookOpenIcon className="h-8 w-8 text-white" />
                      </div>
                      <h4 className="font-bold text-xl mb-3 text-white group-hover:text-indigo-400 transition-colors duration-300">Manajemen Kursus</h4>
                      <p className="text-gray-400 group-hover:text-gray-300 mb-6 leading-relaxed transition-colors duration-300">Buat dan kelola kursus Anda</p>
                      <Link
                        to="/course"
                        className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 shadow-lg hover:shadow-xl"
                      >
                        Kelola Kursus
                      </Link>
                    </div>
                    <div className="group bg-gray-800/30 hover:bg-gray-700/40 rounded-2xl p-8 transition-all duration-300 border border-gray-600/20 hover:border-teal-500/30 shadow-lg hover:shadow-xl hover:scale-105">
                      <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                        <BeakerIcon className="h-8 w-8 text-white" />
                      </div>
                      <h4 className="font-bold text-xl mb-3 text-white group-hover:text-teal-400 transition-colors duration-300">Manajemen Kuis</h4>
                      <p className="text-gray-400 group-hover:text-gray-300 mb-6 leading-relaxed transition-colors duration-300">Buat, edit, dan awasi kuis</p>
                      <Link
                        to="/quiz/list"
                        className="inline-block bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 shadow-lg hover:shadow-xl"
                      >
                        Kelola Kuis
                      </Link>
                    </div>
                    <div className="group bg-gray-800/30 hover:bg-gray-700/40 rounded-2xl p-8 transition-all duration-300 border border-gray-600/20 hover:border-emerald-500/30 shadow-lg hover:shadow-xl hover:scale-105">
                      <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                        <LightBulbIcon className="h-8 w-8 text-white" />
                      </div>
                      <h4 className="font-bold text-xl mb-3 text-white group-hover:text-emerald-400 transition-colors duration-300">Buat Kuis Baru</h4>
                      <p className="text-gray-400 group-hover:text-gray-300 mb-6 leading-relaxed transition-colors duration-300">Rancang dan tambahkan kuis baru</p>
                      <Link
                        to="/quiz/create"
                        className="inline-block bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 shadow-lg hover:shadow-xl"
                      >
                        Buat Kuis
                      </Link>
                    </div>
                    <div className="group bg-gray-800/30 hover:bg-gray-700/40 rounded-2xl p-8 transition-all duration-300 border border-gray-600/20 hover:border-yellow-500/30 shadow-lg hover:shadow-xl hover:scale-105">
                      <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                        <ChartBarIcon className="h-8 w-8 text-white" />
                      </div>
                      <h4 className="font-bold text-xl mb-3 text-white group-hover:text-yellow-400 transition-colors duration-300">Nilai Pengumpulan</h4>
                      <p className="text-gray-400 group-hover:text-gray-300 mb-6 leading-relaxed transition-colors duration-300">Tinjau tugas dan kuis siswa</p>
                      <Link
                        to="/submissions"
                        className="inline-block bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-white px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 shadow-lg hover:shadow-xl"
                      >
                        Nilai Karya
                      </Link>
                    </div>
                    <div className="group bg-gray-800/30 hover:bg-gray-700/40 rounded-2xl p-8 transition-all duration-300 border border-gray-600/20 hover:border-purple-500/30 shadow-lg hover:shadow-xl hover:scale-105">
                      <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                        <TrophyIcon className="h-8 w-8 text-white" />
                      </div>
                      <h4 className="font-bold text-xl mb-3 text-white group-hover:text-purple-400 transition-colors duration-300">Analitik Kursus</h4>
                      <p className="text-gray-400 group-hover:text-gray-300 mb-6 leading-relaxed transition-colors duration-300">Lihat wawasan dan statistik</p>
                      <Link
                        to="/course"
                        className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 shadow-lg hover:shadow-xl"
                      >
                        Lihat Analitik
                      </Link>
                    </div>
                  </>
                )}

                {user.role === 'ADMIN' && (
                  <>
                    <div className="group bg-gray-800/30 hover:bg-gray-700/40 rounded-2xl p-8 transition-all duration-300 border border-gray-600/20 hover:border-red-500/30 shadow-lg hover:shadow-xl hover:scale-105">
                      <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-rose-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                        <SparklesIcon className="h-8 w-8 text-white" />
                      </div>
                      <h4 className="font-bold text-xl mb-3 text-white group-hover:text-red-400 transition-colors duration-300">Panel Admin</h4>
                      <p className="text-gray-400 group-hover:text-gray-300 mb-6 leading-relaxed transition-colors duration-300">Kontrol penuh atas pengaturan sistem</p>
                      <Link
                        to="/admin/stats"
                        className="inline-block bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 shadow-lg hover:shadow-xl"
                      >
                        Dasbor Admin
                      </Link>
                    </div>
                    <div className="group bg-gray-800/30 hover:bg-gray-700/40 rounded-2xl p-8 transition-all duration-300 border border-gray-600/20 hover:border-blue-500/30 shadow-lg hover:shadow-xl hover:scale-105">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                        <BookOpenIcon className="h-8 w-8 text-white" />
                      </div>
                      <h4 className="font-bold text-xl mb-3 text-white group-hover:text-blue-400 transition-colors duration-300">Admin Kategori</h4>
                      <p className="text-gray-400 group-hover:text-gray-300 mb-6 leading-relaxed transition-colors duration-300">Kelola kategori kursus</p>
                      <Link
                        to="/category"
                        className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 shadow-lg hover:shadow-xl"
                      >
                        Kelola Kategori
                      </Link>
                    </div>
                    <div className="group bg-gray-800/30 hover:bg-gray-700/40 rounded-2xl p-8 transition-all duration-300 border border-gray-600/20 hover:border-green-500/30 shadow-lg hover:shadow-xl hover:scale-105">
                      <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                        <ChartBarIcon className="h-8 w-8 text-white" />
                      </div>
                      <h4 className="font-bold text-xl mb-3 text-white group-hover:text-green-400 transition-colors duration-300">Pembayaran Instruktur</h4>
                      <p className="text-gray-400 group-hover:text-gray-300 mb-6 leading-relaxed transition-colors duration-300">Proses pembayaran instruktur</p>
                      <Link
                        to="/payouts/pending"
                        className="inline-block bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 shadow-lg hover:shadow-xl"
                      >
                        Kelola Pembayaran
                      </Link>
                    </div>
                    <div className="group bg-gray-800/30 hover:bg-gray-700/40 rounded-2xl p-8 transition-all duration-300 border border-gray-600/20 hover:border-cyan-500/30 shadow-lg hover:shadow-xl hover:scale-105">
                      <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                        <AcademicCapIcon className="h-8 w-8 text-white" />
                      </div>
                      <h4 className="font-bold text-xl mb-3 text-white group-hover:text-cyan-400 transition-colors duration-300">Semua Instruktur</h4>
                      <p className="text-gray-400 group-hover:text-gray-300 mb-6 leading-relaxed transition-colors duration-300">Lihat dan kelola instruktur</p>
                      <Link
                        to="/instructors"
                        className="inline-block bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 shadow-lg hover:shadow-xl"
                      >
                        Lihat Instruktur
                      </Link>
                    </div>
                  </>
                )}

                {user.role === 'INSTRUCTOR' && (
                  <div className="group bg-gray-800/30 hover:bg-gray-700/40 rounded-2xl p-8 transition-all duration-300 border border-gray-600/20 hover:border-emerald-500/30 shadow-lg hover:shadow-xl hover:scale-105">
                    <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <ChartBarIcon className="h-8 w-8 text-white" />
                    </div>
                    <h4 className="font-bold text-xl mb-3 text-white group-hover:text-emerald-400 transition-colors duration-300">Pembayaran Saya</h4>
                    <p className="text-gray-400 group-hover:text-gray-300 mb-6 leading-relaxed transition-colors duration-300">Lihat dan kelola pendapatan</p>
                    <Link
                      to="/payout"
                      className="inline-block bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      Lihat Pembayaran
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </section>
        </main>
      </div>
    );
  }

  // If not authenticated, show welcome page
  return <Welcome />;
}
