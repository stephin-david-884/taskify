export const API_ROUTES = {
    AUTH: {
        REFRESH: "/auth/refresh",
        REGISTER: "/auth/register",
        GET_ME: "/auth/me",
        LOGOUT: "/auth/logout",
        LOGIN: "/auth/login",
        GET_LEADS: "/auth/leads",
        GET_TEAM_MEMBERS: "/auth/team-members",
    },
    TASK: {
        CREATE: "/tasks",
        GET_ALL: "/tasks",
        GET_BY_ID: (id: string) => `/tasks/${id}`,
        UPDATE: (id: string) => `/tasks/${id}`,
        UPDATE_STATUS: (id: string) => `/tasks/${id}/status`,
        DELETE: (id: string) => `/tasks/${id}`,
        STATISTICS: "/tasks/statistics",
    },
};