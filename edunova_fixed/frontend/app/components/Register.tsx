import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaUser, FaEnvelope, FaLock, FaSignInAlt, FaSpinner, FaUserPlus, FaTimesCircle, FaEye, FaEyeSlash, FaCheckCircle } from 'react-icons/fa';

export default function Register() {
  const { register, loading, error, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'STUDENT',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const checkPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(formData.name, formData.email, formData.password, formData.role);
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

    if (name === 'password') {
      setPasswordStrength(checkPasswordStrength(value));
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 2) return 'bg-red-500';
    if (passwordStrength <= 3) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 2) return 'Weak';
    if (passwordStrength <= 3) return 'Medium';
    return 'Strong';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-indigo-950/30 to-purple-950/20 relative overflow-hidden py-8">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-indigo-600/20 to-cyan-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-emerald-600/10 to-teal-600/10 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(25)].map((_, i) => (
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
            <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
          </div>
        ))}
      </div>

      <div className="relative z-10 max-w-md w-full mx-4">
        {/* Glass morphism card */}
        <div className="backdrop-blur-xl bg-gray-800/30 border border-gray-700/50 rounded-3xl shadow-2xl p-8 space-y-6 hover:shadow-purple-500/10 transition-all duration-500">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl mb-4 shadow-lg shadow-purple-500/25">
              <FaUserPlus className="text-2xl text-white" />
            </div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">Join EduNova</h2>
            <p className="text-gray-400 text-lg font-medium">Start your learning adventure today</p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-900/20 backdrop-blur-sm border border-red-500/30 text-red-300 px-5 py-4 rounded-xl flex items-center shadow-lg">
                <FaTimesCircle className="mr-3 text-xl text-red-400" />
                <span className="font-medium">{error}</span>
              </div>
            )}

            {/* Full Name Input */}
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-semibold text-gray-300 block">
                Full Name
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                  <FaUser className="h-5 w-5 text-gray-400 group-focus-within:text-purple-400 transition-colors duration-200" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="relative block w-full pl-12 pr-4 py-4 bg-gray-700/50 backdrop-blur-sm border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 text-base transition-all duration-300 hover:bg-gray-700/70 z-20"
                  placeholder="Enter your full name"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Email Input */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-semibold text-gray-300 block">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                  <FaEnvelope className="h-5 w-5 text-gray-400 group-focus-within:text-purple-400 transition-colors duration-200" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="relative block w-full pl-12 pr-4 py-4 bg-gray-700/50 backdrop-blur-sm border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 text-base transition-all duration-300 hover:bg-gray-700/70 z-20"
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
                  <FaLock className="h-5 w-5 text-gray-400 group-focus-within:text-purple-400 transition-colors duration-200" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="relative block w-full pl-12 pr-12 py-4 bg-gray-700/50 backdrop-blur-sm border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 text-base transition-all duration-300 hover:bg-gray-700/70 z-20"
                  placeholder="Create a strong password"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowPassword(!showPassword);
                  }}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center z-30 text-gray-400 hover:text-purple-400 transition-colors duration-200"
                >
                  {showPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">Password strength:</span>
                    <span className={`font-semibold ${passwordStrength <= 2 ? 'text-red-400' : passwordStrength <= 3 ? 'text-yellow-400' : 'text-green-400'}`}>{getPasswordStrengthText()}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`} style={{ width: `${(passwordStrength / 5) * 100}%` }}></div>
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center items-center py-4 px-6 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 hover:from-purple-700 hover:via-pink-700 hover:to-purple-800 text-white font-bold text-lg rounded-xl shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] overflow-hidden mt-6"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              {loading ? (
                <span className="flex items-center relative z-10">
                  <FaSpinner className="animate-spin mr-3 text-xl" />
                  Creating your account...
                </span>
              ) : (
                <span className="flex items-center relative z-10">
                  <FaUserPlus className="mr-3 text-xl" />
                  Create Account
                </span>
              )}
            </button>

            {/* Sign In Link */}
            <div className="text-center pt-4">
              <p className="text-gray-400 mb-2">Already have an account?</p>
              <Link to="/login" className="group inline-flex items-center font-semibold text-purple-400 hover:text-purple-300 transition-all duration-200 hover:scale-105">
                <FaSignInAlt className="mr-2 group-hover:animate-bounce" />
                Sign in instead
                <div className="ml-2 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 group-hover:w-4 transition-all duration-300"></div>
              </Link>
            </div>
          </form>
        </div>

        {/* Benefits Section */}
        <div className="mt-8 text-center space-y-4">
          <p className="text-gray-400 text-sm font-medium">Join thousands of learners and get:</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <div className="flex items-center text-green-400">
              <FaCheckCircle className="mr-2" />
              <span>Free courses</span>
            </div>
            <div className="flex items-center text-blue-400">
              <FaCheckCircle className="mr-2" />
              <span>Expert instructors</span>
            </div>
            <div className="flex items-center text-purple-400">
              <FaCheckCircle className="mr-2" />
              <span>Certificates</span>
            </div>
          </div>
          <p className="text-gray-500 text-xs">
            By creating an account, you agree to our{' '}
            <Link to="/terms" className="text-purple-400 hover:text-purple-300 underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="/privacy" className="text-purple-400 hover:text-purple-300 underline">
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
