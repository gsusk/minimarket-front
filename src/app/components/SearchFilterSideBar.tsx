import { Box, Checkbox, FormControlLabel, FormGroup, Slider, Stack, Typography, Link as MuiLink } from "@mui/material";
import { FacetValue, SearchResult } from "../api/products";
import Link from "next/link";

export default function SearchFilterSideBar({ facets, minPrice, maxPrice }: { facets: SearchResult["facets"], minPrice: number, maxPrice: number }) {
  const renderFacet = (title: string, key: string, open: boolean = true) => {
    const values = facets[key];
    if (!values || values.length === 0) return null;

    return (
      <Box mb={3} key={key}>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>{title}</Typography>
        <FormGroup>
          {values.map((facet: FacetValue) => (
            <Link
              key={facet.value}
              href={`/search?q=${getSearchParam('q')}&${key}=${facet.value}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <Box display="flex" justifyContent="space-between" alignItems="center" py={0.5}>
                <Typography variant="body2">{facet.value}</Typography>
                <Typography variant="caption" color="text.secondary">({facet.count})</Typography>
              </Box>
            </Link>
          ))}
        </FormGroup>
      </Box>
    )
  }

  return (
    <Stack>
      {renderFacet("Categorías", "category")}
      {renderFacet("Marcas", "brand")}
      {

        <Box>
          Precio
          <Stack direction={"row"} spacing={2}>{minPrice && <Box>${minPrice}</Box>}{minPrice && maxPrice && <Box>-</Box>}{maxPrice && <Box>${maxPrice}</Box>}</Stack>
          {!minPrice && !maxPrice && <Box>--</Box>}
          <Stack spacing={2}>
          </Stack>
        </Box>
      }
      {Object.keys(facets).map(key => {
        if (key !== 'category' && key !== 'brand') {
          return renderFacet(key.charAt(0).toUpperCase() + key.slice(1), key)
        }
        return null
      })}

    </Stack>
  )
}

function getSearchParam(key: string) {
  if (typeof window !== 'undefined') {
    return new URLSearchParams(window.location.search).get(key) || ''
  }
  return ''
}
