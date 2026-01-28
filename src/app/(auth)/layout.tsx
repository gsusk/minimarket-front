import { Box, Grid, Typography, Button, Container } from '@mui/material';
import { ArrowBack, RedeemOutlined } from '@mui/icons-material';
import Link from 'next/link';

export default async function AuthLayout({ children }: {
  children: React.ReactNode;
}) {
  return (
    <Grid container sx={{ minHeight: '100vh', bgcolor: 'background.paper' }}>

      <Grid size={{ xs: 0, md: 6 }} sx={{
        position: 'relative',
        display: { xs: 'none', md: 'flex' },
        flexDirection: 'column',
        justifyContent: 'center',
        p: 8,
        bgcolor: 'primary.main',
        color: 'white'
      }}>

        <Box sx={{ zIndex: 2 }} p={2}>
          <Typography variant="h2" fontWeight={900} gutterBottom>MMARK</Typography>
          <Typography variant="h5" sx={{ opacity: 0.9, maxWidth: '400px' }}>
            Únete para obtener beneficios exclusivos.
          </Typography>
          <Box py={4}>
            <RedeemOutlined
              sx={{
                fontSize: { md: "5rem" },
                color: 'white',
                filter: 'drop-shadow(0px 10px 15px rgba(0,0,0,0.2))'
              }}
            />
          </Box>
        </Box>

        <Box sx={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          opacity: 0.1, backgroundImage: 'radial-gradient(circle, #fff 1.1px, transparent 1.1px)',
          backgroundSize: '20px 20px'
        }} />
      </Grid>

      <Grid size={{ xs: 12, md: 6 }} sx={{ display: 'flex', pt: { xs: "5rem" } }}>
        <Container maxWidth="sm" component={"div"} sx={{ display: "flex", justifyContent: "center" }}>
          <Box component={"div"} sx={{ p: { xs: 2, md: 4 } }}>

            <Link href={"/"}>
              <Button
                startIcon={<ArrowBack />}
                sx={{ mb: 4, textTransform: 'none', color: 'text.secondary' }}
              >
                Volver a la tienda
              </Button>
            </Link>
            {children}
          </Box>
        </Container>
      </Grid>
    </Grid>
  );
}