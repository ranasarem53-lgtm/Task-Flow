import { Button } from '../../../components/ui'
import { useProducts } from '../hooks/use-product'

export function ProductList() {
  const { products, isLoading, error, reload } = useProducts()

  if (isLoading) {
    return <p>Loading products...</p>
  }

  if (error) {
    return (
      <div>
        <p>{error}</p>
        <Button onClick={() => void reload()}>Retry</Button>
      </div>
    )
  }

  if (products.length === 0) {
    return <p>No products found.</p>
  }

  return (
    <ul>
      {products.map((product) => (
        <li key={product.id}>
          <strong>{product.name}</strong> - ${product.price}
          <p>{product.description}</p>
        </li>
      ))}
    </ul>
  )
}
