import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Chip,
  Breadcrumbs,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
} from "@mui/material";
import {
  ArrowBack,
  ExpandMore,
  DescriptionOutlined,
  InfoOutlined,
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
    <Box bgcolor="#fff" minHeight="100vh" pb={{ xs: 8, md: 12 }} >
      <Container maxWidth="lg" sx={{ pt: { xs: 2, md: 4 }, px: { xs: 2, sm: 4 } }}>
        <Breadcrumbs sx={{ mb: { xs: 4, md: 6 }, fontSize: 14, mt: 2 }}>
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
              variant="h1"
              fontWeight={800}
              sx={{
                lineHeight: 1.1,
                mb: 2,
                color: "grey.900",
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                letterSpacing: "-0.02em"
              }}
            >
              {product.name}
            </Typography>

            <Typography
              variant="h2"
              fontWeight={600}
              sx={{
                color: "text.primary",
                mb: 3,
                fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2.25rem' },
                letterSpacing: "-0.02em"
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

            {product.attributes && Object.keys(product.attributes).length > 0 && (
              <Box sx={{ mt: 5 }}>
                <Accordion elevation={0} defaultExpanded sx={{ '&:before': { display: 'none' }, borderBottom: '1px solid', borderColor: 'grey.200' }}>
                  <AccordionSummary expandIcon={<ExpandMore />} sx={{ px: 0 }}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <InfoOutlined sx={{ color: "primary.main" }} />
                      <Typography fontWeight={600} fontSize={16}>Especificaciones</Typography>
                    </Stack>
                  </AccordionSummary>
                  <AccordionDetails sx={{ px: 0, pb: 2 }}>
                    <TableContainer component={Paper} elevation={0} variant="outlined">
                      <Table size="small">
                        <TableBody>
                          {Object.entries(product.attributes).map(([key, value]) => (
                            <TableRow key={key}>
                              <TableCell component="th" scope="row" sx={{ fontWeight: 600, color: 'text.secondary', width: '40%', textTransform: 'capitalize' }}>
                                {key.replace(/_/g, ' ')}
                              </TableCell>
                              <TableCell>{String(value)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </AccordionDetails>
                </Accordion>
              </Box>
            )}

            <Box sx={{ mt: product.attributes && Object.keys(product.attributes).length > 0 ? 0 : 5 }}>
              <Accordion elevation={0} sx={{ '&:before': { display: 'none' }, borderBottom: '1px solid', borderColor: 'grey.200' }}>
                <AccordionSummary expandIcon={<ExpandMore />} sx={{ px: 0 }}>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <DescriptionOutlined sx={{ color: "primary.main" }} />
                    <Typography fontWeight={600} fontSize={16}>Detalles Adicionales</Typography>
                  </Stack>
                </AccordionSummary>
                <AccordionDetails sx={{ px: 0, pb: 2, color: "text.secondary" }}>
                  <Typography variant="body2" lineHeight={1.6}>
                    Este producto ha sido verificado en nuestro centro de calidad para asegurar que cumple con todos los estándares especificados por la marca. Empaque original garantizado.
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
