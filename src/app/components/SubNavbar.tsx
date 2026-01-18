import { Box, Typography, Container, Link } from '@mui/material';

const categories = [
  'All Products', 'Smartphones', 'Laptops', 'Watches', 'Audio',
  'Gaming', 'TV & Video', 'Appliances', 'Accessories'
];

export default function SubNavbar() {
  return (
    <Box
      sx={{
        width: '100%',
        bgcolor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
        overflowX: 'auto',
        whiteSpace: 'nowrap',
        '&::-webkit-scrollbar': { display: 'none' },
        scrollbarWidth: 'none',
        display: { xs: "none", sm: "inherit" }
      }}
    >
      <Container maxWidth="xl" sx={{ px: { xs: 1, sm: 2, md: 6 } }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            my: 1,
            gap: { xs: 3, md: 4 }
          }}
        >
          {categories.map((cat) => (
            <Typography
              key={cat}
              variant="body2"
              sx={{
                fontWeight: 600,
                fontSize: '0.85rem',
                color: 'text.secondary',
                cursor: 'pointer',
                transition: 'color 0.2s',
                '&:hover': {
                  color: 'primary.main'
                }
              }}
            >
              {cat}
            </Typography>
          ))}
        </Box>
      </Container>
    </Box>
  );
}