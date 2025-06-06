import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { coursesAPI } from '../lib/courses';
import { useAuth } from '../contexts/AuthContext';
// Import icons hanya jika benar-benar diperlukan dan seminimal mungkin
import { FaSpinner, FaExclamationCircle, FaClock, FaUsers, FaStar, FaGraduationCap, FaChevronRight, FaBookOpen } from 'react-icons/fa';

export default function DetailCourse() {
  const { id } = useParams();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    if (!id) {
      setError('ID kursus tidak ditemukan.');
      setLoading(false);
      return;
    }

    coursesAPI
      .getCourseById(Number(id))
      .then((res) => {
        setCourse(res.data.course);
      })
      .catch((err) => {
        console.error('Error fetching course:', err);
        setError('Gagal memuat detail kursus. Silakan coba lagi.');
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-6"></div>
            <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-blue-400 rounded-full animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl px-8 py-6 border border-white/20">
            <p className="text-xl font-medium text-white mb-2">Memuat detail kursus...</p>
            <p className="text-purple-200">Mohon tunggu sebentar</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-900 via-rose-900 to-red-900">
        <div className="text-center">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl px-8 py-8 border border-red-300/30">
            <FaExclamationCircle className="text-6xl text-red-400 mx-auto mb-4 drop-shadow-lg" />
            <p className="text-xl font-medium text-white">{error}</p>
            <Link to="/courses" className="inline-block mt-4 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-300 transform hover:scale-105">
              Kembali ke Daftar Kursus
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900">
        <div className="text-center">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl px-8 py-8 border border-white/20">
            <FaBookOpen className="text-6xl text-gray-400 mx-auto mb-4" />
            <p className="text-xl font-medium text-white">Kursus tidak ditemukan atau data tidak lengkap.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section with Parallax Effect */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/90 via-blue-900/80 to-indigo-900/90 z-10"></div>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-72 h-72 bg-purple-300 rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute top-20 right-0 w-96 h-96 bg-blue-300 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-indigo-300 rounded-full filter blur-3xl animate-pulse delay-2000"></div>
        </div>

        <div className="relative z-20 container mx-auto px-6 py-16">
          <div className="max-w-6xl mx-auto">
            {/* Course Header */}
            <div className="text-center mb-12">
              <h1 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent leading-tight">{course.title || 'Kursus Tanpa Judul'}</h1>
              <div className="flex items-center justify-center gap-6 text-purple-200 mb-8">
                <div className="flex items-center gap-2">
                  <FaStar className="text-yellow-400" />
                  <span className="font-semibold">{course.averageRating ? `${course.averageRating}` : 'Belum ada rating'}</span>
                </div>
                <div className="w-px h-6 bg-purple-300/50"></div>
                <div className="flex items-center gap-2">
                  <FaUsers className="text-blue-400" />
                  <span className="font-semibold">{course.totalEnrollments ?? 0} Peserta</span>
                </div>
                <div className="w-px h-6 bg-purple-300/50"></div>
                <div className="flex items-center gap-2">
                  <FaGraduationCap className="text-green-400" />
                  <span className="font-semibold">{course.instructor?.name || 'Instruktur'}</span>
                </div>
              </div>
            </div>

            {/* Course Image with Glass Effect */}
            <div className="relative group mb-16">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-3xl z-10"></div>
              <img
                src={course.thumbnail || 'https://via.placeholder.com/1200x600.png?text=Thumbnail+Kursus'}
                alt={course.title || 'Kursus'}
                className="w-full h-96 object-cover rounded-3xl shadow-2xl transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute bottom-6 left-6 z-20">
                <div className="bg-white/10 backdrop-blur-md rounded-xl px-6 py-3 border border-white/20">
                  <p className="text-3xl font-bold text-white">${course.price?.toLocaleString?.('id-ID') ?? '0'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative">
        <div className="container mx-auto px-6 pb-16">
          <div className="max-w-6xl mx-auto">
            {/* Course Info Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16 -mt-32 relative z-30">
              {/* Main Description Card */}
              <div className="lg:col-span-2">
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl p-8 h-full">
                  <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                    <FaBookOpen className="text-blue-400" />
                    Tentang Kursus
                  </h2>
                  <p className="text-lg text-gray-200 leading-relaxed">{course.description || 'Tidak ada deskripsi yang tersedia untuk kursus ini.'}</p>
                </div>
              </div>

              {/* Quick Info Sidebar */}
              <div className="space-y-6">
                {/* Status Card */}
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Status Kursus</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Status:</span>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          course.status === 'PUBLISHED' ? 'bg-green-500/20 text-green-300 border border-green-500/30' : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                        }`}
                      >
                        {course.status || 'DRAFT'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Categories & Tags Card */}
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Kategori & Tag</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-400 mb-2">Kategori:</p>
                      <div className="flex flex-wrap gap-2">
                        {course.Categories?.length > 0 ? (
                          course.Categories.map((cat: any, index: number) => (
                            <span key={index} className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm border border-purple-500/30">
                              {cat.name}
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-400 text-sm">Tidak ada</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-2">Tag:</p>
                      <div className="flex flex-wrap gap-2">
                        {course.Tags?.length > 0 ? (
                          course.Tags.map((tag: any, index: number) => (
                            <span key={index} className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm border border-blue-500/30">
                              {tag.name}
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-400 text-sm">Tidak ada</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Instructor Section */}
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl p-8 mb-12">
              <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                <FaGraduationCap className="text-purple-400" />
                Instruktur Kursus
              </h2>
              <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full p-1">
                    <img src={course.instructor?.profileImage || 'https://via.placeholder.com/120'} alt={course.instructor?.name || 'Instruktur'} className="w-32 h-32 rounded-full object-cover bg-gray-800" />
                  </div>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl font-bold text-white mb-2">{course.instructor?.name || 'Instruktur Tidak Diketahui'}</h3>
                  <p className="text-purple-300 mb-4 text-lg">{course.instructor?.email}</p>
                  <p className="text-gray-300 leading-relaxed mb-4">{course.instructor?.bio || 'Tidak ada bio yang tersedia.'}</p>
                  <div className="inline-block bg-white/10 backdrop-blur-md rounded-lg px-4 py-2 border border-white/20">
                    <p className="text-sm text-gray-300">
                      <span className="font-semibold text-white">Keahlian:</span> {course.instructor?.expertise?.join(', ') || 'Tidak disebutkan'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Course Content Section */}
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl p-8 mb-12">
              <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                <FaBookOpen className="text-green-400" />
                Konten Kursus
              </h2>
              {course.Sections?.length > 0 ? (
                <div className="space-y-6">
                  {course.Sections.sort((a: any, b: any) => a.order - b.order).map((section: any, index: number) => (
                    <div key={section.id} className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden">
                      <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 p-6 border-b border-white/10">
                        <h3 className="text-xl font-bold text-white flex items-center gap-3">
                          <span className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">{index + 1}</span>
                          {section.title}
                        </h3>
                      </div>
                      <div className="p-6">
                        {section.Lessons?.length > 0 ? (
                          <ul className="space-y-3">
                            {section.Lessons.sort((a: any, b: any) => a.order - b.order).map((lesson: any, lessonIndex: number) => (
                              <li key={lesson.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all duration-300">
                                <div className="flex items-center gap-3">
                                  <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">{lessonIndex + 1}</span>
                                  <span className="text-gray-200 font-medium">{lesson.title}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-400">
                                  <FaClock />
                                  <span>{Math.floor(lesson.duration / 60)} menit</span>
                                </div>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-gray-400 italic text-center py-8">Belum ada pelajaran di bagian ini.</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <FaBookOpen className="text-6xl text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg">Belum ada konten yang ditambahkan ke kursus ini.</p>
                </div>
              )}
            </div>

            {/* Reviews Section */}
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl p-8 mb-12">
              <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                <FaStar className="text-yellow-400" />
                Ulasan Peserta
              </h2>
              {course.Reviews?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {course.Reviews.map((review: any) => (
                    <div key={review.id} className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 hover:bg-white/10 transition-all duration-300">
                      <div className="flex items-center gap-4 mb-4">
                        <img src={review.user?.profileImage || 'https://via.placeholder.com/48'} alt={review.user?.name || 'Pengguna'} className="w-12 h-12 rounded-full object-cover border-2 border-purple-400/50" />
                        <div className="flex-1">
                          <h4 className="font-semibold text-white">{review.user?.name || 'Pengguna Anonim'}</h4>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <FaStar key={i} className={`text-sm ${i < review.rating ? 'text-yellow-400' : 'text-gray-600'}`} />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-300 leading-relaxed">"{review.comment}"</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <FaStar className="text-6xl text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg">Belum ada ulasan untuk kursus ini.</p>
                </div>
              )}
            </div>

            {/* Action Buttons for Admin/Instructor */}
            {(user?.role === 'ADMIN' || user?.role === 'INSTRUCTOR') && (
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6 text-center">Panel Manajemen Kursus</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Link
                    to={`/courses/${course.id}/edit`}
                    className="group flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    <FaBookOpen className="group-hover:rotate-12 transition-transform duration-300" />
                    <span>Edit Kursus</span>
                    <FaChevronRight className="ml-auto group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>

                  <Link
                    to={`/courses/${course.id}/categories`}
                    className="group flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    <FaBookOpen className="group-hover:rotate-12 transition-transform duration-300" />
                    <span>Atur Kategori</span>
                    <FaChevronRight className="ml-auto group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>

                  <Link
                    to={`/courses/${course.id}/tags`}
                    className="group flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    <FaBookOpen className="group-hover:rotate-12 transition-transform duration-300" />
                    <span>Atur Tag</span>
                    <FaChevronRight className="ml-auto group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>

                  <Link
                    to={`/courses/${course.id}/analytics`}
                    className="group flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    <FaBookOpen className="group-hover:rotate-12 transition-transform duration-300" />
                    <span>Analitik Umum</span>
                    <FaChevronRight className="ml-auto group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>

                  <Link
                    to={`/courses/${course.id}/analytics/enrollments`}
                    className="group flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    <FaUsers className="group-hover:rotate-12 transition-transform duration-300" />
                    <span>Analitik Pendaftaran</span>
                    <FaChevronRight className="ml-auto group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>

                  <Link
                    to={`/courses/${course.id}/analytics/revenue`}
                    className="group flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    <FaStar className="group-hover:rotate-12 transition-transform duration-300" />
                    <span>Analitik Pendapatan</span>
                    <FaChevronRight className="ml-auto group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
