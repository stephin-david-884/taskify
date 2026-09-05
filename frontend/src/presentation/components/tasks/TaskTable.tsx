import { CheckCircle2, Eye, Play, Trash2, Edit3 } from "lucide-react";
import type { Task } from "../../../types/task";
import { TaskStatus } from "../../../types/task";
import StatusBadge from "../common/StatusBadge";
import PriorityBadge from "../common/PriorityBadge";
import DueDateBadge from "../common/DueDateBadge";

interface TaskTableProps {
  tasks: Task[];
  isLead: boolean;
  onViewTask: (task: Task) => void;
  onEditTask?: (task: Task) => void;
  onDeleteTask?: (task: Task) => void;
  onUpdateStatus?: (taskId: string, status: TaskStatus) => void;
  statusUpdatingId?: string | null;
}

const TaskTable = ({
  tasks,
  isLead,
  onViewTask,
  onEditTask,
  onDeleteTask,
  onUpdateStatus,
  statusUpdatingId,
}: TaskTableProps) => {
  return (
    <div className="hidden overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-xs md:block">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-neutral-600">
          <thead className="border-b border-neutral-200 bg-neutral-50/80 text-xs font-semibold uppercase tracking-wider text-neutral-500">
            <tr>
              <th scope="col" className="px-6 py-4">Task Details</th>
              <th scope="col" className="px-6 py-4">Priority</th>
              <th scope="col" className="px-6 py-4">Status</th>
              <th scope="col" className="px-6 py-4">Due Date</th>
              <th scope="col" className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {tasks.map((task) => {
              const isUpdating = statusUpdatingId === task.id;

              return (
                <tr
                  key={task.id}
                  className="group transition-colors hover:bg-neutral-50/80"
                >
                  {/* Task Title & Description */}
                  <td className="px-6 py-4">
                    <div className="max-w-md">
                      <button
                        type="button"
                        onClick={() => onViewTask(task)}
                        className="text-left font-semibold text-neutral-900 transition-colors group-hover:text-emerald-600 hover:underline"
                      >
                        {task.title}
                      </button>
                      <p className="mt-0.5 line-clamp-1 text-xs text-neutral-500">
                        {task.description}
                      </p>
                    </div>
                  </td>

                  {/* Priority */}
                  <td className="px-6 py-4">
                    <PriorityBadge priority={task.priority} size="sm" />
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <StatusBadge status={task.status} size="sm" />
                  </td>

                  {/* Due Date */}
                  <td className="px-6 py-4">
                    <DueDateBadge dueDate={task.dueDate} status={task.status} />
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {/* Member Workflow Actions */}
                      {!isLead && onUpdateStatus && (
                        <>
                          {task.status === TaskStatus.TODO && (
                            <button
                              type="button"
                              disabled={isUpdating}
                              onClick={() =>
                                onUpdateStatus(
                                  task.id,
                                  TaskStatus.IN_PROGRESS
                                )
                              }
                              className="inline-flex items-center gap-1 rounded-lg bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 border border-amber-200 transition hover:bg-amber-100 disabled:opacity-50"
                            >
                              <Play className="h-3 w-3" />
                              <span>Start Task</span>
                            </button>
                          )}

                          {task.status === TaskStatus.IN_PROGRESS && (
                            <button
                              type="button"
                              disabled={isUpdating}
                              onClick={() =>
                                onUpdateStatus(
                                  task.id,
                                  TaskStatus.COMPLETED
                                )
                              }
                              className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1 text-xs font-semibold text-white shadow-xs transition hover:bg-emerald-700 disabled:opacity-50"
                            >
                              <CheckCircle2 className="h-3 w-3" />
                              <span>Complete</span>
                            </button>
                          )}
                        </>
                      )}

                      {/* View Details Button */}
                      <button
                        type="button"
                        onClick={() => onViewTask(task)}
                        className="rounded-lg p-1.5 text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700"
                        title="View Details"
                        aria-label="View task details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>

                      {/* Lead Edit Button */}
                      {isLead && onEditTask && (
                        <button
                          type="button"
                          onClick={() => onEditTask(task)}
                          className="rounded-lg p-1.5 text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700"
                          title="Edit Task"
                          aria-label="Edit task"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                      )}

                      {/* Lead Delete Button */}
                      {isLead && onDeleteTask && (
                        <button
                          type="button"
                          onClick={() => onDeleteTask(task)}
                          className="rounded-lg p-1.5 text-neutral-400 transition hover:bg-rose-50 hover:text-rose-600"
                          title="Delete Task"
                          aria-label="Delete task"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaskTable;
