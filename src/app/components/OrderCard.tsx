import { Schedule, CheckCircle, Cancel, HourglassTop, KeyboardArrowRight } from "@mui/icons-material";
import { Paper, Stack, Typography, Chip, Divider, Box } from "@mui/material";
import { OrderSummary } from "../api/orders";
import { formatDate, toCurrency, toNumber } from "../utils/format";

type StatusConfig = {
  label: string;
  color: "default" | "warning" | "success" | "error" | "info";
  Icon: React.ElementType;
};

const STATUS_CONFIG: Record<string, StatusConfig> = {
  pending: { label: "Pendiente", color: "warning", Icon: Schedule },
  completed: { label: "Completada", color: "success", Icon: CheckCircle },
  cancelled: { label: "Cancelada", color: "error", Icon: Cancel },
  processing: { label: "En proceso", color: "info", Icon: HourglassTop },
};



export function OrderCard({ order, onClick }: { order: OrderSummary; onClick: () => void }) {
  const { label, color, Icon } = getStatusConfig(order.status);
  const isCancelled = order.status.toLowerCase() === "cancelled";

  function getStatusConfig(status: string): StatusConfig {
    return STATUS_CONFIG[status.toLowerCase()] ?? { label: status, color: "default", Icon: Schedule };
  }

  return (
    <Paper
      elevation={0}
      onClick={onClick}
      sx={{
        p: { xs: 2.5, md: 3 },
        borderRadius: 3,
        border: "1px solid",
        borderColor: "grey.200",
        cursor: "pointer",
        opacity: isCancelled ? 0.65 : 1,
        transition: "all 0.18s ease",
        "&:hover": {
          borderColor: isCancelled ? "grey.300" : "primary.main",
          boxShadow: isCancelled ? "none" : "0 4px 18px rgba(25,118,210,0.1)",
          transform: isCancelled ? "none" : "translateY(-2px)",
        },
      }}
    >
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        gap={2}
      >
        <Stack gap={0.5} flex={1} minWidth={0}>
          <Stack direction="row" alignItems="center" gap={1} flexWrap="wrap">
            <Typography variant="body2" color="text.disabled" fontFamily="monospace" fontSize="0.8rem">
              #{order.orderId.split("-")[0].toUpperCase()}
            </Typography>
            <Chip
              icon={<Icon style={{ fontSize: 13 }} />}
              label={label}
              size="small"
              color={color}
              sx={{ fontWeight: 700, fontSize: "0.7rem", height: 22 }}
            />
          </Stack>
          <Typography variant="body2" color="text.secondary">
            {formatDate(order.createdAt)}
          </Typography>
          {order.items.length > 0 && (
            <Typography variant="caption" color="text.disabled" noWrap>
              {order.items.map((i) => i.productName).join(", ")}
            </Typography>
          )}
        </Stack>

        <Divider orientation="vertical" flexItem sx={{ display: { xs: "none", sm: "block" } }} />

        <Stack direction="row" alignItems="center" gap={1.5} flexShrink={0}>
          <Box textAlign="right">
            <Typography variant="caption" color="text.secondary" display="block">
              Total
            </Typography>
            <Typography
              variant="h6"
              fontWeight={800}
              color={isCancelled ? "text.disabled" : "primary.main"}
            >
              ${toCurrency(toNumber(order.totalAmount))}
            </Typography>
          </Box>
          <KeyboardArrowRight sx={{ color: "text.disabled" }} />
        </Stack>
      </Stack>
    </Paper>
  );
}

