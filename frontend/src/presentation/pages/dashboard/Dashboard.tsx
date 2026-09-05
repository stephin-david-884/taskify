import { useEffect } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  ListTodo,
} from "lucide-react";

import { useAuth } from "../../../hooks/useAuth";
import { useTask } from "../../../hooks/useTask";
import StatCard from "../../components/common/StatCard";
import {
  ChartSkeleton,
  StatCardSkeleton,
} from "../../components/common/SkeletonLoader";
import DashboardHeader from "../../components/dashboard/DashboardHeader";
import TaskStatusChart from "../../components/dashboard/TaskStatusChart";
import TaskPriorityChart from "../../components/dashboard/TaskPriorityChart";
import TaskOverviewChart from "../../components/dashboard/TaskOverviewChart";
import RecentTasksSection from "../../components/dashboard/RecentTasksSection";

const Dashboard = () => {
  const { user } = useAuth();
  const {
    tasks,
    statistics,
    loading,
    error,
    getTasks,
    getTaskStatistics,
  } = useTask();

  useEffect(() => {
    getTasks().catch(() => {});
    getTaskStatistics().catch(() => {});
  }, [getTasks, getTaskStatistics]);

  const isLead = user?.role === "LEAD";

  // Filter tasks for member role if needed
  const displayTasks = isLead
    ? tasks
    : tasks.filter((t) => t.assignedTo === user?.id);

  // Compute stat metrics safely from API statistics or fallback to tasks array
  const total = statistics?.total ?? displayTasks.length;

  const todoCount =
    statistics?.byStatus?.todo ??
    displayTasks.filter((t) => t.status === "TODO").length;

  const inProgressCount =
    statistics?.byStatus?.inProgress ??
    displayTasks.filter((t) => t.status === "IN_PROGRESS").length;

  const completedCount =
    statistics?.byStatus?.completed ??
    displayTasks.filter((t) => t.status === "COMPLETED").length;

  const lowPriorityCount =
    statistics?.byPriority?.low ??
    displayTasks.filter((t) => t.priority === "LOW").length;

  const mediumPriorityCount =
    statistics?.byPriority?.medium ??
    displayTasks.filter((t) => t.priority === "MEDIUM").length;

  const highPriorityCount =
    statistics?.byPriority?.high ??
    displayTasks.filter((t) => t.priority === "HIGH").length;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const overdueCount =
    statistics?.overdue ??
    displayTasks.filter((t) => {
      if (!t.dueDate || t.status === "COMPLETED") return false;
      const parsed = new Date(t.dueDate);
      return !isNaN(parsed.getTime()) && parsed < today;
    }).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <DashboardHeader />

      {/* Error state alert if any */}
      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs font-medium text-rose-700 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
          <span>{error}</span>
        </div>
      )}

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {loading && !tasks.length ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          <>
            <StatCard
              title={isLead ? "Total Tasks" : "My Tasks"}
              value={total}
              subtitle={isLead ? "Tasks in team workspace" : "Assigned to you"}
              icon={ListTodo}
              variant="emerald"
            />
            <StatCard
              title="Todo"
              value={todoCount}
              subtitle="Waiting to be started"
              icon={ListTodo}
              variant="slate"
            />
            <StatCard
              title="In Progress"
              value={inProgressCount}
              subtitle="Currently being worked on"
              icon={Clock}
              variant="amber"
            />
            <StatCard
              title="Completed"
              value={completedCount}
              subtitle="Successfully finished"
              icon={CheckCircle2}
              variant="emerald"
            />
          </>
        )}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {loading && !tasks.length ? (
          <>
            <ChartSkeleton />
            <ChartSkeleton />
            <ChartSkeleton />
          </>
        ) : (
          <>
            <TaskStatusChart
              todo={todoCount}
              inProgress={inProgressCount}
              completed={completedCount}
            />
            <TaskPriorityChart
              low={lowPriorityCount}
              medium={mediumPriorityCount}
              high={highPriorityCount}
            />
            <TaskOverviewChart
              total={total}
              completed={completedCount}
              inProgress={inProgressCount}
              todo={todoCount}
              overdue={overdueCount}
            />
          </>
        )}
      </div>

      {/* Recent Tasks Section */}
      <RecentTasksSection tasks={displayTasks} isLead={isLead} />
    </div>
  );
};

export default Dashboard;
