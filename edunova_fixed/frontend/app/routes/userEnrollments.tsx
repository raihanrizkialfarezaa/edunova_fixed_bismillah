import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axiosInstance from '../lib/axios';
import { FaBookOpen, FaCalendarAlt, FaDollarSign, FaArrowRight, FaSpinner, FaInfoCircle, FaGraduationCap, FaCrown } from 'react-icons/fa';

type Enrollment = {
  id: number;
  course: {
    id: number;
    title: string;
    price: number;
  };
  payment?: {
    status: 'PENDING' | 'COMPLETED' | 'FAILED';
  };
  createdAt: string; // Changed from enrolledAt to createdAt
};

export default function UserEnrollments() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchEnrollments();
  }, [user, navigate]);

  const fetchEnrollments = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.get<{
        enrollments: Enrollment[];
      }>(`/my-enrollments`);
      setEnrollments(res.data.enrollments);
    } catch (err: any) {
      console.error('Failed to fetch enrollments:', err);
      const errorMessage = err.response?.data?.message || 'Tidak dapat memuat daftar kursus Anda. Silakan coba lagi.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Tanggal tidak valid';
      }
      return date.toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch (error) {
      return 'Tanggal tidak valid';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800">
      {/* Header Background Decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-teal-600/10 pointer-events-none"></div>
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-blue-900/20 to-transparent pointer-events-none"></div>

      <div className="relative z-10 p-6 pt-12">
        <div className="max-w-5xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6 shadow-lg">
              <FaGraduationCap className="text-3xl text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-teal-400 bg-clip-text text-transparent mb-4">Kursus Saya</h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">Kelola dan akses semua kursus yang telah Anda daftarkan</p>
          </div>

          {/* Main Content Container */}
          <div className="bg-gray-800/60 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700/50 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-teal-600/20 px-8 py-6 border-b border-gray-700/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FaCrown className="text-2xl text-yellow-400" />
                  <h2 className="text-2xl font-bold text-white">Dashboard Pembelajaran</h2>
                </div>
                <div className="text-sm text-gray-300 bg-gray-700/50 px-4 py-2 rounded-full">{enrollments.length} Kursus Terdaftar</div>
              </div>
            </div>

            <div className="p-8">
              {/* Loading State */}
              {loading && (
                <div className="text-center py-16">
                  <div className="relative mx-auto mb-6 w-16 h-16">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse"></div>
                    <div className="absolute inset-2 bg-gray-800 rounded-full flex items-center justify-center">
                      <FaSpinner className="text-2xl text-blue-400 animate-spin" />
                    </div>
                  </div>
                  <p className="text-blue-300 text-lg font-medium">Memuat kursus Anda...</p>
                </div>
              )}

              {/* Error State */}
              {!loading && error && (
                <div className="bg-gradient-to-r from-red-900/20 to-pink-900/20 text-red-300 p-6 rounded-xl mb-6 border border-red-700/50 backdrop-blur-sm">
                  <div className="flex items-center justify-center space-x-3">
                    <FaInfoCircle className="text-2xl text-red-400" />
                    <span className="text-lg font-medium">{error}</span>
                  </div>
                </div>
              )}

              {/* No Enrollments State */}
              {!loading && !error && enrollments.length === 0 && (
                <div className="text-center py-16">
                  <div className="w-24 h-24 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FaBookOpen className="text-3xl text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-300 mb-4">Belum Ada Kursus</h3>
                  <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">Anda belum mendaftar di kursus manapun. Mulai perjalanan belajar Anda sekarang!</p>
                  <Link
                    to="/course"
                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500/50 text-lg font-semibold"
                  >
                    <FaBookOpen className="mr-3" />
                    Jelajahi Kursus
                    <FaArrowRight className="ml-3" />
                  </Link>
                </div>
              )}

              {/* Enrollments Grid */}
              {!loading && !error && enrollments.length > 0 && (
                <div className="grid gap-6 md:gap-8">
                  {enrollments.map((en) => (
                    <div
                      key={en.id}
                      className="group bg-gradient-to-r from-gray-800/80 to-gray-700/80 backdrop-blur-sm rounded-xl shadow-xl border border-gray-600/50 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:border-blue-500/50 hover:-translate-y-1"
                    >
                      {en.course ? (
                        <>
                          {/* Course Header */}
                          <div className="bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-teal-600/10 px-6 py-4 border-b border-gray-600/30">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h3 className="text-xl md:text-2xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">{en.course.title}</h3>
                                <div className="flex flex-wrap items-center gap-4 text-sm">
                                  <div className="flex items-center text-gray-300">
                                    <FaCalendarAlt className="mr-2 text-blue-400" />
                                    Terdaftar pada {formatDate(en.createdAt)}
                                  </div>
                                  <div className="flex items-center text-green-400 font-semibold">
                                    <FaDollarSign className="mr-2 text-green-500" />
                                    Rp {((en.course.price / 100) * 15000).toLocaleString('id-ID')}
                                  </div>
                                </div>
                              </div>

                              {/* Payment Status Badge */}
                              {en.payment && (
                                <div
                                  className={`px-4 py-2 rounded-full text-sm font-semibold ${
                                    en.payment.status === 'COMPLETED'
                                      ? 'bg-green-900/30 text-green-300 border border-green-500/30'
                                      : en.payment.status === 'PENDING'
                                      ? 'bg-yellow-900/30 text-yellow-300 border border-yellow-500/30'
                                      : 'bg-red-900/30 text-red-300 border border-red-500/30'
                                  }`}
                                >
                                  {en.payment.status === 'COMPLETED' ? 'Lunas' : en.payment.status === 'PENDING' ? 'Menunggu' : 'Gagal'}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Course Actions */}
                          <div className="p-6">
                            <div className="flex flex-col sm:flex-row gap-4">
                              {en.payment?.status === 'COMPLETED' || en.course.price === 0 ? (
                                <Link
                                  to={`/courses/${en.course.id}/lessons`}
                                  className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl shadow-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-500/50 font-semibold"
                                >
                                  <FaGraduationCap className="mr-3" />
                                  Mulai Belajar
                                  <FaArrowRight className="ml-3" />
                                </Link>
                              ) : en.payment?.status === 'PENDING' ? (
                                <Link
                                  to={`/enrollments/${en.id}/payment`}
                                  className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-yellow-600 to-orange-600 text-white rounded-xl shadow-lg hover:from-yellow-700 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-yellow-500/50 font-semibold"
                                >
                                  <FaDollarSign className="mr-3" />
                                  Selesaikan Pembayaran
                                  <FaArrowRight className="ml-3" />
                                </Link>
                              ) : (
                                <Link
                                  to={`/courses/${en.course.id}`}
                                  className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl shadow-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-500/50 font-semibold"
                                >
                                  <FaBookOpen className="mr-3" />
                                  Lihat Kursus
                                  <FaArrowRight className="ml-3" />
                                </Link>
                              )}
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="p-6">
                          <div className="text-center py-8">
                            <div className="w-16 h-16 bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                              <FaInfoCircle className="text-2xl text-red-400" />
                            </div>
                            <h3 className="text-xl font-bold text-red-300 mb-2">Kursus Tidak Tersedia</h3>
                            <p className="text-gray-400">Kursus ini telah dihapus dari sistem.</p>
                            <p className="text-sm text-gray-500 mt-2">Terdaftar pada: {formatDate(en.createdAt)}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
