import api from './api';

/**
 * Get dashboard statistics for admin overview
 */
export const getDashboardStats = async () => {
  const response = await api.get('/dashboard');
  return response.data;
};

/**
 * Get all users for admin review
 */
export const getUsers = async () => {
  const response = await api.get('/admin/users');
  return response.data;
};

/**
 * Update user status (isVerified, isSuspended)
 * @param {number} userId - ID of user to update
 * @param {object} statusData - { isVerified, isSuspended }
 */
export const updateUserStatus = async (userId, statusData) => {
  const response = await api.put(`/admin/users/${userId}/status`, statusData);
  return response.data;
};
