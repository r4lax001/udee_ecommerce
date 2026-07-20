import api from './api';

/**
 * Register a new customer
 */
export const register = async (name, email, password, phone, address) => {
  const response = await api.post('/auth/register', { name, email, password, phone, address });
  return response.data;
};

/**
 * Authenticate customer or admin
 */
export const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

/**
 * Verify OTP code
 */
export const verifyOtp = async (email, otpCode) => {
  const response = await api.post('/auth/verify-otp', { email, otpCode });
  return response.data;
};

/**
 * Resend a new OTP code to email
 */
export const resendOtp = async (email) => {
  const response = await api.post('/auth/resend-otp', { email });
  return response.data;
};

/**
 * Fetch current user profile (includes addresses)
 */
export const getMe = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

/**
 * Update current user's profile (name, phone)
 */
export const updateProfile = async (data) => {
  const response = await api.put('/auth/me/profile', data);
  return response.data;
};
