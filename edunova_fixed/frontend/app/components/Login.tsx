import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaEnvelope, FaLock, FaSignInAlt, FaSpinner, FaUserPlus, FaTimesCircle, FaEye, FaEyeSlash } from 'react-icons/fa';

export default function Login() {
  const { login, loading, error, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(formData.email, formData.password);
    } catch (err) {
      // Error is handled by AuthContext
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-indigo-950/30 to-purple-950/20 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-blue-600/10 to-cyan-600/10 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          >
            <div className="w-2 h-2 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full"></div>
          </div>
        ))}
      </div>

      <div className="relative z-10 max-w-md w-full mx-4">
        {/* Glass morphism card */}
        <div className="backdrop-blur-xl bg-gray-800/30 border border-gray-700/50 rounded-3xl shadow-2xl p-8 space-y-8 hover:shadow-indigo-500/10 transition-all duration-500">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl mb-4 shadow-lg shadow-indigo-500/25">
              <FaSignInAlt className="text-2xl text-white" />
            </div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">Welcome Back!</h2>
            <p className="text-gray-400 text-lg font-medium">Continue your learning journey with EduNova</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-900/20 backdrop-blur-sm border border-red-500/30 text-red-300 px-5 py-4 rounded-xl flex items-center shadow-lg">
                <FaTimesCircle className="mr-3 text-xl text-red-400" />
                <span className="font-medium">{error}</span>
              </div>
            )}

            {/* Email Input */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-semibold text-gray-300 block">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                  <FaEnvelope className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-400 transition-colors duration-200" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="relative block w-full pl-12 pr-4 py-4 bg-gray-700/50 backdrop-blur-sm border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 text-base transition-all duration-300 hover:bg-gray-700/70 z-20"
                  placeholder="Enter your email"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-semibold text-gray-300 block">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                  <FaLock className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-400 transition-colors duration-200" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="relative block w-full pl-12 pr-12 py-4 bg-gray-700/50 backdrop-blur-sm border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 text-base transition-all duration-300 hover:bg-gray-700/70 z-20"
                  placeholder="Enter your password"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowPassword(!showPassword);
                  }}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center z-30 text-gray-400 hover:text-indigo-400 transition-colors duration-200"
                >
                  {showPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center items-center py-4 px-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-700 hover:via-purple-700 hover:to-indigo-800 text-white font-bold text-lg rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              {loading ? (
                <span className="flex items-center relative z-10">
                  <FaSpinner className="animate-spin mr-3 text-xl" />
                  Signing you in...
                </span>
              ) : (
                <span className="flex items-center relative z-10">
                  <FaSignInAlt className="mr-3 text-xl" />
                  Sign In to EduNova
                </span>
              )}
            </button>

            {/* Sign Up Link */}
            <div className="text-center pt-4">
              <p className="text-gray-400 mb-2">New to EduNova?</p>
              <Link to="/register" className="group inline-flex items-center font-semibold text-indigo-400 hover:text-indigo-300 transition-all duration-200 hover:scale-105">
                <FaUserPlus className="mr-2 group-hover:animate-bounce" />
                Create your account
                <div className="ml-2 w-0 h-0.5 bg-gradient-to-r from-indigo-400 to-purple-400 group-hover:w-4 transition-all duration-300"></div>
              </Link>
            </div>
          </form>
        </div>

        {/* Bottom text */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            By signing in, you agree to our{' '}
            <Link to="/terms" className="text-indigo-400 hover:text-indigo-300 underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="/privacy" className="text-indigo-400 hover:text-indigo-300 underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
