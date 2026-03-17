"use client";

import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Divider,
  Stack,
  Alert,
  Chip,
  InputAdornment,
} from "@mui/material";
import {
  LocalShipping,
  CreditCard,
  Lock,
  ShoppingBag,
  CheckCircleOutline,
} from "@mui/icons-material";
import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { processCheckout, CheckoutRequest } from "../../api/checkout";
import { useCart, CART_QUERY_KEY } from "../../components/CartProvider";

function toCurrency(value: number) {
  return value.toLocaleString("es-CO", { minimumFractionDigits: 0 });
}

function toNumber(value: string | number): number {
  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) ? parsedValue : 0;
}

const inputSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 2,
    "&:hover fieldset": { borderColor: "primary.main" },
  },
};

export default function CheckoutPage() {
  const { items, total, itemCount, lockCart, unlockCart } = useCart();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<CheckoutRequest>({
    shippingFullName: "",
    shippingAddressLine: "",
    shippingCity: "",
    shippingZipCode: "",
    shippingCountry: "",
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const checkoutMutation = useMutation({
    mutationFn: processCheckout,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
      router.replace(`/orders/${data.orderId}`);
    },
    onError: (error: unknown) => {
      const msg = error instanceof Error ? error.message : "Error al procesar el pago";
      setErrorMessage(msg);
    },
  });

  useEffect(() => {
    lockCart();
    return () => unlockCart();
  }, [lockCart, unlockCart]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (items.length === 0) {
      setErrorMessage("Tu carrito está vacío.");
      return;
    }
    checkoutMutation.mutate(formData);
  };

  if (items.length === 0 && !checkoutMutation.isPending && !checkoutMutation.isSuccess) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="80vh"
        gap={3}
        textAlign="center"
        p={4}
      >
        <ShoppingBag sx={{ fontSize: 80, color: "text.disabled" }} />
        <Typography variant="h5" fontWeight={700} color="text.secondary">
          Tu carrito está vacío
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() => router.replace("/")}
          sx={{ borderRadius: 3, px: 4, py: 1.5 }}
        >
          Volver a la tienda
        </Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "grey.50",
        py: { xs: 3, md: 5 },
        px: { xs: 2, md: 4 },
      }}
    >
      <Box maxWidth={1100} mx="auto" mb={4}>
        <Stack direction="row" alignItems="center" gap={1.5} mb={0.5}>
          <Lock sx={{ color: "text.secondary", fontSize: 20 }} />
          <Typography variant="caption" color="text.secondary" fontWeight={600} letterSpacing={1}>
            PAGO SEGURO
          </Typography>
        </Stack>
        <Typography variant="h4" fontWeight={800}>
          Finalizar Compra
        </Typography>
      </Box>

      <Box maxWidth={1100} mx="auto">
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 7 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3, order: { xs: 2, md: 1 } }}>

              <Paper
                elevation={0}
                sx={{
                  p: { xs: 3, md: 4 },
                  borderRadius: 4,
                  border: "1px solid",
                  borderColor: "grey.200",
                  bgcolor: "white",
                }}
              >
                <Stack direction="row" alignItems="center" gap={1.5} mb={3.5}>
                  <Box>
                    <Typography variant="h6" fontWeight={700} lineHeight={1.2}>
                      Información de Envío
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      ¿A dónde enviamos tu pedido?
                    </Typography>
                  </Box>
                </Stack>

                {errorMessage && (
                  <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                    {errorMessage}
                  </Alert>
                )}

                <form onSubmit={handleSubmit}>
                  <Stack spacing={2.5}>
                    <TextField
                      label="Nombre Completo"
                      name="shippingFullName"
                      value={formData.shippingFullName}
                      onChange={handleChange}
                      required
                      fullWidth
                      sx={inputSx}
                    />
                    <TextField
                      label="Dirección de Envío"
                      name="shippingAddressLine"
                      value={formData.shippingAddressLine}
                      onChange={handleChange}
                      required
                      fullWidth
                      sx={inputSx}
                    />
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          label="Ciudad"
                          name="shippingCity"
                          value={formData.shippingCity}
                          onChange={handleChange}
                          required
                          fullWidth
                          sx={inputSx}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          label="Código Postal"
                          name="shippingZipCode"
                          value={formData.shippingZipCode}
                          onChange={handleChange}
                          required
                          fullWidth
                          sx={inputSx}
                        />
                      </Grid>
                    </Grid>
                    <TextField
                      label="País"
                      name="shippingCountry"
                      value={formData.shippingCountry}
                      onChange={handleChange}
                      required
                      fullWidth
                      sx={inputSx}
                    />
                  </Stack>
                </form>
              </Paper>

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
                <Box
                  sx={{
                    background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
                    p: { xs: 3, md: 4 },
                    color: "white",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <Box
                    sx={{
                      position: "absolute",
                      top: -40,
                      right: -40,
                      width: 140,
                      height: 140,
                      borderRadius: "50%",
                      bgcolor: "rgba(255,255,255,0.05)",
                    }}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: -20,
                      right: 60,
                      width: 90,
                      height: 90,
                      borderRadius: "50%",
                      bgcolor: "rgba(255,255,255,0.05)",
                    }}
                  />
                  <Stack direction="row" alignItems="center" gap={1.5} mb={2.5}>
                    <Box
                      sx={{
                        width: 38,
                        height: 38,
                        borderRadius: 2,
                        bgcolor: "rgba(255,255,255,0.15)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <CreditCard sx={{ color: "white", fontSize: 20 }} />
                    </Box>
                    <Box>
                      <Typography variant="h6" fontWeight={700} lineHeight={1.2}>
                        Metodo de Pago
                      </Typography>
                      <Typography variant="caption" sx={{ opacity: 0.7 }}>
                        simulacion sin cobro real
                      </Typography>
                    </Box>
                  </Stack>
                  <Box
                    sx={{
                      width: 48,
                      height: 34,
                      borderRadius: 1.5,
                      bgcolor: "rgba(255,215,0,0.85)",
                      mb: 2,
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gridTemplateRows: "1fr 1fr",
                      gap: "2px",
                      p: "4px",
                    }}
                  >
                    {[0, 1, 2, 3].map((i) => (
                      <Box key={i} sx={{ bgcolor: "rgba(0,0,0,0.25)", borderRadius: 0.5 }} />
                    ))}
                  </Box>

                  <Typography variant="body2" sx={{ opacity: 0.6, letterSpacing: 3 }}>
                    ●●●● ●●●● ●●●● ????
                  </Typography>
                </Box>

                <Box sx={{ p: { xs: 3, md: 4 } }}>
                  <Stack spacing={2.5}>
                    <TextField
                      label="Número de Tarjeta"
                      placeholder="0000 0000 0000 0000"
                      inputProps={{ maxLength: 19 }}
                      fullWidth
                      sx={inputSx}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <CreditCard sx={{ color: "text.disabled" }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 6 }}>
                        <TextField
                          label="Vencimiento"
                          placeholder="MM/AA"
                          inputProps={{ maxLength: 5 }}
                          fullWidth
                          sx={inputSx}
                        />
                      </Grid>
                      <Grid size={{ xs: 6 }}>
                        <TextField
                          label="CVV"
                          placeholder="•••"
                          inputProps={{ maxLength: 3 }}
                          fullWidth
                          sx={inputSx}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Lock sx={{ color: "text.disabled", fontSize: 18 }} />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                    </Grid>
                    <TextField
                      label="Nombre en la Tarjeta"
                      placeholder="Ej. Juan Pérez"
                      fullWidth
                      sx={inputSx}
                    />
                  </Stack>
                </Box>
              </Paper>

              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={checkoutMutation.isPending}
                onClick={handleSubmit}
                fullWidth
                sx={{
                  py: 2,
                  borderRadius: 3,
                  fontWeight: 800,
                  fontSize: "1.1rem",
                  background: checkoutMutation.isPending
                    ? undefined
                    : "linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)",
                  boxShadow: "0 4px 20px rgba(25, 118, 210, 0.4)",
                  letterSpacing: 0.5,
                  "&:hover": {
                    boxShadow: "0 6px 28px rgba(25, 118, 210, 0.5)",
                    transform: "translateY(-1px)",
                  },
                  transition: "all 0.2s ease",
                }}
              >
                {checkoutMutation.isPending ? "Procesando..." : "🔒  Confirmar y Pagar"}
              </Button>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 5 }}>
            <Box
              sx={{
                position: { md: "sticky" },
                top: { md: 24 },
                order: { xs: 1, md: 2 },
              }}
            >
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
                <Box
                  sx={{
                    px: { xs: 3, md: 4 },
                    py: 2.5,
                    borderBottom: "1px solid",
                    borderColor: "grey.100",
                    bgcolor: "grey.50",
                  }}
                >
                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Typography variant="h6" fontWeight={700}>
                      Resumen
                    </Typography>
                    <Chip
                      label={`${itemCount} producto${itemCount !== 1 ? "s" : ""}`}
                      size="small"
                      sx={{ fontWeight: 600, bgcolor: "primary.50", color: "primary.main" }}
                    />
                  </Stack>
                </Box>

                <Stack
                  sx={{
                    px: { xs: 3, md: 4 },
                    py: 2,
                    maxHeight: 320,
                    overflowY: "auto",
                    gap: 2,
                  }}
                >
                  {items.map((item) => (
                    <Stack
                      key={item.productId}
                      direction="row"
                      justifyContent="space-between"
                      alignItems="flex-start"
                      gap={2}
                    >
                      <Stack direction="row" gap={1.5} alignItems="center" flex={1} minWidth={0}>
                        <Box
                          sx={{
                            width: 36,
                            height: 36,
                            borderRadius: 2,
                            bgcolor: "primary.50",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          <Typography variant="caption" fontWeight={700} color="primary.main">
                            {item.quantity}x
                          </Typography>
                        </Box>
                        <Typography
                          variant="body2"
                          fontWeight={600}
                          noWrap
                          sx={{ overflow: "hidden", textOverflow: "ellipsis" }}
                        >
                          {item.name}
                        </Typography>
                      </Stack>
                      <Typography variant="body2" fontWeight={700} flexShrink={0}>
                        ${toCurrency(toNumber(item.unitPrice) * item.quantity)}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>

                <Box sx={{ px: { xs: 3, md: 4 }, pb: 3 }}>
                  <Divider sx={{ mb: 2 }} />

                  <Stack gap={1.5}>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">
                        Subtotal
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        ${toCurrency(total)}
                      </Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">
                        Envío
                      </Typography>
                      <Stack direction="row" alignItems="center" gap={0.5}>
                        <CheckCircleOutline sx={{ fontSize: 14, color: "success.main" }} />
                        <Typography variant="body2" fontWeight={600} color="success.main">
                          Gratis
                        </Typography>
                      </Stack>
                    </Stack>
                  </Stack>

                  <Divider sx={{ my: 2 }} />

                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" fontWeight={800}>
                      Total a pagar
                    </Typography>
                    <Typography variant="h5" fontWeight={900} color="primary.main">
                      ${toCurrency(total)}
                    </Typography>
                  </Stack>
                </Box>
              </Paper>

              <Stack direction="row" gap={2} mt={2.5} justifyContent="center" flexWrap="wrap">
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
