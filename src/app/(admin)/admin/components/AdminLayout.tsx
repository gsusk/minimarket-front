"use client";

import { useState } from "react";
import {
  Box,
  Drawer,
  Typography,
  IconButton,
  Stack,
  Divider,
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
  ArrowBackOutlined,
  Close,
} from "@mui/icons-material";
import { usePathname, useRouter } from "next/navigation";

const SIDEBAR_W = 240;

const NAV_ITEMS = [
  { label: "Dashboard", icon: DashboardOutlined, href: "/admin" },
  { label: "Productos", icon: StorefrontOutlined, href: "/admin/products" },
  { label: "Inventario", icon: InventoryOutlined, href: "/admin/inventory" },
  { label: "Órdenes", icon: ShoppingCartOutlined, href: "/admin/orders" },
  { label: "Categorías", icon: CategoryOutlined, href: "/admin/categories" },
];

const C = {
  bg: "#111827",
  bgHover: "rgba(255,255,255,0.05)",
  bgActive: "rgba(255,255,255,0.08)",
  border: "rgba(255,255,255,0.07)",
  textMuted: "rgba(255,255,255,0.4)",
  textSub: "rgba(255,255,255,0.6)",
  textMain: "#f9fafb",
  accent: "#6366f1",
};

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();

  const go = (href: string) => {
    router.push(href);
    onNavigate?.();
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        bgcolor: C.bg,
        color: C.textMain,
        userSelect: "none",
        borderRight: `1px solid ${C.border}`,
      }}
    >
      <Box sx={{ px: 3, pt: 3.5, pb: 3 }}>
        <Stack direction="row" alignItems="center" gap={1.5}>
          <Box
            sx={{
              width: 34,
              height: 34,
              borderRadius: 1.5,
              bgcolor: C.accent,
              display: "grid",
              placeItems: "center",
              flexShrink: 0,
            }}
          >
            <Typography
              sx={{ fontSize: "0.85rem", fontWeight: 800, color: "white", lineHeight: 1 }}
            >
              M
            </Typography>
          </Box>
          <Box>
            <Typography
              sx={{ fontSize: "0.9rem", fontWeight: 700, color: C.textMain, lineHeight: 1 }}
            >
              Minimarket
            </Typography>
            <Typography
              sx={{ fontSize: "0.7rem", color: C.textMuted, mt: 0.25 }}
            >
              Panel administrativo
            </Typography>
          </Box>
        </Stack>
      </Box>

      <Divider sx={{ borderColor: C.border, mx: 2 }} />

      <Box sx={{ px: 3, pt: 2.5, pb: 1 }}>
        <Typography
          sx={{
            fontSize: "0.62rem",
            fontWeight: 700,
            letterSpacing: 1,
            textTransform: "uppercase",
            color: C.textMuted,
          }}
        >
          Gestión
        </Typography>
      </Box>

      <Box sx={{ flex: 1, px: 1.5, pb: 1 }}>
        {NAV_ITEMS.map(({ label, icon: Icon, href }) => {
          const active =
            pathname === href || (href !== "/admin" && pathname.startsWith(href));
          return (
            <Box
              key={href}
              onClick={() => go(href)}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                px: 1.75,
                py: 1,
                mb: 0.5,
                borderRadius: 1.5,
                cursor: "pointer",
                transition: "background 0.12s",
                bgcolor: active ? C.bgActive : "transparent",
                color: active ? C.textMain : C.textSub,
                "&:hover": {
                  bgcolor: active ? C.bgActive : C.bgHover,
                  color: C.textMain,
                },
              }}
            >
              <Icon
                sx={{
                  fontSize: 17,
                  color: active ? C.accent : "inherit",
                  flexShrink: 0,
                }}
              />
              <Typography
                sx={{
                  fontSize: "0.85rem",
                  fontWeight: active ? 600 : 400,
                }}
              >
                {label}
              </Typography>
            </Box>
          );
        })}
      </Box>

      <Divider sx={{ borderColor: C.border }} />
      <Box
        onClick={() => go("/")}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          px: 3,
          py: 2,
          cursor: "pointer",
          transition: "background 0.12s",
          "&:hover": { bgcolor: C.bgHover },
        }}
      >
        <ArrowBackOutlined sx={{ fontSize: 15, color: C.textMuted }} />
        <Typography sx={{ fontSize: "0.78rem", color: C.textMuted }}>
          Volver a la tienda
        </Typography>
      </Box>
    </Box>
  );
}

function MobileTopbar({ onOpen }: { onOpen: () => void }) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      sx={{
        px: 2,
        py: 1.5,
        bgcolor: C.bg,
        position: "sticky",
        top: 0,
        zIndex: 99,
        borderBottom: `1px solid ${C.border}`,
      }}
    >
      <IconButton onClick={onOpen} size="small" sx={{ color: "white", mr: 1.5 }}>
        <MenuIcon sx={{ fontSize: 20 }} />
      </IconButton>
      <Typography sx={{ fontSize: "0.9rem", fontWeight: 700, color: "white" }}>
        Minimarket Admin
      </Typography>
    </Stack>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [open, setOpen] = useState(false);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f8fafc" }}>
      {!isMobile && (
        <Box
          sx={{
            width: SIDEBAR_W,
            flexShrink: 0,
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

      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{ sx: { width: SIDEBAR_W, border: "none" } }}
      >
        <Box sx={{ position: "absolute", top: 10, right: 10, zIndex: 1 }}>
          <IconButton
            onClick={() => setOpen(false)}
            size="small"
            sx={{ color: "rgba(255,255,255,0.5)" }}
          >
            <Close sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>
        <SidebarContent onNavigate={() => setOpen(false)} />
      </Drawer>

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
        {isMobile && <MobileTopbar onOpen={() => setOpen(true)} />}
        <Box sx={{ p: { xs: 2.5, md: 3.5, lg: 4.5 }, flex: 1, maxWidth: 1280, width: "100%", mx: "auto" }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
