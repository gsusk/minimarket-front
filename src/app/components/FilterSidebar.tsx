"use client"
import { useState } from "react";
import { Box, Drawer, Fab, Grid, useMediaQuery, useTheme } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchFilterSideBar from "./SearchFilterSideBar";
import { SearchResult } from "../api/products";

type ResponsiveFilterSidebarProps = {
  facets: SearchResult["facets"];
  minPrice: number;
  maxPrice: number;
  searchParams: Record<string, string>;
};

export default function FilterSidebar({
  facets,
  minPrice,
  maxPrice,
  searchParams,
}: ResponsiveFilterSidebarProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));

  const toggleDrawer = (open: boolean) => () => {
    setDrawerOpen(open);
  };

  if (isDesktop) {
    return (
      <Grid size={{ xs: 0, lg: 2 }}>
        <SearchFilterSideBar
          facets={facets}
          minPrice={minPrice}
          maxPrice={maxPrice}
          searchParams={searchParams}
        />
      </Grid>
    );
  }

  return (
    <>
      <Fab
        color="primary"
        aria-label="filters"
        onClick={toggleDrawer(true)}
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
          zIndex: 1000,
        }}
      >
        <FilterListIcon />
      </Fab>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        sx={{
          "& .MuiDrawer-paper": {
            width: { xs: "80%", sm: "400px" },
            maxWidth: "100%",
            p: 2,
          },
        }}
      >
        <SearchFilterSideBar
          facets={facets}
          minPrice={minPrice}
          maxPrice={maxPrice}
          searchParams={searchParams}
          onFilterClick={toggleDrawer(false)}
        />
      </Drawer>
    </>
  );
}
