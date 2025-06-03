import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { coursesAPI } from '../lib/courses'; // Pastikan path-nya sesuai
import { categoryAPI } from '../lib/category'; // Pastikan path-nya sesuai (meskipun namanya categoryAPI, diasumsikan ada method untuk tags)
import { useNavigate } from 'react-router-dom';
import {
  FaTags, FaSpinner, FaCheckCircle, FaTimesCircle, FaPlusSquare, FaTag
} from 'react-icons/fa'; // Import ikon yang relevan

export default function AddTags() {
  const navigate = useNavigate();
  const { id } = useParams();
  const courseId = Number(id);

  const [tags, setTags] = useState<any[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(false); // Untuk tombol submit
  const [loadingTags, setLoadingTags] = useState(true); // Untuk fetch tags awal
  const [message, setMessage] = useState<string | null>(null); // Variabel untuk pesan sukses
  const [error, setError] = useState<string | null>(null);     // Variabel untuk pesan error

  useEffect(() => {
    // Ambil semua tag yang tersedia
    setLoadingTags(true);
    setError(null); // Reset error saat fetch dimulai
    categoryAPI.getAllTags() // Menggunakan getAllTags sesuai kode Anda
      .then(res => {
        setTags(res.data); // pastikan res.data adalah array tag
      })
      .catch(err => {
        console.error('Failed to fetch tags:', err);
        setError('Failed to load available tags.'); // Set error jika gagal fetch tags
      })
      .finally(() => setLoadingTags(false));

    // Ambil tag yang sudah terpasang di course ini
    coursesAPI.getCourseById(courseId)
      .then(res => {
        const existingTagIds = res.data.course.Tags?.map((tag: any) => tag.id) || [];
        setSelectedTagIds(existingTagIds);
      })
      .catch(err => {
        console.error('Failed to fetch course data:', err);
        // Tidak setting error di sini agar error fetch tags utama lebih dominan
      });
  }, [courseId]);

  const toggleTag = (id: number) => {
    setSelectedTagIds(prev =>
      prev.includes(id) ? prev.filter(tid => tid !== id) : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    setLoading(true);
    setMessage(null); // Reset pesan sukses
    setError(null);    // Reset pesan error
    try {
      await coursesAPI.addTagsToCourse(courseId, selectedTagIds);
      setMessage('Tags updated successfully!'); // Menggunakan variabel 'message'
      navigate('/courses/' + id);
      // jangan reset selectedTagIds agar tetap tercentang
    } catch (err: any) { // Menggunakan 'err: any' untuk mengakses response
      console.error('Failed to add tags:', err);
      const errorMessage = err.response?.data?.message || 'Failed to update tags.';
      setError(errorMessage); // Menggunakan variabel 'error'
    } finally {
      setLoading(false);
    }
  };

  if (loadingTags) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
        <p className="ml-4 text-blue-300 text-lg">Loading tags...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <div className="max-w-xl mx-auto bg-gray-800 rounded-lg shadow-xl p-8 border border-gray-700">
        <h1 className="text-3xl font-bold text-white mb-8 text-center flex items-center justify-center">
          <FaTags className="mr-3 text-indigo-400" /> Add Tags to Course
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

        {/* Tag List */}
        {tags.length > 0 ? (
          <div className="space-y-4 bg-gray-700 p-6 rounded-lg shadow-md border border-gray-600 mb-6">
            <h3 className="text-xl font-semibold text-white mb-4 border-b border-gray-600 pb-3 flex items-center">
              <FaTag className="mr-2" /> Available Tags
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {tags.map(tag => (
                <li key={tag.id}>
                  <label className="flex items-center p-3 bg-gray-600 rounded-md cursor-pointer hover:bg-gray-500 transition duration-200">
                    <input
                      type="checkbox"
                      checked={selectedTagIds.includes(tag.id)}
                      onChange={() => toggleTag(tag.id)}
                      className="form-checkbox h-5 w-5 text-indigo-600 bg-gray-900 border-gray-500 rounded focus:ring-indigo-500 transition duration-150 ease-in-out"
                    />
                    <span className="ml-3 text-lg text-gray-200 font-medium">{tag.name}</span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="text-center py-10 bg-gray-700 rounded-lg shadow-md border border-gray-600">
            <p className="text-gray-400 text-lg">No tags available to add.</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full flex items-center justify-center px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center">
              <FaSpinner className="animate-spin mr-3" /> Saving...
            </span>
          ) : (
            <>
              <FaPlusSquare className="mr-3" /> Update Tags
            </>
          )}
        </button>
      </div>
    </div>
  );
}