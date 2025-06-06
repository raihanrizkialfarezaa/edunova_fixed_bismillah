import { useState, useEffect } from 'react';
import { payoutAPI } from '../../lib/payout';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router';

interface Course {
  id: number;
  title: string;
  price: number;
  status: string;
  availableBalance?: number;
  courseId?: number;
  courseTitle?: string;
  courseStatus?: string;
}

export default function RequestPayout() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    courseId: '',
    amount: '',
    method: 'BANK_TRANSFER',
    description: '',
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [selectedCourseBalance, setSelectedCourseBalance] = useState<number | null>(null);

  // Fetch instructor's courses on component mount
  useEffect(() => {
    const fetchInstructorCourses = async () => {
      try {
        setLoadingCourses(true);
        const response = await payoutAPI.getPayoutTotal();

        console.log('API Response:', response.data); // Debug log

        // Extract courses from the response
        if (response.data && response.data.courses) {
          // Filter only published courses that have earnings
          const availableCourses = response.data.courses
            .filter((course: any) => {
              // Handle different possible property names
              const status = course.courseStatus || course.status;
              const balance = course.availableBalance;
              const isPublished = status === 'PUBLISHED';
              const hasBalance = balance > 0;

              console.log('Course filter check:', {
                courseId: course.courseId || course.id,
                title: course.courseTitle || course.title,
                status,
                balance,
                isPublished,
                hasBalance,
              });

              return isPublished && hasBalance;
            })
            .map((course: any) => ({
              id: course.courseId || course.id,
              title: course.courseTitle || course.title,
              price: course.coursePrice || course.price,
              status: course.courseStatus || course.status,
              availableBalance: course.availableBalance,
            }));

          console.log('Available courses:', availableCourses);
          setCourses(availableCourses);
        }
      } catch (err: any) {
        console.error('Failed to fetch instructor courses:', err);
        setError('Gagal memuat daftar kursus. Silakan refresh halaman.');
      } finally {
        setLoadingCourses(false);
      }
    };

    // Add delay to prevent flash of "access denied" message
    const timer = setTimeout(() => {
      if (user?.role === 'INSTRUCTOR' || user?.role === 'ADMIN') {
        fetchInstructorCourses();
      } else if (user) {
        // User is loaded but not instructor/admin
        setLoadingCourses(false);
      }
    }, 100); // Small delay to ensure user is properly loaded

    return () => clearTimeout(timer);
  }, [user]);

  // Handle course selection and fetch available balance
  const handleCourseSelection = async (courseId: string) => {
    setFormData({ ...formData, courseId, amount: '' }); // Reset amount when course changes
    setSelectedCourseBalance(null);

    if (courseId) {
      try {
        const response = await payoutAPI.getPayoutAvailableBalance(Number(courseId));
        setSelectedCourseBalance(response.data.availableAmount);
      } catch (err: any) {
        console.error('Failed to fetch course balance:', err);
        setError('Gagal memuat saldo kursus yang dipilih.');
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name === 'courseId') {
      handleCourseSelection(value);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.courseId) {
      setError('Silakan pilih kursus terlebih dahulu.');
      return;
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setError('Silakan masukkan jumlah payout yang valid.');
      return;
    }

    if (selectedCourseBalance !== null && parseFloat(formData.amount) > selectedCourseBalance) {
      setError(`Jumlah payout melebihi saldo tersedia. Maksimal: $${selectedCourseBalance.toFixed(2)}`);
      return;
    }

    setLoading(true);
    setMessage('');
    setError('');

    try {
      const payload = {
        courseId: Number(formData.courseId),
        amount: parseFloat(formData.amount),
        method: formData.method as 'BANK_TRANSFER' | 'PAYPAL',
        description: formData.description,
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

  // Show loading while checking user authentication
  if (!user || loadingCourses) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-950 text-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto mb-4"></div>
          <p className="text-lg">Memuat...</p>
        </div>
      </div>
    );
  }

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
        <p className="text-gray-300 text-lg md:text-xl font-light max-w-2xl mx-auto">Lengkapi formulir di bawah ini dengan detail yang akurat untuk mengajukan permintaan payout Anda.</p>
      </div>

      {/* Main Form Card - Lebih elegan */}
      <div className="max-w-2xl mx-auto bg-gray-800 p-10 rounded-xl shadow-lg border border-gray-700">
        <h2 className="text-3xl font-bold mb-8 text-blue-300 text-center">Detail Payout</h2>

        {/* Course Selection */}
        <div className="mb-8">
          <label className="block">
            <span className="text-gray-200 text-sm font-semibold mb-2 block">Pilih Kursus</span>
            {loadingCourses ? (
              <div className="w-full px-5 py-3 rounded-lg bg-gray-700 border border-gray-600 text-gray-400">Memuat daftar kursus...</div>
            ) : courses.length === 0 ? (
              <div className="w-full px-5 py-3 rounded-lg bg-gray-700 border border-gray-600 text-gray-400">Tidak ada kursus yang tersedia untuk payout. Pastikan Anda memiliki kursus yang dipublikasi dengan saldo tersedia.</div>
            ) : (
              <select
                name="courseId"
                value={formData.courseId}
                onChange={handleChange}
                className="w-full px-5 py-3 rounded-lg bg-gray-700 border border-gray-600 text-gray-100
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 cursor-pointer shadow-inner"
              >
                <option value="">Pilih kursus yang akan diajukan payout</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.title} - Saldo Tersedia: ${course.availableBalance?.toFixed(2) || '0.00'}
                  </option>
                ))}
              </select>
            )}
          </label>

          {/* Show selected course balance */}
          {selectedCourseBalance !== null && (
            <div className="mt-3 p-3 bg-green-900 bg-opacity-30 rounded-lg border border-green-700">
              <p className="text-green-400 font-semibold">Saldo Tersedia: ${selectedCourseBalance.toFixed(2)}</p>
              <p className="text-gray-300 text-sm mt-1">Anda dapat mengajukan payout maksimal sebesar jumlah saldo tersedia.</p>
            </div>
          )}
        </div>

        {/* Amount Input */}
        <div className="mb-8">
          <label className="block">
            <span className="text-gray-200 text-sm font-semibold mb-2 block">Jumlah Payout ($)</span>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              disabled={!formData.courseId || selectedCourseBalance === null}
              max={selectedCourseBalance || undefined}
              className="w-full px-5 py-3 rounded-lg bg-gray-700 border border-gray-600 text-gray-100 placeholder-gray-400
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 shadow-inner
                         disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder={selectedCourseBalance ? `Maksimal: $${selectedCourseBalance.toFixed(2)}` : 'Pilih kursus terlebih dahulu'}
              step="0.01" // Allows decimal input for amount
            />
          </label>

          {/* Quick amount buttons */}
          {selectedCourseBalance !== null && selectedCourseBalance > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="text-gray-300 text-sm mr-2">Pilih cepat:</span>
              {[25, 50, 75, 100].map((percentage) => {
                const amount = (selectedCourseBalance * percentage) / 100;
                if (amount > 0) {
                  return (
                    <button
                      key={percentage}
                      type="button"
                      onClick={() => setFormData({ ...formData, amount: amount.toFixed(2) })}
                      className="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200"
                    >
                      {percentage}% (${amount.toFixed(2)})
                    </button>
                  );
                }
                return null;
              })}
            </div>
          )}
        </div>

        {/* Payment Method */}
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

        {/* Description */}
        <label className="block mb-8">
          <span className="text-gray-200 text-sm font-semibold mb-2 block">Deskripsi (Opsional)</span>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={5} // Increased rows for more space
            className="w-full px-5 py-3 rounded-lg bg-gray-700 border border-gray-600 text-gray-100 placeholder-gray-400
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 resize-y shadow-inner"
            placeholder="Tambahkan catatan atau detail tambahan untuk permintaan payout ini..."
          />
        </label>

        <button
          onClick={handleSubmit}
          disabled={loading || !formData.courseId || !formData.amount || selectedCourseBalance === null}
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
