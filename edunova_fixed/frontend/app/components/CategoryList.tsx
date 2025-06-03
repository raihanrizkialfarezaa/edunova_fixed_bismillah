import React, { useEffect, useState } from 'react';
import { categoryAPI } from '../lib/category';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaPlus, FaTag, FaSearch, FaChevronLeft, FaChevronRight } from 'react-icons/fa'; // Import icons


interface Category {
    id: number; // Atau string, tergantung API Anda
    name: string;
    // Tambahkan properti lain yang mungkin ada di objek kategori Anda
    }
const CategoryList = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(10); // Bisa disesuaikan
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true); // Re-added loading state
  const [hasMore, setHasMore] = useState(true); // Re-added hasMore state

  const { user } = useAuth();

  const fetchCategories = async () => {
    setLoading(true); // Set loading true before fetch
    try {
      const res = await categoryAPI.getAllQuizzes({ page, limit, search });
      // Assuming res.data directly contains the array of categories based on previous fix
      const fetchedCategories = res.data;

      if (Array.isArray(fetchedCategories)) {
        setCategories(fetchedCategories);
        // Check if the number of fetched items is less than the limit, indicating no more pages
        setHasMore(fetchedCategories.length === limit);
        setError('');
      } else {
        console.warn('API response for categories is not an array:', res.data);
        setCategories([]);
        setHasMore(false);
        setError('Unexpected data format from server.');
      }
    } catch (err: any) {
      console.error('Failed to fetch categories:', err);
      setError('Failed to fetch categories. Please try again.');
      setCategories([]); // Clear categories on error
      setHasMore(false);
    } finally {
      setLoading(false); // Set loading false after fetch
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [page, search]); // Re-fetch on page or search change

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1); // Reset ke halaman pertama saat pencarian
    // useEffect will trigger fetchCategories due to search state change
  };

  return (
    // Main container with dark background and light text
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-gray-800 rounded-lg shadow-xl p-8 border border-gray-700"> {/* Dark card background */}
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-white">Categories</h1>
          <div className="flex gap-3">
            {(user?.role === 'ADMIN' || user?.role === 'INSTRUCTOR') && (
              <Link
                to="/category/create"
                className="flex items-center px-5 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-md"
              >
                <FaPlus className="mr-2" /> Add Category
              </Link>
            )}
            <Link
              to="/tag"
              className="flex items-center px-5 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 text-md"
            >
              <FaTag className="mr-2" /> Manage Tags
            </Link>
          </div>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="flex gap-3 mb-8">
          <input
            type="text"
            placeholder="Search categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 p-3 bg-gray-700 border border-gray-600 text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
          />
          <button
            type="submit"
            className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <FaSearch className="mr-2" /> Search
          </button>
        </form>

        {/* Error Message */}
        {error && <p className="text-red-500 bg-red-900/20 p-3 rounded-md mb-6 border border-red-700">{error}</p>}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-blue-300">Loading categories...</p>
          </div>
        )}

        {/* Category List */}
        {!loading && categories.length === 0 && !error && (
            <p className="text-center text-gray-400 py-10">No categories found matching your criteria.</p>
        )}

        {!loading && categories.length > 0 && (
            <ul className="space-y-4">
            {categories.map((category: any) => (
                <li
                key={category.id}
                className="bg-gray-700 p-5 rounded-lg shadow-md flex justify-between items-center transition-transform transform hover:scale-[1.01] border border-gray-600"
                >
                <span className="text-xl font-semibold text-white">{category.name}</span>
                {(user?.role === 'ADMIN' || user?.role === 'INSTRUCTOR') && (
                    <Link
                    to={`/category/update/${category.id}`}
                    className="text-blue-400 hover:text-blue-300 transition-colors text-lg font-medium"
                    >
                    Edit
                    </Link>
                )}
                </li>
            ))}
            </ul>
        )}

        {/* Pagination */}
        <div className="flex justify-center mt-10 gap-4">
          <button
            disabled={page === 1 || loading}
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            className="flex items-center px-6 py-3 bg-gray-700 text-gray-300 rounded-lg shadow-md hover:bg-gray-600 disabled:opacity-40 disabled:cursor-not-allowed transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            <FaChevronLeft className="mr-2" /> Previous
          </button>
          <span className="font-semibold text-xl text-white flex items-center">Page {page}</span> {/* Display current page */}
          <button
            disabled={!hasMore || loading}
            onClick={() => setPage((p) => p + 1)}
            className="flex items-center px-6 py-3 bg-gray-700 text-gray-300 rounded-lg shadow-md hover:bg-gray-600 disabled:opacity-40 disabled:cursor-not-allowed transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Next <FaChevronRight className="ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryList;