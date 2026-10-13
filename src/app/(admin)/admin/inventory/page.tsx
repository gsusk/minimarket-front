"use client";

import {
  Box,
  Typography,
  Stack,
  TextField,
  Button,
  Divider,
  Alert,
  InputAdornment,
  Paper,
  Collapse,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
} from "@mui/material";
import {
  SearchOutlined,
  UploadFileOutlined,
  ExpandMoreOutlined,
  ExpandLessOutlined,
  DownloadOutlined,
  CheckCircleOutline,
  ErrorOutline,
  WarningAmberOutlined,
} from "@mui/icons-material";
import { useState, useMemo, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminAdjustStock } from "../../../api/admin";
import { getFeaturedProducts, DetailedProduct } from "../../../api/products";

interface BulkItem {
  productId?: number;
  name?: string;
  quantity: number;
  reason: string;
}

interface ResolvedItem {
  product: DetailedProduct;
  quantity: number;
  reason: string;
}

interface ParseError {
  index: number;
  raw: Partial<BulkItem>;
  message: string;
}

const TEMPLATE: BulkItem[] = [
  { productId: 1,   quantity: 50,  reason: "Reabastecimiento mensual" },
  { name: "Nombre del producto", quantity: -5, reason: "Merma / ajuste" },
];

function downloadTemplate() {
  const blob = new Blob([JSON.stringify(TEMPLATE, null, 2)], { type: "application/json" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href     = url;
  a.download = "bulk_stock_template.json";
  a.click();
  URL.revokeObjectURL(url);
}

function resolveItems(
  raw: BulkItem[],
  products: DetailedProduct[]
): { resolved: ResolvedItem[]; errors: ParseError[] } {
  const resolved: ResolvedItem[] = [];
  const errors: ParseError[]     = [];

  raw.forEach((item, idx) => {
    if (typeof item.quantity !== "number" || item.quantity === 0) {
      errors.push({ index: idx, raw: item, message: "quantity debe ser un número distinto de 0." });
      return;
    }
    if (!item.reason || String(item.reason).trim() === "") {
      errors.push({ index: idx, raw: item, message: "reason no puede estar vacío." });
      return;
    }

    let product: DetailedProduct | undefined;

    if (item.productId !== undefined) {
      product = products.find((p) => p.id === item.productId);
      if (!product) {
        errors.push({ index: idx, raw: item, message: `No se encontró producto con id ${item.productId}.` });
        return;
      }
    } else if (item.name) {
      const needle = item.name.toLowerCase().trim();
      product = products.find((p) => p.name.toLowerCase().includes(needle));
      if (!product) {
        errors.push({ index: idx, raw: item, message: `No se encontró producto con nombre "${item.name}".` });
        return;
      }
    } else {
      errors.push({ index: idx, raw: item, message: "Debe especificar productId o name." });
      return;
    }

    resolved.push({ product, quantity: item.quantity, reason: String(item.reason).trim() });
  });

  return { resolved, errors };
}

type BulkStatus = "idle" | "parsed" | "running" | "done";

interface BulkResult {
  item: ResolvedItem;
  ok: boolean;
  error?: string;
}

function BulkImportPanel({
  products,
  onDone,
}: {
  products: DetailedProduct[];
  onDone: () => void;
}) {
  const [open, setOpen]           = useState(false);
  const [jsonText, setJsonText]   = useState("");
  const [parseErr, setParseErr]   = useState<string | null>(null);
  const [resolved, setResolved]   = useState<ResolvedItem[]>([]);
  const [parseErrors, setParseErrors] = useState<ParseError[]>([]);
  const [status, setStatus]       = useState<BulkStatus>("idle");
  const [results, setResults]     = useState<BulkResult[]>([]);
  const [progress, setProgress]   = useState(0);
  const fileRef                   = useRef<HTMLInputElement>(null);

  const parse = () => {
    setParseErr(null);
    setResolved([]);
    setParseErrors([]);
    setResults([]);
    setStatus("idle");

    let parsed: unknown;
    try {
      parsed = JSON.parse(jsonText);
    } catch {
      setParseErr("JSON inválido. Verifica la sintaxis.");
      return;
    }

    if (!Array.isArray(parsed)) {
      setParseErr("El JSON debe ser un arreglo [ ... ].");
      return;
    }

    const { resolved: res, errors: errs } = resolveItems(parsed as BulkItem[], products);
    setResolved(res);
    setParseErrors(errs);
    setStatus("parsed");
  };

  const apply = async () => {
    setStatus("running");
    setResults([]);
    const out: BulkResult[] = [];

    for (let i = 0; i < resolved.length; i++) {
      const item = resolved[i];
      setProgress(Math.round(((i) / resolved.length) * 100));
      try {
        await adminAdjustStock(item.product.id, {
          quantity: item.quantity,
          reason: item.reason,
        });
        out.push({ item, ok: true });
      } catch (e: unknown) {
        out.push({ item, ok: false, error: e instanceof Error ? e.message : "Error desconocido" });
      }
    }

    setProgress(100);
    setResults(out);
    setStatus("done");
    onDone();
  };

  const reset = () => {
    setJsonText("");
    setParseErr(null);
    setResolved([]);
    setParseErrors([]);
    setResults([]);
    setStatus("idle");
    setProgress(0);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setJsonText((ev.target?.result as string) ?? "");
      setStatus("idle");
      setParseErr(null);
      setResolved([]);
      setParseErrors([]);
      setResults([]);
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const successCount = results.filter((r) => r.ok).length;
  const failCount    = results.filter((r) => !r.ok).length;

  return (
    <Paper
      elevation={0}
      sx={{ borderRadius: 2, border: "1px solid #e5e7eb", bgcolor: "white", overflow: "hidden", mb: 3 }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        onClick={() => setOpen((v) => !v)}
        sx={{ px: 3, py: 2, cursor: "pointer", userSelect: "none", "&:hover": { bgcolor: "#f9fafb" } }}
      >
        <Stack direction="row" alignItems="center" gap={1.5}>
          <UploadFileOutlined sx={{ fontSize: 18, color: "#6b7280" }} />
          <Box>
            <Typography sx={{ fontSize: "0.88rem", fontWeight: 700, color: "#111827" }}>
              Importación masiva
            </Typography>
            <Typography sx={{ fontSize: "0.75rem", color: "#9ca3af" }}>
              Ajusta el stock de múltiples productos a la vez con un archivo JSON
            </Typography>
          </Box>
        </Stack>
        {open ? (
          <ExpandLessOutlined sx={{ fontSize: 20, color: "#9ca3af" }} />
        ) : (
          <ExpandMoreOutlined sx={{ fontSize: 20, color: "#9ca3af" }} />
        )}
      </Stack>

      <Collapse in={open}>
        <Divider sx={{ borderColor: "#f3f4f6" }} />

        <Box sx={{ p: 3 }}>
          <Paper
            elevation={0}
            sx={{ p: 2, borderRadius: 1.5, bgcolor: "#f9fafb", border: "1px solid #e5e7eb", mb: 2.5 }}
          >
            <Typography sx={{ fontSize: "0.78rem", fontWeight: 700, color: "#374151", mb: 0.75 }}>
              Formato esperado
            </Typography>
            <Box
              component="pre"
              sx={{
                fontSize: "0.72rem",
                color: "#374151",
                fontFamily: "monospace",
                bgcolor: "#f1f5f9",
                borderRadius: 1,
                p: 1.5,
                overflow: "auto",
                m: 0,
              }}
            >
              {`[
  { "productId": 12, "quantity": 50, "reason": "Reabastecimiento" },
  { "name": "Nombre parcial", "quantity": -3, "reason": "Merma" }
]`}
            </Box>
            <Typography sx={{ fontSize: "0.72rem", color: "#9ca3af", mt: 1 }}>
              Usa <code style={{ fontFamily: "monospace", color: "#374151" }}>productId</code> (número) o{" "}
              <code style={{ fontFamily: "monospace", color: "#374151" }}>name</code> (texto, búsqueda parcial).
              El campo <code style={{ fontFamily: "monospace", color: "#374151" }}>quantity</code> puede ser
              positivo (entrada) o negativo (salida/merma).
            </Typography>
          </Paper>

          <Stack direction={{ xs: "column", sm: "row" }} gap={1.5} mb={2}>
            <Button
              size="small"
              variant="outlined"
              startIcon={<DownloadOutlined sx={{ fontSize: 15 }} />}
              onClick={downloadTemplate}
              sx={{
                borderRadius: 1.5,
                textTransform: "none",
                fontSize: "0.78rem",
                borderColor: "#d1d5db",
                color: "#374151",
                "&:hover": { borderColor: "#6b7280", bgcolor: "transparent" },
              }}
            >
              Descargar plantilla
            </Button>
            <Button
              size="small"
              variant="outlined"
              startIcon={<UploadFileOutlined sx={{ fontSize: 15 }} />}
              onClick={() => fileRef.current?.click()}
              sx={{
                borderRadius: 1.5,
                textTransform: "none",
                fontSize: "0.78rem",
                borderColor: "#d1d5db",
                color: "#374151",
                "&:hover": { borderColor: "#6b7280", bgcolor: "transparent" },
              }}
            >
              Cargar archivo .json
            </Button>
            <input
              ref={fileRef}
              type="file"
              accept=".json,application/json"
              style={{ display: "none" }}
              onChange={handleFileUpload}
            />
          </Stack>

          <TextField
            multiline
            rows={8}
            fullWidth
            placeholder={`[\n  { "productId": 1, "quantity": 20, "reason": "Reabastecimiento" }\n]`}
            value={jsonText}
            onChange={(e) => {
              setJsonText(e.target.value);
              if (status !== "idle") reset();
            }}
            disabled={status === "running"}
            sx={{
              mb: 1.5,
              fontFamily: "monospace",
              "& .MuiOutlinedInput-root": {
                borderRadius: 1.5,
                fontFamily: "monospace",
                fontSize: "0.78rem",
                bgcolor: "#f9fafb",
              },
            }}
          />

          {parseErr && (
            <Alert severity="error" sx={{ mb: 1.5, borderRadius: 1.5 }}>
              {parseErr}
            </Alert>
          )}

          {status === "idle" || status === "parsed" ? (
            <Stack direction="row" gap={1.5} alignItems="center">
              <Button
                variant="contained"
                size="small"
                disabled={!jsonText.trim()}
                onClick={parse}
                sx={{
                  borderRadius: 1.5,
                  bgcolor: "#111827",
                  color: "white",
                  textTransform: "none",
                  fontWeight: 600,
                  boxShadow: "none",
                  "&:hover": { bgcolor: "#1f2937", boxShadow: "none" },
                  "&:disabled": { bgcolor: "#e5e7eb", color: "#9ca3af" },
                }}
              >
                Validar JSON
              </Button>
              {status === "parsed" && resolved.length > 0 && (
                <Button
                  variant="contained"
                  size="small"
                  onClick={apply}
                  sx={{
                    borderRadius: 1.5,
                    bgcolor: "#166534",
                    color: "white",
                    textTransform: "none",
                    fontWeight: 600,
                    boxShadow: "none",
                    "&:hover": { bgcolor: "#14532d", boxShadow: "none" },
                  }}
                >
                  Aplicar {resolved.length} ajuste{resolved.length !== 1 ? "s" : ""}
                </Button>
              )}
              {status === "parsed" && (
                <Button
                  size="small"
                  onClick={reset}
                  sx={{ textTransform: "none", fontSize: "0.78rem", color: "#9ca3af" }}
                >
                  Limpiar
                </Button>
              )}
            </Stack>
          ) : status === "running" ? (
            <Box>
              <Typography sx={{ fontSize: "0.78rem", color: "#6b7280", mb: 1 }}>
                Aplicando ajustes... {progress}%
              </Typography>
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{ borderRadius: 1, height: 6, bgcolor: "#e5e7eb", "& .MuiLinearProgress-bar": { bgcolor: "#111827" } }}
              />
            </Box>
          ) : (
            <Stack direction="row" gap={1.5} alignItems="center">
              <Button
                size="small"
                onClick={reset}
                sx={{
                  borderRadius: 1.5,
                  textTransform: "none",
                  fontSize: "0.78rem",
                  borderColor: "#d1d5db",
                  color: "#374151",
                  border: "1px solid #d1d5db",
                  "&:hover": { borderColor: "#6b7280", bgcolor: "transparent" },
                }}
              >
                Nueva importación
              </Button>
              <Typography sx={{ fontSize: "0.78rem", color: "#6b7280" }}>
                {successCount} exitosos · {failCount} con error
              </Typography>
            </Stack>
          )}

          {status === "parsed" && (resolved.length > 0 || parseErrors.length > 0) && (
            <Box mt={2.5}>
              {parseErrors.length > 0 && (
                <Alert severity="warning" sx={{ mb: 2, borderRadius: 1.5 }}>
                  {parseErrors.length} ítem{parseErrors.length !== 1 ? "s" : ""} con errores de validación
                  (ver detalle abajo). Solo se aplicarán los {resolved.length} válidos.
                </Alert>
              )}

              <Typography sx={{ fontSize: "0.72rem", fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 0.5, mb: 1 }}>
                Vista previa — {resolved.length + parseErrors.length} ítems procesados
              </Typography>

              <Paper elevation={0} sx={{ border: "1px solid #e5e7eb", borderRadius: 1.5, overflow: "hidden" }}>
                <TableContainer sx={{ maxHeight: 340 }}>
                  <Table size="small" stickyHeader>
                    <TableHead>
                      <TableRow sx={{ "& th": { bgcolor: "#f9fafb", fontSize: "0.68rem", fontWeight: 700, color: "#6b7280", letterSpacing: 0.4, textTransform: "uppercase", borderBottomColor: "#e5e7eb" } }}>
                        <TableCell>#</TableCell>
                        <TableCell>Producto</TableCell>
                        <TableCell align="center">Ajuste</TableCell>
                        <TableCell>Motivo</TableCell>
                        <TableCell align="center">Estado</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {resolved.map((item, i) => (
                        <TableRow key={i} sx={{ "& td": { fontSize: "0.78rem", py: 1, borderBottomColor: "#f3f4f6" } }}>
                          <TableCell sx={{ color: "#9ca3af" }}>{i + 1}</TableCell>
                          <TableCell>
                            <Typography sx={{ fontSize: "0.82rem", fontWeight: 600, color: "#111827" }}>
                              {item.product.name}
                            </Typography>
                            <Typography sx={{ fontSize: "0.7rem", color: "#9ca3af" }}>
                              ID {item.product.id} · stock actual: {item.product.stock}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Box
                              sx={{
                                display: "inline-block",
                                fontFamily: "monospace",
                                fontWeight: 700,
                                fontSize: "0.82rem",
                                color: item.quantity > 0 ? "#166534" : "#991b1b",
                              }}
                            >
                              {item.quantity > 0 ? `+${item.quantity}` : item.quantity}
                            </Box>
                          </TableCell>
                          <TableCell sx={{ color: "#374151", maxWidth: 200 }}>
                            <Typography noWrap sx={{ fontSize: "0.78rem" }}>{item.reason}</Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Box
                              sx={{
                                fontSize: "0.65rem",
                                fontWeight: 700,
                                color: "#166534",
                                bgcolor: "#f0fdf4",
                                px: 0.75,
                                py: 0.2,
                                borderRadius: 0.75,
                                display: "inline-block",
                              }}
                            >
                              Válido
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                      {parseErrors.map((err, i) => (
                        <TableRow key={`err-${i}`} sx={{ bgcolor: "#fff7f7", "& td": { fontSize: "0.78rem", py: 1, borderBottomColor: "#f3f4f6" } }}>
                          <TableCell sx={{ color: "#9ca3af" }}>{resolved.length + i + 1}</TableCell>
                          <TableCell colSpan={3} sx={{ color: "#991b1b" }}>
                            <Typography sx={{ fontSize: "0.78rem", fontWeight: 600 }}>{err.message}</Typography>
                            <Typography sx={{ fontSize: "0.7rem", color: "#9ca3af", fontFamily: "monospace" }}>
                              {JSON.stringify(err.raw)}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Box
                              sx={{
                                fontSize: "0.65rem",
                                fontWeight: 700,
                                color: "#991b1b",
                                bgcolor: "#fef2f2",
                                px: 0.75,
                                py: 0.2,
                                borderRadius: 0.75,
                                display: "inline-block",
                              }}
                            >
                              Error
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Box>
          )}

          {status === "done" && results.length > 0 && (
            <Box mt={2.5}>
              <Stack direction="row" gap={2} mb={1.5}>
                {successCount > 0 && (
                  <Stack direction="row" alignItems="center" gap={0.75}>
                    <CheckCircleOutline sx={{ fontSize: 16, color: "#16a34a" }} />
                    <Typography sx={{ fontSize: "0.78rem", color: "#166534", fontWeight: 600 }}>
                      {successCount} aplicado{successCount !== 1 ? "s" : ""}
                    </Typography>
                  </Stack>
                )}
                {failCount > 0 && (
                  <Stack direction="row" alignItems="center" gap={0.75}>
                    <ErrorOutline sx={{ fontSize: 16, color: "#dc2626" }} />
                    <Typography sx={{ fontSize: "0.78rem", color: "#991b1b", fontWeight: 600 }}>
                      {failCount} fallido{failCount !== 1 ? "s" : ""}
                    </Typography>
                  </Stack>
                )}
              </Stack>

              <Paper elevation={0} sx={{ border: "1px solid #e5e7eb", borderRadius: 1.5, overflow: "hidden" }}>
                <TableContainer sx={{ maxHeight: 300 }}>
                  <Table size="small" stickyHeader>
                    <TableHead>
                      <TableRow sx={{ "& th": { bgcolor: "#f9fafb", fontSize: "0.68rem", fontWeight: 700, color: "#6b7280", letterSpacing: 0.4, textTransform: "uppercase", borderBottomColor: "#e5e7eb" } }}>
                        <TableCell>Producto</TableCell>
                        <TableCell align="center">Ajuste</TableCell>
                        <TableCell>Motivo</TableCell>
                        <TableCell align="center">Resultado</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {results.map((r, i) => (
                        <TableRow key={i} sx={{ "& td": { fontSize: "0.78rem", py: 1, borderBottomColor: "#f3f4f6" } }}>
                          <TableCell sx={{ fontWeight: 600, color: "#111827" }}>
                            {r.item.product.name}
                          </TableCell>
                          <TableCell align="center">
                            <Box
                              sx={{
                                fontFamily: "monospace",
                                fontWeight: 700,
                                fontSize: "0.82rem",
                                color: r.item.quantity > 0 ? "#166534" : "#991b1b",
                              }}
                            >
                              {r.item.quantity > 0 ? `+${r.item.quantity}` : r.item.quantity}
                            </Box>
                          </TableCell>
                          <TableCell sx={{ color: "#374151" }}>
                            <Typography noWrap sx={{ fontSize: "0.78rem" }}>{r.item.reason}</Typography>
                          </TableCell>
                          <TableCell align="center">
                            {r.ok ? (
                              <Box sx={{ fontSize: "0.65rem", fontWeight: 700, color: "#166534", bgcolor: "#f0fdf4", px: 0.75, py: 0.2, borderRadius: 0.75, display: "inline-block" }}>
                                OK
                              </Box>
                            ) : (
                              <Box
                                sx={{ fontSize: "0.65rem", fontWeight: 700, color: "#991b1b", bgcolor: "#fef2f2", px: 0.75, py: 0.2, borderRadius: 0.75, display: "inline-block" }}
                                title={r.error}
                              >
                                Error
                              </Box>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Box>
          )}
        </Box>
      </Collapse>
    </Paper>
  );
}


function StockRow({
  product,
  onAdjust,
}: {
  product: DetailedProduct;
  onAdjust: (productId: number, qty: number, reason: string) => void;
}) {
  const [qty, setQty] = useState("");
  const [reason, setReason] = useState("");

  const qtyNum = parseInt(qty, 10);
  const valid  = !isNaN(qtyNum) && qtyNum !== 0 && reason.trim().length > 0;
  const low    = product.stock <= 5;

  return (
    <Box sx={{ px: 3, py: 2.5 }}>
      <Stack direction={{ xs: "column", md: "row" }} alignItems={{ md: "center" }} gap={2}>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Stack direction="row" alignItems="center" gap={1.5}>
            <Typography sx={{ fontSize: "0.88rem", fontWeight: 600, color: "#111827" }} noWrap>
              {product.name}
            </Typography>
            {low && (
              <Box
                sx={{
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  color: "#92400e",
                  bgcolor: "#fef3c7",
                  px: 0.75,
                  py: 0.2,
                  borderRadius: 0.75,
                  whiteSpace: "nowrap",
                }}
              >
                Stock bajo
              </Box>
            )}
          </Stack>
          <Typography sx={{ fontSize: "0.75rem", color: "#9ca3af" }}>{product.brand}</Typography>
          <Typography sx={{ fontSize: "0.82rem", fontWeight: 600, color: "#374151", mt: 0.25 }}>
            Stock actual:{" "}
            <Box component="span" sx={{ fontFamily: "monospace", fontWeight: 700, color: "#111827" }}>
              {product.stock}
            </Box>
          </Typography>
        </Box>

        <Stack direction={{ xs: "column", sm: "row" }} gap={1.5} sx={{ flex: 2 }}>
          <TextField
            label="Ajuste (+/-)"
            size="small"
            type="number"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
            placeholder="ej. 10 o -3"
            sx={{ flex: 1, "& .MuiOutlinedInput-root": { borderRadius: 1.5 } }}
          />
          <TextField
            label="Motivo"
            size="small"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Reabastecimiento, ajuste..."
            sx={{ flex: 1.5, "& .MuiOutlinedInput-root": { borderRadius: 1.5 } }}
          />
          <Button
            variant="outlined"
            size="small"
            disabled={!valid}
            onClick={() => {
              onAdjust(product.id, qtyNum, reason.trim());
              setQty("");
              setReason("");
            }}
            sx={{
              borderRadius: 1.5,
              fontWeight: 600,
              textTransform: "none",
              borderColor: "#d1d5db",
              color: "#374151",
              "&:hover": { borderColor: "#6b7280", bgcolor: "transparent" },
              whiteSpace: "nowrap",
            }}
          >
            Aplicar
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}


export default function AdminInventoryPage() {
  const queryClient                       = useQueryClient();
  const [search, setSearch]               = useState("");
  const [successMsg, setSuccessMsg]       = useState<string | null>(null);
  const [errorMsg, setErrorMsg]           = useState<string | null>(null);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["admin", "products"],
    queryFn: getFeaturedProducts,
  });

  const adjustMut = useMutation({
    mutationFn: ({ id, qty, reason }: { id: number; qty: number; reason: string }) =>
      adminAdjustStock(id, { quantity: qty, reason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      setSuccessMsg("Stock actualizado correctamente.");
      setErrorMsg(null);
      setTimeout(() => setSuccessMsg(null), 3000);
    },
    onError: (e: unknown) => {
      setErrorMsg(e instanceof Error ? e.message : "Error al ajustar el stock.");
      setSuccessMsg(null);
    },
  });

  const filtered = useMemo(
    () =>
      products.filter(
        (p) =>
          !search ||
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.brand.toLowerCase().includes(search.toLowerCase())
      ),
    [products, search]
  );

  return (
    <Box>
      <Box mb={4}>
        <Typography
          sx={{ fontSize: "0.7rem", fontWeight: 700, color: "#6366f1", textTransform: "uppercase", letterSpacing: 1 }}
        >
          Gestión
        </Typography>
        <Typography sx={{ fontSize: "1.6rem", fontWeight: 800, color: "#111827", mt: 0.25 }}>
          Inventario
        </Typography>
        <Typography sx={{ fontSize: "0.85rem", color: "#6b7280", mt: 0.5 }}>
          Ajusta el stock de forma individual o carga ajustes masivos vía JSON
        </Typography>
      </Box>

      {successMsg && (
        <Alert severity="success" sx={{ mb: 3, borderRadius: 1.5 }} onClose={() => setSuccessMsg(null)}>
          {successMsg}
        </Alert>
      )}
      {errorMsg && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 1.5 }} onClose={() => setErrorMsg(null)}>
          {errorMsg}
        </Alert>
      )}

      {!isLoading && (
        <BulkImportPanel
          products={products}
          onDone={() => {
            queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
          }}
        />
      )}

      <TextField
        placeholder="Buscar producto o marca..."
        size="small"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        fullWidth
        sx={{ mb: 3, "& .MuiOutlinedInput-root": { borderRadius: 1.5, bgcolor: "white" } }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchOutlined sx={{ fontSize: 17, color: "#9ca3af" }} />
              </InputAdornment>
            ),
          },
        }}
      />

      <Paper
        elevation={0}
        sx={{ borderRadius: 2, border: "1px solid #e5e7eb", bgcolor: "white", overflow: "hidden" }}
      >
        <Box sx={{ px: 3, py: 1.75, borderBottom: "1px solid #f3f4f6" }}>
          <Typography
            sx={{ fontSize: "0.68rem", fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 0.5 }}
          >
            {filtered.length} productos
          </Typography>
        </Box>

        {isLoading ? (
          <Box sx={{ px: 3, py: 6, textAlign: "center" }}>
            <Typography sx={{ fontSize: "0.85rem", color: "#9ca3af" }}>Cargando...</Typography>
          </Box>
        ) : filtered.length === 0 ? (
          <Box sx={{ px: 3, py: 6, textAlign: "center" }}>
            <Typography sx={{ fontSize: "0.85rem", color: "#9ca3af" }}>Sin productos que coincidan.</Typography>
          </Box>
        ) : (
          filtered.map((p, idx) => (
            <Box key={p.id}>
              <StockRow
                product={p}
                onAdjust={(id, qty, reason) => adjustMut.mutate({ id, qty, reason })}
              />
              {idx < filtered.length - 1 && <Divider sx={{ borderColor: "#f3f4f6" }} />}
            </Box>
          ))
        )}
      </Paper>
    </Box>
  );
}
