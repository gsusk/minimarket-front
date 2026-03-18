"use client";

import { Alert, Box, Button, CircularProgress, Stack, TextField, Typography } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { CheckoutRequest } from "../../../api/checkout";

const FIELD_LABELS: { name: keyof CheckoutRequest; label: string; placeholder?: string }[] = [
  { name: "shippingFullName", label: "Nombre completo", placeholder: "Juan Perez" },
  { name: "shippingAddressLine", label: "Direccion", placeholder: "Calle 123 # 45-67" },
  { name: "shippingCity", label: "Ciudad", placeholder: "Bogota" },
  { name: "shippingZipCode", label: "Codigo postal", placeholder: "110111" },
  { name: "shippingCountry", label: "Pais", placeholder: "Colombia" },
];

interface ShippingPhaseProps {
  formData: CheckoutRequest;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBack: () => void;
  onSubmit: () => void;
  isPending: boolean;
  error: string | null;
}

export function ShippingPhase({
  formData,
  onChange,
  onBack,
  onSubmit,
  isPending,
  error,
}: ShippingPhaseProps) {
  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
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
          Informacion de envio
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      <Stack spacing={2.5}>
        {FIELD_LABELS.map(({ name, label, placeholder }) => (
          <TextField
            key={name}
            label={label}
            name={name}
            value={formData[name]}
            onChange={onChange}
            placeholder={placeholder}
            required
            fullWidth
            size="small"
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1.5 } }}
          />
        ))}
      </Stack>

      <Button
        variant="contained"
        size="large"
        fullWidth
        onClick={onSubmit}
        disabled={isPending}
        sx={{
          mt: 3.5,
          py: 1.5,
          borderRadius: 2,
          fontWeight: 700,
          bgcolor: "text.primary",
          color: "background.paper",
          "&:hover": { bgcolor: "grey.800" },
          "&.Mui-disabled": { bgcolor: "grey.300" },
        }}
      >
        {isPending ? (
          <Stack direction="row" alignItems="center" gap={1.5}>
            <CircularProgress size={18} sx={{ color: "inherit" }} />
            <span>Procesando...</span>
          </Stack>
        ) : (
          "Confirmar orden"
        )}
      </Button>
    </Box>
  );
}
