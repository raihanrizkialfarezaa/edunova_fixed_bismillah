import { useEffect, useState } from 'react';
import { dashboardAPI } from '../../lib/dashboard';
import { formatDate } from '../../utils/formatDate'; // Import formatDate if needed

import {
  BookOpenIcon, // Main icon for courses
  PlusIcon, // For Add Course button
  PencilSquareIcon, // For Edit button
  TrashIcon, // For Delete button
  MagnifyingGlassIcon, // For Search bar
  StarIcon, // For average rating
  CurrencyDollarIcon, // For revenue
  PlayCircleIcon, // For total lessons/duration
  UserGroupIcon, // For enrollment stats
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowPathIcon, // For refresh or loading states
} from '@heroicons/react/24/outline'; // Importing relevant icons

interface Instructor {
  id: number;
  name: string;
  email: string;
}

interface EnrollmentStats {
  total: number;
  enrolled: number;
  completed: number;
  dropped: number;
}

interface Course {
  id: number;
  title: string;
  description: string;
  price: number;
  status: string;
  instructor: Instructor;
  enrollmentStats: EnrollmentStats;
  totalRevenue: number;
  averageRating: string; // Assuming it's a string like "4.5"
  reviewCount: number;
  totalLessons: number;
  totalDuration: number; // in minutes maybe
  thumbnailUrl?: string; // Optional: if you have course thumbnails
  createdAt: string; // Add createdAt to the interface
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalCourses: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export default function AdminCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
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

  const fetchCourses = (page = 1) => {
    setLoading(true);
    setError(null); // Clear previous errors
    dashboardAPI.getCourses(page)
      .then((res) => {
        setCourses(res.data.courses);
        setPagination(res.data.pagination);
        setCurrentPage(res.data.pagination.currentPage);
      })
      .catch((err) => {
        setError(err?.response?.data?.message || 'Failed to fetch courses');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCourses(currentPage);
  }, [currentPage]);

  // Loading, Error, No Data States
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950">
      <div className="text-center p-8 bg-gray-800 rounded-xl shadow-2xl">
        <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-indigo-500 mx-auto mb-6"></div>
        <p className="mt-4 text-xl font-semibold text-gray-300">Loading course data...</p>
      </div>
    </div>
  );
  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950">
      <div className="text-center p-8 bg-gray-800 rounded-xl shadow-2xl">
        <p className="text-red-500 text-center text-xl">Error: {error}</p>
        <button
          onClick={() => fetchCourses(1)}
          className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
  if (!courses.length && !loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950">
      <div className="text-center p-8 bg-gray-800 rounded-xl shadow-2xl">
        <p className="text-gray-400 text-center text-xl">No courses found.</p>
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

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PUBLISHED': return 'bg-green-600 text-green-100';
      case 'DRAFT': return 'bg-yellow-600 text-yellow-100';
      case 'ARCHIVED': return 'bg-gray-600 text-gray-100';
      case 'PENDING': return 'bg-blue-600 text-blue-100';
      default: return 'bg-gray-500 text-gray-100';
    }
  };

  const getRatingColor = (rating: string) => {
    const numRating = parseFloat(rating);
    if (numRating >= 4.5) return 'text-yellow-400';
    if (numRating >= 3.5) return 'text-orange-400';
    return 'text-gray-400';
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-sans antialiased py-10">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Hero Section for Course Management */}
        <div className="bg-gray-800/70 backdrop-blur-md rounded-xl p-10 mb-12 shadow-2xl border border-gray-700 flex justify-between items-center">
          <div>
            <h1 className="text-5xl font-extrabold text-white mb-3 tracking-tight drop-shadow-xl flex items-center">
              <BookOpenIcon className="h-12 w-12 text-indigo-400 mr-4" /> Course <span className="text-purple-400">Management</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl">
              Manage and oversee all courses available on your platform, from creation to publication.
            </p>
          </div>
          <button
            onClick={() => console.log('Add New Course clicked')} // Replace with actual add course logic/modal
            className={`${actionColors.primaryButton} text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center`}
          >
            <PlusIcon className="h-6 w-6 mr-2" /> Add New Course
          </button>
        </div>

        {/* Course List Section */}
        <section className="mb-12 bg-gray-800/40 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-gray-700">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-3xl font-semibold text-white">All Courses ({pagination?.totalCourses || '...'})</h3>
            {/* Future: Search Bar */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search courses..."
                className="bg-gray-700 border border-gray-600 rounded-md py-2 pl-10 pr-4 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div key={course.id} className="bg-gray-800/60 backdrop-blur-sm rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] border border-gray-700 overflow-hidden">
                {course.thumbnailUrl && (
                  <img src={course.thumbnailUrl} alt={course.title} className="w-full h-40 object-cover rounded-t-xl" />
                )}
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-white mb-2">{course.title}</h2>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-3">{course.description}</p> {/* Use line-clamp for truncated description */}

                  <div className="flex items-center justify-between text-gray-300 text-sm mb-4">
                    <p className="flex items-center">
                      <UserGroupIcon className="h-4 w-4 mr-1 text-teal-400" />
                      <span className="font-semibold">{course.enrollmentStats.enrolled}</span> Enrolled
                    </p>
                    <p className="flex items-center">
                      <StarIcon className={`h-4 w-4 mr-1 ${getRatingColor(course.averageRating)}`} />
                      <span className={`font-semibold ${getRatingColor(course.averageRating)}`}>{course.averageRating}</span> ({course.reviewCount} reviews)
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-gray-300 text-sm mb-4">
                    <p className="flex items-center">
                      <PlayCircleIcon className="h-4 w-4 mr-1 text-blue-400" />
                      {course.totalLessons} Lessons
                    </p>
                    <p className="flex items-center">
                      <ArrowPathIcon className="h-4 w-4 mr-1 text-pink-400" />
                      {course.totalDuration} Mins
                    </p>
                  </div>

                  <div className="border-t border-gray-700 pt-4 mt-4 text-sm">
                    <p className="mb-2">
                      <span className="font-semibold text-gray-300">Instructor:</span> <span className="text-indigo-400">{course.instructor.name}</span>
                    </p>
                    <p className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-gray-300">Price:</span> <span className="text-green-400 font-bold text-lg">${course.price.toFixed(2)}</span>
                    </p>
                    <p className="flex justify-between items-center">
                      <span className="font-semibold text-gray-300">Status:</span>
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(course.status)}`}>
                        {course.status}
                      </span>
                    </p>
                    {course.createdAt && ( // Only show if createdAt exists
                        <p className="mt-2 text-xs text-gray-500">Created: {formatDate(new Date(course.createdAt))}</p>
                    )}
                  </div>

                  <div className="mt-5 flex justify-end space-x-3">
                    <button onClick={() => console.log('Edit course:', course.id)} className={`${actionColors.edit} hover:scale-110 transition-transform flex items-center text-sm font-medium`}>
                      <PencilSquareIcon className="h-5 w-5 mr-1" /> Edit
                    </button>
                    <button onClick={() => console.log('Delete course:', course.id)} className={`${actionColors.delete} hover:scale-110 transition-transform flex items-center text-sm font-medium`}>
                      <TrashIcon className="h-5 w-5 mr-1" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
            <p className="text-gray-300 text-lg">Total Courses: <span className="font-semibold text-white">{pagination.totalCourses}</span></p>
          </section>
        )}
      </main>
    </div>
  );
}