import api from './api'

/**
 * ดึงข้อมูล dashboard ทั้งหมดจาก backend
 * @returns {Promise<DashboardData>}
 */
export async function getDashboardStats() {
  const response = await api.get('/dashboard')
  return response.data
}
