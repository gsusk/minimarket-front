"use client"
import { Typography, Stack, TextField, InputAdornment, Button, Link, Box } from '@mui/material';
import { Email, Lock } from '@mui/icons-material';
import * as Yup from "yup"
import { useFormik } from 'formik';
import { login } from '../../api/auth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AppError, ValidationError } from '../../utils/errors';

const SiginSchema = Yup.object().shape({
  email: Yup.string().trim().email("Needs to be a valid email").required("Email is required."),
  password: Yup.string().trim().min(6, "Password needs to be at least 6 characters").max(1024, "Too long").required("Passoword is required"),
}).required()

export default function LoginPage() {
  const [generalError, setGeneralError] = useState<string | null>()
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      localStorage.setItem('access_token', data.accessToken);
      useQueryClient().invalidateQueries({ queryKey: ["me"] })
      router.push('/dashboard');
    },
    onError: (error: AppError) => {
      const formikErrors: Record<string, string> = {};

      if (error instanceof ValidationError) {
        error.issues.forEach((issue) => {
          formikErrors[issue.field] = issue.message;
        });
        formik.setErrors(formikErrors);
      } else {
        setGeneralError(error.message);
      }
    }
  })

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: SiginSchema,
    onSubmit: (values) => mutate(values)
  })

  return (
    <>
      <Box width={{ xs: "370px", sm: "400px", md: "450px" }}>
        <Typography variant="h4" fontWeight={900} gutterBottom>
          Bienvenido de nuevo
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Ingresa tus credenciales para acceder.
        </Typography>

        <Stack spacing={4} component={"form"} onSubmit={formik.handleSubmit} onChange={() => { if (generalError != null) setGeneralError(null) }} >
          <TextField
            fullWidth
            id='email'
            name='email'
            label="Correo Electrónico"
            value={formik.values.email}
            error={formik.touched.email && Boolean(formik.errors.email)}
            onChange={formik.handleChange}
            helperText={formik.touched.email && formik.errors.email ? formik.errors.email : ' '}
            slotProps={{
              input: { startAdornment: <InputAdornment position="start"><Email fontSize="small" /></InputAdornment> }
            }}
          />

          <TextField
            fullWidth
            id='password'
            name='password'
            label="Contraseña"
            type="password"
            value={formik.values.password}
            error={formik.touched.password && Boolean(formik.errors.password)}
            onChange={formik.handleChange}
            helperText={formik.touched.password && formik.errors.password ? formik.errors.password : ' '}
            slotProps={{
              input: { startAdornment: <InputAdornment position="start"><Lock fontSize="small" /></InputAdornment> }
            }}
          />
          <Box sx={{ color: "error.main" }} component={"div"} visibility={generalError ? "visible" : "hidden"}>{generalError || "*"}</Box>
          <Box p={1} justifyContent={"center"} width={"100%"} display={"flex"} pt={3}>
            <Button
              variant="contained"
              size="large"
              type='submit'
              disabled={isPending}
              sx={{ py: 1.8, borderRadius: '12px', fontWeight: 800 }}
            >
              Iniciar Sesión
            </Button>
          </Box>

          <Typography variant="body2" textAlign="center" color="text.secondary">
            ¿No tienes una cuenta? {' '}
            <Link href="/register" sx={{ fontWeight: 700, textDecoration: 'none', color: 'primary.main' }}>
              Regístrate aquí
            </Link>
          </Typography>
        </Stack>
      </Box>
    </>
  );
}