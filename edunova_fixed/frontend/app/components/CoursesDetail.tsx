import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { coursesAPI } from '../lib/courses';
import { useAuth } from '../contexts/AuthContext';
// Import icons hanya jika benar-benar diperlukan dan seminimal mungkin
import { FaSpinner, FaExclamationCircle } from 'react-icons/fa'; // Untuk loading/error

export default function DetailCourse() {
  const { id } = useParams();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(''); // Tambahkan state error
  const { user } = useAuth();

  useEffect(() => {
    if (!id) {
      setError('ID kursus tidak ditemukan.');
      setLoading(false);
      return;
    }

    coursesAPI.getCourseById(Number(id))
      .then((res) => {
        setCourse(res.data.course);
      })
      .catch((err) => {
        console.error('Error fetching course:', err);
        setError('Gagal memuat detail kursus. Silakan coba lagi.'); // Pesan error yang lebih user-friendly
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-center text-gray-700 dark:text-gray-300">
          <FaSpinner className="animate-spin text-5xl text-indigo-600 dark:text-indigo-400 mx-auto mb-4" />
          <p className="text-lg font-medium">Memuat detail kursus...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-center text-red-600 dark:text-red-400">
          <FaExclamationCircle className="text-5xl mx-auto mb-4" />
          <p className="text-lg font-medium">{error}</p>
        </div>
      </div>
    );
  }

  if (!course) {
    // Ini mungkin terjadi jika API mengembalikan 200 OK tapi data course null/kosong
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-center text-gray-700 dark:text-gray-300">
          <p className="text-lg font-medium">Kursus tidak ditemukan atau data tidak lengkap.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
        <h1 className="text-4xl font-extrabold mb-6 text-indigo-700 dark:text-indigo-400 text-center">
          {course.title || 'Kursus Tanpa Judul'}
        </h1>

        <img
          src={course.thumbnail || 'https://via.placeholder.com/800x400.png?text=Thumbnail+Kursus'} // Fallback thumbnail
          alt={course.title || 'Kursus'}
          className="w-full h-72 object-cover rounded-lg mb-6 shadow-md"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mb-6 text-lg">
          <div className="col-span-full">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-justify">
              {course.description || 'Tidak ada deskripsi yang tersedia untuk kursus ini.'}
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm">
            <p className="font-semibold text-gray-800 dark:text-gray-100">Harga:</p>
            <p className="text-xl font-bold text-green-600 dark:text-green-400">
              $ {course.price?.toLocaleString?.('id-ID') ?? '0'}
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm">
            <p className="font-semibold text-gray-800 dark:text-gray-100">Kategori:</p>
            <p className="text-gray-700 dark:text-gray-300">
              {course.Categories?.map((cat: any) => cat.name).join(', ') || 'Tidak ada'}
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm">
            <p className="font-semibold text-gray-800 dark:text-gray-100">Tag:</p>
            <p className="text-gray-700 dark:text-gray-300">
              {course.Tags?.map((tag: any) => tag.name).join(', ') || 'Tidak ada'}
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm">
            <p className="font-semibold text-gray-800 dark:text-gray-100">Status Publish:</p>
            <p className="text-gray-700 dark:text-gray-300">
              {course.status || '-'}
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm">
            <p className="font-semibold text-gray-800 dark:text-gray-100">Rating Rata-Rata:</p>
            <p className="text-gray-700 dark:text-gray-300">
              {course.averageRating ? `${course.averageRating} ⭐` : 'Belum ada'}
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm">
            <p className="font-semibold text-gray-800 dark:text-gray-100">Total Pendaftar:</p>
            <p className="text-gray-700 dark:text-gray-300">
              {course.totalEnrollments ?? 0}
            </p>
          </div>
        </div>

        {/* Instructor Section */}
        <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-md mb-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">Instruktur</h2>
          <div className="flex items-center gap-6">
            <img
              src={course.instructor?.profileImage || 'https://via.placeholder.com/80'} // Fallback instructor image
              alt={course.instructor?.name || 'Instruktur'}
              className="w-24 h-24 rounded-full object-cover border-4 border-indigo-300 dark:border-indigo-600 shadow-md"
            />
            <div>
              <p className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                {course.instructor?.name || 'Instruktur Tidak Diketahui'}
              </p>
              <p className="text-md text-gray-600 dark:text-gray-300">
                {course.instructor?.email}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 italic mt-2">
                {course.instructor?.bio || 'Tidak ada bio yang tersedia.'}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Keahlian: {course.instructor?.expertise?.join(', ') || '-'}
              </p>
            </div>
          </div>
        </div>

        {/* Sections and Lessons */}
        <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-md mb-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">Sections Kursus</h2>
          {course.Sections?.length > 0 ? (
            <div className="space-y-4">
              {course.Sections
                .sort((a: any, b: any) => a.order - b.order)
                .map((section: any) => (
                  <div key={section.id} className="bg-gray-100 dark:bg-gray-600 p-5 rounded-lg shadow-sm">
                    <h3 className="font-bold text-xl mb-3 text-gray-800 dark:text-gray-100">{section.title}</h3>
                    {section.Lessons?.length > 0 ? (
                      <ul className="list-none space-y-2 text-gray-700 dark:text-gray-200">
                        {section.Lessons
                          .sort((a: any, b: any) => a.order - b.order)
                          .map((lesson: any) => (
                            <li key={lesson.id} className="flex items-center">
                                {/* Optional: Add a small circle icon or just use a dash */}
                                <span className="mr-2 text-indigo-500 dark:text-indigo-300">•</span>
                                <span>
                                  {lesson.title} — Durasi: {Math.floor(lesson.duration / 60)} menit
                                </span>
                            </li>
                          ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500 italic">Belum ada pelajaran di bagian ini.</p>
                    )}
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 italic">Belum ada sections yang ditambahkan ke kursus ini.</p>
          )}
        </div>

        {/* Reviews Section */}
        <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-md mb-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">Ulasan Pelanggan</h2>
          {course.Reviews?.length > 0 ? (
            <div className="space-y-4">
              {course.Reviews.map((review: any) => (
                <div key={review.id} className="bg-gray-100 dark:bg-gray-600 p-5 rounded-lg shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <img
                      src={review.user?.profileImage || 'https://via.placeholder.com/32'} // Fallback user image
                      alt={review.user?.name || 'Pengguna'}
                      className="w-10 h-10 rounded-full object-cover border-2 border-green-300 dark:border-green-600"
                    />
                    <span className="font-semibold text-lg text-gray-800 dark:text-gray-100">{review.user?.name || 'Pengguna Anonim'}</span>
                    <span className="ml-auto text-yellow-500 font-bold text-lg">{review.rating} ⭐</span>
                  </div>
                  <p className="text-base text-gray-700 dark:text-gray-200 leading-relaxed">"{review.comment}"</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 italic">Belum ada ulasan untuk kursus ini.</p>
          )}
        </div>

        {/* Action Buttons */}
        {(user?.role === 'ADMIN' || user?.role === 'INSTRUCTOR') && (
          <div className="flex flex-wrap gap-4 mt-8 justify-center">
            <Link
              to={`/courses/${course.id}/edit`}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition duration-300 ease-in-out transform hover:scale-105 shadow-md"
            >
              Edit Kursus
            </Link>
            
            <Link
              to={`/courses/${course.id}/categories`}
              className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold transition duration-300 ease-in-out transform hover:scale-105 shadow-md"
            >
              Atur Kategori
            </Link>
            <Link
              to={`/courses/${course.id}/tags`}
              className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold transition duration-300 ease-in-out transform hover:scale-105 shadow-md"
            >
              Atur Tag
            </Link>
            <Link
              to={`/courses/${course.id}/analytics`}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition duration-300 ease-in-out transform hover:scale-105 shadow-md"
            >
              Lihat Analitik Umum
            </Link>
             <Link
              to={`/courses/${course.id}/analytics/enrollments`}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition duration-300 ease-in-out transform hover:scale-105 shadow-md"
            >
              Lihat Analitik Pendaftaran
            </Link>
            <Link
              to={`/courses/${course.id}/analytics/revenue`}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition duration-300 ease-in-out transform hover:scale-105 shadow-md"
            >
              Lihat Analitik Pendapatan
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}