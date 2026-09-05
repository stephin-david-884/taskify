import { useState } from "react";
import { AlertTriangle, X } from "lucide-react";
import toast from "react-hot-toast";

import { useTask } from "../../../hooks/useTask";
import type { Task } from "../../../types/task";
import Spinner from "../common/Spinner";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  task: Task | null;
  onClose: () => void;
}

const ConfirmDeleteModal = ({
  isOpen,
  task,
  onClose,
}: ConfirmDeleteModalProps) => {
  const { deleteTask } = useTask();
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen || !task) return null;

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteTask(task.id);
      toast.success("Task deleted successfully");
      onClose();
    } catch (err: unknown) {
      const msg =
        typeof err === "string"
          ? err
          : (err as { message?: string })?.message || "Failed to delete task";
      toast.error(msg);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl transition-all z-10 border border-neutral-200 text-center">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 border border-rose-100">
          <AlertTriangle className="h-6 w-6" />
        </div>

        <h3 className="mt-4 text-lg font-bold text-neutral-900">
          Delete Task?
        </h3>

        <p className="mt-2 text-sm text-neutral-500">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-neutral-900">"{task.title}"</span>
          ? This action cannot be undone.
        </p>

        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-sm font-semibold text-neutral-600 transition hover:bg-neutral-50"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isDeleting}
            onClick={handleDelete}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isDeleting ? <Spinner /> : "Delete Task"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
