"use client"
import { AppBar, Toolbar, Typography, Stack, IconButton, Box, Badge, Tooltip, Skeleton, Icon, } from '@mui/material';
import { Notifications, ShoppingCartOutlined, Menu as MenuIcon, AccountCircle } from '@mui/icons-material';
import LoginIcon from '@mui/icons-material/Login';
import Search from './Search';
import useMe from '../api/user';
import Link from 'next/link';

export default function AppNavbar() {
  const { data, isLoading } = useMe()

  return (
    <Box sx={{ flexGrow: 1 }} >
      <AppBar position="static" elevation={0} sx={{
        px: { xs: 1, sm: 2, md: 6 },
        bgcolor: 'background.paper',
        minHeight: "4.5rem",
        justifyContent: "center",
        borderBottom: { xs: "1px solid", sm: "5px solid" },
        borderColor: { xs: "divider", sm: "primary.main" }
      }}>
        <Toolbar sx={{ justifyContent: 'space-between', gap: 2, alignItems: 'center', minHeight: "4.5rem" }}>

          <Typography
            variant='h5'
            color='text.primary'
            sx={{ fontWeight: 800, cursor: 'pointer', pr: { xs: 1, sm: 2, md: 3 }, userSelect: 'none' }}
          >
            MMARK
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
              sx={{ display: { xs: "none", md: "flex" }, pl: { xs: 1, sm: 2, md: 3 } }}
            >
              <Stack direction="row" spacing={1} >
                <IconButton>
                  <Badge badgeContent={2} color="error">
                    <ShoppingCartOutlined />
                  </Badge>
                </IconButton>

                <IconButton>
                  <Badge badgeContent={4} color="error">
                    <Notifications />
                  </Badge>
                </IconButton>

                {
                  isLoading ? <Skeleton animation="wave" width={40} height={40} variant="circular"></Skeleton> :
                    data ?
                      <Tooltip title="PROFILE" followCursor>
                        <IconButton component={Link} href="/profile">
                          <AccountCircle />
                        </IconButton>
                      </Tooltip> :
                      <Tooltip title="INGRESAR" followCursor>
                        <IconButton component={Link} href="/login">
                          <LoginIcon />
                        </IconButton>
                      </Tooltip>
                }
              </Stack>
            </Stack>

            <IconButton
              sx={{ display: { xs: "flex", md: "none" }, color: 'text.primary', pr: 1 }}
            >
              <MenuIcon />
            </IconButton>

          </Stack>

        </Toolbar>
      </AppBar>
    </Box>
  );
}
