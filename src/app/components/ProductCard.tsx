import { Card, CardContent, Typography, Box, IconButton, Stack } from "@mui/material";
import { AddShoppingCartOutlined, FavoriteBorder } from "@mui/icons-material";
import Image from "next/image";
import { Product } from "../api/products";

export default function ProductCard({ product }: { product: Product }) {
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
          src={(product?.images && product.images.length > 0) ? product.images[0] : '/placeholder.png'}
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
          </Box>
          <IconButton
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