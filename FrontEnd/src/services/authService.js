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
  getAllUsers: async () => {
    const response = await authAxios.get(`${API_BASE_URLs.USER_SERVICE}/admin/users`);
    return response.data;
  },

  // Get user by ID for admin
  getUserById: async (userId) => {
    const response = await authAxios.get(`${API_BASE_URLs.USER_SERVICE}/admin/users/${userId}`);
    return response.data;
  },
};
