import { Box, Button, Container, Grid, Paper, Stack, Typography } from "@mui/material";
import HeroSlider from "./components/HeroSlider";
import TrustBar from "./components/TrustBar";
import ProductCard from "./components/ProductCard";

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

          <Grid container spacing={3} justifyContent={"center"}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((id) => (
              <Grid size={{ xs: 9, sm: 6, md: 4, lg: 3 }} key={id} >
                <ProductCard id={id} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}