import { Box, Grid } from "@mui/material";
import SearchFilterSideBar from "../components/SearchFilterSideBar";

export default function Search() {
  return (
    <>
      <Grid py={4} px={5} height={"100vh"} container spacing={2}>
        <Grid size={3}>
          <SearchFilterSideBar></SearchFilterSideBar>
        </Grid>
        <Grid size={9}>sadasd</Grid>
      </Grid>
    </>
  )
}
