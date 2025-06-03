import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../../lib/axios';
// Pastikan formatCurrency ini sudah tersedia dan diimpor dengan benar
import { formatCurrency } from '../../utils/format'; 
import { FaSpinner, FaExclamationCircle, FaHistory, FaFilter, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const PayoutHistory = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate(); // Untuk navigasi saat mengubah filter
  const [loading, setLoading] = useState(true);
  const [payouts, setPayouts] = useState([]);
  const [summary, setSummary] = useState<any>(null);
  const [pagination, setPagination] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // State untuk filter
  const [selectedStatus, setSelectedStatus] = useState(searchParams.get('status') || '');
  const [selectedCourseId, setSelectedCourseId] = useState(searchParams.get('courseId') || '');

  // Fungsi untuk mengambil data
  const fetchPayouts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const queryString = new URLSearchParams();
      if (selectedStatus) queryString.append('status', selectedStatus);
      if (selectedCourseId) queryString.append('courseId', selectedCourseId);
      queryString.append('page', searchParams.get('page') || '1');
      queryString.append('limit', searchParams.get('limit') || '10'); // Default limit

      const res = await axiosInstance.get(
        `/payouts/instructor/my-payouts${queryString.toString() ? '?' + queryString.toString() : ''}`
      );

      setPayouts(res.data.payouts);
      setSummary(res.data.summary);
      setPagination(res.data.pagination);
    } catch (err: any) {
      console.error("Error fetching payout history:", err.response?.data || err.message);
      setError(err.response?.data?.message || 'Gagal memuat riwayat payout.');
    } finally {
      setLoading(false);
    }
  }, [selectedStatus, selectedCourseId, searchParams]); // Tambahkan dependensi filter

  useEffect(() => {
    fetchPayouts();
  }, [fetchPayouts]); // Panggil fetchPayouts saat dependensi berubah

  // Handler untuk perubahan filter
  const handleFilterChange = (type: string, value: string) => {
    const newSearchParams = new URLSearchParams(searchParams);
    if (value) {
      newSearchParams.set(type, value);
    } else {
      newSearchParams.delete(type);
    }
    // Reset page ke 1 saat filter berubah
    newSearchParams.set('page', '1'); 
    setSearchParams(newSearchParams);

    // Update state filter lokal
    if (type === 'status') setSelectedStatus(value);
    if (type === 'courseId') setSelectedCourseId(value);
  };

  // Handler untuk navigasi paginasi
  const handlePageChange = (newPage: number) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('page', String(newPage));
    setSearchParams(newSearchParams);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-center text-gray-700 dark:text-gray-300">
          <FaSpinner className="animate-spin text-5xl text-indigo-600 dark:text-indigo-400 mx-auto mb-4" />
          <p className="text-lg font-medium">Memuat Riwayat Payout...</p>
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

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold mb-2 text-indigo-700 dark:text-indigo-400 leading-tight">
            <FaHistory className="inline-block mr-4 text-5xl align-middle" />
            Riwayat Payout
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Telusuri semua catatan transaksi payout Anda.
          </p>
        </div>

        {/* Summary Section (Mirip PayoutTotal) */}
        {summary && (
          <section className="bg-gradient-to-r from-blue-700 to-indigo-700 dark:from-blue-900 dark:to-indigo-900 text-white p-8 rounded-xl shadow-lg mb-8">
            <h2 className="text-3xl font-bold mb-4 border-b border-blue-400 dark:border-blue-700 pb-3">Ringkasan Saldo Global</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-4 bg-white bg-opacity-20 rounded-lg backdrop-blur-sm">
                <p className="text-sm text-blue-300">Total Pendapatan</p>
                <p className="text-2xl font-extrabold text-black">{formatCurrency(summary.totalEarnings)}</p>
              </div>
              <div className="p-4 bg-white bg-opacity-20 rounded-lg backdrop-blur-sm">
                <p className="text-sm text-blue-300">Payout Selesai</p>
                <p className="text-2xl font-extrabold text-black">{formatCurrency(summary.totalCompletedPayouts)}</p>
              </div>
              <div className="p-4 bg-white bg-opacity-20 rounded-lg backdrop-blur-sm">
                <p className="text-sm text-blue-300">Payout Tertunda</p>
                <p className="text-2xl font-extrabold text-black">{formatCurrency(summary.totalPendingPayouts)}</p>
              </div>
              <div className="p-4 bg-green-100 bg-opacity-30 rounded-lg backdrop-blur-sm">
                <p className="text-lg text-green-300 font-semibold">Saldo Tersedia</p>
                <p className="text-4xl font-extrabold text-green-600">{formatCurrency(summary.availableBalance)}</p>
              </div>
            </div>
            {summary.note && (
              <p className="mt-6 text-sm text-blue-200 italic">{summary.note}</p>
            )}
          </section>
        )}

        {/* Filters Section */}
        <section className="bg-gray-800 p-6 rounded-xl shadow-lg mb-8 flex flex-wrap items-center gap-4">
          <h2 className="text-xl font-bold text-gray-100 flex items-center mr-4">
            <FaFilter className="mr-2" /> Filter Payouts:
          </h2>
          <div className="flex-grow flex flex-wrap items-center gap-4">
            <select
              className="p-3 rounded-lg bg-gray-700 text-gray-200 border border-gray-600 focus:ring-indigo-500 focus:border-indigo-500 text-base"
              value={selectedStatus}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="">Semua Status</option>
              <option value="PENDING">Pending</option>
              <option value="COMPLETED">Selesai</option>
              <option value="REJECTED">Ditolak</option>
              {/* Tambahkan status lain jika ada */}
            </select>
            <input
              type="text"
              placeholder="Cari berdasarkan ID Kursus..."
              className="p-3 rounded-lg bg-gray-700 text-gray-200 border border-gray-600 focus:ring-indigo-500 focus:border-indigo-500 text-base"
              value={selectedCourseId}
              onChange={(e) => handleFilterChange('courseId', e.target.value)}
            />
            {/* Anda bisa menambahkan input tanggal, dll. */}
          </div>
        </section>

        {/* Payout Records Table */}
        <section className="bg-gray-800 p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-gray-100 border-b border-gray-600 pb-3">
            Catatan Payout
          </h2>
          {payouts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm border-separate border-spacing-y-2">
                <thead className="bg-gray-700 text-left text-gray-200 sticky top-0 z-10">
                  <tr>
                    <th className="p-3 font-semibold text-base rounded-l-lg">ID Payout</th>
                    <th className="p-3 font-semibold text-base">Jumlah</th>
                    <th className="p-3 font-semibold text-base">Metode</th>
                    <th className="p-3 font-semibold text-base">Status</th>
                    <th className="p-3 font-semibold text-base">Kursus</th>
                    <th className="p-3 font-semibold text-base">Diminta</th>
                    <th className="p-3 font-semibold text-base">Diproses</th>
                    <th className="p-3 font-semibold text-base rounded-r-lg">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {payouts.map((payout: any) => (
                    <tr
                      key={payout.id}
                      className="bg-gray-700 hover:bg-gray-600 transition duration-200 ease-in-out shadow-sm"
                    >
                      <td className="p-3 text-gray-200 rounded-l-lg">{payout.id}</td>
                      <td className="p-3 font-semibold text-green-400">{formatCurrency(payout.amount)}</td>
                      <td className="p-3 text-gray-300">{payout.method}</td>
                      <td className="p-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          payout.status === 'COMPLETED' ? 'bg-green-200 text-green-800 dark:bg-green-700 dark:text-green-100' :
                          payout.status === 'PENDING' ? 'bg-yellow-200 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100' :
                          payout.status === 'REJECTED' ? 'bg-red-200 text-red-800 dark:bg-red-700 dark:text-red-100' :
                          'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                        }`}>
                          {payout.status}
                        </span>
                      </td>
                      <td className="p-3 text-gray-300">{payout.course?.title || '-'}</td>
                      <td className="p-3 text-gray-300">{new Date(payout.requestedAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                      <td className="p-3 text-gray-300">{payout.processedAt ? new Date(payout.processedAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-'}</td>
                      <td className="p-3 rounded-r-lg">
                        <Link
                          to={`/payouts/${payout.id}`}
                          className="text-indigo-400 hover:text-indigo-300 text-sm font-medium"
                        >
                          Detail
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-400 text-center italic py-4">Tidak ada catatan payout yang ditemukan.</p>
          )}

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex justify-center items-center mt-8 space-x-4">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
                className="p-2 rounded-full bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
              >
                <FaChevronLeft />
              </button>
              <span className="text-lg font-medium text-gray-200">
                Halaman {pagination.currentPage} dari {pagination.totalPages}
              </span>
              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}
                className="p-2 rounded-full bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
              >
                <FaChevronRight />
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default PayoutHistory;