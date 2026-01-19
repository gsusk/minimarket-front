import { Typography, Stack, Grid, TextField, InputAdornment, Button, Link } from '@mui/material';
import { Person, Email, Lock } from '@mui/icons-material';

export default function RegisterPage() {
  return (
    <>
      <Typography variant="h4" fontWeight={900} gutterBottom>
        Crea tu cuenta
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Completa tus datos para empezar tu experiencia.
      </Typography>

      <Stack spacing={3}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Nombre"
              placeholder="Ej. Carlos"
              slotProps={{
                input: { startAdornment: <InputAdornment position="start"><Person fontSize="small" /></InputAdornment> }
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField fullWidth label="Apellido" placeholder="Ej. Ortiz" />
          </Grid>
        </Grid>

        <TextField
          fullWidth
          label="Correo Electrónico"
          type="email"
          slotProps={{
            input: { startAdornment: <InputAdornment position="start"><Email fontSize="small" /></InputAdornment> }
          }}
        />

        <TextField
          fullWidth
          label="Contraseña"
          type="password"
          slotProps={{
            input: { startAdornment: <InputAdornment position="start"><Lock fontSize="small" /></InputAdornment> }
          }}
        />

        <Button
          variant="contained"
          fullWidth
          size="large"
          sx={{ py: 1.8, borderRadius: '12px', fontWeight: 800 }}
        >
          Registrarme ahora
        </Button>

        <Typography variant="body2" textAlign="center" color="text.secondary">
          ¿Ya tienes una cuenta? {' '}
          <Link href="/login" sx={{ fontWeight: 700, textDecoration: 'none', color: 'primary.main' }}>
            Inicia sesión
          </Link>
        </Typography>
      </Stack>
    </>
  );
}