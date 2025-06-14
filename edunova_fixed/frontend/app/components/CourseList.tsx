import { useEffect, useState } from 'react';
import { coursesAPI } from '../lib/courses';
import { enrollAPI } from '../lib/enroll';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../lib/axios';
import {
  FaSpinner,
  FaExclamationCircle,
  FaPlusCircle,
  FaStar,
  FaUsers,
  FaClock,
  FaBookOpen,
  FaGraduationCap,
  FaDollarSign,
  FaTags,
  FaUser,
  FaCheckCircle,
  FaHourglassHalf,
  FaPlay,
  FaSignInAlt,
  FaEye,
  FaHeart,
  FaChevronRight,
  FaRocket,
  FaTrophy,
  FaShieldAlt, 
  FaFire,
} from 'react-icons/fa';

export default function CoursesList() {
  const [courses, setCourses] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userEnrollments, setUserEnrollments] = useState<any[]>([]);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch courses
    coursesAPI
      .getAllQuizzes()
      .then((res) => {
        setCourses(res.data?.courses || []);
        setPagination(res.data?.pagination || null);
      })
      .catch((err) => {
        console.error('Failed to fetch courses:', err);
        setError('Gagal memuat daftar kursus. Silakan coba lagi.');
      })
      .finally(() => setLoading(false));

    // Fetch user enrollments jika user adalah STUDENT dan sudah login
    if (isAuthenticated && user?.role === 'STUDENT') {
      fetchUserEnrollments();
    }
  }, [user, isAuthenticated]);

  const fetchUserEnrollments = async () => {
    try {
      const res = await axiosInstance.get('/my-enrollments');
      setUserEnrollments(res.data.enrollments || []);
    } catch (err) {
      console.error('Failed to fetch user enrollments:', err);
    }
  };

  // Function untuk check apakah user sudah enroll course tertentu
  const isUserEnrolled = (courseId: number) => {
    return userEnrollments.some((enrollment) => enrollment.course?.id === courseId);
  };

  // Function untuk get enrollment status
  const getEnrollmentStatus = (courseId: number) => {
    const enrollment = userEnrollments.find((enrollment) => enrollment.course?.id === courseId);
    return enrollment;
  };

  // --- Kondisi Loading, Error, dan Tanpa Data ---
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-950 dark:to-indigo-950">
        <div className="text-center relative">
          <div className="relative mb-8">
            <div className="w-32 h-32 border-8 border-blue-100 dark:border-blue-900 rounded-full animate-spin border-t-blue-600 dark:border-t-blue-400 mx-auto"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-xl">
                <FaGraduationCap className="text-2xl text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 dark:border-gray-700/20">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3">Memuat Kursus Premium</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">Menyiapkan pengalaman belajar terbaik untuk Anda...</p>
            <div className="flex items-center justify-center space-x-2 text-blue-600 dark:text-blue-400">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-pink-50 to-rose-100 dark:from-gray-900 dark:via-red-950 dark:to-pink-950">
        <div className="text-center bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl p-12 rounded-3xl shadow-2xl border border-red-100/50 dark:border-red-800/50">
          <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
            <FaExclamationCircle className="text-3xl text-white" />
          </div>
          <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-3">Oops! Terjadi Kesalahan</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl font-semibold hover:from-red-600 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  // Filter kursus berdasarkan peran pengguna atau tampilkan semua jika belum login
  const filteredCourses = courses.filter((course) => {
    if (!isAuthenticated) {
      return course.status === 'PUBLISHED';
    }
    if (user?.role === 'INSTRUCTOR') {
      return course.instructorId === user.id;
    }
    if (user?.role === 'STUDENT') {
      return course.status === 'PUBLISHED';
    }
    return true;
  });

  if (filteredCourses.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-950 dark:to-indigo-950">
        <div className="text-center bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl p-16 rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/20 max-w-md">
          <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-indigo-200 dark:from-blue-900 dark:to-indigo-900 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
            <FaBookOpen className="text-5xl text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-200 dark:to-gray-400 bg-clip-text text-transparent mb-4">Belum Ada Kursus</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
            {!isAuthenticated ? 'Belum ada kursus tersedia saat ini. Silakan masuk untuk mengakses lebih banyak fitur.' : 'Mulai perjalanan belajar Anda dengan membuat kursus pertama'}
          </p>
          {!isAuthenticated ? (
            <div className="space-y-4">
              <Link
                to="/login"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl font-bold transition-all duration-300 ease-in-out transform hover:scale-105 shadow-xl hover:shadow-2xl"
              >
                <FaSignInAlt className="mr-3" /> Masuk Sekarang
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-2xl font-bold transition-all duration-300 ease-in-out transform hover:scale-105 shadow-xl hover:shadow-2xl ml-4"
              >
                <FaPlusCircle className="mr-3" /> Daftar Gratis
              </Link>
            </div>
          ) : (
            user?.role === 'INSTRUCTOR' && (
              <Link
                to="/course/create"
                className="inline-flex items-center px-10 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl font-bold transition-all duration-300 ease-in-out transform hover:scale-105 shadow-xl hover:shadow-2xl"
              >
                <FaPlusCircle className="mr-3 text-xl" /> Buat Kursus Premium
              </Link>
            )
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-950 dark:to-indigo-950">
      {/* Login prompt untuk user belum login */}
      {!isAuthenticated && (
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-transparent to-purple-600/20"></div>
          <div className="relative max-w-7xl mx-auto px-6 py-8 text-center">
            <div className="inline-flex items-center mb-4 px-6 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
              <FaRocket className="mr-2 text-yellow-300" />
              <span className="text-sm font-semibold">Akses Eksklusif Menanti!</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">🎓 Dapatkan Akses Penuh ke Semua Fitur Kursus!</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">Masuk sekarang untuk bergabung dengan kelas, mengikuti kuis, mendapatkan sertifikat, dan nikmati pengalaman belajar yang tak terbatas</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/login" className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-2xl font-bold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-xl">
                <FaSignInAlt className="mr-3" />
                Masuk Sekarang
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 shadow-xl"
              >
                <FaPlusCircle className="mr-3" />
                Daftar Gratis
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section yang Lebih Mewah */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-700 to-purple-800 dark:from-blue-800 dark:via-indigo-900 dark:to-purple-900">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/5 to-white/10 background-pattern"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-20 text-center">
          {/* Badge Premium */}
          <div className="inline-flex items-center mb-6 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 shadow-xl">
            <FaTrophy className="mr-2 text-yellow-300" />
            <span className="text-lg font-bold text-white">Platform Pembelajaran Premium</span>
            <FaShieldAlt className="ml-2 text-green-300" />
          </div>

          <h1 className="text-6xl md:text-7xl lg:text-8xl font-extrabold text-white mb-8 tracking-tight">
            Kursus
            <span className="block bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">Premium</span>
          </h1>

          <p className="text-2xl md:text-3xl font-light text-indigo-100 mb-4">Tingkatkan Karir Anda</p>

          <p className="text-xl text-indigo-200 max-w-4xl mx-auto mb-12 leading-relaxed">
            {!isAuthenticated
              ? 'Jelajahi ribuan kursus berkualitas tinggi dari instruktur terbaik. Daftar sekarang untuk mengakses semua fitur pembelajaran eksklusif!'
              : 'Bergabunglah dengan ribuan profesional yang telah meningkatkan karir mereka melalui kursus berkualitas tinggi dari instruktur terbaik dunia'}
          </p>

          {/* Stats dengan Design Premium */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
            <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">{filteredCourses.length}+</div>
              <div className="text-indigo-200 font-medium">Kursus Premium</div>
            </div>
            <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">50K+</div>
              <div className="text-indigo-200 font-medium">Siswa Aktif</div>
            </div>
            <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2 flex items-center justify-center">
                4.9 <FaStar className="ml-2 text-yellow-400" />
              </div>
              <div className="text-indigo-200 font-medium">Rating Rata-rata</div>
            </div>
            <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">100%</div>
              <div className="text-indigo-200 font-medium">Kepuasan</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Tombol Create - hanya untuk INSTRUCTOR yang sudah login */}
        {isAuthenticated && user?.role === 'INSTRUCTOR' && (
          <div className="mb-16 text-center">
            <div className="inline-block bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 dark:border-gray-700/20">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">Bagikan Keahlian Anda</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">Buat kursus premium dan mulai mengajar ribuan siswa di seluruh dunia</p>
              <Link
                to="/course/create"
                className="inline-flex items-center px-10 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl font-bold transition-all duration-300 ease-in-out transform hover:scale-105 shadow-xl hover:shadow-2xl"
              >
                <FaPlusCircle className="mr-3 text-xl" /> Buat Kursus Premium
              </Link>
            </div>
          </div>
        )}

        {/* Daftar Kursus dalam Grid Premium */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
          {filteredCourses.map((course) => {
            const enrollmentStatus = getEnrollmentStatus(course.id);
            const isEnrolled = isUserEnrolled(course.id);
            const isPaid = enrollmentStatus?.payment?.status === 'COMPLETED' || course.price === 0;
            const isPending = enrollmentStatus?.payment?.status === 'PENDING';

            return (
              <div
                key={course.id}
                className="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-white/20 dark:border-gray-700/20 transform hover:-translate-y-3"
              >
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-blue-500/20 group-hover:via-purple-500/20 group-hover:to-pink-500/20 rounded-3xl transition-all duration-500"></div>

                {/* Thumbnail dengan Overlay Premium */}
                <div className="relative overflow-hidden rounded-t-3xl">
                  <img src={course.thumbnail || 'https://via.placeholder.com/400x200.png?text=Thumbnail+Kursus'} alt={course.title || 'Kursus'} className="w-full h-56 object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  {/* Status Badge Premium */}
                  <div className="absolute top-6 right-6">
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-bold flex items-center backdrop-blur-sm border shadow-lg ${
                        course.status === 'PUBLISHED' ? 'bg-emerald-500/90 text-white border-emerald-400/50' : 'bg-yellow-500/90 text-white border-yellow-400/50'
                      }`}
                    >
                      {course.status === 'PUBLISHED' ? <FaCheckCircle className="mr-2" /> : <FaHourglassHalf className="mr-2" />}
                      {course.status === 'PUBLISHED' ? 'Terpublikasi' : 'Draft'}
                    </span>
                  </div>

                  {/* Price Badge Premium */}
                  <div className="absolute top-6 left-6">
                    <span className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm text-gray-800 dark:text-gray-200 px-4 py-2 rounded-full text-lg font-bold flex items-center shadow-lg border border-white/50 dark:border-gray-700/50">
                      <FaDollarSign className="mr-1 text-emerald-600 dark:text-emerald-400" />
                      {course.price?.toLocaleString?.('id-ID') ?? '0'}
                    </span>
                  </div>

                  {/* Enrollment Status Badge */}
                  {isAuthenticated && user?.role === 'STUDENT' && isEnrolled && (
                    <div className="absolute bottom-6 left-6">
                      <span
                        className={`px-4 py-2 rounded-full text-sm font-bold flex items-center backdrop-blur-sm border shadow-lg ${
                          isPaid ? 'bg-emerald-500/90 text-white border-emerald-400/50' : 'bg-amber-500/90 text-white border-amber-400/50'
                        }`}
                      >
                        <FaCheckCircle className="mr-2" />
                        {isPaid ? 'Terdaftar' : 'Menunggu Pembayaran'}
                      </span>
                    </div>
                  )}

                  {/* Preview Badge untuk user belum login */}
                  {!isAuthenticated && (
                    <div className="absolute bottom-6 left-6">
                      <span className="px-4 py-2 rounded-full text-sm font-bold flex items-center bg-blue-500/90 text-white border-blue-400/50 backdrop-blur-sm border shadow-lg">
                        <FaEye className="mr-2" />
                        Mode Pratinjau
                      </span>
                    </div>
                  )}

                  {/* Bestseller Badge */}
                  <div className="absolute top-6 left-1/2 transform -translate-x-1/2">
                    <span className="px-3 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold rounded-full flex items-center shadow-lg">
                      <FaFire className="mr-1" />
                      Populer
                    </span>
                  </div>
                </div>

                {/* Content Premium */}
                <div className="p-8 flex flex-col h-[calc(100%-14rem)]">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <FaStar key={i} className="w-4 h-4" />
                        ))}
                      </div>
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">(4.9)</span>
                    </div>
                    <button className="text-gray-400 hover:text-red-500 transition-colors duration-300">
                      <FaHeart className="w-5 h-5" />
                    </button>
                  </div>

                  <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">{course.title || 'Kursus Tanpa Judul'}</h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-6 line-clamp-3 leading-relaxed">{course.description || 'Tidak ada deskripsi yang tersedia.'}</p>

                  {/* Course Meta Info Premium */}
                  <div className="space-y-4 mb-8 text-sm">
                    <div className="flex items-center text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-xl">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mr-3">
                        <FaUser className="text-white text-xs" />
                      </div>
                      <div>
                        <span className="font-medium text-gray-800 dark:text-gray-200 block">{course.instructor?.name || 'Tidak diketahui'}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">Instruktur</span>
                      </div>
                    </div>

                    <div className="flex items-center text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-xl">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mr-3">
                        <FaTags className="text-white text-xs" />
                      </div>
                      <div>
                        <span className="font-medium text-gray-800 dark:text-gray-200 block line-clamp-1">{course.Categories?.map((c: any) => c.name).join(', ') || 'Tidak ada'}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">Kategori</span>
                      </div>
                    </div>

                    {course.Tags && course.Tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {course.Tags.slice(0, 3).map((tag: any, index: number) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 text-blue-700 dark:text-blue-300 rounded-full text-xs font-semibold border border-blue-200 dark:border-blue-800"
                          >
                            #{tag.name}
                          </span>
                        ))}
                        {course.Tags.length > 3 && (
                          <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full text-xs font-semibold border border-gray-200 dark:border-gray-600">+{course.Tags.length - 3} lainnya</span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons Premium */}
                  <div className="flex flex-col gap-3 mt-auto">
                    {/* Detail Button - tersedia untuk semua user termasuk yang belum login */}
                    <Link
                      to={`/courses/${course.id}`}
                      className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white rounded-2xl font-semibold transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg hover:shadow-xl group"
                    >
                      <FaEye className="mr-2 group-hover:scale-110 transition-transform duration-300" />
                      {!isAuthenticated ? 'Lihat Detail Kursus' : 'Detail Kursus'}
                      <FaChevronRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                    </Link>

                    {/* Buttons untuk user yang sudah login */}
                    {isAuthenticated && (user?.role === 'ADMIN' || user?.role === 'INSTRUCTOR') && (
                      <div className="grid grid-cols-3 gap-2">
                        <Link
                          to={`/courses/${course.id}/edit`}
                          className="px-3 py-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl text-sm font-medium transition-all duration-300 ease-in-out transform hover:scale-105 shadow-md hover:shadow-lg text-center"
                        >
                          Edit
                        </Link>
                        <Link
                          to={`/courses/${course.id}/status`}
                          className="px-3 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-xl text-sm font-medium transition-all duration-300 ease-in-out transform hover:scale-105 shadow-md hover:shadow-lg text-center"
                        >
                          Status
                        </Link>
                        <button
                          onClick={() => alert(`Fitur hapus untuk kursus ${course.title} belum diimplementasikan.`)}
                          className="px-3 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl text-sm font-medium transition-all duration-300 ease-in-out transform hover:scale-105 shadow-md hover:shadow-lg text-center"
                        >
                          Hapus
                        </button>
                      </div>
                    )}

                    {isAuthenticated && user?.role === 'INSTRUCTOR' && (
                      <Link
                        to={`/payouts/course/${course.id}/balance`}
                        className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-2xl font-semibold transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg hover:shadow-xl text-center flex items-center justify-center"
                      >
                        <FaDollarSign className="mr-2" />
                        Detail Penghasilan
                      </Link>
                    )}

                    {/* Buttons untuk STUDENT yang sudah login */}
                    {isAuthenticated && user?.role === 'STUDENT' && (
                      <>
                        {!isEnrolled ? (
                          <button
                            onClick={async () => {
                              try {
                                const res = await enrollAPI.enrollCourse(course.id);
                                const enrollmentId = res.data.enrollment?.id;
                                const needPayment = res.data.needsPayment;

                                if (enrollmentId && needPayment) {
                                  navigate(`/enrollments/${enrollmentId}/payment`);
                                } else {
                                  alert(res.data.message || 'Berhasil mendaftar kursus');
                                  fetchUserEnrollments();
                                }
                              } catch (error) {
                                console.error('Enroll failed:', error);
                                alert('Gagal mendaftar kursus');
                              }
                            }}
                            className="px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl font-bold transition-all duration-300 ease-in-out transform hover:scale-105 shadow-xl hover:shadow-2xl flex items-center justify-center group"
                          >
                            <FaGraduationCap className="mr-3 group-hover:scale-110 transition-transform duration-300" />
                            Daftar Sekarang
                            <FaRocket className="ml-3 group-hover:scale-110 transition-transform duration-300" />
                          </button>
                        ) : isPaid ? (
                          <Link
                            to={`/courses/${course.id}/lessons`}
                            className="px-6 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-2xl font-bold transition-all duration-300 ease-in-out transform hover:scale-105 shadow-xl hover:shadow-2xl flex items-center justify-center group"
                          >
                            <FaPlay className="mr-3 group-hover:scale-110 transition-transform duration-300" />
                            Mulai Belajar
                            <FaChevronRight className="ml-3 group-hover:translate-x-1 transition-transform duration-300" />
                          </Link>
                        ) : isPending ? (
                          <Link
                            to={`/enrollments/${enrollmentStatus.id}/payment`}
                            className="px-6 py-4 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-2xl font-bold transition-all duration-300 ease-in-out transform hover:scale-105 shadow-xl hover:shadow-2xl flex items-center justify-center group"
                          >
                            <FaDollarSign className="mr-3 group-hover:scale-110 transition-transform duration-300" />
                            Lanjutkan Pembayaran
                            <FaChevronRight className="ml-3 group-hover:translate-x-1 transition-transform duration-300" />
                          </Link>
                        ) : (
                          <button disabled className="px-6 py-4 bg-gray-500 text-white rounded-2xl font-bold flex items-center justify-center cursor-not-allowed opacity-60">
                            <FaCheckCircle className="mr-3" />
                            Sudah Terdaftar
                          </button>
                        )}
                      </>
                    )}

                    {/* CTA untuk user belum login */}
                    {!isAuthenticated && (
                      <div className="space-y-3">
                        <Link
                          to="/register"
                          className="w-full px-6 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-2xl font-bold transition-all duration-300 ease-in-out transform hover:scale-105 shadow-xl hover:shadow-2xl flex items-center justify-center group"
                        >
                          <FaGraduationCap className="mr-3 group-hover:scale-110 transition-transform duration-300" />
                          Daftar untuk Bergabung
                          <FaRocket className="ml-3 group-hover:scale-110 transition-transform duration-300" />
                        </Link>
                        <Link
                          to="/login"
                          className="w-full px-6 py-3 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white rounded-2xl font-semibold transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center group"
                        >
                          <FaSignInAlt className="mr-2 group-hover:scale-110 transition-transform duration-300" />
                          Sudah Punya Akun?
                          <FaChevronRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Enhanced Pagination Premium */}
        {pagination && (
          <div className="mt-20 flex flex-col items-center space-y-6">
            <div className="flex items-center gap-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl px-10 py-6 rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/20">
              <button
                disabled={!pagination.hasPrevPage}
                className={`flex items-center px-8 py-4 rounded-2xl font-bold transition-all duration-300 ease-in-out ${
                  pagination.hasPrevPage
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-xl hover:shadow-2xl transform hover:scale-105'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                }`}
              >
                <FaChevronRight className="rotate-180 mr-3" />
                Sebelumnya
              </button>

              <div className="text-center px-6">
                <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Halaman {pagination.currentPage}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">dari {pagination.totalPages} halaman</div>
              </div>

              <button
                disabled={!pagination.hasNextPage}
                className={`flex items-center px-8 py-4 rounded-2xl font-bold transition-all duration-300 ease-in-out ${
                  pagination.hasNextPage
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-xl hover:shadow-2xl transform hover:scale-105'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                }`}
              >
                Selanjutnya
                <FaChevronRight className="ml-3" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
