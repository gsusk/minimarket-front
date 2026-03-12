"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Chip,
  Breadcrumbs,
  Skeleton,
  Stack,
  IconButton,
} from "@mui/material";
import {
  AddShoppingCartOutlined,
  ArrowBack,
  ChevronLeft,
  ChevronRight,
  CheckCircleOutline,
  LocalShippingOutlined,
  VerifiedOutlined,
  SupportAgentOutlined,
} from "@mui/icons-material";
import Image from "next/image";
import Link from "next/link";
import { DetailedProduct } from "../../../api/products";
import { useCart } from "../../../components/CartProvider";
import api from "../../../api/api";

export default function ProductDetailPage() {
  const params = useParams<{ id: string; slug: string }>();
  const productId = Number(params.id);
  const { addItem, items } = useCart();

  const [product, setProduct] = useState<DetailedProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);

  const quantityInCart = items.find((item) => item.productId === productId)?.quantity ?? 0;

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await api.get<DetailedProduct>(`/products/${productId}`);
        setProduct(res.data);
      } catch {
        setError("No se pudo cargar el producto");
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [productId]);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={5}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Skeleton variant="rounded" height={450} sx={{ borderRadius: 4 }} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Skeleton width="40%" height={24} />
            <Skeleton width="80%" height={48} sx={{ mt: 1 }} />
            <Skeleton width="30%" height={56} sx={{ mt: 2 }} />
            <Skeleton width="100%" height={100} sx={{ mt: 3 }} />
            <Skeleton variant="rounded" width="50%" height={48} sx={{ mt: 4, borderRadius: 3 }} />
          </Grid>
        </Grid>
      </Container>
    );
  }

  if (error || !product) {
    return (
      <Container maxWidth="lg" sx={{ py: 10, textAlign: "center" }}>
        <Typography variant="h5" color="text.secondary" fontWeight={700}>
          {error ?? "Producto no encontrado"}
        </Typography>
        <Button
          component={Link}
          href="/"
          startIcon={<ArrowBack />}
          variant="outlined"
          sx={{ mt: 3, borderRadius: 3, textTransform: "none", fontWeight: 700 }}
        >
          Volver al inicio
        </Button>
      </Container>
    );
  }

  const images = product.images?.length > 0 ? product.images : ["/window.svg"];
  const inStock = product.stock > 0;

  return (
    <Box bgcolor="grey.100" minHeight="100vh" pb={8}>
      <Container maxWidth="lg" sx={{ pt: 3 }}>
        {/* Breadcrumbs */}
        <Breadcrumbs sx={{ mb: 3, fontSize: 14 }}>
          <Link href="/" style={{ textDecoration: "none", color: "inherit" }}>
            Inicio
          </Link>
          {product.category?.fullPath && (
            <Typography color="text.secondary" fontSize={14}>
              {product.category.fullPath}
            </Typography>
          )}
          <Typography color="text.primary" fontSize={14} fontWeight={600}>
            {product.name}
          </Typography>
        </Breadcrumbs>

        <Grid container spacing={5}>
          {/* Image Gallery */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              sx={{
                position: "relative",
                bgcolor: "white",
                borderRadius: 4,
                overflow: "hidden",
                pt: "100%",
                boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
              }}
            >
              <Image
                src={images[selectedImage]}
                alt={product.name}
                fill
                style={{
                  objectFit: "contain",
                  padding: "32px",
                  mixBlendMode: "multiply",
                }}
                priority
              />

              {/* Image nav arrows */}
              {images.length > 1 && (
                <>
                  <IconButton
                    onClick={() => setSelectedImage((p) => (p > 0 ? p - 1 : images.length - 1))}
                    sx={{
                      position: "absolute",
                      left: 8,
                      top: "50%",
                      transform: "translateY(-50%)",
                      bgcolor: "rgba(255,255,255,0.85)",
                      "&:hover": { bgcolor: "white" },
                    }}
                  >
                    <ChevronLeft />
                  </IconButton>
                  <IconButton
                    onClick={() => setSelectedImage((p) => (p < images.length - 1 ? p + 1 : 0))}
                    sx={{
                      position: "absolute",
                      right: 8,
                      top: "50%",
                      transform: "translateY(-50%)",
                      bgcolor: "rgba(255,255,255,0.85)",
                      "&:hover": { bgcolor: "white" },
                    }}
                  >
                    <ChevronRight />
                  </IconButton>
                </>
              )}
            </Box>

            {/* Thumbnail strip */}
            {images.length > 1 && (
              <Stack direction="row" spacing={1.5} sx={{ mt: 2, justifyContent: "center" }}>
                {images.map((img, i) => (
                  <Box
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    sx={{
                      width: 64,
                      height: 64,
                      borderRadius: 2,
                      overflow: "hidden",
                      position: "relative",
                      cursor: "pointer",
                      border: selectedImage === i ? "2px solid" : "2px solid transparent",
                      borderColor: selectedImage === i ? "primary.main" : "transparent",
                      bgcolor: "white",
                      transition: "0.2s",
                      "&:hover": { borderColor: "primary.light" },
                    }}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} thumbnail ${i + 1}`}
                      fill
                      style={{ objectFit: "contain", padding: "4px" }}
                    />
                  </Box>
                ))}
              </Stack>
            )}
          </Grid>

          {/* Product Info */}
          <Grid size={{ xs: 12, md: 6 }}>
            {/* Category + Brand */}
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
              {product.category?.name && (
                <Chip
                  label={product.category.name}
                  size="small"
                  color="primary"
                  variant="outlined"
                  sx={{ fontWeight: 700, fontSize: 12 }}
                />
              )}
              {product.brand && (
                <Chip
                  label={product.brand}
                  size="small"
                  variant="outlined"
                  sx={{ fontWeight: 600, fontSize: 12, color: "text.secondary" }}
                />
              )}
            </Stack>

            <Typography variant="h4" fontWeight={900} sx={{ lineHeight: 1.2, mb: 2, color: "grey.900" }}>
              {product.name}
            </Typography>

            {/* Price */}
            <Typography
              variant="h3"
              fontWeight={900}
              sx={{
                color: "primary.dark",
                mb: 1,
              }}
            >
              ${parseFloat(product.price).toLocaleString()}
            </Typography>

            {/* Stock */}
            <Chip
              label={inStock ? "En stock" : "Agotado"}
              size="small"
              color={inStock ? "success" : "error"}
              sx={{ fontWeight: 700, mb: 3 }}
            />

            {/* Description */}
            {product.description && (
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ mb: 4, lineHeight: 1.7 }}
              >
                {product.description}
              </Typography>
            )}

            {/* Add to cart */}
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<AddShoppingCartOutlined />}
                disabled={!inStock}
                onClick={() => addItem({ productId: product.id })}
                sx={{
                  borderRadius: 3,
                  textTransform: "none",
                  fontWeight: 800,
                  fontSize: 16,
                  px: 4,
                  py: 1.5,
                  boxShadow: "0 4px 14px rgba(14, 165, 233, 0.35)",
                  "&:hover": { boxShadow: "0 6px 20px rgba(14, 165, 233, 0.45)" },
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

            {/* Trust badges */}
            <Box
              sx={{
                bgcolor: "white",
                borderRadius: 3,
                p: 2.5,
                mt: 2,
                boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
              }}
            >
              <Stack spacing={2}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <LocalShippingOutlined sx={{ color: "primary.main" }} />
                  <Typography variant="body2" fontWeight={600}>
                    Envío rápido disponible
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <VerifiedOutlined sx={{ color: "success.main" }} />
                  <Typography variant="body2" fontWeight={600}>
                    Producto 100% original
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <SupportAgentOutlined sx={{ color: "secondary.main" }} />
                  <Typography variant="body2" fontWeight={600}>
                    Soporte al cliente 24/7
                  </Typography>
                </Stack>
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
