import { useEffect, useState } from 'react';
import { payoutAPI } from '../../lib/payout'; // pastikan ini impor benar
import { formatDate } from '../../utils/formatDate';

export default function PayoutDebug() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    payoutAPI.getPayoutDebug()
      .then((res) => setData(res.data))
      .catch((err) => console.error('Failed to fetch payout debug:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-white text-center">Loading...</p>;
  if (!data) return <p className="text-white text-center">Tidak ada data ditemukan.</p>;

  const { instructor, courses, enrollments, payments, payouts, summary } = data;

  return (
    <div className="max-w-4xl mx-auto text-white p-6 space-y-6">
      <h1 className="text-3xl font-bold">Debug Info - Instructor</h1>

      {/* Instructor Info */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Instructor</h2>
        <ul className="list-disc list-inside">
          <li>ID: {instructor.id}</li>
          <li>Name: {instructor.name}</li>
          <li>Email: {instructor.email}</li>
          <li>Role: {instructor.role}</li>
        </ul>
      </section>

      {/* Courses */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Courses</h2>
        {courses.length === 0 ? (
          <p>-</p>
        ) : (
          <ul className="list-disc list-inside">
            {payments.map((p: any) => (
                <li key={p.id}>
                Payment ID: {p.id}, Amount: ${p.totalAmount}, Instructor Share: ${p.instructorShare}, Status: {p.status}, Course: {p.enrollment?.course?.title || 'Unknown Course'}
                </li>
            ))}
        </ul>
        )}
      </section>

      {/* Enrollments */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Enrollments</h2>
        {enrollments.length === 0 ? (
          <p>-</p>
        ) : (
          <ul className="list-disc list-inside">
            {enrollments.map((e: any) => (
              <li key={e.id}>
                Enrollment ID: {e.id}, Course ID: {e.courseId}, User ID: {e.userId}, Status: {e.status}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Payments */}
        <section>
        <h2 className="text-xl font-semibold mb-2">Payments</h2>
        {payments.length === 0 ? (
            <p>-</p>
        ) : (
            <ul className="list-disc list-inside">
            {payments.map((p: any) => (
                <li key={p.id}>
                Payment ID: {p.id}, Amount: ${p.totalAmount}, Instructor Share: ${p.instructorShare}, Status: {p.status}, Course: {p.enrollment?.course?.title || 'Unknown Course'}
                </li>
            ))}
            </ul>
        )}
        </section>

      {/* Payouts */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Payouts</h2>
        {payouts.length === 0 ? (
          <p>-</p>
        ) : (
          <ul className="list-disc list-inside">
            {payouts.map((p: any) => (
              <li key={p.id}>
                Payout ID: {p.id}, Amount: ${p.amount}, Status: {p.status}, Course ID: {p.courseId}, Requested At: {formatDate(new Date(p.requestedAt))}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Summary */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Summary</h2>
        <ul className="list-disc list-inside">
          <li>Total Courses: {summary.totalCourses}</li>
          <li>Total Enrollments: {summary.totalEnrollments}</li>
          <li>Total Payments: {summary.totalPayments}</li>
          <li>Completed Payments: {summary.completedPayments}</li>
          <li>Total Payouts: {summary.totalPayouts}</li>
          <li>Completed Payouts: {summary.completedPayouts}</li>
          <li>Pending Payouts: {summary.pendingPayouts}</li>
        </ul>
      </section>
    </div>
  );
}
