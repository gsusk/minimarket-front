import { Stack, Box, Typography } from "@mui/material";
import { LocalShippingOutlined, VerifiedUserOutlined, HeadsetMicOutlined } from "@mui/icons-material";

export default function TrustBar() {
  const items = [
    { icon: <LocalShippingOutlined />, title: "Envío Gratis", desc: "En pedidos mayores a $200k" },
    { icon: <VerifiedUserOutlined />, title: "Pago Seguro", desc: "100% garantizado" },
    { icon: <HeadsetMicOutlined />, title: "Soporte 24/7", desc: "Estamos para ayudarte" },
  ];

  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      spacing={4}
      justifyContent={{ xs: "center", sm: "space-between", md: "space-around" }}
      alignItems={{ xs: "center", sm: "flex-start" }}
      sx={{ mt: 4, p: 3, bgcolor: 'white', borderRadius: '16px' }}
    >
      {items.map((item, i) => (
        <Stack
          key={i}
          direction="row"
          spacing={2}
          alignItems="center"
          sx={{ width: { xs: '250px', sm: 'auto' } }}
        >
          <Box sx={{ color: 'primary.main', display: 'flex' }}>
            {item.icon}
          </Box>
          <Box>
            <Typography variant="subtitle2" fontWeight={800} sx={{ lineHeight: 1.2 }}>
              {item.title}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
              {item.desc}
            </Typography>
          </Box>
        </Stack>
      ))}
    </Stack>
  );
}