import axiosInstance from './axios';

export const analyticsAPI = {
    // Courses Analytics
    getAnalytics: (id: number) => 
        axiosInstance.get(`/courses/${id}/analytics`),

    // Enrolment Analytics
    getCourseEnrollmentTrends: (id: number) => 
        axiosInstance.get(`/courses/${id}/analytics/enrollments`),

    // Revenue Analytics
    getCourseRevenue: (id: number) => 
        axiosInstance.get(`/courses/${id}/analytics/revenue`),
};