import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import { useAuth } from '../contexts/AuthContext';
import axiosInstance from '../lib/axios'; 
import { FaBookOpen, FaCalendarAlt, FaDollarSign, FaArrowRight, FaSpinner, FaInfoCircle } from 'react-icons/fa'; // Import ikon

type Enrollment = {
  id: number;
  course: {
    id: number;
    title: string;
    price: number;
  };
  payment?: {
    status: 'PENDING' | 'COMPLETED' | 'FAILED';
  };
  enrolledAt: string;
};

export default function UserEnrollments() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // State untuk error

  useEffect(() => {
    if (!user) {
      // Jika user tidak ada, navigasi ke halaman login
      navigate('/login');
      return;
    }
    fetchEnrollments();
  }, [user, navigate]); 

  const fetchEnrollments = async () => {
    setLoading(true);
    setError(null); // Reset error
    try {
      // Assuming your backend has an endpoint to fetch current user's enrollments
      const res = await axiosInstance.get<{
        enrollments: Enrollment[];
      }>(`/my-enrollments`);
      setEnrollments(res.data.enrollments);
    } catch (err: any) {
      console.error('Failed to fetch enrollments:', err);
      const errorMessage = err.response?.data?.message || 'Unable to load your enrollments. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Global container for the component
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-gray-800 rounded-lg shadow-xl p-8 border border-gray-700">
        <h1 className="text-3xl font-bold text-white mb-8 text-center flex items-center justify-center">
          <FaBookOpen className="mr-3 text-blue-400" /> My Enrollments
        </h1>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-blue-300 text-lg">Loading your enrollments...</p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="bg-red-900/20 text-red-400 p-4 rounded-md mb-6 border border-red-700 flex items-center justify-center">
            <FaInfoCircle className="mr-3 text-2xl" /> {error}
          </div>
        )}

        {/* No Enrollments State */}
        {!loading && !error && enrollments.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-400 text-lg mb-4">You have not enrolled in any courses yet.</p>
            <Link to="/course" className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-md">
              Browse Courses <FaArrowRight className="ml-2" />
            </Link>
          </div>
        )}

        {/* Enrollments List */}
        {!loading && !error && enrollments.length > 0 && (
          <ul className="space-y-4">
            {enrollments.map((en) => (
              <li key={en.id} className="bg-gray-700 p-5 rounded-lg shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center transition-transform transform hover:scale-[1.01] border border-gray-600">
                {en.course ? (
                  <>
                    <div className="mb-4 sm:mb-0">
                      <h3 className="text-xl font-semibold text-white mb-1">{en.course.title}</h3>
                      <p className="text-sm text-gray-400 flex items-center mb-1">
                        <FaCalendarAlt className="mr-2 text-gray-500" /> Enrolled on {new Date(en.enrolledAt).toLocaleDateString()}
                      </p>
                      <p className="text-md text-green-400 font-medium flex items-center">
                        <FaDollarSign className="mr-2 text-green-500" /> Price: ${(en.course.price / 100).toFixed(2)}
                      </p>

                      {/* Payment Status */}
                      {en.payment && <p className={`text-sm font-medium mt-1 ${en.payment.status === 'COMPLETED' ? 'text-green-400' : en.payment.status === 'PENDING' ? 'text-yellow-400' : 'text-red-400'}`}>Payment: {en.payment.status}</p>}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col space-y-2">
                      {en.payment?.status === 'COMPLETED' || en.course.price === 0 ? (
                        <Link
                          to={`/courses/${en.course.id}/lessons`}
                          className="inline-flex items-center px-5 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 text-md"
                        >
                          Start Learning <FaArrowRight className="ml-2" />
                        </Link>
                      ) : en.payment?.status === 'PENDING' ? (
                        <Link
                          to={`/enrollments/${en.id}/payment`}
                          className="inline-flex items-center px-5 py-2 bg-yellow-600 text-white rounded-lg shadow-md hover:bg-yellow-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 text-md"
                        >
                          Complete Payment <FaArrowRight className="ml-2" />
                        </Link>
                      ) : (
                        <Link
                          to={`/courses/${en.course.id}`}
                          className="inline-flex items-center px-5 py-2 bg-purple-600 text-white rounded-lg shadow-md hover:bg-purple-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 text-md"
                        >
                          View Course <FaArrowRight className="ml-2" />
                        </Link>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="text-red-400 font-medium">
                    <p>This course has been deleted.</p>
                    <p className="text-sm text-gray-400 mt-1">You enrolled on: {new Date(en.enrolledAt).toLocaleDateString()}</p>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
