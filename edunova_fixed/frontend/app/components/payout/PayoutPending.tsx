'use client';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { payoutAPI } from '../../lib/payout';
import { formatDate } from '../../utils/formatDate';
import {
  ClockIcon, // Main icon for pending payouts
  ClipboardDocumentCheckIcon, // For summary total requests
  CurrencyDollarIcon, // For summary total amount
  WalletIcon, // For individual payout amount/method
  UserCircleIcon, // For instructor details
  BookOpenIcon, // For course details
  ArrowPathIcon, // For Update Status button
  ChevronLeftIcon, // For pagination
  ChevronRightIcon, // For pagination
} from '@heroicons/react/24/outline'; // Importing relevant icons

export default function PayoutPending() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Variabel actionColors (sudah ada, tidak dihapus/ditambah)
  const actionColors = {
    primaryButton: 'bg-indigo-600 hover:bg-indigo-700',
    secondaryButton: 'bg-gray-700 hover:bg-gray-600',
    dangerButton: 'bg-red-600 hover:bg-red-700',
    infoButton: 'bg-blue-600 hover:bg-blue-700', // Digunakan untuk Update Status
  };

  useEffect(() => {
    payoutAPI.getPendingPayout()
      .then((res) => setData(res.data))
      .catch((err) => console.error('Failed to fetch pending payouts:', err)) // Tetap log error ke konsol
      .finally(() => setLoading(false));
  }, []);

  // Loading, Error, No Data States (diperbarui untuk konsistensi)
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950">
      <div className="text-center p-8 bg-gray-800 rounded-xl shadow-2xl">
        <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-indigo-500 mx-auto mb-6"></div>
        <p className="mt-4 text-xl font-semibold text-gray-300">Loading pending payouts...</p>
      </div>
    </div>
  );
  if (!data || !data.payouts) return ( // Periksa data.payouts juga untuk case kosong
    <div className="min-h-screen flex items-center justify-center bg-gray-950">
      <div className="text-center p-8 bg-gray-800 rounded-xl shadow-2xl">
        <p className="text-gray-400 text-center text-xl">Tidak ada data pembayaran tertunda ditemukan.</p>
        {/* Tidak ada tombol 'Try Again' karena ini bisa berarti tidak ada data */}
      </div>
    </div>
  );

  const { payouts, pagination, summary } = data; // Destructuring data setelah loading selesai dan data ada

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-sans antialiased py-10">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Hero Section: Pending Payouts */}
        <div className="bg-gray-800/70 backdrop-blur-md rounded-xl p-10 mb-12 shadow-2xl border border-gray-700 flex justify-between items-center">
          <div>
            <h1 className="text-5xl font-extrabold text-white mb-3 tracking-tight drop-shadow-xl flex items-center">
              <ClockIcon className="h-12 w-12 text-yellow-400 mr-4" /> Pending <span className="text-orange-400">Payouts</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl">
              Lihat dan kelola permintaan pembayaran yang masih tertunda.
            </p>
          </div>
        </div>

        {/* Summary Section */}
        <section className="mb-12 bg-gray-800/40 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-gray-700">
          <h2 className="text-3xl font-semibold text-white mb-6 flex items-center">
            <ClipboardDocumentCheckIcon className="h-7 w-7 text-teal-400 mr-3" /> Ringkasan Payout Tertunda
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-700/60 p-6 rounded-lg shadow-md border border-gray-600 flex flex-col items-center justify-center text-center">
              <CurrencyDollarIcon className="h-10 w-10 text-green-400 mb-2" />
              <p className="text-gray-300 text-lg font-medium">Total Pending Amount</p>
              <p className="text-white text-3xl font-bold mt-1">${summary?.totalPendingAmount?.toFixed(2) || '0.00'}</p>
            </div>
            <div className="bg-gray-700/60 p-6 rounded-lg shadow-md border border-gray-600 flex flex-col items-center justify-center text-center">
              <ClipboardDocumentCheckIcon className="h-10 w-10 text-blue-400 mb-2" />
              <p className="text-gray-300 text-lg font-medium">Total Pending Requests</p>
              <p className="text-white text-3xl font-bold mt-1">{summary?.totalPendingRequests || 0}</p>
            </div>
          </div>
        </section>

        {/* Payouts List Section */}
        <section className="mb-12 bg-gray-800/40 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-gray-700">
          <h2 className="text-3xl font-semibold text-white mb-6 flex items-center">
            <WalletIcon className="h-7 w-7 text-purple-400 mr-3" /> Daftar Permintaan Payout
          </h2>
          {payouts.length === 0 ? (
            <p className="text-gray-400 text-center py-8 text-lg">- Tidak ada permintaan payout tertunda saat ini -</p>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6"> {/* Menggunakan grid untuk kartu */}
              {payouts.map((p: any) => (
                <div key={p.id} className="bg-gray-800/60 backdrop-blur-sm rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] border border-gray-700 p-6">
                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-700">
                    <h3 className="text-xl font-bold text-white flex items-center">
                      <WalletIcon className="h-6 w-6 text-green-400 mr-2" /> Payout ID: {p.id}
                    </h3>
                    <span className="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-yellow-600 text-yellow-100">
                      {p.status} {/* Status harusnya selalu 'PENDING' di sini */}
                    </span>
                  </div>

                  <div className="space-y-3 text-gray-300 text-base">
                    <p className="flex justify-between">
                      <span className="font-semibold text-gray-200">Amount:</span>
                      <span className="text-green-400 font-bold text-lg">${p.amount?.toFixed(2)}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="font-semibold text-gray-200">Method:</span>
                      <span>{p.method}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="font-semibold text-gray-200">Requested At:</span>
                      <span>{formatDate(new Date(p.requestedAt))}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="font-semibold text-gray-200">Processed At:</span>
                      <span>{p.processedAt ? formatDate(new Date(p.processedAt)) : 'Not yet processed'}</span>
                    </p>

                    <div className="mt-4 pt-4 border-t border-gray-700">
                      <p className="font-semibold text-gray-200 mb-2 flex items-center">
                        <UserCircleIcon className="h-5 w-5 text-blue-400 mr-2" /> Instructor:
                      </p>
                      <ul className="ml-4 space-y-1 text-gray-300">
                        <li><span className="font-medium">ID:</span> {p.instructor.id}</li>
                        <li><span className="font-medium">Name:</span> {p.instructor.name}</li>
                        <li><span className="font-medium">Email:</span> {p.instructor.email}</li>
                      </ul>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-700">
                      <p className="font-semibold text-gray-200 mb-2 flex items-center">
                        <BookOpenIcon className="h-5 w-5 text-pink-400 mr-2" /> Course:
                      </p>
                      <ul className="ml-4 space-y-1 text-gray-300">
                        <li><span className="font-medium">ID:</span> {p.course.id}</li>
                        <li><span className="font-medium">Title:</span> {p.course.title}</li>
                        <li><span className="font-medium">Price:</span> ${p.course.price?.toFixed(2)}</li>
                      </ul>
                    </div>
                  </div>

                  {/* Tombol navigasi (hanya styling tombol yang sudah ada) */}
                  <div className="mt-6 pt-4 border-t border-gray-700 flex justify-end">
                    <button
                      onClick={() => navigate(`/payouts/${p.id}/status`)}
                      className={`${actionColors.infoButton} text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200 flex items-center`}
                    >
                      <ArrowPathIcon className="h-5 w-5 mr-2" /> Update Status
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Pagination Info Section */}
        {pagination && pagination.totalPages > 0 && ( // Tampilkan pagination hanya jika ada totalPages
          <section className="mt-8 bg-gray-800/40 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-gray-700 flex justify-between items-center">
            <p className="text-gray-300 text-lg">
              Page <span className="font-semibold text-white">{pagination.currentPage}</span> of <span className="font-semibold text-white">{pagination.totalPages}</span>
            </p>
            <div className="flex items-center space-x-3">
              <button
                className={`flex items-center px-4 py-2 rounded-lg text-white font-medium transition-colors duration-200 ${actionColors.secondaryButton} ${pagination.currentPage <= 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => navigate(`/payouts/pending?page=${pagination.currentPage - 1}`)} // Asumsi API support parameter 'page'
                disabled={pagination.currentPage <= 1}
              >
                <ChevronLeftIcon className="h-5 w-5 mr-1" /> Previous
              </button>
              <button
                className={`flex items-center px-4 py-2 rounded-lg text-white font-medium transition-colors duration-200 ${actionColors.secondaryButton} ${pagination.currentPage >= pagination.totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => navigate(`/payouts/pending?page=${pagination.currentPage + 1}`)} // Asumsi API support parameter 'page'
                disabled={pagination.currentPage >= pagination.totalPages}
              >
                Next <ChevronRightIcon className="h-5 w-5 ml-1" />
              </button>
            </div>
            <p className="text-gray-300 text-lg">Total Requests: <span className="font-semibold text-white">{pagination.totalItems}</span></p>
          </section>
        )}
      </main>
    </div>
  );
}