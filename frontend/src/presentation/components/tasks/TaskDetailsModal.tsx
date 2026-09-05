import { Calendar, User, X, Tag } from "lucide-react";
import type { Task } from "../../../types/task";
import StatusBadge from "../common/StatusBadge";
import PriorityBadge from "../common/PriorityBadge";
import DueDateBadge from "../common/DueDateBadge";

interface TaskDetailsModalProps {
  isOpen: boolean;
  task: Task | null;
  onClose: () => void;
}

const TaskDetailsModal = ({
  isOpen,
  task,
  onClose,
}: TaskDetailsModalProps) => {
  if (!isOpen || !task) return null;

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "N/A";
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Card */}
      <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl transition-all z-10 border border-neutral-200">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
          <div className="flex items-center gap-2">
            <PriorityBadge priority={task.priority} size="sm" />
            <StatusBadge status={task.status} size="sm" />
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4">
          <h3 className="text-xl font-bold text-neutral-900">{task.title}</h3>
          <p className="mt-2 text-sm text-neutral-600 whitespace-pre-line">
            {task.description}
          </p>
        </div>

        {/* Metadata Grid */}
        <div className="mt-6 grid grid-cols-2 gap-4 rounded-xl bg-neutral-50 p-4 border border-neutral-100 text-xs">
          <div>
            <span className="flex items-center gap-1 text-neutral-400 font-medium mb-1">
              <User className="h-3.5 w-3.5" /> Assigned Member
            </span>
            <span className="font-semibold text-neutral-800 break-all">
              {task.assignedTo}
            </span>
          </div>

          <div>
            <span className="flex items-center gap-1 text-neutral-400 font-medium mb-1">
              <User className="h-3.5 w-3.5" /> Creator
            </span>
            <span className="font-semibold text-neutral-800 break-all">
              {task.createdBy}
            </span>
          </div>

          <div>
            <span className="flex items-center gap-1 text-neutral-400 font-medium mb-1">
              <Calendar className="h-3.5 w-3.5" /> Due Date
            </span>
            <DueDateBadge dueDate={task.dueDate} status={task.status} />
          </div>

          <div>
            <span className="flex items-center gap-1 text-neutral-400 font-medium mb-1">
              <Tag className="h-3.5 w-3.5" /> Team ID
            </span>
            <span className="font-semibold text-neutral-800 break-all">
              {task.teamId}
            </span>
          </div>

          {task.completedAt && (
            <div className="col-span-2">
              <span className="flex items-center gap-1 text-neutral-400 font-medium mb-1">
                Completed Date
              </span>
              <span className="font-semibold text-emerald-700">
                {formatDate(task.completedAt)}
              </span>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-neutral-200 px-5 py-2 text-sm font-semibold text-neutral-600 transition hover:bg-neutral-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailsModal;
