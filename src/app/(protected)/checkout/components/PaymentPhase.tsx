"use client";

import { useState, useMemo } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import {
  ArrowBack,
  CreditCard,
  LockOutlined,
  BoltOutlined,
} from "@mui/icons-material";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import {
  CreatePaymentResponse,
  confirmOrderPayment,
} from "../../../api/checkout";
import { toNumber, toCurrency } from "../../../utils/format";

interface PaymentPhaseProps {
  paymentData: CreatePaymentResponse;
  onSuccess: (result: CreatePaymentResponse) => void;
  onBack: () => void;
}

function StripeCheckoutForm({
  paymentData,
  onSuccess,
  isTestFastPending,
  setIsTestFastPending,
}: {
  paymentData: CreatePaymentResponse;
  onSuccess: (result: CreatePaymentResponse) => void;
  isTestFastPending: boolean;
  setIsTestFastPending: (val: boolean) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: "if_required",
      });

      if (error) {
        setErrorMessage(error.message || "Error al procesar el pago con Stripe.");
        setIsProcessing(false);
        return;
      }

      if (paymentIntent && paymentIntent.status === "succeeded") {
        // Confirmar con el backend para sincronizar estado de orden
        const syncResponse = await confirmOrderPayment(paymentData.orderId);
        onSuccess(syncResponse);
      } else {
        // En caso de que requiera acción adicional o confirmación
        const syncResponse = await confirmOrderPayment(paymentData.orderId);
        onSuccess(syncResponse);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error inesperado al pagar";
      setErrorMessage(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFastTestPay = async () => {
    setIsTestFastPending(true);
    setErrorMessage(null);
    try {
      const result = await confirmOrderPayment(paymentData.orderId, {
        paymentMethodId: "pm_card_visa",
      });
      onSuccess(result);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error en pago de prueba";
      setErrorMessage(msg);
    } finally {
      setIsTestFastPending(false);
    }
  };

  const isBusy = isProcessing || isTestFastPending;

  return (
    <Box component="form" onSubmit={handleSubmit}>
      {errorMessage && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {errorMessage}
        </Alert>
      )}

      <Box sx={{ mb: 3 }}>
        <PaymentElement />
      </Box>

      <Stack spacing={2} sx={{ mt: 3 }}>
        <Button
          type="submit"
          variant="contained"
          size="large"
          fullWidth
          disabled={!stripe || isBusy}
          sx={{
            py: 1.5,
            borderRadius: 2,
            fontWeight: 700,
            bgcolor: "text.primary",
            color: "background.paper",
            "&:hover": { bgcolor: "grey.800" },
            "&.Mui-disabled": { bgcolor: "grey.300" },
          }}
        >
          {isProcessing ? (
            <Stack direction="row" alignItems="center" gap={1.5}>
              <CircularProgress size={18} sx={{ color: "inherit" }} />
              <span>Procesando con Stripe...</span>
            </Stack>
          ) : (
            `Pagar $${toCurrency(toNumber(paymentData.amount))}`
          )}
        </Button>

        <Divider>
          <Typography variant="caption" color="text.disabled">
            O en Modo de Prueba
          </Typography>
        </Divider>

        <Button
          type="button"
          variant="outlined"
          color="secondary"
          size="medium"
          fullWidth
          onClick={handleFastTestPay}
          disabled={isBusy}
          startIcon={<BoltOutlined />}
          sx={{
            py: 1.2,
            borderRadius: 2,
            fontWeight: 600,
            textTransform: "none",
          }}
        >
          {isTestFastPending ? (
            <Stack direction="row" alignItems="center" gap={1}>
              <CircularProgress size={16} sx={{ color: "inherit" }} />
              <span>Confirmando en Stripe...</span>
            </Stack>
          ) : (
            "Pago rápido de prueba (1-Click Visa Test)"
          )}
        </Button>
      </Stack>
    </Box>
  );
}

export function PaymentPhase({ paymentData, onSuccess, onBack }: PaymentPhaseProps) {
  const [isTestFastPending, setIsTestFastPending] = useState(false);
  const [fallbackError, setFallbackError] = useState<string | null>(null);

  const publishableKey = useMemo(() => {
    return (
      paymentData.publishableKey ||
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
      ""
    );
  }, [paymentData.publishableKey]);

  const stripePromise = useMemo(() => {
    if (!publishableKey) return null;
    return loadStripe(publishableKey);
  }, [publishableKey]);

  const handleDirectFallbackPay = async () => {
    setIsTestFastPending(true);
    setFallbackError(null);
    try {
      const result = await confirmOrderPayment(paymentData.orderId, {
        paymentMethodId: "pm_card_visa",
      });
      onSuccess(result);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al procesar el pago";
      setFallbackError(msg);
    } finally {
      setIsTestFastPending(false);
    }
  };

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
        <button
          onClick={onBack}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
            display: "flex",
            alignItems: "center",
            color: "inherit",
          }}
          aria-label="Atras"
        >
          <ArrowBack sx={{ fontSize: 20 }} />
        </button>
        <Typography variant="h6" fontWeight={700}>
          Pago seguro con Stripe
        </Typography>
      </Box>

      {/* Resumen del cobro */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 2,
          bgcolor: "grey.50",
          border: "1px solid",
          borderColor: "grey.200",
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="caption" color="text.disabled" display="block">
              Orden #{paymentData.orderId.slice(0, 8)}
            </Typography>
            <Stack direction="row" alignItems="center" gap={0.5} mt={0.5}>
              <LockOutlined sx={{ fontSize: 14, color: "success.main" }} />
              <Typography variant="caption" color="text.secondary" fontWeight={500}>
                Transacción cifrada SSL / TLS
              </Typography>
            </Stack>
          </Box>
          <Box textAlign="right">
            <Typography variant="caption" color="text.disabled" display="block">
              Total a pagar
            </Typography>
            <Typography variant="h6" fontWeight={800} color="text.primary">
              ${toCurrency(toNumber(paymentData.amount))} {paymentData.currency?.toUpperCase() || "USD"}
            </Typography>
          </Box>
        </Stack>
      </Paper>

      {/* Si hay clientSecret y Stripe SDK disponible, usamos Stripe Elements */}
      {stripePromise && paymentData.clientSecret ? (
        <Elements
          stripe={stripePromise}
          options={{
            clientSecret: paymentData.clientSecret,
            appearance: {
              theme: "stripe",
              variables: {
                borderRadius: "8px",
                colorPrimary: "#111827",
              },
            },
          }}
        >
          <StripeCheckoutForm
            paymentData={paymentData}
            onSuccess={onSuccess}
            isTestFastPending={isTestFastPending}
            setIsTestFastPending={setIsTestFastPending}
          />
        </Elements>
      ) : (
        /* Modo Fallback si no hay clientSecret o la clave no está disponible */
        <Box>
          {fallbackError && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
              {fallbackError}
            </Alert>
          )}
          <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
            Referencia de pago generada: <strong>{paymentData.paymentReference}</strong>. Puedes completar la orden mediante el simulador de prueba.
          </Alert>
          <Button
            variant="contained"
            size="large"
            fullWidth
            onClick={handleDirectFallbackPay}
            disabled={isTestFastPending}
            startIcon={<CreditCard />}
            sx={{
              py: 1.5,
              borderRadius: 2,
              fontWeight: 700,
              bgcolor: "text.primary",
              color: "background.paper",
              "&:hover": { bgcolor: "grey.800" },
            }}
          >
            {isTestFastPending ? (
              <Stack direction="row" alignItems="center" gap={1.5}>
                <CircularProgress size={18} sx={{ color: "inherit" }} />
                <span>Confirmando pago...</span>
              </Stack>
            ) : (
              `Confirmar Pago ($${toCurrency(toNumber(paymentData.amount))})`
            )}
          </Button>
        </Box>
      )}

      <Stack direction="row" justifyContent="center" alignItems="center" gap={1} mt={3}>
        <Chip
          label="Stripe Test Mode"
          size="small"
          color="warning"
          variant="outlined"
          sx={{ fontSize: "0.7rem", height: 22 }}
        />
        <Typography variant="caption" color="text.disabled">
          Tarjetas de prueba compatibles (4242...)
        </Typography>
      </Stack>
    </Box>
  );
}
