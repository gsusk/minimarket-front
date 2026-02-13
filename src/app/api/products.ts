import api from "./api"

export type Product = {
  id: number,
  name: string,
  category: string,
  price: number,
  brand: string,
  creationDate: string,
  images: string[]
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

export async function getProduct(searchTerms: string): Promise<SearchResult> {
  const response = await api.get<SearchResult>(`/search?${searchTerms}`)
  return response.data
}