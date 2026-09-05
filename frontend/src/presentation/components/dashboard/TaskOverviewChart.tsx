import { AlertCircle, CheckCircle, Clock } from "lucide-react";

interface TaskOverviewChartProps {
  total: number;
  completed: number;
  inProgress: number;
  todo: number;
  overdue: number;
}

const TaskOverviewChart = ({
  total,
  completed,
  inProgress,
  todo,
  overdue,
}: TaskOverviewChartProps) => {
  const completionRate =
    total > 0 ? Math.round((completed / total) * 100) : 0;

  const active = inProgress + todo;

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs">
      <div>
        <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
          <div>
            <h3 className="text-base font-bold text-neutral-900">
              Task Completion Overview
            </h3>
            <p className="text-xs text-neutral-500">
              Progress rate and active workload
            </p>
          </div>
          <span className="inline-flex items-center rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
            {completionRate}% Completed
          </span>
        </div>

        {/* Progress Bar */}
        <div className="mt-5">
          <div className="flex justify-between text-xs font-medium text-neutral-600 mb-2">
            <span>Overall Completion Rate</span>
            <span>
              {completed} of {total} Tasks
            </span>
          </div>

          <div className="h-3.5 w-full overflow-hidden rounded-full bg-neutral-100 p-0.5">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all duration-500"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>
      </div>

      {/* Grid Summary */}
      <div className="mt-6 grid grid-cols-3 gap-3">
        <div className="rounded-xl bg-neutral-50 p-3 text-center border border-neutral-100">
          <div className="flex justify-center text-emerald-600 mb-1">
            <CheckCircle className="h-4 w-4" />
          </div>
          <span className="text-lg font-bold text-neutral-900">{completed}</span>
          <p className="text-[11px] font-medium text-neutral-500">Completed</p>
        </div>

        <div className="rounded-xl bg-neutral-50 p-3 text-center border border-neutral-100">
          <div className="flex justify-center text-amber-600 mb-1">
            <Clock className="h-4 w-4" />
          </div>
          <span className="text-lg font-bold text-neutral-900">{active}</span>
          <p className="text-[11px] font-medium text-neutral-500">Active Work</p>
        </div>

        <div className="rounded-xl bg-neutral-50 p-3 text-center border border-neutral-100">
          <div className="flex justify-center text-rose-600 mb-1">
            <AlertCircle className="h-4 w-4" />
          </div>
          <span className="text-lg font-bold text-neutral-900">{overdue}</span>
          <p className="text-[11px] font-medium text-neutral-500">Overdue</p>
        </div>
      </div>
    </div>
  );
};

export default TaskOverviewChart;
