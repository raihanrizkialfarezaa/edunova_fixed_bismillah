import { useEffect, useState } from 'react';
import { dashboardAPI } from '../../lib/dashboard';
import { formatDate } from '../../utils/formatDate';
import { Link } from 'react-router-dom';
import {
  UserGroupIcon, // Main icon for instructor requests
  ClockIcon, // For requested at time
  AcademicCapIcon, // For education
  BriefcaseIcon, // For experience
  CodeBracketIcon, // For expertise
  ChevronLeftIcon, // For pagination
  ChevronRightIcon, // For pagination
  MagnifyingGlassIcon // For search bar (future)
} from '@heroicons/react/24/outline'; // Importing relevant icons

interface InstructorRequestUser {
  id: number;
  name: string;
  email: string;
  role: string;
  bio: string;
  expertise: string[];
  experience: string;
  education: string;
  instructorStatus: string;
  instructorRequestedAt: string;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export default function AdminInstructorRequest() {
  const [users, setUsers] = useState<InstructorRequestUser[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Variabel actionColors (sudah ada, tidak dihapus/ditambah)
  const actionColors = {
    approve: 'bg-green-600 hover:bg-green-700', // Dibiarkan ada, meski tidak digunakan di sini
    reject: 'bg-red-600 hover:bg-red-700',     // Dibiarkan ada, meski tidak digunakan di sini
    primaryButton: 'bg-indigo-600 hover:bg-indigo-700', // Digunakan untuk tombol utama
    secondaryButton: 'bg-gray-700 hover:bg-gray-600',   // Digunakan untuk tombol paginasi
  };

  const fetchRequests = (page = 1) => {
    setLoading(true);
    setError(null); // Clear previous errors
    dashboardAPI.getInstructorRequests(page)
      .then((res) => {
        setUsers(res.data.data.users);
        setPagination(res.data.data.pagination);
        setCurrentPage(res.data.data.pagination.currentPage);
      })
      .catch((err) => {
        setError(err?.response?.data?.message || 'Failed to fetch instructor requests');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRequests(currentPage);
  }, [currentPage]);

  // Helper untuk mendapatkan warna status tag
  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PENDING': return 'bg-yellow-600 text-yellow-100';
      case 'APPROVED': return 'bg-green-600 text-green-100';
      case 'REJECTED': return 'bg-red-600 text-red-100';
      default: return 'bg-gray-500 text-gray-100';
    }
  };

  // Loading, Error, No Data States (diperbarui untuk konsistensi)
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950">
      <div className="text-center p-8 bg-gray-800 rounded-xl shadow-2xl">
        <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-indigo-500 mx-auto mb-6"></div>
        <p className="mt-4 text-xl font-semibold text-gray-300">Loading instructor requests...</p>
      </div>
    </div>
  );
  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950">
      <div className="text-center p-8 bg-gray-800 rounded-xl shadow-2xl">
        <p className="text-red-500 text-center text-xl">Error: {error}</p>
        <button
          onClick={() => fetchRequests(1)}
          className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
  if (!users.length && !loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950">
      <div className="text-center p-8 bg-gray-800 rounded-xl shadow-2xl">
        <p className="text-gray-400 text-center text-xl">No instructor requests found.</p>
        {pagination && pagination.currentPage > 1 && (
            <button
                onClick={() => setCurrentPage(1)}
                className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md transition-colors"
            >
                Go to First Page
            </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-sans antialiased py-10">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Hero Section for Instructor Requests */}
        <div className="bg-gray-800/70 backdrop-blur-md rounded-xl p-10 mb-12 shadow-2xl border border-gray-700 flex justify-between items-center">
          <div>
            <h1 className="text-5xl font-extrabold text-white mb-3 tracking-tight drop-shadow-xl flex items-center">
              <UserGroupIcon className="h-12 w-12 text-teal-400 mr-4" /> Instructor <span className="text-orange-400">Requests</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl">
              Review and manage applications from users aspiring to become instructors.
            </p>
          </div>
          {/* Tidak ada tombol "Add New" di sini karena permintaan diinisiasi oleh pengguna */}
        </div>

        {/* Instructor Request List Section */}
        <section className="mb-12 bg-gray-800/40 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-gray-700">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-3xl font-semibold text-white">Pending Requests ({pagination?.totalItems || '...'})</h3>
            {/* Future: Search Bar (tidak menambahkan variabel baru) */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search requests..."
                className="bg-gray-700 border border-gray-600 rounded-md py-2 pl-10 pr-4 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {users.map(user => (
              <div key={user.id} className="bg-gray-800/60 backdrop-blur-sm rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] border border-gray-700 p-6">
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-700">
                  <h2 className="text-xl font-bold text-white">{user.name}</h2>
                  <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getStatusColor(user.instructorStatus)}`}>
                    {user.instructorStatus}
                  </span>
                </div>

                <div className="space-y-3 text-gray-300 text-base">
                  <p className="flex items-center">
                    <span className="font-semibold text-gray-200 w-24 flex-shrink-0">Email:</span>
                    <span className="text-indigo-400 break-all">{user.email}</span>
                  </p>
                  <p className="flex items-center">
                    <span className="font-semibold text-gray-200 w-24 flex-shrink-0">Role:</span>
                    <span className="text-blue-400 capitalize">{user.role}</span>
                  </p>
                  <p className="flex items-start">
                    <span className="font-semibold text-gray-200 w-24 flex-shrink-0">Bio:</span>
                    <span className="flex-grow italic text-gray-400">{user.bio || 'N/A'}</span>
                  </p>
                  <p className="flex items-start">
                    <span className="font-semibold text-gray-200 w-24 flex-shrink-0 flex items-center"><CodeBracketIcon className="h-5 w-5 mr-1" /> Expertise:</span>
                    <span className="flex-grow">{Array.isArray(user.expertise) && user.expertise.length > 0 ? user.expertise.join(', ') : 'N/A'}</span>
                  </p>
                  <p className="flex items-start">
                    <span className="font-semibold text-gray-200 w-24 flex-shrink-0 flex items-center"><BriefcaseIcon className="h-5 w-5 mr-1" /> Experience:</span>
                    <span className="flex-grow">{user.experience || 'N/A'}</span>
                  </p>
                  <p className="flex items-start">
                    <span className="font-semibold text-gray-200 w-24 flex-shrink-0 flex items-center"><AcademicCapIcon className="h-5 w-5 mr-1" /> Education:</span>
                    <span className="flex-grow">{user.education || 'N/A'}</span>
                  </p>
                  <p className="flex items-center text-sm text-gray-400">
                    <ClockIcon className="h-4 w-4 mr-1" /> Requested At: {formatDate(new Date(user.instructorRequestedAt))}
                  </p>
                </div>

                {/* Hanya styling tombol yang sudah ada: "Process Request" */}
                <div className="mt-6 pt-4 border-t border-gray-700 flex justify-end">
                  <Link
                    to={`/admin/users/${user.id}/approve-instructor`}
                    className={`${actionColors.primaryButton} text-white font-semibold py-2 px-4 rounded-md transition-all duration-200 flex items-center`}
                  >
                    Process Request
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Pagination Controls (styling tombol yang sudah ada) */}
        {pagination && pagination.totalPages > 1 && (
          <section className="mt-8 bg-gray-800/40 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-gray-700 flex justify-between items-center">
            <p className="text-gray-300 text-lg">
              Page <span className="font-semibold text-white">{pagination.currentPage}</span> of <span className="font-semibold text-white">{pagination.totalPages}</span>
            </p>
            {/* <div className="flex items-center space-x-3">
              <button
                className={`flex items-center px-4 py-2 rounded-lg text-white font-medium transition-colors duration-200 ${actionColors.secondaryButton} ${!pagination.hasPrevPage ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={!pagination.hasPrevPage}
              >
                <ChevronLeftIcon className="h-5 w-5 mr-1" /> Previous
              </button>
              {/* Tidak menambahkan tombol nomor halaman individual */}
              {/* <button
                className={`flex items-center px-4 py-2 rounded-lg text-white font-medium transition-colors duration-200 ${actionColors.secondaryButton} ${!pagination.hasNextPage ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                disabled={!pagination.hasNextPage}
              >
                Next <ChevronRightIcon className="h-5 w-5 ml-1" />
              </button>
            </div> */}
            <p className="text-gray-300 text-lg">Total Requests: <span className="font-semibold text-white">{pagination.totalItems}</span></p>
          </section>
        )}
      </main>
    </div>
  );
}