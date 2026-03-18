import { Box, Stack, Typography } from "@mui/material";
import { toCurrency } from "../../../utils/format";

interface CartRowProps {
  name: string;
  quantity: number;
  unitPrice: number;
}

export function CartRow({ name, quantity, unitPrice }: CartRowProps) {
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center" py={1.5}>
      <Stack direction="row" alignItems="center" gap={2} sx={{ minWidth: 0 }}>
        <Box
          sx={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            bgcolor: "text.disabled",
            flexShrink: 0,
          }}
        />
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="body2" fontWeight={500} noWrap>
            {name}
          </Typography>
          <Typography variant="caption" color="text.disabled">
            {quantity} unidad{quantity !== 1 ? "es" : ""}
          </Typography>
        </Box>
      </Stack>
      <Typography variant="body2" fontWeight={600} sx={{ pl: 2, flexShrink: 0 }}>
        ${toCurrency(unitPrice * quantity)}
      </Typography>
    </Stack>
  );
}
