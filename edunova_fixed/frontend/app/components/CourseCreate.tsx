// src/pages/course-create.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { categoryAPI } from '../lib/category';
import { coursesAPI } from '../lib/courses';
import { FaSpinner, FaPlusCircle, FaExclamationCircle } from 'react-icons/fa'; // Import icons

interface Option {
  id: number;
  name: string;
}

const CourseCreate: React.FC = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [thumbnail, setThumbnail] = useState('');
  const [categoryIds, setCategoryIds] = useState<number[]>([]);
  const [tagIds, setTagIds] = useState<number[]>([]);
  const [categories, setCategories] = useState<Option[]>([]);
  const [tags, setTags] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState(''); // State untuk error saat submit form
  const [initialLoadError, setInitialLoadError] = useState(''); // State untuk error saat load kategori/tag

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        setInitialLoadError(''); // Clear previous errors
        // Perbaikan: Menggunakan getAllCategories() dan getAllTags()
        const [catRes, tagRes] = await Promise.all([
          categoryAPI.getAllQuizzes(), 
          categoryAPI.getAllTags(),       
        ]);
        setCategories(catRes.data || []); // Pastikan selalu array
        setTags(tagRes.data || []);       // Pastikan selalu array
      } catch (error) {
        console.error('Gagal mengambil data kategori/tag:', error);
        setInitialLoadError('Gagal memuat opsi kategori dan tag. Silakan refresh halaman.');
      }
    };

    fetchOptions();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFormError(''); // Clear previous form errors

    // Basic validation
    if (!title || !description || price <= 0 || !thumbnail || categoryIds.length === 0) {
      setFormError('Semua bidang wajib diisi dan harga harus lebih dari 0. Setidaknya pilih satu kategori.');
      setLoading(false);
      return;
    }

    try {
      await coursesAPI.createCourse({
        title,
        description,
        price,
        thumbnail,
        categoryIds,
        tagIds,
      });
      navigate('/course'); // redirect ke halaman list course (menggunakan '/courses' untuk konsistensi)
    } catch (error: any) { // Tangkap error dengan tipe any untuk akses response
      console.error('Gagal membuat course:', error);
      // Coba ambil pesan error dari API jika ada
      const errorMessage = error.response?.data?.message || 'Terjadi kesalahan saat membuat kursus. Silakan coba lagi.';
      setFormError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleMultiSelect = (
    e: React.ChangeEvent<HTMLSelectElement>,
    setter: (values: number[]) => void
  ) => {
    const selected = Array.from(e.target.selectedOptions).map((opt) => Number(opt.value));
    setter(selected);
  };

  // Tampilkan pesan error saat load awal jika ada
  if (initialLoadError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-center text-red-600 dark:text-red-400">
          <FaExclamationCircle className="text-5xl mx-auto mb-4" />
          <p className="text-lg font-medium">{initialLoadError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6">
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-extrabold mb-8 text-indigo-700 dark:text-indigo-400 text-center">
          <FaPlusCircle className="inline-block mr-3 text-4xl" />
          Buat Kursus Baru
        </h1>

        {formError && (
          <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded relative mb-6" role="alert">
            <strong className="font-bold">Oops!</strong>
            <span className="block sm:inline ml-2">{formError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6"> {/* Meningkatkan spasi antar elemen */}
          <div>
            <label htmlFor="title" className="block text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">Judul Kursus</label>
            <input
              type="text"
              id="title"
              placeholder="Contoh: Belajar React dari Nol"
              className="w-full p-3 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">Deskripsi</label>
            <textarea
              id="description"
              placeholder="Jelaskan secara singkat tentang kursus ini..."
              rows={5} // Menambah tinggi default textarea
              className="w-full p-3 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 resize-y"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="price" className="block text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">Harga (Rp)</label>
            <input
              type="number"
              id="price"
              placeholder="Contoh: 150000"
              className="w-full p-3 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              min="0" // Pastikan harga tidak negatif
              required
            />
          </div>

          <div>
            <label htmlFor="thumbnail" className="block text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">URL Thumbnail</label>
            <input
              type="text"
              id="thumbnail"
              placeholder="Contoh: https://example.com/thumbnail.jpg"
              className="w-full p-3 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
              value={thumbnail}
              onChange={(e) => setThumbnail(e.target.value)}
              required
            />
            {thumbnail && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Pratinjau Thumbnail:</p>
                <img src={thumbnail} alt="Pratinjau Thumbnail" className="w-full max-h-48 object-cover rounded-lg border border-gray-300 dark:border-gray-600" onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/400x200.png?text=Gambar+Tidak+Ditemukan')} />
              </div>
            )}
          </div>

          <div>
            <label htmlFor="categories" className="block text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">Kategori</label>
            <select
              id="categories"
              multiple
              className="w-full p-3 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 h-40 custom-scroll" // Menambah tinggi dan custom scroll
              onChange={(e) => handleMultiSelect(e, setCategoryIds)}
              value={categoryIds.map(String)} // Pastikan value adalah string untuk select multiple
              required
            >
              {categories.length > 0 ? (
                categories.map((cat) => (
                  <option key={cat.id} value={cat.id} className="p-2 hover:bg-indigo-100 dark:hover:bg-indigo-800">
                    {cat.name}
                  </option>
                ))
              ) : (
                <option disabled>Tidak ada kategori tersedia</option>
              )}
            </select>
            {categories.length === 0 && !initialLoadError && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Memuat kategori...</p>
            )}
          </div>

          <div>
            <label htmlFor="tags" className="block text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">Tag</label>
            <select
              id="tags"
              multiple
              className="w-full p-3 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 h-40 custom-scroll" // Menambah tinggi dan custom scroll
              onChange={(e) => handleMultiSelect(e, setTagIds)}
              value={tagIds.map(String)} // Pastikan value adalah string untuk select multiple
            >
              {tags.length > 0 ? (
                tags.map((tag) => (
                  <option key={tag.id} value={tag.id} className="p-2 hover:bg-indigo-100 dark:hover:bg-indigo-800">
                    {tag.name}
                  </option>
                ))
              ) : (
                <option disabled>Tidak ada tag tersedia</option>
              )}
            </select>
            {tags.length === 0 && !initialLoadError && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Memuat tag...</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition duration-300 ease-in-out transform hover:scale-105 shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin mr-2" /> Menyimpan...
              </>
            ) : (
              'Buat Kursus'
            )}
          </button>
        </form>
      </div>
      {/* Custom CSS for custom-scroll (optional, bisa juga di global CSS) */}
      <style>{`
        .custom-scroll {
          /* Untuk WebKit (Chrome, Safari) */
          -webkit-overflow-scrolling: touch;
          scrollbar-width: thin; /* Firefox */
          scrollbar-color: #a78bfa #e5e7eb; /* thumb track */
        }
        .custom-scroll::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scroll::-webkit-scrollbar-track {
          background: #e5e7eb; /* gray-200 */
          border-radius: 10px;
        }
        .dark .custom-scroll::-webkit-scrollbar-track {
          background: #4b5563; /* gray-600 */
        }
        .custom-scroll::-webkit-scrollbar-thumb {
          background-color: #a78bfa; /* indigo-400 */
          border-radius: 10px;
          border: 2px solid #e5e7eb; /* gray-200 */
        }
        .dark .custom-scroll::-webkit-scrollbar-thumb {
          background-color: #818cf8; /* indigo-500 */
          border: 2px solid #4b5563; /* gray-600 */
        }
      `}</style>
    </div>
  );
};

export default CourseCreate;