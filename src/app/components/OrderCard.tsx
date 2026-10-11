import { Schedule, CheckCircle, Cancel, HourglassTop, KeyboardArrowRight } from "@mui/icons-material";
import { Paper, Stack, Typography, Chip, Divider, Box } from "@mui/material";
import { OrderSummary } from "../api/orders";
import { formatDate, toCurrency, toNumber } from "../utils/format";

type StatusConfig = {
  label: string;
  color: string;
  Icon: React.ElementType;
};

const STATUS_CONFIG: Record<string, StatusConfig> = {
  pending: { label: "Pendiente", color: "#8a6d1d", Icon: Schedule },
  completed: { label: "Completada", color: "#2f6f4e", Icon: CheckCircle },
  cancelled: { label: "Cancelada", color: "#8a3a3a", Icon: Cancel },
  processing: { label: "En proceso", color: "#4a5568", Icon: HourglassTop },
};



export function OrderCard({ order, onClick }: { order: OrderSummary; onClick: () => void }) {
  const { label, color, Icon } = getStatusConfig(order.status);
  const isCancelled = order.status.toLowerCase() === "cancelled";

  function getStatusConfig(status: string): StatusConfig {
    return STATUS_CONFIG[status.toLowerCase()] ?? { label: status, color: "#4a5568", Icon: Schedule };
  }

  return (
    <Paper
      elevation={0}
      onClick={onClick}
      sx={{
        p: { xs: 2.5, md: 3 },
        borderRadius: 2,
        border: "1px solid",
        borderColor: "grey.200",
        cursor: "pointer",
        opacity: isCancelled ? 0.65 : 1,
        transition: "border-color 0.18s ease, background-color 0.18s ease",
        "&:hover": {
          borderColor: isCancelled ? "grey.300" : "grey.400",
          bgcolor: "grey.50",
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
              variant="outlined"
              sx={{
                fontWeight: 700,
                fontSize: "0.7rem",
                height: 22,
                borderRadius: 1,
                color,
                borderColor: "grey.300",
                "& .MuiChip-icon": { color }
              }}
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
              color={isCancelled ? "text.disabled" : "text.primary"}
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

