import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { analyticsAPI } from '~/lib/analytics';
import { FaBook, FaDollarSign, FaUser, FaCheckCircle, FaChartLine, FaStar, FaCalendarAlt } from 'react-icons/fa';
import { MdOutlineWorkspaces } from 'react-icons/md'

interface RatingDistribution {
  rating: number;
  count: number;
}

interface MonthlyTrend {
  year: number;
  month: number;
  enrollments: number;
}

export default function AnalyticsCourse() {
  const { id } = useParams<{ id: string }>();
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchAnalytics = async () => {
      try {
        const res = await analyticsAPI.getAnalytics(Number(id));
        setAnalytics(res.data.analytics);
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [id]);

  if (loading) return <p className="text-center mt-10">Loading analytics...</p>;
  if (!analytics) return <p className="text-center mt-10">Analytics not found.</p>;

  const {
    courseInfo,
    enrollmentStats,
    reviewStats,
    monthlyTrends
  } = analytics;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-extrabold mb-8 text-center text-indigo-700 dark:text-indigo-400">
          <FaChartLine className="inline-block mr-3 text-4xl" />
          Analisis Kursus
        </h1>

        {/* Informasi Kursus */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg mb-6 transform transition duration-300 hover:scale-105">
          <h2 className="text-2xl font-bold mb-3 text-indigo-600 dark:text-indigo-300 flex items-center">
            <FaBook className="mr-3" /> {courseInfo.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-lg">
            <p className="flex items-center">
              <MdOutlineWorkspaces className="mr-2 text-blue-500" /> Status: <span className="font-semibold ml-1">{courseInfo.status}</span>
            </p>
            <p className="flex items-center">
              <FaDollarSign className="mr-2 text-green-500" /> Harga: <span className="font-semibold ml-1">${courseInfo.price}</span>
            </p>
            <p className="flex items-center col-span-full">
              <FaUser className="mr-2 text-purple-500" /> Pengajar: <span className="font-semibold ml-1">{courseInfo.instructor.name}</span> (<a href={`mailto:${courseInfo.instructor.email}`} className="text-blue-500 dark:text-blue-400 hover:underline">{courseInfo.instructor.email}</a>)
            </p>
          </div>
        </div>

        {/* Statistik Ringkasan */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg text-center transform transition duration-300 hover:scale-105">
            <FaCheckCircle className="text-5xl text-blue-500 mx-auto mb-3" />
            <h3 className="font-semibold text-lg text-gray-700 dark:text-gray-200">Total Pendaftar</h3>
            <p className="text-4xl font-extrabold text-blue-600 dark:text-blue-400">{enrollmentStats.total}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg text-center transform transition duration-300 hover:scale-105">
            <FaChartLine className="text-5xl text-teal-500 mx-auto mb-3" />
            <h3 className="font-semibold text-lg text-gray-700 dark:text-gray-200">Tingkat Penyelesaian</h3>
            <p className="text-4xl font-extrabold text-teal-600 dark:text-teal-400">{enrollmentStats.completionRate}%</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg text-center transform transition duration-300 hover:scale-105">
            <FaChartLine className="text-5xl text-orange-500 mx-auto mb-3" />
            <h3 className="font-semibold text-lg text-gray-700 dark:text-gray-200">Progres Rata-rata</h3>
            <p className="text-4xl font-extrabold text-orange-600 dark:text-orange-400">{enrollmentStats.averageProgress}%</p>
          </div>
        </div>

        {/* Pendaftaran Berdasarkan Status */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg mb-6">
          <h3 className="font-semibold text-xl mb-4 text-gray-700 dark:text-gray-200 flex items-center">
            <FaCheckCircle className="mr-3 text-green-500" /> Pendaftaran Berdasarkan Status
          </h3>
          <ul className="list-disc list-inside text-lg space-y-2 text-gray-700 dark:text-gray-300">
            {Object.entries(enrollmentStats.byStatus as Record<string, number>).map(
            ([status, count]) => (
                <li key={status}>
                {status}: {count}
                </li>
            )
            )}
          </ul>
        </div>

        {/* Statistik Ulasan */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg mb-6">
          <h3 className="font-semibold text-xl mb-4 text-gray-700 dark:text-gray-200 flex items-center">
            <FaStar className="mr-3 text-yellow-500" /> Statistik Ulasan
          </h3>
          <p className="text-lg mb-3 text-gray-700 dark:text-gray-300 flex items-center">
            Rating Rata-rata: <span className="font-bold text-xl ml-2">{reviewStats.averageRating} ⭐</span>
          </p>
          <ul className="text-lg space-y-2 text-gray-700 dark:text-gray-300">
            {reviewStats.ratingDistribution.map((item: RatingDistribution) => (
              <li key={item.rating} className="flex items-center">
                <span className="font-semibold">{item.rating} Bintang:</span> <span className="ml-2">{item.count}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Tren Pendaftaran Bulanan */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <h3 className="font-semibold text-xl mb-4 text-gray-700 dark:text-gray-200 flex items-center">
            <FaCalendarAlt className="mr-3 text-purple-500" /> Tren Pendaftaran Bulanan
          </h3>
          {monthlyTrends.length > 0 ? (
            <ul className="text-lg space-y-2 text-gray-700 dark:text-gray-300">
              {monthlyTrends.map((trend: MonthlyTrend, idx: number) => (
                <li key={idx} className="flex items-center">
                  <span className="font-semibold">{trend.year}-{trend.month.toString().padStart(2, '0')}:</span>
                  <span className="ml-2">{trend.enrollments} pendaftar</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-lg text-gray-500 dark:text-gray-400">Tidak ada data tren tersedia.</p>
          )}
        </div>
      </div>
    </div>
  );
}
