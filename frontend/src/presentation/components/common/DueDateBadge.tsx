import { Calendar, AlertTriangle } from "lucide-react";
import { TaskStatus } from "../../../types/task";

interface DueDateBadgeProps {
  dueDate?: string;
  status?: TaskStatus;
}

const DueDateBadge = ({ dueDate, status }: DueDateBadgeProps) => {
  if (!dueDate) {
    return <span className="text-xs text-neutral-400">No due date</span>;
  }

  const parsedDate = new Date(dueDate);
  if (isNaN(parsedDate.getTime())) {
    return <span className="text-xs text-neutral-400">No due date</span>;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isOverdue =
    parsedDate < today && status !== TaskStatus.COMPLETED;

  const formattedDate = parsedDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: parsedDate.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
  });

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium ${
        isOverdue
          ? "bg-rose-50 text-rose-700 border border-rose-200"
          : "bg-neutral-100 text-neutral-600 border border-neutral-200"
      }`}
    >
      {isOverdue ? (
        <AlertTriangle className="h-3.5 w-3.5 text-rose-500" />
      ) : (
        <Calendar className="h-3.5 w-3.5 text-neutral-400" />
      )}
      <span>
        {isOverdue ? `Overdue (${formattedDate})` : `Due ${formattedDate}`}
      </span>
    </span>
  );
};

export default DueDateBadge;
