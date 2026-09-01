export const ROUTES = {
  AUTH: {
    REGISTER: "/register",
    LOGIN: "/login",
    REFRESH_TOKEN: "/refresh",
    LOGOUT: "/logout",
    GET_ME: "/me",
    GET_LEADS: "/leads",
  },

  TASK: {
    ROOT: "/",
    STATS: "/stats",
  },
} as const;