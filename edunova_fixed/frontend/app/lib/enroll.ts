import axiosInstance from './axios';

export const enrollAPI = {
    // Enroll Course
    enrollCourse: (id: number) => 
        axiosInstance.post(`/courses/${id}/enroll`)
};