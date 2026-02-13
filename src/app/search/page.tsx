"use server"
import { Grid } from "@mui/material";
import SearchFilterSideBar from "../components/SearchFilterSideBar";
import ProductList from "../components/ProductList";
import { getProduct } from "../api/products";
import { redirect } from "next/navigation";

type searchParams = Promise<{
  q: string,
  min: string,
  max: string,
  category: string,
  brand: string,
  [x: string]: string
}>

export default async function Search({ searchParams }: { searchParams: searchParams }) {
  const filters = await searchParams

  if (!filters.q || filters.q.trim() == "") {
    redirect("/")
  }

  const searchResult = await getProduct(buildSearchTerm(filters));


  return (
    <>
      <Grid py={4} px={5} minHeight={"100vh"} container spacing={2}>
        <Grid size={3}>
          <SearchFilterSideBar facets={searchResult.facets} minPrice={searchResult.minPrice} maxPrice={searchResult.maxPrice}></SearchFilterSideBar>
        </Grid>
        <Grid size={9}>
          <ProductList products={searchResult.products} />
        </Grid>
      </Grid>
    </>
  )
}

function buildSearchTerm(params: Awaited<searchParams>): string {
  const search = new URL("http://localhost:8080")
  for (const [k, v] of Object.entries(params)) {
    if (k !== 'q' && k !== 'min' && k !== 'max' && k !== 'category' && k !== 'brand') {
      if (v) search.searchParams.append(k.trim(), v.trim())
    } else {
      if (v) search.searchParams.append(k.trim(), v.trim())
    }
  }

  return search.searchParams.toString()
}