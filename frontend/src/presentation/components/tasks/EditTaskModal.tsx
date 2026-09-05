import React, { useEffect, useState } from "react";
import { AlertCircle, Calendar, X } from "lucide-react";
import toast from "react-hot-toast";

import { useAuth } from "../../../hooks/useAuth";
import { useTask } from "../../../hooks/useTask";
import type { Task } from "../../../types/task";
import { TaskPriority } from "../../../types/task";
import Spinner from "../common/Spinner";

interface EditTaskModalProps {
  isOpen: boolean;
  task: Task | null;
  onClose: () => void;
}

const EditTaskModal = ({ isOpen, task, onClose }: EditTaskModalProps) => {
  const { user, teamMembers, fetchTeamMembers } = useAuth();
  const { updateTask } = useTask();

  const [prevTaskId, setPrevTaskId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TaskPriority>(TaskPriority.MEDIUM);
  const [assignedTo, setAssignedTo] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchTeamMembers().catch(() => {});
    }
  }, [isOpen, fetchTeamMembers]);

  // Sync form state when task prop changes (React recommended pattern without useEffect)
  if (task && task.id !== prevTaskId) {
    setPrevTaskId(task.id);
    setTitle(task.title || "");
    setDescription(task.description || "");
    setPriority(task.priority || TaskPriority.MEDIUM);
    setAssignedTo(task.assignedTo || user?.id || "");
    setFormError(null);

    if (task.dueDate) {
      const parsed = new Date(task.dueDate);
      if (!isNaN(parsed.getTime())) {
        setDueDate(parsed.toISOString().split("T")[0]);
      } else {
        setDueDate("");
      }
    } else {
      setDueDate("");
    }
  }

  if (!isOpen || !task) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!title.trim()) {
      setFormError("Title cannot be empty");
      return;
    }

    if (!description.trim()) {
      setFormError("Description cannot be empty");
      return;
    }

    try {
      setIsSubmitting(true);
      await updateTask({
        taskId: task.id,
        title: title.trim(),
        description: description.trim(),
        priority,
        assignedTo: assignedTo.trim() || undefined,
        dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
      });

      toast.success("Task updated successfully!");
      onClose();
    } catch (err: unknown) {
      const errorMessage =
        typeof err === "string"
          ? err
          : (err as { message?: string })?.message || "Failed to update task";
      setFormError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl transition-all z-10 border border-neutral-200">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
          <div>
            <h3 className="text-lg font-bold text-neutral-900">Edit Task</h3>
            <p className="text-xs text-neutral-500">Update task details</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {formError && (
          <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-medium text-rose-700 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-rose-500 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
              Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-neutral-200 px-3.5 py-2 text-sm text-neutral-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
              Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-neutral-200 px-3.5 py-2 text-sm text-neutral-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              required
            />
          </div>

          {/* Priority & Due Date */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2 text-sm text-neutral-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              >
                <option value={TaskPriority.LOW}>Low Priority</option>
                <option value={TaskPriority.MEDIUM}>Medium Priority</option>
                <option value={TaskPriority.HIGH}>High Priority</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                Due Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 px-3.5 py-2 text-sm text-neutral-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
                <Calendar className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
              </div>
            </div>
          </div>

          {/* Assignee Member */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
              Assignee Member
            </label>
            <select
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2 text-sm text-neutral-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value="">Select Team Member</option>
              {teamMembers.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name} ({member.email})
                </option>
              ))}
            </select>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-100">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-neutral-200 px-4 py-2 text-sm font-semibold text-neutral-600 transition hover:bg-neutral-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2 text-sm font-semibold text-white shadow-xs transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {isSubmitting ? <Spinner /> : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTaskModal;
