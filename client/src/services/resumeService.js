import api from "./api";

export const uploadResume = async (data) => {
  const response = await api.post("/resume/upload", data);
  return response.data;
};

export const getResumeHistory = async () => {
  const response = await api.get("/resume/history");
  return response.data;
};

