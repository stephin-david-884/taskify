import { TaskStatus } from "../../../types/task";
import { CheckCircle2, Clock, ListTodo } from "lucide-react";

interface StatusBadgeProps {
  status: TaskStatus;
  size?: "sm" | "md";
}

const StatusBadge = ({ status, size = "md" }: StatusBadgeProps) => {
  const config = {
    [TaskStatus.TODO]: {
      label: "Todo",
      bg: "bg-slate-100 text-slate-700 border-slate-200",
      dot: "bg-slate-400",
      icon: ListTodo,
    },
    [TaskStatus.IN_PROGRESS]: {
      label: "In Progress",
      bg: "bg-amber-50 text-amber-700 border-amber-200",
      dot: "bg-amber-500",
      icon: Clock,
    },
    [TaskStatus.COMPLETED]: {
      label: "Completed",
      bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
      dot: "bg-emerald-500",
      icon: CheckCircle2,
    },
  };

  const current = config[status] || config[TaskStatus.TODO];
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

export default StatusBadge;
