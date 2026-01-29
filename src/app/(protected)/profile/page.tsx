"use client"
import {
  Container,
  Paper,
  Typography,
  Avatar,
  Box,
  Button,
  Divider,
  Stack,
  CircularProgress,
  Grid,
  useTheme,
  Chip
} from '@mui/material'
import { Logout, Person, Email, CalendarToday, VerifiedUser, Security } from '@mui/icons-material'
import useMe from '@/app/api/user'
import { useRouter } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'

export default function ProfilePage() {
  const { data: user, isLoading } = useMe()
  const router = useRouter()
  const theme = useTheme()

  const handleLogout = () => {
    //implementar logout
    router.replace("/login")
  }

  if (isLoading) {
    return (
      <Container maxWidth="sm" sx={{ minHeight: "80vh", display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress size={60} thickness={4} />
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper elevation={0} sx={{
            p: 4,
            borderRadius: 4,
            textAlign: 'center',
            border: `1px solid ${theme.palette.divider}`,
            position: { md: 'sticky' },
            top: 24
          }}>
            <Box sx={{ position: 'relative', display: 'inline-block', mb: 3 }}>
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  margin: '0 auto',
                  bgcolor: 'primary.main',
                  fontSize: '3rem',
                  fontWeight: 'bold',
                  boxShadow: theme.shadows[4]
                }}
              >
                {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
              </Avatar>
              <Box sx={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                bgcolor: 'success.main',
                width: 24,
                height: 24,
                borderRadius: '50%',
                border: '3px solid white'
              }} />
            </Box>

            <Typography variant="h5" fontWeight="800" gutterBottom noWrap title={`${user?.firstName} ${user?.lastName}`}>
              {user?.firstName} {user?.lastName}
            </Typography>
            <Chip
              icon={<VerifiedUser sx={{ fontSize: '1rem !important' }} />}
              label="Cliente Verificado"
              color="primary"
              size="small"
              sx={{ fontWeight: 'bold', mb: 3 }}
            />

            <Divider sx={{ my: 3 }} />

            <Typography variant="body2" color="text.secondary" paragraph>
              Usuario registrado y activo.
            </Typography>

            <Button
              variant="contained"
              color="error"
              startIcon={<Logout />}
              onClick={handleLogout}
              sx={{
                borderRadius: 2,
                py: 1.5,
                fontWeight: 'bold',
                boxShadow: theme.shadows[2],
                textTransform: 'none',
              }}
            >
              Cerrar Sesión
            </Button>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <Stack spacing={4}>
            <Box>
              <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Box sx={{ p: 1, borderRadius: 1.5, bgcolor: 'primary.light', color: 'primary.contrastText', display: 'flex' }}>
                  <Person fontSize="small" />
                </Box>
                Información Personal
              </Typography>
              <Paper elevation={0} sx={{ border: `1px solid ${theme.palette.divider}`, borderRadius: 3, overflow: 'hidden' }}>
                <Box sx={{ p: 3 }}>
                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography variant="caption" color="text.secondary" fontWeight="bold" display="block" gutterBottom>
                        NOMBRE
                      </Typography>
                      <Typography variant="body1" fontWeight="500">
                        {user?.firstName}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography variant="caption" color="text.secondary" fontWeight="bold" display="block" gutterBottom>
                        APELLIDO
                      </Typography>
                      <Typography variant="body1" fontWeight="500">
                        {user?.lastName}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <Typography variant="caption" color="text.secondary" fontWeight="bold" display="block" gutterBottom>
                        CORREO ELECTRÓNICO
                      </Typography>
                      <Typography variant="body1" fontWeight="500" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Email fontSize="small" color="action" /> {user?.email}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </Paper>
            </Box>

            <Box>
              <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Box sx={{ p: 1, borderRadius: 1.5, bgcolor: 'secondary.light', color: 'secondary.contrastText', display: 'flex' }}>
                  <Security fontSize="small" />
                </Box>
                Seguridad de la Cuenta
              </Typography>
              <Paper elevation={0} sx={{ border: `1px solid ${theme.palette.divider}`, borderRadius: 3, overflow: 'hidden' }}>
                <Box sx={{ p: 3 }}>
                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography variant="caption" color="text.secondary" fontWeight="bold" display="block" gutterBottom>
                        ID DE CUENTA
                      </Typography>
                      <Typography variant="body1" fontFamily="monospace" sx={{ bgcolor: 'grey.100', px: 1, borderRadius: 1, display: 'inline-block' }}>
                        #{user?.id}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography variant="caption" color="text.secondary" fontWeight="bold" display="block" gutterBottom>
                        ESTADO DE MEMBRESÍA
                      </Typography>
                      <Chip label="ACTIVO" size="small" color="success" variant="outlined" sx={{ fontWeight: 'bold', borderRadius: 1 }} />
                    </Grid>
                  </Grid>
                </Box>
              </Paper>
            </Box>
          </Stack>
        </Grid>
      </Grid>
    </Container>
  )
}
