"use client";

import { useState } from "react";
import {
  Box,
  Drawer,
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
  ArrowBackOutlined,
  Close,
  ShieldOutlined,
} from "@mui/icons-material";
import { usePathname, useRouter } from "next/navigation";

const SIDEBAR_W = 250;

const NAV_ITEMS = [
  { label: "Dashboard", icon: DashboardOutlined, href: "/admin" },
  { label: "Productos", icon: StorefrontOutlined, href: "/admin/products" },
  { label: "Inventario", icon: InventoryOutlined, href: "/admin/inventory" },
  { label: "Órdenes", icon: ShoppingCartOutlined, href: "/admin/orders" },
  { label: "Categorías", icon: CategoryOutlined, href: "/admin/categories" },
];

const SIDEBAR_BG = "#0f172a"; // color deeep slate
const ACCENT_COLOR = "#38bdf8"; // light sky blue pal contraste

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
        bgcolor: SIDEBAR_BG,
        color: "#f8fafc",
        userSelect: "none",
        borderRight: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      {/* Brand Header */}
      <Box sx={{ px: 2.5, pt: 3.5, pb: 2.5 }}>
        <Stack direction="row" alignItems="center" gap={1.5}>
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: 2,
              display: "grid",
              placeItems: "center",
              bgcolor: "primary.main",
              color: "white",
              fontWeight: 900,
              boxShadow: "0 4px 14px rgba(37,99,235,0.35)",
            }}
          >
            M
          </Box>
          <Box>
            <Typography
              variant="subtitle1"
              fontWeight={800}
              letterSpacing={-0.3}
              sx={{ color: "white", lineHeight: 1.1 }}
            >
              Minimarket
            </Typography>
            <Stack direction="row" alignItems="center" gap={0.5} mt={0.25}>
              <ShieldOutlined sx={{ fontSize: 12, color: "text.disabled" }} />
              <Typography
                variant="caption"
                sx={{ color: "rgba(255,255,255,0.45)", fontSize: "0.7rem", fontWeight: 500 }}
              >
                Panel Administrativo
              </Typography>
            </Stack>
          </Box>
        </Stack>
      </Box>

      <Box sx={{ px: 2.5, pb: 1, pt: 1 }}>
        <Typography
          variant="overline"
          sx={{
            color: "rgba(255,255,255,0.35)",
            letterSpacing: 1.2,
            fontSize: "0.62rem",
            fontWeight: 700,
            display: "block",
          }}
        >
          MÓDULOS DE GESTIÓN
        </Typography>
      </Box>

      <Box sx={{ flex: 1, px: 1.5, py: 0.5 }}>
        {NAV_ITEMS.map(({ label, icon: Icon, href }) => {
          const active = pathname === href || (href !== "/admin" && pathname.startsWith(href));
          return (
            <Box
              key={href}
              onClick={() => go(href)}
              sx={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                px: 1.75,
                py: 1.1,
                mb: 0.5,
                borderRadius: 1.5,
                cursor: "pointer",
                transition: "all 0.15s ease-in-out",
                bgcolor: active ? "rgba(255,255,255,0.08)" : "transparent",
                color: active ? "#ffffff" : "rgba(255,255,255,0.58)",
                border: "1px solid",
                borderColor: active ? "rgba(255,255,255,0.12)" : "transparent",
                "&:hover": {
                  bgcolor: active ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.04)",
                  color: "#ffffff",
                },
              }}
            >
              {active && (
                <Box
                  sx={{
                    position: "absolute",
                    left: 0,
                    top: "22%",
                    bottom: "22%",
                    width: 3,
                    borderRadius: 2,
                    bgcolor: ACCENT_COLOR,
                  }}
                />
              )}
              <Icon
                sx={{
                  fontSize: 19,
                  color: active ? ACCENT_COLOR : "rgba(255,255,255,0.45)",
                  flexShrink: 0,
                  transition: "color 0.15s",
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  fontWeight: active ? 600 : 400,
                  fontSize: "0.86rem",
                  letterSpacing: -0.1,
                }}
              >
                {label}
              </Typography>
            </Box>
          );
        })}
      </Box>

      <Box
        sx={{
          mx: 2,
          mb: 2,
          p: 1.75,
          borderRadius: 2,
          bgcolor: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.5)", display: "block", fontSize: "0.72rem", lineHeight: 1.4 }}>
          Sistema de gestión centralizada de catálogo, inventario y checkout.
        </Typography>
      </Box>

      <Box sx={{ height: "1px", bgcolor: "rgba(255,255,255,0.08)" }} />

      <Box
        onClick={() => go("/")}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.25,
          px: 2.5,
          py: 2,
          cursor: "pointer",
          transition: "background 0.15s",
          "&:hover": {
            bgcolor: "rgba(255,255,255,0.04)",
            "& .back-text": { color: "rgba(255,255,255,0.9)" },
            "& .back-icon": { color: "rgba(255,255,255,0.8)" },
          },
        }}
      >
        <ArrowBackOutlined
          className="back-icon"
          sx={{ fontSize: 16, color: "rgba(255,255,255,0.4)", transition: "color 0.15s" }}
        />
        <Typography
          className="back-text"
          variant="caption"
          sx={{ color: "rgba(255,255,255,0.45)", fontSize: "0.78rem", fontWeight: 500, transition: "color 0.15s" }}
        >
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
        bgcolor: SIDEBAR_BG,
        position: "sticky",
        top: 0,
        zIndex: 99,
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <IconButton onClick={onOpen} size="small" sx={{ color: "white", mr: 1.5 }}>
        <MenuIcon sx={{ fontSize: 20 }} />
      </IconButton>
      <Typography variant="subtitle2" fontWeight={800} sx={{ color: "white", letterSpacing: -0.3 }}>
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
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "#f8fafc",
      }}
    >
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
        <Box sx={{ position: "absolute", top: 12, right: 12, zIndex: 1 }}>
          <IconButton onClick={() => setOpen(false)} size="small" sx={{ color: "rgba(255,255,255,0.6)" }}>
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

        <Box sx={{ p: { xs: 2.5, md: 4, lg: 5 }, flex: 1, maxWidth: 1280, width: "100%", mx: "auto" }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
