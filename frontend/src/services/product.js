import api from './api'

export async function getProducts() {
  const response = await api.get('/products')
  return response.data
}

export async function createProduct(formData) {
  const response = await api.post('/products', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response.data
}

export async function updateProduct(id, formData) {
  const response = await api.put(`/products/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response.data
}

export async function deleteProduct(id) {
  const response = await api.delete(`/products/${id}`)
  return response.data
}
