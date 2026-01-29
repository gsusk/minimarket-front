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
import { Person, Email, Security } from '@mui/icons-material'
import useMe from '@/app/api/user'

export default function ProfilePage() {
  const { data: user } = useMe()
  const theme = useTheme()

  return (
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
  )
}
