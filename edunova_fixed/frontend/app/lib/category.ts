import axiosInstance from './axios';

export const categoryAPI = {
    // Create Category
    createCategory: (data: { name: string }) =>
        axiosInstance.post('/categories/create', data),

    // Get All Category
    getAllQuizzes: (params?: { page?: number; limit?: number; search?: string }) =>
        axiosInstance.get('/categories/', { params }),

    // Update Category by ID
    updateCategory: (id: number, data: { name: string }) =>
        axiosInstance.put(`/categories/update/${id}`, data),

    // Create Tags
    createTag: (data: { name: string }) =>
        axiosInstance.post('/tags/create', data),

    // Get All Tags
    getAllTags: (params?: { page?: number; limit?: number; search?: string }) =>
        axiosInstance.get('/tags/', { params }),
}