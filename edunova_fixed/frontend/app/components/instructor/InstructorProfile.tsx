import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { instructorAPI } from '~/lib/instructor';
import {
  FaLinkedin as LinkedInIcon,
  FaTwitter as TwitterIcon,
  FaGithub as GitHubIcon
} from 'react-icons/fa';

interface SocialLinks {
  linkedin?: string;
  twitter?: string;
  github?: string;
}

interface InstructorProfile {
  id: number;
  name: string;
  email: string;
  role: string;
  bio: string;
  expertise: string[];
  experience: string;
  education: string;
  socialLinks: SocialLinks;
  phoneNumber: string;
  profileImage: string;
  instructorStatus: string;
  instructorRequestedAt: string;
  instructorApprovedAt: string;
  createdAt: string;
  updatedAt: string;
}

export default function InstructorProfilePage() { // Renamed component to avoid conflict with interface
  const { id } = useParams<{ id: string }>();
  const [profile, setProfile] = useState<InstructorProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchProfile = async () => {
      try {
        const res = await instructorAPI.getProfileInstructor(Number(id));
        setProfile(res.data.user);
      } catch (error) {
        console.error('Failed to fetch instructor profile:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  if (loading) return <p className="text-center mt-10 text-gray-300">Loading profile...</p>;
  if (!profile) return <p className="text-center mt-10 text-gray-300">Profile not found.</p>;

  return (
    // Main container - Apply dark background, text color, and padding
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-gray-800 rounded-lg shadow-xl p-8 border border-gray-700"> {/* Dark card background with border and larger shadow */}
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 mb-10"> {/* Adjusted alignment and gap */}
          <img
            src={profile.profileImage}
            alt={profile.name}
            className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 shadow-md" // Increased size, accent border
          />
          <div className="space-y-2 text-center sm:text-left"> {/* Centered text on small screens, left-aligned on larger */}
            <h1 className="text-3xl font-bold text-white">{profile.name}</h1> {/* Pure white, larger font */}
            <p className="text-gray-400 text-md">{profile.email}</p> {/* Lighter gray, slightly larger */}
            <span className="inline-block px-4 py-1 bg-blue-600 text-white rounded-full text-sm font-semibold tracking-wide"> {/* Accent blue button style */}
              {profile.role}
            </span>
          </div>
        </div>

        {/* Profile Details */}
        <div className="space-y-8"> {/* Increased spacing between sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8"> {/* Increased gap */}
            {/* Left Column */}
            <div className="space-y-6"> {/* Increased spacing */}
              <div>
                <h2 className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-3 border-b border-gray-700 pb-2">About</h2> {/* Accent color for heading, subtle border */}
                <p className="text-gray-300 leading-relaxed">{profile.bio}</p> {/* Lighter gray, improved line height */}
              </div>

              <div>
                <h2 className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-3 border-b border-gray-700 pb-2">Expertise</h2>
                <div className="flex flex-wrap gap-3"> {/* Increased gap */}
                  {profile.expertise.map((skill, index) => (
                    <span key={index} className="px-4 py-1.5 bg-gray-700 text-blue-300 rounded-full text-sm font-medium transition-colors hover:bg-blue-800 hover:text-white"> {/* Styled skill tags */}
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6"> {/* Increased spacing */}
              <div>
                <h2 className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-3 border-b border-gray-700 pb-2">Experience</h2>
                <p className="text-gray-300 leading-relaxed">{profile.experience}</p>
              </div>

              <div>
                <h2 className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-3 border-b border-gray-700 pb-2">Education</h2>
                <p className="text-gray-300 leading-relaxed">{profile.education}</p>
              </div>

              <div>
                <h2 className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-3 border-b border-gray-700 pb-2">Contact</h2>
                <p className="text-gray-300 leading-relaxed">{profile.phoneNumber}</p>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div>
            <h2 className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-4 border-b border-gray-700 pb-2">Social Links</h2>
            <div className="flex flex-wrap gap-6"> {/* Increased gap */}
              {profile.socialLinks.linkedin && (
                <a
                  href={profile.socialLinks.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-blue-400 hover:text-blue-200 transition-colors text-lg" // Accent blue, larger text
                >
                  <LinkedInIcon className="w-6 h-6" /> {/* Larger icon */}
                  <span>LinkedIn</span>
                </a>
              )}
              {profile.socialLinks.twitter && (
                <a
                  href={profile.socialLinks.twitter}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-blue-300 hover:text-blue-100 transition-colors text-lg" // Different blue shade
                >
                  <TwitterIcon className="w-6 h-6" />
                  <span>Twitter</span>
                </a>
              )}
              {profile.socialLinks.github && (
                <a
                  href={profile.socialLinks.github}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors text-lg" // Darker gray, closer to white on hover
                >
                  <GitHubIcon className="w-6 h-6" />
                  <span>GitHub</span>
                </a>
              )}
            </div>
          </div>

          {/* Status Information */}
          <div className="border-t border-gray-700 pt-8"> {/* Thicker top border, more padding */}
            <h2 className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-4 border-b border-gray-700 pb-2">Activity Status</h2> {/* Changed heading, added border */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-base"> {/* Increased gap, larger text */}
              <div className="space-y-1">
                <p className="text-gray-500 text-sm">Status</p> {/* Smaller label text */}
                <p className="font-medium text-gray-200">{profile.instructorStatus}</p> {/* Lighter text */}
              </div>
              <div className="space-y-1">
                <p className="text-gray-500 text-sm">Requested At</p>
                <p className="font-medium text-gray-200">
                  {new Date(profile.instructorRequestedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} {/* Formatted date */}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-gray-500 text-sm">Approved At</p>
                <p className="font-medium text-gray-200">
                  {profile.instructorApprovedAt ? new Date(profile.instructorApprovedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Not yet approved'} {/* Formatted date, clearer "Not approved" */}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-gray-500 text-sm">Joined</p>
                <p className="font-medium text-gray-200">
                  {new Date(profile.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}