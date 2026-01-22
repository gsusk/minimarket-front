"use client"
import { Typography, Stack, TextField, InputAdornment, Button, Link, Box } from '@mui/material';
import { Email, Lock } from '@mui/icons-material';
import * as Yup from "yup"
import { useFormik } from 'formik';
import api from '@/app/api/api';

const SiginSchema = Yup.object().shape({
  email: Yup.string().trim().email("Needs to be a valid email").required("Email is required."),
  password: Yup.string().trim().min(6, "Password needs to be at least 6 characters").max(1024, "Too long").required("Passoword is required"),
}).required()

export default function LoginPage() {
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: SiginSchema,
    onSubmit: async (values) => {
      await api.post("/auth/login", values).then((d) => console.log("success: ", d)).catch((err) => {
        if (!err.response.data.errors) {
          return console.log(err.response.data)
        }
        const fields = err.response.data.errors.reduce((acc, err) => {
          acc[err.field] = err.detail
          return acc
        }, {})
        formik.setErrors(fields)
      })
    },
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

        <Stack spacing={4} component={"form"} onSubmit={formik.handleSubmit} >
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

          <Box p={1} justifyContent={"center"} width={"100%"} display={"flex"} pt={3}>
            <Button
              variant="contained"
              size="large"
              type='submit'
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

function setError(title: any): any {
  throw new Error('Function not implemented.');
}
