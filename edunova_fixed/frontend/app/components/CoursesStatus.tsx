import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { coursesAPI } from '../lib/courses'; // Pastikan path-nya sesuai
import {
  FaExchangeAlt, FaSpinner, FaCheckCircle, FaTimesCircle, FaClipboardList
} from 'react-icons/fa'; // Import ikon yang relevan

export default function CourseStatus() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('DRAFT');
  const [loading, setLoading] = useState(false); // Untuk tombol submit
  const [message, setMessage] = useState<string | null>(null); // Variabel untuk pesan sukses
  const [error, setError] = useState<string | null>(null);     // Variabel untuk pesan error

  const statusOptions = ['DRAFT', 'PUBLISHED', 'ARCHIVED'];

  // Optional: Fetch current status if needed, but not in original code's useEffect
  // useEffect(() => {
  //   if (id) {
  //     coursesAPI.getCourseById(Number(id))
  //       .then(res => {
  //         // Assuming the course object has a 'status' property
  //         if (res.data.course && res.data.course.status) {
  //           setStatus(res.data.course.status);
  //         }
  //       })
  //       .catch(err => {
  //         console.error('Failed to fetch course status:', err);
  //         setError('Failed to fetch current course status.');
  //       });
  //   }
  // }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setLoading(true);
    setMessage(null); // Reset pesan sukses
    setError(null);    // Reset pesan error
    try {
      await coursesAPI.updateCourseStatus(Number(id), status);
      setMessage(`Course status successfully changed to '${status}'.`);
      // Optional: Delay navigate to show message
      setTimeout(() => {
        navigate('/course'); // Pastikan '/course' adalah path yang benar untuk daftar course
      }, 1500); // Navigate after 1.5 seconds
    } catch (err: any) { // Menggunakan 'err: any' untuk mengakses response
      console.error(err);
      const errorMessage = err.response?.data?.message || 'Failed to update course status.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-xl p-8 border border-gray-700">
        <h1 className="text-3xl font-bold text-white mb-8 text-center flex items-center justify-center">
          <FaExchangeAlt className="mr-3 text-cyan-400" /> Change Course Status
        </h1>

        {/* Success/Error messages */}
        {message && (
          <div className="bg-green-900/20 text-green-400 p-4 rounded-md mb-6 border border-green-700 flex items-center">
            <FaCheckCircle className="mr-3 text-2xl" /> {message}
          </div>
        )}
        {error && (
          <div className="bg-red-900/20 text-red-400 p-4 rounded-md mb-6 border border-red-700 flex items-center">
            <FaTimesCircle className="mr-3 text-2xl" /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="status-select" className="block text-gray-300 text-sm font-medium mb-2 flex items-center">
              <FaClipboardList className="mr-2" /> Select Status:
            </label>
            <div className="relative">
              <select
                id="status-select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="block w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 appearance-none pr-10 transition duration-200"
              >
                {statusOptions.map((opt) => (
                  <option key={opt} value={opt} className="bg-gray-800 text-white p-2">
                    {opt}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center px-6 py-3 bg-cyan-600 text-white rounded-lg shadow-md hover:bg-cyan-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center">
                <FaSpinner className="animate-spin mr-3" /> Updating...
              </span>
            ) : (
              <>
                <FaCheckCircle className="mr-3" /> Update Status
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}