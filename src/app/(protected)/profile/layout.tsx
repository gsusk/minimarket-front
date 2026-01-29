"use client"
import React from 'react'
import { Container, Grid, CircularProgress, Box } from '@mui/material'
import ProfileSidebar from '@/app/components/ProfileSidebar'

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 4 }}>
          <ProfileSidebar />
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          {children}
        </Grid>
      </Grid>
    </Container>
  )
}
