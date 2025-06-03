import { useEffect, useState } from 'react';
import { coursesAPI } from '../lib/courses';
import { enrollAPI } from '../lib/enroll';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
// import { Dialog } from '@headlessui/react';
import { FaSpinner, FaExclamationCircle, FaPlusCircle } from 'react-icons/fa'; // Untuk loading/error dan tombol create

export default function CoursesList() {
  const [courses, setCourses] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(''); // Tambahkan state error
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Perbaiki asumsi API: coursesAPI.getAllCourses() lebih masuk akal untuk daftar kursus
    coursesAPI.getAllQuizzes()
      .then((res) => {
        setCourses(res.data?.courses || []);
        setPagination(res.data?.pagination || null);
      })
      .catch((err) => {
        console.error('Failed to fetch courses:', err);
        setError('Gagal memuat daftar kursus. Silakan coba lagi.'); // Pesan error yang lebih user-friendly
      })
      .finally(() => setLoading(false));
  }, []);

  // --- Kondisi Loading, Error, dan Tanpa Data ---
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-center text-gray-700 dark:text-gray-300">
          <FaSpinner className="animate-spin text-5xl text-indigo-600 dark:text-indigo-400 mx-auto mb-4" />
          <p className="text-lg font-medium">Memuat daftar kursus...</p>
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

  // Filter kursus berdasarkan peran pengguna
  const filteredCourses = courses.filter(course => {
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
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-center text-gray-700 dark:text-gray-300">
          <p className="text-lg font-medium">Tidak ada kursus yang ditemukan.</p>
          {user?.role === 'INSTRUCTOR' && (
             <Link
                to="/course/create"
                className="mt-4 inline-flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition duration-300 ease-in-out transform hover:scale-105 shadow-md"
              >
                <FaPlusCircle className="mr-2" /> Buat Kursus Baru
              </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-8 text-indigo-700 dark:text-indigo-400 text-center">
          Daftar Kursus
        </h1>

        {/* Tombol Create */}
        {user?.role === 'INSTRUCTOR' && ( // Hanya instruktur yang bisa membuat kursus
          <div className="mb-8 text-center">
            <Link
              to="/course/create"
              className="inline-flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition duration-300 ease-in-out transform hover:scale-105 shadow-md"
            >
              <FaPlusCircle className="mr-2" /> Buat Kursus Baru
            </Link>
          </div>
        )}
        
        {/* Daftar Kursus dalam Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course) => (
            <div key={course.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col transform transition duration-300 hover:scale-[1.02] hover:shadow-xl">
              <img
                src={course.thumbnail || 'https://via.placeholder.com/400x200.png?text=Thumbnail+Kursus'} // Fallback thumbnail
                alt={course.title || 'Kursus'}
                className="w-full h-48 object-cover rounded-lg mb-4 shadow-sm"
              />
              <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100 truncate">
                {course.title || 'Kursus Tanpa Judul'}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-3">
                {course.description || 'Tidak ada deskripsi yang tersedia.'}
              </p>
              
              {/* Detail Kursus */}
              <div className="text-sm text-gray-700 dark:text-gray-200 space-y-1 mt-auto"> {/* mt-auto pushes content to bottom */}
                <p><span className="font-semibold">Harga:</span> <span className="text-green-600 dark:text-green-400 font-bold">$ {course.price?.toLocaleString?.('id-ID') ?? '0'}</span></p>
                <p><span className="font-semibold">Kategori:</span> {course.Categories?.map((c: any) => c.name).join(', ') || 'Tidak ada'}</p>
                <p><span className="font-semibold">Tag:</span> {course.Tags?.map((t: any) => t.name).join(', ') || 'Tidak ada'}</p>
                <p className="mt-2"><span className="font-semibold">Instruktur:</span> {course.instructor?.name || 'Tidak diketahui'}</p>
                <p><span className="font-semibold">Status:</span> <span className={`${course.status === 'PUBLISHED' ? 'text-teal-500' : 'text-yellow-500'}`}>{course.status || '-'}</span></p>
              </div>

              {/* Tombol Aksi per Kursus */}
              <div className="flex flex-wrap gap-3 mt-6 justify-start">
                {(user?.role === 'STUDENT' || user?.role === 'ADMIN' || user?.role === 'INSTRUCTOR') && (
                  <Link
                    to={`/courses/${course.id}`}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition duration-300 ease-in-out transform hover:scale-105 shadow-md"
                  >
                    Detail
                  </Link>
                )}

                {(user?.role === 'ADMIN' || user?.role === 'INSTRUCTOR') && (
                  <>
                    <Link
                      to={`/courses/${course.id}/edit`}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md text-sm font-medium transition duration-300 ease-in-out transform hover:scale-105 shadow-md"
                    >
                      Edit
                    </Link>
                    <Link
                      to={`/courses/${course.id}/status`}
                      className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-md text-sm font-medium transition duration-300 ease-in-out transform hover:scale-105 shadow-md"
                    >
                      Perbarui Status
                    </Link>
                    {/* Placeholder for delete, consider using a modal for confirmation */}
                    <button
                      onClick={() => alert(`Fitur hapus untuk kursus ${course.title} belum diimplementasikan.`)}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium transition duration-300 ease-in-out transform hover:scale-105 shadow-md"
                    >
                      Hapus
                    </button>
                  </>
                )}

                {(user?.role === 'INSTRUCTOR') && (
                  <Link
                    to={`/payouts/course/${course.id}/balance`}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-medium transition duration-300 ease-in-out transform hover:scale-105 shadow-md"
                  >
                    Detail Payout
                  </Link>
                )}

                {user?.role === 'STUDENT' && (
                  <button
                    onClick={async () => {
                      try {
                        const res = await enrollAPI.enrollCourse(course.id);
                        const enrollmentId = res.data.enrollment?.id;
                        const needPayment = res.data.needsPayment;

                        if (enrollmentId && needPayment) {
                          navigate(`/enrollments/${enrollmentId}/payment`);
                        } else {
                          // Optional: show a message or refresh course list
                          alert(res.data.message || 'Enrollment berhasil');
                        }
                      } catch (error) {
                        console.error('Enroll failed:', error);
                        alert('Gagal enroll course');
                      }
                    }}
                    className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-md text-sm font-medium transition duration-300 ease-in-out transform hover:scale-105 shadow-md"
                  >
                    Enroll
                  </button>
                )}

              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {pagination && (
          <div className="mt-10 flex justify-center items-center gap-4 text-gray-800 dark:text-gray-200">
            <button
              disabled={!pagination.hasPrevPage}
              // onClick={() => { /* logika fetch halaman sebelumnya */ }}
              className={`px-6 py-3 rounded-lg font-semibold transition duration-300 ease-in-out ${pagination.hasPrevPage ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md' : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'}`}
            >
              Sebelumnya
            </button>
            <span className="text-lg font-medium">
              Halaman {pagination.currentPage} dari {pagination.totalPages}
            </span>
            <button
              disabled={!pagination.hasNextPage}
              // onClick={() => { /* logika fetch halaman selanjutnya */ }}
              className={`px-6 py-3 rounded-lg font-semibold transition duration-300 ease-in-out ${pagination.hasNextPage ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md' : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'}`}
            >
              Selanjutnya
            </button>
          </div>
        )}
      </div>
    </div>
  );
}