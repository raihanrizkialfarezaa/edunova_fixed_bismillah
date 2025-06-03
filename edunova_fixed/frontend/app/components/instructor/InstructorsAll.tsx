import React, { useEffect, useState } from 'react';
import { instructorAPI } from '~/lib/instructor';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  UsersIcon, // Main icon for instructors page
  MagnifyingGlassIcon, // For search input
  CodeBracketIcon, // For expertise filter
  UserCircleIcon, // For individual instructor card
  BookOpenIcon, // For total courses
  ArrowTopRightOnSquareIcon, // For View Courses link
  IdentificationIcon, // For View Profile link
  ChartBarIcon, // For View Stats link (admin)
  ChevronLeftIcon, // For pagination
  ChevronRightIcon, // For pagination
} from '@heroicons/react/24/outline'; // Importing relevant icons

type Instructor = {
  id: number;
  name: string;
  email: string;
  bio: string;
  expertise: string[];
  profileImage: string;
  totalCourses: number;
};

export default function InstructorsAll() {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [expertise, setExpertise] = useState('');
  const [loading, setLoading] = useState(true); // Tambahkan state loading
  const [error, setError] = useState<string | null>(null); // Tambahkan state error

  const { user } = useAuth(); // Akses user dari useAuth

  // Define a consistent color palette for actions
  const actionColors = {
    primaryButton: 'bg-indigo-600 hover:bg-indigo-700',
    secondaryButton: 'bg-gray-700 hover:bg-gray-600',
    viewCourses: 'bg-blue-600 hover:bg-blue-700',
    viewProfile: 'bg-purple-600 hover:bg-purple-700',
    viewStats: 'bg-teal-600 hover:bg-teal-700',
  };

  const fetchInstructors = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await instructorAPI.getAllInstructors({
        page,
        limit: 6,
        search,
        expertise,
      });
      const data = res.data.data;
      setInstructors(data.instructors);
      setTotalPages(data.pagination.totalPages);
    } catch (err: any) {
      console.error('Failed to load instructors:', err);
      setError(err?.response?.data?.message || 'Failed to load instructors.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstructors();
  }, [page, search, expertise]);

  // Loading, Error, No Data States
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950">
      <div className="text-center p-8 bg-gray-800 rounded-xl shadow-2xl">
        <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-indigo-500 mx-auto mb-6"></div>
        <p className="mt-4 text-xl font-semibold text-gray-300">Loading instructors...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950">
      <div className="text-center p-8 bg-gray-800 rounded-xl shadow-2xl">
        <p className="text-red-500 text-center text-xl">Error: {error}</p>
        <button
          onClick={() => fetchInstructors()}
          className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );

  if (!instructors.length && !loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950">
      <div className="text-center p-8 bg-gray-800 rounded-xl shadow-2xl">
        <p className="text-gray-400 text-center text-xl">No instructors found matching your criteria.</p>
        <button
            onClick={() => { setSearch(''); setExpertise(''); setPage(1); }}
            className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md transition-colors"
        >
            Clear Filters
        </button>
      </div>
    </div>
  );


  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-sans antialiased py-10">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Hero Section: All Instructors */}
        <div className="bg-gray-800/70 backdrop-blur-md rounded-xl p-10 mb-12 shadow-2xl border border-gray-700 flex flex-col sm:flex-row justify-between items-center">
          <div>
            <h1 className="text-5xl font-extrabold text-white mb-3 tracking-tight drop-shadow-xl flex items-center">
              <UsersIcon className="h-12 w-12 text-blue-400 mr-4" /> All <span className="text-green-400">Instructors</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl">
              Jelajahi profil dan kursus dari para instruktur terbaik kami.
            </p>
          </div>
        </div>

        {/* Search and Filter Section */}
        <section className="mb-8 bg-gray-800/40 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-gray-700">
            <h2 className="text-2xl font-semibold text-white mb-4">Cari Instruktur</h2>
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <input
                        type="text"
                        placeholder="Cari berdasarkan nama atau bio..."
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 pl-12 pr-4 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <MagnifyingGlassIcon className="h-6 w-6 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                </div>
                <div className="relative flex-1">
                    <input
                        type="text"
                        placeholder="Filter berdasarkan keahlian (mis. React)"
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 pl-12 pr-4 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200"
                        value={expertise}
                        onChange={(e) => setExpertise(e.target.value)}
                    />
                    <CodeBracketIcon className="h-6 w-6 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                </div>
            </div>
        </section>

        {/* Instructors Grid */}
        <section>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {instructors.map((inst) => (
              <div key={inst.id} className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-700 flex flex-col items-center text-center transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]">
                <img
                  src={inst.profileImage || `https://api.dicebear.com/7.x/initials/svg?seed=${inst.name}`} // Fallback avatar
                  alt={inst.name}
                  className="w-32 h-32 object-cover rounded-full mb-4 border-4 border-indigo-500 shadow-lg"
                />
                <h2 className="text-2xl font-bold text-white mb-1">{inst.name}</h2>
                <p className="text-sm text-gray-400 mb-3 line-clamp-2">{inst.bio || 'No bio provided.'}</p>
                
                <div className="text-base text-gray-300 mb-4 space-y-1">
                  <p className="flex items-center justify-center">
                    <CodeBracketIcon className="h-5 w-5 mr-2 text-purple-400" />
                    <span className="font-semibold">Keahlian:</span> {inst.expertise.length > 0 ? inst.expertise.join(', ') : 'Tidak Ada'}
                  </p>
                  <p className="flex items-center justify-center">
                    <BookOpenIcon className="h-5 w-5 mr-2 text-yellow-400" />
                    <span className="font-semibold">Kursus:</span> {inst.totalCourses}
                  </p>
                </div>

                <div className="mt-4 flex flex-wrap justify-center gap-3 w-full">
                  <Link
                    to={`/users/instructors/${inst.id}/courses`}
                    className={`${actionColors.viewCourses} px-4 py-2 rounded-lg text-sm font-semibold text-white transition-colors duration-200 flex items-center justify-center`}
                  >
                    <ArrowTopRightOnSquareIcon className="h-4 w-4 mr-2" /> Lihat Kursus
                  </Link>

                  <Link
                    to={`/users/instructor-profile/${inst.id}`}
                    className={`${actionColors.viewProfile} px-4 py-2 rounded-lg text-sm font-semibold text-white transition-colors duration-200 flex items-center justify-center`}
                  >
                    <IdentificationIcon className="h-4 w-4 mr-2" /> Lihat Profil
                  </Link>

                  {user?.role === 'ADMIN' && (
                    <Link
                      to={`/instructors/${inst.id}/stats`}
                      className={`${actionColors.viewStats} px-4 py-2 rounded-lg text-sm font-semibold text-white transition-colors duration-200 flex items-center justify-center`}
                    >
                      <ChartBarIcon className="h-4 w-4 mr-2" /> Lihat Statistik
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="mt-10 flex justify-center items-center gap-4 bg-gray-800/40 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-gray-700">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className={`${actionColors.secondaryButton} px-5 py-2 rounded-lg text-white font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center`}
            >
              <ChevronLeftIcon className="h-5 w-5 mr-2" /> Previous
            </button>
            <span className="text-lg font-semibold text-gray-300">
              Page <span className="text-white">{page}</span> of <span className="text-white">{totalPages}</span>
            </span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className={`${actionColors.secondaryButton} px-5 py-2 rounded-lg text-white font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center`}
            >
              Next <ChevronRightIcon className="h-5 w-5 ml-2" />
            </button>
          </div>
        )}
      </main>
    </div>
  );
}