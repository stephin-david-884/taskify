import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { API_ROUTES } from "../../constants/api.routes";
import type { AxiosError } from "axios";
import type { AuthState, GetLeadsResponse, LoginPayload, LoginResponse, RefreshTokenResponse, RegisterPayload, RegisterResponse, User } from "../../types/user";
import api from "../../lib/axios";

const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    initialized: false,
    leads: [],
};

export const registerUser = createAsyncThunk<
    RegisterResponse,
    RegisterPayload,
    { rejectValue: string }
>(
    "auth/register",
    async (data, { rejectWithValue }) => {
        try {
            const response = await api.post(
                API_ROUTES.AUTH.REGISTER,
                data
            );

            if (!response.data.success) {
                return rejectWithValue(
                    response.data.message || "Registration failed"
                );
            }

            return {
                user: response.data.data.user,
            };
        } catch (error) {
            const err = error as AxiosError<{ message: string }>;

            return rejectWithValue(
                err.response?.data?.message || "Registration failed"
            );
        }
    }
);

export const loginUser = createAsyncThunk<
    LoginResponse,
    LoginPayload,
    { rejectValue: string }
>(
    "auth/login",
    async (data, { rejectWithValue }) => {
        try {
            const response = await api.post(
                API_ROUTES.AUTH.LOGIN,
                data
            );

            if (!response.data.success) {
                return rejectWithValue(
                    response.data.message || "Login failed"
                );
            }

            return {
                user: response.data.data.user,
            };
        } catch (error) {
            const err = error as AxiosError<{ message: string }>;

            return rejectWithValue(
                err.response?.data?.message || "Login failed"
            );
        }
    }
);

export const refreshToken = createAsyncThunk<
    RefreshTokenResponse,
    void,
    { rejectValue: string }
>(
    "auth/refreshToken",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.post(
                API_ROUTES.AUTH.REFRESH
            );

            if (!response.data.success) {
                return rejectWithValue(
                    response.data.message || "Session refresh failed"
                );
            }

            return {
                accessToken: response.data.data.accessToken,
                refreshToken: response.data.data.refreshToken,
                user: response.data.data.user,
            };
        } catch (error) {
            const err = error as AxiosError<{ message: string }>;

            return rejectWithValue(
                err.response?.data?.message || "Session refresh failed"
            );
        }
    }
);

export const getCurrentUser = createAsyncThunk<
    User | null,
    void,
    { rejectValue: string }
>(
    "auth/getCurrentUser",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get(
                API_ROUTES.AUTH.GET_ME
            );

            if (!response.data.success) {
                return null;
            }

            return response.data.data?.user ?? null;
        } catch (error) {
            const err = error as AxiosError<{ message: string }>;

            if (err.response?.status === 401) {
                return null;
            }

            return rejectWithValue(
                err.response?.data?.message || "Failed to fetch current user"
            );
        }
    }
);

export const logoutUser = createAsyncThunk<
    void,
    void,
    { rejectValue: string }
>(
    "auth/logout",
    async (_, { rejectWithValue }) => {
        try {
            await api.post(API_ROUTES.AUTH.LOGOUT);
        } catch (error) {
            const err = error as AxiosError<{ message: string }>;

            return rejectWithValue(
                err.response?.data?.message || "Logout failed"
            );
        }
    }
);

export const getLeads = createAsyncThunk<
    GetLeadsResponse,
    void,
    { rejectValue: string }
>(
    "auth/getLeads",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get(
                API_ROUTES.AUTH.GET_LEADS
            );

            if (!response.data.success) {
                return rejectWithValue(
                    response.data.message || "Failed to fetch leads"
                );
            }

            return {
                leads: response.data.data.leads,
            };
        } catch (error) {
            const err = error as AxiosError<{ message: string }>;

            return rejectWithValue(
                err.response?.data?.message || "Failed to fetch leads"
            );
        }
    }
);

const authSlice = createSlice({
    name: "auth",
    initialState,

    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.isAuthenticated = true;
                state.initialized = true;
            })

            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Registration failed";
            })

            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.isAuthenticated = true;
                state.initialized = true;
            })

            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Login failed";
            })

            .addCase(refreshToken.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(refreshToken.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.isAuthenticated = true;
                state.initialized = true;
            })

            .addCase(refreshToken.rejected, (state) => {
                state.loading = false;
                state.user = null;
                state.isAuthenticated = false;
                state.initialized = true;
            })

            .addCase(getCurrentUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(getCurrentUser.fulfilled, (state, action) => {
                state.loading = false;
                state.initialized = true;

                if (action.payload) {
                    state.user = action.payload;
                    state.isAuthenticated = true;
                } else {
                    state.user = null;
                    state.isAuthenticated = false;
                }
            })

            .addCase(getCurrentUser.rejected, (state, action) => {
                state.loading = false;
                state.initialized = true;
                state.user = null;
                state.isAuthenticated = false;
                state.error = action.payload || "Failed to fetch current user";
            })

            .addCase(logoutUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(logoutUser.fulfilled, (state) => {
                state.loading = false;
                state.user = null;
                state.isAuthenticated = false;
                state.initialized = true;
            })

            .addCase(logoutUser.rejected, (state, action) => {
                state.loading = false;

                state.user = null;
                state.isAuthenticated = false;
                state.initialized = true;

                state.error = action.payload || "Logout failed";
            })

            .addCase(getLeads.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(getLeads.fulfilled, (state, action) => {
                state.loading = false;
                state.leads = action.payload.leads;
            })

            .addCase(getLeads.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to fetch leads";
            })
    },
});

export const { clearError } = authSlice.actions;

export default authSlice.reducer;