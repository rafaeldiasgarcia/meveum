import { Badge } from "@/components/ui/badge";
import type { StatusPedido } from "@/types";

const STATUS_CONFIG: Record<StatusPedido, { label: string; variant: "info" | "warning" | "success" | "purple" | "secondary" | "danger" }> = {
  recebido: { label: "Recebido", variant: "info" },
  em_preparo: { label: "Em preparo", variant: "warning" },
  pronto: { label: "Pronto", variant: "success" },
  saiu_entrega: { label: "Saiu p/ entrega", variant: "purple" },
  finalizado: { label: "Finalizado", variant: "secondary" },
  cancelado: { label: "Cancelado", variant: "danger" },
};

type Props = { status: StatusPedido; className?: string };

export function StatusPedidoBadge({ status, className }: Props) {
  const config = STATUS_CONFIG[status];
  return (
    <Badge variant={config.variant} className={className}>
      {config.label}
    </Badge>
  );
}
