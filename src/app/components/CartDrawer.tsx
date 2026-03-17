"use client";

import { useRouter } from "next/navigation";
import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Collapse,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import { Add, Close, DeleteOutline, Remove, ShoppingBagOutlined, WifiOff } from "@mui/icons-material";
import { useCart } from "./CartProvider";
import { useQueryClient } from "@tanstack/react-query";
import { CART_QUERY_KEY } from "./CartProvider";
import { toNumber, toCurrency } from "../utils/format";


export default function CartDrawer() {
  const {
    items,
    total,
    isCartOpen,
    closeCart,
    addItem,
    removeItem,
    deleteItem,
    clearCart,
    isLoading,
    cartError,
    mutationError,
    clearMutationError,
  } = useCart();

  const queryClient = useQueryClient();
  const router = useRouter();

  const handleCheckout = () => {
    closeCart();
    router.replace("/checkout");
  };

  const handleRetry = () => {
    queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
  };

  const renderBody = () => {
    if (isLoading) {
      return (
        <Stack flex={1} alignItems="center" justifyContent="center" spacing={2}>
          <CircularProgress />
          <Typography variant="body2" color="text.secondary">
            Cargando carrito...
          </Typography>
        </Stack>
      );
    }

    if (cartError) {
      return (
        <Stack flex={1} alignItems="center" justifyContent="center" spacing={2} textAlign="center" px={2}>
          <WifiOff sx={{ fontSize: 56, color: "text.disabled" }} />
          <Typography variant="h6" fontWeight={700}>
            No se pudo cargar el carrito
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {cartError}
          </Typography>
          <Button variant="outlined" onClick={handleRetry} sx={{ mt: 1 }}>
            Reintentar
          </Button>
        </Stack>
      );
    }

    if (items.length === 0) {
      return (
        <Stack flex={1} alignItems="center" justifyContent="center" spacing={2} textAlign="center">
          <Typography variant="h6" fontWeight={700}>
            Tu carrito esta vacio
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Agrega productos y apareceran aqui.
          </Typography>
        </Stack>
      );
    }

    return (
      <>
        <List sx={{ flex: 1, overflowY: "auto", px: 0 }}>
          {items.map((item) => (
            <Box key={item.productId}>
              <ListItem sx={{ px: 0, py: 2, alignItems: "flex-start" }}>
                <Avatar
                  variant="rounded"
                  sx={{
                    width: 82,
                    height: 82,
                    borderRadius: 3,
                    bgcolor: "grey.100",
                    color: "text.secondary",
                    flexShrink: 0,
                    mr: 2,
                  }}
                >
                  <ShoppingBagOutlined />
                </Avatar>

                <Box sx={{ flex: 1 }}>
                  <ListItemText
                    primary={item.name}
                    secondary={`Precio unitario: $${toCurrency(toNumber(item.unitPrice))}`}
                    slotProps={{
                      primary: { fontWeight: 700 },
                      secondary: { color: "text.secondary" },
                    }}
                  />

                  <Stack direction="row" justifyContent="space-between" alignItems="center" mt={1.5} gap={1}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <IconButton
                        size="small"
                        onClick={() => removeItem(item.productId)}
                        aria-label={`Quitar una unidad de ${item.name}`}
                      >
                        <Remove fontSize="small" />
                      </IconButton>
                      <Typography minWidth={24} textAlign="center" fontWeight={700}>
                        {item.quantity}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => addItem(item)}
                        aria-label={`Agregar una unidad de ${item.name}`}
                      >
                        <Add fontSize="small" />
                      </IconButton>
                    </Stack>

                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Typography fontWeight={800}>
                        ${toCurrency(toNumber(item.unitPrice) * item.quantity)}
                      </Typography>
                      <IconButton
                        color="error"
                        onClick={() => deleteItem(item.productId)}
                        aria-label={`Eliminar ${item.name} del carrito`}
                      >
                        <DeleteOutline fontSize="small" />
                      </IconButton>
                    </Stack>
                  </Stack>
                </Box>
              </ListItem>
              <Divider />
            </Box>
          ))}
        </List>

        <Box pt={3}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6" fontWeight={800}>
              Total
            </Typography>
            <Typography variant="h6" fontWeight={900}>
              ${toCurrency(total)}
            </Typography>
          </Stack>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
            <Button variant="outlined" color="inherit" fullWidth onClick={clearCart}>
              Vaciar carrito
            </Button>
            <Button
              variant="contained"
              fullWidth
              onClick={handleCheckout}
            >
              Proceder al pago
            </Button>
          </Stack>
        </Box>
      </>
    );
  };

  return (
    <Drawer
      anchor="right"
      open={isCartOpen}
      onClose={closeCart}
      sx={{
        "& .MuiDrawer-paper": {
          width: { xs: "100%", sm: 420 },
          p: 3,
          display: "flex",
        },
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Box>
          <Typography variant="h6" fontWeight={800}>
            Carrito
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {items.length === 0 ? "No hay productos agregados" : `${items.length} producto(s) distintos`}
          </Typography>
        </Box>
        <IconButton onClick={closeCart} aria-label="Cerrar carrito">
          <Close />
        </IconButton>
      </Stack>

      <Collapse in={!!mutationError}>
        <Alert
          severity="error"
          onClose={clearMutationError}
          sx={{ mb: 2 }}
        >
          {mutationError}
        </Alert>
      </Collapse>

      {renderBody()}
    </Drawer>
  );
}
