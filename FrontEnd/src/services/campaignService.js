import axios from 'axios';
import { API_BASE_URLs, authAxios } from './apiConfig';

// Campaign related API calls
export const campaignService = {  // Get all campaigns for homepage
  getAllCampaigns: async () => {
    const url = `${API_BASE_URLs.DONATION_SERVICE}/campaigns`;
    console.log('🔗 Fetching campaigns from URL:', url);
    const response = await axios.get(url);
    console.log('📡 Raw API Response:', response);
    console.log('📊 Response Data:', response.data);
    return response.data;
  },

  // Get campaign categories
  getCampaignCategories: async () => {
    const response = await axios.get(`${API_BASE_URLs.DONATION_SERVICE}/campaigns/categories`);
    return response.data;
  },

  // Get campaigns by category
  getCampaignsByCategory: async (categoryId) => {
    const response = await axios.get(`${API_BASE_URLs.DONATION_SERVICE}/campaigns/categories/${categoryId}`);
    return response.data;
  },

  // Get campaign details
  getCampaignDetails: async (campaignId) => {
    const response = await axios.get(`${API_BASE_URLs.DONATION_SERVICE}/campaigns/${campaignId}`);
    return response.data;
  },

  // Request new campaign (authenticated)
  requestCampaign: async (campaignData) => {
    const response = await authAxios.post(`${API_BASE_URLs.DONATION_SERVICE}/campaigns/request`, campaignData);
    return response.data;
  },  // Get user's campaign requests (authenticated)
  getUserCampaignRequests: async (userId = null) => {
    try {
      if (!userId) {
        throw new Error('userId is required');
      }
      const url = `${API_BASE_URLs.DONATION_SERVICE}/campaigns/request/${userId}`;
      const response = await authAxios.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching campaign requests:', error);
      // Return empty result if endpoint doesn't exist yet
      if (error.response?.status === 400 || error.response?.status === 404) {
        return {
          status: 'success',
          data: []
        };
      }
      throw error;
    }
  },

  // Get specific campaign request by userId and requestId (authenticated)
  getUserCampaignRequest: async (userId, requestId) => {
    try {
      if (!userId || !requestId) {
        throw new Error('userId and requestId are required');
      }
      const url = `${API_BASE_URLs.DONATION_SERVICE}/campaigns/request/${userId}/${requestId}`;
      const response = await authAxios.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching specific campaign request:', error);
      throw error;
    }
  },

  // Get user donations to specific campaign
  getUserDonationsToCampaign: async (campaignId, userId) => {
    const response = await authAxios.get(`${API_BASE_URLs.DONATION_SERVICE}/campaigns/${campaignId}/donations?userId=${userId}`);
    return response.data;
  },

  // ===== ADMIN APIS =====
  
  // Get all campaign requests for admin review (authenticated admin only)
  getAllCampaignRequests: async () => {
    const response = await authAxios.get(`${API_BASE_URLs.DONATION_SERVICE}/admin/campaigns/requests`);
    return response.data;
  },

  // Approve campaign request (authenticated admin only)
  approveCampaignRequest: async (requestId) => {
    const response = await authAxios.put(`${API_BASE_URLs.DONATION_SERVICE}/admin/campaigns/requests/${requestId}/approve`);
    return response.data;
  },

  // Reject campaign request (authenticated admin only)
  rejectCampaignRequest: async (requestId, reason) => {
    const response = await authAxios.put(`${API_BASE_URLs.DONATION_SERVICE}/admin/campaigns/requests/${requestId}/reject`, {
      reason: reason
    });
    return response.data;
  },

  // Create campaign directly (authenticated admin only)
  createCampaign: async (campaignData) => {
    const response = await authAxios.post(`${API_BASE_URLs.DONATION_SERVICE}/admin/campaigns`, campaignData);
    return response.data;
  },

  // Update existing campaign (authenticated admin only)
  updateCampaign: async (campaignId, campaignData) => {
    const response = await authAxios.put(`${API_BASE_URLs.DONATION_SERVICE}/admin/campaigns/${campaignId}`, campaignData);
    return response.data;
  },

  // Delete campaign (authenticated admin only)
  deleteCampaign: async (campaignId) => {
    const response = await authAxios.delete(`${API_BASE_URLs.DONATION_SERVICE}/admin/campaigns/${campaignId}`);
    return response.data;
  },

  // Get campaign statistics for admin dashboard
  getCampaignStatistics: async () => {
    const response = await authAxios.get(`${API_BASE_URLs.DONATION_SERVICE}/admin/campaigns/statistics`);
    return response.data;
  },

  // Get all campaigns with admin details (including inactive/pending)
  getAllCampaignsAdmin: async () => {
    const response = await authAxios.get(`${API_BASE_URLs.DONATION_SERVICE}/admin/campaigns`);
    return response.data;
  },

  // Toggle campaign status (active/inactive)
  toggleCampaignStatus: async (campaignId) => {
    const response = await authAxios.patch(`${API_BASE_URLs.DONATION_SERVICE}/admin/campaigns/${campaignId}/toggle-status`);
    return response.data;
  }
};
