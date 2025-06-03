import { useEffect, useState } from 'react';
import { dashboardAPI } from '../../lib/dashboard';
import { Link } from 'react-router';
import {
  UsersIcon,
  BookOpenIcon,
  AcademicCapIcon,
  CurrencyDollarIcon,
  ChatBubbleBottomCenterTextIcon,
  ArrowRightIcon,
  ChartBarIcon // Added for potential future charts/analytics
} from '@heroicons/react/24/outline'; // Importing some icons for visual flair

export default function AdminStats() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Define a consistent color palette for buttons for dark mode
  const buttonColors = {
    primary: 'bg-indigo-600 hover:bg-indigo-700', // For main actions
    secondary: 'bg-teal-600 hover:bg-teal-700', // For secondary actions
    danger: 'bg-red-600 hover:bg-red-700', // For destructive actions
    neutral: 'bg-gray-600 hover:bg-gray-700' // For disabled/submitted states
  };

  useEffect(() => {
    dashboardAPI.getDashboard()
      .then((res) => setStats(res.data.data.statistics))
      .catch((err) => setError('Failed to fetch dashboard stats'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950">
      <div className="text-center p-8 bg-gray-800 rounded-xl shadow-2xl">
        <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-indigo-500 mx-auto mb-6"></div>
        <p className="mt-4 text-xl font-semibold text-gray-300">Loading admin statistics...</p>
      </div>
    </div>
  );
  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950">
      <div className="text-center p-8 bg-gray-800 rounded-xl shadow-2xl">
        <p className="text-red-500 text-center text-xl">Error: {error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
  if (!stats) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950">
      <div className="text-center p-8 bg-gray-800 rounded-xl shadow-2xl">
        <p className="text-gray-400 text-center text-xl">No statistics available at the moment.</p>
      </div>
    </div>
  );

  const { users, courses, enrollments, revenue, reviews } = stats;

  // Modified Section component to accept an icon
  const Section = ({ title, data, icon: Icon }: { title: string; data: any; icon?: React.ElementType }) => (
    <div className="bg-gray-800/60 backdrop-blur-sm p-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]">
      <div className="flex items-center mb-4">
        {Icon && <Icon className="h-8 w-8 text-indigo-400 mr-3" />}
        <h2 className="text-2xl font-bold text-white">{title}</h2>
      </div>
      <ul className="space-y-2 text-gray-300">
        {Object.entries(data).map(([key, value]) => (
          <li key={key} className="capitalize flex justify-between items-center text-lg">
            <span className="font-medium text-gray-200">{key.replace(/([A-Z])/g, ' $1')}:</span>
            <span className="text-indigo-400 font-semibold">
              {typeof value === 'string' || typeof value === 'number' ? value : JSON.stringify(value)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );

  const QuickLinkCard = ({ to, title, description, icon: Icon, colorClass }: { to: string; title: string; description: string; icon: React.ElementType; colorClass: string }) => (
    <Link to={to} className={`block bg-gray-800/50 hover:bg-gray-700/60 rounded-xl p-5 transition-all duration-300 transform hover:scale-[1.03] shadow-md hover:shadow-lg relative overflow-hidden group`}>
      <div className="flex items-center mb-3">
        <Icon className={`h-8 w-8 ${colorClass} mr-3 transition-transform duration-300 group-hover:scale-110`} />
        <h4 className="font-semibold text-xl text-white">{title}</h4>
      </div>
      <p className="text-sm text-gray-300 mb-4 leading-relaxed">{description}</p>
      <div className="flex items-center text-indigo-400 font-medium group-hover:text-indigo-300 transition-colors">
        Go to <ArrowRightIcon className="h-4 w-4 ml-1 transform transition-transform group-hover:translate-x-1" />
      </div>
      {/* Subtle background gradient on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-gray-700/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
    </Link>
  );


  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-sans antialiased py-10">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Hero Section for Admin Statistics */}
        <div className="bg-gray-800/70 backdrop-blur-md rounded-xl p-10 mb-12 shadow-2xl border border-gray-700">
          <h1 className="text-6xl font-extrabold text-white mb-4 tracking-tight drop-shadow-xl text-center">
            Admin <span className="text-indigo-400">Control</span> Center
          </h1>
          <p className="text-2xl text-gray-300 text-center max-w-2xl mx-auto">
            A comprehensive overview of your platform's performance and key metrics.
          </p>
        </div>

        {/* Platform Overview Statistics */}
        <section className="mb-12">
          <h3 className="text-3xl font-semibold mb-8 text-white border-b-2 border-indigo-500 pb-3">
            <ChartBarIcon className="h-7 w-7 inline-block mr-2 text-indigo-400" /> Platform Overview
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Section title="User Statistics" data={users} icon={UsersIcon} />
            <Section title="Course Statistics" data={courses} icon={BookOpenIcon} />
            <Section title="Enrollment Statistics" data={enrollments} icon={AcademicCapIcon} />
            <Section title="Revenue Statistics" data={revenue} icon={CurrencyDollarIcon} />
            <Section title="Review Statistics" data={reviews} icon={ChatBubbleBottomCenterTextIcon} />
            {/* You can add more statistics cards here */}
            <div className="bg-gray-800/60 backdrop-blur-sm p-6 rounded-xl shadow-lg flex items-center justify-center text-center text-gray-400 text-xl font-medium col-span-1 md:col-span-2 lg:col-span-1">
              <span className="inline-block animate-bounce mr-2">📊</span> More insights coming soon!
            </div>
          </div>
        </section>

        {/* Quick Management Links Section */}
        <section className="bg-gray-800/40 backdrop-blur-sm rounded-xl p-8 transition-all duration-300 border border-gray-700">
          <h3 className="text-3xl font-semibold mb-8 text-white border-b-2 border-teal-500 pb-3">
            <ArrowRightIcon className="h-7 w-7 inline-block mr-2 text-teal-400" /> Quick Management Tools
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <QuickLinkCard
              to="/admin/users"
              title="Manage Users"
              description="View, edit, and manage all user accounts, roles, and permissions."
              icon={UsersIcon}
              colorClass="text-indigo-400"
            />
            <QuickLinkCard
              to="/admin/courses"
              title="Manage Courses"
              description="Oversee course creation, content updates, and course statuses."
              icon={BookOpenIcon}
              colorClass="text-teal-400"
            />
            <QuickLinkCard
              to="/admin/instructor-requests"
              title="Instructor Requests"
              description="Review and approve/reject instructor applications."
              icon={AcademicCapIcon}
              colorClass="text-purple-400"
            />
            <QuickLinkCard
              to="/category"
              title="Manage Categories"
              description="Administer course categories and tags for better organization."
              icon={ChartBarIcon} // Using a generic icon for now
              colorClass="text-orange-400"
            />
            <QuickLinkCard
              to="/payouts/pending"
              title="Process Payments"
              description="Handle and track all platform payments and instructor payouts."
              icon={CurrencyDollarIcon}
              colorClass="text-green-400"
            />
            <QuickLinkCard
              to="/quiz/list"
              title="Management Quiz"
              description="Configure global platform settings and system preferences."
              icon={ArrowRightIcon} // Using a generic icon for now
              colorClass="text-red-400"
            />
          </div>
        </section>
      </main>
    </div>
  );
}