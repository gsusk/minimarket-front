"use client";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, EffectFade } from 'swiper/modules';
import { Box, Container, Typography, Button, Stack, Paper } from '@mui/material';
import Image from 'next/image';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

//TODO: CAMBIAR POR REALES
const DATA_SLIDE_TEMPORAL = [
  {
    title: "El Futuro Del Sonido",
    subtitle: "RECIEN LLEGADO",
    description: "Cancelacion de sonido premium para audifonos para experiencia de audio definitiva",
    img: "/photo-1546435770-a3e426bf472b.avif",
    color: "#f8fafc",
    btnColor: "#0284c7"
  },
  {
    title: "Para Refrescar tu Cocina",
    subtitle: "Hasta 30% de Descuento!",
    description: "Actualiza al ultimo Refrigerador LG Smart con tecnologia puerta a puerta.",
    img: "/LG_REF_GR-H812HLHM_9.webp",
    color: "#f0fdf4",
    btnColor: "#16a34a"
  },
  {
    title: "Experiencia Gaming Sin Limites",
    subtitle: "EDICION LIMITADA",
    description: "Pre-ordena las ultimas consolas y accesorios a precios exclusivos.",
    img: "/computador-pc-torre-gamer-power-l38-amd-ryzen-7-5700g-ssd-128-hdd-1tb-ram-16gb-led-22-pulgadas.webp",
    color: "#faf5ff",
    btnColor: "#7c3aed"
  }
];

export default function HeroSlider() {
  return (
    <Box my={2} sx={{
      "& .swiper-pagination-bullet-active": { bgcolor: "primary.main", width: 24, borderRadius: 1 },
      "& .swiper-pagination-bullet": { transition: 'all 0.3s' }
    }}>
      <Paper>
        <Swiper
          modules={[Pagination, Autoplay, EffectFade]}
          effect="fade"
          slidesPerView={1}
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          loop={true}
        >
          {DATA_SLIDE_TEMPORAL.map((slide, index) => (
            <SwiperSlide key={index}>
              <Box sx={{
                bgcolor: slide.color,
                minHeight: { xs: '500px', md: '550px' },
                display: 'flex',
                alignItems: 'center',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <Container maxWidth="lg">
                  <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} alignItems="center" justifyContent="space-between">

                    <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' }, zIndex: 2 }}>
                      <Typography variant="overline" sx={{ fontWeight: 800, color: slide.btnColor, letterSpacing: 2 }}>
                        {slide.subtitle}
                      </Typography>
                      <Typography variant="h2" sx={{
                        fontWeight: 900,
                        fontSize: { xs: '2.5rem', md: '3.5rem' },
                        lineHeight: 1.1,
                        mb: 2,
                        color: 'text.primary'
                      }}>
                        {slide.title}
                      </Typography>
                      <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4, maxWidth: '450px' }}>
                        {slide.description}
                      </Typography>
                      <Button
                        variant="contained"
                        size="large"
                        sx={{
                          bgcolor: slide.btnColor,
                          px: 4, py: 1.5,
                          borderRadius: '12px',
                          '&:hover': { bgcolor: slide.btnColor, filter: 'brightness(0.9)' }
                        }}
                      >
                        Compra Ahora
                      </Button>
                    </Box>

                    <Box sx={{
                      flex: 1,
                      position: 'relative',
                      width: '100%',
                      height: { xs: '250px', md: '450px' },
                      display: 'flex',
                      justifyContent: 'center',
                    }}>
                      <Image
                        src={slide.img}
                        alt={slide.title}
                        fill
                        priority={index === 0}
                        style={{
                          objectFit: 'contain', mixBlendMode: 'multiply',
                          filter: 'contrast(1.1)'
                        }}
                        sizes="(max-width: 768px) 100vw, 600px"
                      />
                    </Box>
                  </Stack>
                </Container>
              </Box>
            </SwiperSlide>
          ))}
        </Swiper>
      </Paper>
    </Box>
  );
}