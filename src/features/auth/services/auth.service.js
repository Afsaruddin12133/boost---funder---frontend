import api from "@/lib/api";

export const authService = {
  login: (email, password) =>
    api.post("/auth/login", { email, password }),

  logout: () =>
    api.post("/auth/logout"),

  register: (payload) =>
    api.post("/auth/register", payload),

  getProfile: () =>
    api.get("/auth/me"),
};
