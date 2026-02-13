import React from 'react'
import ProductCard from './ProductCard'
import { Grid } from '@mui/material'
import { Product } from '../api/products'

export default function ProductList({ products }: { products: Product[] }) {
  if (!products || products.length === 0) {
    return <div>No products found</div>
  }

  return (
    <Grid container spacing={2}>
      {products.map((product) => (
        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={product.id}>
          <ProductCard product={product} />
        </Grid>
      ))}
    </Grid>
  )
}
