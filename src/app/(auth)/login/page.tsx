import { Typography, Stack, TextField, InputAdornment, Button, Link, Box } from '@mui/material';
import { Email, Lock } from '@mui/icons-material';

export default function LoginPage() {
  return (
    <>
      <Typography variant="h4" fontWeight={900} gutterBottom>
        Bienvenido de nuevo
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Ingresa tus credenciales para acceder.
      </Typography>

      <Stack spacing={3}>
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

        <Box p={1} justifyContent={"center"} width={"100%"} display={"flex"}>
          <Button
            variant="contained"
            size="large"
            sx={{ py: 1.8, borderRadius: '12px', fontWeight: 800 }}
          >
            Iniciar Sesión
          </Button>
        </Box>

        <Typography variant="body2" textAlign="center" color="text.secondary">
          ¿No tienes una cuenta? {' '}
          <Link href="/register" sx={{ fontWeight: 700, textDecoration: 'none', color: 'primary.main' }}>
            Regístrate aquí
          </Link>
        </Typography>
      </Stack>
    </>
  );
}