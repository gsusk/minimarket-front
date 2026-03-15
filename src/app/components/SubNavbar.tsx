import { Box, Typography, Container } from '@mui/material';
import Link from 'next/link';
import { CategorySummary } from '../api/products';

export default async function SubNavbar() {
  let categories: CategorySummary[] = [];
  try {
    const res = await fetch("http://localhost:8080/categories/featured", {
      next: { revalidate: 3600 * 24 }
    })
    if (res.ok) {
      categories = await res.json() as CategorySummary[]
    }
  } catch (err) {
    console.error(err)
  }

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
            <Link key={cat.id} href={`/search?category=${cat.categoryName}`} passHref >
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  color: 'text.secondary',
                  cursor: 'pointer',
                  transition: 'color 0.2s',
                  textDecoration: 'none',
                  '&:hover': {
                    color: 'primary.main'
                  }
                }}
              >
                {cat.categoryName}
              </Typography>
            </Link>
          ))}
        </Box>
      </Container>
    </Box>
  );
}