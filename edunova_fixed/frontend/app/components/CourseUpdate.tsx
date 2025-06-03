import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { coursesAPI } from '../lib/courses'; // Pastikan path-nya sesuai
import {
  FaEdit, FaSpinner, FaCheckCircle, FaTimesCircle, FaHeading, FaAlignLeft,
  FaDollarSign, FaImage, FaSave
} from 'react-icons/fa'; // Import ikon yang relevan

export default function CourseUpdate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState<any>(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: 0,
    thumbnail: '',
    categoryIds: [] as number[],
    tagIds: [] as number[],
  });
  const [loading, setLoading] = useState(true); // Untuk loading data course
  const [submitting, setSubmitting] = useState(false); // Untuk loading saat submit form
  const [message, setMessage] = useState<string | null>(null); // Untuk pesan sukses
  const [error, setError] = useState<string | null>(null);     // Untuk pesan error

  useEffect(() => {
    if (id) {
      setLoading(true);
      setError(null); // Reset error
      coursesAPI.getCourseById(Number(id))
        .then(res => {
          const c = res.data.course;
          setCourse(c);
          setForm({
            title: c.title || '',
            description: c.description || '',
            price: c.price || 0,
            thumbnail: c.thumbnail || '',
            categoryIds: c.Categories?.map((cat: any) => cat.id) || [],
            tagIds: c.Tags?.map((tag: any) => tag.id) || [],
          });
        })
        .catch(err => {
          console.error('Gagal mengambil course:', err);
          setError(err.response?.data?.message || 'Failed to fetch course data.');
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === 'price' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setSubmitting(true);
    setMessage(null); // Reset pesan sukses
    setError(null);    // Reset pesan error

    try {
      await coursesAPI.updateCourse(Number(id), form);
      setMessage('Course updated successfully!');
      // Tidak ada navigate otomatis setelah sukses, biarkan user melihat pesan sukses
      // navigate(`/course/${id}`); // Jika ingin kembali setelah sukses, uncomment baris ini
    } catch (err: any) {
      console.error('Gagal memperbarui course:', err);
      setError(err.response?.data?.message || 'Failed to update course.');
    } finally {
      setSubmitting(false);
    }
  };

  // Loading state for fetching initial course data
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
        <p className="ml-4 text-blue-300 text-lg">Loading course data...</p>
      </div>
    );
  }

  // Course not found state
  if (!course) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center">
        <div className="text-center p-8 bg-gray-800 rounded-lg shadow-xl border border-gray-700">
          <FaTimesCircle className="text-red-500 text-5xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-400 mb-2">Course Not Found</h2>
          <p className="text-gray-400 mb-6">The course you are looking for does not exist or an error occurred.</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-gray-800 rounded-lg shadow-xl p-8 border border-gray-700">
        <h1 className="text-3xl font-bold text-white mb-8 text-center flex items-center justify-center">
          <FaEdit className="mr-3 text-yellow-400" /> Edit Course: {course.title}
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
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-gray-300 text-sm font-medium mb-2">Title <span className="text-red-400">*</span></label>
            <div className="flex items-center bg-gray-700 border border-gray-600 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 transition duration-200">
              <FaHeading className="text-gray-400 ml-3 mr-2" />
              <input
                id="title"
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                className="flex-1 p-3 bg-transparent text-gray-100 rounded-r-lg focus:outline-none placeholder-gray-400"
                placeholder="Enter course title"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-gray-300 text-sm font-medium mb-2">Description <span className="text-red-400">*</span></label>
            <div className="flex items-start bg-gray-700 border border-gray-600 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 transition duration-200">
              <FaAlignLeft className="text-gray-400 ml-3 mt-3 mr-2" />
              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                rows={6}
                className="flex-1 p-3 bg-transparent text-gray-100 rounded-r-lg focus:outline-none placeholder-gray-400"
                placeholder="Provide a detailed description of the course content and objectives..."
              />
            </div>
          </div>

          {/* Price */}
          <div>
            <label htmlFor="price" className="block text-gray-300 text-sm font-medium mb-2">Price <span className="text-red-400">*</span></label>
            <div className="flex items-center bg-gray-700 border border-gray-600 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 transition duration-200">
              <FaDollarSign className="text-gray-400 ml-3 mr-2" />
              <input
                id="price"
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                required
                min="0" // Harga tidak boleh negatif
                className="flex-1 p-3 bg-transparent text-gray-100 rounded-r-lg focus:outline-none placeholder-gray-400"
                placeholder="e.g., 99.99"
              />
            </div>
          </div>

          {/* Thumbnail URL */}
          <div>
            <label htmlFor="thumbnail" className="block text-gray-300 text-sm font-medium mb-2">Thumbnail URL <span className="text-red-400">*</span></label>
            <div className="flex items-center bg-gray-700 border border-gray-600 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 transition duration-200">
              <FaImage className="text-gray-400 ml-3 mr-2" />
              <input
                id="thumbnail"
                type="text"
                name="thumbnail"
                value={form.thumbnail}
                onChange={handleChange}
                required
                className="flex-1 p-3 bg-transparent text-gray-100 rounded-r-lg focus:outline-none placeholder-gray-400"
                placeholder="https://example.com/course-thumbnail.jpg"
              />
            </div>
            {form.thumbnail && (
              <div className="mt-4 text-center">
                <p className="text-gray-400 text-sm mb-2">Thumbnail Preview:</p>
                <img src={form.thumbnail} alt="Thumbnail Preview" className="w-48 h-auto object-cover rounded-lg mx-auto border-2 border-gray-600" />
              </div>
            )}
          </div>

          {/* Optional: Tambahkan select box untuk categoryIds dan tagIds jika sudah ada data kategorinya */}
          {/* Untuk saat ini, bagian ini tidak di-styling karena membutuhkan logika tambahan untuk fetch data categories/tags */}
          {/* dan memanajemen multiple select, yang di luar scope permintaan "styling saja" */}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <span className="flex items-center">
                <FaSpinner className="animate-spin mr-3" /> Saving Changes...
              </span>
            ) : (
              <>
                <FaSave className="mr-3" /> Save Changes
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}