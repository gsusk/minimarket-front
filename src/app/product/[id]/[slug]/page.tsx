import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Chip,
  Breadcrumbs,
  Stack,
} from "@mui/material";
import {
  ArrowBack,
  LocalShippingOutlined,
  VerifiedOutlined,
  SupportAgentOutlined,
} from "@mui/icons-material";
import Link from "next/link";
import { redirect } from "next/navigation";
import { DetailedProduct } from "../../../api/products";
import ProductImageGallery from "../../../components/ProductImageGallery";
import AddToCartSection from "../../../components/AddToCartSection";

type PageParams = Promise<{ id: string; slug: string }>;

async function fetchProduct(id: number): Promise<DetailedProduct | null> {
  try {
    const res = await fetch(`http://localhost:8080/products/${id}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export default async function ProductDetailPage({ params }: { params: PageParams }) {
  const { id, slug } = await params;
  const productId = Number(id);
  const product = await fetchProduct(productId);

  if (!product) {
    return (
      <Container maxWidth="lg" sx={{ py: 10, textAlign: "center" }}>
        <Typography variant="h5" color="text.secondary" fontWeight={700}>
          Producto no encontrado
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

  if (product.slug && slug?.trim().toLowerCase() !== product.slug) {
    redirect(`/product/${productId}/${product.slug}`);
  }

  const images = product.images?.length > 0 ? product.images : ["/window.svg"];
  const inStock = product.stock > 0;

  return (
    <Box bgcolor="grey.100" minHeight="100vh" pb={{ xs: 4, md: 8 }}>
      <Container maxWidth="lg" sx={{ pt: { xs: 2, md: 3 }, px: { xs: 2, sm: 3 } }}>
        <Breadcrumbs sx={{ mb: { xs: 2, md: 3 }, fontSize: 14, mt: 3 }}>
          <Link href="/" style={{ textDecoration: "none", color: "inherit" }}>
            Inicio
          </Link>
          {product.category?.fullPath && (
            <Typography color="text.secondary" fontSize={14}>
              {product.category.fullPath}
            </Typography>
          )}
          <Typography color="text.primary" fontSize={14} fontWeight={600} noWrap sx={{ maxWidth: 200 }}>
            {product.name}
          </Typography>
        </Breadcrumbs>

        <Grid container spacing={{ xs: 3, md: 5 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <ProductImageGallery images={images} productName={product.name} />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
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

            <Typography
              variant="h4"
              fontWeight={900}
              sx={{ lineHeight: 1.2, mb: 2, color: "grey.900", fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2.125rem' } }}
            >
              {product.name}
            </Typography>

            <Typography
              variant="h3"
              fontWeight={900}
              sx={{
                color: "primary.dark",
                mb: 1,
                fontSize: { xs: '1.75rem', sm: '2rem', md: '3rem' },
              }}
            >
              ${parseFloat(product.price).toLocaleString()}
            </Typography>

            <Chip
              label={inStock ? "En stock" : "Agotado"}
              size="small"
              color={inStock ? "success" : "error"}
              sx={{ fontWeight: 700, mb: 3 }}
            />

            {product.description && (
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ mb: 4, lineHeight: 1.7 }}
              >
                {product.description}
              </Typography>
            )}

            <AddToCartSection productId={product.id} inStock={inStock} />

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
