"use client";

import { Card, CardContent, Typography, Box, IconButton, Stack } from "@mui/material";
import { AddShoppingCartOutlined, CheckCircleOutline, FavoriteBorder } from "@mui/icons-material";
import Image from "next/image";
import { Product } from "../api/products";
import { useCart } from "./CartProvider";

export default function ProductCard({ product }: { product: Product }) {
  const { addItem, items } = useCart();
  const quantityInCart = items.find((item) => item.productId === product.id)?.quantity ?? 0;

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: '20px',
        p: 1,
        transition: '0.3s ease',
        '&:hover': { transform: 'translateY(-8px)', boxShadow: '0 12px 24px rgba(0,0,0,0.08)' }
      }}
    >
      <Box sx={{
        position: 'relative',
        pt: '100%',
        bgcolor: '#fff',
        borderRadius: '16px',
        overflow: 'hidden'
      }}>
        <IconButton
          size="small"
          sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1, bgcolor: 'rgba(255,255,255,0.8)' }}
        >
          <FavoriteBorder fontSize="small" />
        </IconButton>

        <Image
          src={(product?.images && product.images.length > 0) ? product.images[0] : '/window.svg'}
          alt={product?.name || "card picture"}
          fill
          style={{
            objectFit: 'contain',
            padding: '15px',
            mixBlendMode: 'multiply'
          }}
        />
      </Box>

      <CardContent sx={{ pt: 2, px: 1 }}>
        <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 800, textTransform: 'uppercase' }}>
          {product?.category}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontWeight: 700,
            lineHeight: 1.2,
            height: '2.4rem',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            mt: 0.5
          }}
        >
          {product?.name}
        </Typography>

        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 2 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 900, color: 'text.primary' }}>
              ${product?.price.toLocaleString()}
            </Typography>
            {quantityInCart > 0 && (
              <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 0.5, color: 'success.main' }}>
                <CheckCircleOutline sx={{ fontSize: 16 }} />
                <Typography variant="caption" sx={{ fontWeight: 700 }}>
                  {quantityInCart > 99 ? '+99' : quantityInCart} en el carrito
                </Typography>
              </Stack>
            )}
          </Box>
          <IconButton
            onClick={() => addItem(product)}
            aria-label={`Agregar ${product.name} al carrito`}
            sx={{
              bgcolor: 'primary.main',
              color: 'white',
              '&:hover': { bgcolor: 'primary.dark' }
            }}
          >
            <AddShoppingCartOutlined fontSize="small" />
          </IconButton>
        </Stack>
      </CardContent>
    </Card>
  );
}
