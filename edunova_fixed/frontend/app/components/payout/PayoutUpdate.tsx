import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { payoutAPI } from '../../lib/payout';
import { formatDate } from '../../utils/formatDate';
import {
  CurrencyDollarIcon, // Main icon for payout update
  ChevronRightIcon, // For back button
  ArrowPathIcon, // For update button
  XCircleIcon, // For rejection reason icon
  CheckCircleIcon, // For success result
  ExclamationTriangleIcon, // For error message
} from '@heroicons/react/24/outline'; // Importing relevant icons

export default function PayoutUpdate() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const statusOptions = ['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED'];

  // Define a consistent color palette for actions
  const actionColors = {
    primaryButton: 'bg-indigo-600 hover:bg-indigo-700',
    secondaryButton: 'bg-gray-700 hover:bg-gray-600',
    successButton: 'bg-green-600 hover:bg-green-700',
    dangerButton: 'bg-red-600 hover:bg-red-700',
    infoButton: 'bg-blue-600 hover:bg-blue-700',
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) {
      setError('Payout ID not found.');
      return;
    }

    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const payload: any = { status };
      if (status === 'FAILED') {
        if (!rejectionReason.trim()) {
            setError('Rejection reason is required when status is FAILED.');
            setLoading(false);
            return;
        }
        payload.rejectionReason = rejectionReason;
      }
      // Memastikan pemanggilan API sesuai dengan ekspektasi backend
      // updatePendingPayout(id: number, status: string, rejectionReason?: string)
      const res = await payoutAPI.updatePendingPayout(
        Number(id),
        payload.status,
        payload.rejectionReason
      );
      setResult(res.data);
      // Tambahkan SweetAlert2 atau toast notification di sini jika ingin
      setTimeout(() => navigate('/payouts/pending'), 2000); // Redirect setelah 2 detik
    } catch (err: any) {
      console.error('Update payout failed:', err); // Log error for debugging
      setError(err?.response?.data?.message || 'Failed to update payout status. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-sans antialiased py-10">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Hero Section for Payout Update */}
        <div className="bg-gray-800/70 backdrop-blur-md rounded-xl p-10 mb-12 shadow-2xl border border-gray-700 text-center relative">
          <button
            onClick={() => navigate(-1)} // Kembali ke halaman sebelumnya
            className="absolute top-6 left-6 text-gray-400 hover:text-gray-200 transition-colors duration-200 flex items-center text-lg"
          >
            <ChevronRightIcon className="h-6 w-6 transform rotate-180 mr-2" /> Back
          </button>
          <div className="flex flex-col items-center justify-center">
            <CurrencyDollarIcon className="h-20 w-20 text-teal-400 mb-4 drop-shadow-lg" />
            <h1 className="text-5xl font-extrabold text-white mb-3 tracking-tight drop-shadow-xl">
              Update <span className="text-yellow-400">Payout Status</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mt-2">
              Mengelola status pembayaran tertunda untuk Payout ID: <span className="font-bold text-indigo-300">{id}</span>
            </p>
          </div>
        </div>

        {/* Form Section */}
        <section className="bg-gray-800/40 backdrop-blur-sm rounded-xl p-8 shadow-xl border border-gray-700">
          <h2 className="text-3xl font-semibold text-white mb-8 text-center">Formulir Pembaruan Status</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="status-select" className="block mb-2 text-lg font-medium text-gray-200">Pilih Status Pembayaran</label>
              <div className="relative">
                <select
                  id="status-select"
                  className="w-full px-5 py-3 rounded-lg bg-gray-700 border border-gray-600 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none pr-10 transition-colors duration-200"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  required
                >
                  <option value="" disabled className="text-gray-400">-- Pilih Status --</option>
                  {statusOptions.map((opt) => (
                    <option key={opt} value={opt} className="bg-gray-800 text-gray-200">{opt}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                  <svg className="fill-current h-6 w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>
            </div>

            {status === 'FAILED' && (
              <div>
                <label htmlFor="rejection-reason" className="block mb-2 text-lg font-medium text-gray-200 flex items-center">
                  <XCircleIcon className="h-5 w-5 mr-2 text-red-400" /> Alasan Penolakan
                </label>
                <textarea
                  id="rejection-reason"
                  className="w-full p-4 rounded-lg bg-gray-700 border border-gray-600 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 min-h-[100px] resize-y transition-colors duration-200"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Jelaskan alasan penolakan pembayaran..."
                  required
                />
              </div>
            )}

            <button
              type="submit"
              className={`w-full px-6 py-3 rounded-lg text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center
                ${loading ? 'bg-gray-600 cursor-not-allowed' : actionColors.primaryButton}
              `}
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Updating...
                </>
              ) : (
                <>
                  <ArrowPathIcon className="h-6 w-6 mr-3" /> Update Status
                </>
              )}
            </button>
          </form>

          {error && (
            <div className="mt-8 p-4 rounded-lg bg-red-800/60 border border-red-700 text-red-200 flex items-center shadow-md">
              <ExclamationTriangleIcon className="h-6 w-6 mr-3 flex-shrink-0" />
              <p className="font-medium">{error}</p>
            </div>
          )}

          {result && (
            <div className="mt-8 p-6 rounded-lg bg-green-800/60 border border-green-700 text-green-100 shadow-md">
              <div className="flex items-center mb-4">
                <CheckCircleIcon className="h-8 w-8 text-green-300 mr-3" />
                <h2 className="text-2xl font-semibold">Update Berhasil!</h2>
              </div>
              <ul className="space-y-2 text-lg">
                <li><strong>Message:</strong> {result.message}</li>
                <li><strong>Status Payout Baru:</strong> <span className="font-bold text-white">{result.payout.status}</span></li>
                <li><strong>Diproses Pada:</strong> {result.payout.processedAt ? formatDate(new Date(result.payout.processedAt)) : 'N/A'}</li>
                <li><strong>Saldo Tersedia Baru:</strong> <span className="font-bold text-white">${result.newAvailableBalance?.toFixed(2)}</span></li>
                <li><strong>Catatan:</strong> {result.note || 'Tidak ada catatan tambahan.'}</li>
              </ul>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}