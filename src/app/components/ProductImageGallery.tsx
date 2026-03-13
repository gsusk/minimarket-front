"use client";

import { useState } from "react";
import { Box, Stack, IconButton } from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import Image from "next/image";

export default function ProductImageGallery({ images, productName }: { images: string[]; productName: string }) {
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <Box sx={{ position: { md: "sticky" }, top: { md: 24 } }}>
      <Box
        sx={{
          position: "relative",
          bgcolor: "#f8f9fa",
          borderRadius: 4,
          overflow: "hidden",
          width: "100%",
          pt: { xs: "100%", sm: "85%", md: "110%" },
          border: "1px solid",
          borderColor: "grey.100",
        }}
      >
        <Image
          src={images[selectedImage]}
          alt={productName}
          fill
          sizes="(max-width: 600px) 100vw, (max-width: 900px) 100vw, 50vw"
          style={{
            objectFit: "contain",
            padding: "24px",
            mixBlendMode: "multiply",
          }}
          priority
        />

        {images.length > 1 && (
          <>
            <IconButton
              onClick={() => setSelectedImage((p) => (p > 0 ? p - 1 : images.length - 1))}
              size="small"
              sx={{
                position: "absolute",
                left: 8,
                top: "50%",
                transform: "translateY(-50%)",
                bgcolor: "rgba(255,255,255,0.85)",
                "&:hover": { bgcolor: "white" },
              }}
            >
              <ChevronLeft />
            </IconButton>
            <IconButton
              onClick={() => setSelectedImage((p) => (p < images.length - 1 ? p + 1 : 0))}
              size="small"
              sx={{
                position: "absolute",
                right: 8,
                top: "50%",
                transform: "translateY(-50%)",
                bgcolor: "rgba(255,255,255,0.85)",
                "&:hover": { bgcolor: "white" },
              }}
            >
              <ChevronRight />
            </IconButton>
          </>
        )}
      </Box>

      {images.length > 1 && (
        <Stack
          direction="row"
          spacing={1}
          sx={{
            mt: 2,
            justifyContent: "center",
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          {images.map((img, i) => (
            <Box
              key={i}
              onClick={() => setSelectedImage(i)}
              sx={{
                width: { xs: 56, sm: 72 },
                height: { xs: 56, sm: 72 },
                flexShrink: 0,
                borderRadius: 2,
                overflow: "hidden",
                position: "relative",
                cursor: "pointer",
                border: "2px solid",
                borderColor: selectedImage === i ? "text.primary" : "transparent",
                bgcolor: "#f8f9fa",
                opacity: selectedImage === i ? 1 : 0.5,
                transition: "all 0.2s ease",
                "&:hover": { opacity: 1 },
              }}
            >
              <Image
                src={img}
                alt={`${productName} thumbnail ${i + 1}`}
                fill
                style={{ objectFit: "contain", padding: "4px" }}
              />
            </Box>
          ))}
        </Stack>
      )}
    </Box>
  );
}
