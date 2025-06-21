import axios from 'axios';
import { API_BASE_URLs, authAxios } from './apiConfig';

// Auth related API calls
export const authService = {
  // Register new user
  register: async (userData) => {
    const response = await axios.post(`${API_BASE_URLs.USER_SERVICE}/auth/register`, userData);
    return response.data;
  },

  // Login user
  login: async (credentials) => {
    const response = await axios.post(`${API_BASE_URLs.USER_SERVICE}/auth/login`, credentials);
    return response.data;
  },

  // Logout user
  logout: async (refreshToken) => {
    const response = await authAxios.post(`${API_BASE_URLs.USER_SERVICE}/auth/logout`, {
      refreshToken
    });
    return response.data;
  },

  // Get current user profile
  getProfile: async () => {
    const response = await authAxios.get(`${API_BASE_URLs.USER_SERVICE}/users/me`);
    return response.data;
  },

  // Update user profile
  updateProfile: async (profileData) => {
    const response = await authAxios.put(`${API_BASE_URLs.USER_SERVICE}/users/me`, profileData);
    return response.data;
  },

  // Update password
  updatePassword: async (passwordData) => {
    const response = await authAxios.patch(`${API_BASE_URLs.USER_SERVICE}/users/me/password`, passwordData);
    return response.data;
  },

  // ===== ADMIN APIS =====
  
  // Get all users for admin management (authenticated admin only)
  getAllUsers: async (page = 0, size = 20) => {
    const response = await authAxios.get(`${API_BASE_URLs.USER_SERVICE}/admin/users?page=${page}&size=${size}`);
    return response.data;
  },

  // Get user by ID for admin
  getUserById: async (userId) => {
    const response = await authAxios.get(`${API_BASE_URLs.USER_SERVICE}/admin/users/${userId}`);
    return response.data;
  },

  // Update user role (admin only)
  updateUserRole: async (userId, role) => {
    const response = await authAxios.patch(`${API_BASE_URLs.USER_SERVICE}/admin/users/${userId}/role`, {
      role: role
    });
    return response.data;
  },

  // Deactivate/activate user account (admin only)
  toggleUserStatus: async (userId) => {
    const response = await authAxios.patch(`${API_BASE_URLs.USER_SERVICE}/admin/users/${userId}/toggle-status`);
    return response.data;
  },

  // Get user statistics for admin dashboard
  getUserStatistics: async () => {
    const response = await authAxios.get(`${API_BASE_URLs.USER_SERVICE}/admin/users/statistics`);
    return response.data;
  },

  // Search users by email or name (admin only)
  searchUsers: async (searchTerm) => {
    const response = await authAxios.get(`${API_BASE_URLs.USER_SERVICE}/admin/users/search?q=${encodeURIComponent(searchTerm)}`);
    return response.data;
  },

  // Get users registered in date range (admin only)
  getUsersByDateRange: async (startDate, endDate) => {
    const response = await authAxios.get(`${API_BASE_URLs.USER_SERVICE}/admin/users/date-range?startDate=${startDate}&endDate=${endDate}`);
    return response.data;
  },

  // Export user data (admin only)
  exportUsers: async (format = 'csv') => {
    const response = await authAxios.get(`${API_BASE_URLs.USER_SERVICE}/admin/users/export`, {
      params: { format },
      responseType: 'blob'
    });
    return response.data;
  },

  // Delete user account (admin only)
  deleteUser: async (userId) => {
    const response = await authAxios.delete(`${API_BASE_URLs.USER_SERVICE}/admin/users/${userId}`);
    return response.data;
  }
};
