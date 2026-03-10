import api from "./client";

export const userService = {
  getById: async (id: string) => {
    return await api.get(`/user/${id}`);
  },
  update: async (id: string, data: any) => {
    return await api.patch(`/user/${id}`, data);
  },
  updatePassword: async (
    id: string,
    data: { currentPassword?: string; newPassword?: string },
  ) => {
    return await api.patch(`/user/${id}/password`, data);
  },
  uploadAvatar: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return await api.post("/user/avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  uploadQrLogo: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return await api.post("/user/qr-logo", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};
