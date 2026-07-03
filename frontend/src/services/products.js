import api from './api'
import { productCards } from '../data/productListPageData'
import { productDetailPageData } from '../data/productDetailPageData'

const USE_MOCK = true

export async function getProducts() {
  if (!USE_MOCK) {
    const response = await api.get('/products')
    return response.data
  }

  return productCards
}

export async function getProductById(id) {
  if (!USE_MOCK) {
    const response = await api.get(`/products/${id}`)
    return response.data
  }

  const numericId = Number(id)
  const product = productCards.find((item) => item.id === numericId)
  if (product) {
    return product
  }

  return productDetailPageData.id === numericId ? productDetailPageData : null
}
