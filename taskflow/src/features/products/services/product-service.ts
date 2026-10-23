import { apiClient } from '../../../shared/api/api-client'
import type { Product, ProductCreateInput } from '../types/product-types'

const PRODUCTS_ENDPOINT = '/products'

export const productService = {
  async getProducts(): Promise<Product[]> {
    return apiClient<Product[]>(PRODUCTS_ENDPOINT)
  },

  async getProduct(id: string): Promise<Product> {
    return apiClient<Product>(`${PRODUCTS_ENDPOINT}/${id}`)
  },

  async createProduct(input: ProductCreateInput): Promise<Product> {
    return apiClient<Product>(PRODUCTS_ENDPOINT, { method: 'POST', body: input })
  },

  async deleteProduct(id: string): Promise<void> {
    await apiClient<void>(`${PRODUCTS_ENDPOINT}/${id}`, { method: 'DELETE' })
  },
}
