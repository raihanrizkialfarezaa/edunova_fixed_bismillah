import axiosInstance from './axios';

export const coursesAPI = {
    // Get All Courses
    getAllQuizzes: (params?: { page?: number; limit?: number; search?: string }) =>
        axiosInstance.get('/courses/', { params }),

    // Create Course Baru
    createCourse: (data: {
        title: string;
        description: string;
        price: number;
        thumbnail: string;
        categoryIds: number[];
        tagIds: number[];
    }) => axiosInstance.post('/courses/create', data),

    // Get Course By ID
    getCourseById: (id: number) => 
        axiosInstance.get(`/courses/${id}`),

    // Update Course By ID
    updateCourse: (id: number, data: {
        title: string;
        description: string;
        price: number;
        thumbnail: string;
        categoryIds: number[];
        tagIds: number[];
    }) => axiosInstance.put(`/courses/${id}`, data),

    // Delete Course By ID
    deleteCourse: (id: number) => 
        axiosInstance.delete(`/courses/${id}`),

    // Update Course Status
    updateCourseStatus: (id: number, status: string) => 
        axiosInstance.put(`/courses/${id}/status`, { status }),

    // Add Categories To Course
    addCategoriesToCourse: (id: number, categoryIds: number[]) => 
        axiosInstance.post(`/courses/${id}/categories`, { categoryIds }),
    
    // Add Tags To Course
    addTagsToCourse: (id: number, tagIds: number[]) => 
        axiosInstance.post(`/courses/${id}/tags`, { tagIds }),
};