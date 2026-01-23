"use client"
import { Typography, Stack, Grid, TextField, InputAdornment, Button, Link, Box } from '@mui/material';
import { Person, Email, Lock } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from "yup"
import { register } from '../../api/auth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { AppError, ValidationError } from '@/app/utils/errors';

const SignupSchema = Yup.object().shape({
  firstName: Yup.string().trim().min(2, "Need to be at least 2 characters").required("First name is required."),
  lastName: Yup.string().trim().min(2, "Need to be at least 2 characters").required("Last name is required"),
  email: Yup.string().trim().email("Needs to be a valid email").required("Email is required."),
  password: Yup.string().trim().min(6, "Password needs to be at least 6 characters").max(1024, "Too long").required("Passoword is required"),
})

export default function RegisterPage() {
  const [generalError, setGeneralError] = useState<string | null>(null)
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: register,
    onSuccess: (data) => {
      localStorage.setItem('access_token', data.accessToken);
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
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    },
    validationSchema: SignupSchema,
    onSubmit: (values) => mutate(values),
  })

  return (
    <>
      <Typography variant="h4" fontWeight={900} gutterBottom>
        Crea tu cuenta
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Completa tus datos para empezar tu experiencia.
      </Typography>

      <Stack component={"form"} spacing={3} maxWidth={{ xs: "370px", md: "400px", lg: "450px" }} onSubmit={formik.handleSubmit} onChange={() => setGeneralError(null)}>
        <Grid container spacing={{ xs: 3, md: 2 }}>
          <Grid size={{ xs: 12, md: 6 }} >
            <TextField
              id='firstName'
              name='firstName'
              fullWidth
              label="Nombre"
              placeholder="Carlos..."
              error={formik.touched.firstName && Boolean(formik.errors.firstName)}
              helperText={formik.touched.firstName && formik.errors.firstName ? formik.errors.firstName : ' '}
              value={formik.values.firstName}
              onChange={formik.handleChange}
              slotProps={{
                input: { startAdornment: <InputAdornment position="start"><Person fontSize="small" /></InputAdornment> }
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              id='lastName'
              name='lastName'
              fullWidth
              label="Apellido"
              placeholder="Ortiz..."
              error={formik.touched.lastName && Boolean(formik.errors.lastName)}
              helperText={formik.touched.lastName && formik.errors.lastName ? formik.errors.lastName : ' '}
              value={formik.values.lastName}
              onChange={formik.handleChange}
              slotProps={{
                input: { startAdornment: <InputAdornment position="start"><Person fontSize="small" /></InputAdornment> }
              }} />
          </Grid>
        </Grid>

        <TextField
          fullWidth
          name='email'
          id='email'
          label="Correo Electrónico"
          type="email"
          placeholder='ejemplo@email.com'
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email ? formik.errors.email : ' '}
          value={formik.values.email}
          onChange={formik.handleChange}
          slotProps={{
            input: { startAdornment: <InputAdornment position="start"><Email fontSize="small" /></InputAdornment> }
          }}

        />

        <TextField
          fullWidth
          name='password'
          id='password'
          label="Contraseña"
          type="password"
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password ? formik.errors.password : ' '}
          value={formik.values.password}
          onChange={formik.handleChange}
          slotProps={{
            input: { startAdornment: <InputAdornment position="start"><Lock fontSize="small" /></InputAdornment> }
          }}
        />
        <Box sx={{ color: "error.main" }} component={"div"} visibility={generalError ? "visible" : "hidden"}>{generalError || "*"}</Box>
        < Box pb={2} justifyContent={"center"} width={"100%"} display={"flex"} pt={2}>
          <Button
            variant="contained"
            size='medium'
            type='submit'
            disabled={isPending}
            sx={{ py: 1.8, borderRadius: '12px', fontWeight: 800, }}
          >
            Registrarme ahora
          </Button>
        </Box>
        <Typography variant="body2" textAlign="center" color="text.secondary" pb={4}>
          ¿Ya tienes una cuenta? {' '}
          <Link href="/login" sx={{ fontWeight: 700, textDecoration: 'none', color: 'primary.main' }}>
            Inicia sesión
          </Link>
        </Typography>
      </Stack >
    </>
  );
}