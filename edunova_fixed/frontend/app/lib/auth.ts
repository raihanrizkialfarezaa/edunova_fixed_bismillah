import axiosInstance from './axios';

export const profileAPI = {
    // Get Users Profile
    getProfile: () =>
        axiosInstance.get('/auth/me'),

    // Update Password
    changePassword: (data: { oldPassword: string; newPassword: string }) =>
        axiosInstance.put('/auth/change-password', data),

}