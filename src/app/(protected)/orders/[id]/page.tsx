"use client";

import {
  Box,
  Typography,
  Paper,
  Stack,
  Divider,
  Chip,
  CircularProgress,
  Alert,
  Button,
} from "@mui/material";
import {
  CheckCircleOutline,
  Schedule,
  Cancel,
  HourglassTop,
  KeyboardArrowLeft,
} from "@mui/icons-material";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { getOrderDetails } from "../../../api/orders";
import { toNumber, toCurrency, formatDate } from "../../../utils/format";

type StatusConfig = {
  label: string;
  color: "default" | "warning" | "success" | "error" | "info";
  Icon: React.ElementType;
  headline: string;
  subtext: string;
};

const STATUS_CONFIG: Record<string, StatusConfig> = {
  completed: {
    label: "Completada",
    color: "success",
    Icon: CheckCircleOutline,
    headline: "Gracias por tu compra!",
    subtext: "Tu orden fue procesada exitosamente.",
  },
  pending: {
    label: "Pendiente",
    color: "warning",
    Icon: Schedule,
    headline: "Orden en espera",
    subtext: "Tu orden esta pendiente de procesarse. Las ordenes sin pago son canceladas a los 30 min.",
  },
  cancelled: {
    label: "Cancelada",
    color: "error",
    Icon: Cancel,
    headline: "Orden cancelada",
    subtext: "Esta orden fue cancelada y no genero ningún cobro.",
  },
  processing: {
    label: "En proceso",
    color: "info",
    Icon: HourglassTop,
    headline: "Procesando tu orden",
    subtext: "Esatmos verificando tu pago. Te notificaremos pronto.",
  },
};

function getStatusConfig(status: string): StatusConfig {
  return (
    STATUS_CONFIG[status.toLowerCase()] ?? {
      label: status,
      color: "default",
      Icon: Schedule,
      headline: "Estado de la orden",
      subtext: "",
    }
  );
}

export default function OrderConfirmationPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;

  const {
    data: order,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => getOrderDetails(orderId),
    enabled: !!orderId,
  });

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !order) {
    return (
      <Box p={4} maxWidth={600} mx="auto" minHeight="80vh">
        <Alert severity="error" sx={{ borderRadius: 2 }}>
          Error al cargar los detalles de la orden.{" "}
          {error instanceof Error ? error.message : ""}
        </Alert>
        <Button sx={{ mt: 2 }} variant="outlined" onClick={() => router.push("/")}>
          Volver al inicio
        </Button>
      </Box>
    );
  }

  const { label, color, Icon, headline, subtext } = getStatusConfig(order.status);
  const isCancelled = order.status.toLowerCase() === "cancelled";

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "grey.50",
        py: { xs: 3, md: 5 },
        px: { xs: 2, md: 4 },
      }}
    >
      <Box maxWidth={700} mx="auto">
        <Button
          startIcon={<KeyboardArrowLeft />}
          onClick={() => router.push("/profile/orders")}
          sx={{ mb: 3, color: "text.secondary" }}
        >
          Mis órdenes
        </Button>

        <Paper
          elevation={0}
          sx={{
            borderRadius: 4,
            border: "1px solid",
            borderColor: "grey.200",
            overflow: "hidden",
            bgcolor: "white",
          }}
        >
          {/* Status header */}
          <Box
            sx={{
              p: { xs: 3, md: 4 },
              textAlign: "center",
              borderBottom: "1px solid",
              borderColor: "grey.100",
              bgcolor: isCancelled ? "grey.50" : `${color}.50`,
            }}
          >
            <Icon
              sx={{
                fontSize: 64,
                color: isCancelled ? "text.disabled" : `${color}.main`,
                mb: 1.5,
              }}
            />
            <Typography
              variant="h5"
              fontWeight={800}
              color={isCancelled ? "text.secondary" : "text.primary"}
              gutterBottom
            >
              {headline}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 440, mx: "auto" }}>
              {subtext}
            </Typography>
            <Stack direction="row" justifyContent="center" alignItems="center" gap={1.5} mt={2.5}>
              <Chip label={label} color={color} size="small" sx={{ fontWeight: 700 }} />
              <Typography variant="caption" color="text.disabled" fontFamily="monospace">
                #{order.orderId.split("-")[0].toUpperCase()}
              </Typography>
              <Typography variant="caption" color="text.disabled">
                {formatDate(order.createdAt)}
              </Typography>
            </Stack>
          </Box>

          {/* Items */}
          <Box sx={{ p: { xs: 3, md: 4 } }}>
            <Typography variant="subtitle1" fontWeight={700} mb={2}>
              Productos
            </Typography>
            <Stack spacing={2} divider={<Divider />}>
              {order.items.map((item) => (
                <Stack
                  key={item.id}
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Box>
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      color={isCancelled ? "text.disabled" : "text.primary"}
                    >
                      {item.productName}
                    </Typography>
                    <Typography variant="caption" color="text.disabled">
                      {item.quantity} × ${toCurrency(toNumber(item.price))}
                    </Typography>
                  </Box>
                  <Typography
                    variant="body2"
                    fontWeight={700}
                    color={isCancelled ? "text.disabled" : "text.primary"}
                  >
                    ${toCurrency(toNumber(item.subTotal))}
                  </Typography>
                </Stack>
              ))}
            </Stack>

            <Divider sx={{ my: 3 }} />

            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h6" fontWeight={700}>
                Total
              </Typography>
              <Typography
                variant="h5"
                fontWeight={900}
                color={isCancelled ? "text.disabled" : "primary.main"}
              >
                ${toCurrency(toNumber(order.totalAmount))}
              </Typography>
            </Stack>
          </Box>

          {/* Footer CTA */}
          <Box
            sx={{
              px: { xs: 3, md: 4 },
              pb: { xs: 3, md: 4 },
              pt: 0,
            }}
          >
            <Button
              variant={isCancelled ? "outlined" : "contained"}
              size="large"
              fullWidth
              onClick={() => router.push("/")}
              sx={{ borderRadius: 2, py: 1.5, fontWeight: 700 }}
            >
              {isCancelled ? "Volver a la tienda" : "Seguir explorando"}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
