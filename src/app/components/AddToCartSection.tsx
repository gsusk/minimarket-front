"use client";

import { Button, Stack, Typography } from "@mui/material";
import { AddShoppingCartOutlined, CheckCircleOutline } from "@mui/icons-material";
import { useCart } from "./CartProvider";

export default function AddToCartSection({ productId, inStock }: { productId: number; inStock: boolean }) {
  const { addItem, items } = useCart();
  const quantityInCart = items.find((item) => item.productId === productId)?.quantity ?? 0;

  return (
    <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center" sx={{ mb: 3 }}>
      <Button
        variant="contained"
        size="large"
        startIcon={<AddShoppingCartOutlined />}
        disabled={!inStock}
        onClick={() => addItem({ productId })}
        sx={{
          borderRadius: "99px",
          textTransform: "none",
          fontWeight: 700,
          fontSize: "1.1rem",
          px: 5,
          py: 1.5,
          width: { xs: "100%", sm: "auto" },
          bgcolor: "primary.main",
          color: "white",
          boxShadow: "0 4px 14px rgba(14, 165, 233, 0.35)",
          "&:hover": { bgcolor: "primary.dark", boxShadow: "0 6px 20px rgba(14, 165, 233, 0.45)", transform: "translateY(-2px)" },
          transition: "all 0.2s ease",
          "&.Mui-disabled": {
            bgcolor: "grey.200",
            color: "grey.400",
          }
        }}
      >
        Agregar al carrito
      </Button>

      {quantityInCart > 0 && (
        <Stack direction="row" spacing={0.5} alignItems="center" sx={{ color: "success.main" }}>
          <CheckCircleOutline sx={{ fontSize: 20 }} />
          <Typography variant="body2" fontWeight={700}>
            {quantityInCart > 99 ? "+99" : quantityInCart} en el carrito
          </Typography>
        </Stack>
      )}
    </Stack>
  );
}
