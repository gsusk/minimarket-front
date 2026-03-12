"use client";

import { useState } from "react";
import { Box, Stack, IconButton } from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import Image from "next/image";

export default function ProductImageGallery({ images, productName }: { images: string[]; productName: string }) {
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <>
      <Box
        sx={{
          position: "relative",
          bgcolor: "white",
          borderRadius: 4,
          overflow: "hidden",
          pt: "100%",
          boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
        }}
      >
        <Image
          src={images[selectedImage]}
          alt={productName}
          fill
          style={{
            objectFit: "contain",
            padding: "32px",
            mixBlendMode: "multiply",
          }}
          priority
        />

        {images.length > 1 && (
          <>
            <IconButton
              onClick={() => setSelectedImage((p) => (p > 0 ? p - 1 : images.length - 1))}
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
        <Stack direction="row" spacing={1.5} sx={{ mt: 2, justifyContent: "center" }}>
          {images.map((img, i) => (
            <Box
              key={i}
              onClick={() => setSelectedImage(i)}
              sx={{
                width: 64,
                height: 64,
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
    </>
  );
}
