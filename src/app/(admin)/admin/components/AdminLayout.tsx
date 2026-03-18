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
  Tooltip,
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

const SIDEBAR_W = 220;

const NAV_ITEMS = [
  { label: "Dashboard", icon: DashboardOutlined, href: "/admin" },
  { label: "Productos", icon: StorefrontOutlined, href: "/admin/products" },
  { label: "Inventario", icon: InventoryOutlined, href: "/admin/inventory" },
  { label: "Ordenes", icon: ShoppingCartOutlined, href: "/admin/orders" },
  { label: "Categorias", icon: CategoryOutlined, href: "/admin/categories" },
];

const ACCENT = "#6366f1";

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();

  const go = (href: string) => { router.push(href); onNavigate?.(); };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        bgcolor: "#0e0e0e",
        color: "white",
        userSelect: "none",
      }}
    >
      <Box sx={{ px: 3, pt: 3.5, pb: 2.5 }}>
        <Typography
          variant="overline"
          sx={{ color: "rgba(255,255,255,0.3)", letterSpacing: 2, fontSize: "0.6rem", display: "block" }}
        >
          Panel de control
        </Typography>
        <Typography
          variant="h6"
          fontWeight={800}
          letterSpacing={-0.5}
          sx={{ color: "white", lineHeight: 1.2, mt: 0.25 }}
        >
          Minimarket
        </Typography>
      </Box>

      <Box sx={{ mx: 3, height: "1px", bgcolor: "rgba(255,255,255,0.07)", mb: 1 }} />

      <Box sx={{ flex: 1, px: 1.5, py: 1 }}>
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
                mb: 0.25,
                borderRadius: 1.5,
                cursor: "pointer",
                transition: "background 0.15s",
                bgcolor: active ? "rgba(99,102,241,0.15)" : "transparent",
                "&:hover": {
                  bgcolor: active ? "rgba(99,102,241,0.2)" : "rgba(255,255,255,0.05)",
                },
              }}
            >
              {active && (
                <Box
                  sx={{
                    position: "absolute",
                    left: 0,
                    top: "20%",
                    bottom: "20%",
                    width: 3,
                    borderRadius: 4,
                    bgcolor: ACCENT,
                  }}
                />
              )}
              <Icon
                sx={{
                  fontSize: 18,
                  color: active ? ACCENT : "rgba(255,255,255,0.4)",
                  flexShrink: 0,
                  transition: "color 0.15s",
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  color: active ? "white" : "rgba(255,255,255,0.5)",
                  fontWeight: active ? 700 : 400,
                  fontSize: "0.855rem",
                  transition: "color 0.15s",
                }}
              >
                {label}
              </Typography>
            </Box>
          );
        })}
      </Box>

      <Box sx={{ mx: 3, height: "1px", bgcolor: "rgba(255,255,255,0.07)" }} />
      <Box
        onClick={() => go("/")}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          px: 3,
          py: 2,
          cursor: "pointer",
          "&:hover .back-text": { color: "rgba(255,255,255,0.7)" },
          "&:hover .back-icon": { color: "rgba(255,255,255,0.5)" },
        }}
      >
        <ArrowBackOutlined className="back-icon" sx={{ fontSize: 15, color: "rgba(255,255,255,0.25)", transition: "color 0.15s" }} />
        <Typography
          className="back-text"
          variant="caption"
          sx={{ color: "rgba(255,255,255,0.3)", fontSize: "0.75rem", transition: "color 0.15s" }}
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
        py: 1.25,
        bgcolor: "#0e0e0e",
        position: "sticky",
        top: 0,
        zIndex: 99,
      }}
    >
      <IconButton onClick={onOpen} size="small" sx={{ color: "white", mr: 1.5 }}>
        <MenuIcon sx={{ fontSize: 20 }} />
      </IconButton>
      <Typography variant="subtitle2" fontWeight={800} sx={{ color: "white", letterSpacing: -0.3 }}>
        Minimarket
      </Typography>
    </Stack>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [open, setOpen] = useState(false);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f5f5f4" }}>
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
        <Box sx={{ position: "absolute", top: 8, right: 8, zIndex: 1 }}>
          <IconButton onClick={() => setOpen(false)} size="small" sx={{ color: "rgba(255,255,255,0.4)" }}>
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

        <Box sx={{ p: { xs: 2, md: 4 }, flex: 1 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
