import Search from './Search'
import { AppBar, Box, IconButton, Stack, Toolbar, Typography } from '@mui/material'

function AppNavbar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar variant='regular'>
          <Stack direction={"row"} spacing={4}>
            <Typography variant='h3'>Mmark</Typography>
          </Stack>
          <Stack direction={"row"} spacing={4} sx={{ width: { sm: "13rem", md: "18rem", lg: "25rem", xl: "30rem" } }} >
            <Search></Search>
          </Stack>
          <Stack direction={"row"} flexGrow={1}></Stack>
          <Stack direction={"row"}>
            <IconButton></IconButton>
            <IconButton></IconButton>
            <IconButton></IconButton>
          </Stack>
        </Toolbar>
      </AppBar>
    </Box>
  )
}

export default AppNavbar