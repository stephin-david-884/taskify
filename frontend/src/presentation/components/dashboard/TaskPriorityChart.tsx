import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface TaskPriorityChartProps {
  low: number;
  medium: number;
  high: number;
}

const COLORS = ["#64748b", "#3b82f6", "#f43f5e"];

const TaskPriorityChart = ({
  low,
  medium,
  high,
}: TaskPriorityChartProps) => {
  const data = [
    { name: "Low", value: low },
    { name: "Medium", value: medium },
    { name: "High", value: high },
  ];

  const total = low + medium + high;

  return (
    <div className="flex flex-col rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs">
      <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
        <div>
          <h3 className="text-base font-bold text-neutral-900">Task Priority</h3>
          <p className="text-xs text-neutral-500">Breakdown by priority level</p>
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
            <BarChart
              data={data}
              margin={{ top: 20, right: 10, left: -20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#64748b" }}
              />
              <YAxis
                allowDecimals={false}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#64748b" }}
              />
              <Tooltip
                cursor={{ fill: "rgba(241, 245, 249, 0.6)" }}
                contentStyle={{
                  backgroundColor: "#ffffff",
                  borderColor: "#e5e7eb",
                  borderRadius: "0.75rem",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  fontSize: "12px",
                  fontWeight: "600",
                }}
              />
              <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={40}>
                {data.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default TaskPriorityChart;
