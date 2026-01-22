"use client"
import { Typography, Stack, Grid, TextField, InputAdornment, Button, Link, Box, FormControl, FormHelperText, Input, InputLabel } from '@mui/material';
import { Person, Email, Lock } from '@mui/icons-material';
import { useState } from 'react';
import * as Yup from "yup"

const SignupSchema = Yup.object().shape({
  fistName: Yup.string().min(2, "Need to be at least 2 characters").required("First name is required."),
  lastName: Yup.string().min(2, "Need to be at least 2 characters").required("Last name is required"),
  email: Yup.string().email("Needs to be a valid email").required("Email is required."),
  password: Yup.string().min(6, "Password needs to be at least 6 characters").max(1024, "Too long").required("Passoword is required"),
})

export default function RegisterPage() {
  useState
  return (
    <>
      <Typography variant="h4" fontWeight={900} gutterBottom>
        Crea tu cuenta
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Completa tus datos para empezar tu experiencia.
      </Typography>

      <Stack component={"form"} spacing={3} maxWidth={{ xs: "370px", md: "400px", lg: "450px" }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }} pb={1}>
            <TextField
              fullWidth
              label="Nombre"
              placeholder="Ej. Carlos"
              slotProps={{
                input: { startAdornment: <InputAdornment position="start"><Person fontSize="small" /></InputAdornment> }
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField fullWidth label="Apellido" placeholder="Ej. Ortiz" />
          </Grid>
        </Grid>

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
        <Box p={1} justifyContent={"center"} width={"100%"} display={"flex"} pt={4}>
          <Button
            variant="contained"
            size='medium'
            type='submit'
            sx={{ py: 1.8, borderRadius: '12px', fontWeight: 800, }}
          >
            Registrarme ahora
          </Button>
        </Box>
        <Typography variant="body2" textAlign="center" color="text.secondary" py={4}>
          ¿Ya tienes una cuenta? {' '}
          <Link href="/login" sx={{ fontWeight: 700, textDecoration: 'none', color: 'primary.main' }}>
            Inicia sesión
          </Link>
        </Typography>
      </Stack >
    </>
  );
}