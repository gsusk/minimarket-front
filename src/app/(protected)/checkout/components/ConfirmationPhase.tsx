"use client";

import { Box, Button, Divider, Stack, Typography } from "@mui/material";
import { Check } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { CreatePaymentResponse } from "../../../api/checkout";
import { toNumber, toCurrency } from "../../../utils/format";

interface ConfirmationPhaseProps {
  result: CreatePaymentResponse;
}

export function ConfirmationPhase({ result }: ConfirmationPhaseProps) {
  const router = useRouter();

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          py: { xs: 4, md: 6 },
          gap: 1.5,
        }}
      >
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            bgcolor: "text.primary",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 1,
          }}
        >
          <Check sx={{ fontSize: 28, color: "white" }} />
        </Box>
        <Typography variant="h5" fontWeight={800}>
          Orden confirmada
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 340 }}>
          Tu compra fue procesada exitosamente. Guardamos tu direccion de envio y te contactaremos
          cuando tu pedido sea despachado.
        </Typography>
      </Box>

      <Divider sx={{ mb: 3 }} />

      <Stack spacing={1.5}>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body2" color="text.disabled">
            Referencia de pago
          </Typography>
          <Typography variant="body2" fontWeight={600} fontFamily="monospace" fontSize="0.8rem">
            {result.paymentReference}
          </Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body2" color="text.disabled">
            Total cobrado
          </Typography>
          <Typography variant="body2" fontWeight={700}>
            ${toCurrency(toNumber(result.amount))}
          </Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body2" color="text.disabled">
            Estado
          </Typography>
          <Typography
            variant="body2"
            fontWeight={600}
            color="success.main"
            sx={{ textTransform: "capitalize" }}
          >
            {result.status}
          </Typography>
        </Stack>
      </Stack>

      <Divider sx={{ mt: 3, mb: 3 }} />

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <Button
          variant="outlined"
          fullWidth
          onClick={() => router.push("/profile/orders")}
          sx={{
            borderRadius: 2,
            py: 1.25,
            fontWeight: 600,
            borderColor: "grey.300",
            color: "text.primary",
            "&:hover": { borderColor: "text.primary" },
          }}
        >
          Ver mis ordenes
        </Button>
        <Button
          variant="contained"
          fullWidth
          onClick={() => router.push("/")}
          sx={{
            borderRadius: 2,
            py: 1.25,
            fontWeight: 700,
            bgcolor: "text.primary",
            color: "background.paper",
            "&:hover": { bgcolor: "grey.800" },
          }}
        >
          Seguir comprando
        </Button>
      </Stack>
    </Box>
  );
}
