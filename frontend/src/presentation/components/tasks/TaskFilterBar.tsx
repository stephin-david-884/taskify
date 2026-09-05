import { Plus, Search, SlidersHorizontal } from "lucide-react";
import { TaskPriority, TaskStatus } from "../../../types/task";

interface TaskFilterBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
  selectedPriority: string;
  setSelectedPriority: (priority: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  isLead?: boolean;
  onCreateTask?: () => void;
}

const TaskFilterBar = ({
  searchQuery,
  setSearchQuery,
  selectedStatus,
  setSelectedStatus,
  selectedPriority,
  setSelectedPriority,
  sortBy,
  setSortBy,
  isLead,
  onCreateTask,
}: TaskFilterBarProps) => {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-neutral-200 bg-white p-4 shadow-xs lg:flex-row lg:items-center lg:justify-between">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search tasks by title or description..."
          className="w-full rounded-xl border border-neutral-200 bg-neutral-50/50 pl-10 pr-4 py-2 text-sm text-neutral-900 placeholder-neutral-400 transition focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
        />
      </div>

      {/* Filter and Action Controls */}
      <div className="flex flex-wrap items-center gap-2.5 sm:flex-nowrap">
        {/* Status Dropdown */}
        <div className="flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-3 py-1.5">
          <SlidersHorizontal className="h-3.5 w-3.5 text-neutral-400" />
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            aria-label="Filter by task status"
            className="bg-transparent text-xs font-medium text-neutral-700 outline-none cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value={TaskStatus.TODO}>Todo</option>
            <option value={TaskStatus.IN_PROGRESS}>In Progress</option>
            <option value={TaskStatus.COMPLETED}>Completed</option>
          </select>
        </div>

        {/* Priority Dropdown */}
        <div className="flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-3 py-1.5">
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            aria-label="Filter by task priority"
            className="bg-transparent text-xs font-medium text-neutral-700 outline-none cursor-pointer"
          >
            <option value="ALL">All Priorities</option>
            <option value={TaskPriority.LOW}>Low Priority</option>
            <option value={TaskPriority.MEDIUM}>Medium Priority</option>
            <option value={TaskPriority.HIGH}>High Priority</option>
          </select>
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-3 py-1.5">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            aria-label="Sort tasks by"
            className="bg-transparent text-xs font-medium text-neutral-700 outline-none cursor-pointer"
          >
            <option value="DUE_DATE">Sort by Due Date</option>
            <option value="PRIORITY">Sort by Priority</option>
            <option value="TITLE">Sort by Title</option>
          </select>
        </div>

        {/* Create Task Button for Lead */}
        {isLead && onCreateTask && (
          <button
            type="button"
            onClick={onCreateTask}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-xs transition-all hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 sm:text-sm shrink-0"
          >
            <Plus className="h-4 w-4" />
            <span>Create Task</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default TaskFilterBar;
