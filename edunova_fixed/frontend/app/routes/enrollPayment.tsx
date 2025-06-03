import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axiosInstance from '../lib/axios';
import { FaCreditCard, FaSpinner, FaDollarSign, FaBookOpen, FaInfoCircle, FaArrowLeft, FaCheckCircle, FaTimesCircle, FaSignInAlt } from 'react-icons/fa';

export default function EnrollPayment() {
  const { id: enrollmentId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [enrollment, setEnrollment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('CREDIT_CARD');
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (!enrollmentId) return;
    fetchEnrollmentDetails();
  }, [enrollmentId]);

  const fetchEnrollmentDetails = async () => {
    setLoading(true);
    setMessage(null);
    setIsError(false);
    try {
      const res = await axiosInstance.get(`/enrollments/${enrollmentId}`);
      console.log('Enrollment data:', res.data.enrollment);
      setEnrollment(res.data.enrollment);

      // Cek apakah sudah dibayar
      if (res.data.enrollment.payment && res.data.enrollment.payment.status === 'COMPLETED') {
        setMessage('This course has already been paid for.');
        setIsError(false);
      }
    } catch (err: any) {
      console.error('Failed to load enrollment:', err);
      setMessage(err.response?.data?.message || 'Unable to load enrollment information.');
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!enrollmentId) return;

    // Validasi payment method
    if (!paymentMethod) {
      setMessage('Please select a payment method');
      setIsError(true);
      return;
    }

    // Cek apakah sudah dibayar
    if (enrollment?.payment?.status === 'COMPLETED') {
      setMessage('This course has already been paid for.');
      setIsError(true);
      return;
    }

    setProcessing(true);
    setMessage(null);
    setIsError(false);

    console.log('Processing payment with method:', paymentMethod);

    try {
      const { data } = await axiosInstance.put(`/enrollments/${enrollmentId}/payment`, {
        paymentMethod: paymentMethod,
      });

      setMessage(data.message || 'Payment processed successfully!');
      setIsError(false);

      // Refresh enrollment data
      await fetchEnrollmentDetails();

      // Navigate after success
      setTimeout(() => {
        navigate(`/courses/${enrollment?.course?.id}/lessons`);
      }, 2000);
    } catch (err: any) {
      console.error('Payment processing failed:', err);
      setMessage(err.response?.data?.message || 'Payment failed. Please try again.');
      setIsError(true);
    } finally {
      setProcessing(false);
    }
  };

  // State untuk pengguna yang belum login
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center p-6">
        <div className="text-center p-8 bg-gray-800 rounded-lg shadow-xl border border-gray-700">
          <FaInfoCircle className="text-blue-500 text-5xl mx-auto mb-4" />
          <p className="text-gray-300 text-lg mb-6">
            Please{' '}
            <Link to="/login" className="text-blue-400 hover:underline font-semibold">
              login
            </Link>{' '}
            to proceed with enrollment and payment.
          </p>
          <Link to="/login" className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <FaSignInAlt className="mr-2" /> Go to Login
          </Link>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
        <p className="ml-4 text-blue-300 text-lg">Loading enrollment information…</p>
      </div>
    );
  }

  // Jika enrollment tidak ditemukan
  if (!enrollment) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center">
        <div className="text-center p-8 bg-gray-800 rounded-lg shadow-xl border border-gray-700">
          <FaTimesCircle className="text-red-500 text-5xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-400 mb-2">Enrollment Not Found</h2>
          <p className="text-gray-400 mb-6">The enrollment information could not be loaded.</p>
          <button onClick={() => navigate('/')} className="inline-flex items-center px-6 py-3 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-red-500">
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  // Jika course gratis
  if (!enrollment.course || enrollment.course.price <= 0) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center">
        <div className="text-center p-8 bg-gray-800 rounded-lg shadow-xl border border-gray-700">
          <FaCheckCircle className="text-green-500 text-5xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-green-400 mb-2">Free Course</h2>
          <p className="text-gray-400 mb-6">This course is free. No payment required.</p>
          <Link
            to={`/courses/${enrollment.course.id}/lessons`}
            className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Start Learning
          </Link>
        </div>
      </div>
    );
  }

  const isAlreadyPaid = enrollment.payment && enrollment.payment.status === 'COMPLETED';
  const isPendingPayment = enrollment.payment && enrollment.payment.status === 'PENDING';

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center p-6">
      <div className="max-w-lg w-full bg-gray-800 rounded-lg shadow-xl p-8 border border-gray-700">
        {/* Back Link */}
        <Link to={enrollment.course?.id ? `/courses/${enrollment.course.id}` : '/'} className="text-blue-400 hover:text-blue-300 transition duration-200 flex items-center mb-6">
          <FaArrowLeft className="mr-2" /> Back to Course
        </Link>

        <h1 className="text-3xl font-bold text-white mb-4 flex items-center">
          <FaBookOpen className="mr-3 text-purple-400" /> {enrollment.course.title}
        </h1>
        <p className="mb-8 text-xl text-gray-300 flex items-center">
          <FaDollarSign className="mr-2 text-green-400" /> Total Price: <span className="font-semibold text-green-300 ml-1">${(enrollment.course.price ?? 0).toFixed(2)}</span>
        </p>

        {/* Payment Status */}
        {isAlreadyPaid && (
          <div className="mb-6 p-4 rounded-md bg-green-900/20 text-green-400 border border-green-700 flex items-center">
            <FaCheckCircle className="mr-3 text-2xl" />
            <div>
              <p className="text-lg font-semibold">Payment Completed</p>
              <p className="text-sm">You can now access the course lessons.</p>
            </div>
          </div>
        )}

        {/* Pending Payment Status */}
        {isPendingPayment && !isAlreadyPaid && (
          <div className="mb-6 p-4 rounded-md bg-yellow-900/20 text-yellow-400 border border-yellow-700 flex items-center">
            <FaInfoCircle className="mr-3 text-2xl" />
            <div>
              <p className="text-lg font-semibold">Payment Pending</p>
              <p className="text-sm">Please complete your payment to access the course.</p>
            </div>
          </div>
        )}

        {/* Message area (success/error) */}
        {message && (
          <div className={`mb-6 p-4 rounded-md flex items-center ${isError ? 'bg-red-900/20 text-red-400 border border-red-700' : 'bg-green-900/20 text-green-400 border border-green-700'}`}>
            {isError ? <FaTimesCircle className="mr-3 text-2xl" /> : <FaCheckCircle className="mr-3 text-2xl" />}
            <p className="text-lg">{message}</p>
          </div>
        )}

        {/* Payment Form - hanya tampil jika belum dibayar dan ada pending payment */}
        {!isAlreadyPaid && isPendingPayment && (
          <>
            {/* Payment Method Selection */}
            <div className="mb-6">
              <label htmlFor="payment-method-select" className="block text-gray-300 text-sm font-medium mb-2 flex items-center">
                <FaCreditCard className="mr-2" /> Select Payment Method:
              </label>
              <div className="relative">
                <select
                  id="payment-method-select"
                  className="block w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none pr-10 transition duration-200"
                  name="paymentMethod"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  disabled={processing}
                >
                  <option value="CREDIT_CARD" className="bg-gray-800 text-white p-2">
                    Credit Card
                  </option>
                  <option value="E_WALLET" className="bg-gray-800 text-white p-2">
                    E-Wallet
                  </option>
                  <option value="BANK_TRANSFER" className="bg-gray-800 text-white p-2">
                    Bank Transfer
                  </option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Proceed to Payment Button */}
            <button
              onClick={handlePayment}
              disabled={processing}
              className="w-full flex items-center justify-center px-6 py-3 bg-purple-600 text-white rounded-lg shadow-md hover:bg-purple-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {processing ? (
                <span className="flex items-center">
                  <FaSpinner className="animate-spin mr-3" /> Processing Payment...
                </span>
              ) : (
                <>
                  <FaCreditCard className="mr-3" /> Proceed to Payment
                </>
              )}
            </button>
          </>
        )}

        {/* Start Learning Button - tampil jika sudah dibayar */}
        {isAlreadyPaid && (
          <Link
            to={`/courses/${enrollment.course.id}/lessons`}
            className="w-full flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 text-lg"
          >
            <FaBookOpen className="mr-3" /> Start Learning
          </Link>
        )}

        {/* Show message if no payment record exists but course is paid */}
        {!isPendingPayment && !isAlreadyPaid && enrollment.course.price > 0 && (
          <div className="mb-6 p-4 rounded-md bg-red-900/20 text-red-400 border border-red-700 flex items-center">
            <FaTimesCircle className="mr-3 text-2xl" />
            <div>
              <p className="text-lg font-semibold">Payment Record Not Found</p>
              <p className="text-sm">Please contact support for assistance.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
