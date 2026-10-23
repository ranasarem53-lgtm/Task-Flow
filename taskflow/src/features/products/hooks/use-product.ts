import { useCallback, useEffect, useState } from 'react'
import { productService } from '../services/product-service'
import type { Product } from '../types/product-types'

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await productService.getProducts()
      setProducts(data)
    } catch {
      setError('Failed to load products')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  return { products, isLoading, error, reload: load }
}
