import { cn } from "@/lib/utils";
import { RequestStatus } from "@/types";
import { Clock, CheckCircle2, XCircle } from "lucide-react";

interface StatusBadgeProps {
  status: RequestStatus;
  className?: string;
}

const statusConfig = {
  pending: {
    label: "Pending",
    icon: Clock,
    className: "bg-warning/10 text-warning border-warning/20",
  },
  approved: {
    label: "Approved",
    icon: CheckCircle2,
    className: "bg-success/10 text-success border-success/20",
  },
  rejected: {
    label: "Rejected",
    icon: XCircle,
    className: "bg-destructive/10 text-destructive border-destructive/20",
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
        config.className,
        className
      )}
    >
      <Icon className="h-3 w-3" />
      {config.label}
    </span>
  );
}
