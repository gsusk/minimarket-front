"use client"
import { Box, Chip, Stack, Typography } from "@mui/material";
import { FacetValue, SearchResult } from "../api/products";
import Link from "next/link";
import PriceRangeSlider from "./PriceRangeSlider";

type SearchFilterSideBarProps = {
  facets: SearchResult["facets"];
  minPrice: number;
  maxPrice: number;
  searchParams: Record<string, string>;
};

export default function SearchFilterSideBar({
  facets,
  minPrice,
  maxPrice,
  searchParams
}: SearchFilterSideBarProps) {

  const buildFilterUrl = (filterKey: string, filterValue: string) => {
    const params = new URLSearchParams();
    Object.entries(searchParams).forEach(([key, value]) => {
      if (key !== filterKey) {
        params.append(key, value);
      }
    });

    if (searchParams[filterKey] === filterValue) {
    } else {
      params.append(filterKey, filterValue);
    }
    return `/search?${params.toString()}`;
  };

  const formatLabel = (key: string): string => {
    return key
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const isActiveFilter = (key: string, value: string): boolean => {
    return searchParams[key] === value;
  };

  const renderFacet = (title: string, key: string) => {
    const values = facets[key];
    if (!values || values.length === 0) return null;

    return (
      <Box mb={3} key={key}>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          {title}
        </Typography>
        <Stack spacing={0.5}>
          {values.map((facet: FacetValue) => {
            const isActive = isActiveFilter(key, facet.value);

            return (
              <Link
                key={facet.value}
                href={buildFilterUrl(key, facet.value)}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  py={0.5}
                  px={1}
                  sx={{
                    borderRadius: 1,
                    backgroundColor: isActive ? 'primary.main' : 'transparent',
                    color: isActive ? 'primary.contrastText' : 'inherit',
                    '&:hover': {
                      backgroundColor: isActive ? 'primary.dark' : 'action.hover',
                    },
                    transition: 'all 0.2s',
                  }}
                >
                  <Typography variant="body2" fontWeight={isActive ? 600 : 400}>
                    {facet.value}
                  </Typography>
                  <Typography
                    variant="caption"
                    color={isActive ? 'inherit' : 'text.secondary'}
                  >
                    ({facet.count})
                  </Typography>
                </Box>
              </Link>
            );
          })}
        </Stack>
      </Box>
    );
  };

  const dynamicFacetKeys = Object.keys(facets)
    .filter(key => key !== 'brand')
    .sort();

  return (
    <Stack>
      {renderFacet("Marca", "brand")}

      {(minPrice || maxPrice) && (
        <Box mb={3}>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Precio
          </Typography>
          {!minPrice && !maxPrice ? (
            <Typography variant="body2" color="text.secondary">--</Typography>
          ) : (
            <PriceRangeSlider min={minPrice} max={maxPrice} />
          )}
        </Box>
      )}

      {dynamicFacetKeys.map(key => renderFacet(formatLabel(key), key))}
    </Stack>
  );
}
