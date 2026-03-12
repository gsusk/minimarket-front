import { Box, Button, Container, Grid, Stack, Typography } from "@mui/material";
import HeroSlider from "./components/HeroSlider";
import TrustBar from "./components/TrustBar";
import ProductCard from "./components/ProductCard";
import { DetailedProduct, Product } from "./api/products";

async function fetchFeaturedProducts(): Promise<Product[]> {
  try {
    const res = await fetch("http://localhost:8080/products/featured", {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const data: DetailedProduct[] = await res.json();
    return data.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      category: p.category?.name ?? "",
      price: parseFloat(p.price),
      brand: p.brand,
      creationDate: p.listedAt,
      images: p.images,
    })).sort((a, b) => {
      if (a.name < b.name) {
        return -1
      }
      if (a.name > b.name) {
        return 1
      }
      return 0
    });
  } catch {
    return [];
  }
}

export default async function Home() {
  const featuredProducts = await fetchFeaturedProducts();

  return (
    <Box bgcolor={"grey.100"} pb={8}>
      <Container maxWidth="lg" sx={{ pt: 2 }}>
        <HeroSlider />
        <TrustBar />
        <Box sx={{ mt: 8 }}>
          <Stack
            direction="row"
            justifyContent={{ xs: "center", sm: "space-between" }}
            alignItems="flex-end"
            sx={{ mb: 6 }}
          >
            <Box mx={{ xs: "1.9rem" }} textAlign={{ xs: "center", sm: "center", md: "start" }}>
              <Typography variant="h4" sx={{ fontWeight: 900, color: 'text.primary', letterSpacing: '-0.02em' }}>
                Ofertas de la Semana
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Los mejores precios en tecnología seleccionada.
              </Typography>
            </Box>
            <Button variant="outlined" sx={{ display: { xs: "none", sm: "block" }, borderRadius: '10px', fontWeight: 700, textTransform: 'none' }}>
              Ver todo
            </Button>
          </Stack>
          {featuredProducts.length === 0 ? (
            <Typography color="text.secondary" textAlign="center" py={8}>
              No hay productos disponibles en este momento.
            </Typography>
          ) : (
            <Grid container spacing={3} justifyContent={"center"}>
              {featuredProducts.map((product) => (
                <Grid size={{ xs: 9, sm: 6, md: 4, lg: 3 }} key={product.id}>
                  <ProductCard product={product} />
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Container>
    </Box>
  );
}

