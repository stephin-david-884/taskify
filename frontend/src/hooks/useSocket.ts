import { useEffect } from "react";
import { useDispatch } from "react-redux";

import type { AppDispatch } from "../redux/store";
import { getSocket } from "../lib/socket";
import { useAuth } from "./useAuth";
import { useTask } from "./useTask";
import {
  taskCreated,
  taskDeleted,
  taskUpdated,
} from "../redux/features/taskSlice";
import type { Task } from "../types/task";

export const useSocket = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated } = useAuth();
  const { getTaskStatistics } = useTask();

  useEffect(() => {
    if (!isAuthenticated) return;

    const socket = getSocket();

    if (!socket.connected) {
      socket.connect();
    }

    const handleTaskCreated = (task: Task) => {
      dispatch(taskCreated(task));
      getTaskStatistics().catch(() => {});
    };

    const handleTaskUpdated = (task: Task) => {
      dispatch(taskUpdated(task));
      getTaskStatistics().catch(() => {});
    };

    const handleTaskStatusUpdated = (task: Task) => {
      dispatch(taskUpdated(task));
      getTaskStatistics().catch(() => {});
    };

    const handleTaskDeleted = (payload: { taskId: string }) => {
      dispatch(taskDeleted(payload));
      getTaskStatistics().catch(() => {});
    };

    socket.on("task:created", handleTaskCreated);
    socket.on("task:updated", handleTaskUpdated);
    socket.on("task:status-updated", handleTaskStatusUpdated);
    socket.on("task:deleted", handleTaskDeleted);

    return () => {
      socket.off("task:created", handleTaskCreated);
      socket.off("task:updated", handleTaskUpdated);
      socket.off("task:status-updated", handleTaskStatusUpdated);
      socket.off("task:deleted", handleTaskDeleted);
    };
  }, [isAuthenticated, dispatch, getTaskStatistics]);
};
