"use client";

import {
  Box,
  Typography,
  Stack,
  Chip,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { SearchOutlined, ReceiptLongOutlined, LocalShippingOutlined, PaidOutlined } from "@mui/icons-material";
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { adminGetAllOrders } from "../../../api/admin";
import { toCurrency, toNumber, formatDate } from "../../../utils/format";

const MARKET_GREEN = "#0f9f75";
const MARKET_INK = "#14211c";
const MARKET_GOLD = "#f4b942";

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

function SummaryPill({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      gap={1.25}
      sx={{
        px: 1.5,
        py: 1.15,
        borderRadius: 2,
        bgcolor: "rgba(255,255,255,0.78)",
        border: "1px solid rgba(20,33,28,0.08)",
        minWidth: { xs: "100%", sm: 170 },
      }}
    >
      <Box
        sx={{
          width: 34,
          height: 34,
          borderRadius: 1.5,
          display: "grid",
          placeItems: "center",
          color: MARKET_INK,
          bgcolor: "rgba(244,185,66,0.38)",
          "& svg": { fontSize: 18 },
        }}
      >
        {icon}
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="caption" color="text.disabled" fontWeight={700} sx={{ display: "block", lineHeight: 1 }}>
          {label}
        </Typography>
        <Typography variant="body2" fontWeight={900} color={MARKET_INK} noWrap>
          {value}
        </Typography>
      </Box>
    </Stack>
  );
}

export default function AdminOrdersPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["admin", "orders"],
    queryFn: adminGetAllOrders,
  });

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const matchSearch =
        !search ||
        o.email.toLowerCase().includes(search.toLowerCase()) ||
        o.orderId.includes(search);
      const matchStatus = statusFilter === "all" || o.status.toLowerCase() === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [orders, search, statusFilter]);

  const completedCount = orders.filter((o) => o.status.toLowerCase() === "completed").length;
  const pendingCount = orders.filter((o) => o.status.toLowerCase() === "pending").length;
  const completedRevenue = orders
    .filter((o) => o.status.toLowerCase() === "completed")
    .reduce((sum, order) => sum + toNumber(order.totalAmount), 0);

  return (
    <Box sx={{ maxWidth: 1120, mx: "auto" }}>
      <Box
        sx={{
          mb: 3,
          p: { xs: 2.5, md: 3 },
          borderRadius: 2.5,
          color: "white",
          bgcolor: MARKET_INK,
          overflow: "hidden",
          position: "relative",
          boxShadow: "0 24px 64px rgba(20,33,28,0.18)",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            backgroundImage:
              "linear-gradient(135deg, rgba(244,185,66,0.2), transparent 36%), radial-gradient(circle at 86% 30%, rgba(15,159,117,0.42), transparent 28%)",
          }}
        />
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems={{ md: "flex-end" }}
          gap={3}
          sx={{ position: "relative", zIndex: 1 }}
        >
          <Box>
            <Typography variant="caption" fontWeight={800} letterSpacing={1.1} sx={{ color: MARKET_GOLD, textTransform: "uppercase" }}>
              Pedidos y recaudo
            </Typography>
            <Typography variant="h4" fontWeight={950} letterSpacing={-1.5} lineHeight={1.1} mt={0.75}>
              Órdenes
            </Typography>
            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.58)", mt: 1, maxWidth: 520 }}>
              Revisa clientes, estados, fechas y valores sin perder el contexto de la operación.
            </Typography>
          </Box>
          <Stack direction={{ xs: "column", sm: "row" }} gap={1.25} sx={{ width: { xs: "100%", md: "auto" } }}>
            <SummaryPill icon={<ReceiptLongOutlined />} label="Total" value={`${orders.length} órdenes`} />
            <SummaryPill icon={<LocalShippingOutlined />} label="Pendientes" value={`${pendingCount}`} />
            <SummaryPill icon={<PaidOutlined />} label="Confirmado" value={`$${toCurrency(completedRevenue)}`} />
          </Stack>
        </Stack>
      </Box>

      <Stack
        direction={{ xs: "column", sm: "row" }}
        gap={1.5}
        mb={2}
        sx={{
          p: 1.25,
          borderRadius: 2.5,
          bgcolor: "rgba(255,255,255,0.78)",
          border: "1px solid rgba(20,33,28,0.08)",
          boxShadow: "0 14px 36px rgba(20,33,28,0.05)",
        }}
      >
        <TextField
          placeholder="Buscar por email o ID..."
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{
            flex: 1,
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              bgcolor: "white",
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchOutlined sx={{ fontSize: 18, color: MARKET_GREEN }} />
              </InputAdornment>
            ),
          }}
        />
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Estado</InputLabel>
          <Select
            label="Estado"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            sx={{ borderRadius: 2, bgcolor: "white" }}
          >
            <MenuItem value="all">Todos</MenuItem>
            <MenuItem value="pending">Pendiente</MenuItem>
            <MenuItem value="completed">Completada</MenuItem>
            <MenuItem value="cancelled">Cancelada</MenuItem>
            <MenuItem value="processing">En proceso</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      <Box
        sx={{
          borderRadius: 2.5,
          border: "1px solid rgba(20,33,28,0.09)",
          bgcolor: "rgba(255,255,255,0.9)",
          overflow: "hidden",
          boxShadow: "0 22px 54px rgba(20,33,28,0.07)",
        }}
      >
        <Box sx={{ px: 3, py: 2, borderBottom: "1px solid rgba(20,33,28,0.08)", bgcolor: "rgba(255,255,255,0.72)" }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="caption" fontWeight={800} color="text.disabled" letterSpacing={0.8} sx={{ textTransform: "uppercase", fontSize: "0.62rem" }}>
              {filtered.length} {filtered.length === 1 ? "orden" : "ordenes"}
            </Typography>
            <Typography variant="caption" color="text.disabled">
              {completedCount} completadas
            </Typography>
          </Stack>
        </Box>

        {isLoading ? (
          <Box sx={{ px: 3, py: 5, textAlign: "center" }}>
            <Typography variant="body2" color="text.disabled">Cargando ordenes...</Typography>
          </Box>
        ) : filtered.length === 0 ? (
          <Box sx={{ px: 3, py: 5, textAlign: "center" }}>
            <Typography variant="body2" color="text.disabled">Sin resultados para los filtros aplicados.</Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table sx={{ minWidth: 760 }} aria-label="Órdenes del sistema">
              <TableHead>
                <TableRow
                  sx={{
                    "& th": {
                      borderBottomColor: "rgba(20,33,28,0.08)",
                      color: "text.disabled",
                      fontSize: "0.68rem",
                      fontWeight: 800,
                      letterSpacing: 0.8,
                      textTransform: "uppercase",
                      bgcolor: "rgba(246,244,238,0.7)",
                    },
                  }}
                >
                  <TableCell>Orden</TableCell>
                  <TableCell>Cliente</TableCell>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Productos</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell align="right">Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.map((order) => {
                  const status = order.status.toLowerCase();
                  return (
                    <TableRow
                      key={order.orderId}
                      hover
                      sx={{
                        "& td": { borderBottomColor: "rgba(20,33,28,0.06)", py: 2 },
                        "&:last-child td": { borderBottom: 0 },
                      }}
                    >
                      <TableCell>
                        <Typography variant="body2" fontWeight={900} fontFamily="monospace" fontSize="0.8rem" color={MARKET_INK}>
                          #{order.orderId.split("-")[0].toUpperCase()}
                        </Typography>
                        <Typography variant="caption" color="text.disabled" fontFamily="monospace">
                          {order.orderId.slice(0, 18)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={700} color={MARKET_INK}>
                          {order.email}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {formatDate(order.createdAt as unknown as string)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={800}>
                          {order.items?.length ?? 0}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={STATUS_LABEL[status] ?? order.status}
                          color={STATUS_COLOR[status] ?? "default"}
                          size="small"
                          sx={{ fontWeight: 800, fontSize: "0.68rem", height: 24, borderRadius: 1.5 }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" fontWeight={950} color={MARKET_INK}>
                          ${toCurrency(toNumber(order.totalAmount))}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Box>
  );
}
