import axios from 'axios';
import { API_BASE_URLs, authAxios } from './apiConfig';

export const eventService = {

	// Get all events by campaign ID
	getEventsByCampaign: async (campaignId) => {
		const response = await authAxios.get(`${API_BASE_URLs.EVENT_SERVICE}/${campaignId}/events`);
		return response.data;
	},

	// Get specific event details by event ID
	getEventDetails: async (eventId) => {
		const response = await authAxios.get(`${API_BASE_URLs.EVENT_SERVICE}/events/${eventId}`);
		return response.data;
	},


	// Get event team details by event ID
	getEventTeam: async (eventId) => {
		const response = await authAxios.get(`${API_BASE_URLs.EVENT_SERVICE}/events/${eventId}/team`);
		return response.data;
	},


	// Submit event report by team leader
	submitEventReport: async (eventId, reportData) => {
		const response = await authAxios.post(`${API_BASE_URLs.EVENT_SERVICE}/events/${eventId}/team/leader/reports`, reportData);
		return response.data;
	},


	// Update event report by team leader
	updateEventReport: async (eventId, reportData) => {
		const response = await authAxios.put(`${API_BASE_URLs.EVENT_SERVICE}/events/${eventId}/team/leader/reports`, reportData);
		return response.data;
	},


	// Request additional resources by team leader
	requestAdditionalResources: async (eventId, requestData) => {
		const response = await authAxios.post(`${API_BASE_URLs.EVENT_SERVICE}/events/${eventId}/team/leader/resource-requests`, requestData);
		return response.data;
	},

	// Submit member ratings by team leader
	submitMemberRatings: async (eventId, ratingsData) => {
		const response = await authAxios.post(`${API_BASE_URLs.EVENT_SERVICE}/events/${eventId}/team/leader/member-ratings`, ratingsData);
		return response.data;
	},


	// Admin event management endpoints

	// Get all events for admin
	getAllEventsAdmin: async () => {
		const response = await authAxios.get(`${API_BASE_URLs.EVENT_SERVICE}/admin/events`);
		return response.data;
	},


	createEventForCampaign: async (campaignId, eventData) => {
		const response = await authAxios.post(`${API_BASE_URLs.EVENT_SERVICE}/admin/campaigns/${campaignId}/events`, eventData);
		return response.data;
	},

	// Get events for campaign (admin)
	getEventsForCampaignAdmin: async (campaignId) => {
		const response = await authAxios.get(`${API_BASE_URLs.EVENT_SERVICE}/admin/campaigns/${campaignId}/events`);
		return response.data;
	},


	// Get event details by ID (admin)
	getEventDetailsAdmin: async (eventId) => {
		const response = await authAxios.get(`${API_BASE_URLs.EVENT_SERVICE}/admin/events/${eventId}`);
		return response.data;
	},

	// Update event by ID (admin)
	updateEventAdmin: async (eventId, eventData) => {
		const response = await authAxios.put(`${API_BASE_URLs.EVENT_SERVICE}/admin/events/${eventId}`, eventData);
		return response.data;
	},

	// Update event status (admin)
	updateEventStatus: async (eventId, statusData) => {
		const response = await authAxios.patch(`${API_BASE_URLs.EVENT_SERVICE}/admin/events/${eventId}/status`, statusData);
		return response.data;
	},

	// Delete event by ID (admin)
	deleteEventAdmin: async (eventId) => {
		const response = await authAxios.delete(`${API_BASE_URLs.EVENT_SERVICE}/admin/events/${eventId}`);
		return response.data;
	},


	// Form team for event (admin)
	formTeamForEvent: async (eventId, teamData) => {
		const response = await authAxios.post(`${API_BASE_URLs.EVENT_SERVICE}/admin/events/${eventId}/team`, teamData);
		return response.data;
	},

	// Get team for event (admin)
	getEventTeamAdmin: async (eventId) => {
		const response = await authAxios.get(`${API_BASE_URLs.EVENT_SERVICE}/admin/events/${eventId}/team`);
		return response.data;
	},

	// Rate team leader (admin)
	rateTeamLeader: async (eventId, ratingsData) => {
		const response = await authAxios.post(`${API_BASE_URLs.EVENT_SERVICE}/admin/events/${eventId}/team/leader`, ratingsData);
		return response.data;
	}
	
};