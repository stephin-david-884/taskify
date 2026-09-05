import { CheckCircle2, Eye, Play, Trash2, Edit3 } from "lucide-react";
import type { Task } from "../../../types/task";
import { TaskStatus } from "../../../types/task";
import StatusBadge from "../common/StatusBadge";
import PriorityBadge from "../common/PriorityBadge";
import DueDateBadge from "../common/DueDateBadge";

interface TaskCardListProps {
  tasks: Task[];
  isLead: boolean;
  onViewTask: (task: Task) => void;
  onEditTask?: (task: Task) => void;
  onDeleteTask?: (task: Task) => void;
  onUpdateStatus?: (taskId: string, status: TaskStatus) => void;
  statusUpdatingId?: string | null;
}

const TaskCardList = ({
  tasks,
  isLead,
  onViewTask,
  onEditTask,
  onDeleteTask,
  onUpdateStatus,
  statusUpdatingId,
}: TaskCardListProps) => {
  return (
    <div className="grid grid-cols-1 gap-4 md:hidden">
      {tasks.map((task) => {
        const isUpdating = statusUpdatingId === task.id;

        return (
          <div
            key={task.id}
            className="flex flex-col justify-between rounded-2xl border border-neutral-200 bg-white p-4 shadow-xs transition hover:shadow-md"
          >
            <div>
              {/* Badges & Date */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-100 pb-3">
                <div className="flex items-center gap-1.5">
                  <PriorityBadge priority={task.priority} size="sm" />
                  <StatusBadge status={task.status} size="sm" />
                </div>
                <DueDateBadge dueDate={task.dueDate} status={task.status} />
              </div>

              {/* Title & Description */}
              <div className="mt-3">
                <h4
                  onClick={() => onViewTask(task)}
                  className="font-bold text-neutral-900 cursor-pointer hover:text-emerald-600"
                >
                  {task.title}
                </h4>
                <p className="mt-1 line-clamp-2 text-xs text-neutral-500">
                  {task.description}
                </p>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-4 flex items-center justify-between border-t border-neutral-100 pt-3">
              <button
                type="button"
                onClick={() => onViewTask(task)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-neutral-600 hover:text-neutral-900"
              >
                <Eye className="h-3.5 w-3.5" />
                <span>Details</span>
              </button>

              <div className="flex items-center gap-2">
                {/* Member Workflow Actions */}
                {!isLead && onUpdateStatus && (
                  <>
                    {task.status === TaskStatus.TODO && (
                      <button
                        type="button"
                        disabled={isUpdating}
                        onClick={() =>
                          onUpdateStatus(task.id, TaskStatus.IN_PROGRESS)
                        }
                        className="inline-flex items-center gap-1 rounded-lg bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 border border-amber-200 transition hover:bg-amber-100 disabled:opacity-50"
                      >
                        <Play className="h-3 w-3" />
                        <span>Start</span>
                      </button>
                    )}

                    {task.status === TaskStatus.IN_PROGRESS && (
                      <button
                        type="button"
                        disabled={isUpdating}
                        onClick={() =>
                          onUpdateStatus(task.id, TaskStatus.COMPLETED)
                        }
                        className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1 text-xs font-semibold text-white shadow-xs transition hover:bg-emerald-700 disabled:opacity-50"
                      >
                        <CheckCircle2 className="h-3 w-3" />
                        <span>Complete</span>
                      </button>
                    )}
                  </>
                )}

                {/* Lead Edit & Delete */}
                {isLead && (
                  <>
                    {onEditTask && (
                      <button
                        type="button"
                        onClick={() => onEditTask(task)}
                        className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
                        title="Edit Task"
                        aria-label="Edit task"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                    )}

                    {onDeleteTask && (
                      <button
                        type="button"
                        onClick={() => onDeleteTask(task)}
                        className="rounded-lg p-1.5 text-neutral-400 hover:bg-rose-50 hover:text-rose-600"
                        title="Delete Task"
                        aria-label="Delete task"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TaskCardList;
