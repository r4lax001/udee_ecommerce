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

/**
 * Get analytics data (sales, orders, products reports)
 */
export const getAnalyticsData = async () => {
  const [salesRes, ordersRes, productsRes] = await Promise.all([
    api.get('/reports/sales?period=monthly'),
    api.get('/reports/orders'),
    api.get('/reports/products'),
  ]);
  return {
    sales: salesRes.data,
    orders: ordersRes.data,
    products: productsRes.data,
  };
};

/**
 * Get all products for admin management
 */
export const getAdminProducts = async () => {
  const response = await api.get('/products');
  return response.data;
};

/**
 * Get all orders for admin management
 */
export const getAdminOrders = async () => {
  const response = await api.get('/orders');
  return response.data;
};

/**
 * Update order status
 * @param {number} orderId - ID of order
 * @param {string} status - New status (PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED)
 */
export const updateOrderStatus = async (orderId, status) => {
  const response = await api.put(`/orders/${orderId}/status`, { status });
  return response.data;
};
