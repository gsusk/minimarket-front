"use server"
import { Grid, Box } from "@mui/material";
import ResponsiveFilterSidebar from "../components/FilterSidebar";
import ProductList from "../components/ProductList";
import { getProduct } from "../api/products";
import { redirect } from "next/navigation";

type searchParams = Promise<{
  q?: string | string[],
  min?: string | string[],
  max?: string | string[],
  category?: string | string[],
  brand?: string | string[],
  [x: string]: string | string[] | undefined
}>

export default async function Search({ searchParams }: { searchParams: searchParams }) {
  const params = await searchParams

  const filters = Object.fromEntries(
    Object.entries(params).map(([key, value]) => [
      key,
      Array.isArray(value) ? value[value.length - 1] : (value || "")
    ])
  ) as Record<string, string>;

  if (!filters.q || filters.q.trim() === "") {
    redirect("/")
  }

  const searchResult = await getProduct(buildSearchTerm(params));

  return (
    <>
      <Grid py={4} px={{ xs: 2, sm: 3, md: 5 }} minHeight={"100vh"} container spacing={2}>
        <ResponsiveFilterSidebar
          key={filters.q}
          facets={searchResult.facets}
          minPrice={searchResult.minPrice}
          maxPrice={searchResult.maxPrice}
          searchParams={filters}
        />
        <Grid size={{ xs: 12, lg: 10 }}>
          <ProductList products={searchResult.products} />
        </Grid>
      </Grid>
    </>
  )
}

function buildSearchTerm(params: Awaited<searchParams>): string {
  const searchParams = new URLSearchParams();

  for (const [k, v] of Object.entries(params)) {
    if (v && typeof v === "string") {
      const trimmedValue = v.trim();
      if (trimmedValue !== "") {
        searchParams.append(k.trim(), trimmedValue);
      }
    }
  }

  return searchParams.toString();
}