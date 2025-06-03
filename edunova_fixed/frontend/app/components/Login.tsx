import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom'; // Menggunakan react-router-dom untuk Link dan Navigate
import { useAuth } from '../contexts/AuthContext'; // Pastikan path-nya sesuai
import {
  FaEnvelope, FaLock, FaSignInAlt, FaSpinner, FaUserPlus, FaTimesCircle
} from 'react-icons/fa'; // Import ikon yang relevan

export default function Login() {
  const { login, loading, error, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(formData.email, formData.password);
    } catch (err) {
      // Error is handled by AuthContext, no need to do anything here
      // console.error(err); // Optional: for debugging
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-900 bg-cover bg-center"
      style={{ backgroundImage: "url('/image_286d15.jpg')" }} // Menggunakan gambar yang Anda berikan
    >
      <div className="absolute inset-0 bg-black opacity-60"></div> {/* Overlay gelap */}

      <div className="relative z-10 max-w-md w-full space-y-8 p-8 bg-gray-800 rounded-lg shadow-2xl border border-gray-700">
        <div>
          <h2 className="mt-6 text-center text-4xl font-extrabold text-white">
            Welcome Back!
          </h2>
          <p className="mt-2 text-center text-gray-300 text-lg">
            Sign in to your account
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-900/20 border border-red-700 text-red-400 px-5 py-4 rounded-md flex items-center">
              <FaTimesCircle className="mr-3 text-xl" />
              <span>{error}</span>
            </div>
          )}

          {/* Email Input */}
          <div>
            <label htmlFor="email" className="sr-only">Email address</label>
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
                value={formData.email}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-3 border border-gray-600 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-base transition duration-200"
                placeholder="Email address"
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
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-3 border border-gray-600 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-base transition duration-200"
                placeholder="Password"
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
                  <FaSpinner className="animate-spin mr-3" /> Signing in...
                </span>
              ) : (
                <>
                  <FaSignInAlt className="mr-3 -ml-1 text-xl" />
                  Sign in
                </>
              )}
            </button>
          </div>

          {/* Sign Up Link */}
          <div className="text-center">
            <Link to="/register" className="font-medium text-indigo-400 hover:text-indigo-300 transition duration-200 flex items-center justify-center">
              <FaUserPlus className="mr-2" /> Don't have an account? Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}