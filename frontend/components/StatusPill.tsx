import { cn, statusLabel } from "@/lib/utils";
import type { OrderStatus } from "@/lib/types";

const statusClasses: Record<OrderStatus, string> = {
  pending: "bg-gold/15 text-amber-800",
  in_progress: "bg-brand/10 text-brandDark",
  completed: "bg-emerald-100 text-emerald-800"
};

export function StatusPill({ status }: { status: OrderStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-bold",
        statusClasses[status]
      )}
    >
      {statusLabel(status)}
    </span>
  );
}
