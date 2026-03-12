import api from "./api"

export type Product = {
  id: number,
  name: string,
  slug: string,
  category: string,
  price: number,
  brand: string,
  creationDate: string,
  images: string[]
}

export type CategorySummary = {
  id: number,
  name: string,
  fullPath: string,
  parentName: string | null,
}

export type DetailedProduct = {
  id: number,
  name: string,
  slug: string,
  description: string,
  price: string,
  category: CategorySummary,
  brand: string,
  stock: number,
  images: string[],
  listedAt: string,
}

export type FacetValue = {
  count: number,
  value: string
}

export type SearchResult = {
  products: Product[],
  facets: Record<string, FacetValue[]>,
  minPrice: number,
  maxPrice: number,
  total: number
}

export async function getProductBySearch(searchTerms: string): Promise<SearchResult> {
  const response = await api.get<SearchResult>(`/search?${searchTerms}`)
  return response.data
}

export async function getFeaturedProducts(): Promise<DetailedProduct[]> {
  const response = await api.get<DetailedProduct[]>("/products/featured")
  return response.data
}

export async function getProductById(id: number): Promise<DetailedProduct> {
  const response = await api.get<DetailedProduct>(`/products/${id}`)
  return response.data
}