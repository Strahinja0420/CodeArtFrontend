import api from "./client";

export const authService = {
  login: async (data: any) => {
    return await api.post("/auth/login", data);
  },
  register: async (data: any) => {
    return await api.post("/auth/register", data);
  },
  getProfile: async () => {
    return await api.get("/auth/private");
  },
};
