"use client";

import { Box, Typography, Paper, Stack, Divider, CircularProgress, Alert, Button } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { getOrderDetails } from "../../../api/orders";
import { CheckCircleOutline } from "@mui/icons-material";

function toNumber(value: string | number): number {
  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) ? parsedValue : 0;
}

export default function OrderConfirmationPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;

  const { data: order, isLoading, error } = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => getOrderDetails(orderId),
    enabled: !!orderId,
  });

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="97vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !order) {
    return (
      <Box p={4} maxWidth={600} mx="auto" minHeight="97vh">
        <Alert severity="error">
          Error al cargar los detalles de la orden. {error instanceof Error ? error.message : ""}
        </Alert>
        <Button sx={{ mt: 2 }} variant="outlined" onClick={() => router.push("/")}>
          Volver al inicio
        </Button>
      </Box>
    );
  }

  return (
    <Box p={{ xs: 2, sm: 4 }} maxWidth={800} mx="auto">
      <Paper elevation={3} sx={{ p: { xs: 3, sm: 5 }, borderRadius: 4, textAlign: 'center' }}>
        <CheckCircleOutline color="success" sx={{ fontSize: 72, mb: 2 }} />
        <Typography variant="h4" fontWeight={800} gutterBottom>
          ¡Gracias por tu compra!
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom sx={{ fontSize: '1.1rem' }}>
          Tu orden ha sido procesada exitosamente.
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={4}>
          Número de orden: <strong>{order.orderId}</strong>
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" fontWeight={700} textAlign="left" mb={3}>
          Detalles de la orden
        </Typography>

        <Stack spacing={2} divider={<Divider />}>
          {order.items.map((item) => (
            <Stack key={item.id} direction="row" justifyContent="space-between" alignItems="center">
              <Box textAlign="left">
                <Typography variant="subtitle1" fontWeight={600}>
                  {item.productName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Cantidad: {item.quantity} x ${toNumber(item.price).toLocaleString()}
                </Typography>
              </Box>
              <Typography variant="subtitle1" fontWeight={700}>
                ${toNumber(item.subTotal).toLocaleString()}
              </Typography>
            </Stack>
          ))}
        </Stack>

        <Divider sx={{ my: 3 }} />

        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h5" fontWeight={700}>
            Total
          </Typography>
          <Typography variant="h4" fontWeight={800} color="primary.main">
            ${toNumber(order.totalAmount).toLocaleString()}
          </Typography>
        </Stack>

        <Box mt={5}>
          <Button
            variant="contained"
            size="large"
            onClick={() => router.push("/")}
            sx={{ px: 4, py: 1.5, borderRadius: 2, fontWeight: 'bold' }}
          >
            Seguir explorando
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
