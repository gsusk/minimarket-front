import { Box, Button, Container, Grid, Stack, Typography } from "@mui/material";
import HeroSlider from "./components/HeroSlider";
import TrustBar from "./components/TrustBar";
import ProductCard from "./components/ProductCard";
import { Product } from "./api/products";

const featuredProducts: Product[] = [
  {
    id: 101,
    name: "PC Gamer Ryzen 7 5700G 16GB RAM",
    category: "Gaming",
    price: 3299000,
    brand: "Power Group",
    creationDate: "2026-03-08T00:00:00.000Z",
    images: ["/computador-pc-torre-gamer-power-l38-amd-ryzen-7-5700g-ssd-128-hdd-1tb-ram-16gb-led-22-pulgadas.webp"],
  },
  {
    id: 102,
    name: "Nevera LG InstaView 611L",
    category: "Appliances",
    price: 4899000,
    brand: "LG",
    creationDate: "2026-03-08T00:00:00.000Z",
    images: ["/LG_REF_GR-H812HLHM_9.webp"],
  },
  {
    id: 103,
    name: 'Monitor ultrawide 34" 144Hz',
    category: "Accessories",
    price: 1799000,
    brand: "ViewPlus",
    creationDate: "2026-03-08T00:00:00.000Z",
    images: ["/photo-1546435770-a3e426bf472b.avif"],
  },
  {
    id: 104,
    name: "Audifonos bluetooth con cancelacion de ruido",
    category: "Audio",
    price: 549000,
    brand: "Pulse",
    creationDate: "2026-03-08T00:00:00.000Z",
    images: ["/unnamed.jpg"],
  },
];

export default function Home() {
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
          {/*TODO: mover a su propio componente!!*/}
          <Grid container spacing={3} justifyContent={"center"}>
            {featuredProducts.map((product) => (
              <Grid size={{ xs: 9, sm: 6, md: 4, lg: 3 }} key={product.id} >
                <ProductCard product={product} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}
