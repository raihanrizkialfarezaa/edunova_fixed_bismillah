import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { instructorAPI } from '~/lib/instructor';

export default function AdminResponse() {
  const { id } = useParams<{ id: string }>();
  const requestId = parseInt(id || '', 10);

  const [action, setAction] = useState<'approve' | 'reject' | ''>('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await instructorAPI.processInstructorRequest(requestId, action, rejectionReason);
      setMessage(`Request has been ${action}d.`);
    } catch (error) {
      setMessage('Failed to process request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-gray-900 text-white rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Respond to Instructor Request</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mr-4">
            <input
              type="radio"
              name="action"
              value="approve"
              onChange={() => setAction('approve')}
              checked={action === 'approve'}
              className="mr-1"
            />
            Approve
          </label>

          <label className="ml-6">
            <input
              type="radio"
              name="action"
              value="reject"
              onChange={() => setAction('reject')}
              checked={action === 'reject'}
              className="mr-1"
            />
            Reject
          </label>
        </div>

        {action === 'reject' && (
          <textarea
            placeholder="Reason for rejection"
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            required
            className="w-full p-2 rounded bg-gray-800"
          />
        )}

        <button
          type="submit"
          disabled={!action || (action === 'reject' && !rejectionReason) || loading}
          className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? 'Processing...' : 'Submit'}
        </button>

        {message && <p className="mt-4">{message}</p>}
      </form>
    </div>
  );
}