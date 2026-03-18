"use client";

import { Box, Grid, Paper, Stack, Typography, Divider, Chip } from "@mui/material";
import {
  StorefrontOutlined,
  ShoppingCartOutlined,
  PeopleOutlined,
  TrendingUp,
} from "@mui/icons-material";
import { useQuery } from "@tanstack/react-query";
import { adminGetAllOrders } from "../../api/admin";
import { toCurrency, toNumber, formatDate } from "../../utils/format";

const STATUS_COLOR: Record<string, "default" | "warning" | "success" | "error" | "info"> = {
  completed: "success",
  pending: "warning",
  cancelled: "error",
  processing: "info",
};

function StatCard({
  label,
  value,
  sub,
  Icon,
}: {
  label: string;
  value: string | number;
  sub?: string;
  Icon: React.ElementType;
}) {
  return (
    <Paper
      elevation={0}
      sx={{ p: 3, borderRadius: 2, border: "1px solid", borderColor: "grey.200", bgcolor: "background.paper" }}
    >
      <Stack direction="row" alignItems="flex-start" justifyContent="space-between">
        <Box>
          <Typography variant="caption" color="text.disabled" fontWeight={600} letterSpacing={0.5} display="block">
            {label.toUpperCase()}
          </Typography>
          <Typography variant="h4" fontWeight={800} mt={0.5} letterSpacing={-1}>
            {value}
          </Typography>
          {sub && (
            <Typography variant="caption" color="text.secondary" mt={0.5} display="block">
              {sub}
            </Typography>
          )}
        </Box>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 2,
            bgcolor: "grey.100",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon sx={{ fontSize: 20, color: "text.secondary" }} />
        </Box>
      </Stack>
    </Paper>
  );
}

export default function AdminDashboard() {
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["admin", "orders"],
    queryFn: adminGetAllOrders,
  });

  const totalRevenue = orders
    .filter((o) => o.status.toLowerCase() === "completed")
    .reduce((sum, o) => sum + toNumber(o.totalAmount), 0);

  const pending = orders.filter((o) => o.status.toLowerCase() === "pending").length;
  const completed = orders.filter((o) => o.status.toLowerCase() === "completed").length;

  const recent = [...orders].slice(0, 8);

  return (
    <Box>
      <Box mb={4}>
        <Typography variant="h5" fontWeight={800} letterSpacing={-0.5}>
          Dashboard
        </Typography>
        <Typography variant="body2" color="text.secondary" mt={0.5}>
          Vista general del negocio
        </Typography>
      </Box>

      <Grid container spacing={2.5} mb={4}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            label="Ingresos totales"
            value={`$${toCurrency(totalRevenue)}`}
            sub="Ordenes completadas"
            Icon={TrendingUp}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            label="Total ordenes"
            value={isLoading ? "..." : orders.length}
            sub="Historico completo"
            Icon={ShoppingCartOutlined}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            label="Completadas"
            value={isLoading ? "..." : completed}
            sub="Pagadas y procesadas"
            Icon={StorefrontOutlined}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            label="Pendientes"
            value={isLoading ? "..." : pending}
            sub="Esperando pago"
            Icon={PeopleOutlined}
          />
        </Grid>
      </Grid>

      <Paper
        elevation={0}
        sx={{ borderRadius: 2, border: "1px solid", borderColor: "grey.200", bgcolor: "background.paper" }}
      >
        <Box sx={{ px: 3, py: 2.5, borderBottom: "1px solid", borderColor: "grey.100" }}>
          <Typography variant="subtitle1" fontWeight={700}>
            Ultimas ordenes
          </Typography>
        </Box>

        {isLoading ? (
          <Box sx={{ px: 3, py: 4 }}>
            <Typography variant="body2" color="text.disabled">Cargando...</Typography>
          </Box>
        ) : recent.length === 0 ? (
          <Box sx={{ px: 3, py: 4 }}>
            <Typography variant="body2" color="text.disabled">Sin ordenes registradas.</Typography>
          </Box>
        ) : (
          <Box>
            {recent.map((order, idx) => (
              <Box key={order.orderId}>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  justifyContent="space-between"
                  alignItems={{ sm: "center" }}
                  sx={{ px: 3, py: 2 }}
                  gap={1}
                >
                  <Box>
                    <Typography variant="body2" fontWeight={600} fontFamily="monospace" fontSize="0.8rem">
                      #{order.orderId.split("-")[0].toUpperCase()}
                    </Typography>
                    <Typography variant="caption" color="text.disabled">
                      {order.email} — {formatDate(order.createdAt as unknown as string)}
                    </Typography>
                  </Box>
                  <Stack direction="row" alignItems="center" gap={2}>
                    <Chip
                      label={order.status}
                      color={STATUS_COLOR[order.status.toLowerCase()] ?? "default"}
                      size="small"
                      sx={{ fontWeight: 700, fontSize: "0.7rem", height: 22, textTransform: "capitalize" }}
                    />
                    <Typography variant="body2" fontWeight={700}>
                      ${toCurrency(toNumber(order.totalAmount))}
                    </Typography>
                  </Stack>
                </Stack>
                {idx < recent.length - 1 && <Divider />}
              </Box>
            ))}
          </Box>
        )}
      </Paper>
    </Box>
  );
}
