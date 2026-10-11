"use client"
import React from 'react'
import { Container, Grid } from '@mui/material'
import ProfileSidebar from '@/app/components/ProfileSidebar'

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 6 } }}>
      <Grid container spacing={{ xs: 3, md: 4 }} alignItems="flex-start">
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
