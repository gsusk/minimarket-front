import { AppBar, Toolbar, Typography, Stack, IconButton, Box, Badge } from '@mui/material';
import { Notifications, ShoppingCartOutlined, AccountCircle, Menu as MenuIcon } from '@mui/icons-material';
import Search from './Search';

function AppNavbar() {
  return (
    <Box sx={{ flexGrow: 1 }} >
      <AppBar position="sticky" elevation={0} sx={{ px: { xs: 1, sm: 2, md: 6 }, height: "4.5rem", pt: "0.5rem" }}>
        <Toolbar sx={{ justifyContent: 'space-between', gap: 2, alignItems: 'center', height: "4.5rem" }}>

          <Typography
            variant='h5'
            color='text.primary'
            sx={{ fontWeight: 800, cursor: 'pointer', pr: { xs: 1, sm: 2, md: 3 }, userSelect: 'none' }}
          >
            Mmark
          </Typography>

          <Box sx={{
            flexGrow: 1,
            display: 'flex',
            justifyContent: 'center',
            maxWidth: { xs: '100%', sm: '400px', md: '600px' }
          }}>
            <Search />
          </Box>

          <Stack direction="row" spacing={1} alignItems="center">

            <Stack
              direction="row"
              spacing={2}
              sx={{ display: { xs: "none", sm: "flex" }, pl: { xs: 1, sm: 2, md: 3 } }}
            >
              <IconButton >
                <Badge badgeContent={4} color="error">
                  <Notifications />
                </Badge>
              </IconButton>

              <IconButton >
                <Badge badgeContent={2} color="error">
                  <ShoppingCartOutlined />
                </Badge>
              </IconButton>

              <IconButton >
                <AccountCircle />
              </IconButton>
            </Stack>

            <IconButton
              sx={{ display: { xs: "flex", sm: "none" }, color: 'text.primary', pr: 1 }}
            >
              <MenuIcon />
            </IconButton>

          </Stack>

        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default AppNavbar