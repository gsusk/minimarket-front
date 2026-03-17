"use client";

import {
  Box,
  Typography,
  Paper,
  Stack,
  CircularProgress,
  Alert,
  Button,
} from "@mui/material";
import {
  ShoppingBag,
  ReceiptLong
} from "@mui/icons-material";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { getOrders } from "@/app/api/orders";
import { OrderCard } from "@/app/components/OrderCard";

export default function OrdersPage() {
  const router = useRouter();
  const { data: orders, isLoading, error } = useQuery({
    queryKey: ["my-orders"],
    queryFn: getOrders,
  });

  return (
    <Box>
      <Typography
        variant="h6"
        fontWeight={700}
        gutterBottom
        sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}
      >
        <Box
          sx={{
            p: 0.9,
            borderRadius: 1.5,
            bgcolor: "primary.main",
            color: "white",
            display: "flex",
          }}
        >
          <ShoppingBag fontSize="small" />
        </Box>
        Mis Órdenes
      </Typography>

      {isLoading && (
        <Box display="flex" justifyContent="center" py={8}>
          <CircularProgress size={36} />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ borderRadius: 2 }}>
          No se pudieron cargar tus ordenes. Intenta de nuevo mas tarde.
        </Alert>
      )}

      {!isLoading && !error && orders?.length === 0 && (
        <Paper
          elevation={0}
          sx={{
            p: 6,
            textAlign: "center",
            borderRadius: 4,
            border: "1px dashed",
            borderColor: "grey.300",
            bgcolor: "grey.50",
          }}
        >
          <ReceiptLong sx={{ fontSize: 52, color: "text.disabled", mb: 2 }} />
          <Typography variant="h6" color="text.secondary" fontWeight={600} gutterBottom>
            Sin ordenes aun
          </Typography>
          <Typography variant="body2" color="text.disabled" mb={3}>
            Tus compras apareceran aquí una vez que realices un pedido.
          </Typography>
          <Button variant="contained" onClick={() => router.push("/")} sx={{ borderRadius: 2 }}>
            Explorar productos
          </Button>
        </Paper>
      )}

      {!isLoading && orders && orders.length > 0 && (
        <Stack spacing={1.5}>
          {orders.map((order) => (
            <OrderCard
              key={order.orderId}
              order={order}
              onClick={() => router.push(`/orders/${order.orderId}`)}
            />
          ))}
        </Stack>
      )}
    </Box>
  );
}
