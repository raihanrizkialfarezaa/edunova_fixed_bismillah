import { useState } from 'react';
import { profileAPI } from '../../lib/auth'; // pastikan path-nya sesuai
import { FaKey, FaSpinner, FaCheckCircle, FaTimesCircle } from 'react-icons/fa'; // Import ikon

export default function ChangePassword() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false); // Untuk submit button
  const [message, setMessage] = useState<string | null>(null); // Untuk pesan sukses
  const [error, setError] = useState<string | null>(null); // Untuk pesan error

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null); // Reset pesan sukses
    setError(null);    // Reset pesan error

    try {
      // Pastikan API call Anda mengirim objek dengan oldPassword dan newPassword
      const res = await profileAPI.changePassword({ oldPassword, newPassword });
      setMessage(res.data.message || 'Password changed successfully.');
      setOldPassword(''); // Kosongkan field setelah sukses
      setNewPassword(''); // Kosongkan field setelah sukses
    } catch (err: any) {
      console.error('Error changing password:', err);
      // Tangani error dari response API, jika ada format standar seperti err.response.data.message
      const errorMessage = err.response?.data?.message || 'Failed to change password. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    // Main container with dark background and light text
    <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-xl p-8 border border-gray-700"> {/* Dark card background */}
        <h1 className="text-3xl font-bold text-white mb-6 text-center flex items-center justify-center">
          <FaKey className="mr-3 text-blue-400" /> Change Password
        </h1>

        {/* Success/Error messages */}
        {message && (
          <div className="bg-green-900/20 text-green-400 p-4 rounded-md mb-6 border border-green-700 flex items-center">
            <FaCheckCircle className="mr-3 text-2xl" /> {message}
          </div>
        )}
        {error && (
          <div className="bg-red-900/20 text-red-400 p-4 rounded-md mb-6 border border-red-700 flex items-center">
            <FaTimesCircle className="mr-3 text-2xl" /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="oldPassword" className="block text-gray-300 text-sm font-medium mb-2">Old Password</label>
            <input
              id="oldPassword"
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
              className="w-full p-3 bg-gray-700 border border-gray-600 text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 transition duration-200"
              placeholder="Enter your current password"
            />
          </div>

          <div>
            <label htmlFor="newPassword" className="block text-gray-300 text-sm font-medium mb-2">New Password</label>
            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full p-3 bg-gray-700 border border-gray-600 text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 transition duration-200"
              placeholder="Enter your new password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center">
                <FaSpinner className="animate-spin mr-3" /> Updating...
              </span>
            ) : (
              'Update Password'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}