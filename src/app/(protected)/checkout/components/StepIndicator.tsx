"use client";

import { Box, Stack, Typography } from "@mui/material";
import { Check, Inventory2Outlined, PlaceOutlined, CreditCardOutlined } from "@mui/icons-material";

export type Phase = "review" | "shipping" | "confirmation";

const STEPS = [
  { key: "review", label: "Resumen", Icon: Inventory2Outlined },
  { key: "shipping", label: "Envio", Icon: PlaceOutlined },
  { key: "confirmation", label: "Confirmacion", Icon: CreditCardOutlined },
] as const;

export function StepIndicator({ phase }: { phase: Phase }) {
  const activeIdx = STEPS.findIndex((s) => s.key === phase);

  return (
    <Stack direction="row" alignItems="center" sx={{ mb: { xs: 4, md: 5 } }}>
      {STEPS.map((step, idx) => {
        const done = idx < activeIdx;
        const active = idx === activeIdx;
        return (
          <Stack
            key={step.key}
            direction="row"
            alignItems="center"
            sx={{ flex: idx < STEPS.length - 1 ? 1 : "none" }}
          >
            <Stack alignItems="center" gap={0.75}>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: done || active ? "text.primary" : "grey.200",
                  color: done || active ? "background.paper" : "text.disabled",
                  transition: "all 0.3s",
                  flexShrink: 0,
                }}
              >
                {done ? (
                  <Check sx={{ fontSize: 16 }} />
                ) : (
                  <step.Icon sx={{ fontSize: 16 }} />
                )}
              </Box>
              <Typography
                variant="caption"
                sx={{
                  fontWeight: active ? 700 : 400,
                  color: active ? "text.primary" : done ? "text.secondary" : "text.disabled",
                  whiteSpace: "nowrap",
                  fontSize: "0.7rem",
                  letterSpacing: 0.3,
                }}
              >
                {step.label}
              </Typography>
            </Stack>
            {idx < STEPS.length - 1 && (
              <Box
                sx={{
                  flex: 1,
                  height: 1,
                  bgcolor: idx < activeIdx ? "text.primary" : "grey.200",
                  mx: 1.5,
                  mb: 2.5,
                  transition: "all 0.3s",
                }}
              />
            )}
          </Stack>
        );
      })}
    </Stack>
  );
}
