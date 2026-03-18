import { Box, Divider, Stack, Typography } from "@mui/material";
import { OrderItemSummary } from "../../../../api/orders";
import { toNumber, toCurrency } from "../../../../utils/format";

interface OrderItemsTableProps {
  items: OrderItemSummary[];
  totalAmount: number;
  isCancelled: boolean;
}

export function OrderItemsTable({ items, totalAmount, isCancelled }: OrderItemsTableProps) {
  const textColor = isCancelled ? "text.disabled" : "text.primary";

  return (
    <Box sx={{ px: { xs: 3, md: 4 }, py: 3 }}>
      <Typography
        variant="overline"
        color="text.disabled"
        letterSpacing={1.2}
        display="block"
        mb={2}
      >
        Productos
      </Typography>

      <Stack spacing={0} divider={<Divider />}>
        {items.map((item) => (
          <Stack
            key={item.id}
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            py={1.75}
          >
            <Box>
              <Typography variant="body2" fontWeight={600} color={textColor}>
                {item.productName}
              </Typography>
              <Typography variant="caption" color="text.disabled">
                {item.quantity} × ${toCurrency(toNumber(item.price))}
              </Typography>
            </Box>
            <Typography variant="body2" fontWeight={700} color={textColor}>
              ${toCurrency(toNumber(item.subTotal))}
            </Typography>
          </Stack>
        ))}
      </Stack>

      <Divider sx={{ mt: 1, mb: 2.5 }} />

      <Stack direction="row" justifyContent="space-between" alignItems="baseline">
        <Typography variant="subtitle1" fontWeight={700}>
          Total
        </Typography>
        <Typography variant="h6" fontWeight={800} color={textColor}>
          ${toCurrency(toNumber(totalAmount))}
        </Typography>
      </Stack>
    </Box>
  );
}
