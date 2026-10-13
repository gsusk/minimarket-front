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
  Paper,
} from "@mui/material";
import { SearchOutlined } from "@mui/icons-material";
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { adminGetAllOrders } from "../../../api/admin";
import { toCurrency, toNumber, formatDate } from "../../../utils/format";

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_COLOR: Record<string, "default" | "warning" | "success" | "error" | "info"> = {
  completed:  "success",
  pending:    "warning",
  cancelled:  "error",
  processing: "info",
};

const STATUS_LABEL: Record<string, string> = {
  completed:  "Completada",
  pending:    "Pendiente",
  cancelled:  "Cancelada",
  processing: "En proceso",
};

// ─── Page ─────────────────────────────────────────────────────────────────────

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

  const completedCount   = orders.filter((o) => o.status.toLowerCase() === "completed").length;
  const pendingCount     = orders.filter((o) => o.status.toLowerCase() === "pending").length;
  const completedRevenue = orders
    .filter((o) => o.status.toLowerCase() === "completed")
    .reduce((sum, o) => sum + toNumber(o.totalAmount), 0);

  return (
    <Box sx={{ maxWidth: 1120, mx: "auto" }}>
      {/* ── Page header ── */}
      <Stack
        direction={{ xs: "column", md: "row" }}
        justifyContent="space-between"
        alignItems={{ md: "flex-end" }}
        mb={3}
        gap={2}
      >
        <Box>
          <Typography
            sx={{ fontSize: "0.7rem", fontWeight: 700, color: "#6366f1", textTransform: "uppercase", letterSpacing: 1 }}
          >
            Gestión
          </Typography>
          <Typography sx={{ fontSize: "1.6rem", fontWeight: 800, color: "#111827", mt: 0.25 }}>
            Órdenes
          </Typography>
          <Typography sx={{ fontSize: "0.85rem", color: "#6b7280", mt: 0.5 }}>
            Revisa clientes, estados, fechas y montos de cada transacción.
          </Typography>
        </Box>

        {/* Summary pills */}
        <Stack direction="row" gap={2} flexWrap="wrap">
          {[
            { label: "Total", value: `${orders.length}` },
            { label: "Pendientes", value: `${pendingCount}` },
            { label: "Recaudado", value: `$${toCurrency(completedRevenue)}` },
          ].map(({ label, value }) => (
            <Box
              key={label}
              sx={{
                px: 2,
                py: 1,
                borderRadius: 1.5,
                border: "1px solid #e5e7eb",
                bgcolor: "#fff",
                minWidth: 100,
              }}
            >
              <Typography sx={{ fontSize: "0.68rem", fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 0.5 }}>
                {label}
              </Typography>
              <Typography sx={{ fontSize: "1rem", fontWeight: 800, color: "#111827", mt: 0.25 }}>
                {value}
              </Typography>
            </Box>
          ))}
        </Stack>
      </Stack>

      {/* ── Filters ── */}
      <Stack direction={{ xs: "column", sm: "row" }} gap={1.5} mb={2.5}>
        <TextField
          placeholder="Buscar por email o ID..."
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{
            flex: 1,
            "& .MuiOutlinedInput-root": { borderRadius: 1.5, bgcolor: "white" },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchOutlined sx={{ fontSize: 17, color: "#9ca3af" }} />
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
            sx={{ borderRadius: 1.5, bgcolor: "white" }}
          >
            <MenuItem value="all">Todos</MenuItem>
            <MenuItem value="pending">Pendiente</MenuItem>
            <MenuItem value="completed">Completada</MenuItem>
            <MenuItem value="cancelled">Cancelada</MenuItem>
            <MenuItem value="processing">En proceso</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      {/* ── Table ── */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 2,
          border: "1px solid #e5e7eb",
          bgcolor: "#fff",
          overflow: "hidden",
        }}
      >
        {/* Table meta row */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ px: 3, py: 1.75, borderBottom: "1px solid #f3f4f6" }}
        >
          <Typography sx={{ fontSize: "0.72rem", fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 0.5 }}>
            {filtered.length} {filtered.length === 1 ? "orden" : "órdenes"}
          </Typography>
          <Typography sx={{ fontSize: "0.72rem", color: "#9ca3af" }}>
            {completedCount} completadas
          </Typography>
        </Stack>

        {isLoading ? (
          <Box sx={{ px: 3, py: 6, textAlign: "center" }}>
            <Typography sx={{ fontSize: "0.85rem", color: "#9ca3af" }}>Cargando órdenes...</Typography>
          </Box>
        ) : filtered.length === 0 ? (
          <Box sx={{ px: 3, py: 6, textAlign: "center" }}>
            <Typography sx={{ fontSize: "0.85rem", color: "#9ca3af" }}>Sin resultados para los filtros aplicados.</Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table sx={{ minWidth: 760 }} aria-label="Órdenes del sistema">
              <TableHead>
                <TableRow
                  sx={{
                    "& th": {
                      bgcolor: "#f9fafb",
                      borderBottomColor: "#e5e7eb",
                      color: "#6b7280",
                      fontSize: "0.68rem",
                      fontWeight: 700,
                      letterSpacing: 0.5,
                      textTransform: "uppercase",
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
                        "& td": { borderBottomColor: "#f3f4f6", py: 1.75 },
                        "&:last-child td": { borderBottom: 0 },
                      }}
                    >
                      <TableCell>
                        <Typography
                          sx={{ fontFamily: "monospace", fontWeight: 700, fontSize: "0.8rem", color: "#111827" }}
                        >
                          #{order.orderId.split("-")[0].toUpperCase()}
                        </Typography>
                        <Typography sx={{ fontSize: "0.7rem", color: "#9ca3af", fontFamily: "monospace" }}>
                          {order.orderId.slice(0, 18)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: "0.84rem", fontWeight: 600, color: "#111827" }}>
                          {order.email}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: "0.82rem", color: "#6b7280" }}>
                          {formatDate(order.createdAt as unknown as string)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: "0.84rem", fontWeight: 600, color: "#374151" }}>
                          {order.items?.length ?? 0}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={STATUS_LABEL[status] ?? order.status}
                          color={STATUS_COLOR[status] ?? "default"}
                          size="small"
                          sx={{ fontWeight: 700, fontSize: "0.68rem", height: 22, borderRadius: 1 }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Typography sx={{ fontSize: "0.84rem", fontWeight: 700, color: "#111827" }}>
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
      </Paper>
    </Box>
  );
}
