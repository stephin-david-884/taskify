import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import type { AppDispatch, RootState } from "../redux/store";
import {
  clearError,
  createTask,
  deleteTask,
  getTask,
  getTasks,
  getTaskStatistics,
  setCurrentTask,
  updateTask,
  updateTaskStatus,
} from "../redux/features/taskSlice";
import type {
  CreateTaskPayload,
  Task,
  UpdateTaskPayload,
  UpdateTaskStatusPayload,
} from "../types/task";

export const useTask = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { tasks, currentTask, statistics, loading, error } = useSelector(
    (state: RootState) => state.task
  );

  const handleClearError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleSetCurrentTask = useCallback(
    (task: Task | null) => {
      dispatch(setCurrentTask(task));
    },
    [dispatch]
  );

  const handleCreateTask = useCallback(
    async (data: CreateTaskPayload) => {
      return dispatch(createTask(data)).unwrap();
    },
    [dispatch]
  );

  const handleGetTasks = useCallback(async () => {
    return dispatch(getTasks()).unwrap();
  }, [dispatch]);

  const handleGetTask = useCallback(
    async (taskId: string) => {
      return dispatch(getTask(taskId)).unwrap();
    },
    [dispatch]
  );

  const handleUpdateTask = useCallback(
    async (data: UpdateTaskPayload) => {
      return dispatch(updateTask(data)).unwrap();
    },
    [dispatch]
  );

  const handleUpdateTaskStatus = useCallback(
    async (data: UpdateTaskStatusPayload) => {
      return dispatch(updateTaskStatus(data)).unwrap();
    },
    [dispatch]
  );

  const handleDeleteTask = useCallback(
    async (taskId: string) => {
      return dispatch(deleteTask(taskId)).unwrap();
    },
    [dispatch]
  );

  const handleGetTaskStatistics = useCallback(async () => {
    return dispatch(getTaskStatistics()).unwrap();
  }, [dispatch]);

  return {
    tasks,
    currentTask,
    statistics,
    loading,
    error,

    clearError: handleClearError,
    setCurrentTask: handleSetCurrentTask,

    createTask: handleCreateTask,
    getTasks: handleGetTasks,
    getTask: handleGetTask,
    updateTask: handleUpdateTask,
    updateTaskStatus: handleUpdateTaskStatus,
    deleteTask: handleDeleteTask,
    getTaskStatistics: handleGetTaskStatistics,
  };
};
