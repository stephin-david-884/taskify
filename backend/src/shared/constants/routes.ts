export const ROUTES = {
  AUTH: {
    REGISTER: "/register",
    LOGIN: "/login",
    REFRESH_TOKEN: "/refresh",
    LOGOUT: "/logout",
    GET_ME: "/me",
    GET_LEADS: "/leads",
    GET_TEAM_MEMBERS: "/team-members",
  },

  TASK: {
    CREATE: "/",
    GET_ALL: "/",
    GET_BY_ID: "/:taskId",
    UPDATE: "/:taskId",
    UPDATE_STATUS: "/:taskId/status",
    DELETE: "/:taskId",
    STATISTICS: "/statistics",
  },
} as const;