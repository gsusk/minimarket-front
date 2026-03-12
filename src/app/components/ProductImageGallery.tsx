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
          bgcolor: "white",
          borderRadius: 4,
          overflow: "hidden",
          width: "100%",
          pt: { xs: "80%", sm: "75%", md: "100%" },
          maxHeight: { xs: 350, sm: 400, md: "none" },
          boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
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
                width: { xs: 48, sm: 56, md: 64 },
                height: { xs: 48, sm: 56, md: 64 },
                flexShrink: 0,
                borderRadius: 2,
                overflow: "hidden",
                position: "relative",
                cursor: "pointer",
                border: selectedImage === i ? "2px solid" : "2px solid transparent",
                borderColor: selectedImage === i ? "primary.main" : "transparent",
                bgcolor: "white",
                transition: "0.2s",
                "&:hover": { borderColor: "primary.light" },
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
