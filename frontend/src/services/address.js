import api from './api';

/**
 * Get current user's shipping addresses
 */
export const getMyAddresses = async () => {
  const response = await api.get('/addresses/my');
  return response.data;
};

/**
 * Add a new shipping address for current user
 */
export const createMyAddress = async (addressData) => {
  const response = await api.post('/addresses/my', addressData);
  return response.data;
};

/**
 * Update an existing address by ID
 */
export const updateAddress = async (id, addressData) => {
  const response = await api.put(`/addresses/${id}`, addressData);
  return response.data;
};

/**
 * Delete an address by ID
 */
export const deleteAddress = async (id) => {
  const response = await api.delete(`/addresses/${id}`);
  return response.data;
};
