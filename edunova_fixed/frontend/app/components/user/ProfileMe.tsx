import { useEffect, useState } from 'react';
import { profileAPI } from '../../lib/auth'; // sesuaikan path
import { formatDate } from '../../utils/formatDate';
import { Link } from 'react-router-dom'; // Mengubah dari 'react-router' ke 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext';
import {
  FaUserCircle, FaEnvelope, FaIdBadge, FaCodeBranch, FaBook, FaBriefcase,
  FaLink, FaPhone, FaCheckCircle, FaHourglassHalf, FaTimesCircle, FaCalendarAlt,
  FaKey, FaChalkboardTeacher, FaEdit
} from 'react-icons/fa'; // Import ikon

interface UserProfile {
  id: number;
  name: string;
  email: string;
  password?: string; // Optional, as it might not be fetched for display
  role: string;
  bio: string | null;
  expertise: string[] | null;
  experience: string | null;
  education: string | null;
  socialLinks: Record<string, string> | null;
  phoneNumber: string | null;
  profileImage: string | null;
  instructorStatus: string | null;
  instructorRequestedAt: string | null;
  instructorApprovedAt: string | null;
  rejectionReason: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export default function ProfileMe() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuth(); // Mengambil user dari AuthContext

  useEffect(() => {
    profileAPI.getProfile()
      .then((res) => {
        // Sesuaikan jika data profil ada di res.data.data
        setProfile(res.data);
        setError(null);
      })
      .catch((err) => {
        console.error("Failed to load profile:", err);
        setError('Failed to load profile. Please try again.');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
      <p className="ml-4 text-blue-300 text-lg">Loading profile...</p>
    </div>
  );
  if (error) return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
      <div className="text-red-500 bg-red-900/20 p-6 rounded-lg border border-red-700 text-center">
        <p className="text-xl font-semibold mb-2">Error Loading Profile</p>
        <p>{error}</p>
      </div>
    </div>
  );
  if (!profile) return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
      <p className="text-gray-400 text-lg bg-gray-800 p-6 rounded-lg border border-gray-700">No profile data available.</p>
    </div>
  );

  const isAdminOrInstructor = profile.role === 'ADMIN' || profile.role === 'INSTRUCTOR' || profile.role === 'STUDENT'; // Hapus profile.role === 'STUDENT' jika ingin pembatasan

  return (
    // Main container with dark background, padding, and min-height
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-gray-800 rounded-lg shadow-xl p-8 border border-gray-700"> {/* Dark card background */}

        {/* Header Section */}
        <div className="flex flex-col items-center sm:flex-row sm:items-start gap-8 mb-8 pb-6 border-b border-gray-700">
          <div className="relative">
            {profile.profileImage ? (
              <img
                src={profile.profileImage}
                alt={`${profile.name} profile`}
                className="w-36 h-36 object-cover rounded-full border-4 border-blue-500 shadow-lg"
              />
            ) : (
              <div className="w-36 h-36 rounded-full bg-gray-700 flex items-center justify-center border-4 border-blue-500 shadow-lg">
                <FaUserCircle className="text-gray-400 text-6xl" />
              </div>
            )}
            {/* Role Badge */}
            <span className={`absolute bottom-0 right-0 px-3 py-1 text-xs font-bold rounded-full border-2
                        ${profile.role === 'ADMIN' ? 'bg-red-600 border-red-800' :
                          profile.role === 'INSTRUCTOR' ? 'bg-green-600 border-green-800' :
                          'bg-blue-600 border-blue-800'}`}>
              {profile.role}
            </span>
          </div>

          <div className="text-center sm:text-left flex-1">
            <h1 className="text-4xl font-extrabold text-white mb-2">{profile.name}</h1>
            <p className="text-lg text-gray-400 flex items-center justify-center sm:justify-start mb-1">
              <FaEnvelope className="mr-2 text-blue-400" /> {profile.email}
            </p>
            <p className="text-sm text-gray-500">Joined: {formatDate(new Date(profile.createdAt))}</p>
          </div>
        </div>

        {/* Main Profile Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* About Me / Bio Card */}
          <div className="bg-gray-700 p-6 rounded-lg shadow-md border border-gray-600">
            <h2 className="text-2xl font-semibold text-blue-400 mb-4 flex items-center">
              <FaIdBadge className="mr-3" /> About Me
            </h2>
            <p className="text-gray-300 leading-relaxed">{profile.bio ?? 'No bio provided.'}</p>
          </div>

          {/* Contact & Basic Info Card */}
          <div className="bg-gray-700 p-6 rounded-lg shadow-md border border-gray-600">
            <h2 className="text-2xl font-semibold text-blue-400 mb-4 flex items-center">
              <FaPhone className="mr-3" /> Contact & Basic Info
            </h2>
            <div className="space-y-3 text-gray-300">
              <p className="flex items-center">
                <strong className="w-28 flex items-center"><FaIdBadge className="mr-2 text-blue-300" /> ID:</strong> {profile.id}
              </p>
              <p className="flex items-center">
                <strong className="w-28 flex items-center"><FaPhone className="mr-2 text-blue-300" /> Phone:</strong> {profile.phoneNumber ?? '-'}
              </p>
              {profile.socialLinks && Object.keys(profile.socialLinks).length > 0 && (
                <div>
                  <strong className="flex items-center mb-2"><FaLink className="mr-2 text-blue-300" /> Social Links:</strong>
                  <ul className="ml-6 space-y-1">
                    {Object.entries(profile.socialLinks).map(([key, value]) => (
                      <li key={key}>
                        <a href={value} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline flex items-center">
                          {/* Anda bisa menambahkan ikon spesifik untuk setiap social link jika diinginkan */}
                          {key.charAt(0).toUpperCase() + key.slice(1)}: {value}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {!profile.socialLinks || Object.keys(profile.socialLinks).length === 0 && (
                <p><strong>Social Links:</strong> -</p>
              )}
            </div>
          </div>
        </div>

        {/* Instructor Specific Info (Conditional) */}
        {isAdminOrInstructor && (
          <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700 mb-8">
            <h2 className="text-2xl font-semibold text-green-400 mb-4 flex items-center border-b border-gray-700 pb-3">
              <FaChalkboardTeacher className="mr-3" /> Instructor Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-300">
              <div>
                <p className="flex items-start mb-3">
                  <strong className="w-32 flex items-center flex-shrink-0 mr-2"><FaCodeBranch className="mr-2 text-green-300" /> Expertise:</strong>
                  <span>{profile.expertise ? profile.expertise.join(', ') : '-'}</span>
                </p>
                <p className="flex items-start mb-3">
                  <strong className="w-32 flex items-center flex-shrink-0 mr-2"><FaBriefcase className="mr-2 text-green-300" /> Experience:</strong>
                  <span>{profile.experience ?? '-'}</span>
                </p>
                <p className="flex items-start mb-3">
                  <strong className="w-32 flex items-center flex-shrink-0 mr-2"><FaBook className="mr-2 text-green-300" /> Education:</strong>
                  <span>{profile.education ?? '-'}</span>
                </p>
              </div>
              <div>
                <p className="flex items-center mb-3">
                  <strong className="w-40 flex items-center flex-shrink-0 mr-2">
                    {profile.instructorStatus === 'Approved' ? <FaCheckCircle className="mr-2 text-green-400" /> :
                     profile.instructorStatus === 'Pending' ? <FaHourglassHalf className="mr-2 text-yellow-400" /> :
                     <FaTimesCircle className="mr-2 text-red-400" />
                    } Instructor Status:
                  </strong>
                  <span className={`font-medium ${
                    profile.instructorStatus === 'Approved' ? 'text-green-400' :
                    profile.instructorStatus === 'Pending' ? 'text-yellow-400' :
                    'text-red-400'
                  }`}>
                    {profile.instructorStatus ?? '-'}
                  </span>
                </p>
                <p className="flex items-center mb-3">
                  <strong className="w-40 flex items-center flex-shrink-0 mr-2"><FaCalendarAlt className="mr-2 text-green-300" /> Requested At:</strong>
                  <span>{profile.instructorRequestedAt ? formatDate(new Date(profile.instructorRequestedAt)) : '-'}</span>
                </p>
                <p className="flex items-center mb-3">
                  <strong className="w-40 flex items-center flex-shrink-0 mr-2"><FaCalendarAlt className="mr-2 text-green-300" /> Approved At:</strong>
                  <span>{profile.instructorApprovedAt ? formatDate(new Date(profile.instructorApprovedAt)) : '-'}</span>
                </p>
                {profile.rejectionReason && (
                    <p className="flex items-start mb-3">
                        <strong className="w-40 flex items-center flex-shrink-0 mr-2"><FaTimesCircle className="mr-2 text-red-400" /> Rejection Reason:</strong>
                        <span className="text-red-300 italic">{profile.rejectionReason}</span>
                    </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mt-8 pt-6 border-t border-gray-700">
          <Link
            to="/profile/change-password"
            className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
          >
            <FaKey className="mr-2" /> Change Password
          </Link>

          {profile.role === 'STUDENT' && profile.instructorStatus !== 'Approved' && ( // Only show if not already an instructor
            <Link
              to="/profile/request-instructor"
              className="flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg shadow-md hover:bg-purple-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg"
            >
              <FaChalkboardTeacher className="mr-2" /> Become Instructor
            </Link>
          )}

          {(user?.role === 'ADMIN' || user?.role === 'INSTRUCTOR') && (
            <Link
              to={`/users/${profile.id}/instructor-profile`} // Asumsi rute edit profil instruktur
              className="flex items-center px-6 py-3 bg-orange-600 text-white rounded-lg shadow-md hover:bg-orange-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 text-lg"
            >
              <FaEdit className="mr-2" /> Edit Profile
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}