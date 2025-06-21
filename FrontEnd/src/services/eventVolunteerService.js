import { API_BASE_URLs, authAxios } from './apiConfig';

// Event and Volunteer related API calls
export const eventVolunteerService = {
  // Volunteer registration
  registerVolunteer: async (volunteerData) => {
    const response = await authAxios.post(`${API_BASE_URLs.EVENT_SERVICE}/v1/volunteers/register`, volunteerData);
    return response.data;
  },

  // Get volunteer profile
  getVolunteerProfile: async () => {
    const response = await authAxios.get(`${API_BASE_URLs.EVENT_SERVICE}/v1/volunteers/me`);
    return response.data;
  },

  // Update volunteer profile
  updateVolunteerProfile: async (profileData) => {
    const response = await authAxios.put(`${API_BASE_URLs.EVENT_SERVICE}/v1/volunteers/me`, profileData);
    return response.data;
  },

  // Get volunteer teams
  getVolunteerTeams: async () => {
    const response = await authAxios.get(`${API_BASE_URLs.EVENT_SERVICE}/v1/volunteers/me/teams`);
    return response.data;
  },

  // Get volunteer events
  getVolunteerEvents: async () => {
    const response = await authAxios.get(`${API_BASE_URLs.EVENT_SERVICE}/v1/volunteers/me/events`);
    return response.data;
  },

  // Get volunteer ratings
  getVolunteerRatings: async () => {
    const response = await authAxios.get(`${API_BASE_URLs.EVENT_SERVICE}/v1/volunteers/me/ratings`);
    return response.data;
  },

  // Fund application
  applyForFunds: async (fundData) => {
    const response = await authAxios.post(`${API_BASE_URLs.EVENT_SERVICE}/v1/funds/apply`, fundData);
    return response.data;
  },

  // Get user's fund applications
  getUserFundApplications: async () => {
    const response = await authAxios.get(`${API_BASE_URLs.EVENT_SERVICE}/v1/funds/me`);
    return response.data;
  },

  // Get specific fund application
  getFundApplication: async (applicationId) => {
    const response = await authAxios.get(`${API_BASE_URLs.EVENT_SERVICE}/v1/funds/me/${applicationId}`);
    return response.data;
  },

  // Get events by event ID
  getEventDetails: async (eventId) => {
    const response = await authAxios.get(`${API_BASE_URLs.EVENT_SERVICE}/events/${eventId}`);
    return response.data;
  },

  // Get events by campaign
  getEventsByCampaign: async (campaignId) => {
    const response = await authAxios.get(`${API_BASE_URLs.EVENT_SERVICE}/campaigns/${campaignId}/events`);
    return response.data;
  }
};
