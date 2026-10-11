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
} from "@mui/icons-material";
import { usePathname, useRouter } from "next/navigation";

const SIDEBAR_W = 248;

const NAV_ITEMS = [
  { label: "Dashboard", icon: DashboardOutlined, href: "/admin" },
  { label: "Productos", icon: StorefrontOutlined, href: "/admin/products" },
  { label: "Inventario", icon: InventoryOutlined, href: "/admin/inventory" },
  { label: "Órdenes", icon: ShoppingCartOutlined, href: "/admin/orders" },
  { label: "Categorías", icon: CategoryOutlined, href: "/admin/categories" },
];

const INK = "#14211c";
const SIDEBAR_BG = "#10251f";

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
        bgcolor: SIDEBAR_BG,
        color: "white",
        userSelect: "none",
        backgroundImage:
          "linear-gradient(180deg, rgba(20,91,70,0.5), rgba(16,37,31,0) 34%), radial-gradient(circle at 20% 10%, rgba(255,255,255,0.08), transparent 28%)",
      }}
    >
      <Box sx={{ px: 2.5, pt: 3, pb: 2.5 }}>
        <Stack direction="row" alignItems="center" gap={1.5}>
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: 2,
              display: "grid",
              placeItems: "center",
              bgcolor: "#f4b942",
              color: INK,
              fontWeight: 900,
              boxShadow: "0 12px 32px rgba(0,0,0,0.22)",
            }}
          >
            M
          </Box>
          <Box>
            <Typography
              variant="h6"
              fontWeight={900}
              letterSpacing={-0.4}
              sx={{ color: "white", lineHeight: 1 }}
            >
              Minimarket
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: "rgba(255,255,255,0.48)", fontSize: "0.72rem" }}
            >
              Administración
            </Typography>
          </Box>
        </Stack>
      </Box>

      <Box sx={{ px: 2.5, pb: 1 }}>
        <Typography
          variant="overline"
          sx={{ color: "rgba(255,255,255,0.36)", letterSpacing: 1.4, fontSize: "0.62rem", display: "block" }}
        >
          Operación
        </Typography>
      </Box>

      <Box sx={{ mx: 2.5, height: "1px", bgcolor: "rgba(255,255,255,0.08)", mb: 1 }} />

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
                py: 1.25,
                mb: 0.4,
                borderRadius: 2,
                cursor: "pointer",
                transition: "background 0.15s, transform 0.15s, color 0.15s",
                bgcolor: active ? "rgba(255,255,255,0.1)" : "transparent",
                border: "1px solid",
                borderColor: active ? "rgba(255,255,255,0.12)" : "transparent",
                "&:hover": {
                  bgcolor: active ? "rgba(255,255,255,0.14)" : "rgba(255,255,255,0.06)",
                  transform: "translateX(2px)",
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
                    bgcolor: "#f4b942",
                  }}
                />
              )}
              <Icon
                sx={{
                  fontSize: 18,
                  color: active ? "#f4b942" : "rgba(255,255,255,0.44)",
                  flexShrink: 0,
                  transition: "color 0.15s",
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  color: active ? "white" : "rgba(255,255,255,0.5)",
                  fontWeight: active ? 700 : 400,
                  fontSize: "0.86rem",
                  transition: "color 0.15s",
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
          mb: 1.5,
          p: 1.5,
          borderRadius: 2,
          bgcolor: "rgba(255,255,255,0.07)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.42)" }}>
          Gestión de catálogo, stock y pedidos en un solo lugar.
        </Typography>
      </Box>

      <Box sx={{ mx: 2.5, height: "1px", bgcolor: "rgba(255,255,255,0.08)" }} />
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
        bgcolor: SIDEBAR_BG,
        position: "sticky",
        top: 0,
        zIndex: 99,
        boxShadow: "0 10px 30px rgba(15,35,29,0.16)",
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
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "#f6f4ee",
        backgroundImage:
          "linear-gradient(180deg, rgba(244,185,66,0.13), rgba(246,244,238,0) 220px), radial-gradient(circle at 85% 0%, rgba(15,159,117,0.12), transparent 32%)",
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
