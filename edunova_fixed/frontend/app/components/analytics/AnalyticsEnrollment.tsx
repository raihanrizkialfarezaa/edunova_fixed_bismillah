import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FaChartLine, FaSpinner, FaTimesCircle, FaCheckCircle } from 'react-icons/fa'; // Menambahkan ikon untuk loading/error
import { analyticsAPI } from '~/lib/analytics'; // Pastikan path-nya sesuai

interface MonthlyStat {
  year: number;
  month: number;
  count: number;
  monthName: string;
}

interface TrendsResponse {
  trends: {
    period: string; // Bisa "monthly", "weekly", dll. (jika ada)
    enrollments: MonthlyStat[];
    completions: MonthlyStat[];
    dropouts: MonthlyStat[];
  };
}

const AnalyticsEnrollment = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [chartData, setChartData] = useState<any[]>([]);
  const [hasData, setHasData] = useState(false); // State untuk melacak apakah ada data

  useEffect(() => {
    if (!id) {
      setError('Course ID is missing.');
      setLoading(false);
      return;
    }

    const fetchTrends = async () => {
      try {
        setLoading(true);
        setError(''); // Reset error
        const res = await analyticsAPI.getCourseEnrollmentTrends(Number(id));
        const { enrollments, completions, dropouts } =
          res.data.trends as TrendsResponse['trends'];

        if (enrollments.length === 0) {
          setHasData(false);
          setChartData([]); // Kosongkan data chart jika tidak ada enrollments
          return;
        }

        const merged = enrollments.map((e, idx) => ({
          name: `${e.monthName} ${e.year}`,
          Enrolled: e.count,
          // Pastikan completions/dropouts ada sebelum mengakses .count
          Completed: completions[idx] ? completions[idx].count : 0,
          Dropped: dropouts[idx] ? dropouts[idx].count : 0,
        }));

        setChartData(merged);
        setHasData(true); // Ada data
      } catch (err: any) {
        console.error('Failed to load analytics:', err);
        setError(err.response?.data?.message || 'Failed to load enrollment analytics. Please try again.');
        setHasData(false); // Tidak ada data karena error
      } finally {
        setLoading(false);
      }
    };

    fetchTrends();
  }, [id]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-[300px] flex items-center justify-center bg-gray-800 rounded-lg shadow-xl p-6 border border-gray-700">
        <FaSpinner className="animate-spin text-blue-500 text-3xl mr-4" />
        <p className="text-gray-300 text-lg">Loading enrollment trends...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-[300px] flex flex-col items-center justify-center bg-red-900/20 rounded-lg shadow-xl p-6 border border-red-700 text-red-400">
        <FaTimesCircle className="text-red-500 text-3xl mb-3" />
        <p className="text-lg text-center">{error}</p>
      </div>
    );
  }

  // No data state
  if (!hasData || chartData.length === 0) {
    return (
      <div className="min-h-[300px] flex flex-col items-center justify-center bg-gray-800 rounded-lg shadow-xl p-6 border border-gray-700 text-gray-300">
        <FaChartLine className="text-blue-400 text-4xl mb-4" />
        <p className="text-lg font-semibold mb-2">No Enrollment Data Available</p>
        <p className="text-md text-gray-400">There are no enrollment trends to display for this course yet.</p>
      </div>
    );
  }

  // Main content display
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
        <FaChartLine className="mr-3 text-blue-400" /> Enrollment Trends
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData} margin={{ top: 15, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" /> {/* Warna grid lebih gelap */}
          <XAxis
            dataKey="name"
            stroke="#a0aec0" // Warna label X-axis
            tick={{ fill: '#cbd5e0', fontSize: 12 }} // Warna teks tick X-axis
            axisLine={{ stroke: '#4a5568' }} // Warna garis X-axis
            tickLine={{ stroke: '#4a5568' }} // Warna garis tick X-axis
          />
          <YAxis
            stroke="#a0aec0" // Warna label Y-axis
            tick={{ fill: '#cbd5e0', fontSize: 12 }} // Warna teks tick Y-axis
            axisLine={{ stroke: '#4a5568' }} // Warna garis Y-axis
            tickLine={{ stroke: '#4a5568' }} // Warna garis tick Y-axis
          />
          <Tooltip
            contentStyle={{ backgroundColor: '#2d3748', border: '1px solid #4a5568', borderRadius: '4px' }} // Background tooltip
            labelStyle={{ color: '#cbd5e0' }} // Warna label di tooltip
            itemStyle={{ color: '#ffffff' }} // Warna item di tooltip
            formatter={(value: number, name: string) => [`${value} ${name}`, 'Count']} // Custom formatter
          />
          <Legend
            wrapperStyle={{ color: '#cbd5e0', paddingTop: '10px' }} // Warna teks legend
            formatter={(value: string) => <span style={{ color: '#cbd5e0' }}>{value}</span>} // Custom formatter untuk teks legend
          />
          <Line
            type="monotone"
            dataKey="Enrolled"
            stroke="#3b82f6" // Biru (Tailwind: blue-500)
            strokeWidth={3} // Sedikit lebih tebal
            activeDot={{ r: 8 }} // Dot aktif lebih besar
          />
          <Line
            type="monotone"
            dataKey="Completed"
            stroke="#10b981" // Hijau (Tailwind: emerald-500)
            strokeWidth={3}
            activeDot={{ r: 8 }}
          />
          <Line
            type="monotone"
            dataKey="Dropped"
            stroke="#ef4444" // Merah (Tailwind: red-500)
            strokeWidth={3}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AnalyticsEnrollment;

// import { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// import { FaChartLine, FaSpinner, FaExclamationCircle } from 'react-icons/fa'; // Import spinner and error icons
// import { analyticsAPI } from '~/lib/analytics';

// interface MonthlyStat {
//   year: number;
//   month: number;
//   count: number;
//   monthName: string;
// }

// interface TrendsResponse {
//   trends: {
//     period: string;
//     enrollments: MonthlyStat[];
//     completions: MonthlyStat[];
//     dropouts: MonthlyStat[];
//   };
// }

// const AnalyticsEnrollment = () => {
//   const { id } = useParams();
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [chartData, setChartData] = useState<any[]>([]);

//   useEffect(() => {
//     if (!id) {
//       // Handle missing ID gracefully
//       setError('Course ID is missing.');
//       setLoading(false);
//       return;
//     }

//     const fetchTrends = async () => {
//       try {
//         setLoading(true);
//         setError(''); // Clear previous errors
//         const res = await analyticsAPI.getCourseEnrollmentTrends(Number(id));
//         const { enrollments, completions, dropouts } = res.data.trends as TrendsResponse['trends'];

//         const merged = enrollments.map((e, idx) => ({
//           name: `${e.monthName} ${e.year}`,
//           Enrolled: e.count,
//           Completed: completions[idx]?.count || 0,
//           Dropped: dropouts[idx]?.count || 0,
//         }));

//         setChartData(merged);
//       } catch (err) {
//         console.error('Failed to load analytics:', err); // Log the actual error for debugging
//         setError('Failed to load analytics data. Please try again.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTrends();
//   }, [id]);

//   return (
//     <div className="min-h-[400px] flex items-center justify-center bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg transform transition duration-300 hover:scale-[1.01] mb-6 relative">
//       {/* Title positioned absolutely here, OUTSIDE the ResponsiveContainer */}
//       <h2 className="absolute top-6 left-6 text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center z-10">
//         <FaChartLine className="mr-3 text-indigo-600 dark:text-indigo-400 text-3xl" />
//         Tren Pendaftaran
//       </h2>

//       {loading ? (
//         <div className="text-center text-gray-700 dark:text-gray-300">
//           <FaSpinner className="animate-spin text-5xl text-indigo-600 dark:text-indigo-400 mx-auto mb-4" />
//           <p className="text-lg font-medium">Loading enrollment trends...</p>
//         </div>
//       ) : error ? (
//         <div className="text-center text-red-600 dark:text-red-400">
//           <FaExclamationCircle className="text-5xl mx-auto mb-4" />
//           <p className="text-lg font-medium">{error}</p>
//         </div>
//       ) : chartData.length === 0 ? (
//         <div className="text-center text-gray-700 dark:text-gray-300">
//           <FaChartLine className="text-5xl mx-auto mb-4" />
//           <p className="text-lg font-medium">No enrollment trend data available for this course.</p>
//         </div>
//       ) : (
//         // Only LineChart is now a child of ResponsiveContainer
//         <ResponsiveContainer width="100%" height="100%">
//           <LineChart data={chartData} margin={{ top: 60, right: 30, left: 0, bottom: 0 }}>
//             <CartesianGrid strokeDasharray="3 3" stroke="var(--recharts-grid-stroke-light)" className="recharts-grid" />
//             <XAxis dataKey="name" stroke="var(--recharts-axis-stroke-light)" tick={{ fill: 'var(--recharts-tick-fill-light)' }} className="recharts-xaxis" />
//             <YAxis stroke="var(--recharts-axis-stroke-light)" tick={{ fill: 'var(--recharts-tick-fill-light)' }} className="recharts-yaxis" />
//             <Tooltip
//               contentStyle={{
//                 backgroundColor: 'var(--recharts-tooltip-bg-light)',
//                 border: '1px solid var(--recharts-tooltip-border-light)',
//                 borderRadius: '8px',
//               }}
//               itemStyle={{ color: 'var(--recharts-tooltip-item-color-light)' }}
//               labelStyle={{ color: 'var(--recharts-tooltip-label-color-light)' }}
//               wrapperClassName="recharts-tooltip-wrapper"
//             />
//             <Legend wrapperStyle={{ paddingTop: '20px', color: 'var(--recharts-legend-text-light)' }} />
//             <Line type="monotone" dataKey="Enrolled" stroke="#3b82f6" strokeWidth={3} activeDot={{ r: 8 }} name="Pendaftar" />
//             <Line type="monotone" dataKey="Completed" stroke="#10b981" strokeWidth={3} activeDot={{ r: 8 }} name="Selesai" />
//             <Line type="monotone" dataKey="Dropped" stroke="#ef4444" strokeWidth={3} activeDot={{ r: 8 }} name="Gagal" />
//           </LineChart>
//         </ResponsiveContainer>
//       )}

//       {/* Global CSS variables and rules for Recharts styling in light/dark mode */}
//       <style>{`
//         /* Global CSS Variables for Recharts in Light Mode */
//         :root {
//           --recharts-grid-stroke-light: #e5e7eb; /* gray-200 */
//           --recharts-axis-stroke-light: #6b7280; /* gray-500 */
//           --recharts-tick-fill-light: #6b7280;   /* gray-500 */
//           --recharts-tooltip-bg-light: rgb(255, 255, 255);
//           --recharts-tooltip-border-light: rgb(209, 213, 219); /* gray-300 */
//           --recharts-tooltip-item-color-light: rgb(17, 24, 39); /* gray-900 */
//           --recharts-tooltip-label-color-light: rgb(55, 65, 81); /* gray-700 */
//           --recharts-legend-text-light: #4b5563; /* gray-600 */
//         }

//         /* Dark Mode overrides for Recharts CSS Variables */
//         .dark {
//           --recharts-grid-stroke-light: #4b5563; /* gray-600 */
//           --recharts-axis-stroke-light: #9ca3af; /* gray-400 */
//           --recharts-tick-fill-light: #9ca3af;   /* gray-400 */
//           --recharts-tooltip-bg-light: #374151; /* gray-700 */
//           --recharts-tooltip-border-light: #4b5563; /* gray-600 */
//           --recharts-tooltip-item-color-light: #d1d5db; /* gray-300 */
//           --recharts-tooltip-label-color-light: #e5e7eb; /* gray-200 */
//           --recharts-legend-text-light: #d1d5db; /* gray-300 */
//         }

//         /* Applying the variables to Recharts elements */
//         .recharts-cartesian-grid line {
//             stroke: var(--recharts-grid-stroke-light);
//         }
//         .recharts-xAxis line, .recharts-yAxis line {
//             stroke: var(--recharts-axis-stroke-light);
//         }
//         .recharts-xAxis .recharts-cartesian-axis-tick text,
//         .recharts-yAxis .recharts-cartesian-axis-tick text {
//             fill: var(--recharts-tick-fill-light);
//         }
//         .recharts-legend-wrapper .recharts-legend-item-text {
//             color: var(--recharts-legend-text-light);
//         }
//         /* Specific styling for tooltip wrapper (you can also use global classes like .dark .recharts-tooltip-wrapper) */
//         .recharts-tooltip-wrapper {
//           background-color: var(--recharts-tooltip-bg-light) !important;
//           border-color: var(--recharts-tooltip-border-light) !important;
//           border-radius: 8px !important;
//         }
//         .recharts-tooltip-wrapper .recharts-tooltip-item {
//           color: var(--recharts-tooltip-item-color-light) !important;
//         }
//         .recharts-tooltip-wrapper .recharts-tooltip-label {
//           color: var(--recharts-tooltip-label-color-light) !important;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default AnalyticsEnrollment;