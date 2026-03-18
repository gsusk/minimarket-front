"use client";

import { Box, Button, Typography } from "@mui/material";
import { Inventory2Outlined } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { ShoppingCartItem } from "../../../api/cart";
import { toNumber } from "../../../utils/format";
import { CartRow } from "./CartRow";
import { OrderTotals } from "./OrderTotals";

interface ReviewPhaseProps {
  items: ShoppingCartItem[];
  itemCount: number;
  total: number;
  onNext: () => void;
}

export function ReviewPhase({ items, itemCount, total, onNext }: ReviewPhaseProps) {
  const router = useRouter();

  if (items.length === 0) {
    return (
      <Box
        sx={{
          textAlign: "center",
          py: 10,
          px: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Inventory2Outlined sx={{ fontSize: 48, color: "text.disabled" }} />
        <Typography variant="h6" color="text.secondary" fontWeight={600}>
          Tu carrito esta vacio
        </Typography>
        <Button
          variant="outlined"
          onClick={() => router.replace("/")}
          size="large"
          sx={{ mt: 1, borderRadius: 2, px: 4 }}
        >
          Ir a la tienda
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h6" fontWeight={700} mb={0.5}>
        Productos en tu carrito
      </Typography>
      <Typography variant="caption" color="text.disabled">
        {itemCount} {itemCount === 1 ? "producto" : "productos"}
      </Typography>

      <Box sx={{ mt: 2 }}>
        {items.map((item) => (
          <CartRow
            key={item.productId}
            name={item.name}
            quantity={item.quantity}
            unitPrice={toNumber(item.unitPrice)}
          />
        ))}
      </Box>

      <OrderTotals total={total} />

      <Button
        variant="contained"
        size="large"
        fullWidth
        onClick={onNext}
        sx={{
          mt: 3,
          py: 1.5,
          borderRadius: 2,
          fontWeight: 700,
          bgcolor: "text.primary",
          color: "background.paper",
          "&:hover": { bgcolor: "grey.800" },
        }}
      >
        Continuar con el envio
      </Button>
    </Box>
  );
}
