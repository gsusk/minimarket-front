import { Box, Container, Divider, Grid, Paper, Stack, Typography } from '@mui/material'
import Link from 'next/link'

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        width: "100%",
        bgcolor: "grey.900",
        color: "grey.300",
        borderTop: "1px solid",
        borderColor: "divider",
        pt: 6,
        pb: 4
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} justifyContent="space-between">

          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Stack spacing={2} alignItems={{ xs: 'center', md: 'flex-start' }} textAlign={{ xs: 'center', md: 'left' }}>
              <Typography variant="h6" color="white" fontWeight={700}>
                Sobre nosotros
              </Typography>
              <Link href="/" color="inherit" >Quienes Somos</Link>
              <Typography variant="body2">NIT: XXX.XXX.XXX.XXX</Typography>
              <Typography variant="body2">
                Dirección: Carrera No. XXY-XX. Medellín, Antioquia
              </Typography>
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <Stack spacing={2} alignItems={{ xs: 'center', md: 'flex-start' }} textAlign={{ xs: 'center', md: 'left' }}>
              <Typography variant="h6" color="white" fontWeight={700}>
                Sitio
              </Typography>
              <Link href="/" color="inherit" >Mapa del sitio</Link>
              <Link href="/" color="inherit" >FAQ</Link>
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 4 }}>
            <Stack spacing={2} alignItems={{ xs: 'center', md: 'flex-start' }} textAlign={{ xs: 'center', md: 'left' }}>
              <Typography variant="h6" color="white" fontWeight={700}>
                Contáctanos
              </Typography>
              <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                satehortuamercado@gmail.com
              </Typography>
              <Typography variant="body2">Teléfono: 3008544641</Typography>
            </Stack>
          </Grid>

        </Grid>

        <Divider sx={{ my: 4, bgcolor: 'grey.800' }} />

        <Typography variant="body2" align="center" color="grey.500">
          © {new Date().getFullYear()} Mmark. Todos los derechos reservados.
        </Typography>
      </Container>
    </Box >
  );
}