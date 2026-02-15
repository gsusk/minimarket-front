"use client"
import { Box, Chip, Stack, Typography } from "@mui/material";
import { FacetValue, SearchResult } from "../api/products";
import { useRouter } from "next/navigation";
import PriceRangeSlider from "./PriceRangeSlider";

type SearchFilterSideBarProps = {
  facets: SearchResult["facets"];
  minPrice: number;
  maxPrice: number;
  searchParams: Record<string, string>;
  onFilterClick?: () => void;
};

export default function SearchFilterSideBar({
  facets,
  minPrice,
  maxPrice,
  searchParams,
  onFilterClick
}: SearchFilterSideBarProps) {
  const router = useRouter();

  const buildFilterUrl = (filterKey: string, filterValue: string) => {
    const params = new URLSearchParams(searchParams);

    if (isActiveFilter(filterKey, filterValue)) {
      params.delete(filterKey)
    } else {
      params.set(filterKey, filterValue);
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
    const param = searchParams[key];
    if (!param) return false;

    if (Array.isArray(param)) {
      return param.some(v => v.toLowerCase() === value?.toLowerCase());
    }

    return param.toLowerCase() === value?.toLowerCase();
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
            const filterUrl = buildFilterUrl(key, facet.value);

            const handleClick = () => {
              router.push(filterUrl);
              onFilterClick?.();
            };

            return (
              <Box
                key={facet.value}
                onClick={handleClick}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                py={0.5}
                px={1}
                sx={{
                  borderRadius: 1,
                  backgroundColor: isActive ? 'primary.main' : 'transparent',
                  color: isActive ? 'primary.contrastText' : 'inherit',
                  cursor: 'pointer',
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
    <Stack spacing={3}>
      {renderFacet("Marca", "brand")}

      {(minPrice || maxPrice) && (
        <Box mb={3}>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Precio
          </Typography>
          {!minPrice && !maxPrice ? (
            <Typography variant="body2" color="text.secondary">--</Typography>
          ) : (
            <Box width={"100%"} display={"flex"}>
              <PriceRangeSlider min={minPrice} max={maxPrice} />
            </Box>
          )}
        </Box>
      )}

      {dynamicFacetKeys.map(key => renderFacet(formatLabel(key), key))}
    </Stack>
  );
}
