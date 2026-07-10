import api from './api'

export async function getOrders() {
  const response = await api.get('/orders')
  return response.data
}

export async function getOrderById(id) {
  const response = await api.get(`/orders/${id}`)
  return response.data
}

export async function updateOrderStatus(id, status) {
  const response = await api.put(`/orders/${id}/status`, { status })
  return response.data
}
