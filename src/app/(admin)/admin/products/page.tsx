"use client";

import {
  Box,
  Typography,
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
  Chip,
  FormHelperText,
} from "@mui/material";
import { Add, DeleteOutline, EditOutlined, CategoryOutlined, TuneOutlined } from "@mui/icons-material";
import { useState, useEffect, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  adminCreateProduct,
  adminDeleteProduct,
  adminUpdateProduct,
  getCategories,
  CreateProductPayload,
} from "../../../api/admin";
import { getFeaturedProducts, DetailedProduct, CategoryAttributeDefinition } from "../../../api/products";
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

function formatAttributeLabel(name: string): string {
  return name
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

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
  const [categoryAttrs, setCategoryAttrs] = useState<Record<string, any>>({});
  const [specs, setSpecs] = useState<{ key: string; value: string; type: "text" | "number" }[]>([]);
  const [imagesRaw, setImagesRaw] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const selectedCategory = useMemo(() => {
    return categories.find((c) => c.id === form.categoryId);
  }, [categories, form.categoryId]);

  const attributeDefinitions: CategoryAttributeDefinition[] = useMemo(() => {
    return selectedCategory?.attributeDefinitions ?? [];
  }, [selectedCategory]);

  useEffect(() => {
    if (open) {
      setForm(initial);
      setImagesRaw((initial.images ?? []).join("\n"));
      setErrors({});

      const initialSpecs = initial.specifications || {};
      const catDefs = categories.find((c) => c.id === initial.categoryId)?.attributeDefinitions || [];
      const catDefNames = new Set(catDefs.map((d) => d.name.toLowerCase()));

      const matchedCatAttrs: Record<string, any> = {};
      const customSpecs: { key: string; value: string; type: "text" | "number" }[] = [];

      Object.entries(initialSpecs).forEach(([key, val]) => {
        if (catDefNames.has(key.toLowerCase())) {
          matchedCatAttrs[key] = val;
        } else {
          customSpecs.push({
            key,
            value: String(val ?? ""),
            type: typeof val === "number" ? "number" : "text",
          });
        }
      });

      if (catDefNames.has("marca") && !matchedCatAttrs.marca && initial.brand) {
        matchedCatAttrs.marca = initial.brand;
      }

      setCategoryAttrs(matchedCatAttrs);
      setSpecs(customSpecs);
    }
  }, [open, initial, categories]);

  useEffect(() => {
    if (error) {
      const serverFieldErrors: Record<string, string> = {};
      const lower = error.toLowerCase();

      if (
        lower.includes("slug") ||
        lower.includes("ya existe un producto") ||
        lower.includes("already exists") ||
        lower.includes("duplicate")
      ) {
        serverFieldErrors.name = "Ya existe un producto con este nombre o slug";
      }

      const specMatch = error.match(/specifications\[([^\]]+)\](?::|\s+)?([^,;]*)/g);
      if (specMatch) {
        specMatch.forEach((item) => {
          const m = item.match(/specifications\[([^\]]+)\](?::|\s+)?(.*)/);
          if (m) {
            const attr = m[1].trim();
            const msg = m[2].trim() || "Valor no permitido o inválido";
            serverFieldErrors[`cat_attr_${attr}`] = msg;
          }
        });
      }

      ["name", "brand", "description", "price", "stock", "categoryId"].forEach((field) => {
        if (lower.includes(`${field}:`)) {
          const match = error.match(new RegExp(`${field}:\\s*([^,;]+)`, "i"));
          if (match) {
            serverFieldErrors[field] = match[1].trim();
          }
        }
      });

      if (Object.keys(serverFieldErrors).length > 0) {
        setErrors((prev) => ({ ...prev, ...serverFieldErrors }));
      }
    }
  }, [error]);

  const set = (k: keyof CreateProductPayload, v: unknown) => {
    setForm((prev) => {
      const next = { ...prev, [k]: v };
      if (k === "brand" && typeof v === "string") {
        setCategoryAttrs((prevAttrs) => {
          if (!prevAttrs.marca || prevAttrs.marca === prev.brand) {
            return { ...prevAttrs, marca: v };
          }
          return prevAttrs;
        });
      }
      return next;
    });

    if (errors[k]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[k];
        return next;
      });
    }
  };

  const handleCategoryAttrChange = (name: string, value: any) => {
    setCategoryAttrs((prev) => ({ ...prev, [name]: value }));
    const errorKey = `cat_attr_${name}`;
    if (errors[errorKey]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[errorKey];
        return next;
      });
    }
  };

  const handleAddSpec = () => {
    setSpecs([...specs, { key: "", value: "", type: "text" }]);
  };

  const handleRemoveSpec = (index: number) => {
    setSpecs(specs.filter((_, i) => i !== index));
  };

  const handleSpecChange = (index: number, field: "key" | "value" | "type", value: string) => {
    const newSpecs = [...specs];
    // @ts-ignore
    newSpecs[index][field] = value;
    setSpecs(newSpecs);
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = "El nombre es requerido";
    if (!form.brand.trim()) newErrors.brand = "La marca es requerida";
    if (!form.description.trim()) newErrors.description = "La descripcion es requerida";
    if (form.price === undefined || form.price === null || form.price <= 0) newErrors.price = "El precio debe ser mayor a 0";
    if (!form.categoryId) newErrors.categoryId = "Debe seleccionar una categoria";
    if (form.stock < 0) newErrors.stock = "El stock no puede ser negativo";

    const allowedAttrNames = new Set(attributeDefinitions.map((d) => d.name.toLowerCase()));

    attributeDefinitions.forEach((def) => {
      const val = categoryAttrs[def.name];
      const hasVal = val !== undefined && val !== null && String(val).trim() !== "";
      const isSatisfiedByBrand = def.name.toLowerCase() === "marca" && form.brand.trim().length > 0;

      if (def.required) {
        const inCustom = specs.some(
          (s) => s.key.trim().toLowerCase() === def.name.toLowerCase() && s.value.trim() !== ""
        );
        if (!hasVal && !inCustom && !isSatisfiedByBrand) {
          newErrors[`cat_attr_${def.name}`] = `${formatAttributeLabel(def.name)} es requerido`;
        }
      }

      if (hasVal) {
        if (def.type === "number") {
          const num = Number(val);
          if (isNaN(num)) {
            newErrors[`cat_attr_${def.name}`] = `${formatAttributeLabel(def.name)} debe ser un número válido`;
          } else if (def.min !== undefined && def.min !== null && num < def.min) {
            newErrors[`cat_attr_${def.name}`] = `El valor mínimo permitido es ${def.min}`;
          } else if (def.max !== undefined && def.max !== null && num > def.max) {
            newErrors[`cat_attr_${def.name}`] = `El valor máximo permitido es ${def.max}`;
          }
        }
      }
    });

    if (attributeDefinitions.length > 0) {
      specs.forEach((s, idx) => {
        const k = s.key.trim().toLowerCase();
        if (k && !allowedAttrNames.has(k)) {
          newErrors[`spec_${idx}`] = `Atributo "${s.key}" no permitido en esta categoría. Permitidos: ${attributeDefinitions.map((d) => d.name).join(", ")}`;
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    const specifications: Record<string, any> = {};

    attributeDefinitions.forEach((def) => {
      const val = categoryAttrs[def.name];
      if (val !== undefined && val !== null && String(val).trim() !== "") {
        if (def.type === "number") {
          const num = Number(val);
          if (!isNaN(num)) specifications[def.name] = num;
        } else if (def.type === "boolean") {
          specifications[def.name] = val === true || val === "true";
        } else {
          specifications[def.name] = String(val).trim();
        }
      }
    });

    const hasMarcaDef = attributeDefinitions.some((d) => d.name.toLowerCase() === "marca");
    if (hasMarcaDef && (!specifications.marca || String(specifications.marca).trim() === "") && form.brand.trim()) {
      specifications.marca = form.brand.trim();
    }

    specs.forEach((s) => {
      if (s.key.trim() && s.value.trim() !== "") {
        const key = s.key.trim();
        specifications[key] = s.type === "number" ? Number(s.value) : s.value.trim();
      }
    });

    const images = imagesRaw
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    onSave({ ...form, specifications, images });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>
        {initial.name ? "Editar producto" : "Nuevo producto"}
      </DialogTitle>
      <DialogContent dividers>
        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
            {error}
          </Alert>
        )}
        <Stack spacing={2.5}>
          <TextField
            label="Nombre"
            inputProps={{ "data-testid": "nombre_dialog_producto" }}
            required
            size="small"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            error={!!errors.name}
            helperText={errors.name}
            fullWidth
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1.5 } }}
          />

          <TextField
            label="Marca"
            inputProps={{ "data-testid": "marca_dialog_producto" }}
            required
            size="small"
            value={form.brand}
            onChange={(e) => set("brand", e.target.value)}
            error={!!errors.brand}
            helperText={errors.brand}
            fullWidth
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1.5 } }}
          />

          <TextField
            label="Descripcion"
            inputProps={{ "data-testid": "descripcion_dialog_producto" }}
            size="small"
            multiline
            rows={2}
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            error={!!errors.description}
            helperText={errors.description}
            fullWidth
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1.5 } }}
          />

          <Stack direction="row" spacing={2}>
            <TextField
              label="Precio"
              inputProps={{ "data-testid": "precio_dialog_producto" }}
              required
              size="small"
              type="number"
              value={form.price === 0 ? "" : form.price}
              onChange={(e) => set("price", e.target.value === "" ? 0 : Number(e.target.value))}
              error={!!errors.price}
              helperText={errors.price}
              fullWidth
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1.5 } }}
            />
            <TextField
              label="Stock inicial"
              inputProps={{ "data-testid": "stock_dialog_producto" }}
              size="small"
              type="number"
              value={form.stock}
              onChange={(e) => set("stock", e.target.value === "" ? 0 : Number(e.target.value))}
              error={!!errors.stock}
              helperText={errors.stock}
              fullWidth
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1.5 } }}
            />
          </Stack>

          <FormControl size="small" fullWidth error={!!errors.categoryId}>
            <InputLabel>Categoria</InputLabel>
            <Select
              label="Categoria"
              value={form.categoryId || ""}
              onChange={(e) => set("categoryId", Number(e.target.value))}
              sx={{ borderRadius: 1.5 }}
              data-testid="categoria_dialog_producto"
            >
              {categories.map((c) => (
                <MenuItem key={c.id} value={c.id}>
                  {c.fullPath ?? c.categoryName}
                </MenuItem>
              ))}
            </Select>
            {errors.categoryId && (
              <FormHelperText>{errors.categoryId}</FormHelperText>
            )}
          </FormControl>

          {attributeDefinitions.length > 0 && (
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: "grey.50",
                border: "1px solid rgba(0,0,0,0.08)",
              }}
            >
              <Stack direction="row" alignItems="center" spacing={1} mb={1.5}>
                <CategoryOutlined fontSize="small" color="primary" />
                <Typography variant="subtitle2" fontWeight={700}>
                  Atributos permitidos para {selectedCategory?.categoryName}
                </Typography>
                <Chip size="small" label={`${attributeDefinitions.length} atributos`} sx={{ height: 20, fontSize: "0.7rem", bgcolor: "primary.50", color: "primary.main", fontWeight: 600 }} />
              </Stack>

              <Stack spacing={1.5}>
                {attributeDefinitions.map((def) => {
                  const errorKey = `cat_attr_${def.name}`;
                  const hasError = !!errors[errorKey];
                  const value = categoryAttrs[def.name] ?? "";

                  if (def.type === "enum" || (def.options && def.options.length > 0)) {
                    return (
                      <FormControl key={def.name} size="small" fullWidth error={hasError}>
                        <InputLabel>{formatAttributeLabel(def.name)}{def.required ? " *" : ""}</InputLabel>
                        <Select
                          label={`${formatAttributeLabel(def.name)}${def.required ? " *" : ""}`}
                          value={value}
                          onChange={(e) => handleCategoryAttrChange(def.name, e.target.value)}
                          sx={{ borderRadius: 1.5, bgcolor: "white" }}
                        >
                          <MenuItem value="">
                            <em>Ninguno</em>
                          </MenuItem>
                          {(def.options || []).map((opt) => (
                            <MenuItem key={String(opt)} value={opt}>
                              {String(opt)}
                            </MenuItem>
                          ))}
                        </Select>
                        {hasError && <FormHelperText>{errors[errorKey]}</FormHelperText>}
                      </FormControl>
                    );
                  }

                  if (def.type === "boolean") {
                    return (
                      <FormControl key={def.name} size="small" fullWidth error={hasError}>
                        <InputLabel>{formatAttributeLabel(def.name)}{def.required ? " *" : ""}</InputLabel>
                        <Select
                          label={`${formatAttributeLabel(def.name)}${def.required ? " *" : ""}`}
                          value={value === "" ? "" : String(value)}
                          onChange={(e) => {
                            const val = e.target.value === "" ? "" : e.target.value === "true";
                            handleCategoryAttrChange(def.name, val);
                          }}
                          sx={{ borderRadius: 1.5, bgcolor: "white" }}
                        >
                          <MenuItem value="">
                            <em>No especificado</em>
                          </MenuItem>
                          <MenuItem value="true">Sí</MenuItem>
                          <MenuItem value="false">No</MenuItem>
                        </Select>
                        {hasError && <FormHelperText>{errors[errorKey]}</FormHelperText>}
                      </FormControl>
                    );
                  }

                  if (def.type === "number") {
                    const helper = hasError
                      ? errors[errorKey]
                      : [
                          def.min !== undefined && def.min !== null ? `Mín: ${def.min}` : null,
                          def.max !== undefined && def.max !== null ? `Máx: ${def.max}` : null,
                        ]
                          .filter(Boolean)
                          .join(" • ");

                    return (
                      <TextField
                        key={def.name}
                        label={`${formatAttributeLabel(def.name)}${def.required ? " *" : ""}`}
                        size="small"
                        type="number"
                        value={value}
                        onChange={(e) => handleCategoryAttrChange(def.name, e.target.value)}
                        error={hasError}
                        helperText={helper}
                        fullWidth
                        sx={{ bgcolor: "white", "& .MuiOutlinedInput-root": { borderRadius: 1.5 } }}
                      />
                    );
                  }

                  return (
                    <TextField
                      key={def.name}
                      label={`${formatAttributeLabel(def.name)}${def.required ? " *" : ""}`}
                      size="small"
                      value={value}
                      onChange={(e) => handleCategoryAttrChange(def.name, e.target.value)}
                      error={hasError}
                      helperText={hasError ? errors[errorKey] : undefined}
                      fullWidth
                      sx={{ bgcolor: "white", "& .MuiOutlinedInput-root": { borderRadius: 1.5 } }}
                    />
                  );
                })}
              </Stack>
            </Box>
          )}

          <Box>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
              <Stack direction="row" spacing={1} alignItems="center">
                <TuneOutlined fontSize="small" color="action" />
                <Typography variant="subtitle2" fontWeight={600}>
                  Especificaciones adicionales
                </Typography>
              </Stack>
              <Button size="small" onClick={handleAddSpec} startIcon={<Add />} sx={{ textTransform: "none" }}>
                Anadir
              </Button>
            </Stack>
            {attributeDefinitions.length > 0 && (
              <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1 }}>
                Atributos permitidos en esta categoría: {attributeDefinitions.map((d) => d.name).join(", ")}
              </Typography>
            )}
            <Stack spacing={1}>
              {specs.map((s, idx) => (
                <Box key={idx}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <TextField
                      placeholder="Clave"
                      size="small"
                      value={s.key}
                      onChange={(e) => {
                        handleSpecChange(idx, "key", e.target.value);
                        if (errors[`spec_${idx}`]) {
                          setErrors((prev) => {
                            const next = { ...prev };
                            delete next[`spec_${idx}`];
                            return next;
                          });
                        }
                      }}
                      error={!!errors[`spec_${idx}`]}
                      sx={{ flex: 1.5, "& .MuiOutlinedInput-root": { borderRadius: 1.5 } }}
                    />
                    <TextField
                      placeholder="Valor"
                      size="small"
                      type={s.type === "number" ? "number" : "text"}
                      value={s.value}
                      onChange={(e) => {
                        handleSpecChange(idx, "value", e.target.value);
                        if (errors[`spec_${idx}`]) {
                          setErrors((prev) => {
                            const next = { ...prev };
                            delete next[`spec_${idx}`];
                            return next;
                          });
                        }
                      }}
                      sx={{ flex: 2, "& .MuiOutlinedInput-root": { borderRadius: 1.5 } }}
                    />
                    <Select
                      size="small"
                      value={s.type}
                      onChange={(e) => handleSpecChange(idx, "type", e.target.value)}
                      sx={{ flex: 1, borderRadius: 1.5, fontSize: "0.8rem" }}
                    >
                      <MenuItem value="text">Texto</MenuItem>
                      <MenuItem value="number">Num</MenuItem>
                    </Select>
                    <IconButton onClick={() => handleRemoveSpec(idx)} color="error" size="small">
                      <DeleteOutline fontSize="small" />
                    </IconButton>
                  </Stack>
                  {errors[`spec_${idx}`] && (
                    <FormHelperText error sx={{ ml: 0.5, mt: 0.5 }}>
                      {errors[`spec_${idx}`]}
                    </FormHelperText>
                  )}
                </Box>
              ))}
              {specs.length === 0 && (
                <Typography variant="caption" color="text.disabled" textAlign="center">
                  {attributeDefinitions.length > 0
                    ? "Puedes añadir campos personalizados de los atributos permitidos si lo deseas."
                    : "No hay especificaciones. Añade una para detallar el producto."}
                </Typography>
              )}
            </Stack>
          </Box>

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
        <Button onClick={onClose} sx={{ color: "text.secondary" }}>
          Cancelar
        </Button>
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
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      setDialogOpen(false);
      setMutError(null);
    },
    onError: (e: unknown) => setMutError(e instanceof Error ? e.message : "Error al crear producto"),
  });

  const updateMut = useMutation({
    mutationFn: ({ id, data }: { id: number; data: CreateProductPayload }) => adminUpdateProduct(id, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      setEditing(null);
      setMutError(null);
    },
    onError: (e: unknown) => setMutError(e instanceof Error ? e.message : "Error al actualizar producto"),
  });

  const deleteMut = useMutation({
    mutationFn: adminDeleteProduct,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      setDeleteTarget(null);
    },
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
          <Typography variant="h4" fontWeight={900} letterSpacing={-1.5}>
            Productos
          </Typography>
          <Typography variant="body2" color="text.disabled" mt={0.5}>
            Gestiona el catalogo de productos
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => {
            setDialogOpen(true);
            setMutError(null);
          }}
          sx={{ borderRadius: 1.5, bgcolor: "text.primary", color: "white", "&:hover": { bgcolor: "grey.800" } }}
        >
          Nuevo producto
        </Button>
      </Stack>

      <Box sx={{ borderRadius: 3, border: "1px solid rgba(0,0,0,0.07)", bgcolor: "white", overflow: "hidden" }}>
        <Box sx={{ px: 3, py: 2, borderBottom: "1px solid rgba(0,0,0,0.06)", bgcolor: "transparent" }}>
          <Typography
            variant="caption"
            fontWeight={700}
            color="text.disabled"
            letterSpacing={0.8}
            sx={{ textTransform: "uppercase", fontSize: "0.62rem" }}
          >
            {products.length} productos
          </Typography>
        </Box>

        {isLoading ? (
          <Box sx={{ px: 3, py: 5, textAlign: "center" }}>
            <Typography variant="body2" color="text.disabled">
              Cargando productos...
            </Typography>
          </Box>
        ) : products.length === 0 ? (
          <Box sx={{ px: 3, py: 5, textAlign: "center" }}>
            <Typography variant="body2" color="text.disabled">
              No hay productos registrados.
            </Typography>
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
                  <Typography variant="body2" fontWeight={600} noWrap>
                    {p.name}
                  </Typography>
                  <Typography variant="caption" color="text.disabled">
                    {p.brand} — Stock: {p.stock}
                  </Typography>
                </Box>
                <Stack direction="row" alignItems="center" gap={2}>
                  <Typography variant="body2" fontWeight={700}>
                    ${toCurrency(toNumber(p.price))}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => openEdit(p)}
                    sx={{ color: "text.secondary" }}
                    data-testid={`edit-btn-${p.id}`}
                  >
                    <EditOutlined sx={{ fontSize: 18 }} />
                  </IconButton>
                  <IconButton
                    size="small"
                    sx={{ color: "error.main" }}
                    onClick={() => setDeleteTarget(p.id)}
                    data-testid={`delete-btn-${p.id}`}
                  >
                    <DeleteOutline sx={{ fontSize: 18 }} />
                  </IconButton>
                </Stack>
              </Stack>
              {idx < products.length - 1 && <Divider />}
            </Box>
          ))
        )}
      </Box>

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

      <Dialog
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Eliminar producto</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            Esta seguro de que desea eliminar este producto? Esta accion no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setDeleteTarget(null)} sx={{ color: "text.secondary" }}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="error"
            disabled={deleteMut.isPending}
            onClick={() => deleteTarget && deleteMut.mutate(deleteTarget)}
            sx={{ borderRadius: 1.5 }}
          >
            {deleteMut.isPending ? "Eliminando..." : "Eliminar"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
