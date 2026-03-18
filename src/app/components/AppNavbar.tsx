"use client";

import {
  AppBar,
  Toolbar,
  Typography,
  Stack,
  IconButton,
  Box,
  Badge,
  Tooltip,
  Skeleton,
  Button,
} from "@mui/material";
import {
  ShoppingCartOutlined,
  AccountCircleOutlined,
  LoginOutlined,
  AdminPanelSettingsOutlined,
} from "@mui/icons-material";
import Search from "./Search";
import useMe from "../api/user";
import Link from "next/link";
import CartDrawer from "./CartDrawer";
import { useCart } from "./CartProvider";

export default function AppNavbar() {
  const { data: user, isLoading } = useMe();
  const { itemCount, openCart } = useCart();

  const isAdmin = user?.role === "ADMIN";

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          px: { xs: 1.5, sm: 2, md: 6 },
          bgcolor: "background.paper",
          minHeight: "4.5rem",
          justifyContent: "center",
          borderBottom: { xs: "1px solid", sm: "4px solid" },
          borderColor: { xs: "divider", sm: "primary.main" },
        }}
      >
        <Toolbar
          sx={{
            justifyContent: "space-between",
            gap: 2,
            alignItems: "center",
            minHeight: "4.5rem",
            px: "0 !important",
          }}
        >
          <Link href="/" style={{ textDecoration: "none" }}>
            <Typography
              variant="h5"
              color="text.primary"
              sx={{ fontWeight: 900, userSelect: "none", letterSpacing: -0.5 }}
            >
              MMARK
            </Typography>
          </Link>

          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              justifyContent: "center",
              maxWidth: { xs: "100%", sm: "400px", md: "580px" },
            }}
          >
            <Search />
          </Box>

          <Stack direction="row" spacing={{ xs: 0.5, md: 1 }} alignItems="center">

            <IconButton onClick={openCart} aria-label="Carrito" sx={{ color: "text.primary" }}>
              <Badge
                badgeContent={itemCount && itemCount > 99 ? "99+" : itemCount}
                color="error"
              >
                <ShoppingCartOutlined />
              </Badge>
            </IconButton>

            {isAdmin && (
              <Tooltip title="Panel de administracion" enterDelay={400}>
                <IconButton
                  component={Link}
                  href="/admin"
                  aria-label="Panel admin"
                  sx={{
                    color: "text.primary",
                    display: { xs: "flex" },
                  }}
                >
                  <AdminPanelSettingsOutlined />
                </IconButton>
              </Tooltip>
            )}

            {isLoading ? (
              <Skeleton variant="circular" width={36} height={36} />
            ) : user ? (
              <Tooltip title="Mi perfil" enterDelay={400}>
                <IconButton
                  component={Link}
                  href="/profile"
                  aria-label="Perfil"
                  sx={{ color: "text.primary" }}
                >
                  <AccountCircleOutlined />
                </IconButton>
              </Tooltip>
            ) : (
              <>
                <Box sx={{ display: { xs: "none", sm: "block" } }}>
                  <Button
                    component={Link}
                    href="/login"
                    variant="outlined"
                    size="small"
                    sx={{
                      borderRadius: 2,
                      fontWeight: 700,
                      textTransform: "none",
                      borderColor: "grey.300",
                      color: "text.primary",
                      "&:hover": { borderColor: "text.primary", bgcolor: "transparent" },
                    }}
                  >
                    Ingresar
                  </Button>
                </Box>
                <Box sx={{ display: { xs: "flex", sm: "none" } }}>
                  <IconButton component={Link} href="/login" aria-label="Ingresar" sx={{ color: "text.primary" }}>
                    <LoginOutlined />
                  </IconButton>
                </Box>
              </>
            )}
          </Stack>
        </Toolbar>
      </AppBar>

      <CartDrawer />
    </Box>
  );
}
