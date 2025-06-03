import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { instructorAPI } from '~/lib/instructor'; // sesuaikan path
import { useNavigate } from 'react-router-dom';
import {
  FaUser, FaCodeBranch, FaBriefcase, FaBook, FaLinkedin, FaTwitter, FaGithub,
  FaPhone, FaImage, FaSave, 
  FaCheckCircle, FaTimesCircle, FaLink
} from 'react-icons/fa'

interface FormData {
  bio: string;
  expertise: string[];
  experience: string;
  education: string;
  socialLinks: {
    linkedin: string;
    twitter: string;
    github: string;
  };
  phoneNumber: string;
  profileImage: string;
}

export default function EditProfile() {
  const { id } = useParams<{ id: string }>();
  const [formData, setFormData] = useState<FormData>({
    bio: '',
    expertise: [],
    experience: '',
    education: '',
    socialLinks: {
      linkedin: '',
      twitter: '',
      github: '',
    },
    phoneNumber: '',
    profileImage: '',
  });
  const [loading, setLoading] = useState(true); // State untuk loading saat fetch data
  const [submitting, setSubmitting] = useState(false); // State untuk loading saat submit form
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        setError('User ID not found in URL.');
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const res = await instructorAPI.getProfileInstructor(Number(id)); // Pastikan method ini tersedia
        const data = res.data.user; // Asumsi data profil ada di res.data.user

        setFormData({
          bio: data.bio || '',
          expertise: data.expertise || [],
          experience: data.experience || '',
          education: data.education || '',
          socialLinks: {
            linkedin: data.socialLinks?.linkedin || '',
            twitter: data.socialLinks?.twitter || '',
            github: data.socialLinks?.github || '',
          },
          phoneNumber: data.phoneNumber || '',
          profileImage: data.profileImage || '',
        });
      } catch (err) {
        console.error('Failed to load instructor data:', err);
        setError('Failed to load instructor data. Please check the ID or network connection.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('socialLinks.')) {
      const key = name.split('.')[1] as 'linkedin' | 'twitter' | 'github';
      setFormData((prev) => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [key]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleExpertiseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      expertise: e.target.value.split(',').map((s) => s.trim()).filter(s => s !== ''), // Filter out empty strings
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) {
      setError('Cannot update profile: User ID is missing.');
      return;
    }
    setSubmitting(true);
    setError(null);
    setSuccessMessage(null);
    try {
      // Pastikan method ini ada dan sesuai di instructorAPI
      await instructorAPI.udateProfileInstructor(Number(id), formData);
      setSuccessMessage('Profile updated successfully!');
      navigate('/profile');
    } catch (err: any) {
      console.error('Error updating profile:', err);
      // Coba parse pesan error dari API jika ada
      const errorMessage = err.response?.data?.message || 'Failed to update profile. Please try again.';
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  // Render loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
        <p className="ml-4 text-blue-300 text-lg">Loading profile data...</p>
      </div>
    );
  }

  // Render error state
  if (error && !loading) { // Display error if not loading initially
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
        <div className="text-red-500 bg-red-900/20 p-6 rounded-lg border border-red-700 text-center">
          <p className="text-xl font-semibold mb-2">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    // Main container with dark background and light text
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-gray-800 rounded-lg shadow-xl p-8 border border-gray-700"> {/* Dark card background */}
        <h2 className="text-3xl font-bold text-white mb-8 text-center">Edit Instructor Profile</h2>

        {/* Success/Error messages */}
        {successMessage && (
          <div className="bg-green-900/20 text-green-400 p-4 rounded-md mb-6 border border-green-700 flex items-center">
            <FaCheckCircle className="mr-3 text-2xl" /> {successMessage}
          </div>
        )}
        {error && (
          <div className="bg-red-900/20 text-red-400 p-4 rounded-md mb-6 border border-red-700 flex items-center">
            <FaTimesCircle className="mr-3 text-2xl" /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section: Basic Info */}
          <div className="bg-gray-700 p-6 rounded-lg shadow-md border border-gray-600">
            <h3 className="text-xl font-semibold text-blue-400 mb-4 flex items-center border-b border-gray-600 pb-3">
              <FaUser className="mr-3" /> Basic Information
            </h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="bio" className="block text-gray-300 text-sm font-medium mb-2">Bio</label>
                <textarea
                  id="bio"
                  name="bio"
                  placeholder="Tell us about yourself..."
                  value={formData.bio}
                  onChange={handleChange}
                  rows={4}
                  className="w-full p-3 bg-gray-600 border border-gray-500 text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 transition duration-200"
                />
              </div>
              <div>
                <label htmlFor="phoneNumber" className="block text-gray-300 text-sm font-medium mb-2">Phone Number</label>
                <div className="flex items-center bg-gray-600 border border-gray-500 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 transition duration-200">
                  <FaPhone className="text-gray-400 ml-3 mr-2" />
                  <input
                    id="phoneNumber"
                    type="text"
                    name="phoneNumber"
                    placeholder="e.g., +628123456789"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="flex-1 p-3 bg-transparent text-gray-100 rounded-r-lg focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="profileImage" className="block text-gray-300 text-sm font-medium mb-2">Profile Image URL</label>
                <div className="flex items-center bg-gray-600 border border-gray-500 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 transition duration-200">
                  <FaImage className="text-gray-400 ml-3 mr-2" />
                  <input
                    id="profileImage"
                    type="text"
                    name="profileImage"
                    placeholder="https://example.com/your-image.jpg"
                    value={formData.profileImage}
                    onChange={handleChange}
                    className="flex-1 p-3 bg-transparent text-gray-100 rounded-r-lg focus:outline-none"
                  />
                </div>
                {formData.profileImage && (
                  <div className="mt-4 text-center">
                    <p className="text-gray-400 text-sm mb-2">Image Preview:</p>
                    <img src={formData.profileImage} alt="Profile Preview" className="w-24 h-24 object-cover rounded-full mx-auto border-2 border-gray-500" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section: Professional Information */}
          <div className="bg-gray-700 p-6 rounded-lg shadow-md border border-gray-600">
            <h3 className="text-xl font-semibold text-green-400 mb-4 flex items-center border-b border-gray-600 pb-3">
              <FaBriefcase className="mr-3" /> Professional Details
            </h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="expertise" className="block text-gray-300 text-sm font-medium mb-2">Expertise (comma-separated)</label>
                <div className="flex items-center bg-gray-600 border border-gray-500 rounded-lg focus-within:ring-2 focus-within:ring-green-500 transition duration-200">
                  <FaCodeBranch className="text-gray-400 ml-3 mr-2" />
                  <input
                    id="expertise"
                    type="text"
                    name="expertise"
                    placeholder="e.g., Web Development, UI/UX Design, Data Science"
                    value={formData.expertise.join(', ')}
                    onChange={handleExpertiseChange}
                    className="flex-1 p-3 bg-transparent text-gray-100 rounded-r-lg focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="experience" className="block text-gray-300 text-sm font-medium mb-2">Experience</label>
                <div className="flex items-center bg-gray-600 border border-gray-500 rounded-lg focus-within:ring-2 focus-within:ring-green-500 transition duration-200">
                  <FaBriefcase className="text-gray-400 ml-3 mr-2" />
                  <input
                    id="experience"
                    type="text"
                    name="experience"
                    placeholder="e.g., 5 years in software engineering"
                    value={formData.experience}
                    onChange={handleChange}
                    className="flex-1 p-3 bg-transparent text-gray-100 rounded-r-lg focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="education" className="block text-gray-300 text-sm font-medium mb-2">Education</label>
                <div className="flex items-center bg-gray-600 border border-gray-500 rounded-lg focus-within:ring-2 focus-within:ring-green-500 transition duration-200">
                  <FaBook className="text-gray-400 ml-3 mr-2" />
                  <input
                    id="education"
                    type="text"
                    name="education"
                    placeholder="e.g., Master's in Computer Science, University XYZ"
                    value={formData.education}
                    onChange={handleChange}
                    className="flex-1 p-3 bg-transparent text-gray-100 rounded-r-lg focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section: Social Links */}
          <div className="bg-gray-700 p-6 rounded-lg shadow-md border border-gray-600">
            <h3 className="text-xl font-semibold text-purple-400 mb-4 flex items-center border-b border-gray-600 pb-3">
              <FaLink className="mr-3" /> Social Links
            </h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="linkedin" className="block text-gray-300 text-sm font-medium mb-2">LinkedIn URL</label>
                <div className="flex items-center bg-gray-600 border border-gray-500 rounded-lg focus-within:ring-2 focus-within:ring-purple-500 transition duration-200">
                  <FaLinkedin className="text-gray-400 ml-3 mr-2" />
                  <input
                    id="linkedin"
                    type="text"
                    name="socialLinks.linkedin"
                    placeholder="https://linkedin.com/in/yourprofile"
                    value={formData.socialLinks.linkedin}
                    onChange={handleChange}
                    className="flex-1 p-3 bg-transparent text-gray-100 rounded-r-lg focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="twitter" className="block text-gray-300 text-sm font-medium mb-2">Twitter URL</label>
                <div className="flex items-center bg-gray-600 border border-gray-500 rounded-lg focus-within:ring-2 focus-within:ring-purple-500 transition duration-200">
                  <FaTwitter className="text-gray-400 ml-3 mr-2" />
                  <input
                    id="twitter"
                    type="text"
                    name="socialLinks.twitter"
                    placeholder="https://twitter.com/yourhandle"
                    value={formData.socialLinks.twitter}
                    onChange={handleChange}
                    className="flex-1 p-3 bg-transparent text-gray-100 rounded-r-lg focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="github" className="block text-gray-300 text-sm font-medium mb-2">GitHub URL</label>
                <div className="flex items-center bg-gray-600 border border-gray-500 rounded-lg focus-within:ring-2 focus-within:ring-purple-500 transition duration-200">
                  <FaGithub className="text-gray-400 ml-3 mr-2" />
                  <input
                    id="github"
                    type="text"
                    name="socialLinks.github"
                    placeholder="https://github.com/yourusername"
                    value={formData.socialLinks.github}
                    onChange={handleChange}
                    className="flex-1 p-3 bg-transparent text-gray-100 rounded-r-lg focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={submitting}
          >
            {submitting ? (
              <span className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                Updating...
              </span>
            ) : (
              <>
                <FaSave className="mr-3" /> Update Profile
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}