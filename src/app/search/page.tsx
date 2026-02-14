"use server"
import { Grid, Box } from "@mui/material";
import ResponsiveFilterSidebar from "../components/FilterSidebar";
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
      <Grid py={4} px={{ xs: 2, sm: 3, md: 5 }} minHeight={"100vh"} container spacing={2}>
        <Grid size={{ xs: 0, lg: 2 }} sx={{ display: { xs: "none", lg: "block" } }}>
          <ResponsiveFilterSidebar
            facets={searchResult.facets}
            minPrice={searchResult.minPrice}
            maxPrice={searchResult.maxPrice}
            searchParams={filters}
          />
        </Grid>
        <Grid size={{ xs: 12, lg: 10 }}>
          <ProductList products={searchResult.products} />
        </Grid>
      </Grid>

      <Box sx={{ display: { xs: "block", lg: "none" } }}>
        <ResponsiveFilterSidebar
          facets={searchResult.facets}
          minPrice={searchResult.minPrice}
          maxPrice={searchResult.maxPrice}
          searchParams={filters}
        />
      </Box>
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