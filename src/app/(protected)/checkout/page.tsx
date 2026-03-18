"use client";

import { Box, Paper, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { processCheckout, CheckoutRequest, CreatePaymentResponse } from "../../api/checkout";
import { useCart, CART_QUERY_KEY } from "../../components/CartProvider";
import { StepIndicator, Phase } from "./components/StepIndicator";
import { ReviewPhase } from "./components/ReviewPhase";
import { ShippingPhase } from "./components/ShippingPhase";
import { ConfirmationPhase } from "./components/ConfirmationPhase";

const EMPTY_FORM: CheckoutRequest = {
  shippingFullName: "",
  shippingAddressLine: "",
  shippingCity: "",
  shippingZipCode: "",
  shippingCountry: "",
};

export default function CheckoutPage() {
  const { items, total, itemCount, lockCart, unlockCart } = useCart();
  const queryClient = useQueryClient();

  const [phase, setPhase] = useState<Phase>("review");
  const [formData, setFormData] = useState<CheckoutRequest>(EMPTY_FORM);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmationResult, setConfirmationResult] = useState<CreatePaymentResponse | null>(null);

  const checkoutMutation = useMutation({
    mutationFn: processCheckout,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
      setConfirmationResult(data);
      setPhase("confirmation");
    },
    onError: (error: unknown) => {
      const msg = error instanceof Error ? error.message : "Error al procesar la orden";
      setErrorMessage(msg);
    },
  });

  useEffect(() => {
    if (phase !== "confirmation") lockCart();
    return () => unlockCart();
  }, [phase, lockCart, unlockCart]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    setErrorMessage(null);
    if (Object.values(formData).some((v) => !v.trim())) {
      setErrorMessage("Por favor completa todos los campos de envio.");
      return;
    }
    checkoutMutation.mutate(formData);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: { xs: "background.paper", md: "grey.50" },
        py: { xs: 4, md: 6 },
        px: { xs: 2, sm: 3 },
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
      }}
    >
      <Box sx={{ width: "100%", maxWidth: 520 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="overline" color="text.disabled" letterSpacing={1.5} display="block" mb={0.5}>
            Minimarket
          </Typography>
          <Typography variant="h4" fontWeight={800} letterSpacing={-0.5}>
            Finalizar compra
          </Typography>
        </Box>

        <StepIndicator phase={phase} />

        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 4 },
            borderRadius: 3,
            border: "1px solid",
            borderColor: "grey.200",
            bgcolor: "background.paper",
          }}
        >
          {phase === "review" && (
            <ReviewPhase
              items={items}
              itemCount={itemCount}
              total={total}
              onNext={() => setPhase("shipping")}
            />
          )}

          {phase === "shipping" && (
            <ShippingPhase
              formData={formData}
              onChange={handleChange}
              onBack={() => setPhase("review")}
              onSubmit={handleSubmit}
              isPending={checkoutMutation.isPending}
              error={errorMessage}
            />
          )}

          {phase === "confirmation" && confirmationResult && (
            <ConfirmationPhase result={confirmationResult} />
          )}
        </Paper>
      </Box>
    </Box>
  );
}
