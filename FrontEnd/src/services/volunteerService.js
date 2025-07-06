import { API_BASE_URLs, authAxios } from './apiConfig';

export const volunteerService = {

  // Register as volunteer
  registerVolunteer: async (volunteerData) => {
    const response = await authAxios.post(`${API_BASE_URLs.EVENT_SERVICE}/volunteers/register`, volunteerData);
    return response.data;
  },

  // Get volunteer profile by volunteer ID
  getVolunteerProfile: async (volunteerId) => {
    const response = await authAxios.get(`${API_BASE_URLs.EVENT_SERVICE}/volunteers/${volunteerId}`);
    return response.data;
  },

  // Update volunteer profile
  updateVolunteerProfile: async (profileData) => {
    const response = await authAxios.put(`${API_BASE_URLs.EVENT_SERVICE}/volunteers/me`, profileData);
    return response.data;
  },

  // Get volunteer teams (requires volunteerId as query parameter)
  getVolunteerTeams: async (volunteerId) => {
    const response = await authAxios.get(`${API_BASE_URLs.EVENT_SERVICE}/volunteers/me/teams?volunteerId=${volunteerId}`);
    return response.data;
  },


  // Get fund verifications assigned to volunteer (requires volunteerId as query parameter)
  getVolunteerFundVerifications: async (volunteerId) => {
    const response = await authAxios.get(`${API_BASE_URLs.EVENT_SERVICE}/volunteers/me/fund-verifications?volunteerId=${volunteerId}`);
    return response.data;
  },


  // Get specific fund verification details by verification ID
  getFundVerificationDetails: async (verificationId) => {
    const response = await authAxios.get(`${API_BASE_URLs.EVENT_SERVICE}/volunteers/me/fund-verifications/${verificationId}`);
    return response.data;
  },

  // Submit fund verification report
  submitFundVerificationReport: async (verificationId, reportData) => {
    const response = await authAxios.put(`${API_BASE_URLs.EVENT_SERVICE}/volunteers/me/fund-verifications/${verificationId}`, reportData);
    return response.data;
  },


  // Get volunteer ratings (requires volunteerId as query parameter)
  getVolunteerRatings: async (volunteerId) => {
    const response = await authAxios.get(`${API_BASE_URLs.EVENT_SERVICE}/volunteers/me/ratings?volunteerId=${volunteerId}`);
    return response.data;
  },


  // Get specific rating details by rating ID
  getRatingDetails: async (ratingId) => {
    const response = await authAxios.get(`${API_BASE_URLs.EVENT_SERVICE}/volunteers/me/ratings/${ratingId}`);
    return response.data;
  },


  // Admin endpoints for volunteer management
  // Get all volunteers (admin only)
  getAllVolunteersAdmin: async () => {
    const response = await authAxios.get(`${API_BASE_URLs.EVENT_SERVICE}/admin/volunteers`);
    return response.data;
  },

  // Get volunteer details by ID (admin only)
  getVolunteerByIdAdmin: async (volunteerId) => {
    const response = await authAxios.get(`${API_BASE_URLs.EVENT_SERVICE}/admin/volunteers/${volunteerId}`);
    return response.data;
  },

};
