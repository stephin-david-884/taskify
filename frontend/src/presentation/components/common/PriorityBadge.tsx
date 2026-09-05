import { TaskPriority } from "../../../types/task";
import { AlertCircle, ArrowDown, ArrowUp } from "lucide-react";

interface PriorityBadgeProps {
  priority: TaskPriority;
  size?: "sm" | "md";
}

const PriorityBadge = ({ priority, size = "md" }: PriorityBadgeProps) => {
  const config = {
    [TaskPriority.LOW]: {
      label: "Low",
      bg: "bg-slate-100 text-slate-700 border-slate-200",
      icon: ArrowDown,
    },
    [TaskPriority.MEDIUM]: {
      label: "Medium",
      bg: "bg-blue-50 text-blue-700 border-blue-200",
      icon: AlertCircle,
    },
    [TaskPriority.HIGH]: {
      label: "High",
      bg: "bg-rose-50 text-rose-700 border-rose-200 font-semibold",
      icon: ArrowUp,
    },
  };

  const current = config[priority] || config[TaskPriority.MEDIUM];
  const Icon = current.icon;

  const sizeStyles =
    size === "sm"
      ? "px-2 py-0.5 text-xs gap-1"
      : "px-2.5 py-1 text-xs sm:text-sm gap-1.5";

  return (
    <span
      className={`inline-flex items-center rounded-full border font-medium transition-colors ${current.bg} ${sizeStyles}`}
    >
      <Icon className={size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5"} />
      <span>{current.label}</span>
    </span>
  );
};

export default PriorityBadge;
