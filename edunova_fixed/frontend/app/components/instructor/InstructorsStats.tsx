import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { instructorAPI } from '~/lib/instructor';

interface MonthlyEnrollment {
  month: string;
  enrollments: number;
}

interface StatsData {
  instructor: {
    id: number;
    name: string;
    email: string;
    bio: string;
    profileImage: string;
    instructorStatus: string;
    instructorApprovedAt: string;
    createdAt: string;
  };
  statistics: {
    courses: {
      total: number;
      published: number;
      draft: number;
      archived: number;
    };
    enrollments: {
      total: number;
    };
    revenue: {
      total: number;
    };
    trends: {
      monthlyEnrollments: MonthlyEnrollment[];
    };
  };
}

export default function InstructorsStats() {
  const { id } = useParams<{ id: string }>();
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchStats = async () => {
      try {
        const res = await instructorAPI.getInstructorStats(Number(id));
        setStats(res.data.data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [id]);

  if (loading) return <p className="text-center mt-10 text-gray-300">Loading statistics...</p>;
  if (!stats) return <p className="text-center mt-10 text-gray-300">Statistics not found for this instructor.</p>;

  const { instructor, statistics } = stats;

  // --- Perbaikan Bagian Monthly Enrollments ---
  // Dapatkan nilai enrollment maksimum untuk menghitung persentase bar
  const maxEnrollment = statistics.trends.monthlyEnrollments.reduce(
    (max, item) => Math.max(max, item.enrollments),
    0
  );

  return (
    // Main container - Apply dark background, text color, and padding
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <div className="max-w-4xl mx-auto"> {/* Centered content, similar to previous pages */}
        {/* Instructor Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-10 bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700"> {/* Dark card background, shadow, border */}
          <img
            src={instructor.profileImage}
            alt={instructor.name}
            className="w-24 h-24 rounded-full object-cover border-4 border-blue-500 shadow-md" // Accent blue border, larger
          />
          <div className="text-center sm:text-left">
            <h1 className="text-3xl font-bold text-white mb-1">{instructor.name}</h1> {/* Larger, pure white */}
            <p className="text-gray-400 text-lg">{instructor.email}</p> {/* Lighter gray, larger */}
            <p className={`text-lg font-semibold mt-2 ${ // Larger font, bold
              instructor.instructorStatus === 'Active'
                ? 'text-green-500' // Use green for active status
                : 'text-orange-500' // Use orange for other statuses if desired, or gray
            }`}>
              Status: {instructor.instructorStatus}
            </p>
            <p className="text-gray-500 text-sm mt-1">
              Joined: {new Date(instructor.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>

        {/* Key Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10"> {/* Increased gap */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 text-center transform transition duration-300 hover:scale-105"> {/* Dark card, shadow, border, hover effect */}
            <h2 className="text-xl font-semibold text-blue-400 mb-2">Total Courses</h2> {/* Accent blue heading */}
            <p className="text-white text-4xl font-extrabold">{statistics.courses.total}</p> {/* Larger, bolder number */}
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 text-center transform transition duration-300 hover:scale-105">
            <h2 className="text-xl font-semibold text-blue-400 mb-2">Total Enrollments</h2>
            <p className="text-white text-4xl font-extrabold">{statistics.enrollments.total}</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 text-center transform transition duration-300 hover:scale-105">
            <h2 className="text-xl font-semibold text-blue-400 mb-2">Total Revenue</h2>
            <p className="text-green-400 text-4xl font-extrabold">${statistics.revenue.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p> {/* Green for revenue, formatted */}
          </div>
        </div>

        {/* Courses Breakdown */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 mb-10">
          <h2 className="text-xl font-semibold text-blue-400 mb-4 border-b border-gray-700 pb-2">Courses Breakdown</h2>
          <ul className="list-none space-y-3 text-lg"> {/* Removed default list style, increased spacing, larger text */}
            <li className="flex justify-between items-center text-gray-300">
              <span>Published:</span> <span className="font-bold text-white">{statistics.courses.published}</span>
            </li>
            <li className="flex justify-between items-center text-gray-300">
              <span>Draft:</span> <span className="font-bold text-white">{statistics.courses.draft}</span>
            </li>
            <li className="flex justify-between items-center text-gray-300">
              <span>Archived:</span> <span className="font-bold text-white">{statistics.courses.archived}</span>
            </li>
          </ul>
        </div>

        {/* Monthly Enrollments Trend - MODERNIZED */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
          <h2 className="text-xl font-semibold text-blue-400 mb-6 border-b border-gray-700 pb-2">Monthly Enrollments Trend</h2>
          {statistics.trends.monthlyEnrollments.length > 0 ? (
            <div className="space-y-4"> {/* Container for monthly bars */}
              {statistics.trends.monthlyEnrollments
                .sort((a, b) => new Date(`1 ${a.month} 2000`).getMonth() - new Date(`1 ${b.month} 2000`).getMonth()) // Sort by month
                .map((item) => (
                  <div key={item.month} className="flex items-center gap-4">
                    <span className="w-24 text-gray-300 text-right text-sm font-medium">{item.month}</span>
                    <div className="flex-1 bg-gray-700 rounded-full h-3"> {/* Background for the bar */}
                      <div
                        className="bg-blue-500 h-full rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${(item.enrollments / maxEnrollment) * 100}%` }} // Dynamic width
                        title={`${item.enrollments} enrollments`} // Tooltip for accessibility
                      ></div>
                    </div>
                    <span className="w-12 text-white font-semibold text-left text-sm">{item.enrollments}</span>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-md text-gray-500">No monthly enrollment data available yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}