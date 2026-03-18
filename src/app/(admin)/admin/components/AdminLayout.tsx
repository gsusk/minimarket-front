"use client";

import { useState } from "react";
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  IconButton,
  Stack,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  DashboardOutlined,
  InventoryOutlined,
  ShoppingCartOutlined,
  CategoryOutlined,
  StorefrontOutlined,
  Menu as MenuIcon,
  ChevronLeft,
  KeyboardArrowLeft,
} from "@mui/icons-material";
import { usePathname, useRouter } from "next/navigation";

const SIDEBAR_W = 240;

const NAV_ITEMS = [
  { label: "Dashboard", icon: DashboardOutlined, href: "/admin" },
  { label: "Productos", icon: StorefrontOutlined, href: "/admin/products" },
  { label: "Inventario", icon: InventoryOutlined, href: "/admin/inventory" },
  { label: "Ordenes", icon: ShoppingCartOutlined, href: "/admin/orders" },
  { label: "Categorias", icon: CategoryOutlined, href: "/admin/categories" },
];

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();

  const go = (href: string) => {
    router.push(href);
    onNavigate?.();
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Box sx={{ px: 2.5, py: 3, borderBottom: "1px solid", borderColor: "grey.200" }}>
        <Typography variant="overline" color="text.disabled" letterSpacing={1.5} display="block" fontSize="0.65rem">
          Panel de control
        </Typography>
        <Typography variant="subtitle1" fontWeight={800} letterSpacing={-0.3}>
          Minimarket Admin
        </Typography>
      </Box>

      <List sx={{ px: 1, py: 1.5, flex: 1 }}>
        {NAV_ITEMS.map(({ label, icon: Icon, href }) => {
          const active = pathname === href || (href !== "/admin" && pathname.startsWith(href));
          return (
            <ListItemButton
              key={href}
              onClick={() => go(href)}
              selected={active}
              sx={{
                borderRadius: 1.5,
                mb: 0.25,
                px: 1.75,
                py: 1,
                "&.Mui-selected": {
                  bgcolor: "grey.900",
                  color: "white",
                  "& .MuiListItemIcon-root": { color: "white" },
                  "&:hover": { bgcolor: "grey.800" },
                },
                "&:hover:not(.Mui-selected)": { bgcolor: "grey.100" },
              }}
            >
              <ListItemIcon sx={{ minWidth: 36, color: active ? "white" : "text.secondary" }}>
                <Icon sx={{ fontSize: 18 }} />
              </ListItemIcon>
              <ListItemText
                primary={label}
                primaryTypographyProps={{ fontSize: "0.875rem", fontWeight: active ? 700 : 400 }}
              />
            </ListItemButton>
          );
        })}
      </List>

      <Divider />
      <Box sx={{ px: 2.5, py: 2 }}>
        <ListItemButton
          onClick={() => go("/")}
          sx={{ borderRadius: 1.5, px: 1.75, py: 0.75, "&:hover": { bgcolor: "grey.100" } }}
        >
          <ListItemIcon sx={{ minWidth: 36, color: "text.disabled" }}>
            <KeyboardArrowLeft sx={{ fontSize: 18 }} />
          </ListItemIcon>
          <ListItemText
            primary="Volver a la tienda"
            primaryTypographyProps={{ fontSize: "0.8rem", color: "text.secondary" }}
          />
        </ListItemButton>
      </Box>
    </Box>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "grey.50" }}>
      {!isMobile && (
        <Box
          sx={{
            width: SIDEBAR_W,
            flexShrink: 0,
            bgcolor: "background.paper",
            borderRight: "1px solid",
            borderColor: "grey.200",
            position: "fixed",
            top: 0,
            left: 0,
            height: "100vh",
            zIndex: 100,
          }}
        >
          <SidebarContent />
        </Box>
      )}

      {isMobile && (
        <Drawer
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          PaperProps={{ sx: { width: SIDEBAR_W } }}
        >
          <Box sx={{ display: "flex", justifyContent: "flex-end", p: 1 }}>
            <IconButton onClick={() => setMobileOpen(false)} size="small">
              <ChevronLeft />
            </IconButton>
          </Box>
          <SidebarContent onNavigate={() => setMobileOpen(false)} />
        </Drawer>
      )}

      <Box
        component="main"
        sx={{
          flex: 1,
          ml: { md: `${SIDEBAR_W}px` },
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {isMobile && (
          <Stack
            direction="row"
            alignItems="center"
            sx={{
              px: 2,
              py: 1.5,
              bgcolor: "background.paper",
              borderBottom: "1px solid",
              borderColor: "grey.200",
              position: "sticky",
              top: 0,
              zIndex: 99,
            }}
          >
            <IconButton onClick={() => setMobileOpen(true)} size="small" sx={{ mr: 1 }}>
              <MenuIcon />
            </IconButton>
            <Typography variant="subtitle2" fontWeight={700}>
              Minimarket Admin
            </Typography>
          </Stack>
        )}

        <Box sx={{ p: { xs: 2, md: 3 }, flex: 1 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
