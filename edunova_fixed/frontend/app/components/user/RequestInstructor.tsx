import { useState } from 'react';
import { instructorAPI } from '~/lib/instructor'; // pastikan path-nya sesuai
import {
  FaChalkboardTeacher, FaUser, FaCodeBranch, FaBriefcase, FaGraduationCap,
  FaLinkedin, FaTwitter, FaGithub, FaPhone, FaImage, FaPaperPlane, FaSpinner,
  FaCheckCircle, FaTimesCircle, FaLink // Menambahkan FaLink jika dibutuhkan untuk social links
} from 'react-icons/fa'; // Import ikon

export default function RequestInstructor() {
  const [formData, setFormData] = useState({
    bio: '',
    expertise: '',
    experience: '',
    education: '', // Akan diisi saat submit
    socialLinks: {
      linkedin: '',
      twitter: '',
      github: '',
    },
    phoneNumber: '',
    profileImage: '',
  });

  // Tambahan field untuk input pendidikan
  const [degree, setDegree] = useState('');
  const [faculty, setFaculty] = useState('');
  const [university, setUniversity] = useState('');
  const [graduationYear, setGraduationYear] = useState('');

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null); // Variabel tambahan untuk pesan sukses
  const [error, setError] = useState<string | null>(null);     // Variabel tambahan untuk pesan error

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name in formData.socialLinks) {
      setFormData((prev) => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [name]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null); // Reset pesan sukses
    setError(null);    // Reset pesan error

    const education = `${degree} ${faculty} ${university} ${graduationYear}`.trim();

    const requestBody = {
      ...formData,
      education,
      expertise: formData.expertise.split(',').map((skill) => skill.trim()),
    };

    try {
      await instructorAPI.requestInstructor(requestBody);
      setMessage('Request sent successfully!'); // Menggunakan variabel 'message'
      // Tidak mereset form agar sesuai dengan instruksi "jangan melakukan penambahan atau pengurangan pada variabel"
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send request.'); // Menggunakan variabel 'error'
    } finally {
      setLoading(false);
    }
  };

  return (
    // Main container with dark background and light text, centered
    <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center p-6">
      <div className="max-w-3xl w-full bg-gray-800 rounded-lg shadow-xl p-8 border border-gray-700"> {/* Dark card background */}
        <h1 className="text-3xl font-bold text-white mb-8 text-center flex items-center justify-center">
          <FaChalkboardTeacher className="mr-3 text-purple-400" /> Request to Become Instructor
        </h1>

        {/* Success/Error messages */}
        {message && (
          <div className="bg-green-900/20 text-green-400 p-4 rounded-md mb-6 border border-green-700 flex items-center">
            <FaCheckCircle className="mr-3 text-2xl" /> {message}
          </div>
        )}
        {error && (
          <div className="bg-red-900/20 text-red-400 p-4 rounded-md mb-6 border border-red-700 flex items-center">
            <FaTimesCircle className="mr-3 text-2xl" /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section: Personal Information */}
          <div className="bg-gray-700 p-6 rounded-lg shadow-md border border-gray-600">
            <h3 className="text-xl font-semibold text-blue-400 mb-4 flex items-center border-b border-gray-600 pb-3">
              <FaUser className="mr-3" /> Personal Information
            </h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="bio" className="block text-gray-300 text-sm font-medium mb-2">Bio <span className="text-red-400">*</span></label>
                <textarea
                  id="bio"
                  name="bio"
                  placeholder="Tell us about yourself and your passion for teaching..."
                  value={formData.bio}
                  onChange={handleChange}
                  required
                  rows={4} // Menambahkan baris untuk textarea
                  className="w-full p-3 bg-gray-600 border border-gray-500 text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 transition duration-200"
                />
              </div>
              <div>
                <label htmlFor="phoneNumber" className="block text-gray-300 text-sm font-medium mb-2">Phone Number <span className="text-red-400">*</span></label>
                <div className="flex items-center bg-gray-600 border border-gray-500 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 transition duration-200">
                  <FaPhone className="text-gray-400 ml-3 mr-2" />
                  <input
                    id="phoneNumber"
                    type="text"
                    name="phoneNumber"
                    placeholder="e.g., +628123456789"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                    className="flex-1 p-3 bg-transparent text-gray-100 rounded-r-lg focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="profileImage" className="block text-gray-300 text-sm font-medium mb-2">Profile Image URL <span className="text-red-400">*</span></label>
                <div className="flex items-center bg-gray-600 border border-gray-500 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 transition duration-200">
                  <FaImage className="text-gray-400 ml-3 mr-2" />
                  <input
                    id="profileImage"
                    type="text"
                    name="profileImage"
                    placeholder="https://example.com/your-profile-image.jpg"
                    value={formData.profileImage}
                    onChange={handleChange}
                    required
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

          {/* Section: Professional Details */}
          <div className="bg-gray-700 p-6 rounded-lg shadow-md border border-gray-600">
            <h3 className="text-xl font-semibold text-green-400 mb-4 flex items-center border-b border-gray-600 pb-3">
              <FaBriefcase className="mr-3" /> Professional Details
            </h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="expertise" className="block text-gray-300 text-sm font-medium mb-2">Expertise (comma-separated) <span className="text-red-400">*</span></label>
                <div className="flex items-center bg-gray-600 border border-gray-500 rounded-lg focus-within:ring-2 focus-within:ring-green-500 transition duration-200">
                  <FaCodeBranch className="text-gray-400 ml-3 mr-2" />
                  <input
                    id="expertise"
                    type="text"
                    name="expertise"
                    placeholder="e.g., Web Development, UI/UX Design, Data Science"
                    value={formData.expertise}
                    onChange={handleChange}
                    required
                    className="flex-1 p-3 bg-transparent text-gray-100 rounded-r-lg focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="experience" className="block text-gray-300 text-sm font-medium mb-2">Experience <span className="text-red-400">*</span></label>
                <div className="flex items-center bg-gray-600 border border-gray-500 rounded-lg focus-within:ring-2 focus-within:ring-green-500 transition duration-200">
                  <FaBriefcase className="text-gray-400 ml-3 mr-2" />
                  <input
                    id="experience"
                    type="text"
                    name="experience"
                    placeholder="e.g., 5 years in software engineering"
                    value={formData.experience}
                    onChange={handleChange}
                    required
                    className="flex-1 p-3 bg-transparent text-gray-100 rounded-r-lg focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section: Education */}
          <div className="bg-gray-700 p-6 rounded-lg shadow-md border border-gray-600">
            <h3 className="text-xl font-semibold text-orange-400 mb-4 flex items-center border-b border-gray-600 pb-3">
              <FaGraduationCap className="mr-3" /> Education <span className="text-red-400">*</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="degree" className="block text-gray-300 text-sm font-medium mb-2">Degree</label>
                <select
                  id="degree"
                  value={degree}
                  onChange={(e) => setDegree(e.target.value)}
                  required
                  className="w-full p-3 bg-gray-600 border border-gray-500 text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-200 appearance-none" // appearance-none untuk custom arrow
                >
                  <option value="">Select Degree</option>
                  <option value="SMA">SMA</option>
                  <option value="Diploma">Diploma</option>
                  <option value="S1">S1 (Bachelor's)</option>
                  <option value="S2">S2 (Master's)</option>
                  <option value="S3">S3 (Doctorate)</option>
                </select>
              </div>
              <div>
                <label htmlFor="faculty" className="block text-gray-300 text-sm font-medium mb-2">Faculty/Major</label>
                <input
                  id="faculty"
                  type="text"
                  placeholder="e.g., Computer Science"
                  value={faculty}
                  onChange={(e) => setFaculty(e.target.value)}
                  required
                  className="w-full p-3 bg-gray-600 border border-gray-500 text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder-gray-400 transition duration-200"
                />
              </div>
              <div>
                <label htmlFor="university" className="block text-gray-300 text-sm font-medium mb-2">University Name</label>
                <input
                  id="university"
                  type="text"
                  placeholder="e.g., Harvard University"
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                  required
                  className="w-full p-3 bg-gray-600 border border-gray-500 text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder-gray-400 transition duration-200"
                />
              </div>
              <div>
                <label htmlFor="graduationYear" className="block text-gray-300 text-sm font-medium mb-2">Graduation Year</label>
                <input
                  id="graduationYear"
                  type="number" // Menggunakan type="number"
                  placeholder="e.g., 2025"
                  value={graduationYear}
                  onChange={(e) => setGraduationYear(e.target.value)}
                  required
                  className="w-full p-3 bg-gray-600 border border-gray-500 text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder-gray-400 transition duration-200"
                />
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
                    type="url" // Menggunakan type="url" untuk validasi yang lebih baik
                    name="linkedin"
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
                    type="url"
                    name="twitter"
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
                    type="url"
                    name="github"
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
            disabled={loading}
            className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center">
                <FaSpinner className="animate-spin mr-3" /> Submitting...
              </span>
            ) : (
              <>
                <FaPaperPlane className="mr-3" /> Submit Request
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

// import { useState } from 'react';
// import { instructorAPI } from '~/lib/instructor';

// export default function RequestInstructor() {
//   const [formData, setFormData] = useState({
//     bio: '',
//     expertise: '',
//     experience: '',
//     education: '', // Akan diisi saat submit
//     socialLinks: {
//       linkedin: '',
//       twitter: '',
//       github: '',
//     },
//     phoneNumber: '',
//     profileImage: '',
//   });

//   // Tambahan field untuk input pendidikan
//   const [degree, setDegree] = useState('');
//   const [faculty, setFaculty] = useState('');
//   const [university, setUniversity] = useState('');
//   const [graduationYear, setGraduationYear] = useState('');

//   const [loading, setLoading] = useState(false);

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
//   ) => {
//     const { name, value } = e.target;

//     if (name in formData.socialLinks) {
//       setFormData((prev) => ({
//         ...prev,
//         socialLinks: {
//           ...prev.socialLinks,
//           [name]: value,
//         },
//       }));
//     } else {
//       setFormData((prev) => ({
//         ...prev,
//         [name]: value,
//       }));
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     const education = `${degree} ${faculty} ${university} ${graduationYear}`.trim();

//     const requestBody = {
//       ...formData,
//       education,
//       expertise: formData.expertise.split(',').map((skill) => skill.trim()),
//     };

//     try {
//       await instructorAPI.requestInstructor(requestBody);
//       alert('Request sent successfully!');
//     } catch (error) {
//       alert('Failed to send request.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-2xl mx-auto p-6 bg-gray-900 text-white rounded-lg">
//       <h2 className="text-2xl font-bold mb-4">Request to Become Instructor</h2>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <textarea
//           name="bio"
//           placeholder="Your bio"
//           value={formData.bio}
//           onChange={handleChange}
//           required
//           className="w-full p-2 rounded bg-gray-800"
//         />

//         <input
//           name="expertise"
//           placeholder="Expertise (comma separated)"
//           value={formData.expertise}
//           onChange={handleChange}
//           required
//           className="w-full p-2 rounded bg-gray-800"
//         />

//         <input
//           name="experience"
//           placeholder="Experience"
//           value={formData.experience}
//           onChange={handleChange}
//           required
//           className="w-full p-2 rounded bg-gray-800"
//         />

//         {/* Education dropdowns */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <select
//             value={degree}
//             onChange={(e) => setDegree(e.target.value)}
//             required
//             className="p-2 rounded bg-gray-800"
//           >
//             <option value="">Tingkat Pendidikan</option>
//             <option value="SMA">SMA</option>
//             <option value="Diploma">Diploma</option>
//             <option value="S1">S1</option>
//             <option value="S2">S2</option>
//             <option value="S3">S3</option>
//           </select>

//           <input
//             placeholder="Fakultas/Jurusan"
//             value={faculty}
//             onChange={(e) => setFaculty(e.target.value)}
//             required
//             className="p-2 rounded bg-gray-800"
//           />

//           <input
//             placeholder="Nama Kampus"
//             value={university}
//             onChange={(e) => setUniversity(e.target.value)}
//             required
//             className="p-2 rounded bg-gray-800"
//           />

//           <input
//             placeholder="Tahun Lulus (e.g., 2025)"
//             type="number"
//             value={graduationYear}
//             onChange={(e) => setGraduationYear(e.target.value)}
//             required
//             className="p-2 rounded bg-gray-800"
//           />
//         </div>

//         {/* Sosial Media */}
//         <input
//           name="linkedin"
//           placeholder="LinkedIn URL"
//           value={formData.socialLinks.linkedin}
//           onChange={handleChange}
//           className="w-full p-2 rounded bg-gray-800"
//         />

//         <input
//           name="twitter"
//           placeholder="Twitter URL"
//           value={formData.socialLinks.twitter}
//           onChange={handleChange}
//           className="w-full p-2 rounded bg-gray-800"
//         />

//         <input
//           name="github"
//           placeholder="GitHub URL"
//           value={formData.socialLinks.github}
//           onChange={handleChange}
//           className="w-full p-2 rounded bg-gray-800"
//         />

//         <input
//           name="phoneNumber"
//           placeholder="Phone Number"
//           value={formData.phoneNumber}
//           onChange={handleChange}
//           required
//           className="w-full p-2 rounded bg-gray-800"
//         />

//         <input
//           name="profileImage"
//           placeholder="Profile Image URL"
//           value={formData.profileImage}
//           onChange={handleChange}
//           required
//           className="w-full p-2 rounded bg-gray-800"
//         />

//         <button
//           type="submit"
//           disabled={loading}
//           className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
//         >
//           {loading ? 'Submitting...' : 'Submit Request'}
//         </button>
//       </form>
//     </div>
//   );
// }


// import { useState } from 'react';
// import { profileAPI } from '../../lib/auth'; // Pastikan path sesuai
// import { toast } from 'react-toastify';

// export default function RequestInstructor() {
//   const [formData, setFormData] = useState({
//     bio: '',
//     expertise: '',
//     experience: '',
//     education: '',
//     socialLinks: {
//       linkedin: '',
//       twitter: '',
//       github: '',
//     },
//     phoneNumber: '',
//     profileImage: '',
//   });

//   const [loading, setLoading] = useState(false);

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = e.target;

//     if (name in formData.socialLinks) {
//       setFormData((prev) => ({
//         ...prev,
//         socialLinks: {
//           ...prev.socialLinks,
//           [name]: value,
//         },
//       }));
//     } else {
//       setFormData((prev) => ({
//         ...prev,
//         [name]: value,
//       }));
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     const requestBody = {
//       ...formData,
//       expertise: formData.expertise.split(',').map((skill) => skill.trim()),
//     };

//     try {
//       await profileAPI.requestInstructor(requestBody);
//       toast.success('Request sent successfully!');
//     } catch (error) {
//       toast.error('Failed to send request.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-2xl mx-auto p-6 bg-gray-900 text-white rounded-lg">
//       <h2 className="text-2xl font-bold mb-4">Request to Become Instructor</h2>
//       <form onSubmit={handleSubmit} className="space-y-4">

//         <textarea
//           name="bio"
//           placeholder="Your bio"
//           value={formData.bio}
//           onChange={handleChange}
//           required
//           className="w-full p-2 rounded bg-gray-800"
//         />

//         <input
//           name="expertise"
//           placeholder="Expertise (comma separated)"
//           value={formData.expertise}
//           onChange={handleChange}
//           required
//           className="w-full p-2 rounded bg-gray-800"
//         />

//         <input
//           name="experience"
//           placeholder="Experience"
//           value={formData.experience}
//           onChange={handleChange}
//           required
//           className="w-full p-2 rounded bg-gray-800"
//         />

//         <input
//           name="education"
//           placeholder="Education"
//           value={formData.education}
//           onChange={handleChange}
//           required
//           className="w-full p-2 rounded bg-gray-800"
//         />

//         <input
//           name="linkedin"
//           placeholder="LinkedIn URL"
//           value={formData.socialLinks.linkedin}
//           onChange={handleChange}
//           className="w-full p-2 rounded bg-gray-800"
//         />

//         <input
//           name="twitter"
//           placeholder="Twitter URL"
//           value={formData.socialLinks.twitter}
//           onChange={handleChange}
//           className="w-full p-2 rounded bg-gray-800"
//         />

//         <input
//           name="github"
//           placeholder="GitHub URL"
//           value={formData.socialLinks.github}
//           onChange={handleChange}
//           className="w-full p-2 rounded bg-gray-800"
//         />

//         <input
//           name="phoneNumber"
//           placeholder="Phone Number"
//           value={formData.phoneNumber}
//           onChange={handleChange}
//           required
//           className="w-full p-2 rounded bg-gray-800"
//         />

//         <input
//           name="profileImage"
//           placeholder="Profile Image URL"
//           value={formData.profileImage}
//           onChange={handleChange}
//           required
//           className="w-full p-2 rounded bg-gray-800"
//         />

//         <button
//           type="submit"
//           disabled={loading}
//           className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
//         >
//           {loading ? 'Submitting...' : 'Submit Request'}
//         </button>
//       </form>
//     </div>
//   );
// }
