import { ArrowRight, ListTodo } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Task } from "../../../types/task";
import StatusBadge from "../common/StatusBadge";
import PriorityBadge from "../common/PriorityBadge";
import DueDateBadge from "../common/DueDateBadge";

interface RecentTasksSectionProps {
  tasks: Task[];
  isLead?: boolean;
}

const RecentTasksSection = ({
  tasks,
  isLead,
}: RecentTasksSectionProps) => {
  const navigate = useNavigate();
  const recentTasks = tasks.slice(0, 5);

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs">
      <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
        <div>
          <h3 className="text-base font-bold text-neutral-900">
            {isLead ? "Recent Team Tasks" : "Recent Assigned Tasks"}
          </h3>
          <p className="text-xs text-neutral-500">
            Latest task updates in your workspace
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/tasks")}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 transition-colors hover:text-emerald-700 hover:underline"
        >
          <span>View all tasks</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {recentTasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-400">
            <ListTodo className="h-5 w-5" />
          </div>
          <p className="mt-2 text-sm font-medium text-neutral-600">
            No recent tasks
          </p>
          <p className="text-xs text-neutral-400">
            Tasks will appear here once created
          </p>
        </div>
      ) : (
        <div className="mt-3 divide-y divide-neutral-100">
          {recentTasks.map((task) => (
            <div
              key={task.id}
              onClick={() => navigate("/tasks")}
              className="group flex flex-col gap-2 py-3 transition-colors hover:bg-neutral-50/80 px-2 rounded-xl sm:flex-row sm:items-center sm:justify-between cursor-pointer"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-neutral-900 group-hover:text-emerald-600">
                  {task.title}
                </p>
                <p className="truncate text-xs text-neutral-500 line-clamp-1">
                  {task.description}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <PriorityBadge priority={task.priority} size="sm" />
                <StatusBadge status={task.status} size="sm" />
                <DueDateBadge dueDate={task.dueDate} status={task.status} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentTasksSection;
