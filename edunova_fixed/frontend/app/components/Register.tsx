import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom'; // Menggunakan react-router-dom untuk Link dan Navigate
import { useAuth } from '../contexts/AuthContext'; // Pastikan path-nya sesuai
import {
  FaUser, FaEnvelope, FaLock, FaSignInAlt, FaSpinner, FaUserPlus, FaTimesCircle
} from 'react-icons/fa'; // Import ikon yang relevan

export default function Register() {
  const { register, loading, error, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'STUDENT' // Role otomatis diset sebagai STUDENT
  });

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Mengirim role sebagai 'STUDENT' secara otomatis dari state
      await register(formData.name, formData.email, formData.password, formData.role);
    } catch (err) {
      // Error is handled by AuthContext, no need to do anything here
      // console.error(err); // Optional: for debugging
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { // Hanya perlu HTMLInputElement karena select role dihilangkan
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 bg-cover bg-center">
      <div className="absolute inset-0 bg-black opacity-60"></div> {/* Overlay gelap */}

      <div className="relative z-10 max-w-md w-full space-y-8 p-8 bg-gray-800 rounded-lg shadow-2xl border border-gray-700">
        <div>
          <h2 className="mt-6 text-center text-4xl font-extrabold text-white">
            Create Your Account
          </h2>
          <p className="mt-2 text-center text-gray-300 text-lg">
            Join our community today!
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-900/20 border border-red-700 text-red-400 px-5 py-4 rounded-md flex items-center">
              <FaTimesCircle className="mr-3 text-xl" />
              <span>{error}</span>
            </div>
          )}

          {/* Full Name Input */}
          <div>
            <label htmlFor="name" className="sr-only">Full Name</label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUser className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="block w-full pl-10 pr-3 py-3 border border-gray-600 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-base transition duration-200"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
          </div>

          {/* Email Input */}
          <div>
            <label htmlFor="email" className="sr-only">Email Address</label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="block w-full pl-10 pr-3 py-3 border border-gray-600 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-base transition duration-200"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="sr-only">Password</label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="block w-full pl-10 pr-3 py-3 border border-gray-600 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-base transition duration-200"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-lg font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
            >
              {loading ? (
                <span className="flex items-center">
                  <FaSpinner className="animate-spin mr-3" /> Creating account...
                </span>
              ) : (
                <>
                  <FaUserPlus className="mr-3 -ml-1 text-xl" />
                  Create account
                </>
              )}
            </button>
          </div>

          {/* Sign In Link */}
          <div className="text-center">
            <Link
              to="/login"
              className="font-medium text-indigo-400 hover:text-indigo-300 transition duration-200 flex items-center justify-center"
            >
              <FaSignInAlt className="mr-2" /> Already have an account? Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}