import { Box, Container } from "@mui/material";
import HeroSlider from "./components/HeroSlider";

export default function Home() {
  return (
    <Box bgcolor={"grey.100"} py={2}>
      <Container component={"main"} maxWidth="lg">
        <HeroSlider></HeroSlider>
      </Container>
    </Box>
  );
}
