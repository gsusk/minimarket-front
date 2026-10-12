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
  TrendingUpOutlined,
  CheckCircleOutline,
  PendingOutlined,
  CancelOutlined,
  ArrowForwardOutlined,
  ReceiptLongOutlined,
  AccountBalanceWalletOutlined,
  BoltOutlined,
  Circle,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { adminGetAllOrders } from "../../api/admin";
import { toCurrency, toNumber, formatDate } from "../../utils/format";
import { OrderSummary } from "../../api/orders";

const STATUS_CONFIG: Record<
  string,
  { label: string; bg: string; text: string; border: string; dot: string }
> = {
  completed: {
    label: "Completada",
    bg: "#ecfdf5",
    text: "#065f46",
    border: "#a7f3d0",
    dot: "#10b981",
  },
  pending: {
    label: "Pendiente",
    bg: "#fffbeb",
    text: "#92400e",
    border: "#fde68a",
    dot: "#f59e0b",
  },
  cancelled: {
    label: "Cancelada",
    bg: "#fff1f2",
    text: "#9f1239",
    border: "#fecdd3",
    dot: "#ef4444",
  },
  processing: {
    label: "En proceso",
    bg: "#eff6ff",
    text: "#1e40af",
    border: "#bfdbfe",
    dot: "#3b82f6",
  },
};

function Val({ loading, children }: { loading: boolean; children: React.ReactNode }) {
  if (loading) return <Typography component="span" color="text.disabled">—</Typography>;
  return <>{children}</>;
}

function StatCard({
  title,
  value,
  description,
  badgeText,
  icon,
  iconBg,
  iconColor,
  loading,
}: {
  title: string;
  value: number;
  description: string;
  badgeText: string;
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
        p: 3,
        borderRadius: 2.5,
        border: "1px solid",
        borderColor: "#e2e8f0",
        bgcolor: "#ffffff",
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          boxShadow: "0 10px 25px -5px rgba(15, 23, 42, 0.06)",
          borderColor: "#cbd5e1",
        },
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
        <Box
          sx={{
            width: 42,
            height: 42,
            borderRadius: 2,
            bgcolor: iconBg,
            color: iconColor,
            display: "grid",
            placeItems: "center",
          }}
        >
          {icon}
        </Box>
        <Chip
          label={badgeText}
          size="small"
          sx={{
            fontSize: "0.68rem",
            fontWeight: 600,
            bgcolor: "#f1f5f9",
            color: "#475569",
            borderRadius: 1.5,
          }}
        />
      </Stack>

      <Typography
        variant="caption"
        fontWeight={700}
        color="#64748b"
        letterSpacing={0.5}
        sx={{ textTransform: "uppercase", fontSize: "0.68rem" }}
      >
        {title}
      </Typography>

      <Typography
        variant="h4"
        fontWeight={800}
        letterSpacing={-1}
        mt={0.5}
        mb={0.5}
        color="#0f172a"
        lineHeight={1.1}
      >
        <Val loading={loading}>{value}</Val>
      </Typography>

      <Typography variant="caption" color="#94a3b8" display="block">
        {description}
      </Typography>
    </Paper>
  );
}

export default function AdminDashboard() {
  const router = useRouter();

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["admin", "orders"],
    queryFn: adminGetAllOrders,
  });

  const total = orders.length;
  const completed = orders.filter((o) => o.status.toLowerCase() === "completed").length;
  const pending = orders.filter((o) => o.status.toLowerCase() === "pending").length;
  const cancelled = orders.filter((o) => o.status.toLowerCase() === "cancelled").length;
  const revenue = orders
    .filter((o) => o.status.toLowerCase() === "completed")
    .reduce((s, o) => s + toNumber(o.totalAmount), 0);

  const averageTicket = completed > 0 ? revenue / completed : 0;
  const conversionRate = total > 0 ? ((completed / total) * 100).toFixed(1) : "0.0";
  const recentOrders = [...orders].slice(0, 10);

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
            variant="caption"
            fontWeight={700}
            color="primary.main"
            letterSpacing={1.2}
            sx={{ textTransform: "uppercase", fontSize: "0.7rem" }}
          >
            PANEL DE ADMINISTRACIÓN
          </Typography>
          <Typography
            variant="h4"
            fontWeight={900}
            letterSpacing={-1}
            color="#0f172a"
            mt={0.25}
          >
            Dashboard Operativo
          </Typography>
          <Typography variant="body2" color="#64748b" mt={0.5}>
            Métricas de ventas, estado transaccional y flujo de órdenes en tiempo real.
          </Typography>
        </Box>

        <Stack direction="row" alignItems="center" gap={1.5} flexWrap="wrap">
          <Chip
            icon={<Circle sx={{ fontSize: "8px !important", color: "#10b981 !important" }} />}
            label="Sistema Activo"
            size="small"
            sx={{
              bgcolor: "#ecfdf5",
              color: "#065f46",
              fontWeight: 600,
              fontSize: "0.72rem",
              borderRadius: 1.5,
              border: "1px solid #a7f3d0",
            }}
          />
          <Typography
            variant="caption"
            color="#64748b"
            sx={{ textTransform: "capitalize", fontWeight: 500 }}
          >
            {formattedDate}
          </Typography>
          <Button
            variant="contained"
            size="small"
            onClick={() => router.push("/admin/orders")}
            endIcon={<ArrowForwardOutlined sx={{ fontSize: 16 }} />}
            sx={{
              bgcolor: "#0f172a",
              color: "#ffffff",
              textTransform: "none",
              fontWeight: 600,
              borderRadius: 2,
              px: 2,
              py: 0.8,
              boxShadow: "none",
              "&:hover": { bgcolor: "#1e293b", boxShadow: "none" },
            }}
          >
            Ver Órdenes
          </Button>
        </Stack>
      </Stack>

      <Stack direction={{ xs: "column", lg: "row" }} gap={3} mb={3.5}>
        <Paper
          elevation={0}
          sx={{
            flex: { xs: "none", lg: "0 0 42%" },
            p: { xs: 3, md: 3.5 },
            borderRadius: 3,
            bgcolor: "#0f172a",
            color: "#ffffff",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 10px 30px -10px rgba(15, 23, 42, 0.4)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: -80,
              right: -80,
              width: 220,
              height: 220,
              borderRadius: "50%",
              bgcolor: "rgba(56, 189, 248, 0.12)",
              filter: "blur(60px)",
              pointerEvents: "none",
            }}
          />

          <Box sx={{ position: "relative", zIndex: 1 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
              <Stack direction="row" alignItems="center" gap={1}>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: 1.5,
                    bgcolor: "rgba(255,255,255,0.08)",
                    display: "grid",
                    placeItems: "center",
                    color: "#38bdf8",
                  }}
                >
                  <AccountBalanceWalletOutlined sx={{ fontSize: 18 }} />
                </Box>
                <Typography
                  variant="caption"
                  fontWeight={700}
                  letterSpacing={1.2}
                  sx={{ color: "rgba(255,255,255,0.6)", textTransform: "uppercase", fontSize: "0.68rem" }}
                >
                  INGRESOS CONFIRMADOS
                </Typography>
              </Stack>
              <Chip
                label="Stripe Verified"
                size="small"
                sx={{
                  bgcolor: "rgba(56, 189, 248, 0.15)",
                  color: "#38bdf8",
                  fontWeight: 600,
                  fontSize: "0.65rem",
                  border: "1px solid rgba(56, 189, 248, 0.3)",
                }}
              />
            </Stack>

            <Typography
              sx={{
                fontWeight: 900,
                fontSize: { xs: "2.4rem", md: "3.2rem" },
                letterSpacing: -1.5,
                lineHeight: 1,
                color: "#ffffff",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              <Val loading={isLoading}>${toCurrency(revenue)}</Val>
            </Typography>

            <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.45)", mt: 1, display: "block" }}>
              Total recaudado de órdenes en estado completado
            </Typography>
          </Box>

          <Box
            sx={{
              position: "relative",
              zIndex: 1,
              mt: 4,
              pt: 2.5,
              borderTop: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <Stack direction="row" justifyContent="space-between">
              <Box>
                <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.45)", display: "block" }}>
                  Ticket Promedio
                </Typography>
                <Typography variant="subtitle2" fontWeight={800} sx={{ color: "white" }}>
                  <Val loading={isLoading}>${toCurrency(averageTicket)}</Val>
                </Typography>
              </Box>
              <Divider orientation="vertical" flexItem sx={{ borderColor: "rgba(255,255,255,0.1)" }} />
              <Box>
                <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.45)", display: "block" }}>
                  Tasa Conversión
                </Typography>
                <Typography variant="subtitle2" fontWeight={800} sx={{ color: "#34d399" }}>
                  <Val loading={isLoading}>{conversionRate}%</Val>
                </Typography>
              </Box>
              <Divider orientation="vertical" flexItem sx={{ borderColor: "rgba(255,255,255,0.1)" }} />
              <Box>
                <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.45)", display: "block" }}>
                  Órdenes Totales
                </Typography>
                <Typography variant="subtitle2" fontWeight={800} sx={{ color: "white" }}>
                  <Val loading={isLoading}>{total}</Val>
                </Typography>
              </Box>
            </Stack>
          </Box>
        </Paper>

        <Stack direction={{ xs: "column", sm: "row" }} gap={2.5} flex={1}>
          <StatCard
            title="Completadas"
            value={completed}
            description="Órdenes pagadas y despachadas"
            badgeText="Éxito"
            icon={<CheckCircleOutline sx={{ fontSize: 22 }} />}
            iconBg="#ecfdf5"
            iconColor="#10b981"
            loading={isLoading}
          />
          <StatCard
            title="Pendientes"
            value={pending}
            description="En espera de pago o confirmación"
            badgeText="En curso"
            icon={<PendingOutlined sx={{ fontSize: 22 }} />}
            iconBg="#fffbeb"
            iconColor="#f59e0b"
            loading={isLoading}
          />
          <StatCard
            title="Canceladas"
            value={cancelled}
            description="Expiradas o pago rechazado"
            badgeText="Inactivas"
            icon={<CancelOutlined sx={{ fontSize: 22 }} />}
            iconBg="#fff1f2"
            iconColor="#ef4444"
            loading={isLoading}
          />
        </Stack>
      </Stack>

      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          border: "1px solid",
          borderColor: "#e2e8f0",
          bgcolor: "#ffffff",
          overflow: "hidden",
          boxShadow: "0 4px 20px -4px rgba(15, 23, 42, 0.05)",
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{
            px: 3.5,
            py: 2.5,
            borderBottom: "1px solid #f1f5f9",
          }}
        >
          <Stack direction="row" alignItems="center" gap={1.5}>
            <Box
              sx={{
                width: 34,
                height: 34,
                borderRadius: 1.5,
                bgcolor: "#f1f5f9",
                color: "#475569",
                display: "grid",
                placeItems: "center",
              }}
            >
              <ReceiptLongOutlined sx={{ fontSize: 18 }} />
            </Box>
            <Box>
              <Typography variant="subtitle1" fontWeight={800} color="#0f172a">
                Actividad de Órdenes Recientes
              </Typography>
              <Typography variant="caption" color="#64748b">
                Mostrando las últimas {Math.min(recentOrders.length, 10)} transacciones registradas
              </Typography>
            </Box>
          </Stack>

          <Button
            size="small"
            onClick={() => router.push("/admin/orders")}
            endIcon={<ArrowForwardOutlined sx={{ fontSize: 14 }} />}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              fontSize: "0.82rem",
              color: "#3b82f6",
              "&:hover": { bgcolor: "#eff6ff" },
            }}
          >
            Ver catálogo completo
          </Button>
        </Stack>

        <TableContainer>
          <Table sx={{ minWidth: 650 }}>
            <TableHead sx={{ bgcolor: "#f8fafc" }}>
              <TableRow>
                <TableCell sx={{ color: "#64748b", fontWeight: 700, fontSize: "0.72rem", textTransform: "uppercase", py: 1.5, pl: 3.5 }}>
                  Identificador
                </TableCell>
                <TableCell sx={{ color: "#64748b", fontWeight: 700, fontSize: "0.72rem", textTransform: "uppercase", py: 1.5 }}>
                  Cliente / Correo
                </TableCell>
                <TableCell sx={{ color: "#64748b", fontWeight: 700, fontSize: "0.72rem", textTransform: "uppercase", py: 1.5 }}>
                  Fecha y Hora
                </TableCell>
                <TableCell sx={{ color: "#64748b", fontWeight: 700, fontSize: "0.72rem", textTransform: "uppercase", py: 1.5 }}>
                  Estado
                </TableCell>
                <TableCell align="right" sx={{ color: "#64748b", fontWeight: 700, fontSize: "0.72rem", textTransform: "uppercase", py: 1.5, pr: 3.5 }}>
                  Total Cobrado
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} sx={{ py: 6, textAlign: "center", color: "#94a3b8" }}>
                    Cargando transacciones recientes...
                  </TableCell>
                </TableRow>
              ) : recentOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} sx={{ py: 6, textAlign: "center", color: "#94a3b8" }}>
                    No se registran transacciones recientes en el sistema.
                  </TableCell>
                </TableRow>
              ) : (
                recentOrders.map((order) => {
                  const statusKey = order.status.toLowerCase();
                  const cfg = STATUS_CONFIG[statusKey] ?? {
                    label: order.status,
                    bg: "#f1f5f9",
                    text: "#475569",
                    border: "#cbd5e1",
                    dot: "#64748b",
                  };

                  return (
                    <TableRow
                      key={order.orderId}
                      sx={{
                        "&:hover": { bgcolor: "#f8fafc" },
                        transition: "background 0.15s",
                      }}
                    >
                      <TableCell sx={{ pl: 3.5, py: 2 }}>
                        <Chip
                          label={`#${order.orderId.split("-")[0].toUpperCase()}`}
                          size="small"
                          sx={{
                            fontFamily: "monospace",
                            fontWeight: 700,
                            fontSize: "0.72rem",
                            bgcolor: "#f1f5f9",
                            color: "#334155",
                            borderRadius: 1.5,
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ py: 2 }}>
                        <Typography variant="body2" fontWeight={600} color="#0f172a" fontSize="0.85rem">
                          {order.email}
                        </Typography>
                        <Typography variant="caption" color="#94a3b8" fontSize="0.72rem">
                          ID Usuario: {order.userId}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ py: 2, color: "#64748b", fontSize: "0.82rem" }}>
                        {formatDate(order.createdAt as unknown as string)}
                      </TableCell>
                      <TableCell sx={{ py: 2 }}>
                        <Stack
                          direction="row"
                          alignItems="center"
                          gap={0.75}
                          sx={{
                            display: "inline-flex",
                            px: 1.25,
                            py: 0.4,
                            borderRadius: 1.5,
                            bgcolor: cfg.bg,
                            border: `1px solid ${cfg.border}`,
                          }}
                        >
                          <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: cfg.dot }} />
                          <Typography
                            variant="caption"
                            sx={{ color: cfg.text, fontWeight: 700, fontSize: "0.72rem" }}
                          >
                            {cfg.label}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align="right" sx={{ pr: 3.5, py: 2 }}>
                        <Typography
                          variant="body2"
                          fontWeight={800}
                          color="#0f172a"
                          sx={{ fontVariantNumeric: "tabular-nums" }}
                        >
                          ${toCurrency(toNumber(order.totalAmount))}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems="center"
        mt={4}
        pt={2.5}
        borderTop="1px solid #e2e8f0"
        gap={1.5}
      >
        <Typography variant="caption" color="#94a3b8">
          Minimarket E-Commerce Platform • Core Engine v4.0
        </Typography>

        <Stack direction="row" alignItems="center" gap={2}>
          <Stack direction="row" alignItems="center" gap={0.5}>
            <Circle sx={{ fontSize: 7, color: "#10b981" }} />
            <Typography variant="caption" color="#64748b" fontWeight={500}>
              MySQL Relational Engine
            </Typography>
          </Stack>
          <Stack direction="row" alignItems="center" gap={0.5}>
            <Circle sx={{ fontSize: 7, color: "#10b981" }} />
            <Typography variant="caption" color="#64748b" fontWeight={500}>
              Elasticsearch 9.2
            </Typography>
          </Stack>
          <Stack direction="row" alignItems="center" gap={0.5}>
            <Circle sx={{ fontSize: 7, color: "#10b981" }} />
            <Typography variant="caption" color="#64748b" fontWeight={500}>
              Stripe Payments API
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
}
