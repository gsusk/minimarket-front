
import {
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import { Add, Close, DeleteOutline, Remove } from "@mui/icons-material";
import Image from "next/image";
import { useCart } from "./CartProvider";

export default function CartDrawer() {
  const { items, total, isCartOpen, closeCart, addItem, removeItem, deleteItem, clearCart } = useCart();

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

      {items.length === 0 ? (
        <Stack flex={1} alignItems="center" justifyContent="center" spacing={2} textAlign="center">
          <Typography variant="h6" fontWeight={700}>
            Tu carrito esta vacio
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Agrega productos y apareceran aqui.
          </Typography>
        </Stack>
      ) : (
        <>
          <List sx={{ flex: 1, overflowY: "auto", px: 0 }}>
            {items.map((item) => (
              <Box key={item.id}>
                <ListItem sx={{ px: 0, py: 2, alignItems: "flex-start" }}>
                  <Box
                    sx={{
                      position: "relative",
                      width: 82,
                      height: 82,
                      borderRadius: 3,
                      overflow: "hidden",
                      bgcolor: "grey.100",
                      flexShrink: 0,
                      mr: 2,
                    }}
                  >
                    <Image
                      src={item.images?.[0] || "/window.svg"}
                      alt={item.name}
                      fill
                      style={{ objectFit: "contain", padding: "10px" }}
                    />
                  </Box>

                  <Box sx={{ flex: 1 }}>
                    <ListItemText
                      primary={item.name}
                      secondary={item.category}
                      slotProps={{
                        primary: { fontWeight: 700 },
                        secondary: { color: "text.secondary" },
                      }}
                    />

                    <Stack direction="row" justifyContent="space-between" alignItems="center" mt={1.5} gap={1}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <IconButton
                          size="small"
                          onClick={() => removeItem(item.id)}
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
                          ${(item.price * item.quantity).toLocaleString()}
                        </Typography>
                        <IconButton
                          color="error"
                          onClick={() => deleteItem(item.id)}
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
                ${total.toLocaleString()}
              </Typography>
            </Stack>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
              <Button variant="outlined" color="inherit" fullWidth onClick={clearCart}>
                Vaciar carrito
              </Button>
              <Button variant="contained" fullWidth onClick={closeCart}>
                Seguir comprando
              </Button>
            </Stack>
          </Box>
        </>
      )}
    </Drawer>
  );
}
