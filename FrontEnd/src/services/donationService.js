import axios from 'axios';
import { API_BASE_URLs, authAxios } from './apiConfig';

// Donation related API calls
export const donationService = {
  // Make anonymous donation
  makeAnonymousDonation: async (donationData) => {
    const response = await axios.post(`${API_BASE_URLs.DONATION_SERVICE}/donations/anonymous`, donationData);
    return response.data;
  },

  // Make authenticated donation
  makeDonation: async (donationData) => {
    const response = await authAxios.post(`${API_BASE_URLs.DONATION_SERVICE}/donations`, donationData);
    return response.data;
  },

  // Get anonymous donation by tracking key
  getAnonymousDonation: async (trackingKey) => {
    const response = await axios.get(`${API_BASE_URLs.DONATION_SERVICE}/donations/anonymous/${trackingKey}`);
    return response.data;
  },

  // Get user donations (authenticated)
  getUserDonations: async (userId) => {
    const response = await authAxios.get(`${API_BASE_URLs.DONATION_SERVICE}/donations?userId=${userId}`);
    return response.data;
  },

  // Get specific donation details
  getDonationDetails: async (donationId) => {
    const response = await authAxios.get(`${API_BASE_URLs.DONATION_SERVICE}/donations/${donationId}`);
    return response.data;
  },

  // Initiate payment
  initiatePayment: async (paymentData) => {
    const response = await authAxios.post(`${API_BASE_URLs.DONATION_SERVICE}/payment/initiate`, paymentData);
    return response.data;
  },

  // Verify payment
  verifyPayment: async (paymentData) => {
    const response = await authAxios.post(`${API_BASE_URLs.DONATION_SERVICE}/payment/verify`, paymentData);
    return response.data;
  },

  // ===== ADMIN APIS =====
  
  // Get all donations for admin dashboard (authenticated admin only)
  getAllDonations: async (page = 0, size = 20) => {
    const response = await authAxios.get(`${API_BASE_URLs.DONATION_SERVICE}/admin/donations?page=${page}&size=${size}`);
    return response.data;
  },

  // Get donation statistics for admin dashboard
  getDonationStatistics: async () => {
    const response = await authAxios.get(`${API_BASE_URLs.DONATION_SERVICE}/admin/donations/statistics`);
    return response.data;
  },

  // Get donations by campaign for admin
  getDonationsByCampaign: async (campaignId) => {
    const response = await authAxios.get(`${API_BASE_URLs.DONATION_SERVICE}/admin/campaigns/${campaignId}/donations`);
    return response.data;
  },

  // Get donations by date range for admin reports
  getDonationsByDateRange: async (startDate, endDate) => {
    const response = await authAxios.get(`${API_BASE_URLs.DONATION_SERVICE}/admin/donations/date-range?startDate=${startDate}&endDate=${endDate}`);
    return response.data;
  },

  // Update donation status (for payment verification)
  updateDonationStatus: async (donationId, status) => {
    const response = await authAxios.patch(`${API_BASE_URLs.DONATION_SERVICE}/admin/donations/${donationId}/status`, {
      status: status
    });
    return response.data;
  },

  // Get recent donations for admin dashboard
  getRecentDonations: async (limit = 10) => {
    const response = await authAxios.get(`${API_BASE_URLs.DONATION_SERVICE}/admin/donations/recent?limit=${limit}`);
    return response.data;
  },

  // Export donations data (CSV/Excel)
  exportDonations: async (format = 'csv', filters = {}) => {
    const response = await authAxios.get(`${API_BASE_URLs.DONATION_SERVICE}/admin/donations/export`, {
      params: { format, ...filters },
      responseType: 'blob'
    });
    return response.data;
  },

  // Get payment statistics for admin
  getPaymentStatistics: async () => {
    const response = await authAxios.get(`${API_BASE_URLs.DONATION_SERVICE}/admin/payments/statistics`);
    return response.data;
  }
};
