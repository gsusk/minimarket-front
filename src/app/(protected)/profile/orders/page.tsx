"use client"
import React from 'react'
import { Box, Typography, Paper, Alert } from '@mui/material'
import { ShoppingBag } from '@mui/icons-material'

export default function OrdersPage() {
  return (
    <Box>
      <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <Box sx={{ p: 1, borderRadius: 1.5, bgcolor: 'primary.light', color: 'primary.contrastText', display: 'flex' }}>
          <ShoppingBag fontSize="small" />
        </Box>
        Mis Ordenes
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        Aquí podrás visualizar tu historial de compras.
      </Alert>

      <Paper elevation={0} sx={{ p: 4, textAlign: 'center', borderRadius: 3, border: '1px dashed grey', bgcolor: 'grey.50' }}>
        <Typography variant="body1" color="text.secondary">
          No tienes ordenes recientes.
        </Typography>
      </Paper>
    </Box>
  )
}
