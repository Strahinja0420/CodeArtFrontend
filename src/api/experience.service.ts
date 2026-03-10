import api from "./client";

export const experienceService = {
  getAll: async () => {
    return await api.get("/experience");
  },
  getMyExperiences: async () => {
    return await api.get("/experience/me");
  },
  getById: async (id: string) => {
    return await api.get(`/experience/${id}`);
  },
  create: async (data: FormData) => {
    return await api.post("/experience", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  uploadThumbnail: async (id: string, file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return await api.post(`/experience/${id}/thumbnail`, formData);
  },
  uploadAudio: async (id: string, file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return await api.post(`/experience/${id}/audio`, formData);
  },
  uploadModel: async (id: string, file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return await api.post(`/experience/${id}/model`, formData);
  },
  delete: async (id: string) => {
    return await api.delete(`/experience/${id}`);
  },
  update: async (id: string, data: object) => {
    return await api.patch(`/experience/${id}`, data);
  },
  regenerateQR: async (id: string) => {
    return await api.post(`/experience/${id}/qr-code/regenerate`);
  },
  recordScan: async (id: string) => {
    return await api.post(`/experience/${id}/scan`, {});
  },
  addFeedback: async (
    id: string,
    data: { rating: number; comment?: string },
  ) => {
    return await api.post(`/experience/${id}/feedback`, data);
  },
};
