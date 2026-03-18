import { Box, Chip, Stack, Typography } from "@mui/material";
import {
  CheckCircleOutline,
  Schedule,
  Cancel,
  HourglassTop,
} from "@mui/icons-material";
import { formatDate } from "../../../../utils/format";

type StatusConfig = {
  label: string;
  color: "default" | "warning" | "success" | "error" | "info";
  Icon: React.ElementType;
};

const STATUS_CONFIG: Record<string, StatusConfig> = {
  completed: { label: "Completada", color: "success", Icon: CheckCircleOutline },
  pending: { label: "Pendiente", color: "warning", Icon: Schedule },
  cancelled: { label: "Cancelada", color: "error", Icon: Cancel },
  processing: { label: "En proceso", color: "info", Icon: HourglassTop },
};

const STATUS_MESSAGES: Record<string, string> = {
  completed: "Esta orden fue procesada y pagada exitosamente.",
  pending:
    "Esta orden aun no ha sido pagada. Las ordenes sin pago se cancelan automaticamente a los 30 minutos.",
  cancelled: "Esta orden fue cancelada y no genero ningun cobro",
  processing: "Estamos verificando el pago. Te notificaremos pronto",
};

export function getStatusConfig(status: string): StatusConfig {
  return (
    STATUS_CONFIG[status.toLowerCase()] ?? {
      label: status,
      color: "default",
      Icon: Schedule,
    }
  );
}

interface OrderStatusHeaderProps {
  orderId: string;
  status: string;
  createdAt: string;
}

export function OrderStatusHeader({ orderId, status, createdAt }: OrderStatusHeaderProps) {
  const { label, color, Icon } = getStatusConfig(status);
  const isCancelled = status.toLowerCase() === "cancelled";
  const statusNote = STATUS_MESSAGES[status.toLowerCase()] ?? "";

  return (
    <Box
      sx={{
        px: { xs: 3, md: 4 },
        py: 3,
        borderBottom: "1px solid",
        borderColor: "grey.100",
        display: "flex",
        alignItems: "flex-start",
        gap: 2,
      }}
    >
      <Icon
        sx={{
          fontSize: 28,
          color: isCancelled ? "text.disabled" : `${color}.main`,
          mt: 0.25,
          flexShrink: 0,
        }}
      />
      <Box sx={{ minWidth: 0 }}>
        <Stack direction="row" alignItems="center" gap={1.5} flexWrap="wrap">
          <Typography variant="subtitle1" fontWeight={700}>
            Orden #{orderId.split("-")[0].toUpperCase()}
          </Typography>
          <Chip label={label} color={color} size="small" sx={{ fontWeight: 700, height: 22 }} />
        </Stack>
        <Typography variant="caption" color="text.disabled" display="block" mt={0.25}>
          {formatDate(createdAt)}
        </Typography>
        {statusNote && (
          <Typography
            variant="caption"
            color="text.secondary"
            display="block"
            mt={1}
            sx={{ maxWidth: 420 }}
          >
            {statusNote}
          </Typography>
        )}
      </Box>
    </Box>
  );
}
