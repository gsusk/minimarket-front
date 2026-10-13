"use client";

import {
  Box,
  Stack,
  Typography,
  Chip,
  Divider,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import {
  CheckCircleOutline,
  PendingOutlined,
  CancelOutlined,
  ArrowForwardOutlined,
  ReceiptLongOutlined,
  AccountBalanceWalletOutlined,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { adminGetAllOrders } from "../../api/admin";
import { toCurrency, toNumber, formatDate } from "../../utils/format";
import { OrderSummary } from "../../api/orders";

const STATUS_CONFIG: Record<
  string,
  { label: string; bg: string; text: string; dot: string }
> = {
  completed: { label: "Completada", bg: "#f0fdf4", text: "#15803d", dot: "#22c55e" },
  pending:   { label: "Pendiente",  bg: "#fefce8", text: "#a16207", dot: "#eab308" },
  cancelled: { label: "Cancelada",  bg: "#fef2f2", text: "#b91c1c", dot: "#ef4444" },
  processing:{ label: "En proceso", bg: "#eff6ff", text: "#1d4ed8", dot: "#3b82f6" },
};

function Val({ loading, children }: { loading: boolean; children: React.ReactNode }) {
  if (loading) return <Typography component="span" color="text.disabled">—</Typography>;
  return <>{children}</>;
}

function StatCard({
  title,
  value,
  description,
  badge,
  icon,
  iconBg,
  iconColor,
  loading,
}: {
  title: string;
  value: number;
  description: string;
  badge: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  loading: boolean;
}) {
  return (
    <Paper
      elevation={0}
      sx={{
        flex: 1,
        minWidth: 0,
        p: 2.5,
        borderRadius: 2,
        border: "1px solid #e5e7eb",
        bgcolor: "#ffffff",
        transition: "box-shadow 0.15s",
        "&:hover": { boxShadow: "0 4px 16px rgba(0,0,0,0.06)" },
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
        <Box
          sx={{
            width: 38,
            height: 38,
            borderRadius: 1.5,
            bgcolor: iconBg,
            color: iconColor,
            display: "grid",
            placeItems: "center",
          }}
        >
          {icon}
        </Box>
        <Typography
          sx={{
            fontSize: "0.68rem",
            fontWeight: 600,
            color: "#6b7280",
            bgcolor: "#f3f4f6",
            px: 1,
            py: 0.3,
            borderRadius: 1,
          }}
        >
          {badge}
        </Typography>
      </Stack>

      <Typography
        sx={{
          fontSize: "0.68rem",
          fontWeight: 700,
          color: "#9ca3af",
          textTransform: "uppercase",
          letterSpacing: 0.5,
        }}
      >
        {title}
      </Typography>

      <Typography
        sx={{ fontSize: "1.9rem", fontWeight: 800, color: "#111827", lineHeight: 1.15, mt: 0.5, mb: 0.5 }}
      >
        <Val loading={loading}>{value}</Val>
      </Typography>

      <Typography sx={{ fontSize: "0.78rem", color: "#9ca3af" }}>
        {description}
      </Typography>
    </Paper>
  );
}

function StatusBadge({ status }: { status: string }) {
  const key = status.toLowerCase();
  const cfg = STATUS_CONFIG[key] ?? {
    label: status,
    bg: "#f3f4f6",
    text: "#6b7280",
    dot: "#9ca3af",
  };
  return (
    <Stack
      direction="row"
      alignItems="center"
      gap={0.75}
      sx={{
        display: "inline-flex",
        px: 1.25,
        py: 0.35,
        borderRadius: 1,
        bgcolor: cfg.bg,
      }}
    >
      <Box sx={{ width: 5, height: 5, borderRadius: "50%", bgcolor: cfg.dot }} />
      <Typography sx={{ fontSize: "0.72rem", fontWeight: 600, color: cfg.text }}>
        {cfg.label}
      </Typography>
    </Stack>
  );
}

export default function AdminDashboard() {
  const router = useRouter();

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["admin", "orders"],
    queryFn: adminGetAllOrders,
  });

  const total     = orders.length;
  const completed = orders.filter((o) => o.status.toLowerCase() === "completed").length;
  const pending   = orders.filter((o) => o.status.toLowerCase() === "pending").length;
  const cancelled = orders.filter((o) => o.status.toLowerCase() === "cancelled").length;
  const revenue   = orders
    .filter((o) => o.status.toLowerCase() === "completed")
    .reduce((s, o) => s + toNumber(o.totalAmount), 0);

  const averageTicket  = completed > 0 ? revenue / completed : 0;
  const conversionRate = total > 0 ? ((completed / total) * 100).toFixed(1) : "0.0";
  const recentOrders   = [...orders].slice(0, 10);

  const formattedDate = new Date().toLocaleDateString("es-CO", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <Box>
      <Stack
        direction={{ xs: "column", md: "row" }}
        justifyContent="space-between"
        alignItems={{ md: "flex-end" }}
        mb={4}
        gap={2}
      >
        <Box>
          <Typography
            sx={{
              fontSize: "0.7rem",
              fontWeight: 700,
              color: "#6366f1",
              letterSpacing: 1,
              textTransform: "uppercase",
            }}
          >
            Panel de administración
          </Typography>
          <Typography sx={{ fontSize: "1.6rem", fontWeight: 800, color: "#111827", mt: 0.25, lineHeight: 1.2 }}>
            Dashboard
          </Typography>
          <Typography sx={{ fontSize: "0.85rem", color: "#6b7280", mt: 0.5 }}>
            {formattedDate}
          </Typography>
        </Box>

        <Button
          variant="contained"
          size="small"
          onClick={() => router.push("/admin/orders")}
          endIcon={<ArrowForwardOutlined sx={{ fontSize: 15 }} />}
          sx={{
            bgcolor: "#111827",
            color: "#fff",
            textTransform: "none",
            fontWeight: 600,
            fontSize: "0.82rem",
            borderRadius: 1.5,
            px: 2,
            boxShadow: "none",
            "&:hover": { bgcolor: "#1f2937", boxShadow: "none" },
          }}
        >
          Ver órdenes
        </Button>
      </Stack>

      <Stack direction={{ xs: "column", lg: "row" }} gap={2.5} mb={3}>
        <Paper
          elevation={0}
          sx={{
            flex: { xs: "none", lg: "0 0 40%" },
            p: 3,
            borderRadius: 2,
            bgcolor: "#111827",
            color: "#fff",
            border: "1px solid #1f2937",
          }}
        >
          <Stack direction="row" alignItems="center" gap={1} mb={3}>
            <AccountBalanceWalletOutlined sx={{ fontSize: 17, color: "#a5b4fc" }} />
            <Typography sx={{ fontSize: "0.7rem", fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 0.8 }}>
              Ingresos confirmados
            </Typography>
          </Stack>

          <Typography
            sx={{
              fontSize: { xs: "2.2rem", md: "2.8rem" },
              fontWeight: 800,
              letterSpacing: -1,
              lineHeight: 1,
              color: "#f9fafb",
            }}
          >
            <Val loading={isLoading}>${toCurrency(revenue)}</Val>
          </Typography>
          <Typography sx={{ fontSize: "0.78rem", color: "#6b7280", mt: 1 }}>
            Total de órdenes completadas
          </Typography>

          <Divider sx={{ borderColor: "rgba(255,255,255,0.08)", my: 2.5 }} />

          <Stack direction="row" justifyContent="space-between">
            <Box>
              <Typography sx={{ fontSize: "0.72rem", color: "#6b7280" }}>Ticket promedio</Typography>
              <Typography sx={{ fontWeight: 700, color: "#f9fafb", mt: 0.25 }}>
                <Val loading={isLoading}>${toCurrency(averageTicket)}</Val>
              </Typography>
            </Box>
            <Box>
              <Typography sx={{ fontSize: "0.72rem", color: "#6b7280" }}>Tasa de conversión</Typography>
              <Typography sx={{ fontWeight: 700, color: "#86efac", mt: 0.25 }}>
                <Val loading={isLoading}>{conversionRate}%</Val>
              </Typography>
            </Box>
            <Box>
              <Typography sx={{ fontSize: "0.72rem", color: "#6b7280" }}>Total órdenes</Typography>
              <Typography sx={{ fontWeight: 700, color: "#f9fafb", mt: 0.25 }}>
                <Val loading={isLoading}>{total}</Val>
              </Typography>
            </Box>
          </Stack>
        </Paper>

        <Stack direction={{ xs: "column", sm: "row" }} gap={2} flex={1}>
          <StatCard
            title="Completadas"
            value={completed}
            description="Pagadas y despachadas"
            badge="Éxito"
            icon={<CheckCircleOutline sx={{ fontSize: 20 }} />}
            iconBg="#f0fdf4"
            iconColor="#16a34a"
            loading={isLoading}
          />
          <StatCard
            title="Pendientes"
            value={pending}
            description="En espera de confirmación"
            badge="En curso"
            icon={<PendingOutlined sx={{ fontSize: 20 }} />}
            iconBg="#fefce8"
            iconColor="#ca8a04"
            loading={isLoading}
          />
          <StatCard
            title="Canceladas"
            value={cancelled}
            description="Expiradas o rechazadas"
            badge="Inactivas"
            icon={<CancelOutlined sx={{ fontSize: 20 }} />}
            iconBg="#fef2f2"
            iconColor="#dc2626"
            loading={isLoading}
          />
        </Stack>
      </Stack>

      <Paper
        elevation={0}
        sx={{
          borderRadius: 2,
          border: "1px solid #e5e7eb",
          bgcolor: "#fff",
          overflow: "hidden",
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ px: 3, py: 2, borderBottom: "1px solid #f3f4f6" }}
        >
          <Stack direction="row" alignItems="center" gap={1.5}>
            <ReceiptLongOutlined sx={{ fontSize: 18, color: "#9ca3af" }} />
            <Box>
              <Typography sx={{ fontSize: "0.9rem", fontWeight: 700, color: "#111827" }}>
                Órdenes recientes
              </Typography>
              <Typography sx={{ fontSize: "0.75rem", color: "#9ca3af" }}>
                Últimas {Math.min(recentOrders.length, 10)} transacciones
              </Typography>
            </Box>
          </Stack>

          <Button
            size="small"
            onClick={() => router.push("/admin/orders")}
            endIcon={<ArrowForwardOutlined sx={{ fontSize: 13 }} />}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              fontSize: "0.78rem",
              color: "#6366f1",
              "&:hover": { bgcolor: "#eef2ff" },
            }}
          >
            Ver todas
          </Button>
        </Stack>

        <TableContainer>
          <Table sx={{ minWidth: 650 }}>
            <TableHead sx={{ bgcolor: "#f9fafb" }}>
              <TableRow>
                {["Identificador", "Cliente", "Fecha", "Estado", "Total"].map((h, i) => (
                  <TableCell
                    key={h}
                    align={i === 4 ? "right" : "left"}
                    sx={{
                      color: "#6b7280",
                      fontWeight: 700,
                      fontSize: "0.68rem",
                      textTransform: "uppercase",
                      letterSpacing: 0.5,
                      py: 1.5,
                      pl: i === 0 ? 3 : undefined,
                      pr: i === 4 ? 3 : undefined,
                    }}
                  >
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} sx={{ py: 6, textAlign: "center", color: "#9ca3af", fontSize: "0.85rem" }}>
                    Cargando transacciones...
                  </TableCell>
                </TableRow>
              ) : recentOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} sx={{ py: 6, textAlign: "center", color: "#9ca3af", fontSize: "0.85rem" }}>
                    No hay transacciones recientes.
                  </TableCell>
                </TableRow>
              ) : (
                recentOrders.map((order) => (
                  <TableRow
                    key={order.orderId}
                    sx={{ "&:hover": { bgcolor: "#f9fafb" }, transition: "background 0.1s" }}
                  >
                    <TableCell sx={{ pl: 3, py: 1.75 }}>
                      <Typography sx={{ fontFamily: "monospace", fontWeight: 700, fontSize: "0.78rem", color: "#374151" }}>
                        #{order.orderId.split("-")[0].toUpperCase()}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 1.75 }}>
                      <Typography sx={{ fontSize: "0.84rem", fontWeight: 600, color: "#111827" }}>
                        {order.email}
                      </Typography>
                      <Typography sx={{ fontSize: "0.7rem", color: "#9ca3af" }}>
                        ID: {order.userId}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 1.75, fontSize: "0.82rem", color: "#6b7280" }}>
                      {formatDate(order.createdAt as unknown as string)}
                    </TableCell>
                    <TableCell sx={{ py: 1.75 }}>
                      <StatusBadge status={order.status} />
                    </TableCell>
                    <TableCell align="right" sx={{ pr: 3, py: 1.75 }}>
                      <Typography sx={{ fontSize: "0.84rem", fontWeight: 700, color: "#111827" }}>
                        ${toCurrency(toNumber(order.totalAmount))}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
