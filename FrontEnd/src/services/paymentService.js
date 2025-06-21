import axios from 'axios';
import { API_BASE_URLs } from './apiConfig';

// Payment related API calls
export const paymentService = {
  // Initiate payment
  initiatePayment: async (paymentInitiateRequest) => {
    console.log('🚀 Calling payment initiate API:', paymentInitiateRequest);
    const response = await axios.post(`${API_BASE_URLs.DONATION_SERVICE}/payment/initiate`, paymentInitiateRequest);
    return response.data;
  },

  // Verify payment with OTP
  verifyPayment: async (paymentVerifyRequest) => {
    console.log('🔐 Calling payment verify API:', paymentVerifyRequest);
    const response = await axios.post(`${API_BASE_URLs.DONATION_SERVICE}/payment/verify`, paymentVerifyRequest);
    return response.data;
  },

  // Get payment status
  getPaymentStatus: async (paymentId) => {
    const response = await axios.get(`${API_BASE_URLs.DONATION_SERVICE}/payments/${paymentId}/status`);
    return response.data;
  },

  // Get payment history for user
  getPaymentHistory: async (userId) => {
    const response = await axios.get(`${API_BASE_URLs.DONATION_SERVICE}/payments/user/${userId}`);
    return response.data;
  },

  // Cancel payment
  cancelPayment: async (paymentId) => {
    const response = await axios.post(`${API_BASE_URLs.DONATION_SERVICE}/payments/${paymentId}/cancel`);
    return response.data;
  }
};
