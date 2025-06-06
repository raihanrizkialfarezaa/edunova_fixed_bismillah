import { useEffect, useState } from 'react';
import { coursesAPI } from '../lib/courses';
import { enrollAPI } from '../lib/enroll';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../lib/axios';
// import { Dialog } from '@headlessui/react';
import { FaSpinner, FaExclamationCircle, FaPlusCircle, FaStar, FaUsers, FaClock, FaBookOpen, FaGraduationCap, FaDollarSign, FaTags, FaUser, FaCheckCircle, FaHourglassHalf, FaPlay, FaSignInAlt, FaEye } from 'react-icons/fa'; // Tambah FaSignInAlt dan FaEye

export default function CoursesList() {
  const [courses, setCourses] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(''); // Tambahkan state error
  const [userEnrollments, setUserEnrollments] = useState<any[]>([]); // State untuk menyimpan enrollment user
  const { user, isAuthenticated } = useAuth(); // Tambah isAuthenticated
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
        setError('Gagal memuat daftar kursus. Silakan coba lagi.'); // Pesan error yang lebih user-friendly
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-indigo-200 dark:border-indigo-700 rounded-full animate-spin border-t-indigo-600 dark:border-t-indigo-400 mx-auto mb-6"></div>
            <FaGraduationCap className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl text-indigo-600 dark:text-indigo-400" />
          </div>
          <p className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Memuat Kursus Premium</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Menyiapkan pengalaman belajar terbaik untuk Anda...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-red-900">
        <div className="text-center bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-red-100 dark:border-red-800">
          <FaExclamationCircle className="text-6xl text-red-500 dark:text-red-400 mx-auto mb-4" />
          <p className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">Oops! Terjadi Kesalahan</p>
          <p className="text-gray-600 dark:text-gray-300">{error}</p>
        </div>
      </div>
    );
  }

  // Filter kursus berdasarkan peran pengguna atau tampilkan semua jika belum login
  const filteredCourses = courses.filter((course) => {
    if (!isAuthenticated) {
      // Jika belum login, tampilkan semua kursus yang PUBLISHED
      return course.status === 'PUBLISHED';
    }

    if (user?.role === 'INSTRUCTOR') {
      return course.instructorId === user.id;
    }
    if (user?.role === 'STUDENT') {
      return course.status === 'PUBLISHED';
    }
    return true; // ADMIN melihat semua kursus
  });

  if (filteredCourses.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900">
        <div className="text-center bg-white dark:bg-gray-800 p-12 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 max-w-md">
          <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaBookOpen className="text-4xl text-indigo-600 dark:text-indigo-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">Belum Ada Kursus</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{!isAuthenticated ? 'Belum ada kursus tersedia saat ini. Silakan login untuk mengakses lebih banyak fitur.' : 'Mulai perjalanan belajar Anda dengan membuat kursus pertama'}</p>
          {!isAuthenticated ? (
            <div className="space-y-3">
              <Link
                to="/login"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <FaSignInAlt className="mr-2" /> Masuk
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-semibold transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg hover:shadow-xl ml-3"
              >
                <FaPlusCircle className="mr-2" /> Daftar
              </Link>
            </div>
          ) : (
            user?.role === 'INSTRUCTOR' && (
              <Link
                to="/course/create"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <FaPlusCircle className="mr-3 text-lg" /> Buat Kursus Premium
              </Link>
            )
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900">
      {/* Login prompt untuk user belum login */}
      {!isAuthenticated && (
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <p className="text-lg font-semibold mb-2">🎓 Dapatkan akses penuh ke semua fitur kursus!</p>
            <p className="text-blue-100 mb-4">Login sekarang untuk bergabung dengan kelas, mengikuti kuis, dan mendapatkan sertifikat</p>
            <div className="space-x-4">
              <Link to="/login" className="inline-flex items-center px-6 py-2 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300">
                <FaSignInAlt className="mr-2" />
                Masuk
              </Link>
              <Link to="/register" className="inline-flex items-center px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-colors duration-300">
                <FaPlusCircle className="mr-2" />
                Daftar Gratis
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 dark:from-indigo-800 dark:via-purple-800 dark:to-indigo-900">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-16 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
            Kursus Premium
            <span className="block text-3xl md:text-4xl font-light mt-2 text-indigo-200">Tingkatkan Karir Anda</span>
          </h1>
          <p className="text-xl text-indigo-100 max-w-3xl mx-auto mb-8 leading-relaxed">
            {!isAuthenticated
              ? 'Jelajahi ribuan kursus berkualitas tinggi. Daftar sekarang untuk mengakses semua fitur pembelajaran!'
              : 'Bergabunglah dengan ribuan profesional yang telah meningkatkan karir mereka melalui kursus berkualitas tinggi dari instruktur terbaik'}
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mt-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">{filteredCourses.length}+</div>
              <div className="text-indigo-200">Kursus Tersedia</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">50K+</div>
              <div className="text-indigo-200">Siswa Aktif</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">4.8</div>
              <div className="text-indigo-200 flex items-center">
                <FaStar className="mr-1" /> Rating
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Tombol Create - hanya untuk INSTRUCTOR yang sudah login */}
        {isAuthenticated && user?.role === 'INSTRUCTOR' && (
          <div className="mb-12 text-center">
            <Link
              to="/course/create"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <FaPlusCircle className="mr-3 text-lg" /> Buat Kursus Premium
            </Link>
          </div>
        )}

        {/* Daftar Kursus dalam Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredCourses.map((course) => {
            const enrollmentStatus = getEnrollmentStatus(course.id);
            const isEnrolled = isUserEnrolled(course.id);
            const isPaid = enrollmentStatus?.payment?.status === 'COMPLETED' || course.price === 0;
            const isPending = enrollmentStatus?.payment?.status === 'PENDING';

            return (
              <div key={course.id} className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 dark:border-gray-700 transform hover:-translate-y-2">
                {/* Thumbnail dengan Overlay */}
                <div className="relative overflow-hidden">
                  <img src={course.thumbnail || 'https://via.placeholder.com/400x200.png?text=Thumbnail+Kursus'} alt={course.title || 'Kursus'} className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  {/* Status Badge */}
                  <div className="absolute top-4 right-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center ${
                        course.status === 'PUBLISHED' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      }`}
                    >
                      {course.status === 'PUBLISHED' ? <FaCheckCircle className="mr-1" /> : <FaHourglassHalf className="mr-1" />}
                      {course.status || 'Draft'}
                    </span>
                  </div>

                  {/* Price Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-gray-800 dark:text-gray-200 px-3 py-1 rounded-full text-sm font-bold flex items-center">
                      <FaDollarSign className="mr-1 text-green-600 dark:text-green-400" />
                      {course.price?.toLocaleString?.('id-ID') ?? '0'}
                    </span>
                  </div>

                  {/* Enrollment Status Badge - hanya untuk user yang sudah login */}
                  {isAuthenticated && user?.role === 'STUDENT' && isEnrolled && (
                    <div className="absolute bottom-4 left-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center ${
                          isPaid ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        }`}
                      >
                        <FaCheckCircle className="mr-1" />
                        {isPaid ? 'Enrolled' : 'Payment Pending'}
                      </span>
                    </div>
                  )}

                  {/* Preview Badge untuk user belum login */}
                  {!isAuthenticated && (
                    <div className="absolute bottom-4 left-4">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold flex items-center bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                        <FaEye className="mr-1" />
                        Preview Mode
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col h-[calc(100%-12rem)]">
                  <h2 className="text-xl font-bold mb-3 text-gray-900 dark:text-gray-100 line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300">{course.title || 'Kursus Tanpa Judul'}</h2>

                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-3 leading-relaxed">{course.description || 'Tidak ada deskripsi yang tersedia.'}</p>

                  {/* Course Meta Info */}
                  <div className="space-y-3 mb-6 text-sm">
                    <div className="flex items-center text-gray-600 dark:text-gray-300">
                      <FaUser className="mr-2 text-indigo-500" />
                      <span className="font-medium">Instruktur:</span>
                      <span className="ml-1 text-gray-800 dark:text-gray-200">{course.instructor?.name || 'Tidak diketahui'}</span>
                    </div>

                    <div className="flex items-center text-gray-600 dark:text-gray-300">
                      <FaTags className="mr-2 text-purple-500" />
                      <span className="font-medium">Kategori:</span>
                      <span className="ml-1 text-gray-800 dark:text-gray-200 line-clamp-1">{course.Categories?.map((c: any) => c.name).join(', ') || 'Tidak ada'}</span>
                    </div>

                    {course.Tags && course.Tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {course.Tags.slice(0, 3).map((tag: any, index: number) => (
                          <span key={index} className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded-full text-xs font-medium">
                            {tag.name}
                          </span>
                        ))}
                        {course.Tags.length > 3 && <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full text-xs">+{course.Tags.length - 3}</span>}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {/* Detail Button - tersedia untuk semua user termasuk yang belum login */}
                    <Link
                      to={`/courses/${course.id}`}
                      className="flex-1 min-w-[100px] px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg text-sm font-medium transition-all duration-300 ease-in-out transform hover:scale-105 shadow-md hover:shadow-lg text-center"
                    >
                      <FaEye className="inline mr-1" />
                      {!isAuthenticated ? 'Lihat Detail' : 'Detail'}
                    </Link>

                    {/* Buttons untuk user yang sudah login */}
                    {isAuthenticated && (user?.role === 'ADMIN' || user?.role === 'INSTRUCTOR') && (
                      <>
                        <Link
                          to={`/courses/${course.id}/edit`}
                          className="flex-1 min-w-[80px] px-3 py-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-lg text-sm font-medium transition-all duration-300 ease-in-out transform hover:scale-105 shadow-md hover:shadow-lg text-center"
                        >
                          Edit
                        </Link>
                        <Link
                          to={`/courses/${course.id}/status`}
                          className="flex-1 min-w-[80px] px-3 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white rounded-lg text-sm font-medium transition-all duration-300 ease-in-out transform hover:scale-105 shadow-md hover:shadow-lg text-center"
                        >
                          Status
                        </Link>
                        <button
                          onClick={() => alert(`Fitur hapus untuk kursus ${course.title} belum diimplementasikan.`)}
                          className="flex-1 min-w-[80px] px-3 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg text-sm font-medium transition-all duration-300 ease-in-out transform hover:scale-105 shadow-md hover:shadow-lg text-center"
                        >
                          Hapus
                        </button>
                      </>
                    )}

                    {isAuthenticated && user?.role === 'INSTRUCTOR' && (
                      <Link
                        to={`/payouts/course/${course.id}/balance`}
                        className="w-full px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg text-sm font-medium transition-all duration-300 ease-in-out transform hover:scale-105 shadow-md hover:shadow-lg text-center mt-2"
                      >
                        💰 Detail Payout
                      </Link>
                    )}

                    {/* Buttons untuk STUDENT yang sudah login */}
                    {isAuthenticated && user?.role === 'STUDENT' && (
                      <>
                        {!isEnrolled ? (
                          // Button untuk enroll baru
                          <button
                            onClick={async () => {
                              try {
                                const res = await enrollAPI.enrollCourse(course.id);
                                const enrollmentId = res.data.enrollment?.id;
                                const needPayment = res.data.needsPayment;

                                if (enrollmentId && needPayment) {
                                  navigate(`/enrollments/${enrollmentId}/payment`);
                                } else {
                                  alert(res.data.message || 'Enrollment berhasil');
                                  // Refresh enrollment data setelah enroll
                                  fetchUserEnrollments();
                                }
                              } catch (error) {
                                console.error('Enroll failed:', error);
                                alert('Gagal enroll course');
                              }
                            }}
                            className="w-full px-4 py-3 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white rounded-lg text-sm font-semibold transition-all duration-300 ease-in-out transform hover:scale-105 shadow-md hover:shadow-lg mt-2 flex items-center justify-center"
                          >
                            <FaGraduationCap className="mr-2" />
                            Enroll Sekarang
                          </button>
                        ) : isPaid ? (
                          // Button untuk mulai belajar jika sudah dibayar
                          <Link
                            to={`/courses/${course.id}/lessons`}
                            className="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg text-sm font-semibold transition-all duration-300 ease-in-out transform hover:scale-105 shadow-md hover:shadow-lg mt-2 flex items-center justify-center"
                          >
                            <FaPlay className="mr-2" />
                            Mulai Belajar
                          </Link>
                        ) : isPending ? (
                          // Button untuk melanjutkan pembayaran
                          <Link
                            to={`/enrollments/${enrollmentStatus.id}/payment`}
                            className="w-full px-4 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white rounded-lg text-sm font-semibold transition-all duration-300 ease-in-out transform hover:scale-105 shadow-md hover:shadow-lg mt-2 flex items-center justify-center"
                          >
                            <FaDollarSign className="mr-2" />
                            Lanjutkan Pembayaran
                          </Link>
                        ) : (
                          // Fallback button untuk status enrolled tapi belum jelas pembayarannya
                          <button disabled className="w-full px-4 py-3 bg-gray-500 text-white rounded-lg text-sm font-semibold mt-2 flex items-center justify-center cursor-not-allowed opacity-60">
                            <FaCheckCircle className="mr-2" />
                            Sudah Terdaftar
                          </button>
                        )}
                      </>
                    )}

                    {/* CTA untuk user belum login */}
                    {!isAuthenticated && (
                      <div className="w-full mt-2 space-y-2">
                        <Link
                          to="/register"
                          className="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg text-sm font-semibold transition-all duration-300 ease-in-out transform hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center"
                        >
                          <FaGraduationCap className="mr-2" />
                          Daftar untuk Bergabung
                        </Link>
                        <Link
                          to="/login"
                          className="w-full px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white rounded-lg text-sm font-medium transition-all duration-300 ease-in-out transform hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center"
                        >
                          <FaSignInAlt className="mr-2" />
                          Sudah Punya Akun?
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Enhanced Pagination */}
        {pagination && (
          <div className="mt-16 flex flex-col items-center space-y-4">
            <div className="flex items-center gap-6 bg-white dark:bg-gray-800 px-8 py-4 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
              <button
                disabled={!pagination.hasPrevPage}
                className={`flex items-center px-6 py-3 rounded-xl font-semibold transition-all duration-300 ease-in-out ${
                  pagination.hasPrevPage
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-md hover:shadow-lg transform hover:scale-105'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                }`}
              >
                ← Sebelumnya
              </button>

              <div className="text-center">
                <div className="text-lg font-bold text-gray-800 dark:text-gray-200">Halaman {pagination.currentPage}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">dari {pagination.totalPages} halaman</div>
              </div>

              <button
                disabled={!pagination.hasNextPage}
                className={`flex items-center px-6 py-3 rounded-xl font-semibold transition-all duration-300 ease-in-out ${
                  pagination.hasNextPage
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-md hover:shadow-lg transform hover:scale-105'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                }`}
              >
                Selanjutnya →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
