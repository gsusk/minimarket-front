"use client";

import {
  Box,
  Typography,
  Stack,
  Divider,
  Chip,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { SearchOutlined } from "@mui/icons-material";
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { adminGetAllOrders } from "../../../api/admin";
import { toCurrency, toNumber, formatDate } from "../../../utils/format";
import { OrderSummary } from "../../../api/orders";

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

  return (
    <Box>
      <Box mb={4}>
        <Typography variant="h4" fontWeight={900} letterSpacing={-1.5}>
          Ordenes
        </Typography>
        <Typography variant="body2" color="text.disabled" mt={0.5}>
          Registro completo de todas las ordenes del sistema
        </Typography>
      </Box>

      <Stack direction={{ xs: "column", sm: "row" }} gap={2} mb={3}>
        <TextField
          placeholder="Buscar por email o ID..."
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ flex: 1, "& .MuiOutlinedInput-root": { borderRadius: 1.5 } }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchOutlined sx={{ fontSize: 18, color: "text.disabled" }} />
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
            sx={{ borderRadius: 1.5 }}
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
        sx={{ borderRadius: 3, border: "1px solid rgba(0,0,0,0.07)", bgcolor: "white", overflow: "hidden" }}
      >
        <Box sx={{ px: 3, py: 2, borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="caption" fontWeight={700} color="text.disabled" letterSpacing={0.8} sx={{ textTransform: "uppercase", fontSize: "0.62rem" }}>
              {filtered.length} {filtered.length === 1 ? "orden" : "ordenes"}
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
          filtered.map((order, idx) => (
            <Box key={order.orderId}>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                alignItems={{ sm: "center" }}
                sx={{ px: 3, py: 2.5 }}
                gap={1.5}
              >
                <Box sx={{ minWidth: 0 }}>
                  <Stack direction="row" alignItems="center" gap={1.5} flexWrap="wrap">
                    <Typography variant="body2" fontWeight={700} fontFamily="monospace" fontSize="0.8rem">
                      #{order.orderId.split("-")[0].toUpperCase()}
                    </Typography>
                    <Chip
                      label={STATUS_LABEL[order.status.toLowerCase()] ?? order.status}
                      color={STATUS_COLOR[order.status.toLowerCase()] ?? "default"}
                      size="small"
                      sx={{ fontWeight: 700, fontSize: "0.7rem", height: 22 }}
                    />
                  </Stack>
                  <Typography variant="caption" color="text.disabled" mt={0.25} display="block">
                    {order.email} — {formatDate(order.createdAt as unknown as string)}
                  </Typography>
                  <Typography variant="caption" color="text.disabled">
                    {order.items?.length ?? 0} producto(s)
                  </Typography>
                </Box>
                <Typography variant="subtitle1" fontWeight={800} sx={{ flexShrink: 0 }}>
                  ${toCurrency(toNumber(order.totalAmount))}
                </Typography>
              </Stack>
              {idx < filtered.length - 1 && <Divider />}
            </Box>
          ))
        )}
      </Box>
    </Box>
  );
}
