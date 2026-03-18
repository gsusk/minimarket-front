"use client";

import {
  Box,
  Typography,
  Paper,
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
} from "@mui/material";
import { Add } from "@mui/icons-material";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminCreateCategory, getCategories, CreateCategoryPayload } from "../../../api/admin";

const EMPTY: CreateCategoryPayload = { name: "", parentId: null };

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
      setSuccessMsg("Categoria creada correctamente.");
      setTimeout(() => setSuccessMsg(null), 3000);
    },
    onError: (e: unknown) => setMutError(e instanceof Error ? e.message : "Error al crear la categoria."),
  });

  const rootCategories = categories.filter((c) => c.parentName === null);
  const subCategories = categories.filter((c) => c.parentName !== null);

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h5" fontWeight={800} letterSpacing={-0.5}>Categorias</Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            Estructura jerarquica del catalogo
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => { setDialogOpen(true); setMutError(null); setForm(EMPTY); }}
          sx={{ borderRadius: 1.5, bgcolor: "text.primary", color: "white", "&:hover": { bgcolor: "grey.800" } }}
        >
          Nueva categoria
        </Button>
      </Stack>

      {successMsg && (
        <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setSuccessMsg(null)}>
          {successMsg}
        </Alert>
      )}

      <Paper
        elevation={0}
        sx={{ borderRadius: 2, border: "1px solid", borderColor: "grey.200", bgcolor: "background.paper", overflow: "hidden", mb: 3 }}
      >
        <Box sx={{ px: 3, py: 2, borderBottom: "1px solid", borderColor: "grey.100", bgcolor: "grey.50" }}>
          <Typography variant="caption" fontWeight={700} color="text.disabled" letterSpacing={0.5}>
            CATEGORIAS PRINCIPALES
          </Typography>
        </Box>
        {isLoading ? (
          <Box sx={{ px: 3, py: 4 }}>
            <Typography variant="body2" color="text.disabled">Cargando...</Typography>
          </Box>
        ) : rootCategories.length === 0 ? (
          <Box sx={{ px: 3, py: 4 }}>
            <Typography variant="body2" color="text.disabled">Sin categorias principales.</Typography>
          </Box>
        ) : (
          rootCategories.map((c, idx) => (
            <Box key={c.id}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ px: 3, py: 2 }}>
                <Box>
                  <Typography variant="body2" fontWeight={600}>{c.categoryName}</Typography>
                  <Typography variant="caption" color="text.disabled" fontFamily="monospace">ID: {c.id}</Typography>
                </Box>
                <Typography variant="caption" color="text.disabled">Raiz</Typography>
              </Stack>
              {idx < rootCategories.length - 1 && <Divider />}
            </Box>
          ))
        )}
      </Paper>

      <Paper
        elevation={0}
        sx={{ borderRadius: 2, border: "1px solid", borderColor: "grey.200", bgcolor: "background.paper", overflow: "hidden" }}
      >
        <Box sx={{ px: 3, py: 2, borderBottom: "1px solid", borderColor: "grey.100", bgcolor: "grey.50" }}>
          <Typography variant="caption" fontWeight={700} color="text.disabled" letterSpacing={0.5}>
            SUBCATEGORIAS
          </Typography>
        </Box>
        {isLoading ? (
          <Box sx={{ px: 3, py: 4 }}>
            <Typography variant="body2" color="text.disabled">Cargando...</Typography>
          </Box>
        ) : subCategories.length === 0 ? (
          <Box sx={{ px: 3, py: 4 }}>
            <Typography variant="body2" color="text.disabled">Sin subcategorias.</Typography>
          </Box>
        ) : (
          subCategories.map((c, idx) => (
            <Box key={c.id}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ px: 3, py: 2 }}>
                <Box>
                  <Typography variant="body2" fontWeight={600}>{c.categoryName}</Typography>
                  <Typography variant="caption" color="text.disabled">{c.fullPath}</Typography>
                </Box>
                <Typography variant="caption" color="text.disabled">
                  Padre: {c.parentName}
                </Typography>
              </Stack>
              {idx < subCategories.length - 1 && <Divider />}
            </Box>
          ))
        )}
      </Paper>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>Nueva categoria</DialogTitle>
        <DialogContent dividers>
          {mutError && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{mutError}</Alert>}
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
              <InputLabel>Categoria padre (opcional)</InputLabel>
              <Select
                label="Categoria padre (opcional)"
                value={form.parentId != null ? String(form.parentId) : ""}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    parentId: e.target.value === "" ? null : Number(e.target.value),
                  }))
                }
                sx={{ borderRadius: 1.5 }}
              >
                <MenuItem value="">Ninguna (categoria raiz)</MenuItem>
                {categories.map((c) => (
                  <MenuItem key={c.id} value={c.id}>{c.fullPath ?? c.categoryName}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setDialogOpen(false)} sx={{ color: "text.secondary" }}>Cancelar</Button>
          <Button
            variant="contained"
            disabled={!form.name.trim() || createMut.isPending}
            onClick={() => createMut.mutate(form)}
            sx={{ borderRadius: 1.5, bgcolor: "text.primary", color: "white", "&:hover": { bgcolor: "grey.800" } }}
          >
            {createMut.isPending ? "Creando..." : "Crear"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
