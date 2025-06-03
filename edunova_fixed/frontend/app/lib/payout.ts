import axiosInstance from './axios';

export const payoutAPI = {
    // Request Payout
    requestPayout: (payload: {
    courseId: number;
    amount: number;
    method: 'BANK_TRANSFER' | 'PAYPAL';
    description: string;
    }) => axiosInstance.post(`/payouts`, payload),

    // Get Payout Total
    getPayoutTotal: () => 
        axiosInstance.get(`/payouts/instructor/total-balance`),

    // Get Available Balance per Course
    getPayoutAvailableBalance: (courseId: number) => 
        axiosInstance.get(`/payouts/course/${courseId}/balance`),

    // Get Payout History
    getPayoutHistory: () => 
        axiosInstance.get(`/payouts/instructor/my-payouts`),

    // Get Payout History by ID
    getPayoutDetails: (id: number) => 
        axiosInstance.get(`/payouts/${id}`),

    // Get Payout Debug
    getPayoutDebug: () => 
        axiosInstance.get(`/payouts/debug/instructor-info`),

    // Get Pending Payout
    getPendingPayout: () => 
        axiosInstance.get(`/admin/payouts/pending`),

    // Update Pending Payout
    updatePendingPayout: (id: number, status: string, rejectionReason?: string) =>
    axiosInstance.put(`/payouts/${id}/status`, { status, ...(rejectionReason ? { rejectionReason } : {}) }),
}