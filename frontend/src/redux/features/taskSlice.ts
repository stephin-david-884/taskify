import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AxiosError } from "axios";

import { API_ROUTES } from "../../constants/api.routes";
import api from "../../lib/axios";
import type {
  CreateTaskPayload,
  Task,
  TaskState,
  TaskStatistics,
  UpdateTaskPayload,
  UpdateTaskStatusPayload,
} from "../../types/task";

const initialState: TaskState = {
  tasks: [],
  currentTask: null,
  statistics: null,
  loading: false,
  error: null,
};

export const createTask = createAsyncThunk<
  Task,
  CreateTaskPayload,
  { rejectValue: string }
>(
  "task/createTask",
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post(API_ROUTES.TASK.CREATE, data);

      if (!response.data.success) {
        return rejectWithValue(
          response.data.message || "Failed to create task"
        );
      }

      return response.data.data.task;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;

      return rejectWithValue(
        err.response?.data?.message || "Failed to create task"
      );
    }
  }
);

export const getTasks = createAsyncThunk<
  Task[],
  void,
  { rejectValue: string }
>(
  "task/getTasks",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(API_ROUTES.TASK.GET_ALL);

      if (!response.data.success) {
        return rejectWithValue(
          response.data.message || "Failed to fetch tasks"
        );
      }

      return response.data.data.tasks;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;

      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch tasks"
      );
    }
  }
);

export const getTask = createAsyncThunk<
  Task,
  string,
  { rejectValue: string }
>(
  "task/getTask",
  async (taskId, { rejectWithValue }) => {
    try {
      const response = await api.get(API_ROUTES.TASK.GET_BY_ID(taskId));

      if (!response.data.success) {
        return rejectWithValue(
          response.data.message || "Failed to fetch task"
        );
      }

      return response.data.data.task;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;

      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch task"
      );
    }
  }
);

export const updateTask = createAsyncThunk<
  Task,
  UpdateTaskPayload,
  { rejectValue: string }
>(
  "task/updateTask",
  async ({ taskId, ...data }, { rejectWithValue }) => {
    try {
      const response = await api.put(
        API_ROUTES.TASK.UPDATE(taskId),
        data
      );

      if (!response.data.success) {
        return rejectWithValue(
          response.data.message || "Failed to update task"
        );
      }

      return response.data.data.task;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;

      return rejectWithValue(
        err.response?.data?.message || "Failed to update task"
      );
    }
  }
);

export const updateTaskStatus = createAsyncThunk<
  Task,
  UpdateTaskStatusPayload,
  { rejectValue: string }
>(
  "task/updateTaskStatus",
  async ({ taskId, status }, { rejectWithValue }) => {
    try {
      const response = await api.patch(
        API_ROUTES.TASK.UPDATE_STATUS(taskId),
        { status }
      );

      if (!response.data.success) {
        return rejectWithValue(
          response.data.message || "Failed to update task status"
        );
      }

      return response.data.data.task;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;

      return rejectWithValue(
        err.response?.data?.message || "Failed to update task status"
      );
    }
  }
);

export const deleteTask = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>(
  "task/deleteTask",
  async (taskId, { rejectWithValue }) => {
    try {
      const response = await api.delete(API_ROUTES.TASK.DELETE(taskId));

      if (!response.data.success) {
        return rejectWithValue(
          response.data.message || "Failed to delete task"
        );
      }

      return taskId;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;

      return rejectWithValue(
        err.response?.data?.message || "Failed to delete task"
      );
    }
  }
);

export const getTaskStatistics = createAsyncThunk<
  TaskStatistics,
  void,
  { rejectValue: string }
>(
  "task/getTaskStatistics",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(API_ROUTES.TASK.STATISTICS);

      if (!response.data.success) {
        return rejectWithValue(
          response.data.message || "Failed to fetch task statistics"
        );
      }

      return response.data.data.statistics;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;

      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch task statistics"
      );
    }
  }
);

const taskSlice = createSlice({
  name: "task",
  initialState,

  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentTask: (state, action: PayloadAction<Task | null>) => {
      state.currentTask = action.payload;
    },
    taskCreated: (state, action: PayloadAction<Task>) => {
      const exists = state.tasks.some((t) => t.id === action.payload.id);
      if (!exists) {
        state.tasks.unshift(action.payload);
      }
    },
    taskUpdated: (state, action: PayloadAction<Task>) => {
      const index = state.tasks.findIndex((t) => t.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
      } else {
        state.tasks.unshift(action.payload);
      }
      if (state.currentTask?.id === action.payload.id) {
        state.currentTask = action.payload;
      }
    },
    taskDeleted: (state, action: PayloadAction<{ taskId: string }>) => {
      state.tasks = state.tasks.filter((t) => t.id !== action.payload.taskId);
      if (state.currentTask?.id === action.payload.taskId) {
        state.currentTask = null;
      }
    },
  },

  extraReducers: (builder) => {
    builder
      // createTask
      .addCase(createTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks.unshift(action.payload);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to create task";
      })

      // getTasks
      .addCase(getTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(getTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch tasks";
      })

      // getTask
      .addCase(getTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTask.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTask = action.payload;
      })
      .addCase(getTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch task";
      })

      // updateTask
      .addCase(updateTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.tasks.findIndex(
          (t) => t.id === action.payload.id
        );
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
        if (state.currentTask?.id === action.payload.id) {
          state.currentTask = action.payload;
        }
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update task";
      })

      // updateTaskStatus
      .addCase(updateTaskStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTaskStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.tasks.findIndex(
          (t) => t.id === action.payload.id
        );
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
        if (state.currentTask?.id === action.payload.id) {
          state.currentTask = action.payload;
        }
      })
      .addCase(updateTaskStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update task status";
      })

      // deleteTask
      .addCase(deleteTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = state.tasks.filter((t) => t.id !== action.payload);
        if (state.currentTask?.id === action.payload) {
          state.currentTask = null;
        }
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete task";
      })

      // getTaskStatistics
      .addCase(getTaskStatistics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTaskStatistics.fulfilled, (state, action) => {
        state.loading = false;
        state.statistics = action.payload;
      })
      .addCase(getTaskStatistics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch task statistics";
      });
  },
});

export const {
  clearError,
  setCurrentTask,
  taskCreated,
  taskUpdated,
  taskDeleted,
} = taskSlice.actions;

export default taskSlice.reducer;
