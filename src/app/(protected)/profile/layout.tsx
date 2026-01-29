"use client"
import React from 'react'
import { Container, Grid, CircularProgress, Box } from '@mui/material'
import ProfileSidebar from '@/app/components/ProfileSidebar'
import useMe from '@/app/api/user'

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  const { isLoading } = useMe()

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
        {/* Left Sidebar */}
        <Grid size={{ xs: 12, md: 4 }}>
          <ProfileSidebar />
        </Grid>

        {/* Right Content */}
        <Grid size={{ xs: 12, md: 8 }}>
          {children}
        </Grid>
      </Grid>
    </Container>
  )
}
