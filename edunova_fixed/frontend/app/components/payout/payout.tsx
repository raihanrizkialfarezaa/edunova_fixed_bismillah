import { useState } from 'react';
import { payoutAPI } from '../../lib/payout';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router';

export default function RequestPayout() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    courseId: '',
    amount: '',
    method: 'BANK_TRANSFER',
    description: ''
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const payload = {
        courseId: Number(formData.courseId),
        amount: parseFloat(formData.amount),
        method: formData.method as 'BANK_TRANSFER' | 'PAYPAL',
        description: formData.description
      };

      const res = await payoutAPI.requestPayout(payload);
      setMessage(res.data.message);

      // Add a slight delay before navigating to allow message to be seen
      setTimeout(() => {
        navigate('/payout');
      }, 1500); // Navigate after 1.5 seconds
    } catch (err: any) {
      console.error('Payout request failed:', err);
      setError(err.response?.data?.message || 'Failed to request payout');
    } finally {
      setLoading(false);
    }
  };

  if (user?.role !== 'INSTRUCTOR' && user?.role !== 'ADMIN') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-950 text-red-400 font-sans p-8">
        <div className="bg-gray-800 p-10 rounded-xl shadow-2xl border border-red-700 text-center max-w-sm">
          <p className="text-2xl font-bold mb-4">Akses Ditolak!</p>
          <p className="text-lg">Anda tidak memiliki izin untuk mengakses halaman ini. Hanya instruktur atau admin yang diizinkan.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 bg-gray-950 text-gray-100 min-h-screen font-sans">
      {/* Page Header - Tampilan yang lebih menonjol dan modern */}
      <div className="max-w-4xl mx-auto mb-16 mt-4 p-10 rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 shadow-2xl border border-blue-700 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold text-blue-300 leading-tight mb-4 tracking-tight">Ajukan Permintaan Payout</h1>
        <p className="text-gray-300 text-lg md:text-xl font-light max-w-2xl mx-auto">
          Lengkapi formulir di bawah ini dengan detail yang akurat untuk mengajukan permintaan payout Anda.
        </p>
      </div>

      {/* Main Form Card - Lebih elegan */}
      <div className="max-w-2xl mx-auto bg-gray-800 p-10 rounded-xl shadow-lg border border-gray-700">
        <h2 className="text-3xl font-bold mb-8 text-blue-300 text-center">Detail Payout</h2>

        {/* Grid for two-column layout on medium screens and above */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <label className="block">
            <span className="text-gray-200 text-sm font-semibold mb-2 block">ID Kursus</span>
            <input
              type="number"
              name="courseId"
              value={formData.courseId}
              onChange={handleChange}
              className="w-full px-5 py-3 rounded-lg bg-gray-700 border border-gray-600 text-gray-100 placeholder-gray-400
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 shadow-inner"
              placeholder="Contoh: 12345"
            />
          </label>

          <label className="block">
            <span className="text-gray-200 text-sm font-semibold mb-2 block">Jumlah Payout ($)</span>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="w-full px-5 py-3 rounded-lg bg-gray-700 border border-gray-600 text-gray-100 placeholder-gray-400
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 shadow-inner"
              placeholder="Contoh: 50.00"
              step="0.01" // Allows decimal input for amount
            />
          </label>
        </div>

        {/* Full-width labels for Method and Description */}
        <label className="block mb-8">
          <span className="text-gray-200 text-sm font-semibold mb-2 block">Metode Pembayaran</span>
          <select
            name="method"
            value={formData.method}
            onChange={handleChange}
            className="w-full px-5 py-3 rounded-lg bg-gray-700 border border-gray-600 text-gray-100
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 cursor-pointer shadow-inner"
          >
            <option value="BANK_TRANSFER">Transfer Bank</option>
            <option value="PAYPAL">PayPal</option>
          </select>
        </label>

        <label className="block mb-8">
          <span className="text-gray-200 text-sm font-semibold mb-2 block">Deskripsi (Opsional)</span>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={5} // Increased rows for more space
            className="w-full px-5 py-3 rounded-lg bg-gray-700 border border-gray-600 text-gray-100 placeholder-gray-400
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 resize-y shadow-inner"
            placeholder="Tambahkan catatan atau detail tambahan, misal: Payout hasil penjualan kursus 'React.js Fundamental'"
          />
        </label>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-xl text-xl
                     disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 ease-in-out transform hover:scale-105
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 shadow-lg"
        >
          {loading ? 'Memproses Permintaan...' : 'Ajukan Permintaan Payout'}
        </button>

        {message && <p className="mt-6 text-green-400 text-center font-bold text-lg p-3 bg-green-900 bg-opacity-30 rounded-lg">{message}</p>}
        {error && <p className="mt-6 text-red-500 text-center font-bold text-lg p-3 bg-red-900 bg-opacity-30 rounded-lg">{error}</p>}
      </div>
    </div>
  );
}