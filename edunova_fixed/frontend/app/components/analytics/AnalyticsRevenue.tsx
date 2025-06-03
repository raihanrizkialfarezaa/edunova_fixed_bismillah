import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { analyticsAPI } from '~/lib/analytics';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { FaDollarSign, FaChartLine, FaUsers, FaArrowUp, FaArrowDown, FaSpinner, FaExclamationCircle } from 'react-icons/fa';

interface CourseInfo {
  title: string;
}

interface SummaryData {
  totalRevenue: number;
  totalEnrollments: number;
  currentPeriodRevenue: number;
  previousPeriodRevenue: number;
  revenueGrowth: number;
  averageMonthlyRevenue: number;
}

interface MonthlyRevenueData {
  monthName: string;
  revenue: number;
  cumulativeRevenue: number;
}

interface RevenueResponse {
  courseInfo: CourseInfo;
  summary: SummaryData;
  monthlyData: MonthlyRevenueData[];
}

export default function AnalyticsRevenue() {
  const { id } = useParams<{ id: string }>();
  const [revenueData, setRevenueData] = useState<RevenueResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) {
      setError('Course ID is missing.');
      setLoading(false);
      return;
    }

    const fetchRevenue = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await analyticsAPI.getCourseRevenue(Number(id));
        setRevenueData(res.data.revenue);
      } catch (err) {
        console.error('Failed to fetch revenue analytics:', err);
        setError('Failed to load revenue data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchRevenue();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[500px] flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-6 rounded-xl shadow-lg">
        <div className="text-center text-gray-700 dark:text-gray-300">
          <FaSpinner className="animate-spin text-5xl text-indigo-600 dark:text-indigo-400 mx-auto mb-4" />
          <p className="text-lg font-medium">Loading revenue analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[500px] flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-6 rounded-xl shadow-lg">
        <div className="text-center text-red-600 dark:text-red-400">
          <FaExclamationCircle className="text-5xl mx-auto mb-4" />
          <p className="text-lg font-medium">{error}</p>
        </div>
      </div>
    );
  }

  if (!revenueData || !revenueData.courseInfo || !revenueData.summary || !revenueData.monthlyData) {
    return (
      <div className="min-h-[500px] flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-6 rounded-xl shadow-lg">
        <div className="text-center text-gray-700 dark:text-gray-300">
          <FaChartLine className="text-5xl mx-auto mb-4" />
          <p className="text-lg font-medium">No detailed revenue data found for this course.</p>
        </div>
      </div>
    );
  }

  const { courseInfo, summary, monthlyData } = revenueData;
  const isGrowthPositive = summary.revenueGrowth >= 0;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-extrabold mb-8 text-center text-indigo-700 dark:text-indigo-400">
          <FaDollarSign className="inline-block mr-3 text-4xl" />
          Analisis Pendapatan - {courseInfo.title}
        </h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg transform transition duration-300 hover:scale-105 flex flex-col items-center justify-center text-center">
            <FaDollarSign className="text-5xl text-green-500 mx-auto mb-3" />
            <p className="font-semibold text-lg text-gray-700 dark:text-gray-200">Total Pendapatan:</p>
            <p className="text-4xl font-extrabold text-green-600 dark:text-green-400">${summary.totalRevenue.toFixed(2)}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg transform transition duration-300 hover:scale-105 flex flex-col items-center justify-center text-center">
            <FaUsers className="text-5xl text-blue-500 mx-auto mb-3" />
            <p className="font-semibold text-lg text-gray-700 dark:text-gray-200">Total Pendaftar:</p>
            <p className="text-4xl font-extrabold text-blue-600 dark:text-blue-400">{summary.totalEnrollments}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg transform transition duration-300 hover:scale-105 flex flex-col items-center justify-center text-center">
            {isGrowthPositive ? (
              <FaArrowUp className="text-5xl text-teal-500 mx-auto mb-3" />
            ) : (
              <FaArrowDown className="text-5xl text-red-500 mx-auto mb-3" />
            )}
            <p className="font-semibold text-lg text-gray-700 dark:text-gray-200">Pertumbuhan Pendapatan:</p>
            <p className={`text-4xl font-extrabold ${isGrowthPositive ? 'text-teal-600 dark:text-teal-400' : 'text-red-600 dark:text-red-400'}`}>
              {summary.revenueGrowth}%
            </p>
          </div>
        </div>

        {/* Detailed Summary */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100 flex items-center">
            <FaChartLine className="mr-3 text-purple-600 dark:text-purple-400 text-3xl" />
            Detail Ringkasan Pendapatan
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-lg text-gray-700 dark:text-gray-300">
            <p className="flex items-center">
              <FaDollarSign className="mr-2 text-green-500" /> Pendapatan Periode Saat Ini: <span className="font-semibold ml-1">${summary.currentPeriodRevenue.toFixed(2)}</span>
            </p>
            <p className="flex items-center">
              <FaDollarSign className="mr-2 text-yellow-500" /> Pendapatan Periode Sebelumnya: <span className="font-semibold ml-1">${summary.previousPeriodRevenue.toFixed(2)}</span>
            </p>
            <p className="flex items-center col-span-full">
              <FaChartLine className="mr-2 text-cyan-500" /> Rata-rata Pendapatan Bulanan: <span className="font-semibold ml-1">${summary.averageMonthlyRevenue.toFixed(2)}</span>
            </p>
          </div>
        </div>

        {/* Monthly Revenue Trend Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg relative h-[400px]"> {/* Changed min-h-[400px] to h-[400px] */}
          <h2 className="absolute top-6 left-6 text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center z-10">
            <FaChartLine className="mr-3 text-indigo-600 dark:text-indigo-400 text-3xl" />
            Tren Pendapatan Bulanan
          </h2>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyData} margin={{ top: 60, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--recharts-grid-stroke-light)" className="recharts-grid" />
              <XAxis dataKey="monthName" stroke="var(--recharts-axis-stroke-light)" tick={{ fill: 'var(--recharts-tick-fill-light)' }} className="recharts-xaxis" />
              <YAxis stroke="var(--recharts-axis-stroke-light)" tick={{ fill: 'var(--recharts-tick-fill-light)' }} className="recharts-yaxis" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--recharts-tooltip-bg-light)',
                  border: '1px solid var(--recharts-tooltip-border-light)',
                  borderRadius: '8px',
                }}
                itemStyle={{ color: 'var(--recharts-tooltip-item-color-light)' }}
                labelStyle={{ color: 'var(--recharts-tooltip-label-color-light)' }}
                wrapperClassName="recharts-tooltip-wrapper"
              />
              <Legend wrapperStyle={{ paddingTop: '20px', color: 'var(--recharts-legend-text-light)' }} />
              <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={3} name="Pendapatan Bulanan" activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="cumulativeRevenue" stroke="#82ca9d" strokeWidth={3} name="Pendapatan Kumulatif" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Global CSS variables and rules for Recharts styling in light/dark mode */}
      {/* It is highly recommended to move this <style> block to your main global CSS file (e.g., index.css or globals.css) */}
      <style>{`
        /* Global CSS Variables for Recharts in Light Mode */
        :root {
          --recharts-grid-stroke-light: #e5e7eb; /* gray-200 */
          --recharts-axis-stroke-light: #6b7280; /* gray-500 */
          --recharts-tick-fill-light: #6b7280;   /* gray-500 */
          --recharts-tooltip-bg-light: rgb(255, 255, 255);
          --recharts-tooltip-border-light: rgb(209, 213, 219); /* gray-300 */
          --recharts-tooltip-item-color-light: rgb(17, 24, 39); /* gray-900 */
          --recharts-tooltip-label-color-light: rgb(55, 65, 81); /* gray-700 */
          --recharts-legend-text-light: #4b5563; /* gray-600 */
        }

        /* Dark Mode overrides for Recharts CSS Variables */
        .dark {
          --recharts-grid-stroke-light: #4b5563; /* gray-600 */
          --recharts-axis-stroke-light: #9ca3af; /* gray-400 */
          --recharts-tick-fill-light: #9ca3af;   /* gray-400 */
          --recharts-tooltip-bg-light: #374151; /* gray-700 */
          --recharts-tooltip-border-light: #4b5563; /* gray-600 */
          --recharts-tooltip-item-color-light: #d1d5db; /* gray-300 */
          --recharts-tooltip-label-color-light: #e5e7eb; /* gray-200 */
          --recharts-legend-text-light: #d1d5db; /* gray-300 */
        }

        /* Applying the variables to Recharts elements */
        .recharts-cartesian-grid line {
            stroke: var(--recharts-grid-stroke-light);
        }
        .recharts-xAxis line, .recharts-yAxis line {
            stroke: var(--recharts-axis-stroke-light);
        }
        .recharts-xAxis .recharts-cartesian-axis-tick text,
        .recharts-yAxis .recharts-cartesian-axis-tick text {
            fill: var(--recharts-tick-fill-light);
        }
        .recharts-legend-wrapper .recharts-legend-item-text {
            color: var(--recharts-legend-text-light);
        }
        /* Specific styling for tooltip wrapper */
        .recharts-tooltip-wrapper {
          background-color: var(--recharts-tooltip-bg-light) !important;
          border-color: var(--recharts-tooltip-border-light) !important;
          border-radius: 8px !important;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1); /* Tailwind's shadow-md */
        }
        .recharts-tooltip-wrapper .recharts-tooltip-item {
          color: var(--recharts-tooltip-item-color-light) !important;
        }
        .recharts-tooltip-wrapper .recharts-tooltip-label {
          color: var(--recharts-tooltip-label-color-light) !important;
        }
      `}</style>
    </div>
  );
}