"use client";

import {
  Box,
  Typography,
  Stack,
  TextField,
  Button,
  Divider,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminCreateCategory, getCategories, CreateCategoryPayload } from "../../../api/admin";

// ─── Constants ────────────────────────────────────────────────────────────────

const EMPTY: CreateCategoryPayload = { name: "", parentId: null };

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminCategoriesPage() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<CreateCategoryPayload>(EMPTY);
  const [mutError, setMutError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const createMut = useMutation({
    mutationFn: adminCreateCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setDialogOpen(false);
      setForm(EMPTY);
      setMutError(null);
      setSuccessMsg("Categoría creada correctamente.");
      setTimeout(() => setSuccessMsg(null), 3000);
    },
    onError: (e: unknown) =>
      setMutError(e instanceof Error ? e.message : "Error al crear la categoría."),
  });

  const rootCategories = categories.filter((c) => c.parentName === null);
  const subCategories  = categories.filter((c) => c.parentName !== null);

  return (
    <Box>
      {/* ── Header ── */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography
            sx={{ fontSize: "0.7rem", fontWeight: 700, color: "#6366f1", textTransform: "uppercase", letterSpacing: 1 }}
          >
            Gestión
          </Typography>
          <Typography sx={{ fontSize: "1.6rem", fontWeight: 800, color: "#111827", mt: 0.25 }}>
            Categorías
          </Typography>
          <Typography sx={{ fontSize: "0.85rem", color: "#6b7280", mt: 0.5 }}>
            Estructura jerárquica del catálogo
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add sx={{ fontSize: 17 }} />}
          onClick={() => { setDialogOpen(true); setMutError(null); setForm(EMPTY); }}
          sx={{
            borderRadius: 1.5,
            bgcolor: "#111827",
            color: "white",
            textTransform: "none",
            fontWeight: 600,
            boxShadow: "none",
            "&:hover": { bgcolor: "#1f2937", boxShadow: "none" },
          }}
        >
          Nueva categoría
        </Button>
      </Stack>

      {successMsg && (
        <Alert severity="success" sx={{ mb: 3, borderRadius: 1.5 }} onClose={() => setSuccessMsg(null)}>
          {successMsg}
        </Alert>
      )}

      {/* ── Root categories ── */}
      <Paper
        elevation={0}
        sx={{ borderRadius: 2, border: "1px solid #e5e7eb", bgcolor: "white", overflow: "hidden", mb: 3 }}
      >
        <Box sx={{ px: 3, py: 1.75, borderBottom: "1px solid #f3f4f6" }}>
          <Typography
            sx={{ fontSize: "0.68rem", fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 0.5 }}
          >
            Categorías principales
          </Typography>
        </Box>

        {isLoading ? (
          <Box sx={{ px: 3, py: 4 }}>
            <Typography sx={{ fontSize: "0.85rem", color: "#9ca3af" }}>Cargando...</Typography>
          </Box>
        ) : rootCategories.length === 0 ? (
          <Box sx={{ px: 3, py: 4 }}>
            <Typography sx={{ fontSize: "0.85rem", color: "#9ca3af" }}>Sin categorías principales.</Typography>
          </Box>
        ) : (
          rootCategories.map((c, idx) => (
            <Box key={c.id}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ px: 3, py: 2 }}>
                <Box>
                  <Typography sx={{ fontSize: "0.88rem", fontWeight: 600, color: "#111827" }}>
                    {c.categoryName}
                  </Typography>
                  <Typography sx={{ fontSize: "0.72rem", color: "#9ca3af", fontFamily: "monospace" }}>
                    ID: {c.id}
                  </Typography>
                </Box>
                <Typography sx={{ fontSize: "0.72rem", color: "#9ca3af" }}>Raíz</Typography>
              </Stack>
              {idx < rootCategories.length - 1 && <Divider sx={{ borderColor: "#f3f4f6" }} />}
            </Box>
          ))
        )}
      </Paper>

      {/* ── Subcategories ── */}
      <Paper
        elevation={0}
        sx={{ borderRadius: 2, border: "1px solid #e5e7eb", bgcolor: "white", overflow: "hidden" }}
      >
        <Box sx={{ px: 3, py: 1.75, borderBottom: "1px solid #f3f4f6" }}>
          <Typography
            sx={{ fontSize: "0.68rem", fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 0.5 }}
          >
            Subcategorías
          </Typography>
        </Box>

        {isLoading ? (
          <Box sx={{ px: 3, py: 4 }}>
            <Typography sx={{ fontSize: "0.85rem", color: "#9ca3af" }}>Cargando...</Typography>
          </Box>
        ) : subCategories.length === 0 ? (
          <Box sx={{ px: 3, py: 4 }}>
            <Typography sx={{ fontSize: "0.85rem", color: "#9ca3af" }}>Sin subcategorías.</Typography>
          </Box>
        ) : (
          subCategories.map((c, idx) => (
            <Box key={c.id}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ px: 3, py: 2 }}>
                <Box>
                  <Typography sx={{ fontSize: "0.88rem", fontWeight: 600, color: "#111827" }}>
                    {c.categoryName}
                  </Typography>
                  <Typography sx={{ fontSize: "0.72rem", color: "#9ca3af" }}>
                    {c.fullPath}
                  </Typography>
                </Box>
                <Typography sx={{ fontSize: "0.75rem", color: "#6b7280" }}>
                  {c.parentName}
                </Typography>
              </Stack>
              {idx < subCategories.length - 1 && <Divider sx={{ borderColor: "#f3f4f6" }} />}
            </Box>
          ))
        )}
      </Paper>

      {/* ── Dialog ── */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle sx={{ fontWeight: 700, fontSize: "1rem" }}>Nueva categoría</DialogTitle>
        <DialogContent dividers>
          {mutError && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 1.5 }}>
              {mutError}
            </Alert>
          )}
          <Stack spacing={2.5}>
            <TextField
              label="Nombre"
              required
              size="small"
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              fullWidth
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1.5 } }}
            />
            <FormControl size="small" fullWidth>
              <InputLabel>Categoría padre (opcional)</InputLabel>
              <Select
                label="Categoría padre (opcional)"
                value={form.parentId != null ? String(form.parentId) : ""}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    parentId: e.target.value === "" ? null : Number(e.target.value),
                  }))
                }
                sx={{ borderRadius: 1.5 }}
              >
                <MenuItem value="">Ninguna (categoría raíz)</MenuItem>
                {categories.map((c) => (
                  <MenuItem key={c.id} value={c.id}>
                    {c.fullPath ?? c.categoryName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button
            onClick={() => setDialogOpen(false)}
            sx={{ color: "#6b7280", textTransform: "none" }}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            disabled={!form.name.trim() || createMut.isPending}
            onClick={() => createMut.mutate(form)}
            sx={{
              borderRadius: 1.5,
              bgcolor: "#111827",
              color: "white",
              textTransform: "none",
              fontWeight: 600,
              "&:hover": { bgcolor: "#1f2937" },
            }}
          >
            {createMut.isPending ? "Creando..." : "Crear"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
