import axios from 'axios';
import { API_BASE_URLs, authAxios } from './apiConfig';

export const fundApplicationService ={

	// Apply for funds by user
	applyForFunds: async (applicationData) => {
		const response = await authAxios.post(`${API_BASE_URLs.EVENT_SERVICE}/funds/apply`, applicationData);
		return response.data;
	},

	// Get all fund applications by user (requires externalUserId as query parameter)
	getUserFundApplications: async (externalUserId) => {
		const response = await authAxios.get(`${API_BASE_URLs.EVENT_SERVICE}/funds/${externalUserId}`);
		console.log("Message ",response.data.message);
		return response.data;
	},


	// Get specific fund application by application ID
	getFundApplication: async (applicationId) => {
		const response = await authAxios.get(`${API_BASE_URLs.EVENT_SERVICE}/funds/me/${applicationId}`);
		return response.data;
	},



	// Admin endpoints for fund management

	// Get all fund applications (admin)
	getAllFundApplicationsAdmin: async () => {
		const response = await authAxios.get(`${API_BASE_URLs.EVENT_SERVICE}/admin/funds`);
		return response.data;
	},


	// Get specific fund application by ID (admin)
	getFundApplicationAdmin: async (applicationId) => {
		const response = await authAxios.get(`${API_BASE_URLs.EVENT_SERVICE}/admin/funds/${applicationId}`);
		return response.data;
	},

	// Update fund verification status (admin)
	updateFundVerificationStatus: async (applicationId, statusData) => {
		const response = await authAxios.patch(`${API_BASE_URLs.EVENT_SERVICE}/admin/funds/${applicationId}/status`, statusData);
		return response.data;
	},

	// Assign volunteer for fund verification (admin)
	assignVolunteerForVerification: async (applicationId, volunteerData) => {
		const response = await authAxios.post(`${API_BASE_URLs.EVENT_SERVICE}/admin/funds/${applicationId}/volunteer-assign`, volunteerData);
		return response.data;
	}
};