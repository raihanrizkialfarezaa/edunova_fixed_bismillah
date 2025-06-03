import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { formatDate } from '../../utils/formatDate'; // Assuming this utility exists
import { payoutAPI } from '../../lib/payout'; // Assuming this API client exists

const PayoutDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [payout, setPayout] = useState<any>(null);

  useEffect(() => {
    const fetchPayoutDetail = async () => {
      try {
        const res = await payoutAPI.getPayoutDetails(Number(id));
        setPayout(res.data.payout);
      } catch (err: any) {
        setError(err.message || 'Failed to load payout detail.');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchPayoutDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-950 text-gray-300">
        <p className="text-lg">Memuat detail payout...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-950 text-red-500">
        <p className="text-lg">Error: {error}</p>
      </div>
    );
  }

  // Fallback for when payout data is null after loading (e.g., ID not found)
  if (!payout) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-950 text-gray-400">
        <p className="text-lg">Tidak ada detail payout ditemukan untuk ID: {id}</p>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 bg-gray-950 text-gray-100 min-h-screen font-sans">
      {/* Page Header */}
      <div className="mb-10 border-b border-gray-800 pb-6">
        <h1 className="text-4xl font-extrabold text-blue-400 mb-2">Detail Transaksi Payout</h1>
        <p className="text-gray-400 text-lg">Informasi lengkap terkait riwayat pembayaran ini.</p>
      </div>

      {/* Unified Payout Detail Card */}
      <div className="bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700 hover:border-blue-500 transition-all duration-300 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-8 text-blue-300 text-center">Rincian Payout #{payout.id}</h2>

        {/* General Information Section */}
        <div className="mb-8 pb-6 border-b border-gray-700">
          <h3 className="text-xl font-semibold mb-5 text-gray-200">Informasi Umum</h3>
          {/* Using flex for label-value alignment */}
          <div className="space-y-4 text-base leading-relaxed">
            <p className="flex justify-between items-center">
              <span className="font-semibold text-gray-50 flex-grow">ID Payout:</span>
              <span className="text-gray-300 text-right">{payout.id}</span>
            </p>
            <p className="flex justify-between items-center">
              <span className="font-semibold text-gray-50 flex-grow">Jumlah:</span>
              <span className="text-green-400 font-bold text-lg text-right">${payout.amount.toFixed(2)}</span>
            </p>
            <p className="flex justify-between items-center">
              <span className="font-semibold text-gray-50 flex-grow">Metode:</span>
              <span className="text-purple-300 text-right">{payout.method}</span>
            </p>
            <p className="flex justify-between items-center">
              <span className="font-semibold text-gray-50 flex-grow">Status:</span>
              <span className={`px-3 py-1 rounded-full text-sm font-bold tracking-wide text-right
                ${payout.status === 'completed' ? 'bg-green-700 text-green-100' :
                  payout.status === 'pending' ? 'bg-yellow-700 text-yellow-100' :
                  payout.status === 'failed' ? 'bg-red-700 text-red-100' :
                  'bg-gray-600 text-gray-100'}`}>
                {payout.status.toUpperCase()}
              </span>
            </p>
            <p className="flex justify-between items-center">
              <span className="font-semibold text-gray-50 flex-grow">Diminta Pada:</span>
              <span className="text-gray-300 text-right">{formatDate(payout.requestedAt)}</span>
            </p>
            <p className="flex justify-between items-center">
              <span className="font-semibold text-gray-50 flex-grow">Diproses Pada:</span>
              <span className="text-gray-300 text-right">{payout.processedAt ? formatDate(payout.processedAt) : '-'}</span>
            </p>
          </div>
        </div>

        {/* Instructor Information Section */}
        <div className="mb-8 pb-6 border-b border-gray-700">
          <h3 className="text-xl font-semibold mb-5 text-gray-200">Informasi Instruktur</h3>
          <div className="space-y-4 text-base leading-relaxed">
            <p className="flex justify-between items-center">
              <span className="font-semibold text-gray-50 flex-grow">ID:</span>
              <span className="text-gray-300 text-right">{payout.instructor.id}</span>
            </p>
            <p className="flex justify-between items-center">
              <span className="font-semibold text-gray-50 flex-grow">Nama:</span>
              <span className="text-gray-300 text-right">{payout.instructor.name}</span>
            </p>
            <p className="flex justify-between items-center">
              <span className="font-semibold text-gray-50 flex-grow">Email:</span>
              <span className="text-gray-300 text-right">{payout.instructor.email}</span>
            </p>
          </div>
        </div>

        {/* Course Information Section */}
        <div> {/* No border-b for the last section */}
          <h3 className="text-xl font-semibold mb-5 text-gray-200">Informasi Kursus</h3>
          <div className="space-y-4 text-base leading-relaxed">
            <p className="flex justify-between items-center">
              <span className="font-semibold text-gray-50 flex-grow">ID:</span>
              <span className="text-gray-300 text-right">{payout.course.id}</span>
            </p>
            <p className="flex justify-between items-center">
              <span className="font-semibold text-gray-50 flex-grow">Judul:</span>
              <span className="text-gray-300 text-right">{payout.course.title}</span>
            </p>
            <p className="flex justify-between items-center">
              <span className="font-semibold text-gray-50 flex-grow">Harga:</span>
              <span className="text-yellow-300 font-bold text-lg text-right">${payout.course.price.toFixed(2)}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayoutDetail;