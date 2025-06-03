import { useEffect, useState } from 'react';
import { dashboardAPI } from '../../lib/dashboard';
import { formatDate } from '../../utils/formatDate';
import {
  UserGroupIcon, // Icon for user management
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon, // For Add User button
  PencilSquareIcon, // For Edit button
  TrashIcon, // For Delete button
  MagnifyingGlassIcon // For Search bar (future)
} from '@heroicons/react/24/outline'; // Importing some icons for visual flair

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Define a consistent color palette for actions
  const actionColors = {
    edit: 'text-indigo-400 hover:text-indigo-300',
    delete: 'text-red-400 hover:text-red-300',
    view: 'text-teal-400 hover:text-teal-300',
    primaryButton: 'bg-indigo-600 hover:bg-indigo-700',
    secondaryButton: 'bg-gray-700 hover:bg-gray-600',
  };

  const fetchUsers = (page = 1) => {
    setLoading(true);
    setError(null); // Clear previous errors
    dashboardAPI.getUser(page)
      .then((res) => {
        setUsers(res.data.users);
        setPagination(res.data.pagination);
        setCurrentPage(res.data.pagination.currentPage);
      })
      .catch((err) => setError(err?.response?.data?.message || 'Failed to fetch users'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  // Loading, Error, No Data States
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950">
      <div className="text-center p-8 bg-gray-800 rounded-xl shadow-2xl">
        <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-indigo-500 mx-auto mb-6"></div>
        <p className="mt-4 text-xl font-semibold text-gray-300">Loading user data...</p>
      </div>
    </div>
  );
  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950">
      <div className="text-center p-8 bg-gray-800 rounded-xl shadow-2xl">
        <p className="text-red-500 text-center text-xl">Error: {error}</p>
        <button
          onClick={() => fetchUsers(1)} // Try fetching again from page 1
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
        <p className="text-gray-400 text-center text-xl">No users found.</p>
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

        {/* Hero Section for User Management */}
        <div className="bg-gray-800/70 backdrop-blur-md rounded-xl p-10 mb-12 shadow-2xl border border-gray-700 flex justify-between items-center">
          <div>
            <h1 className="text-5xl font-extrabold text-white mb-3 tracking-tight drop-shadow-xl flex items-center">
              <UserGroupIcon className="h-12 w-12 text-indigo-400 mr-4" /> User <span className="text-teal-400">Management</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl">
              Effortlessly manage all user accounts, roles, and permissions on your platform.
            </p>
          </div>
          <button
            onClick={() => console.log('Add New User clicked')} // Replace with actual add user logic/modal
            className={`${actionColors.primaryButton} text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center`}
          >
            <PlusIcon className="h-6 w-6 mr-2" /> Add New User
          </button>
        </div>

        {/* User List Table/Cards */}
        <section className="mb-12 bg-gray-800/40 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-gray-700">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-3xl font-semibold text-white">All Users ({pagination?.totalUsers || '...'})</h3>
            {/* Future: Search Bar */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search users..."
                className="bg-gray-700 border border-gray-600 rounded-md py-2 pl-10 pr-4 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="overflow-x-auto custom-scrollbar"> {/* Added custom-scrollbar class */}
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider rounded-tl-lg">ID</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Email</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Role</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Instructor Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Courses</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Revenue</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Created At</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider rounded-tr-lg">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-700 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-200">{user.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{user.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.role === 'admin' ? 'bg-purple-600 text-purple-100' :
                            user.role === 'instructor' ? 'bg-green-600 text-green-100' :
                            'bg-blue-600 text-blue-100'
                        }`}>
                            {user.role}
                        </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.instructorStatus === 'APPROVED' ? 'bg-emerald-600 text-emerald-100' :
                            user.instructorStatus === 'PENDING' ? 'bg-yellow-600 text-yellow-100' :
                            'bg-red-600 text-red-100'
                        }`}>
                            {user.instructorStatus}
                        </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{user.courseCount}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">${user.totalRevenue?.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{formatDate(new Date(user.createdAt))}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-3">
                        <button onClick={() => console.log('Edit user:', user.id)} className={`${actionColors.edit} hover:scale-110 transition-transform`}>
                          <PencilSquareIcon className="h-5 w-5" />
                        </button>
                        <button onClick={() => console.log('Delete user:', user.id)} className={`${actionColors.delete} hover:scale-110 transition-transform`}>
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Optional: Add a subtle custom scrollbar style to your global CSS or in a style tag */}
          <style>{`
            .custom-scrollbar::-webkit-scrollbar {
              height: 8px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
              background: #374151; /* gray-700 */
              border-radius: 10px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background: #4B5563; /* gray-600 */
              border-radius: 10px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background: #6B7280; /* gray-500 */
            }
          `}</style>
        </section>


        {/* Pagination Controls */}
        {pagination && pagination.totalPages > 1 && (
          <section className="mt-8 bg-gray-800/40 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-gray-700 flex justify-between items-center">
            <p className="text-gray-300 text-lg">
              Page <span className="font-semibold text-white">{pagination.currentPage}</span> of <span className="font-semibold text-white">{pagination.totalPages}</span>
            </p>
            <div className="flex items-center space-x-3">
              <button
                className={`flex items-center px-4 py-2 rounded-lg text-white font-medium transition-colors duration-200 ${actionColors.secondaryButton} ${!pagination.hasPrevPage ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={!pagination.hasPrevPage}
              >
                <ChevronLeftIcon className="h-5 w-5 mr-1" /> Previous
              </button>
              {/* Page numbers (optional, can be complex for many pages) */}
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((pageNumber) => (
                <button
                  key={pageNumber}
                  onClick={() => setCurrentPage(pageNumber)}
                  className={`hidden md:block w-10 h-10 rounded-full flex items-center justify-center font-semibold text-lg transition-colors duration-200
                    ${pageNumber === currentPage ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'}
                  `}
                >
                  {pageNumber}
                </button>
              ))}
              <button
                className={`flex items-center px-4 py-2 rounded-lg text-white font-medium transition-colors duration-200 ${actionColors.secondaryButton} ${!pagination.hasNextPage ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                disabled={!pagination.hasNextPage}
              >
                Next <ChevronRightIcon className="h-5 w-5 ml-1" />
              </button>
            </div>
            <p className="text-gray-300 text-lg">Total Users: <span className="font-semibold text-white">{pagination.totalUsers}</span></p>
          </section>
        )}
      </main>
    </div>
  );
}