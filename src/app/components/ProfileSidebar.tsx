"use client"
import {
  Paper,
  Typography,
  Avatar,
  Box,
  Button,
  Divider,
  useTheme,
  Chip,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  List
} from '@mui/material'
import { Logout, Person, ShoppingBag } from '@mui/icons-material'
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
    { text: 'Mis Órdenes', icon: <ShoppingBag />, path: '/profile/orders' },
  ]

  return (
    <Paper elevation={0} sx={{
      p: { xs: 2.5, md: 3 },
      borderRadius: 2,
      border: `1px solid ${theme.palette.divider}`,
      position: { md: 'sticky' },
      top: 24,
      bgcolor: 'background.paper'
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2.5 }}>
        <Avatar
          sx={{
            width: 56,
            height: 56,
            bgcolor: 'grey.900',
            fontSize: '1rem',
            fontWeight: 700,
            color: 'common.white'
          }}
        >
          {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
        </Avatar>
        <Box minWidth={0}>
          <Typography variant="subtitle1" fontWeight={700} noWrap title={`${user?.firstName} ${user?.lastName}`}>
            {user?.firstName} {user?.lastName}
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap title={user?.email}>
            {user?.email}
          </Typography>
          <Chip
            label="Cuenta activa"
            size="small"
            variant="outlined"
            sx={{
              mt: 1,
              height: 22,
              borderRadius: 1,
              color: 'text.secondary',
              borderColor: 'divider',
              fontWeight: 600
            }}
          />
        </Box>
      </Box>

      <Divider sx={{ my: 2.5 }} />

      <List component="nav" disablePadding>
        {menuItems.map((item) => {
          const isActive = pathname === item.path
          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                component={Link}
                href={item.path}
                selected={isActive}
                disabled={user?.role != "USER"}
                sx={{
                  borderRadius: 1.5,
                  px: 1.5,
                  py: 1.1,
                  color: 'text.secondary',
                  '&.Mui-selected': {
                    bgcolor: 'grey.100',
                    color: 'text.primary',
                    '&:hover': { bgcolor: 'grey.100' }
                  },
                  '&:hover': {
                    bgcolor: 'grey.50'
                  }
                }}
              >
                <ListItemIcon sx={{ color: isActive ? 'text.primary' : 'text.disabled', minWidth: 36, '& svg': { fontSize: 20 } }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: isActive ? 700 : 500 }} />
              </ListItemButton>
            </ListItem>
          )
        })}
      </List>

      <Divider sx={{ my: 2.5 }} />

      <Button
        variant="outlined"
        startIcon={<Logout />}
        onClick={handleLogout}
        fullWidth
        sx={{
          borderRadius: 1.5,
          py: 1.1,
          fontWeight: 700,
          textTransform: 'none',
          color: 'text.primary',
          borderColor: 'divider',
          '&:hover': {
            borderColor: 'grey.500',
            bgcolor: 'grey.50'
          }
        }}
      >
        Cerrar Sesión
      </Button>
    </Paper>
  )
}
