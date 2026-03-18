import { Box, Divider, Stack, Typography } from "@mui/material";
import { toCurrency } from "../../../utils/format";

interface OrderTotalsProps {
  total: number;
}

export function OrderTotals({ total }: OrderTotalsProps) {
  return (
    <Box sx={{ pt: 2 }}>
      <Divider sx={{ mb: 2 }} />
      <Stack direction="row" justifyContent="space-between" alignItems="baseline">
        <Typography variant="body2" color="text.secondary">
          Subtotal
        </Typography>
        <Typography variant="body2" fontWeight={600}>
          ${toCurrency(total)}
        </Typography>
      </Stack>
      <Stack direction="row" justifyContent="space-between" alignItems="baseline" mt={0.75}>
        <Typography variant="body2" color="text.secondary">
          Envio
        </Typography>
        <Typography variant="body2" fontWeight={600} color="success.main">
          Gratis
        </Typography>
      </Stack>
      <Divider sx={{ my: 2 }} />
      <Stack direction="row" justifyContent="space-between" alignItems="baseline">
        <Typography variant="subtitle1" fontWeight={700}>
          Total
        </Typography>
        <Typography variant="h6" fontWeight={800}>
          ${toCurrency(total)}
        </Typography>
      </Stack>
    </Box>
  );
}
