import axiosInstance from './axios';

export const dashboardAPI = {
    // Get Dashboard Statistics
    getDashboard: () => 
        axiosInstance.get(`/admin/dashboard`),

    // Get Users Statistic
    getUser: (page = 1) =>
        axiosInstance.get(`/admin/users?page=${page}`),

    // Get Courses Statistic
    getCourses: (page = 1) =>
        axiosInstance.get('/admin/courses', { params: { page } }),

    // Get Instructor Requests
    getInstructorRequests: (page = 1) =>
        axiosInstance.get('/admin/instructor-requests', { params: { page, status: 'PENDING' } }),

};