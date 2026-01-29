"use client"
import React from 'react'
import {
  Paper,
  Typography,
  Avatar,
  Box,
  Button,
  Divider,
  Stack,
  useTheme,
  Chip,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  List
} from '@mui/material'
import { Logout, VerifiedUser, Person, ShoppingBag } from '@mui/icons-material'
import useMe from '@/app/api/user'
import { useRouter, usePathname } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'

export default function ProfileSidebar() {
  const { data: user } = useMe()
  const router = useRouter()
  const pathname = usePathname()
  const queryClient = useQueryClient()
  const theme = useTheme()

  const handleLogout = () => {
    localStorage.removeItem("access_token")
    queryClient.removeQueries()
    router.replace("/login")
  }

  const menuItems = [
    { text: 'Información Personal', icon: <Person />, path: '/profile' },
    { text: 'Mis Ordenes', icon: <ShoppingBag />, path: '/profile/orders' },
  ]

  return (
    <Paper elevation={0} sx={{
      p: 4,
      borderRadius: 4,
      border: `1px solid ${theme.palette.divider}`,
      position: { md: 'sticky' },
      top: 24
    }}>
      <Box sx={{ position: 'relative', display: 'inline-block', mb: 3, textAlign: 'center', width: '100%' }}>
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
          right: '50%',
          transform: 'translateX(350%)', // Approximate positioning
          bgcolor: 'success.main',
          width: 24,
          height: 24,
          borderRadius: '50%',
          border: '3px solid white'
        }} />
      </Box>

      <Box sx={{ textAlign: 'center' }}>
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
      </Box>

      <Divider sx={{ my: 3 }} />

      <List component="nav">
        {menuItems.map((item) => {
          const isActive = pathname === item.path
          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                component={Link}
                href={item.path}
                selected={isActive}
                sx={{
                  borderRadius: 2,
                  '&.Mui-selected': {
                    bgcolor: 'primary.lighter',
                    color: 'primary.main',
                    borderLeft: `4px solid ${theme.palette.primary.main}`,
                    '&:hover': { bgcolor: 'primary.lighter' }
                  }
                }}
              >
                <ListItemIcon sx={{ color: isActive ? 'primary.main' : 'text.secondary', minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: isActive ? 700 : 500 }} />
              </ListItemButton>
            </ListItem>
          )
        })}
      </List>

      <Divider sx={{ my: 3 }} />

      <Button
        variant="contained"
        color="error"
        startIcon={<Logout />}
        onClick={handleLogout}
        fullWidth
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
  )
}
