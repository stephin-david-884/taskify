import { useEffect, useMemo, useState } from "react";
import { AlertCircle, ListTodo, Plus } from "lucide-react";
import toast from "react-hot-toast";

import { useAuth } from "../../../hooks/useAuth";
import { useTask } from "../../../hooks/useTask";
import type { Task as TaskType } from "../../../types/task";
import { TaskPriority, TaskStatus } from "../../../types/task";

import EmptyState from "../../components/common/EmptyState";
import { TableRowSkeleton } from "../../components/common/SkeletonLoader";
import TaskFilterBar from "../../components/tasks/TaskFilterBar";
import TaskTable from "../../components/tasks/TaskTable";
import TaskCardList from "../../components/tasks/TaskCardList";
import CreateTaskModal from "../../components/tasks/CreateTaskModal";
import EditTaskModal from "../../components/tasks/EditTaskModal";
import ConfirmDeleteModal from "../../components/tasks/ConfirmDeleteModal";
import TaskDetailsModal from "../../components/tasks/TaskDetailsModal";

const TaskPage = () => {
  const { user } = useAuth();
  const { tasks, loading, error, getTasks, updateTaskStatus } = useTask();

  const isLead = user?.role === "LEAD";

  // Filter & Sort State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [selectedPriority, setSelectedPriority] = useState("ALL");
  const [sortBy, setSortBy] = useState("DUE_DATE");

  // Modal Control State
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskType | null>(null);
  const [deletingTask, setDeletingTask] = useState<TaskType | null>(null);
  const [viewingTask, setViewingTask] = useState<TaskType | null>(null);

  // Status update loading tracking
  const [statusUpdatingId, setStatusUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    getTasks().catch(() => {});
  }, [getTasks]);

  // Handle member status workflow update
  const handleUpdateStatus = async (taskId: string, newStatus: TaskStatus) => {
    try {
      setStatusUpdatingId(taskId);
      await updateTaskStatus({ taskId, status: newStatus });
      toast.success(
        newStatus === TaskStatus.COMPLETED
          ? "Task marked as completed!"
          : "Task status updated!"
      );
    } catch (err: unknown) {
      const msg =
        typeof err === "string"
          ? err
          : (err as { message?: string })?.message || "Failed to update status";
      toast.error(msg);
    } finally {
      setStatusUpdatingId(null);
    }
  };

  // Filtered & Sorted Tasks
  const filteredTasks = useMemo(() => {
    //Member sees assigned tasks and Lead sees all team tasks
    let list = isLead
      ? [...tasks]
      : tasks.filter((t) => t.assignedTo === user?.id);

    //Search query filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      list = list.filter(
        (t) =>
          t.title.toLowerCase().includes(query) ||
          t.description.toLowerCase().includes(query)
      );
    }

    //Status filter
    if (selectedStatus !== "ALL") {
      list = list.filter((t) => t.status === selectedStatus);
    }

    //Priority filter
    if (selectedPriority !== "ALL") {
      list = list.filter((t) => t.priority === selectedPriority);
    }

    //Sorting
    list.sort((a, b) => {
      if (sortBy === "DUE_DATE") {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }

      if (sortBy === "PRIORITY") {
        const priorityRank = {
          [TaskPriority.HIGH]: 3,
          [TaskPriority.MEDIUM]: 2,
          [TaskPriority.LOW]: 1,
        };
        return priorityRank[b.priority] - priorityRank[a.priority];
      }

      if (sortBy === "TITLE") {
        return a.title.localeCompare(b.title);
      }

      return 0;
    });

    return list;
  }, [tasks, isLead, user?.id, searchQuery, selectedStatus, selectedPriority, sortBy]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-neutral-900 sm:text-2xl lg:text-3xl">
            {isLead ? "Team Tasks" : "My Assigned Tasks"}
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            {isLead
              ? "Manage, assign, and track your team's workflow."
              : "Review and progress the tasks assigned to you."}
          </p>
        </div>

        {isLead && (
          <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition-all hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 shrink-0 self-start sm:self-auto"
          >
            <Plus className="h-4 w-4" />
            <span>Create Task</span>
          </button>
        )}
      </div>

      {/* Error alert if any */}
      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs font-medium text-rose-700 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
          <span>{error}</span>
        </div>
      )}

      {/* Filter Bar */}
      <TaskFilterBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        selectedPriority={selectedPriority}
        setSelectedPriority={setSelectedPriority}
        sortBy={sortBy}
        setSortBy={setSortBy}
        isLead={isLead}
        onCreateTask={() => setIsCreateOpen(true)}
      />

      {/* Task Presentation Section */}
      {loading && !tasks.length ? (
        <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-xs space-y-2">
          <TableRowSkeleton />
          <TableRowSkeleton />
          <TableRowSkeleton />
          <TableRowSkeleton />
        </div>
      ) : filteredTasks.length === 0 ? (
        <EmptyState
          title={
            searchQuery || selectedStatus !== "ALL" || selectedPriority !== "ALL"
              ? "No matching tasks"
              : isLead
              ? "No tasks yet"
              : "No tasks assigned"
          }
          description={
            searchQuery || selectedStatus !== "ALL" || selectedPriority !== "ALL"
              ? "Try adjusting your search query or filter options."
              : isLead
              ? "Create your first task and assign it to a team member."
              : "You don't have any tasks assigned to you right now."
          }
          icon={ListTodo}
          actionLabel={isLead ? "Create Task" : undefined}
          onAction={isLead ? () => setIsCreateOpen(true) : undefined}
        />
      ) : (
        <>
          {/* Desktop Table View */}
          <TaskTable
            tasks={filteredTasks}
            isLead={isLead}
            onViewTask={(task) => setViewingTask(task)}
            onEditTask={(task) => setEditingTask(task)}
            onDeleteTask={(task) => setDeletingTask(task)}
            onUpdateStatus={handleUpdateStatus}
            statusUpdatingId={statusUpdatingId}
          />

          {/* Mobile Stacked Card View */}
          <TaskCardList
            tasks={filteredTasks}
            isLead={isLead}
            onViewTask={(task) => setViewingTask(task)}
            onEditTask={(task) => setEditingTask(task)}
            onDeleteTask={(task) => setDeletingTask(task)}
            onUpdateStatus={handleUpdateStatus}
            statusUpdatingId={statusUpdatingId}
          />
        </>
      )}

      {/* Modals */}
      <CreateTaskModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />

      <EditTaskModal
        isOpen={!!editingTask}
        task={editingTask}
        onClose={() => setEditingTask(null)}
      />

      <ConfirmDeleteModal
        isOpen={!!deletingTask}
        task={deletingTask}
        onClose={() => setDeletingTask(null)}
      />

      <TaskDetailsModal
        isOpen={!!viewingTask}
        task={viewingTask}
        onClose={() => setViewingTask(null)}
      />
    </div>
  );
};

export default TaskPage;
