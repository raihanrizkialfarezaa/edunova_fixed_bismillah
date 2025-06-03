import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { instructorAPI } from '~/lib/instructor';

export default function InstructorCourses() {
  const { id } = useParams<{ id: string }>();
  const [courses, setCourses] = useState<any[]>([]);
  const [instructor, setInstructor] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [status, setStatus] = useState<'PUBLISHED' | 'DRAFT' | 'ARCHIVED'>('PUBLISHED');

  const fetchCourses = async () => {
    if (!id) return;
    try {
      const res = await instructorAPI.getInstructorCourses(Number(id), {
        page,
        limit: 6,
        status,
      });
      const data = res.data.data;
      setInstructor(data.instructor);
      setCourses(data.courses);
      setTotalPages(data.pagination.totalPages);
    } catch (err) {
      console.error('Failed to load courses:', err);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [id, page, status]);

  return (
    // Main container - Apply dark background, text color, and padding
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        {instructor && (
          // Instructor profile section
          <div className="flex items-center gap-4 mb-8 bg-gray-800 p-6 rounded-lg shadow-lg">
            <img
              src={instructor.profileImage}
              alt={instructor.name}
              className="w-20 h-20 rounded-full object-cover border-2 border-blue-500" // Added border for emphasis
            />
            <div>
              <h2 className="text-3xl font-bold text-white">{instructor.name}</h2>
              <p className="text-gray-400 text-lg mt-1">{instructor.bio}</p>
            </div>
          </div>
        )}

        {/* Filter by Status section */}
        <div className="mb-6 flex items-center justify-end"> {/* Align filter to the right */}
          <label htmlFor="status-filter" className="mr-3 font-medium text-gray-300">Filter by Status:</label>
          <select
            id="status-filter"
            value={status}
            onChange={(e) => setStatus(e.target.value as 'PUBLISHED' | 'DRAFT' | 'ARCHIVED')}
            className="border border-gray-700 bg-gray-700 text-gray-100 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" // Styled select input
          >
            <option value="PUBLISHED">Published</option>
            <option value="DRAFT">Draft</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            // Individual Course Card
            <div key={course.id} className="bg-gray-800 rounded-lg p-5 shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-xl">
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-48 object-cover rounded-md mb-4 border border-gray-700" // Increased height, added border
              />
              <h3 className="text-xl font-semibold text-white mb-2">{course.title}</h3>
              <p className="text-sm text-gray-400 mb-3 line-clamp-3">{course.description}</p> {/* Added line-clamp for description */}
              <div className="flex justify-between items-center text-sm mb-2">
                <p className="text-blue-400 font-bold">Price: ${course.price}</p> {/* Price in accent blue */}
                <span className="text-gray-500 text-xs">
                  {course.totalLessons} Lessons
                </span>
              </div>
              <div className="text-gray-500 text-xs flex justify-between items-center">
                <span>Duration: {course.totalDuration}s</span>
                <span>Enrollments: {course.totalEnrollments}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-center mt-10 gap-3">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Previous
          </button>
          <span className="font-semibold text-xl text-white flex items-center justify-center px-4 py-2">Page {page} of {totalPages}</span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}