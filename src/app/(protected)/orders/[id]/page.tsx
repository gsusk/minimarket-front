"use client";

import { Alert, Box, Button, CircularProgress, Paper } from "@mui/material";
import { KeyboardArrowLeft } from "@mui/icons-material";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { getOrderDetails } from "../../../api/orders";
import { OrderStatusHeader } from "./components/OrderStatusHeader";
import { OrderItemsTable } from "./components/OrderItemsTable";

export default function OrderDetailPage() {
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
          Error al cargar la orden.{" "}
          {error instanceof Error ? error.message : ""}
        </Alert>
        <Button sx={{ mt: 2 }} variant="outlined" onClick={() => router.push("/profile/orders")}>
          Volver a mis ordenes
        </Button>
      </Box>
    );
  }

  const isCancelled = order.status.toLowerCase() === "cancelled";

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: { xs: "background.paper", md: "grey.50" },
        py: { xs: 3, md: 5 },
        px: { xs: 2, md: 4 },
      }}
    >
      <Box maxWidth={600} mx="auto">
        <Button
          startIcon={<KeyboardArrowLeft />}
          onClick={() => router.push("/profile/orders")}
          sx={{ mb: 3, color: "text.secondary", pl: 0 }}
        >
          Mis ordenes
        </Button>

        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            border: "1px solid",
            borderColor: "grey.200",
            overflow: "hidden",
            bgcolor: "background.paper",
          }}
        >
          <OrderStatusHeader
            orderId={order.orderId}
            status={order.status}
            createdAt={order.createdAt}
          />

          <OrderItemsTable
            items={order.items}
            totalAmount={order.totalAmount}
            isCancelled={isCancelled}
          />

          <Box sx={{ px: { xs: 3, md: 4 }, pb: 3 }}>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => router.push("/")}
              sx={{
                borderRadius: 2,
                py: 1.25,
                fontWeight: 600,
                borderColor: "grey.300",
                color: "text.primary",
                "&:hover": { borderColor: "text.primary", bgcolor: "transparent" },
              }}
            >
              Ir a la tienda
            </Button>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
