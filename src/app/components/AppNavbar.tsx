"use client"
import { AppBar, Toolbar, Typography, Stack, IconButton, Box, Badge, useScrollTrigger } from '@mui/material';
import { Notifications, ShoppingCartOutlined, AccountCircle, Menu as MenuIcon } from '@mui/icons-material';
import Search from './Search';
import HideOnScroll from './HIdeOnScroll';

function AppNavbar() {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });
  return (
    <Box sx={{ flexGrow: 1 }} >
      <HideOnScroll>
        <AppBar position="fixed" elevation={trigger ? 4 : 0} sx={{
          px: { xs: 1, sm: 2, md: 6 }, height: "4.5rem", pt: "0.5rem",
          bgcolor: trigger ? 'rgba(255, 255, 255, 0.8)' : 'background.paper',
          backdropFilter: trigger ? 'blur(10px)' : 'none',
          transition: 'all 0.3s ease-in-out',
          borderBottom: trigger ? 'none' : '1px solid',
          borderColor: 'divider'
        }}>
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
      </HideOnScroll>
    </Box>
  );
}

export default AppNavbar