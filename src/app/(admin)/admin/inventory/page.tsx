"use client";

import {
  Box,
  Typography,
  Paper,
  Stack,
  TextField,
  Button,
  Divider,
  Alert,
  InputAdornment,
  Chip,
} from "@mui/material";
import { SearchOutlined, AddCircleOutline, RemoveCircleOutline } from "@mui/icons-material";
import { useState, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminAdjustStock } from "../../../api/admin";
import { getFeaturedProducts, DetailedProduct } from "../../../api/products";

function StockRow({
  product,
  onAdjust,
}: {
  product: DetailedProduct;
  onAdjust: (productId: number, qty: number, reason: string) => void;
}) {
  const [qty, setQty] = useState("");
  const [reason, setReason] = useState("");

  const qtyNum = parseInt(qty, 10);
  const valid = !isNaN(qtyNum) && qtyNum !== 0 && reason.trim().length > 0;

  const low = product.stock <= 5;

  return (
    <Box sx={{ px: 3, py: 2.5 }}>
      <Stack direction={{ xs: "column", md: "row" }} alignItems={{ md: "center" }} gap={2}>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Stack direction="row" alignItems="center" gap={1.5}>
            <Typography variant="body2" fontWeight={600} noWrap>{product.name}</Typography>
            {low && (
              <Chip label="Stock bajo" color="warning" size="small" sx={{ fontWeight: 700, fontSize: "0.65rem", height: 20 }} />
            )}
          </Stack>
          <Typography variant="caption" color="text.disabled">{product.brand}</Typography>
          <Typography variant="body2" fontWeight={700} mt={0.25}>
            Stock actual: <span style={{ fontFamily: "monospace" }}>{product.stock}</span>
          </Typography>
        </Box>

        <Stack direction={{ xs: "column", sm: "row" }} gap={1.5} sx={{ flex: 2 }}>
          <TextField
            label="Ajuste (+/-)"
            size="small"
            type="number"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
            placeholder="ej. 10 o -3"
            sx={{ flex: 1, "& .MuiOutlinedInput-root": { borderRadius: 1.5 } }}
          />
          <TextField
            label="Motivo"
            size="small"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Reabastecimiento, ajuste..."
            sx={{ flex: 1.5, "& .MuiOutlinedInput-root": { borderRadius: 1.5 } }}
          />
          <Button
            variant="outlined"
            size="small"
            disabled={!valid}
            onClick={() => {
              onAdjust(product.id, qtyNum, reason.trim());
              setQty("");
              setReason("");
            }}
            sx={{
              borderRadius: 1.5,
              fontWeight: 700,
              borderColor: "grey.300",
              color: "text.primary",
              "&:hover": { borderColor: "text.primary", bgcolor: "transparent" },
              whiteSpace: "nowrap",
            }}
            startIcon={qtyNum > 0 ? <AddCircleOutline sx={{ fontSize: 16 }} /> : <RemoveCircleOutline sx={{ fontSize: 16 }} />}
          >
            Aplicar
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}

export default function AdminInventoryPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["admin", "products"],
    queryFn: getFeaturedProducts,
  });

  const adjustMut = useMutation({
    mutationFn: ({ id, qty, reason }: { id: number; qty: number; reason: string }) =>
      adminAdjustStock(id, { quantity: qty, reason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      setSuccessMsg("Stock actualizado correctamente.");
      setErrorMsg(null);
      setTimeout(() => setSuccessMsg(null), 3000);
    },
    onError: (e: unknown) => {
      setErrorMsg(e instanceof Error ? e.message : "Error al ajustar el stock.");
      setSuccessMsg(null);
    },
  });

  const filtered = useMemo(
    () =>
      products.filter(
        (p) =>
          !search ||
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.brand.toLowerCase().includes(search.toLowerCase())
      ),
    [products, search]
  );

  return (
    <Box>
      <Box mb={4}>
        <Typography variant="h5" fontWeight={800} letterSpacing={-0.5}>Inventario</Typography>
        <Typography variant="body2" color="text.secondary" mt={0.5}>
          Ajusta el stock de cada producto de forma individual
        </Typography>
      </Box>

      {successMsg && (
        <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setSuccessMsg(null)}>
          {successMsg}
        </Alert>
      )}
      {errorMsg && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setErrorMsg(null)}>
          {errorMsg}
        </Alert>
      )}

      <TextField
        placeholder="Buscar producto o marca..."
        size="small"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        fullWidth
        sx={{ mb: 3, "& .MuiOutlinedInput-root": { borderRadius: 1.5 } }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchOutlined sx={{ fontSize: 18, color: "text.disabled" }} />
            </InputAdornment>
          ),
        }}
      />

      <Paper
        elevation={0}
        sx={{ borderRadius: 2, border: "1px solid", borderColor: "grey.200", bgcolor: "background.paper", overflow: "hidden" }}
      >
        <Box sx={{ px: 3, py: 2, borderBottom: "1px solid", borderColor: "grey.100", bgcolor: "grey.50" }}>
          <Typography variant="caption" fontWeight={700} color="text.disabled" letterSpacing={0.5}>
            {filtered.length} PRODUCTOS
          </Typography>
        </Box>

        {isLoading ? (
          <Box sx={{ px: 3, py: 5, textAlign: "center" }}>
            <Typography variant="body2" color="text.disabled">Cargando...</Typography>
          </Box>
        ) : filtered.length === 0 ? (
          <Box sx={{ px: 3, py: 5, textAlign: "center" }}>
            <Typography variant="body2" color="text.disabled">Sin productos que coincidan.</Typography>
          </Box>
        ) : (
          filtered.map((p, idx) => (
            <Box key={p.id}>
              <StockRow
                product={p}
                onAdjust={(id, qty, reason) => adjustMut.mutate({ id, qty, reason })}
              />
              {idx < filtered.length - 1 && <Divider />}
            </Box>
          ))
        )}
      </Paper>
    </Box>
  );
}
