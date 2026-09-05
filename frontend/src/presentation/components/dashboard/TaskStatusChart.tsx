import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface TaskStatusChartProps {
  todo: number;
  inProgress: number;
  completed: number;
}

const COLORS = ["#94a3b8", "#f59e0b", "#10b981"];

const TaskStatusChart = ({
  todo,
  inProgress,
  completed,
}: TaskStatusChartProps) => {
  const data = [
    { name: "Todo", value: todo },
    { name: "In Progress", value: inProgress },
    { name: "Completed", value: completed },
  ];

  const total = todo + inProgress + completed;

  return (
    <div className="flex flex-col rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs">
      <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
        <div>
          <h3 className="text-base font-bold text-neutral-900">Task Status</h3>
          <p className="text-xs text-neutral-500">
            Distribution across workflows
          </p>
        </div>
        <span className="rounded-lg bg-neutral-100 px-2.5 py-1 text-xs font-semibold text-neutral-600">
          {total} Total
        </span>
      </div>

      <div className="mt-4 h-64 w-full">
        {total === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center text-sm text-neutral-400">
            <span>No task data available</span>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={4}
                dataKey="value"
              >
                {data.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  borderColor: "#e5e7eb",
                  borderRadius: "0.75rem",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  fontSize: "12px",
                  fontWeight: "600",
                }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                wrapperStyle={{ fontSize: "12px", paddingTop: "12px" }}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default TaskStatusChart;
