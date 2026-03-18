"use client";

import {
  Box,
  Typography,
  Paper,
  Stack,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  IconButton,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Add, DeleteOutline, EditOutlined } from "@mui/icons-material";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  adminCreateProduct,
  adminDeleteProduct,
  adminUpdateProduct,
  getCategories,
  CreateProductPayload,
} from "../../../api/admin";
import { getFeaturedProducts, DetailedProduct } from "../../../api/products";
import { toCurrency, toNumber } from "../../../utils/format";

const EMPTY_FORM: CreateProductPayload = {
  name: "",
  description: "",
  brand: "",
  price: 0,
  categoryId: 0,
  stock: 0,
  specifications: {},
  images: [],
};

function ProductDialog({
  open,
  initial,
  onClose,
  onSave,
  isSaving,
  error,
}: {
  open: boolean;
  initial: CreateProductPayload;
  onClose: () => void;
  onSave: (data: CreateProductPayload) => void;
  isSaving: boolean;
  error: string | null;
}) {
  const [form, setForm] = useState<CreateProductPayload>(initial);
  const [specsRaw, setSpecsRaw] = useState(
    initial.specifications ? JSON.stringify(initial.specifications, null, 2) : "{}"
  );
  const [imagesRaw, setImagesRaw] = useState((initial.images ?? []).join("\n"));

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const set = (k: keyof CreateProductPayload, v: unknown) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  const handleSave = () => {
    let specs = {};
    try { specs = JSON.parse(specsRaw); } catch { specs = {}; }
    const images = imagesRaw.split("\n").map((s) => s.trim()).filter(Boolean);
    onSave({ ...form, specifications: specs, images });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>
        {initial.name ? "Editar producto" : "Nuevo producto"}
      </DialogTitle>
      <DialogContent dividers>
        {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}
        <Stack spacing={2.5}>
          <TextField label="Nombre" required size="small" value={form.name} onChange={(e) => set("name", e.target.value)} fullWidth sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1.5 } }} />
          <TextField label="Marca" required size="small" value={form.brand} onChange={(e) => set("brand", e.target.value)} fullWidth sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1.5 } }} />
          <TextField label="Descripcion" size="small" multiline rows={2} value={form.description} onChange={(e) => set("description", e.target.value)} fullWidth sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1.5 } }} />
          <Stack direction="row" spacing={2}>
            <TextField label="Precio" required size="small" type="number" value={form.price} onChange={(e) => set("price", Number(e.target.value))} fullWidth sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1.5 } }} />
            <TextField label="Stock inicial" size="small" type="number" value={form.stock} onChange={(e) => set("stock", Number(e.target.value))} fullWidth sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1.5 } }} />
          </Stack>
          <FormControl size="small" fullWidth>
            <InputLabel>Categoria</InputLabel>
            <Select
              label="Categoria"
              value={form.categoryId || ""}
              onChange={(e) => set("categoryId", Number(e.target.value))}
              sx={{ borderRadius: 1.5 }}
            >
              {categories.map((c) => (
                <MenuItem key={c.id} value={c.id}>{c.fullPath ?? c.categoryName}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Especificaciones (JSON)"
            size="small"
            multiline
            rows={3}
            value={specsRaw}
            onChange={(e) => setSpecsRaw(e.target.value)}
            fullWidth
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1.5, fontFamily: "monospace", fontSize: "0.8rem" } }}
          />
          <TextField
            label="URLs de imagenes (una por linea)"
            size="small"
            multiline
            rows={2}
            value={imagesRaw}
            onChange={(e) => setImagesRaw(e.target.value)}
            fullWidth
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1.5, fontSize: "0.8rem" } }}
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} sx={{ color: "text.secondary" }}>Cancelar</Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={isSaving}
          sx={{ borderRadius: 1.5, bgcolor: "text.primary", color: "white", "&:hover": { bgcolor: "grey.800" } }}
        >
          {isSaving ? "Guardando..." : "Guardar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default function AdminProductsPage() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<{ id: number; data: CreateProductPayload } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
  const [mutError, setMutError] = useState<string | null>(null);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["admin", "products"],
    queryFn: getFeaturedProducts,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin", "products"] });

  const createMut = useMutation({
    mutationFn: adminCreateProduct,
    onSuccess: () => { setDialogOpen(false); setMutError(null); invalidate(); },
    onError: (e: unknown) => setMutError(e instanceof Error ? e.message : "Error"),
  });

  const updateMut = useMutation({
    mutationFn: ({ id, data }: { id: number; data: CreateProductPayload }) => adminUpdateProduct(id, data),
    onSuccess: () => { setEditing(null); setMutError(null); invalidate(); },
    onError: (e: unknown) => setMutError(e instanceof Error ? e.message : "Error"),
  });

  const deleteMut = useMutation({
    mutationFn: adminDeleteProduct,
    onSuccess: () => { setDeleteTarget(null); invalidate(); },
  });

  const handleSave = (data: CreateProductPayload) => {
    if (editing) updateMut.mutate({ id: editing.id, data });
    else createMut.mutate(data);
  };

  const openEdit = (p: DetailedProduct) => {
    setEditing({
      id: p.id,
      data: {
        name: p.name,
        description: p.description,
        brand: p.brand,
        price: toNumber(p.price),
        categoryId: p.category?.id ?? 0,
        stock: p.stock,
        specifications: p.attributes as Record<string, string>,
        images: p.images ?? [],
      },
    });
    setMutError(null);
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h5" fontWeight={800} letterSpacing={-0.5}>Productos</Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5}>Gestiona el catalogo de productos</Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => { setDialogOpen(true); setMutError(null); }}
          sx={{ borderRadius: 1.5, bgcolor: "text.primary", color: "white", "&:hover": { bgcolor: "grey.800" } }}
        >
          Nuevo producto
        </Button>
      </Stack>

      <Paper
        elevation={0}
        sx={{ borderRadius: 2, border: "1px solid", borderColor: "grey.200", bgcolor: "background.paper", overflow: "hidden" }}
      >
        <Box sx={{ px: 3, py: 2, borderBottom: "1px solid", borderColor: "grey.100", bgcolor: "grey.50" }}>
          <Typography variant="caption" fontWeight={700} color="text.disabled" letterSpacing={0.5}>
            {products.length} PRODUCTOS
          </Typography>
        </Box>

        {isLoading ? (
          <Box sx={{ px: 3, py: 5, textAlign: "center" }}>
            <Typography variant="body2" color="text.disabled">Cargando productos...</Typography>
          </Box>
        ) : products.length === 0 ? (
          <Box sx={{ px: 3, py: 5, textAlign: "center" }}>
            <Typography variant="body2" color="text.disabled">No hay productos registrados.</Typography>
          </Box>
        ) : (
          products.map((p, idx) => (
            <Box key={p.id}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ px: 3, py: 2 }}
              >
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="body2" fontWeight={600} noWrap>{p.name}</Typography>
                  <Typography variant="caption" color="text.disabled">{p.brand} — Stock: {p.stock}</Typography>
                </Box>
                <Stack direction="row" alignItems="center" gap={2}>
                  <Typography variant="body2" fontWeight={700}>
                    ${toCurrency(toNumber(p.price))}
                  </Typography>
                  <IconButton size="small" onClick={() => openEdit(p)} sx={{ color: "text.secondary" }}>
                    <EditOutlined sx={{ fontSize: 18 }} />
                  </IconButton>
                  <IconButton
                    size="small"
                    sx={{ color: "error.main" }}
                    onClick={() => setDeleteTarget(p.id)}
                  >
                    <DeleteOutline sx={{ fontSize: 18 }} />
                  </IconButton>
                </Stack>
              </Stack>
              {idx < products.length - 1 && <Divider />}
            </Box>
          ))
        )}
      </Paper>

      <ProductDialog
        open={dialogOpen}
        initial={EMPTY_FORM}
        onClose={() => setDialogOpen(false)}
        onSave={handleSave}
        isSaving={createMut.isPending}
        error={mutError}
      />

      {editing && (
        <ProductDialog
          open
          initial={editing.data}
          onClose={() => setEditing(null)}
          onSave={handleSave}
          isSaving={updateMut.isPending}
          error={mutError}
        />
      )}

      <Dialog open={deleteTarget !== null} onClose={() => setDeleteTarget(null)} PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>Eliminar producto</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            Esta accion es irreversible. El producto sera eliminado del catalogo.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setDeleteTarget(null)} sx={{ color: "text.secondary" }}>Cancelar</Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => deleteTarget !== null && deleteMut.mutate(deleteTarget)}
            disabled={deleteMut.isPending}
            sx={{ borderRadius: 1.5 }}
          >
            {deleteMut.isPending ? "Eliminando..." : "Eliminar"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
