import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { enrollAPI } from '../lib/enroll';

export default function EnrollCourse() {
  const { id } = useParams();
  const courseId = Number(id); // Pastikan ID dikonversi ke number
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [needsPayment, setNeedsPayment] = useState<boolean | null>(null);

  const handleEnroll = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await enrollAPI.enrollCourse(courseId);

      const enrollmentId = res.data.enrollment?.id;
      const needPayment = res.data.needsPayment;

      setMessage(res.data.message);
      setNeedsPayment(needPayment);

      // Redirect to payment page if needed
      if (enrollmentId && needPayment) {
        navigate(`/enrollments/${enrollmentId}/payment`);
      }
    } catch (error) {
      console.error('Enroll failed:', error);
      setMessage('Gagal enroll course');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleEnroll}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {loading ? 'Memproses...' : 'Enroll Course'}
      </button>

      {message && (
        <p className="mt-4 text-white">
          {message}
          {needsPayment && ' (Pembayaran diperlukan)'}
        </p>
      )}
    </div>
  );
}