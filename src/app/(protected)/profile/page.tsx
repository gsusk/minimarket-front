"use client"
import React from 'react'
import {
  Paper,
  Typography,
  Box,
  Stack,
  Grid,
  useTheme,
  Chip
} from '@mui/material'
import { Email } from '@mui/icons-material'
import useMe from '@/app/api/user'

export default function ProfilePage() {
  const { data: user } = useMe()
  const theme = useTheme()

  const fieldSx = {
    p: 2,
    borderRadius: 1.5,
    border: `1px solid ${theme.palette.divider}`,
    bgcolor: 'grey.50',
    minHeight: 88
  }

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h5" fontWeight={700} gutterBottom sx={{ mb: 0.5 }}>
          Información personal
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
          Datos básicos asociados a tu cuenta.
        </Typography>

        <Paper elevation={0} sx={{ border: `1px solid ${theme.palette.divider}`, borderRadius: 2, overflow: 'hidden' }}>
          <Box sx={{ p: { xs: 2, md: 2.5 } }}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Box sx={fieldSx}>
                  <Typography variant="caption" color="text.secondary" fontWeight={700} display="block" gutterBottom>
                    Nombre
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {user?.firstName}
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Box sx={fieldSx}>
                  <Typography variant="caption" color="text.secondary" fontWeight={700} display="block" gutterBottom>
                    Apellido
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {user?.lastName}
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Box sx={fieldSx}>
                  <Typography variant="caption" color="text.secondary" fontWeight={700} display="block" gutterBottom>
                    Correo electrónico
                  </Typography>
                  <Typography variant="body1" fontWeight={600} sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
                    <Email fontSize="small" color="action" /> {user?.email}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Box>

      <Box>
        <Typography variant="h6" fontWeight={700} gutterBottom sx={{ mb: 2 }}>
          Cuenta
        </Typography>
        <Paper elevation={0} sx={{ border: `1px solid ${theme.palette.divider}`, borderRadius: 2, overflow: 'hidden' }}>
          <Box sx={{ p: { xs: 2, md: 2.5 } }}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Box sx={fieldSx}>
                  <Typography variant="caption" color="text.secondary" fontWeight={700} display="block" gutterBottom>
                    ID de cuenta
                  </Typography>
                  <Typography variant="body1" fontFamily="monospace" fontWeight={600}>
                    #{user?.id}
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Box sx={fieldSx}>
                  <Typography variant="caption" color="text.secondary" fontWeight={700} display="block" gutterBottom>
                    Estado
                  </Typography>
                  <Chip
                    label="Activo"
                    size="small"
                    variant="outlined"
                    sx={{ fontWeight: 700, borderRadius: 1, borderColor: 'divider', color: 'text.secondary' }}
                  />
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Box>
    </Stack>
  )
}
