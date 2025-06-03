import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { payoutAPI } from '../../lib/payout';
import { FaSpinner, FaExclamationCircle, FaDollarSign } from 'react-icons/fa'; 
import { formatCurrency } from '../../utils/format'; 

export default function PayoutCourse() {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(''); 

  useEffect(() => {
    if (!id) {
      setError('ID Kursus tidak ditemukan di URL.');
      setLoading(false);
      return;
    }

    payoutAPI
      .getPayoutAvailableBalance(Number(id))
      .then((res) => {
        setData(res.data);
        setError(''); 
      })
      .catch((err) => {
        console.error('Failed to fetch course balance:', err);
        setError('Gagal memuat data payout kursus. Silakan coba lagi.'); 
        setData(null); 
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-center text-gray-700 dark:text-gray-300">
          <FaSpinner className="animate-spin text-5xl text-indigo-600 dark:text-indigo-400 mx-auto mb-4" />
          <p className="text-lg font-medium">Memuat data payout untuk kursus ID: {id}...</p>
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

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-center text-gray-700 dark:text-gray-300">
          <p className="text-lg font-medium">Data payout kursus tidak ditemukan.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6">
      {/* Container utama tanpa card background */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8"> 
        <h1 className="text-4xl font-extrabold mb-4 text-indigo-700 dark:text-indigo-400 text-center leading-tight">
          <FaDollarSign className="inline-block mr-3 text-5xl align-middle" />
          Detail Payout
          <br className="sm:hidden" />
          <span className="block text-2xl font-semibold mt-2 text-gray-800 dark:text-gray-200">
            {data.courseTitle || 'Kursus Tidak Diketahui'}
          </span>
        </h1>
        <p className="text-center text-lg text-gray-600 dark:text-gray-400 mb-8">
          Ringkasan keuangan dan riwayat pembayaran untuk kursus ini.
        </p>

        {/* Informasi Umum Kursus */}
        <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-sm mb-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100 border-b pb-2 border-gray-200 dark:border-gray-600">
            Informasi Kursus & Instruktur
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6 text-lg text-gray-700 dark:text-gray-300">
            <div>
              <p className="font-semibold text-gray-900 dark:text-gray-100">ID Kursus:</p>
              <p className="ml-2">{data.courseId}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-gray-100">ID Instruktur:</p>
              <p className="ml-2">{data.instructorId}</p>
            </div>
            <div className="md:col-span-2">
              <p className="font-semibold text-gray-900 dark:text-gray-100">Jumlah Pendaftar:</p>
              <p className="ml-2">{data.enrollments?.length || 0}</p>
            </div>
          </div>
        </div>

        {/* Ringkasan Keuangan */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-green-50 dark:bg-green-900 p-6 rounded-lg shadow-md flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-bold mb-4 text-green-800 dark:text-green-200 border-b pb-2 border-green-200 dark:border-green-700">
                Ringkasan Payout
              </h2>
              <div className="space-y-3 text-gray-700 dark:text-gray-300">
                <div className="flex justify-between items-center">
                  <p className="font-semibold text-green-800 dark:text-green-200">Total Pendapatan:</p>
                  <p className="font-bold text-xl text-green-700 dark:text-green-400">{formatCurrency(data.totalEarnings)}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="font-semibold text-green-800 dark:text-green-200">Payout Selesai:</p>
                  <p className="font-bold text-xl">{formatCurrency(data.totalCompletedPayouts)}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="font-semibold text-green-800 dark:text-green-200">Payout Tertunda:</p>
                  <p className="font-bold text-xl">{formatCurrency(data.totalPendingPayouts)}</p>
                </div>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-green-200 dark:border-green-700">
              <p className="font-bold text-xl text-green-800 dark:text-green-200">Jumlah Tersedia:</p>
              <p className="text-4xl font-extrabold text-green-700 dark:text-green-400 mt-2">
                {formatCurrency(data.availableAmount)}
              </p>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100 border-b pb-2 border-gray-200 dark:border-gray-600">
              Catatan Penting
            </h2>
            <p className="text-gray-700 dark:text-gray-300 italic leading-relaxed text-justify">
              {data.note || 'Tidak ada catatan khusus yang tersedia untuk payout kursus ini.'}
            </p>
          </div>
        </div>

        {/* Daftar Pembayaran (Payments) */}
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
          Riwayat Pembayaran
        </h2>
        <div className="space-y-4">
          {data.payments && data.payments.length > 0 ? (
            data.payments.map((payment: any) => (
              <div key={payment.id} className="bg-gray-100 dark:bg-gray-700 p-5 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-3">
                  <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 sm:mb-0">
                    Pembayaran ID: <span className="font-normal text-base">{payment.id}</span>
                  </p>
                  <span className={`px-4 py-1 rounded-full text-sm font-medium ${
                    payment.status === 'COMPLETED' ? 'bg-green-200 text-green-800 dark:bg-green-700 dark:text-green-100' :
                    payment.status === 'PENDING' ? 'bg-yellow-200 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100' :
                    'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                  }`}>
                    {payment.status}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 text-gray-700 dark:text-gray-200 text-base">
                  <div>
                    <p className="font-semibold">Total Jumlah:</p>
                    <p className="ml-2 font-bold">{formatCurrency(payment.totalAmount)}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Bagian Instruktur:</p>
                    <p className="ml-2 font-bold text-indigo-600 dark:text-indigo-400">{formatCurrency(payment.instructorShare)}</p>
                  </div>
                  <div>
                    <p className="font-semibold">ID Pendaftaran:</p>
                    <p className="ml-2">{payment.enrollmentId}</p>
                  </div>
                  {payment.transactionDate && (
                    <div>
                      <p className="font-semibold">Tanggal Transaksi:</p>
                      <p className="ml-2">{new Date(payment.transactionDate).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 dark:text-gray-400 italic text-center">Belum ada pembayaran yang tercatat untuk kursus ini.</p>
          )}
        </div>

        {/* Debug Info (Opsional, bisa dihapus di produksi) */}
        {/* {data.debug && (
          <div className="mt-8 bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600">
            <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100 border-b pb-2 border-gray-200 dark:border-gray-600">
              Informasi Debug <span className="text-sm font-normal">(Pengembang)</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4 text-sm text-gray-600 dark:text-gray-400">
              <div>
                <p className="font-semibold">Jumlah Pendaftaran:</p>
                <p className="ml-2">{data.debug?.enrollmentCount ?? 'N/A'}</p>
              </div>
              <div>
                <p className="font-semibold">Jumlah Pembayaran:</p>
                <p className="ml-2">{data.debug?.paymentCount ?? 'N/A'}</p>
              </div>
              <div className="md:col-span-2">
                <p className="font-semibold">Pembayaran Selesai:</p>
                <p className="ml-2">{data.debug?.completedPayments ?? 'N/A'}</p>
              </div>
            </div>
          </div>
        )} */}
      </div>
    </div>
  );
}