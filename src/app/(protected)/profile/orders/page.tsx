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
        variant="h5"
        fontWeight={700}
        gutterBottom
        sx={{ mb: 0.5 }}
      >
        Mis Órdenes
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Historial de compras realizadas con tu cuenta.
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
            p: { xs: 4, md: 6 },
            textAlign: "center",
            borderRadius: 2,
            border: "1px dashed",
            borderColor: "grey.300",
            bgcolor: "background.paper",
          }}
        >
          <ReceiptLong sx={{ fontSize: 44, color: "text.disabled", mb: 2 }} />
          <Typography variant="h6" color="text.secondary" fontWeight={600} gutterBottom>
            Sin órdenes aún
          </Typography>
          <Typography variant="body2" color="text.disabled" mb={3}>
            Tus compras aparecerán aquí una vez que realices un pedido.
          </Typography>
          <Button
            variant="outlined"
            onClick={() => router.push("/")}
            sx={{ borderRadius: 1.5, color: "text.primary", borderColor: "divider", textTransform: "none", fontWeight: 700 }}
          >
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
