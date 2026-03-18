"use client";

import { Box, Stack, Typography, Chip, Divider } from "@mui/material";
import {
  TrendingUpOutlined,
  CheckCircleOutline,
  PendingOutlined,
  CancelOutlined,
  NorthEastOutlined,
} from "@mui/icons-material";
import { useQuery } from "@tanstack/react-query";
import { adminGetAllOrders } from "../../api/admin";
import { toCurrency, toNumber, formatDate } from "../../utils/format";
import { OrderSummary } from "../../api/orders";

const ACCENT = "#6366f1";

const STATUS_COLOR: Record<string, "default" | "warning" | "success" | "error" | "info"> = {
  completed: "success",
  pending: "warning",
  cancelled: "error",
  processing: "info",
};

const STATUS_LABEL: Record<string, string> = {
  completed: "Completada",
  pending: "Pendiente",
  cancelled: "Cancelada",
  processing: "En proceso",
};

function Val({ loading, children }: { loading: boolean; children: React.ReactNode }) {
  if (loading) return <Typography component="span" color="text.disabled">—</Typography>;
  return <>{children}</>;
}

function OrderRow({ order }: { order: OrderSummary }) {
  const status = order.status.toLowerCase();
  const dotColor =
    status === "completed" ? "#22c55e" :
      status === "cancelled" ? "#ef4444" : "#f59e0b";

  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      alignItems={{ sm: "center" }}
      justifyContent="space-between"
      gap={1}
      sx={{ py: 1.75 }}
    >
      <Stack direction="row" alignItems="center" gap={2}>
        <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: dotColor, flexShrink: 0 }} />
        <Box>
          <Typography variant="body2" fontWeight={700} fontFamily="monospace" fontSize="0.78rem" letterSpacing={0.5}>
            #{order.orderId.split("-")[0].toUpperCase()}
          </Typography>
          <Typography variant="caption" color="text.disabled">{order.email}</Typography>
        </Box>
      </Stack>
      <Stack direction="row" alignItems="center" gap={2} sx={{ flexShrink: 0 }}>
        <Typography variant="caption" color="text.disabled" sx={{ display: { xs: "none", sm: "block" } }}>
          {formatDate(order.createdAt as unknown as string)}
        </Typography>
        <Chip
          label={STATUS_LABEL[status] ?? order.status}
          color={STATUS_COLOR[status] ?? "default"}
          size="small"
          sx={{ fontWeight: 700, fontSize: "0.64rem", height: 19 }}
        />
        <Typography variant="body2" fontWeight={800} sx={{ minWidth: 70, textAlign: "right" }}>
          ${toCurrency(toNumber(order.totalAmount))}
        </Typography>
      </Stack>
    </Stack>
  );
}

function StatTile({
  label, value, sub, color, loading,
}: {
  label: string; value: number; sub: string; color: string; loading: boolean;
}) {
  return (
    <Box
      sx={{
        flex: 1,
        minWidth: 0,
        border: "1px solid",
        borderColor: "rgba(0,0,0,0.07)",
        borderRadius: 2.5,
        p: { xs: 2, md: 2.5 },
        bgcolor: "white",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0, right: 0,
          width: 60, height: 60,
          borderRadius: "0 0 0 100%",
          bgcolor: color,
          opacity: 0.08,
        }}
      />
      <Typography variant="caption" fontWeight={600} color="text.disabled" letterSpacing={0.8} sx={{ textTransform: "uppercase", fontSize: "0.62rem" }}>
        {label}
      </Typography>
      <Typography variant="h4" fontWeight={900} letterSpacing={-1.5} mt={0.5} lineHeight={1}>
        <Val loading={loading}>{value}</Val>
      </Typography>
      <Typography variant="caption" color="text.disabled" mt={0.5} display="block">{sub}</Typography>
    </Box>
  );
}

export default function AdminDashboard() {
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["admin", "orders"],
    queryFn: adminGetAllOrders,
  });

  const total = orders.length;
  const completed = orders.filter(o => o.status.toLowerCase() === "completed").length;
  const pending = orders.filter(o => o.status.toLowerCase() === "pending").length;
  const cancelled = orders.filter(o => o.status.toLowerCase() === "cancelled").length;
  const revenue = orders
    .filter(o => o.status.toLowerCase() === "completed")
    .reduce((s, o) => s + toNumber(o.totalAmount), 0);

  const conversionRate = total > 0 ? ((completed / total) * 100).toFixed(1) : "0.0";
  const recent = [...orders].slice(0, 10);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Buenos dias" : hour < 19 ? "Buenas tardes" : "Buenas noches";

  return (
    <Box sx={{ maxWidth: 1000, mx: "auto" }}>

      <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ sm: "flex-end" }} mb={5} gap={1}>
        <Box>
          <Typography variant="body2" color="text.disabled" fontWeight={500}>{greeting}</Typography>
          <Typography variant="h4" fontWeight={900} letterSpacing={-1.5} lineHeight={1.1} mt={0.5}>
            Panel de control
          </Typography>
        </Box>
        <Typography variant="caption" color="text.disabled" sx={{ fontVariantNumeric: "tabular-nums" }}>
          {new Date().toLocaleDateString("es-CO", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        </Typography>
      </Stack>

      <Stack direction={{ xs: "column", lg: "row" }} gap={2.5} mb={2.5}>
        <Box
          sx={{
            position: "relative",
            flexShrink: 0,
            width: { xs: "100%", lg: "55%" },
            borderRadius: 3,
            overflow: "hidden",
            bgcolor: "#0e0e0e",
            p: { xs: 3, md: 4.5 },
            color: "white",
            minHeight: 220,
          }}
        >
          <Box sx={{
            position: "absolute", inset: 0, pointerEvents: "none",
            backgroundImage: "radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }} />
          {/*brillo*/}
          <Box sx={{
            position: "absolute",
            bottom: -60, right: -40,
            width: 200, height: 200,
            borderRadius: "50%",
            bgcolor: ACCENT,
            filter: "blur(80px)",
            opacity: 0.25,
            pointerEvents: "none",
          }} />

          <Box sx={{ position: "relative", zIndex: 1 }}>
            <Stack direction="row" alignItems="center" gap={1} mb={4}>
              <TrendingUpOutlined sx={{ fontSize: 15, color: ACCENT }} />
              <Typography variant="caption" fontWeight={700} letterSpacing={1.5} sx={{ color: "rgba(255,255,255,0.45)", textTransform: "uppercase", fontSize: "0.62rem" }}>
                Ingresos confirmados
              </Typography>
            </Stack>

            <Typography
              sx={{
                fontWeight: 900,
                fontSize: { xs: "2.8rem", md: "3.8rem" },
                letterSpacing: -2,
                lineHeight: 1,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              <Val loading={isLoading}>${toCurrency(revenue)}</Val>
            </Typography>

            <Stack direction="row" alignItems="center" gap={1} mt={2}>
              <NorthEastOutlined sx={{ fontSize: 13, color: "#22c55e" }} />
              <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.35)", fontSize: "0.8rem" }}>
                <Val loading={isLoading}>
                  {conversionRate}% tasa de conversion · {total} {total === 1 ? "orden" : "ordenes"} en total
                </Val>
              </Typography>
            </Stack>
          </Box>
        </Box>

        <Stack flex={1} gap={2.5}>
          <Stack direction="row" gap={2.5} flex={1}>
            <StatTile label="Completadas" value={completed} sub="procesadas y pagadas" color="#22c55e" loading={isLoading} />
            <StatTile label="Pendientes" value={pending} sub="esperando confirmacion" color="#f59e0b" loading={isLoading} />
          </Stack>
          <Stack direction="row" gap={2.5} flex={1}>
            <StatTile label="Canceladas" value={cancelled} sub="sin procesar" color="#ef4444" loading={isLoading} />
            <Box
              sx={{
                flex: 1,
                minWidth: 0,
                border: "1px solid",
                borderColor: "rgba(0,0,0,0.07)",
                borderRadius: 2.5,
                p: 2.5,
                bgcolor: ACCENT,
                color: "white",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="caption" fontWeight={700} letterSpacing={0.8} sx={{ textTransform: "uppercase", fontSize: "0.62rem", opacity: 0.7 }}>
                Conversion
              </Typography>
              <Typography variant="h4" fontWeight={900} letterSpacing={-1.5} lineHeight={1}>
                <Val loading={isLoading}>{conversionRate}%</Val>
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.65 }}>completadas vs total</Typography>
            </Box>
          </Stack>
        </Stack>
      </Stack>
      <Box
        sx={{
          bgcolor: "white",
          border: "1px solid",
          borderColor: "rgba(0,0,0,0.07)",
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ px: 3, py: 2.25, borderBottom: "1px solid rgba(0,0,0,0.06)" }}
        >
          <Typography variant="subtitle2" fontWeight={800} letterSpacing={-0.3}>
            Actividad reciente
          </Typography>
          <Typography variant="caption" color="text.disabled">
            {Math.min(recent.length, 10)} mas recientes
          </Typography>
        </Stack>

        <Box sx={{ px: 3 }}>
          {isLoading ? (
            <Box py={5} textAlign="center">
              <Typography variant="body2" color="text.disabled">Cargando...</Typography>
            </Box>
          ) : recent.length === 0 ? (
            <Box py={5} textAlign="center">
              <Typography variant="body2" color="text.disabled">Sin actividad registrada.</Typography>
            </Box>
          ) : (
            recent.map((order, idx) => (
              <Box key={order.orderId}>
                <OrderRow order={order} />
                {idx < recent.length - 1 && <Divider sx={{ borderColor: "rgba(0,0,0,0.05)" }} />}
              </Box>
            ))
          )}
        </Box>
      </Box>
    </Box>
  );
}
