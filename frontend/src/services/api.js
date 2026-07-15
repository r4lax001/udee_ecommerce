import axios from 'axios'

const api = axios.create({
<<<<<<< HEAD
  baseURL: 'http://localhost:5000/api',
=======
  baseURL: 'http://localhost:5001/api',
>>>>>>> auth-system
})

// แนบ JWT Token ทุก Request อัตโนมัติ
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api