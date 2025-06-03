import axiosInstance from './axios';

export const instructorAPI = {

    // Request Instructor
    requestInstructor: (data: {
        bio: string;
        expertise: string[];
        experience: string;
        education: string;
        socialLinks: {
        linkedin?: string;
        twitter?: string;
        github?: string;
        };
        phoneNumber: string;
        profileImage: string;
    }) =>
    axiosInstance.post('/users/request-instructor', {
      ...data,
      socialLinks: {
        linkedin: data.socialLinks.linkedin || '',
        twitter: data.socialLinks.twitter || '',
        github: data.socialLinks.github || '',
      },
    }),

    // Process Instructor Request
    processInstructorRequest: (id: number, action: string, rejectionReason?: string) =>
        axiosInstance.put(`/admin/users/${id}/approve-instructor`, {
            action,
            ...(action === 'reject' && rejectionReason ? { rejectionReason } : {})
    }),

    // Get Profile Instructors
    getProfileInstructor: (id: number) =>  
        axiosInstance.get(`/users/${id}/instructor-profile`),
    
    // Update Profile Instructors
    udateProfileInstructor: (id: number, data: {
        bio: string;
        expertise: string[];
        experience: string;
        education: string;
        socialLinks: {
            linkedin?: string;
            twitter?: string;
            github?: string;
        };
        phoneNumber: string;
        profileImage: string;
    }) => axiosInstance.put(`/users/${id}/instructor-profile`, data),

    // instructorAPI.ts
    getAllInstructors: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    expertise?: string;
    }) => axiosInstance.get('/users/instructors', { params }),

    // Courses By Instructors
    getInstructorCourses: (
    id: number,
    params?: {
        page?: number;
        limit?: number;
        status?: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED'; // optional tergantung backend
    }
    ) => axiosInstance.get(`/users/instructors/${id}/courses`, { params }),

    // Get Instructor Stats (Admin Only)
    getInstructorStats: (id: number, startDate?: string, endDate?: string) =>
    axiosInstance.get(`/users/instructors/${id}/stats`, {
        params: {
        startDate,
        endDate
        }
    }),

};