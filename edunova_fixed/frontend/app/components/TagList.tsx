import React, { useEffect, useState } from 'react';
import { categoryAPI } from '../lib/category'; // Pastikan path ini benar
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaPlus, FaTag } from 'react-icons/fa'; // Import icons

interface Tag {
  id: number;
  name: string;
}

const TagList: React.FC = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null); // State untuk error
  const { user } = useAuth();

  useEffect(() => {
    const fetchTags = async () => {
      setLoading(true); // Mulai loading
      setError(null); // Reset error
      try {
        const response = await categoryAPI.getAllTags(); // Pastikan ini mengembalikan { data: Tag[] }
        // Asumsi response.data langsung berisi array of Tag
        if (Array.isArray(response.data)) {
          setTags(response.data);
        } else {
          console.warn('API response for tags is not an array:', response.data);
          setTags([]);
          setError('Unexpected data format from server.');
        }
      } catch (err: any) {
        console.error('Failed to fetch tags:', err);
        setError('Failed to fetch tags. Please try again.');
        setTags([]); // Clear tags on error
      } finally {
        setLoading(false); // Selesai loading
      }
    };

    fetchTags();
  }, []); // Dependensi kosong, hanya berjalan sekali saat mount

  return (
    // Main container with dark background and light text
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <div className="max-w-2xl mx-auto bg-gray-800 rounded-lg shadow-xl p-8 border border-gray-700"> {/* Dark card background */}
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Manage Tags</h1>
          {(user?.role === 'ADMIN' || user?.role === 'INSTRUCTOR') && (
            <Link
              to="/tag/create"
              className="flex items-center px-5 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-md"
            >
              <FaPlus className="mr-2" /> Add New Tag
            </Link>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <p className="text-red-500 bg-red-900/20 p-3 rounded-md mb-6 border border-red-700">
            {error}
          </p>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-blue-300">Loading tags...</p>
          </div>
        ) : tags.length === 0 ? (
          <p className="text-center text-gray-400 py-10">No tags available.</p>
        ) : (
          <ul className="space-y-4">
            {tags.map((tag) => (
              <li
                key={tag.id}
                className="bg-gray-700 p-5 rounded-lg shadow-md flex justify-between items-center transition-transform transform hover:scale-[1.01] border border-gray-600"
              >
                <span className="text-xl font-semibold text-white">{tag.name}</span>
                {/* Anda bisa menambahkan Link Edit/Delete di sini jika ada */}
                {/* Contoh Link Edit (jika ada rute untuk itu): */}
                {/* {(user?.role === 'ADMIN' || user?.role === 'INSTRUCTOR') && (
                    <Link
                        to={`/tag/edit/${tag.id}`}
                        className="text-blue-400 hover:text-blue-300 transition-colors text-lg font-medium"
                    >
                        Edit
                    </Link>
                )} */}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TagList;