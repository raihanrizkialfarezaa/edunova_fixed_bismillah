import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { payoutAPI } from '../../lib/payout';
import { useAuth } from '../../contexts/AuthContext';
import { FaSpinner, FaExclamationCircle, FaChartPie, FaMoneyBillWave, FaBookOpen, FaHistory, FaTools } from 'react-icons/fa';
// Pastikan formatCurrency ini sudah tersedia dan diimpor dengan benar
import { formatCurrency } from '../../utils/format'; 

export default function PayoutTotal() {
  const { user } = useAuth(); // Meskipun user tidak digunakan langsung di sini, biarkan saja
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    payoutAPI.getPayoutTotal()
      .then((res) => setData(res.data))
      .catch((err) => {
        console.error('Failed to load payout data:', err);
        setError('Gagal memuat data ringkasan payout. Silakan coba lagi.');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-center text-gray-700 dark:text-gray-300">
          <FaSpinner className="animate-spin text-5xl text-indigo-600 dark:text-indigo-400 mx-auto mb-4" />
          <p className="text-lg font-medium">Memuat Ringkasan Payout...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-center text-red-600 dark:text-red-400">
          <FaExclamationCircle className="text-5xl mx-auto mb-4" />
          <p className="text-lg font-medium">{error}</p>
        </div>
      </div>
    );
  }

  // Destructure data setelah memastikan tidak null
  // const { balance, courses, recentPayments, recentPayouts, summary } = data;
  const {
    balance = {},
    courses = [],
    recentPayments = [],
    recentPayouts = [],
    summary = {}
  } = data || {};


  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold mb-2 text-indigo-700 dark:text-indigo-400 leading-tight">
            <FaChartPie className="inline-block mr-4 text-5xl align-middle" />
            Ringkasan Payout Instruktur
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Ikhtisar menyeluruh tentang pendapatan, kursus, dan riwayat payout Anda.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          <Link
            to={`/payout/request`}
            className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
          >
            <FaMoneyBillWave className="mr-2" /> Ajukan Payout
          </Link>
          <Link
            to={`/payouts/instructor/my-payouts`}
            className="flex items-center bg-gray-700 hover:bg-gray-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
          >
            <FaHistory className="mr-2" /> Riwayat Payout
          </Link>
          {/* Opsi untuk Payout Debug, mungkin hanya untuk peran tertentu */}
          {user?.role === 'ADMIN' && ( // Contoh: hanya tampilkan untuk admin
            <Link
              to={`/payouts/debug/instructor-info`}
              className="flex items-center bg-red-700 hover:bg-red-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
            >
              <FaTools className="mr-2" /> Debug Payout
            </Link>
          )}
        </div>

        {/* Balance Section */}
        <section className="bg-gradient-to-r from-blue-700 to-indigo-700 dark:from-blue-900 dark:to-indigo-900 text-white p-8 rounded-xl shadow-lg mb-8">
          <h2 className="text-3xl font-bold mb-4 border-b border-blue-400 dark:border-blue-700 pb-3">Ringkasan Saldo Anda</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Kotak 1: Total Pendapatan */}
            {/* Mengubah bg-opacity-10 menjadi bg-opacity-20 dan pastikan teksnya kontras */}
            <div className="p-4 bg-white bg-opacity-20 rounded-lg backdrop-blur-sm"> 
              <p className="text-sm text-blue-300">Total Pendapatan</p> {/* Sedikit lebih cerah */}
              <p className="text-2xl font-extrabold text-black">{formatCurrency(balance.totalEarnings)}</p> {/* Tetap text-white, tapi opacity latar belakangnya naik */}
            </div>
            {/* Kotak 2: Payout Selesai */}
            {/* Mengubah bg-opacity-10 menjadi bg-opacity-20 */}
            <div className="p-4 bg-white bg-opacity-20 rounded-lg backdrop-blur-sm">
              <p className="text-sm text-blue-300">Payout Selesai</p>
              <p className="text-2xl font-extrabold text-black">{formatCurrency(balance.totalCompletedPayouts)}</p>
            </div>
            {/* Kotak 3: Payout Tertunda */}
            {/* Mengubah bg-opacity-10 menjadi bg-opacity-20 */}
            <div className="p-4 bg-white bg-opacity-20 rounded-lg backdrop-blur-sm">
              <p className="text-sm text-blue-600">Payout Tertunda</p>
              <p className="text-2xl font-extrabold text-black">{formatCurrency(balance.totalPendingPayouts)}</p>
            </div>
            {/* Kotak 4: Saldo Tersedia */}
            {/* Mengubah bg-opacity-20 menjadi bg-opacity-30 atau bisa juga diubah menjadi warna solid jika masih bermasalah */}
            <div className="p-4 bg-green-100 bg-opacity-30 rounded-lg backdrop-blur-sm"> 
              <p className="text-lg text-green-300 font-semibold">Saldo Tersedia</p> {/* Sedikit lebih cerah */}
              <p className="text-4xl font-extrabold text-green-800">{formatCurrency(balance.availableBalance)}</p>
            </div>
          </div>
          {balance.note && (
            <p className="mt-6 text-sm text-blue-200 italic">{balance.note}</p>
          )}
        </section>

        {/* Courses Section */}
        <section className="bg-gray-800 p-8 rounded-xl shadow-lg mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-100 border-b border-gray-600 pb-3">
            <FaBookOpen className="inline-block mr-3 text-3xl align-middle" />
            Kursus Anda ({summary.totalCourses})
          </h2>
          {courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {courses.map((course: any) => (
                <Link to={`/payout/course/${course.courseId}`} key={course.courseId} className="block group">
                  <div className="bg-gray-700 hover:bg-gray-600 transition duration-300 ease-in-out p-6 rounded-lg shadow-md border border-gray-600 group-hover:border-indigo-500">
                    <h3 className="text-xl font-bold mb-2 text-indigo-400 group-hover:text-indigo-300">{course.courseTitle}</h3>
                    <div className="grid grid-cols-2 gap-y-2 text-gray-300 text-sm">
                      <p>Status: <span className="font-semibold">{course.courseStatus}</span></p>
                      <p>Harga: <span className="font-semibold">{formatCurrency(course.coursePrice)}</span></p>
                      <p>Pendaftar: <span className="font-semibold">{course.enrollmentCount}</span></p>
                      <p>Pendapatan: <span className="font-semibold">{formatCurrency(course.totalEarnings)}</span></p>
                      <p className="col-span-2">Saldo Tersedia: <span className="font-semibold text-green-400">{formatCurrency(course.availableBalance)}</span></p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center italic">Anda belum memiliki kursus yang terdaftar.</p>
          )}
        </section>

        {/* Recent Payments Section */}
        <section className="bg-gray-800 p-8 rounded-xl shadow-lg mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-100 border-b border-gray-600 pb-3">
            Pembayaran Terbaru
          </h2>
          {recentPayments.length > 0 ? (
            <div className="space-y-4">
              {recentPayments.map((pay: any) => (
                <div key={pay.id} className="bg-gray-700 p-5 rounded-lg shadow-sm border border-gray-600">
                  <p className="text-lg font-semibold text-gray-200">{pay.courseName}</p>
                  <p className="text-sm text-gray-400 mb-2">dari {pay.studentName} ({pay.studentEmail})</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 text-gray-300 text-base">
                    <div>
                      <p className="font-semibold">Jumlah Pembayaran:</p>
                      <p className="ml-2 font-bold text-green-400">{formatCurrency(pay.amount)}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Total Transaksi:</p>
                      <p className="ml-2">{formatCurrency(pay.totalAmount)}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Bagian Platform:</p>
                      <p className="ml-2">{formatCurrency(pay.platformShare)}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Tanggal:</p>
                      <p className="ml-2">{new Date(pay.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center italic">Tidak ada pembayaran terbaru.</p>
          )}
        </section>

        {/* Recent Payouts Section */}
        <section className="bg-gray-800 p-8 rounded-xl shadow-lg mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-100 border-b border-gray-600 pb-3">
            Payout Terbaru
          </h2>
          {recentPayouts.length > 0 ? (
            <div className="space-y-4">
              {recentPayouts.map((po: any) => (
                <div key={po.id} className="bg-gray-700 p-5 rounded-lg shadow-sm border border-gray-600">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-2">
                    <p className="text-lg font-semibold text-gray-200">Jumlah: <span className="font-bold text-orange-400">{formatCurrency(po.amount)}</span></p>
                    <span className={`px-4 py-1 rounded-full text-sm font-medium ${
                      po.status === 'COMPLETED' ? 'bg-green-200 text-green-800 dark:bg-green-700 dark:text-green-100' :
                      po.status === 'PENDING' ? 'bg-yellow-200 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100' :
                      po.status === 'REJECTED' ? 'bg-red-200 text-red-800 dark:bg-red-700 dark:text-red-100' :
                      'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                    }`}>
                      {po.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 text-gray-300 text-base">
                    <div>
                      <p className="font-semibold">Metode:</p>
                      <p className="ml-2">{po.method}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Untuk Kursus:</p>
                      <p className="ml-2">{po.courseName || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Diminta pada:</p>
                      <p className="ml-2">{new Date(po.requestedAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Diproses pada:</p>
                      <p className="ml-2">{po.processedAt ? new Date(po.processedAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Belum diproses'}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center italic">Tidak ada payout terbaru.</p>
          )}
        </section>

        {/* Summary Statistics Section */}
        <section className="bg-gray-800 p-8 rounded-xl shadow-lg mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-100 border-b border-gray-600 pb-3">
            Statistik Umum
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-gray-300 text-lg">
            <div className="bg-gray-700 p-4 rounded-lg">
              <p className="font-semibold">Total Kursus:</p>
              <p className="text-2xl font-bold">{summary.totalCourses}</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <p className="font-semibold">Kursus Dipublikasi:</p>
              <p className="text-2xl font-bold">{summary.publishedCourses}</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <p className="font-semibold">Total Pendaftar:</p>
              <p className="text-2xl font-bold">{summary.totalEnrollments}</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <p className="font-semibold">Total Pembayaran Selesai:</p>
              <p className="text-2xl font-bold">{summary.totalCompletedPayments}</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <p className="font-semibold">Rata-rata Pendapatan per Kursus:</p>
              <p className="text-2xl font-bold">{formatCurrency(summary.averageEarningsPerCourse)}</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <p className="font-semibold">Rata-rata Pendapatan per Pendaftar:</p>
              <p className="text-2xl font-bold">{formatCurrency(summary.averageEarningsPerEnrollment)}</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}